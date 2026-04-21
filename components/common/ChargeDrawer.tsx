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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/useItems";

interface ChargeDrawerProps {
  trigger: React.ReactNode;
}

/* ── 카테고리 칩 ── */
const CATEGORIES = ["전체", "뽑기권", "번들+옵션권"] as const;

/* ── 아이콘 사이즈 ── */
const ICON_SIZE = { sm: 24, lg: 80 } as const;

/* ── 보유현황 아이콘·라벨 ── */
const INVENTORY_ROWS = [
  {
    icon: "/main/coin.png",
    alt: "coin",
    label: "보유 뽑기권",
    key: "matching",
  },
  {
    icon: "/main/elec-bulb.png",
    alt: "bulb",
    label: "보유 아이템",
    key: "option",
  },
] as const;

/* ── 구매 가능 한도 (임시) ── */
const PURCHASE_LIMITS = {
  matching: { current: 18, max: 30, label: "뽑기권" },
  option: { current: 42, max: 60, label: "아이템" },
} as const;

/* ── 빠른 구매 번들 카드 ── */
const QUICK_BUNDLES = [
  {
    title: "실속 번들",
    icon: "/main/coin.png",
    description: "뽑기권 5개+옵션권 2개",
    bonus: "옵션권 1개 무료 증정!",
    price: "5,000원",
  },
  {
    title: "슈퍼 번들",
    icon: "/main/coin.png",
    description: "뽑기권 10개+옵션권 10개",
    bonus: "옵션권 5개 무료 증정!",
    price: "10,000원",
  },
] as const;

/* ── 전체(개별) 아이템 ── */
const INDIVIDUAL_ITEMS = [
  { label: "뽑기권 1개", price: "1,000원" },
  { label: "옵션권 1개", price: "500원" },
] as const;

/* ── 번들 아이템 ── */
const BUNDLE_ITEMS = [
  {
    title: "미니 번들",
    description: "옵션권 3개",
    bonus: "옵션권 1개 무료 증정!",
    price: "2,500원",
  },
  {
    title: "실속 번들",
    description: "뽑기권 5개+옵션권 2개",
    bonus: "옵션권 1개 무료 증정!",
    price: "5,000원",
  },
  {
    title: "슈퍼 번들",
    description: "뽑기권 10개+옵션권 10개",
    bonus: "옵션권 5개 무료 증정!",
    price: "10,000원",
  },
] as const;

/* ── 이용안내 텍스트 ── */
const USAGE_INFO = `충전된 포인트의 소멸시효 기한은 충전 후 5년입니다.
1 포인트는 1원입니다.
충전한 포인트로 서비스를 이용할 수 있습니다.
포인트는 이벤트 포인트 먼저 사용되고, 유상 포인트가 사용됩니다.
이벤트 포인트는 유효기한이 임박한 순으로 먼저 사용됩니다.
유효기간은 포인트 충전내역을 통해 확인하실 수 있습니다.`;

const BUSINESS_INFO =
  "대표이사 천승환 | 호스팅서비스사업자 코매칭 | 사업자 등록번호 843-27-01742 | 통신판매신고 2024-부천원미-2812 | 대표전화 010-3039-7387 | 경기도 부천시 조마루로 366번길 27, 401호";

/* ────────────────────────────────────── */

