"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface RouletteProps {
  onFinish?: (resultItem: number) => void;
  className?: string;
}

// 룰렛에 배치될 옵션들 (12시 경계선 기준 시계방향: 1, 2, 3, 4, 5)
// 0도 ~ 72도: 1번
// 72도 ~ 144도: 2번
// 144도 ~ 216도: 3번
// 216도 ~ 288도: 4번
// 288도 ~ 360도: 5번
const ROULETTE_OPTIONS = [1, 2, 3, 4, 5];

// 5분할 임시 원판 컴포넌트 (초기 상태: 12시 정각이 5번과 1번의 '경계선')
const TempWheel = () => {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/roulette/Roulette.png"
        alt="룰렛 원판"
        fill
        priority
        sizes="560px"
        className="object-cover"
      />
    </div>
  );
};

const Roulette = ({ onFinish, className }: RouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 1. 당첨될 인덱스 랜덤 선택 (0 ~ 4)
    const resultIndex = Math.floor(Math.random() * ROULETTE_OPTIONS.length);
    const resultItem = ROULETTE_OPTIONS[resultIndex];

    // 2. 1칸당 차지하는 각도 (360 / 5 = 72도)
    const segmentAngle = 360 / ROULETTE_OPTIONS.length;

    // 3. 당첨 각도 계산
    // 초기 0도가 '경계선'이므로, 각 번호의 중앙은 (인덱스 * 72) + 36도에 위치합니다.
    // 이 중앙을 12시(360도)로 끌고 오기 위한 목표 각도:
    const itemCenterAngle = resultIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = 360 - itemCenterAngle;

    // 4. 경계선 아슬아슬한 곳까지 도달 (-31도 ~ +31도 오차)
    // 칸의 중앙 기준 좌우 경계선(±36도) 직전까지 아슬아슬하게 회전
    const randomOffset = Math.floor(Math.random() * 63) - 31;
    const spins = 10; // 기본 5바퀴 회전

    // 누적 각도 계산
    const currentBase = rotation - (rotation % 360);
    const finalRotation =
      currentBase + spins * 360 + targetAngle + randomOffset;

    setRotation(finalRotation);

    // 5. 회전 완료 콜백 (4초 뒤)
    setTimeout(() => {
      setIsSpinning(false);
      onFinish?.(resultItem);
    }, 7000);
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center",
        className,
      )}
    >
      {/* 룰렛 상단 하트 포인터 (SVG) */}
      <div className="absolute -top-5 z-20 flex flex-col items-center justify-center drop-shadow-md">
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="#FF4B4B"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* 룰렛 원판 회전 컨테이너 */}
      <div className="relative flex h-140 w-140 items-center justify-center">
        <div
          className="relative h-full w-full transition-transform duration-7000 ease-[cubic-bezier(0.12,0.9,0.08,1)]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* 5분할 임시 원판 */}
          <TempWheel />
        </div>
      </div>

      {/* 테스트용 스핀 버튼 */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="bg-milky-pink typo-16-600 mt-8 cursor-pointer rounded-full px-10 py-3 text-white disabled:opacity-50"
      >
        {isSpinning ? "돌아가는 중..." : "START"}
      </button>
    </div>
  );
};

export default Roulette;
