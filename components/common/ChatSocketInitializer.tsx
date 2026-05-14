"use client";

import { useEffect } from "react";
import { useChatSocketStore } from "@/stores/chat-socket-store";

export default function ChatSocketInitializer() {
  const connect = useChatSocketStore((state) => state.connect);
  const disconnect = useChatSocketStore((state) => state.disconnect);

  useEffect(() => {
    connect();
    return () => {
      // 앱이 종료되거나 새로고침될 때 연결 해제
      // 사실 Root Layout에 두면 탭을 닫기 전까지는 유지됨
      disconnect();
    };
  }, [connect, disconnect]);

  return null;
}