export default function ChargeDrawer({ trigger }: ChargeDrawerProps) {
  const [activeCategory, setActiveCategory] = React.useState(0);
  const { data } = useItems();

  const ticketCounts: Record<string, number> = {
    matching: data?.data.matchingTicketCount ?? 0,
    option: data?.data.optionTicketCount ?? 0,
  };

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
                상점
              </DrawerTitle>
              <DrawerClose className="typo-16-500 text-color-gray-400 w-7 text-right">
                닫기
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <div className="flex flex-col gap-8 pt-8">
              {/* ── 카테고리 칩 ── */}
              <div className="flex items-start gap-2">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(i)}
                    className={cn(
                      "typo-14-500 flex h-[33px] items-center justify-center rounded-full px-4",
                      activeCategory === i
                        ? "bg-color-gray-900 text-white"
                        : "border-color-gray-100 bg-color-gray-50 text-color-text-caption1 border",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* ── 보유현황 카드 ── */}
              <div className="bg-color-gray-50 flex flex-col gap-2 rounded-[16px] p-4">
                {/* 보유 수량 */}
                <div className="border-color-gray-100 flex flex-col gap-2 border-b pb-3">
                  {INVENTORY_ROWS.map((row) => (
                    <div key={row.key} className="flex items-center gap-2">
                      <Image
                        src={row.icon}
                        alt={row.alt}
                        width={ICON_SIZE.sm}
                        height={ICON_SIZE.sm}
                      />
                      <div className="flex items-center gap-8">
                        <span className="typo-10-600 text-color-gray-400">
                          {row.label}
                        </span>
                        <span className="typo-16-700 text-color-text-black">
                          {ticketCounts[row.key]}개
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 구매 가능 한도 */}
                <div className="flex items-center justify-between py-1">
                  <span className="typo-10-600 text-color-gray-400">
                    구매 가능 한도
                  </span>
                  <div className="flex items-center gap-6">
                    {Object.values(PURCHASE_LIMITS).map((limit) => (
                      <span
                        key={limit.label}
                        className="typo-10-600 text-color-gray-400"
                      >
                        {limit.label} {limit.current}/{limit.max}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 빠른 구매 ── */}
              <div className="flex flex-col gap-4">
                <span className="typo-16-700 text-[#373737]">빠른 구매</span>
                <div className="flex gap-2">
                  {QUICK_BUNDLES.map((bundle) => (
                    <div
                      key={bundle.title}
                      className="border-color-gray-64 bg-color-gray-50 flex flex-1 flex-col items-center justify-between rounded-[16px] border p-2 pt-4"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Image
                          src={bundle.icon}
                          alt="coin"
                          width={ICON_SIZE.lg}
                          height={ICON_SIZE.lg}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <span className="typo-16-600 text-color-gray-800">
                            {bundle.title}
                          </span>
                          <div className="flex flex-col items-center gap-1">
                            <span className="typo-12-600 text-color-gray-400 text-center">
                              {bundle.description}
                            </span>
                            <span className="typo-12-600 text-color-flame-700 text-center">
                              {bundle.bonus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="typo-16-600 bg-color-flame-700 mt-4 flex h-10 w-full items-center justify-center rounded-[8px] text-white"
                      >
                        {bundle.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 전체 ── */}
              <div className="flex flex-col gap-1">
                <span className="typo-16-700 text-[#373737]">전체</span>
                <div className="flex flex-col">
                  {INDIVIDUAL_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="border-color-gray-100 flex items-center justify-between border-b py-4"
                    >
                      <span className="typo-16-600 text-color-text-black">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        className="typo-16-600 bg-color-flame-700 flex h-10 w-24 items-center justify-center rounded-[8px] text-white"
                      >
                        {item.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 번들 ── */}
              <div className="flex flex-col gap-1">
                <span className="typo-16-700 text-[#373737]">번들</span>
                <div className="flex flex-col">
                  {BUNDLE_ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className="border-color-gray-100 flex items-center justify-between border-b py-4"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="typo-16-600 text-color-text-black">
                            {item.title}
                          </span>
                          <span className="typo-10-600 text-color-text-caption2">
                            {item.description}
                          </span>
                        </div>
                        <span className="typo-10-600 text-color-flame-700">
                          {item.bonus}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="typo-16-600 bg-color-flame-700 flex h-10 w-24 shrink-0 items-center justify-center rounded-[8px] text-white"
                      >
                        {item.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 이용안내 ── */}
              <div className="flex flex-col gap-2 pt-6">
                <span className="typo-10-600 text-color-gray-400">
                  이용안내
                </span>
                <div className="flex flex-col gap-2">
                  <p className="typo-10-500 text-color-gray-400 leading-[180%] whitespace-pre-line">
                    {USAGE_INFO}
                  </p>
                  <p className="typo-10-500 text-color-gray-400 leading-[140%]">
                    {BUSINESS_INFO}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
