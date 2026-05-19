"use client";

import React, { useEffect, useMemo } from "react";
import { Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChatRooms } from "@/hooks/useChatRooms";

type FloatingButtonProps = {
  fixed?: boolean;
};

const FloatingButton = ({ fixed = false }: FloatingButtonProps) => {
  const { data: rooms, refetch: refetchRooms } = useChatRooms();

  // 컴포넌트 마운트 시 최신 데이터 호출
  useEffect(() => {
    refetchRooms();
  }, [refetchRooms]);

  // FCM 알림 수신 시 안읽은 메시지 수 실시간 최신화
  useEffect(() => {
    const handleFcmChat = () => {
      console.log(
        "🔔 [FCM Chat Notification] Refreshing total unread count on Main...",
      );
      refetchRooms();
    };
    window.addEventListener("fcm-chat-received", handleFcmChat);
    return () => {
      window.removeEventListener("fcm-chat-received", handleFcmChat);
    };
  }, [refetchRooms]);

  // 전체 안읽은 메시지 수 계산
  const totalUnreadCount = useMemo(() => {
    return rooms?.reduce((sum, room) => sum + (room.unreadCount || 0), 0) || 0;
  }, [rooms]);

  return (
    <div
      className={cn(
        "box-border flex h-12 w-24 items-center justify-center gap-6 rounded-[99px] border border-white/30 bg-white/60 px-4 py-2 text-black shadow-[0_4px_8px_rgba(0,0,0,0.08),0_0_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
        fixed ? "absolute top-2 right-4" : "",
      )}
    >
      <Link
        href="/chat-list"
        prefetch={true}
        aria-label="채팅 목록 열기"
        className="relative flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      >
        <Send size={20} />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF4D61] px-1 text-[9px] font-bold text-white shadow-sm">
            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
          </span>
        )}
      </Link>
      <Link
        href="/mypage"
        aria-label="마이페이지 열기"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      >
        <UserRound size={20} />
      </Link>
    </div>
  );
};

export default FloatingButton;
