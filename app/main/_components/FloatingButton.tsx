"use client";

import React, { useState, useEffect } from "react";
import { Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUnreadCount } from "@/hooks/useChatRooms";

type FloatingButtonProps = {
  fixed?: boolean;
};

const FloatingButton = ({ fixed = false }: FloatingButtonProps) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useUnreadCount();

  // 1. 마운트 시점에 클라이언트 로컬 스토리지에서 캐싱된 마지막 안읽은 개수 조회하여 즉시 반영
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("last_unread_count");
        if (cached) {
          setTotalUnreadCount(parseInt(cached, 10));
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. 실시간 API 응답(React Query)을 받으면 값 갱신 및 캐시 저장
  useEffect(() => {
    if (unreadCountData !== undefined) {
      const timer = setTimeout(() => {
        setTotalUnreadCount(unreadCountData);
        if (typeof window !== "undefined") {
          localStorage.setItem("last_unread_count", String(unreadCountData));
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [unreadCountData]);

  // 3. FCM 알림 수신 시 안읽은 메시지 수 실시간 최신화
  useEffect(() => {
    const handleFcmChat = () => {
      console.log(
        "🔔 [FCM Chat Notification] Refreshing total unread count on Main...",
      );
      refetchUnreadCount();
    };
    window.addEventListener("fcm-chat-received", handleFcmChat);
    return () => {
      window.removeEventListener("fcm-chat-received", handleFcmChat);
    };
  }, [refetchUnreadCount]);

  const hasUnread = totalUnreadCount > 0;

  return (
    <div
      className={cn(
        "z-50 box-border flex h-12 items-center justify-between gap-6 rounded-[99px] border border-white/30 bg-white/60 px-4 py-2 text-black shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px] transition-all duration-300",
        isMounted && hasUnread ? "w-[172px]" : "w-[150px]",
      )}
    >
      <Link
        href="/chat-list"
        prefetch={true}
        aria-label="채팅 목록 열기"
        className="flex shrink-0 items-center gap-1.5 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <Send size={18} className="text-[#454545]" />
        <span className="text-[12px] leading-[14px] font-semibold whitespace-nowrap text-[#454545]">
          채팅
        </span>
        {/* 배지 영역을 항상 렌더링하고 너비/스케일/투명도를 동시 트랜지션 처리하여 좌우 흔들림 완벽 제거 */}
        <div
          className={cn(
            "flex h-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FF4D61] text-[10px] leading-[110%] font-semibold text-white transition-all duration-300",
            isMounted && hasUnread
              ? "ml-0.5 max-w-[28px] min-w-[16px] scale-100 px-1 opacity-100"
              : "ml-0 max-w-0 min-w-0 scale-0 px-0 opacity-0",
          )}
        >
          {totalUnreadCount > 0
            ? totalUnreadCount > 99
              ? "99+"
              : totalUnreadCount
            : ""}
        </div>
      </Link>
      <Link
        href="/mypage"
        aria-label="마이페이지 열기"
        className="flex shrink-0 items-center gap-1.5 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <UserRound size={18} className="text-[#454545]" />
        <span className="text-[12px] leading-[14px] font-semibold whitespace-nowrap text-[#454545]">
          마이
        </span>
      </Link>
    </div>
  );
};

export default FloatingButton;
