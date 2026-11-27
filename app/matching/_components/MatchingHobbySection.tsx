"use client";

import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";

import {
  MATCHING_INTEREST_ITEMS,
  type MatchingInterestCategory,
} from "@/lib/constants/matchingInterests";
import { DrawerClose, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

import {
  MatchingPreferenceDrawer,
  MatchingDrawerClose,
} from "./MatchingPreferenceDrawer";

interface MatchingHobbySectionProps {
  onSelect: (category: MatchingInterestCategory) => void;
  selectedCategory?: MatchingInterestCategory | "";
}

export default function MatchingHobbySection({
  onSelect,
  selectedCategory,
}: MatchingHobbySectionProps) {
  return (
    <div className="border-color-gray-100 w-full border-b pb-5">
      <MatchingPreferenceDrawer
        showHandle
        className="pb-[max(1rem,env(safe-area-inset-bottom))]"
        trigger={
          <button
            type="button"
            className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left"
          >
            <span>
              <span
                className={cn(
                  "text-color-text-black block",
                  selectedCategory ? "typo-18-700" : "typo-20-700",
                )}
              >
                관심사
              </span>
              {!selectedCategory && (
                <span className="typo-14-500 text-color-text-caption3 mt-1 block">
                  상대방이 가졌음 하는 관심사를 골라주세요.
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {selectedCategory && (
                <>
                  <Check
                    aria-hidden="true"
                    size={18}
                    className="text-color-flame-700"
                  />
                  <span className="typo-16-600 text-color-text-black">
                    {selectedCategory}
                  </span>
                </>
              )}
              <ChevronRight
                aria-hidden="true"
                size={20}
                className="text-color-text-caption3"
              />
            </span>
          </button>
        }
      >
        <DrawerHeader data-vaul-no-drag className="shrink-0 px-5 text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="typo-20-700 text-color-text-black">
              관심사 선택
            </DrawerTitle>
            <MatchingDrawerClose />
          </div>
          <p className="typo-14-500 text-color-text-caption3 mt-1 leading-tight">
            상대방이 가졌음 하는 관심사를 골라주세요. <br />
            중분류만 선택할 수 있어요.
          </p>
        </DrawerHeader>
        <div
          data-vaul-no-drag
          className="mt-4 grid min-h-0 grid-cols-2 place-items-center gap-x-4 gap-y-6 overflow-y-auto overscroll-contain px-4 pb-3"
        >
          {MATCHING_INTEREST_ITEMS.map(({ category, imageSrc }) => (
            <DrawerClose key={category} asChild>
              <button
                type="button"
                onClick={() => onSelect(category)}
                className={cn(
                  "flex h-[148px] w-[148px] flex-col items-center justify-center gap-2 rounded-full border transition-all",
                  selectedCategory === category
                    ? "bg-pink-gradient border-color-pink-700"
                    : "border-color-gray-100 bg-white",
                )}
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={imageSrc}
                    alt={category}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="typo-16-600 text-color-text-black">
                  {category}
                </span>
              </button>
            </DrawerClose>
          ))}
        </div>
      </MatchingPreferenceDrawer>
    </div>
  );
}
