"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import ShopContent from "@/components/common/charge/ShopContent";
import ChargeHistoryContent from "@/components/common/charge/ChargeHistoryContent";
import DepositorNameContent from "@/components/common/charge/DepositorNameContent";
import ChargeTabs from "@/components/common/charge/ChargeTabs";
import { TABS } from "@/lib/constants/charge";

/* ── Context ── */
interface ChargeDrawerContextType {
  setActiveTab: (index: number) => void;
}
export const ChargeDrawerContext =
  React.createContext<ChargeDrawerContextType | null>(null);

interface ChargeDrawerProps {
  trigger: React.ReactNode;
}

/* ── 탭별 콘텐츠 ── */
const TAB_CONTENT = [ShopContent, ChargeHistoryContent, DepositorNameContent];

/* ────────────────────────────────────── */

export default function ChargeDrawer({ trigger }: ChargeDrawerProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="rounded-t-[16px] bg-white outline-none"
        showHandle={false}
      >
        <div className="flex max-h-[90dvh] flex-col overflow-hidden">
          {/* ... */}
          <ChargeDrawerContext.Provider value={{ setActiveTab }}>
            <DrawerHeader className="shrink-0 gap-0 px-6 pt-6 pb-0">
              <div className="relative flex items-center justify-between">
                <div className="w-7" />
                <DrawerTitle className="typo-16-700 flex-1 text-center text-[#373737]">
                  {TABS[activeTab].title}
                </DrawerTitle>
                <DrawerClose className="typo-16-500 text-color-gray-400 w-7 text-right">
                  닫기
                </DrawerClose>
              </div>
            </DrawerHeader>

            {/* ── 탭 칩 ── */}
            <ChargeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <ActiveContent />
            </div>
          </ChargeDrawerContext.Provider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
