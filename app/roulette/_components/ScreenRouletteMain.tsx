"use client";

import React from "react";
import RouletteHeader from "./RouletteHeader";
import RouletteProbabilityBottomSheet from "./RouletteProbabilityBottomSheet";
import { FreeRouletteCard, SpecialRouletteCard } from "./RouletteCards";

/**
 * 룰렛 메인 화면 (허브) 컴포넌트
 */
const ScreenRouletteMain = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden px-4 pt-3 pb-8">
      {/* Roulette Header */}
      <div className="relative z-20 w-full">
        <RouletteHeader
          title="룰렛"
          sidebar={
            <RouletteProbabilityBottomSheet
              trigger={
                <button
                  type="button"
                  className="typo-14-500 text-color-text-caption3 cursor-pointer transition-opacity hover:opacity-80"
                >
                  확률 안내
                </button>
              }
            />
          }
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-2 flex w-full flex-col items-center">
        {/* Title */}
        <p className="typo-14-500 text-color-gray-500 h-[34px] text-center leading-[17px] tracking-[-0.025em]">
          오늘의 행운을 확인해보세요!
          <br />
          매일 1회 무료로 돌릴 수 있어요
        </p>

        {/* Cards */}
        <div className="mt-6 flex w-full flex-col items-center gap-4">
          <FreeRouletteCard />
          <SpecialRouletteCard />
        </div>
      </div>
    </div>
  );
};

export default ScreenRouletteMain;
