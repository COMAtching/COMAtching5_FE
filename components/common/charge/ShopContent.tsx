"use client";

import React from "react";
import { useItems } from "@/hooks/useItems";
import { useShopProducts, ShopProduct } from "@/hooks/useShopProducts";
import ChargeInventoryCard from "./ChargeInventoryCard";
import QuickBundleCard from "./QuickBundleCard";
import { ShopItemRow } from "./ShopRows";
import { ShopBundleRow } from "./ShopRows";
import { USAGE_INFO, BUSINESS_INFO } from "@/lib/constants/charge";
import { Loader2 } from "lucide-react";

/** rewards의 itemType 종류가 2개 이상이면 번들(빠른 구매) */
function isBundle(product: ShopProduct): boolean {
  const types = new Set(product.rewards.map((r) => r.itemType));
  return types.size >= 2;
}

export default function ShopContent() {
  const { data } = useItems();
  const { data: productsData, isLoading: isProductsLoading } =
    useShopProducts();

  const ticketCounts = {
    matching: data?.data.matchingTicketCount ?? 0,
    option: data?.data.optionTicketCount ?? 0,
  };

  const products = productsData?.data ?? [];

  // 개별 아이템: rewards의 itemType이 1종류
  const individualItems = products.filter((item) => !isBundle(item));

  // 번들 아이템: rewards의 itemType이 2종류 이상 → 빠른 구매
  const bundleItems = products.filter((item) => isBundle(item));

  return (
    <div className="flex flex-col gap-8 pt-8">
      {/* ── 보유현황 카드 ── */}
      <ChargeInventoryCard ticketCounts={ticketCounts} />

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
              <div className="flex gap-2">
                {bundleItems.map((item) => (
                  <QuickBundleCard key={item.id} product={item} />
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
