"use client";

import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ShopContent from "@/components/common/charge/ShopContent";
import ChargeHistoryContent from "@/components/common/charge/ChargeHistoryContent";
import DepositorNameContent from "@/components/common/charge/DepositorNameContent";
import ChargeTabs from "@/components/common/charge/ChargeTabs";
import { TABS } from "@/lib/constants/charge";
import { useFeature } from "@/stores/features";

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
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const pageScrollY = React.useRef(0);
  const [activeTab, setActiveTab] = React.useState(0);

  const shop = useFeature("SHOP_PAYMENT");
  const ActiveContent = TAB_CONTENT[activeTab];

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) pageScrollY.current = window.scrollY;
    if (newOpen && shop && !shop.open) setActiveTab(0);
    setOpen(newOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} autoFocus>
      <DrawerTrigger ref={triggerRef} asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent
        data-shop-sheet=""
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => {
            if (!triggerRef.current?.isConnected) return;
            triggerRef.current.focus({ preventScroll: true });
            window.scrollTo({ top: pageScrollY.current, behavior: "instant" });
          });
        }}
        className="rounded-t-[16px] bg-white outline-none"
        showHandle={false}
      >
        <div className="flex h-[90vh] flex-col overflow-hidden">
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
            <div className="relative z-10 shrink-0 bg-white pb-2">
              <ChargeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {/* 스크롤 시 뚝 끊기지 않도록 가려주는 그라데이션 */}
              <div className="pointer-events-none absolute top-full left-0 h-6 w-full bg-gradient-to-b from-white to-transparent" />
            </div>

            {/* ── Scrollable Content ── */}
            <div className="scrollbar-hide relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-8">
              {activeTab === 0 && shop && !shop.open ? (
                <section className="flex min-h-[200px] flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                  <div role="status">
                    <h3 className="typo-16-600 text-[#373737]">
                      상점 운영이 종료됐어요
                    </h3>
                    {shop.message?.trim() && (
                      <p className="typo-14-500 mt-2 [overflow-wrap:anywhere] whitespace-pre-line text-gray-600">
                        {shop.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="typo-14-500 px-2 py-2 text-gray-600 underline underline-offset-4"
                    onClick={() => setActiveTab(1)}
                  >
                    충전내역 보기
                  </button>
                </section>
              ) : activeTab === 0 && !shop ? (
                <LoadingSpinner label="상점 운영 상태 확인 중" />
              ) : (
                <ActiveContent />
              )}
            </div>
          </ChargeDrawerContext.Provider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
