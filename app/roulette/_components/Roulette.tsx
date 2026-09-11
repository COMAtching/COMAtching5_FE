"use client";
import Image from "next/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface RouletteHandle {
  spin: (targetItemName?: string) => void;
  reset: () => void;
}

export type RouletteType = "free" | "special";

export interface RouletteItem {
  id: number;
  label: string;
}

// ==========================================
// 룰렛 타입별 설정 (이미지 & 상품 배열)
// ==========================================
const ROULETTE_CONFIG: Record<
  RouletteType,
  { imageSrc: string; items: RouletteItem[] }
> = {
  free: {
    imageSrc: "/roulette/roulette3.png",
    items: [
      { id: 1, label: "옵션권 1장" },
      { id: 2, label: "옵션권 2장" },
      { id: 3, label: "뽑기권 1장" },
      { id: 4, label: "꽝" },
      { id: 5, label: "풀세트" },
    ],
  },
  special: {
    imageSrc: "/roulette/special_roulette.png",
    items: [
      { id: 1, label: "옵션권 2장" },
      { id: 2, label: "옵션권 5장" },
      { id: 3, label: "뽑기권 1장" },
      { id: 4, label: "풀세트" },
      { id: 5, label: "뽑기권 5장" },
      { id: 6, label: "뽑기권 10장" },
      { id: 7, label: "1만원권 상품권" },
      { id: 8, label: "2만원권 상품권" },
    ],
  },
};

interface RouletteProps {
  type: RouletteType;
  onFinish?: (item: RouletteItem) => void;
  onSpinChange?: (isSpinning: boolean) => void;
  className?: string;
}

const Roulette = forwardRef<RouletteHandle, RouletteProps>(
  ({ type, onFinish, onSpinChange, className }, ref) => {
    const { imageSrc, items } = ROULETTE_CONFIG[type];

    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [transitionDuration, setTransitionDuration] = useState(7000);

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
        navigator.vibrate(0);

        const pattern: number[] = [];
        let elapsed = 0;
        let pause = 75;

        while (elapsed < 6300) {
          const vibDuration = elapsed < 3000 ? 30 : elapsed < 5000 ? 38 : 45;
          pattern.push(vibDuration);
          pattern.push(pause);
          elapsed += vibDuration + pause;
          pause = Math.min(800, Math.floor(pause * 1.09));
        }

        const remainingWait = Math.max(100, 7000 - elapsed);
        if (pattern.length > 0) {
          pattern[pattern.length - 1] += remainingWait;
        }

        // 7초 정지 순간 당첨 축하 묵직한 더블 햅틱
        pattern.push(80, 80, 150);
        navigator.vibrate(pattern);
      } catch (err) {
        console.error("Vibration failed:", err);
      }
    };

    const spin = (targetItemName?: string) => {
      if (isSpinning) return;
      setIsSpinning(true);
      setTransitionDuration(7000);
      onSpinChange?.(true);

      triggerHapticFeedback();

      // 당첨 아이템 랜덤 선택 (API에서 타겟이 오면 해당 타겟 매칭)
      let resultIndex = Math.floor(Math.random() * items.length);
      if (targetItemName) {
        const foundIndex = items.findIndex((i) => i.label === targetItemName);
        if (foundIndex !== -1) {
          resultIndex = foundIndex;
        }
      }
      const resultItem = items[resultIndex];

      // 1칸당 각도 계산
      const segmentAngle = 360 / items.length;
      // 당첨 칸의 중앙을 12시 방향으로 가져오는 각도
      const itemCenterAngle = resultIndex * segmentAngle + segmentAngle / 2;
      const targetAngle = 360 - itemCenterAngle;

      // 경계선 아슬아슬한 오차 (-31도 ~ +31도)
      const randomOffset = Math.floor(Math.random() * 63) - 31;
      const spins = 10;

      const currentBase = rotation - (rotation % 360);
      const finalRotation =
        currentBase + spins * 360 + targetAngle + randomOffset;

      setRotation(finalRotation);

      // 7초 뒤 결과 콜백
      setTimeout(() => {
        setIsSpinning(false);
        onSpinChange?.(false);
        onFinish?.(resultItem);
      }, 7000);
    };

    const reset = () => {
      setTransitionDuration(0); // 0초로 설정하여 즉시 회전 원복
      setRotation(0);
      setIsSpinning(false);
      onSpinChange?.(false);
    };

    useImperativeHandle(ref, () => ({
      spin,
      reset,
    }));

    return (
      <div
        className={cn(
          "relative flex w-full max-w-[min(340px,42dvh)] flex-col items-center justify-center",
          className,
        )}
      >
        {/* 룰렛 상단 하트 포인터 */}
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
            className="absolute inset-0 overflow-hidden rounded-full ease-[cubic-bezier(0.12,0.9,0.08,1)] will-change-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: `${transitionDuration}ms`,
              transitionProperty: "transform",
            }}
          >
            <Image
              src={imageSrc}
              alt="룰렛 원판"
              priority
              fill
              sizes="(max-width: 356px) 100vw, 356px"
              className="block rounded-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  },
);

Roulette.displayName = "Roulette";

export default Roulette;
