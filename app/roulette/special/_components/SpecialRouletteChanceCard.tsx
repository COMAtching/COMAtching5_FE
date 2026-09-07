"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SpecialRouletteChanceCardProps {
  /** 현재 결제 누적 금액 (기본값: 1000) */
  currentAmount?: number;
  /** 다음 룰렛 기회까지의 목표/토탈 금액 (기본값: 3000) */
  targetAmount?: number;
  /** 상단 누적 결제 정보 텍스트 (옵션, 기본값: "누적 결제 {currentAmount}원") */
  accumulatedText?: string;
  /** 상단 추가 결제 안내 텍스트 (옵션, 기본값: "{남은금액}원 추가 결제 시 1회") */
  additionalText?: string;
  /** 우측 하단 목표 금액 텍스트 (옵션, 기본값: "{targetAmount}원") */
  targetText?: string;
  className?: string;
}

export default function SpecialRouletteChanceCard({
  currentAmount = 1000,
  targetAmount = 3000,
  accumulatedText,
  additionalText,
  targetText,
  className,
}: SpecialRouletteChanceCardProps) {
  const diff = Math.max(0, targetAmount - currentAmount);
  const percent = Math.min(
    100,
    Math.max(0, Math.round((currentAmount / targetAmount) * 100)),
  );

  const displayAccumulated =
    accumulatedText ?? `누적 결제 ${currentAmount.toLocaleString()}원`;
  const displayAdditional =
    additionalText ?? `${diff.toLocaleString()}원 추가 결제 시 1회`;
  const displayTarget = targetText ?? `${targetAmount.toLocaleString()}원`;

  return (
    <div
      className={cn(
        "mt-2 box-border flex h-[76px] w-[278px] flex-col justify-center gap-2 rounded-[16px] border border-white/30 bg-white/30 p-2 shadow-[0px_0px_8px_rgba(0,0,0,0.04),0px_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
        className,
      )}
    >
      {/* Chances container (상단 티켓 아이콘 + 결제 정보) */}
      <div className="flex h-10 w-full flex-row items-center gap-3">
        {/* Ticket Image */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <Image
            src="/roulette/ticket.png"
            alt="ticket"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />
        </div>

        {/* Info container */}
        <div className="flex flex-1 flex-col justify-center gap-1">
          <span className="typo-12-600 leading-[14px] text-[#FF4D61]">
            {displayAccumulated}
          </span>
          <span className="typo-16-600 leading-[19px] text-[#1A1A1A]">
            {displayAdditional}
          </span>
        </div>
      </div>

      {/* Progress bar container (하단 진행도 바 + 목표 금액) */}
      <div className="flex h-2.5 w-full flex-row items-center gap-2">
        {/* Progress bar background */}
        <div className="relative h-2 flex-1 rounded-full bg-[#E5E5E5]">
          {/* Progress bar fill */}
          <div
            className="relative h-full rounded-full bg-[#FF4D61] transition-all duration-300"
            style={{ width: `${percent}%` }}
          >
            {/* Progress indicator bar */}
            {percent > 0 && percent < 100 && (
              <div className="absolute -top-[1px] -right-[1px] -bottom-[1px] w-[2px] rounded-[1px] bg-white shadow-[0px_0px_4px_rgba(255,77,97,0.5)]" />
            )}
          </div>
        </div>

        {/* Amount text */}
        <span className="shrink-0 text-[8px] leading-[10px] font-semibold text-[#B3B3B3]">
          {displayTarget}
        </span>
      </div>
    </div>
  );
}

// 편의를 위한 별칭 export
export { SpecialRouletteChanceCard as RemainingChancesContainer };
