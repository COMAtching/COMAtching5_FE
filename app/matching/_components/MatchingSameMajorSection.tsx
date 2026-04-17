"use client";

import { Check, Delete } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MatchingSameMajorSectionProps {
  onSameMajorToggle: (isSameMajorExclude: boolean) => void;
  isExcluded?: boolean;
}

export default function MatchingSameMajorSection({
  onSameMajorToggle,
  isExcluded = false,
}: MatchingSameMajorSectionProps) {
  const [showCheck, setShowCheck] = useState(false);
  const [prevExcluded, setPrevExcluded] = useState(isExcluded);

  if (isExcluded !== prevExcluded) {
    setPrevExcluded(isExcluded);
    if (isExcluded) {
      setShowCheck(true);
    }
  }

  useEffect(() => {
    if (isExcluded && showCheck) {
      const timer = setTimeout(() => {
        setShowCheck(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isExcluded, showCheck]);

  const handleMainClick = () => {
    if (!isExcluded) {
      setShowCheck(true);
      onSameMajorToggle(true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSameMajorToggle(false);
  };

  return (
    <button
      className="border-color-gray-100 flex w-full items-center justify-between border-b pb-5 text-left outline-none"
      onClick={handleMainClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-end gap-1">
          <h3 className="typo-20-700 text-color-text-black">
            같은과는 싫어요!
          </h3>
          <span className="typo-10-600 text-color-gray-400 mb-[3px] leading-[12px]">
            선택
          </span>
        </div>
        <p className="typo-14-500 text-color-text-caption3">
          CC를 방지할 수 있어요.
        </p>
      </div>
      {/* 옵션 전용 가격 뱃지 / 선택 완료 */}
      {isExcluded ? (
        <button
          className="bg-pink-gradient relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border border-[#F57DB2] transition-transform active:scale-95 disabled:opacity-50"
          onClick={handleDelete}
          disabled={showCheck}
          aria-label="같은과 제외 선택 취소"
        >
          {/* Check 아이콘 */}
          <div
            className={cn(
              "absolute flex items-center justify-center transition-opacity duration-300",
              showCheck ? "opacity-100" : "opacity-0",
            )}
          >
            <Check
              className="h-[14px] w-[14px] text-[#F57DB2]"
              strokeWidth={3}
            />
          </div>

          {/* Delete 아이콘 */}
          <div
            className={cn(
              "absolute flex items-center justify-center transition-opacity duration-300",
              !showCheck ? "opacity-100" : "opacity-0",
            )}
          >
            <Delete
              className="h-[20px] w-[20px] text-[#F57DB2]"
              strokeWidth={2}
            />
          </div>
        </button>
      ) : (
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
      )}
    </button>
  );
}
