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
        productName={product.name}
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

  return (
    <div className="border-color-gray-100 flex items-center justify-between border-b py-4">
      <div className="flex flex-col gap-1">
        {/* 첫 번째 줄: 이름 + 남은 횟수 배지 */}
        <div className="flex items-center gap-1.5">
          <span className="typo-15-600 text-color-text-black">
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
        </div>

        {/* 두 번째 줄: 리워드 목록 상세 */}
        <span className="text-[10px] leading-[12px] font-semibold text-[#808080]">
          {description}
        </span>

        {/* 세 번째 줄: 마케팅 문구 */}
        {product.description ? (
          <span className="typo-10-600 text-color-flame-700">
            {product.description}
          </span>
        ) : (
          <span className="typo-10-600 opacity-0 select-none">&nbsp;</span>
        )}
      </div>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            disabled={product.remainingPurchaseCount === 0}
            className={`typo-16-600 flex h-10 w-24 shrink-0 items-center justify-center rounded-[8px] text-white transition-colors ${
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
