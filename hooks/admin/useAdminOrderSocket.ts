"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import {
  activateSessionSocket,
  handleSessionClose,
} from "@/lib/socket-session";
import SockJS from "sockjs-client";
import {
  BrowserSessionEnded,
  handleBrowserSessionEnd,
} from "@/lib/browser-session";
export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

/**
 * STOMP over SockJS 실시간 주문 모니터링 훅
 */
export function useAdminOrderSocket() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.error("[STOMP] NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    let active = true;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refreshOrders = () => {
      if (refreshTimer !== undefined) return;
      refreshTimer = setTimeout(() => {
        refreshTimer = undefined;
        void queryClient.invalidateQueries(
          { queryKey: ["adminOrders"] },
          { cancelRefetch: false },
        );
      }, 500);
    };
    const wsUrl = `${API_URL}/ws/payment`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("✅ [STOMP] Connected");
        setStatus("connected");

        refreshOrders();
        client.subscribe("/topic/admin/orders", (message) => {
          try {
            const event = JSON.parse(message.body);
            if (
              event.eventType === "ORDER_CREATED" ||
              event.eventType === "ORDER_STATUS_CHANGED"
            ) {
              refreshOrders();
            }
          } catch (err) {
            console.error("[STOMP] Failed to parse message:", err);
          }
        });
      },

      onDisconnect: () => {
        console.log("🔌 [STOMP] Disconnected");
        setStatus("disconnected");
      },

      onStompError: (frame) => {
        console.error("❌ [STOMP] Error:", frame.headers?.message || frame);
        setStatus("disconnected");
      },

      onWebSocketClose: (event) => {
        if (!active) return;
        const ended = handleSessionClose(client, event.code);
        setStatus(ended ? "disconnected" : "reconnecting");
      },
    });

    const stopWatching = activateSessionSocket(
      client,
      () => active,
      (changed) => {
        setStatus("disconnected");
        handleBrowserSessionEnd(new BrowserSessionEnded(changed));
      },
    );

    return () => {
      active = false;
      clearTimeout(refreshTimer);
      stopWatching();
      void client.deactivate();
    };
  }, [queryClient]);

  return { status };
}
