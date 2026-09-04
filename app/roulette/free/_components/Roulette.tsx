"use client";
import Image from "next/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface RouletteHandle {
  spin: () => void;
}

interface RouletteProps {
  onFinish?: (resultItem: number) => void;
  onSpinChange?: (isSpinning: boolean) => void;
  className?: string;
}

// 룰렛에 배치될 옵션들 (12시 경계선 기준 시계방향: 1, 2, 3, 4, 5)
// 0도 ~ 72도: 1번
// 72도 ~ 144도: 2번
// 144도 ~ 216도: 3번
// 216도 ~ 288도: 4번
// 288도 ~ 360도: 5번
const ROULETTE_OPTIONS = [1, 2, 3, 4, 5];

const Roulette = forwardRef<RouletteHandle, RouletteProps>(
  ({ onFinish, onSpinChange, className }, ref) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const hapticTimersRef = useRef<NodeJS.Timeout[]>([]);

    // 언마운트 시 진동 및 타이머 정리
    useEffect(() => {
      return () => {
        hapticTimersRef.current.forEach(clearTimeout);
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(0);
        }
      };
    }, []);

    // 갤럭시 등 안드로이드 브라우저 햅틱 피드백 (회전 감속에 맞춤)
    const triggerHapticFeedback = () => {
      if (typeof window === "undefined" || !("vibrate" in navigator)) return;

      // 이전 타이머 정리
      hapticTimersRef.current.forEach(clearTimeout);
      hapticTimersRef.current = [];

      // 1. 출발 순간 진동
      navigator.vibrate(35);

      // 2. 회전하는 동안 점점 느려지는 틱 진동
      let elapsed = 0;
      let delay = 60;

      const tick = () => {
        elapsed += delay;
        if (elapsed >= 6500) return;

        try {
          navigator.vibrate(10);
        } catch {}

        // 시간이 지날수록 간격이 점차 늘어남 (감속 체감)
        const progress = elapsed / 7000;
        delay = Math.floor(60 + Math.pow(progress, 3) * 600);

        const timer = setTimeout(tick, delay);
        hapticTimersRef.current.push(timer);
      };

      const firstTimer = setTimeout(tick, delay);
      hapticTimersRef.current.push(firstTimer);

      // 3. 7초 뒤 당첨 멈춤 진동
      const endTimer = setTimeout(() => {
        try {
          navigator.vibrate([60, 50, 120]);
        } catch {}
      }, 7000);
      hapticTimersRef.current.push(endTimer);
    };

    const spin = () => {
      if (isSpinning) return;
      setIsSpinning(true);
      onSpinChange?.(true);

      // 햅틱 진동 실행
      triggerHapticFeedback();

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
      const spins = 10; // 기본 10바퀴 회전

      // 누적 각도 계산
      const currentBase = rotation - (rotation % 360);
      const finalRotation =
        currentBase + spins * 360 + targetAngle + randomOffset;

      setRotation(finalRotation);

      // 5. 회전 완료 콜백 (7초 뒤)
      setTimeout(() => {
        setIsSpinning(false);
        onSpinChange?.(false);
        onFinish?.(resultItem);
      }, 7000);
    };

    useImperativeHandle(ref, () => ({
      spin,
    }));

    return (
      <div
        className={cn(
          "relative flex w-full max-w-[356px] flex-col items-center justify-center",
          className,
        )}
      >
        {/* 룰렛 상단 하트 포인터 (SVG) */}
        <div className="absolute -top-6 z-20 flex flex-col items-center justify-center drop-shadow-md">
          <Image
            src="/roulette/heart.svg"
            alt=""
            width={35}
            height={42}
            priority
            style={{ width: "35px", height: "auto" }}
          />
        </div>

        {/* 룰렛 원판 회전 컨테이너 */}
        <div className="relative aspect-square w-full">
          {/* 고정된 그림자: 회전하지 않음 */}
          <div className="absolute inset-0 rounded-full shadow-[0_0_24px_rgba(0,0,0,0.1),0_12px_12px_rgba(0,0,0,0.08)]" />

          {/* 룰렛 이미지만 회전 */}
          <div
            className="absolute inset-0 transition-transform duration-[7000ms] ease-[cubic-bezier(0.12,0.9,0.08,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <Image
              src="/roulette/roulette3.png"
              alt="룰렛 원판"
              priority
              fill
              sizes="(max-width: 356px) 100vw, 356px"
              className="block object-contain"
            />
          </div>
        </div>
      </div>
    );
  },
);

Roulette.displayName = "Roulette";

export default Roulette;
