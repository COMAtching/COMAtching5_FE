"use client";

import { useFeature } from "@/stores/features";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
  activateSessionSocket,
  handleSessionClose,
} from "@/lib/socket-session";
import SockJS from "sockjs-client";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type {
  ChatMessagePayload,
  ChatMessagesResponse,
} from "./useChatMessages";

export function useChatRoomSocket(
  roomId: string | null,
  memberId: number | undefined,
  onOwnMessage?: (content: string, type: "TALK" | "IMAGE") => void,
) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<{
    roomId: string;
    memberId: number;
    client: Client;
  } | null>(null);
  const chatOpen = useFeature("CHAT")?.open === true;
  const [endReason, setEndReason] = useState<"changed" | "ended" | null>(null);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    if (!memberId || !chatOpen) return;
    const origin =
      process.env.NODE_ENV === "development"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_API_URL;
    if (!origin) return;

    let active = true;
    const client = new Client({
      webSocketFactory: () => new SockJS(`${origin}/ws/chat`) as WebSocket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: (frame) => {
        if (!active) return;
        const principal = frame.headers["user-name"];
        if (principal && principal !== String(memberId)) {
          setEndReason("changed");
          void client.deactivate();
          return;
        }
        client.subscribe("/user/queue/chat.visibility", () => {
          if (!active) return;
          void queryClient.resetQueries({ queryKey: ["chatRooms"] });
          void queryClient.invalidateQueries({ queryKey: ["chatUnreadCount"] });
          void queryClient.invalidateQueries({ queryKey: ["matchingHistory"] });
          if (roomId) {
            setMessages([]);
            void queryClient.resetQueries({
              queryKey: ["chatMessages", roomId, memberId],
            });
          }
        });
        if (!roomId) return;
        function sendRead() {
          client.publish({
            destination: "/app/chat/message",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ roomId, content: "", type: "READ" }),
          });
        }
        client.subscribe(`/user/queue/chat.room.${roomId}`, (frame) => {
          if (!active) return;
          const event: ChatMessagePayload = JSON.parse(frame.body);
          if (event.roomId !== roomId) return;
          if (event.type === "TALK" || event.type === "IMAGE") {
            setMessages((prev) => [...prev, event]);
            if (event.senderId === memberId)
              onOwnMessage?.(event.content, event.type);
            else sendRead();
          } else if (event.type === "READ") {
            const markRead = (msg: ChatMessagePayload) =>
              msg.senderId !== event.senderId ? { ...msg, readCount: 0 } : msg;
            setMessages((prev) => prev.map(markRead));
            queryClient.setQueryData<InfiniteData<ChatMessagesResponse>>(
              ["chatMessages", roomId, memberId],
              (old) =>
                old && {
                  ...old,
                  pages: old.pages.map((page) => ({
                    ...page,
                    data: page.data.map(markRead),
                  })),
                },
            );
          }
        });
        sendRead();
        setSession({ client, memberId, roomId });
      },
      onWebSocketClose: (event) => {
        if (active) {
          setSession(null);
          if (handleSessionClose(client, event.code)) setEndReason("ended");
        }
      },
    });
    const stopWatching = activateSessionSocket(
      client,
      () => active,
      (changed) => setEndReason(changed ? "changed" : "ended"),
    );
    return () => {
      active = false;
      stopWatching();
      void client.deactivate();
      setSession(null);
      setEndReason(null);
      setMessages([]);
    };
  }, [roomId, memberId, queryClient, onOwnMessage, chatOpen]);

  const isConnected =
    chatOpen &&
    !!session &&
    session.roomId === roomId &&
    session.memberId === memberId;
  function sendMessage(content: string, type: "TALK" | "IMAGE" = "TALK") {
    if (!isConnected || !session.client.connected) return false;
    try {
      session.client.publish({
        destination: "/app/chat/message",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId, content, type }),
      });
      return true;
    } catch {
      return false;
    }
  }

  return { messages, sendMessage, isConnected, endReason };
}
