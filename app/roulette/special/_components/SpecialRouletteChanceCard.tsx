"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpecialRouletteChanceCardProps {
  /** 현재 결제 누적 금액 (기본값: 1000) */
  currentAmount?: number;
  /** 다음 룰렛 기회까지의 목표/토탈 금액 (기본값: 3000) */
  targetAmount?: number;
  /** 오늘 이미 룰렛에 참여했는지 여부 */
  isParticipated?: boolean;
  /** 상단 누적 결제 정보 텍스트 (옵션) */
  accumulatedText?: string;
  /** 상단 추가 결제 안내 텍스트 (옵션) */
  additionalText?: string;
  /** 우측 하단 목표 금액 텍스트 (옵션) */
  targetText?: string;
  className?: string;
}

export default function SpecialRouletteChanceCard({
  currentAmount = 1000,
  targetAmount = 3000,
  isParticipated = false,
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

  const isTargetReached = currentAmount >= targetAmount;

  let displayAccumulated = "";
  let displayAdditional = "";

  if (isParticipated) {
    displayAccumulated = accumulatedText ?? "오늘 참여 완료";
    displayAdditional = additionalText ?? "내일 또 도전해보세요!";
  } else {
    displayAccumulated =
      accumulatedText ??
      (isTargetReached
        ? "오늘 1회 참여 가능"
        : `누적 결제 ${currentAmount.toLocaleString()}원`);

    displayAdditional =
      additionalText ??
      (isTargetReached
        ? `누적 결제 ${targetAmount.toLocaleString()}원 달성`
        : `${diff.toLocaleString()}원 추가 결제 시 1회`);
  }

  const displayTarget = targetText ?? `${targetAmount.toLocaleString()}원`;

  return (
    <div
      className={cn(
        "mt-2 box-border flex h-[76px] w-[278px] flex-col justify-center gap-2 rounded-2xl border border-white/30 bg-white/30 p-2 shadow-[0px_0px_8px_rgba(0,0,0,0.04),0px_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[15px]",
        className,
      )}
    >
      {/* Chances container (상단 아이콘 + 텍스트 정보) */}
      <div className="flex h-10 w-full flex-row items-center gap-3">
        {/* Icon (Ticket or Check) */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          {isParticipated ? (
            <div
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full border-2 border-white"
              style={{
                background:
                  "linear-gradient(102.05deg, #F57DB2 18.65%, #FF8A9B 90.53%)",
                boxShadow:
                  "0px 0px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Check size={16} strokeWidth={3} className="text-white" />
            </div>
          ) : (
            <Image
              src="/roulette/ticket.png"
              alt="ticket"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          )}
        </div>

        {/* Info container */}
        <div className="flex flex-1 flex-col justify-center gap-1">
          <span
            className={cn(
              "typo-12-600 leading-[14px]",
              isParticipated ? "text-[#808080]" : "text-[#FF4D61]",
            )}
          >
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
              <div className="absolute -top-[1px] -right-[1px] -bottom-[1px] w-0.5 rounded-[1px] bg-white shadow-[0px_0px_4px_rgba(255,77,97,0.5)]" />
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
