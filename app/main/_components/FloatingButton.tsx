import React from "react";
import { Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FloatingButtonProps = {
  fixed?: boolean;
};

const FloatingButton = ({ fixed = false }: FloatingButtonProps) => {
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
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      >
        <Send size={20} />
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
