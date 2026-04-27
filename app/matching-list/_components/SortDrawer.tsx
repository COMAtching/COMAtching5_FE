"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Check } from "lucide-react";

export type SortOrder = "oldest" | "newest" | "age";

interface SortOption {
  value: SortOrder;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "oldest", label: "오래된순" },
  { value: "newest", label: "최신순" },
  { value: "age", label: "나이순" },
];

interface SortDrawerProps {
  currentSort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  trigger: React.ReactNode;
}

export default function SortDrawer({
  currentSort,
  onSortChange,
  trigger,
}: SortDrawerProps) {
  const [selected, setSelected] = useState<SortOrder>(currentSort);

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="rounded-t-[32px] bg-white outline-none"
        showHandle={false}
      >
        <div className="flex flex-col items-center gap-[10px] px-6 pt-6 pb-12">
          {/* 옵션 리스트 */}
          <div className="flex w-full flex-col gap-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelected(option.value)}
                  className={`flex w-full items-center justify-between rounded-[16px] px-4 py-[14px] transition-colors ${
                    isActive ? "bg-[#F2F2F2]" : "bg-transparent"
                  }`}
                >
                  <span
                    className={`text-[16px] leading-[19px] font-medium ${
                      isActive ? "text-[#1A1A1A]" : "text-[#999999]"
                    }`}
                  >
                    {option.label}
                  </span>
                  {isActive && <Check size={16} className="text-[#1A1A1A]" />}
                </button>
              );
            })}
          </div>

          {/* 확인 버튼 */}
          <DrawerClose asChild>
            <button
              type="button"
              onClick={() => onSortChange(selected)}
              className="flex w-full items-center justify-center rounded-[16px] bg-[#F2F2F2] px-4 py-4"
            >
              <span className="text-[16px] leading-[19px] font-medium text-[#1A1A1A]">
                확인
              </span>
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
