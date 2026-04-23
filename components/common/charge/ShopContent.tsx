"use client";

import React from "react";
import { useItems } from "@/hooks/useItems";
import ChargeInventoryCard from "./ChargeInventoryCard";
import QuickBundleCard from "./QuickBundleCard";
import {
  QUICK_BUNDLES,
  INDIVIDUAL_ITEMS,
  BUNDLE_ITEMS,
  USAGE_INFO,
  BUSINESS_INFO,
} from "@/lib/constants/charge";

export default function ShopContent() {
  const { data } = useItems();

  const ticketCounts = {
    matching: data?.data.matchingTicketCount ?? 0,
    option: data?.data.optionTicketCount ?? 0,
  };

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
