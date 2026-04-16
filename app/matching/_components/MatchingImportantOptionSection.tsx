"use client";

import { Check, Delete } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { ImportantOption } from "@/lib/types/matching";
import ImportantOptionDrawer from "./ImportantOptionDrawer";

interface MatchingImportantOptionSectionProps {
  onSelect: (option: ImportantOption | null) => void;
  selectedOption?: ImportantOption | null;
  selections?: Record<ImportantOption, string>;
}

export default function MatchingImportantOptionSection({
  onSelect,
  selectedOption,
  selections,
}: MatchingImportantOptionSectionProps) {
  const [showCheck, setShowCheck] = useState(false);
  const [prevSelected, setPrevSelected] = useState(selectedOption);

  if (selectedOption !== prevSelected) {
    setPrevSelected(selectedOption);
    if (selectedOption) {
      setShowCheck(true);
    }
  }

  useEffect(() => {
    if (selectedOption && showCheck) {
      const timer = setTimeout(() => {
        setShowCheck(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, showCheck]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <ImportantOptionDrawer
      onSelect={onSelect as (option: ImportantOption) => void}
      selectedOption={selectedOption}
      selections={selections}
      trigger={
        <div className="border-color-gray-100 flex w-full cursor-pointer items-center justify-between border-b pb-5 text-left">
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
            </p>
          </div>
          {/* 가격 뱃지 / 선택 완료 */}
          {selectedOption ? (
            <div
              className="bg-pink-gradient relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border border-[#F57DB2]"
              onClick={!showCheck ? handleDelete : undefined}
            >
              {/* Check 아이콘 */}
              <div
                className={`absolute flex items-center justify-center transition-opacity duration-300 ${
                  showCheck ? "opacity-100" : "opacity-0"
                }`}
              >
                <Check
                  className="h-[14px] w-[14px] text-[#F57DB2]"
                  strokeWidth={3}
                />
              </div>

              {/* Delete 아이콘 */}
              <div
                className={`absolute flex items-center justify-center transition-opacity duration-300 ${
                  !showCheck ? "opacity-100" : "opacity-0"
                }`}
              >
                <Delete
                  className="h-[20px] w-[20px] text-[#F57DB2]"
                  strokeWidth={2}
                />
              </div>
            </div>
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
        </div>
      }
    />
  );
}
