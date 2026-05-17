"use client";

import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

interface ChatSocketStore {
  client: Client | null;
  status: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
}

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
  client: null,
  status: "disconnected",

  connect: () => {
    // 이미 연결 중이거나 연결된 경우 중복 실행 방지
    if (get().client?.active) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.error("[ChatSTOMP] NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    const wsUrl = `${API_URL}/ws/chat`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("✅ [ChatSTOMP] Connected (Zustand)");
        set({ status: "connected" });
      },

      onDisconnect: () => {
        console.log("🔌 [ChatSTOMP] Disconnected (Zustand)");
        set({ status: "disconnected" });
      },

      onStompError: (frame) => {
        console.error("❌ [ChatSTOMP] Error:", frame.headers?.message || frame);
        set({ status: "disconnected" });
      },

      onWebSocketClose: () => {
        console.log("🔄 [ChatSTOMP] WebSocket closed");
        set({ status: "reconnecting" });
      },
    });

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const { client } = get();
    if (client) {
      client.deactivate();
      set({ client: null, status: "disconnected" });
    }
  },
}));
