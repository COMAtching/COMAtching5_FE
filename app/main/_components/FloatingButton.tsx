"use client";

import React from "react";
import { Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUnreadCount } from "@/hooks/useChatRooms";

type FloatingButtonProps = {
  fixed?: boolean;
};

const FloatingButton = ({ fixed = false }: FloatingButtonProps) => {
  const { data: unreadCountData } = useUnreadCount();
  const totalUnreadCount = unreadCountData || 0;

  const hasUnread = totalUnreadCount > 0;

  return (
    <div
      className={cn(
        "z-50 box-border flex h-12 items-center justify-between gap-6 rounded-[99px] border border-white/30 bg-white/60 px-4 py-2 text-black shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px] transition-all duration-300",
      )}
    >
      <Link
        href="/chat-list"
        prefetch={true}
        aria-label="채팅 목록 열기"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <Send size={18} className="text-[#454545]" />
        <span className="text-[12px] leading-[14px] font-semibold text-[#454545]">
          채팅
        </span>
        {totalUnreadCount > 0 && (
          <div className="flex h-4 max-w-[28px] min-w-[16px] items-center justify-center rounded-full bg-[#FF4D61] px-1 text-[10px] leading-[110%] font-semibold text-white">
            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
          </div>
        )}
      </Link>
      <Link
        href="/mypage"
        aria-label="마이페이지 열기"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <UserRound size={18} className="text-[#454545]" />
        <span className="text-[12px] leading-[14px] font-semibold text-[#454545]">
          마이
        </span>
      </Link>
    </div>
  );
};

export default FloatingButton;
