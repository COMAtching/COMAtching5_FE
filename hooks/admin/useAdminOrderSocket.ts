"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { AdminOrder } from "./useAdminOrders";

/* ── STOMP 이벤트 타입 ── */
interface OrderCreatedPayload {
  orderId: number;
  memberId: number;
  requestedItemName: string;
  requesterRealName: string;
  requesterUsername: string;
  optionTicketQty: number;
  matchingTicketQty: number;
  requestedPrice: number;
  expectedPrice: number;
  status: string;
  requestedAt: string;
  expiresAt: string;
}

interface OrderStatusChangedPayload {
  orderId: number;
  fromStatus: string;
  toStatus: string;
  decidedAt: string;
  decidedByAdminId: number;
  reason: string | null;
}

interface StompEvent {
  eventId: number;
  eventType: "ORDER_CREATED" | "ORDER_STATUS_CHANGED";
  occurredAt: string;
  payload: OrderCreatedPayload | OrderStatusChangedPayload;
}

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

/* ── API 응답 래퍼 ── */
interface AdminOrdersResponse {
  code: string;
  status: number;
  message: string;
  data: AdminOrder[];
}

/**
 * STOMP over SockJS 실시간 주문 모니터링 훅
 */
export function useAdminOrderSocket() {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const handleOrderCreated = useCallback(
    (payload: OrderCreatedPayload) => {
      queryClient.setQueryData<AdminOrdersResponse>(["adminOrders"], (old) => {
        if (!old) return old;

        const exists = old.data.some(
          (order) => order.requestId === payload.orderId,
        );
        if (exists) return old;

        const newOrder: AdminOrder = {
          requestId: payload.orderId,
          memberId: payload.memberId,
          requestedItemName: payload.requestedItemName,
          requesterRealName: payload.requesterRealName,
          requesterUsername: payload.requesterUsername,
          optionTicketQty: payload.optionTicketQty,
          matchingTicketQty: payload.matchingTicketQty,
          requestedPrice: payload.requestedPrice,
          expectedPrice: payload.expectedPrice,
          status: payload.status as AdminOrder["status"],
          requestedAt: payload.requestedAt,
          expiresAt: payload.expiresAt,
        };

        return {
          ...old,
          data: [newOrder, ...old.data],
        };
      });
    },
    [queryClient],
  );

  const handleOrderStatusChanged = useCallback(
    (payload: OrderStatusChangedPayload) => {
      queryClient.setQueryData<AdminOrdersResponse>(["adminOrders"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((order) =>
            order.requestId === payload.orderId
              ? {
                  ...order,
                  status: payload.toStatus as AdminOrder["status"],
                }
              : order,
          ),
        };
      });
    },
    [queryClient],
  );

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.error("[STOMP] NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    const wsUrl = `${API_URL}/ws/payment`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("✅ [STOMP] Connected");
        setStatus("connected");

        client.subscribe("/topic/admin/orders", (message) => {
          try {
            const event: StompEvent = JSON.parse(message.body);
            console.log("[STOMP] Event received:", event.eventType, event);

            switch (event.eventType) {
              case "ORDER_CREATED":
                handleOrderCreated(event.payload as OrderCreatedPayload);
                break;
              case "ORDER_STATUS_CHANGED":
                handleOrderStatusChanged(
                  event.payload as OrderStatusChangedPayload,
                );
                break;
              default:
                console.warn("[STOMP] Unknown event type:", event.eventType);
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

      onWebSocketClose: () => {
        console.log("🔄 [STOMP] WebSocket closed, reconnecting...");
        setStatus("reconnecting");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [handleOrderCreated, handleOrderStatusChanged]);

  return { status };
}
