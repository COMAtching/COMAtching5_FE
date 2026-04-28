import React from "react";
import ConfirmChargeDrawer from "@/components/common/charge-confirm/ConfirmChargeDrawer";
import { ShopProduct } from "@/hooks/useShopProducts";

/* ── ShopItemRow (개별 아이템) ── */

export interface ShopItemRowProps {
  product: ShopProduct;
}

export function ShopItemRow({ product }: ShopItemRowProps) {
  return (
    <div className="border-color-gray-100 flex items-center justify-between border-b py-4">
      <span className="typo-16-600 text-color-text-black">{product.name}</span>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            className="typo-16-600 bg-color-flame-700 flex h-10 w-24 items-center justify-center rounded-[8px] text-white"
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

/* ── ShopBundleRow (번들 아이템) ── */

export interface ShopBundleRowProps {
  product: ShopProduct;
}

export function ShopBundleRow({ product }: ShopBundleRowProps) {
  // 메인 리워드 텍스트
  const description = product.rewards
    .map((r) => `${r.itemName} ${r.quantity}개`)
    .join("+");

  // 보너스 리워드
  const bonusText =
    product.bonusRewards.length > 0
      ? product.bonusRewards
          .map((r) => `${r.itemName} ${r.quantity}개`)
          .join(", ") + " 무료 증정!"
      : null;

  return (
    <div className="border-color-gray-100 flex items-center justify-between border-b py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="typo-16-600 text-color-text-black">
            {product.name}
          </span>
          <span className="text-[10px] leading-[12px] font-semibold text-[#808080]">
            {description}
          </span>
        </div>
        {bonusText && (
          <span className="typo-10-600 text-color-flame-700">{bonusText}</span>
        )}
      </div>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            className="typo-16-600 bg-color-flame-700 flex h-10 w-24 shrink-0 items-center justify-center rounded-[8px] text-white"
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
