import React from "react";
import { Send, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <button
        type="button"
        aria-label="메시지 보내기"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      >
        <Send size={20} />
      </button>
      <button
        type="button"
        aria-label="마이페이지 열기"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      >
        <UserRound size={20} />
      </button>
    </div>
  );
};

export default FloatingButton;
