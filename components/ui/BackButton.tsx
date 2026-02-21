"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  className?: string;
  onClick?: () => void;
  text?: string;
};

export const BackButton = ({
  className = "",
  onClick,
  text,
}: BackButtonProps) => {
  const router = useRouter();
  const handleClick = onClick ?? (() => router.back());

  // With text: centered layout with absolute positioned button
  if (text) {
    return (
      <div className="relative flex h-12 w-full items-center justify-center">
        <button
          type="button"
          onClick={handleClick}
          aria-label="뒤로 가기"
          className={cn(
            "absolute left-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#FFFFFF]/30 bg-[#FFFFFF]/50 [box-shadow:0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
            className,
          )}
        >
          <ChevronLeft className="text-[#282828]" size={20} />
        </button>
        <span className="typo-20-700 text-center text-[#373737]">{text}</span>
      </div>
    );
  }

  // Without text: simple button (use className for absolute positioning if needed)
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="뒤로 가기"
      className={cn(
        "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#FFFFFF]/30 bg-[#FFFFFF]/50 [box-shadow:0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
        className,
      )}
    >
      <ChevronLeft className="text-[#282828]" size={20} />
    </button>
  );
};
