"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// 컴포넌트 내부에 직접 데이터 정의
const FREE_ROULETTE_ITEMS = [
  { reward: "옵션권 1장", probability: "45%" },
  { reward: "옵션권 2장", probability: "25%" },
  { reward: "꽝", probability: "15%" },
  { reward: "뽑기권 1장", probability: "12%" },
  { reward: "풀세트(뽑기권 1장 + 옵션권 3장)", probability: "3%" },
];

const SPECIAL_ROULETTE_ITEMS = [
  { reward: "옵션권 2장", probability: "39%" },
  { reward: "옵션권 5장", probability: "25%" },
  { reward: "뽑기권 1장", probability: "18%" },
  { reward: "풀세트", probability: "10%" },
  { reward: "뽑기권 5장", probability: "3%" },
  { reward: "뽑기권 10장", probability: "2%" },
  { reward: "1만원권 상품권", probability: "2%" },
  { reward: "2만원권 상품권", probability: "1%" },
];

export interface RouletteProbabilityBottomSheetProps {
  /** 바텀시트를 열 트리거 엘리먼트 */
  trigger?: React.ReactNode;
  /** 처음에 보여줄 기본 탭 (기본값: "free") */
  defaultTab?: "free" | "special";
  /** DrawerContent 추가 클래스명 */
  className?: string;
  /** Controlled state (open) */
  open?: boolean;
  /** Controlled state (onOpenChange) */
  onOpenChange?: (open: boolean) => void;
}

export default function RouletteProbabilityBottomSheet({
  trigger,
  defaultTab = "free",
  className,
  open,
  onOpenChange,
}: RouletteProbabilityBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<"free" | "special">(defaultTab);

  const currentItems =
    activeTab === "free" ? FREE_ROULETTE_ITEMS : SPECIAL_ROULETTE_ITEMS;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        showHandle={false}
        className={cn(
          "z-[100] mx-auto w-full max-w-[430px] rounded-t-[16px] border-none bg-white p-0 outline-none",
          className,
        )}
      >
        {/* Header Section (DirectChargeDrawer 계좌이체 모달 헤더 구조 + 중앙 정렬) */}
        <DrawerHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="w-5" />
            <DrawerTitle className="typo-16-600 flex-1 text-center font-sans text-black">
              당첨 확률
            </DrawerTitle>
            <DrawerClose aria-label="닫기" className="cursor-pointer">
              <X size={20} className="text-color-gray-400" />
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            룰렛 보상 및 당첨 확률 안내 바텀시트입니다.
          </DrawerDescription>
        </DrawerHeader>

        {/* Content Section */}
        <div className="flex max-h-[60vh] flex-col overflow-y-auto px-5 pt-8 pb-25">
          {/* Tabs (Chips) - Frame 2612797 */}
          <div className="mb-6 flex flex-row items-start gap-2">
            <button
              onClick={() => setActiveTab("free")}
              className={cn(
                "flex h-[33px] flex-row items-center justify-center gap-2 rounded-[99px] px-4 py-2 transition-colors",
                activeTab === "free"
                  ? "bg-[#1A1A1A] text-[#FFFFFF]"
                  : "box-border border border-[#E5E5E5] bg-[#F5F5F5] text-[#666666]",
              )}
            >
              <span className="typo-14-500">무료 룰렛</span>
            </button>
            <button
              onClick={() => setActiveTab("special")}
              className={cn(
                "flex h-[33px] flex-row items-center justify-center gap-2 rounded-[99px] px-4 py-2 transition-colors",
                activeTab === "special"
                  ? "bg-[#1A1A1A] text-[#FFFFFF]"
                  : "box-border border border-[#E5E5E5] bg-[#F5F5F5] text-[#666666]",
              )}
            >
              <span className="typo-14-500">스페셜 룰렛</span>
            </button>
          </div>

          {/* List Container - Frame 1171276922 */}
          <div className="flex w-full flex-col items-start gap-2">
            <span className="typo-16-700 text-[#373737]">
              {activeTab === "free" ? "무료 룰렛" : "스페셜 룰렛"}
            </span>

            {/* Frame 1171276921 */}
            <div className="flex w-full flex-col items-start p-2">
              {/* Header - Frame 1171276915 */}
              <div className="flex w-full flex-row items-center justify-between border-b-[2px] border-[#1A1A1A] py-2">
                <span className="typo-14-600 text-[#1A1A1A]">보상</span>
                <span className="typo-14-600 w-[44px] text-center text-[#1A1A1A]">
                  확률
                </span>
              </div>

              {/* Items List - Frame 1171276920 */}
              <div className="flex w-full flex-col items-start py-2">
                {currentItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-row items-center justify-between py-2"
                  >
                    <span className="typo-14-500 text-[#808080]">
                      {item.reward}
                    </span>
                    <span className="typo-14-500 w-[44px] text-center text-[#808080]">
                      {item.probability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { RouletteProbabilityBottomSheet as RouletteProbabilityDrawer };
