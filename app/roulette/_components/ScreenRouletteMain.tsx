"use client";

import React from "react";
import RouletteHeader from "./RouletteHeader";
import RouletteProbabilityBottomSheet from "./RouletteProbabilityBottomSheet";
import { FreeRouletteCard, SpecialRouletteCard } from "./RouletteCards";
import { useRouletteStatus } from "@/hooks/useRouletteStatus";

/**
 * 룰렛 메인 화면 (허브) 컴포넌트
 */
const ScreenRouletteMain = () => {
  const { data: rouletteStatus } = useRouletteStatus();

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
          <FreeRouletteCard
            remainingChances={
              // 데이터가 아직 없거나(로딩 중), 이미 참여한 경우 → 0회
              // 참여하지 않았음이 명확히 확인된 경우에만 → 1회
              rouletteStatus && !rouletteStatus.isFreeParticipated ? 1 : 0
            }
          />
          <SpecialRouletteCard
            currentAmount={rouletteStatus?.totalPay ?? 0}
            targetAmount={3000}
            isSpecialParticipated={
              // 데이터가 없을 때는 참여 완료로 간주(true) → 버튼 비활성화
              rouletteStatus?.isSpecialParticipated ?? true
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenRouletteMain;
