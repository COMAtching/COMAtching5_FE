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
            className="typo-16-600 bg-color-flame-700 mt-4 flex h-10 w-full items-center justify-center rounded-[8px] text-white"
          >
            {product.price.toLocaleString()}원
          </button>
        }
        amount={product.price}
        productId={product.id}
      />
    </div>
  );
}
