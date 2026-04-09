"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { HOBBIES, HobbyCategory } from "@/lib/constants/hobbies";

interface MatchingHobbyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: HobbyCategory) => void;
  selectedCategory?: string;
}

export default function MatchingHobbyBottomSheet({
  isOpen,
  onClose,
  onSelect,
  selectedCategory,
}: MatchingHobbyBottomSheetProps) {
  const categories = Object.keys(HOBBIES) as HobbyCategory[];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="pb-10">
        <DrawerHeader className="text-left">
          <DrawerTitle className="typo-20-700 text-color-text-black">
            관심사 카테고리 선택
          </DrawerTitle>
          <p className="typo-14-500 text-color-text-caption3 mt-1">
            어떤 분야의 관심사를 가진 분을 찾으시나요?
          </p>
        </DrawerHeader>
        <div className="mt-2 flex flex-col px-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`border-color-gray-100 flex w-full items-center justify-between border-b py-4 transition-colors last:border-none ${
                selectedCategory === category
                  ? "text-color-main-700 font-bold"
                  : "text-color-text-black"
              }`}
              onClick={() => {
                onSelect(category);
                onClose();
              }}
            >
              <span className="typo-16-600">{category}</span>
              {selectedCategory === category && (
                <div className="bg-color-main-700 h-2 w-2 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
