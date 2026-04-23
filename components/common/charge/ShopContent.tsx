"use client";

import React from "react";
import { useItems } from "@/hooks/useItems";
import ChargeInventoryCard from "./ChargeInventoryCard";
import QuickBundleCard from "./QuickBundleCard";
import { ShopItemRow } from "./ShopRows";
import { ShopBundleRow } from "./ShopRows";
import {
  QUICK_BUNDLES,
  SHOP_ITEMS_API,
  USAGE_INFO,
  BUSINESS_INFO,
} from "@/lib/constants/charge";

export default function ShopContent() {
  const { data } = useItems();

  const ticketCounts = {
    matching: data?.data.matchingTicketCount ?? 0,
    option: data?.data.optionTicketCount ?? 0,
  };

  // 개별 아이템: 리워드가 1개인 경우
  const individualItems = SHOP_ITEMS_API.filter(
    (item) => item.rewards.length === 1,
  );

  // 번들 아이템: 리워드가 2개 이상인 경우
  const bundleItems = SHOP_ITEMS_API.filter((item) => item.rewards.length >= 2);

  return (
    <div className="flex flex-col gap-8 pt-8">
      {/* ── 보유현황 카드 ── */}
      <ChargeInventoryCard ticketCounts={ticketCounts} />

      {/* ── 빠른 구매 ── */}
      <div className="flex flex-col gap-4">
        <span className="typo-16-700 text-[#373737]">빠른 구매</span>
        <div className="flex gap-2">
          {QUICK_BUNDLES.map((bundle) => (
            <QuickBundleCard key={bundle.title} {...bundle} />
          ))}
        </div>
      </div>

      {/* ── 전체 ── */}
      <div className="flex flex-col gap-1">
        <span className="typo-16-700 text-[#373737]">전체</span>
        <div className="flex flex-col">
          {individualItems.map((item) => (
            <ShopItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ── 번들 ── */}
      <div className="flex flex-col gap-1">
        <span className="typo-16-700 text-[#373737]">번들</span>
        <div className="flex flex-col">
          {bundleItems.map((item) => (
            <ShopBundleRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ── 이용안내 ── */}
      <div className="flex flex-col gap-2 pt-6">
        <span className="typo-10-600 text-color-gray-400">이용안내</span>
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
  );
}
