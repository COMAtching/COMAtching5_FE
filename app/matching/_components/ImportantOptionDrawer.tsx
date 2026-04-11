import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ImportantOption } from "@/lib/types/matching";

interface ImportantOptionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (option: ImportantOption) => void;
  selectedOption?: ImportantOption | null;
}

export default function ImportantOptionDrawer({
  open,
  onOpenChange,
  onSelect,
  selectedOption,
}: ImportantOptionDrawerProps) {
  const options: { label: string; value: ImportantOption }[] = [
    { label: "MBTI", value: "MBTI" },
    { label: "나이", value: "AGE" },
    { label: "관심사", value: "HOBBY" },
    { label: "연락빈도", value: "CONTACT" },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-auto pb-10" showHandle={false}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="typo-20-700 text-color-text-black">
            가장 중요한 옵션 선택
          </DrawerTitle>
          <p className="typo-14-500 text-color-text-caption3 mt-1">
            AI가 어떤 조건을 최우선으로 고려하면 좋을까요?
          </p>
        </DrawerHeader>
        <div className="mt-2 flex flex-col px-4">
          {options.map((option) => (
            <button
              key={option.value}
              className={`border-color-gray-100 flex w-full items-center justify-between border-b py-4 transition-colors last:border-none ${
                selectedOption === option.value
                  ? "text-color-main-700 font-bold"
                  : "text-color-text-black"
              }`}
              onClick={() => {
                onSelect(option.value);
                onOpenChange(false);
              }}
            >
              <span className="typo-16-600">{option.label}</span>
              {selectedOption === option.value && (
                <div className="bg-color-main-700 h-2 w-2 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
