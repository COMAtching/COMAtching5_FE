"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";

interface MatchingSliderButtonProps {
  onConfirm: () => void;
  isLoading?: boolean;
  isActive?: boolean;
}

export default function MatchingSliderButton({
  onConfirm,
  isLoading = false,
  isActive = false,
}: MatchingSliderButtonProps) {
  const [position, setPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const THUMB_SIZE = 40;

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleStart = () => {
    if (isLoading || !isActive) return;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const calcPos = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxPos = rect.width - THUMB_SIZE - 8;
      let newPos = clientX - rect.left - 4 - THUMB_SIZE / 2;
      if (newPos < 0) newPos = 0;
      if (newPos > maxPos) newPos = maxPos;
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const onMouseMove = (e: MouseEvent) => calcPos(e.clientX);
    const onTouchMove = (e: TouchEvent) => calcPos(e.touches[0].clientX);

    const onEnd = () => {
      if (!containerRef.current) return;
      const maxPos = containerRef.current.clientWidth - THUMB_SIZE - 8;
      setIsDragging(false);
      if (positionRef.current >= maxPos * 0.9) {
        setPosition(maxPos);
        onConfirm();
        timerRef.current = setTimeout(() => setPosition(0), 1000);
      } else {
        setPosition(0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging]);

  return (
    <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2">
      <div
        ref={containerRef}
        role="slider"
        aria-label="커플 매칭 시작 슬라이더"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={
          containerWidth > 0
            ? Math.round((position / (containerWidth - THUMB_SIZE)) * 100)
            : 0
        }
        aria-disabled={!isActive}
        style={{
          width: "min(80vw, 344px)",
          height: "48px",
          background:
            "radial-gradient(100% 100.45% at 0% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
          boxShadow: "-2px 2px 6px rgba(0, 0, 0, 0.2)",
          borderRadius: "100px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          position: "relative",
        }}
      >
        {/* Text Layer */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className={`typo-16-700 tracking-[0.01em] transition-all select-none ${
              isActive
                ? "animate-shimmer bg-gradient-to-r from-[#666666] via-[#B3B3B3] to-[#666666] bg-clip-text text-transparent"
                : "text-color-gray-300"
            }`}
            style={
              isActive
                ? {
                    backgroundImage:
                      "linear-gradient(91.24deg, #666666 9.51%, #B3B3B3 35.68%, #666666 76.49%)",
                  }
                : {}
            }
          >
            {isLoading
              ? "매칭 중..."
              : isActive
                ? "밀어서 커플되기"
                : "조건을 선택해 주세요"}
          </span>
        </div>

        {/* Thumb */}
        <div
          ref={thumbRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform will-change-transform ${
            isActive ? "bg-milky-pink" : "bg-color-gray-300"
          }`}
          style={{
            cursor: isDragging ? "grabbing" : isActive ? "grab" : "not-allowed",
            transform: `translateX(${position}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            boxShadow: isActive ? "1px 1px 3px rgba(0, 0, 0, 0.2)" : "none",
            touchAction: "none",
            zIndex: 10,
          }}
        >
          <ArrowRight
            size={18}
            strokeWidth={3}
            className={`text-white transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}
          />
        </div>
      </div>
    </div>
  );
}
