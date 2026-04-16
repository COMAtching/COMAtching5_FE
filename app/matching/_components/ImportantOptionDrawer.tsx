import { ArrowUpToLine } from "lucide-react";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ImportantOption } from "@/lib/types/matching";
import { cn } from "@/lib/utils";
import MatchingOptionCard from "./MatchingOptionCard";

interface ImportantOptionDrawerProps {
  trigger: React.ReactNode;
  onSelect: (option: ImportantOption) => void;
  selectedOption?: ImportantOption | null;
  selections?: Record<ImportantOption, string>;
}

export default function ImportantOptionDrawer({
  trigger,
  onSelect,
  selectedOption,
  selections = {
    MBTI: "미선택",
    AGE: "미선택",
    HOBBY: "미선택",
    CONTACT: "미선택",
  },
}: ImportantOptionDrawerProps) {
  const options: { label: string; value: ImportantOption }[] = [
    { label: "MBTI", value: "MBTI" },
    { label: "관심사", value: "HOBBY" },
    { label: "나이", value: "AGE" },
    { label: "연락빈도", value: "CONTACT" },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-auto pb-10" showHandle={false}>
        <DrawerHeader className="gap-4 px-4 pb-2">
          <div className="relative flex items-center justify-between">
            {/* 좌측 스페이서 (닫기 버튼과 동일한 너비를 가져야 타이틀이 정중앙에 위치함) */}
            <div className="w-[40px]" />

            <DrawerTitle className="typo-20-700 text-color-text-black flex-1 text-center">
              중요한 옵션 선택
            </DrawerTitle>

            <DrawerClose className="w-[40px] text-right text-[16px] leading-[19px] font-medium text-[#999999]">
              닫기
            </DrawerClose>
          </div>
          <p className="typo-14-500 text-color-gray-400 text-center leading-[17px]">
            가장 중요하게 생각하는 옵션을 하나 선택하세요.
            <br />
            선택한 조건을 반드시 만족하는 사람만 추천해 줄 거에요!
          </p>
        </DrawerHeader>

        <div className="flex flex-col items-center justify-center gap-[12px] py-8">
          <ArrowUpToLine className="h-6 w-6 text-[#B3B3B3]" strokeWidth={2} />
          <span className="text-center text-[14px] leading-[17px] font-medium text-[#B3B3B3]">
            중요한 옵션을 위에 올려놓으세요!
          </span>
        </div>

        <div className="flex flex-col gap-2 px-4">
          {options.map((option) => (
            <MatchingOptionCard
              key={option.value}
              label={option.label}
              value={option.value}
              isSelected={selectedOption === option.value}
              selectionLabel={selections[option.value]}
              onClick={() => onSelect(option.value)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
