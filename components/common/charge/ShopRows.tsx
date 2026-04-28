import React from "react";
import ConfirmChargeDrawer from "@/components/common/charge-confirm/ConfirmChargeDrawer";
import { ShopItemAPI } from "@/lib/constants/charge";

/* ── ShopItemRow ── */

export interface ShopItemRowProps {
  item: ShopItemAPI;
}

export function ShopItemRow({ item }: ShopItemRowProps) {
  return (
    <div className="border-color-gray-100 flex items-center justify-between border-b py-4">
      <span className="typo-16-600 text-color-text-black">{item.name}</span>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            className="typo-16-600 bg-color-flame-700 flex h-10 w-24 items-center justify-center rounded-[8px] text-white"
          >
            {item.price.toLocaleString()}원
          </button>
        }
        amount={item.price}
      />
    </div>
  );
}

/* ── ShopBundleRow ── */

export interface ShopBundleRowProps {
  item: ShopItemAPI;
}

export function ShopBundleRow({ item }: ShopBundleRowProps) {
  // 리워드 목록에서 보너스 항목 제외한 메인 리워드 텍스트 생성
  const mainRewards = item.rewards.filter(
    (r) => !r.itemName.includes("보너스"),
  );
  const description = mainRewards
    .map((r) => `${r.itemName} ${r.quantity}개`)
    .join("+");

  // 보너스 항목 찾기
  const bonusReward = item.rewards.find((r) => r.itemName.includes("보너스"));

  return (
    <div className="border-color-gray-100 flex items-center justify-between border-b py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="typo-16-600 text-color-text-black">{item.name}</span>
          <span className="typo-10-600 text-color-text-caption2">
            {description}
          </span>
        </div>
        {bonusReward && (
          <span className="typo-10-600 text-color-flame-700">
            {bonusReward.itemName} {bonusReward.quantity}개 무료 증정!
          </span>
        )}
      </div>
      <ConfirmChargeDrawer
        trigger={
          <button
            type="button"
            className="typo-16-600 bg-color-flame-700 flex h-10 w-24 shrink-0 items-center justify-center rounded-[8px] text-white"
          >
            {item.price.toLocaleString()}원
          </button>
        }
        amount={item.price}
      />
    </div>
  );
}
