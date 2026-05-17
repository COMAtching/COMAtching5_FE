"use client";

import { useEffect, useState, useCallback } from "react";
import { useChatSocketStore } from "@/stores/chat-socket-store";
import { IMessage } from "@stomp/stompjs";

export type ChatMessagePayload = {
  id: string;
  roomId: string;
  senderId: number;
  content: string;
  type: "TALK" | "ENTER" | "LEAVE" | "READ";
  createdAt: string;
  readCount: number;
};

export function useChatRoomSocket(roomId: string) {
  const { client, status } = useChatSocketStore();
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  const handleMessage = useCallback(
    (message: IMessage) => {
      try {
        const payload: ChatMessagePayload = JSON.parse(message.body);
        console.log(`[ChatRoom:${roomId}] New event received:`, payload);

        // TALK일 경우에만 메시지 리스트에 추가 (READ는 다른 로직 처리 가능)
        if (payload.type === "TALK") {
          setMessages((prev) => [...prev, payload]);
        }
      } catch (error) {
        console.error("[ChatRoom] Failed to parse message:", error);
      }
    },
    [roomId],
  );

  const sendReadReceipt = useCallback(() => {
    if (!client || !client.connected) return;

    client.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        roomId,
        content: "",
        type: "READ",
      }),
    });
    console.log(`[ChatRoom:${roomId}] Read receipt sent`);
  }, [client, roomId]);

  useEffect(() => {
    if (!client || status !== "connected" || !roomId) return;

    const destination = `/topic/chat.room.${roomId}`;
    console.log(`[ChatRoom:${roomId}] Subscribing to ${destination}...`);
    const subscription = client.subscribe(destination, handleMessage);

    // 구독 후 바로 읽음 처리 신호 전송
    sendReadReceipt();

    return () => {
      console.log(`[ChatRoom:${roomId}] Unsubscribing...`);
      subscription.unsubscribe();
    };
  }, [client, status, roomId, handleMessage, sendReadReceipt]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!client || !client.connected) {
        console.error("[ChatRoom] Client not connected");
        return;
      }

      const payload = {
        roomId,
        content,
        type: "TALK",
      };

      client.publish({
        destination: "/app/chat/message",
        body: JSON.stringify(payload),
      });
    },
    [client, roomId],
  );

  return {
    messages,
    setMessages,
    sendMessage,
    sendReadReceipt,
    isConnected: status === "connected",
  };
}
