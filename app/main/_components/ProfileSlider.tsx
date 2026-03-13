"use client";

import { ProfileData } from "@/lib/types/profile";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ProfileCard from "./ProfileCard";

/* ── 프로필 슬라이더 (스와이프 + 인디케이터) ── */
interface ProfileSliderProps {
  profiles: ProfileData[];
}

const PEEK_WIDTH = 28; // 다음 카드가 살짝 보이는 너비 (px)

const ProfileSlider = ({ profiles }: ProfileSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const cardWidth =
        profiles.length > 1 ? el.clientWidth - PEEK_WIDTH : el.clientWidth;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [profiles.length]);

  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center">
      {/* 스와이프 카드 영역 */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto"
        style={{ scrollPaddingLeft: 0, scrollPaddingRight: 0 }}
      >
        {profiles.map((profile, i) => (
          <div
            key={profile.memberId}
            className="shrink-0 snap-start"
            style={{
              width: `calc(100% - ${profiles.length > 1 ? PEEK_WIDTH : 0}px)`,
              paddingLeft: i === 0 ? 0 : undefined,
              marginRight: i < profiles.length - 1 ? 0 : `${PEEK_WIDTH}px`,
            }}
          >
            <ProfileCard
              profile={profile}
              isExpanded={isExpanded}
              onToggleExpanded={toggleExpanded}
            />
          </div>
        ))}
      </div>

      {/* 인디케이터 도트 (슬라이딩 트랙 방식) */}
      {profiles.length > 1 && (
        <div className="mt-4 flex justify-center">
          {/* 도트 5개 너비 (6px * 5 + 6px 간격 * 4 = 54px) */}
          <div className="relative h-1.5 w-[54px] overflow-hidden">
            <div
              className="flex items-center gap-1.5 transition-transform duration-300 ease-out"
              style={{
                // 현재 인덱스를 중앙(2번째 칸)에 맞추기 위한 트랙 이동
                transform: `translateX(${
                  -Math.max(0, Math.min(profiles.length - 5, activeIndex - 2)) *
                  12
                }px)`,
              }}
            >
              {profiles.map((profile, i) => {
                // 현재 보여지는 5개 도트의 윈도우 범위 계산
                const windowStart = Math.max(
                  0,
                  Math.min(profiles.length - 5, activeIndex - 2),
                );
                const windowEnd = windowStart + 4;

                // 윈도우 안에 있는지 확인
                const isVisible = i >= windowStart && i <= windowEnd;
                // 윈도우의 양 끝 도트인지 확인 (더 있다는 표시로 작게 만듦)
                const isEdge =
                  (i === windowStart && i > 0) ||
                  (i === windowEnd && i < profiles.length - 1);

                return (
                  <div
                    key={`dot-${profile.memberId}`}
                    className={`shrink-0 rounded-full transition-all duration-300 ${
                      isVisible
                        ? isEdge
                          ? "h-1 w-1"
                          : "h-1.5 w-1.5"
                        : "h-0 w-0 opacity-0"
                    } ${
                      i === activeIndex
                        ? "bg-color-gray-800"
                        : "bg-color-gray-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSlider;
