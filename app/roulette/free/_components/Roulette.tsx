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
    // 언마운트 시 진행 중인 진동 즉시 중단
    useEffect(() => {
      return () => {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(0);
        }
      };
    }, []);

    // 갤럭시 등 안드로이드 크롬 햅틱 피드백 (회전 감속에 맞춘 연속 진동 패턴)
    const triggerHapticFeedback = () => {
      if (typeof window === "undefined" || !("vibrate" in navigator)) return;

      try {
        // 기존 진동 즉시 정지
        navigator.vibrate(0);

        // [진동, 대기, 진동, 대기...] 형식의 패턴 생성 (총 7초 회전과 싱크)
        const pattern: number[] = [];
        let elapsed = 0;
        let pause = 75; // 초기 빠른 회전 시 대기 간격

        // 0초부터 ~6.3초까지 감속되는 틱 진동 패턴 생성
        while (elapsed < 6300) {
          // 손끝에 확실히 느껴지도록 25ms ~ 45ms 강도로 점진적 조절
          const vibDuration = elapsed < 3000 ? 30 : elapsed < 5000 ? 38 : 45;
          pattern.push(vibDuration);
          pattern.push(pause);
          elapsed += vibDuration + pause;
          // 회전이 느려질수록 진동 간격을 점차 넓힘
          pause = Math.min(800, Math.floor(pause * 1.09));
        }

        // 마지막 당첨 순간(7초)까지 대기 시간을 마지막 pause에 합산
        const remainingWait = Math.max(100, 7000 - elapsed);
        if (pattern.length > 0) {
          pattern[pattern.length - 1] += remainingWait;
        }

        // 7초 정지 순간 당첨 축하 묵직한 더블 햅틱 (80ms 진동 -> 80ms 쉼 -> 150ms 진동)
        pattern.push(80, 80, 150);

        // 버튼 클릭(사용자 인터랙션) 스택에서 네이티브 패턴 통째로 즉시 전달
        navigator.vibrate(pattern);
      } catch (err) {
        console.error("Vibration failed:", err);
      }
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
          "relative flex w-full max-w-[min(340px,42dvh)] flex-col items-center justify-center",
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
