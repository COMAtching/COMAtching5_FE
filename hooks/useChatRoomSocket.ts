"use client";

import { useEffect, useState, useCallback } from "react";
import { useChatSocketStore } from "@/stores/chat-socket-store";
import { IMessage } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useMyProfile } from "@/hooks/useProfile";

export type ChatMessagePayload = {
  id: string;
  roomId: string;
  senderId: number;
  content: string;
  type: "TALK" | "ENTER" | "LEAVE" | "READ";
  createdAt: string;
  readCount: number;
};

export type ChatMessagesResponse = {
  code: string;
  status: number;
  message: string;
  data: ChatMessagePayload[];
};

export function useChatRoomSocket(roomId: string, currentUserIdParam?: number) {
  const { client, status } = useChatSocketStore();
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [prevRoomId, setPrevRoomId] = useState(roomId);
  const queryClient = useQueryClient();

  // 내 프로필 정보 가져오기 (매개변수로 안넘어왔을 때 대비 안전망)
  const { data: myProfile } = useMyProfile();
  const currentUserId = currentUserIdParam || myProfile?.data.memberId;

  // roomId가 변경될 때마다(즉 방을 나갔다 들어올 때마다) 소켓 메시지 상태를 초기화 (render-time state reset)
  if (roomId !== prevRoomId) {
    setPrevRoomId(roomId);
    setMessages([]);
  }

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

  const sendEnterReceipt = useCallback(() => {
    if (!client || !client.connected) return;

    client.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        roomId,
        content: "",
        type: "ENTER",
      }),
    });
    console.log(`[ChatRoom:${roomId}] Enter receipt sent`);
  }, [client, roomId]);

  const sendLeaveReceipt = useCallback(() => {
    if (!client || !client.connected) return;

    client.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        roomId,
        content: "",
        type: "LEAVE",
      }),
    });
    console.log(`[ChatRoom:${roomId}] Leave receipt sent`);
  }, [client, roomId]);

  const handleMessage = useCallback(
    (message: IMessage) => {
      try {
        const payload: ChatMessagePayload = JSON.parse(message.body);
        console.log(`[ChatRoom:${roomId}] New event received:`, payload);

        // TALK일 경우에만 메시지 리스트에 추가
        if (payload.type === "TALK") {
          setMessages((prev) => [...prev, payload]);

          // 만약 상대방이 보낸 메시지이고 내가 현재 방에 접속 중인 상태라면 즉시 읽음 전송
          if (currentUserId && payload.senderId !== currentUserId) {
            sendReadReceipt();
          }
        } else if (payload.type === "READ") {
          console.log(`[ChatRoom:${roomId}] Opponent read our messages`);

          // 1. 소켓 메시지 상태의 readCount를 모두 0으로 업데이트
          setMessages((prev) =>
            prev.map((msg) => ({
              ...msg,
              readCount: 0,
            })),
          );

          // 2. React Query 캐시 내의 기존 과거 메시지들의 readCount도 모두 0으로 업데이트
          queryClient.setQueryData<ChatMessagesResponse>(
            ["chatMessages", roomId],
            (old) => {
              if (!old || !old.data) return old;
              return {
                ...old,
                data: old.data.map((msg) => ({
                  ...msg,
                  readCount: 0,
                })),
              };
            },
          );
        }
      } catch (error) {
        console.error("[ChatRoom] Failed to parse message:", error);
      }
    },
    [roomId, currentUserId, sendReadReceipt, queryClient],
  );

  useEffect(() => {
    if (!client || status !== "connected" || !roomId) return;

    const destination = `/topic/chat.room.${roomId}`;
    console.log(`[ChatRoom:${roomId}] Subscribing to ${destination}...`);
    const subscription = client.subscribe(destination, handleMessage);

    // 1. 방 입장 시 ENTER 전송 후 바로 READ 전송
    sendEnterReceipt();
    sendReadReceipt();

    return () => {
      console.log(`[ChatRoom:${roomId}] Leaving room & unsubscribing...`);

      // 2. 방 퇴장 시 LEAVE 전송
      sendLeaveReceipt();
      subscription.unsubscribe();
    };
  }, [
    client,
    status,
    roomId,
    handleMessage,
    sendEnterReceipt,
    sendReadReceipt,
    sendLeaveReceipt,
  ]);

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
