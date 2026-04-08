"use client";

import React from "react";
import { Heart } from "lucide-react";

interface EventStatusCardProps {
  remainingEvents: number;
}

export const EventStatusCard = ({ remainingEvents }: EventStatusCardProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
      <div className="w-full text-left text-[32px] font-bold text-black">
        매칭 기회 제공 이벤트 예약
      </div>
      <div className="w-full text-left text-xl font-medium text-[#858585]">
        현재 잔여 이벤트 횟수는 {remainingEvents}회입니다.
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <Heart
            key={i}
            size={30}
            className={
              i < remainingEvents
                ? "fill-[#ff775e] text-[#ff775e]"
                : "text-[#b3b3b3]"
            }
          />
        ))}
      </div>
    </div>
  );
};
