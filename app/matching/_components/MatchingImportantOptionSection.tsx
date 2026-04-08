"use client";

import Image from "next/image";
import React, { useState } from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingImportantOptionSectionProps {
  onSameMajorToggle: (isSameMajorExclude: boolean) => void;
  isExcluded?: boolean;
}

export default function MatchingImportantOptionSection({
  onSameMajorToggle,
  isExcluded = false,
}: MatchingImportantOptionSectionProps) {
  const [excluded, setExcluded] = useState(isExcluded);

  const handleToggle = (value: boolean) => {
    setExcluded(value);
    onSameMajorToggle(value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. 섹션 헤더 영역 */}
      <div className="border-color-gray-100 flex items-center justify-between border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-1">
            <label className="typo-20-700 text-color-text-black">
              중요한 옵션 선택하기
            </label>
            <span className="typo-10-600 text-color-flame-700 mb-[3px] leading-[12px]">
              추천
            </span>
          </div>
          <p className="typo-14-500 text-color-text-caption3">
            AI에게 가장 중요한 옵션을 알려주세요!
          </p>
        </div>
        {/* 가격 뱃지 */}
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
      </div>

      {/* 2. 같은과는 싫어요! 옵션 섹션 */}
      <div
        className="border-color-gray-100 flex cursor-pointer items-center justify-between border-b pb-5"
        onClick={() => handleToggle(!excluded)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-1">
            <label className="typo-20-700 text-color-text-black">
              같은과는 싫어요!
            </label>
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
      </div>
    </div>
  );
}
