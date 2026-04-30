"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import AgeRangeDrawer from "./AgeRangeDrawer";

interface MatchingAgeOptionProps {
  onAgeRangeSelect: (minAge: number, maxAge: number) => void;
  onReset: () => void;
  minAge?: number;
  maxAge?: number;
}

const DEFAULT_MIN = 20;
const DEFAULT_MAX = 29;

export default function MatchingAgeOption({
  onAgeRangeSelect,
  onReset,
  minAge,
  maxAge,
}: MatchingAgeOptionProps) {
  const isSelected = minAge !== undefined && maxAge !== undefined;
  const [showCheck, setShowCheck] = useState(false);

  const handleConfirm = (min: number, max: number) => {
    onAgeRangeSelect(min, max);
    setShowCheck(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onReset();
  };

  useEffect(() => {
    if (showCheck) {
      const timer = setTimeout(() => setShowCheck(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCheck]);

  const displayText =
    isSelected && minAge === maxAge
      ? `${minAge}살`
      : isSelected
        ? `${minAge}~${maxAge}살`
        : "";

  // 선택된 상태: Delete 버튼은 Drawer 밖에서 독립적으로 동작
  if (isSelected) {
    return (
      <div className="border-color-gray-100 flex w-full items-center justify-between border-b pb-5">
        <AgeRangeDrawer
          minAge={minAge ?? DEFAULT_MIN}
          maxAge={maxAge ?? DEFAULT_MAX}
          onConfirm={handleConfirm}
          trigger={
            <button className="flex flex-col gap-1 text-left outline-none">
              <h2 className="typo-20-700 text-color-text-black">
                나이 구간 선택하기
              </h2>
              <p className="typo-14-500 text-color-text-caption3">
                선택됨: {displayText}
              </p>
            </button>
          }
        />
        {/* Delete 버튼: Drawer 트리거 밖에 위치 */}
        <button
          className="bg-pink-gradient border-color-pink-700 relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border transition-transform active:scale-95 disabled:opacity-50"
          onClick={handleDelete}
          disabled={showCheck}
          aria-label="나이 설정 삭제"
        >
          <div
            className={cn(
              "absolute flex items-center justify-center transition-opacity duration-300",
              showCheck ? "opacity-100" : "opacity-0",
            )}
          >
            <Check
              className="text-color-pink-700 h-[14px] w-[14px]"
              strokeWidth={3}
            />
          </div>
          <div
            className={cn(
              "absolute flex items-center justify-center transition-opacity duration-300",
              !showCheck ? "opacity-100" : "opacity-0",
            )}
          >
            <Delete
              className="text-color-pink-700 h-[20px] w-[20px]"
              strokeWidth={2}
            />
          </div>
        </button>
      </div>
    );
  }

  // 미선택 상태: 전체가 Drawer 트리거
  return (
    <AgeRangeDrawer
      minAge={DEFAULT_MIN}
      maxAge={DEFAULT_MAX}
      onConfirm={handleConfirm}
      trigger={
        <button className="border-color-gray-100 flex w-full items-center justify-between border-b pb-5 text-left outline-none">
          <div className="flex flex-col gap-1">
            <h2 className="typo-20-700 text-color-text-black">
              나이 구간 선택하기
            </h2>
            <p className="typo-14-500 text-color-text-caption3">
              원하는 나이 범위를 설정해 보세요!
            </p>
          </div>
          <div className="border-color-gray-100 flex h-9 w-[86px] items-center justify-center gap-[5px] rounded-[36px] border bg-white px-2">
            <Image
              src="/main/elec-bulb.png"
              alt="bulb"
              width={20}
              height={20}
              className="shrink-0"
            />
            <span className="typo-16-700 text-color-text-black leading-[19px]">
              1
            </span>
          </div>
        </button>
      }
    />
  );
}
