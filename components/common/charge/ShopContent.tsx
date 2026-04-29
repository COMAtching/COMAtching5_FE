"use client";

import React from "react";
import { useShopProducts } from "@/hooks/useShopProducts";
import ChargeInventoryCard from "./ChargeInventoryCard";
import QuickBundleCard from "./QuickBundleCard";
import { ShopItemRow } from "./ShopRows";
import { ShopBundleRow } from "./ShopRows";
import { USAGE_INFO, BUSINESS_INFO } from "@/lib/constants/charge";
import { Loader2 } from "lucide-react";

export default function ShopContent() {
  const { data: productsData, isLoading: isProductsLoading } =
    useShopProducts();

  const products = productsData?.data ?? [];

  // 개별 아이템: isBundle이 false인 경우
  const individualItems = products.filter((item) => !item.isBundle);

  // 번들 아이템: isBundle이 true인 경우 -> 빠른 구매/번들 상세
  const bundleItems = products.filter((item) => item.isBundle);

  return (
    <div className="flex flex-col gap-8 pt-8">
      {/* ── 보유현황 카드 ── */}
      <ChargeInventoryCard />

      {isProductsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-color-gray-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── 빠른 구매 ── */}
          {bundleItems.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="typo-16-700 text-[#373737]">빠른 구매</span>
              <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-2 overflow-x-auto">
                {bundleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-1 shrink-0 basis-[calc(50%-4px)] snap-start"
                  >
                    <QuickBundleCard product={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 전체 ── */}
          {individualItems.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="typo-16-700 text-[#373737]">전체</span>
              <div className="flex flex-col">
                {individualItems.map((item) => (
                  <ShopItemRow key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── 번들 상세 ── */}
          {bundleItems.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="typo-16-700 text-[#373737]">번들</span>
              <div className="flex flex-col">
                {bundleItems.map((item) => (
                  <ShopBundleRow key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

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
