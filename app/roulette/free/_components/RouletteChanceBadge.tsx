import { cn } from "@/lib/utils";
import React from "react";

interface RouletteChanceBadgeProps {
  remainingCount?: number;
  className?: string;
}

const RouletteChanceBadge = ({
  remainingCount = 2,
  className,
}: RouletteChanceBadgeProps) => {
  return (
    <div
      className={cn(
        "flex h-[35px] items-center self-center rounded-full border border-white/30 bg-white/30 px-3 shadow-[0px_0px_8px_rgba(0,0,0,0.04),0px_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
        className,
      )}
    >
      <span className="typo-14-600 text-color-main-900">
        남은 기회 {remainingCount}개
      </span>
    </div>
  );
};

export default RouletteChanceBadge;
