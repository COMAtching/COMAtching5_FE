"use client";

import Image from "next/image";
import React from "react";

import { ImportantOption } from "@/lib/types/matching";
import ImportantOptionDrawer from "./ImportantOptionDrawer";

interface MatchingImportantOptionSectionProps {
  onSelect: (option: ImportantOption) => void;
  selectedOption?: ImportantOption | null;
}

export default function MatchingImportantOptionSection({
  onSelect,
  selectedOption,
}: MatchingImportantOptionSectionProps) {
  const options: { label: string; value: ImportantOption }[] = [
    { label: "MBTI", value: "MBTI" },
    { label: "나이", value: "AGE" },
    { label: "관심사", value: "HOBBY" },
    { label: "연락빈도", value: "CONTACT" },
  ];

  return (
    <ImportantOptionDrawer
      onSelect={onSelect}
      selectedOption={selectedOption}
      trigger={
        <button className="border-color-gray-100 flex w-full items-center justify-between border-b pb-5 text-left">
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-1">
              <h2 className="typo-20-700 text-color-text-black">
                중요한 옵션 선택하기
              </h2>
              <span className="typo-10-600 text-color-flame-700 mb-[3px] leading-[12px]">
                추천
              </span>
            </div>
            <p className="typo-14-500 text-color-text-caption3">
              AI에게 가장 중요한 옵션을 알려주세요!
              {selectedOption && (
                <span className="text-color-main-700 ml-2 font-bold">
                  (선택됨:{" "}
                  {options.find((o) => o.value === selectedOption)?.label})
                </span>
              )}
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
        </button>
      }
    />
  );
}
