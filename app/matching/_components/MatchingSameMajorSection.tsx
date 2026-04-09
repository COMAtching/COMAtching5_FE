"use client";

import Image from "next/image";
import React from "react";

interface MatchingSameMajorSectionProps {
  onSameMajorToggle: (isSameMajorExclude: boolean) => void;
  isExcluded?: boolean;
}

export default function MatchingSameMajorSection({
  onSameMajorToggle,
  isExcluded = false,
}: MatchingSameMajorSectionProps) {
  const handleToggle = (value: boolean) => {
    onSameMajorToggle(value);
  };

  return (
    <button
      className="border-color-gray-100 flex w-full cursor-pointer items-center justify-between border-b pb-5 text-left"
      onClick={() => handleToggle(!isExcluded)}
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
      {/* 옵션 전용 가격 뱃지 */}
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
  );
}
