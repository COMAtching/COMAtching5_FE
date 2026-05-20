"use client";

import React from "react";
import Image from "next/image";
import { ICON_SIZE } from "@/lib/constants/charge";
import ConfirmChargeDrawer from "@/components/common/charge-confirm/ConfirmChargeDrawer";
import { ShopProduct } from "@/hooks/useShopProducts";

interface QuickBundleCardProps {
  product: ShopProduct;
  imageUrl: string;
}

export default function QuickBundleCard({
  product,
  imageUrl,
}: QuickBundleCardProps) {
  // 메인 리워드 설명
  const description = product.rewards
    .map((r) => `${r.itemName} ${r.quantity}개`)
    .join("+");

  return (
    <div className="border-color-gray-64 bg-color-gray-50 flex flex-1 flex-col items-center justify-between rounded-[16px] border p-2 pt-4">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={imageUrl}
          alt={product.name}
          width={ICON_SIZE.lg}
          height={ICON_SIZE.lg}
          className="object-contain"
        />
        <div className="flex flex-col items-center gap-2">
          <span className="typo-14-600 text-color-gray-800">
            {product.name}
          </span>
          {product.purchaseLimitPerMember !== null &&
            product.purchaseLimitPerMember !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] leading-[11px] font-bold ${
                  product.remainingPurchaseCount &&
                  product.remainingPurchaseCount > 0
                    ? "bg-color-flame-70/10 text-color-flame-700 border-color-flame-70/20 border"
                    : "bg-color-gray-100 text-color-gray-400 border-color-gray-100 border"
                }`}
              >
                {product.remainingPurchaseCount === 0
                  ? "구매 완료"
                  : `${product.remainingPurchaseCount}회 남음`}
              </span>
            )}
          <div className="flex flex-col items-center gap-1">
            <span className="typo-12-600 text-color-gray-400 text-center">
              {description}
            </span>
            {product.description ? (
              <span className="typo-12-600 text-color-flame-700 text-center">
                {product.description}
              </span>
            ) : (
              <span className="typo-12-600 text-center opacity-0 select-none">
                &nbsp;
              </span>
            )}
          </div>
        </div>
      </div>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            disabled={product.remainingPurchaseCount === 0}
            className={`typo-16-600 mt-4 flex h-10 w-full items-center justify-center rounded-[8px] text-white transition-colors ${
              product.remainingPurchaseCount === 0
                ? "bg-color-gray-200 text-color-gray-400 cursor-not-allowed"
                : "bg-color-flame-700"
            }`}
          >
            {product.remainingPurchaseCount === 0
              ? "구매 완료"
              : `${product.price.toLocaleString()}원`}
          </button>
        }
        amount={product.price}
        productId={product.id}
        productName={product.name}
      />
    </div>
  );
}
