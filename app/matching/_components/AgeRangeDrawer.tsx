"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface AgeRangeDrawerProps {
  trigger: React.ReactNode;
  minAge: number;
  maxAge: number;
  onConfirm: (minAge: number, maxAge: number) => void;
}

const MIN_AGE = 20;
const MAX_AGE = 29;
const ALL_AGES = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, i) => MIN_AGE + i,
);

export default function AgeRangeDrawer({
  trigger,
  minAge: initialMin,
  maxAge: initialMax,
  onConfirm,
}: AgeRangeDrawerProps) {
  const [localMin, setLocalMin] = useState(initialMin);
  const [localMax, setLocalMax] = useState(initialMax);

  // Drawer가 열릴 때 현재 값으로 리셋
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalMin(initialMin);
      setLocalMax(initialMax);
    }
  };

  const handleConfirm = () => {
    onConfirm(localMin, localMax);
  };

  const increaseMin = () => {
    if (localMin < localMax) setLocalMin((v) => v + 1);
  };
  const decreaseMin = () => {
    if (localMin > MIN_AGE) setLocalMin((v) => v - 1);
  };
  const increaseMax = () => {
    if (localMax < MAX_AGE) setLocalMax((v) => v + 1);
  };
  const decreaseMax = () => {
    if (localMax > localMin) setLocalMax((v) => v - 1);
  };

  return (
    <Drawer onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="pb-8 outline-none" showHandle={false}>
        <div className="flex flex-col px-6">
          <DrawerHeader className="gap-4 px-0 pt-6 pb-0">
            <div className="relative flex items-center justify-between">
              <div className="w-[40px]" />
              <DrawerTitle className="typo-16-700 text-color-text-black flex-1 text-center">
                나이 구간 설정
              </DrawerTitle>
              <DrawerClose className="typo-16-500 text-color-text-caption3 w-[40px] text-right">
                닫기
              </DrawerClose>
            </div>
            <p className="typo-14-500 text-color-text-caption3 text-center">
              원하는 나이 범위를 설정하세요.
            </p>
          </DrawerHeader>

          {/* 시각적 나이 구간 표시 */}
          <div className="mt-8">
            <div className="flex">
              {ALL_AGES.map((age, i) => {
                const isInRange = age >= localMin && age <= localMax;
                const isStart = age === localMin;
                const isEnd = age === localMax;
                const isFirst = i === 0;
                const isLast = i === ALL_AGES.length - 1;

                return (
                  <div
                    key={age}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    {/* 셀 */}
                    <div
                      className={cn(
                        "h-10 w-full border-y border-r transition-all duration-300",
                        // 첫 번째 셀 왼쪽 둥글게
                        isFirst && "rounded-l-lg border-l",
                        // 마지막 셀 오른쪽 둥글게
                        isLast && "rounded-r-lg",
                        // 선택 시작점 왼쪽 둥글게
                        isStart && !isFirst && "rounded-l-lg border-l",
                        // 선택 끝점 오른쪽 둥글게
                        isEnd && !isLast && "rounded-r-lg",
                        // 색상
                        isInRange
                          ? "border-[#ff4d61]/30 bg-gradient-to-b from-[#ff4d61]/20 to-[#ff775e]/10"
                          : "border-[#e8e8e8] bg-[#f8f8f8]",
                      )}
                    />
                    {/* 나이 레이블 */}
                    <span
                      className={cn(
                        "text-[11px] font-semibold transition-colors duration-300",
                        isInRange
                          ? "text-color-main-900"
                          : "text-color-text-disabled",
                      )}
                    >
                      {age}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +/- 조절 영역 */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {/* 최소 나이 조절 */}
            <div className="flex flex-col items-center gap-2">
              <span className="typo-12-500 text-color-text-caption3">
                최소 나이
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseMin}
                  disabled={localMin <= MIN_AGE}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white transition-all active:scale-95 disabled:opacity-30"
                >
                  <Minus size={16} className="text-color-text-black" />
                </button>
                <span className="typo-24-700 text-color-main-900 w-12 text-center">
                  {localMin}
                </span>
                <button
                  onClick={increaseMin}
                  disabled={localMin >= localMax}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white transition-all active:scale-95 disabled:opacity-30"
                >
                  <Plus size={16} className="text-color-text-black" />
                </button>
              </div>
            </div>

            {/* 구분선 */}
            <span className="typo-20-700 text-color-text-disabled mt-5">~</span>

            {/* 최대 나이 조절 */}
            <div className="flex flex-col items-center gap-2">
              <span className="typo-12-500 text-color-text-caption3">
                최대 나이
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseMax}
                  disabled={localMax <= localMin}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white transition-all active:scale-95 disabled:opacity-30"
                >
                  <Minus size={16} className="text-color-text-black" />
                </button>
                <span className="typo-24-700 text-color-main-900 w-12 text-center">
                  {localMax}
                </span>
                <button
                  onClick={increaseMax}
                  disabled={localMax >= MAX_AGE}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white transition-all active:scale-95 disabled:opacity-30"
                >
                  <Plus size={16} className="text-color-text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* 확인 버튼 */}
          <DrawerClose asChild>
            <Button onClick={handleConfirm} className="mt-8">
              확인
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
