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

interface ChargeDrawerProps {
  trigger: React.ReactNode;
}

/* ── 탭 정의 ── */
const TABS = [
  { label: "상점", title: "상점" },
  { label: "충전내역", title: "충전내역" },
  { label: "입금자명 설정", title: "입금자명 설정" },
] as const;

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
          {/* ── Header ── */}
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
          <div className="flex shrink-0 items-start gap-2 px-6 pt-6">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "typo-14-500 flex h-[33px] items-center justify-center rounded-full px-4",
                  activeTab === i
                    ? "bg-[#1A1A1A] text-white"
                    : "border border-[#E5E5E5] bg-[#F5F5F5] text-[#666666]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <ActiveContent />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
