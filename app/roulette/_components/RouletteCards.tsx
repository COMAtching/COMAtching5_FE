"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

// ==========================================
// 1. 무료 룰렛 카드
// ==========================================
type FreeRouletteCardProps = {
  remainingChances?: number;
};

export const FreeRouletteCard = ({
  remainingChances = 1,
}: FreeRouletteCardProps) => {
  return (
    <div className="relative flex w-full flex-col justify-between gap-4 rounded-[24px] border border-white/30 bg-white/80 p-6 shadow-sm backdrop-blur-[15px]">
      {/* Upper Content */}
      <div className="flex w-full items-center justify-between gap-2">
        {/* Left Info */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="typo-20-600 text-[#373737]">무료 룰렛</h3>
            <p className="typo-14-500 h-[34px] leading-[17px] text-[#858585]">
              매일 1회 참여 가능
              <br />
              행운을 확인해 보세요!
            </p>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF775E] via-[#FF4D61] to-[#E83ABC]">
              <Check size={12} className="stroke-[3] text-white" />
            </div>
            <span className="typo-14-500 leading-[20px] text-[#858585]">
              오늘 남은 횟수
              <br />
              <span className="text-color-brand-primary-flame">
                {remainingChances}회
              </span>
            </span>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative flex h-[130px] w-[130px] shrink-0 items-center justify-center">
          {/* Shadow Ellipse */}
          <div className="absolute bottom-1 h-[11px] w-[112px] rounded-full bg-black/30 blur-[6px]" />
          {/* Free Roulette Graphic */}
          <Image
            src="/roulette/free.png"
            alt="무료 룰렛"
            width={120}
            height={120}
            className="relative z-10 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Button */}
      <Link
        href="/roulette/free"
        className="flex h-14 w-full items-center justify-center rounded-[16px] border border-white/30 bg-[#FF4D61] transition-transform hover:opacity-95 active:scale-[0.98]"
      >
        <span className="typo-20-600 text-white">무료 룰렛 입장</span>
      </Link>
    </div>
  );
};

// ==========================================
// 2. 스페셜 룰렛 카드
// ==========================================
type SpecialRouletteCardProps = {
  currentAmount?: number;
  targetAmount?: number;
};

export const SpecialRouletteCard = ({
  currentAmount = 2000,
  targetAmount = 3000,
}: SpecialRouletteCardProps) => {
  return (
    <div className="relative flex w-full flex-col justify-between gap-4 rounded-[24px] border border-white/30 bg-white/80 p-6 shadow-sm backdrop-blur-[15px]">
      {/* Upper Content */}
      <div className="flex w-full items-center justify-between gap-2">
        {/* Left Info */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="typo-20-600 text-[#373737]">스페셜 룰렛</h3>
            <p className="typo-14-500 h-[34px] leading-[17px] text-[#858585]">
              누적 {targetAmount.toLocaleString()}원 이상
              <br />
              결제 시 참여 가능
            </p>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5E5E5]">
              <Check size={12} className="stroke-[3] text-[#B3B3B3]" />
            </div>
            <span className="typo-14-500 leading-[20px] text-[#858585]">
              현재 누적
              <br />
              <span className="text-color-brand-primary-flame">
                {currentAmount.toLocaleString()}원
              </span>{" "}
              / {targetAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative flex h-[130px] w-[130px] shrink-0 items-center justify-center">
          {/* Shadow Ellipse */}
          <div className="absolute bottom-1 h-[11px] w-[112px] rounded-full bg-black/30 blur-[6px]" />
          {/* Special Roulette Graphic */}
          <Image
            src="/roulette/special.png"
            alt="스페셜 룰렛"
            width={120}
            height={120}
            className="relative z-10 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Button */}
      <Link
        href="/roulette/special"
        className="flex h-14 w-full items-center justify-center rounded-[16px] border border-white/30 bg-gradient-to-r from-[#FB5E53] to-[#E53BAE] transition-transform hover:opacity-95 active:scale-[0.98]"
      >
        <span className="typo-20-600 text-white">스페셜 룰렛 입장</span>
      </Link>
    </div>
  );
};
