"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);

  const SLIDER_WIDTH = 300;
  const THUMB_SIZE = 40;
  const MAX_POSITION = SLIDER_WIDTH - THUMB_SIZE - 8; // 8 is padding (4px each side)

  const handleStart = () => {
    if (isLoading || !isActive) return;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const calcPos = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newPos = clientX - rect.left - 4 - THUMB_SIZE / 2;
      if (newPos < 0) newPos = 0;
      if (newPos > MAX_POSITION) newPos = MAX_POSITION;
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const onMouseMove = (e: MouseEvent) => calcPos(e.clientX);
    const onTouchMove = (e: TouchEvent) => calcPos(e.touches[0].clientX);

    const onEnd = () => {
      setIsDragging(false);
      if (positionRef.current >= MAX_POSITION * 0.9) {
        setPosition(MAX_POSITION);
        onConfirm();
        setTimeout(() => setPosition(0), 1000);
      } else {
        setPosition(0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
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
        style={{
          width: `${SLIDER_WIDTH}px`,
          height: "48px",
          background:
            "radial-gradient(100% 100.45% at 0% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
          boxShadow: "inset -2px 2px 6px rgba(0, 0, 0, 0.2)",
          borderRadius: "100px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Text Layer */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="typo-16-700 transition-colors select-none"
            style={{ color: isActive ? "#8F8F8F" : "#B3B3B3" }}
          >
            {isLoading
              ? "매칭 중..."
              : isActive
                ? "슬라이드하여 매칭 시작"
                : "조건을 선택해 주세요"}
          </span>
        </div>

        {/* Thumb */}
        <div
          ref={thumbRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={isActive ? "bg-milky-pink" : ""}
          style={{
            width: `${THUMB_SIZE}px`,
            height: `${THUMB_SIZE}px`,
            backgroundColor: isActive ? "transparent" : "#B3B3B3",
            boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDragging ? "grabbing" : isActive ? "grab" : "not-allowed",
            transform: `translateX(${position}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            willChange: "transform",
            touchAction: "none",
            zIndex: 10,
          }}
        >
          <ArrowRight
            size={18}
            strokeWidth={3}
            style={{
              color: "#FFFFFF",
              opacity: isActive ? 1 : 0.5,
            }}
          />
        </div>
      </div>
    </div>
  );
}
