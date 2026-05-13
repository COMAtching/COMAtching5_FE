"use client";

import React from "react";
import Image from "next/image";
import {
  ICON_SIZE,
  INVENTORY_ROWS,
  PURCHASE_LIMITS,
} from "@/lib/constants/charge";

import { useItems } from "@/hooks/useItems";
import { usePurchaseLimits } from "@/hooks/usePurchaseLimits";

export default function ChargeInventoryCard() {
  const { data: itemData } = useItems();
  const { data: limitData } = usePurchaseLimits();

  const limits = limitData?.data.limits || [];
  const matchingLimit = limits.find((l) => l.itemType === "MATCHING_TICKET");
  const optionLimit = limits.find((l) => l.itemType === "OPTION_TICKET");

  const ticketCounts = {
    matching: itemData?.data.matchingTicketCount ?? 0,
    option: itemData?.data.optionTicketCount ?? 0,
  };

  return (
    <div className="bg-color-gray-50 flex flex-col gap-2 rounded-[16px] p-4">
      {/* 보유 수량 */}
      <div className="border-color-gray-100 flex flex-col gap-2 border-b pb-3">
        {INVENTORY_ROWS.map((row) => {
          const limit = row.key === "matching" ? matchingLimit : optionLimit;
          return (
            <div key={row.key} className="flex items-center gap-2">
              <Image
                src={row.icon}
                alt={row.alt}
                width={ICON_SIZE.sm}
                height={ICON_SIZE.sm}
              />
              <div className="flex flex-1 items-center justify-between pr-2">
                <span className="typo-10-600 text-color-gray-400">
                  {row.label}
                </span>
                <div className="flex items-center gap-1">
                  <span className="typo-16-700 text-color-text-black">
                    {limit?.ownedQuantity ?? 0}개
                  </span>
                  {limit?.pendingQuantity ? (
                    <span className="typo-10-600 text-color-brand-primary-flame">
                      (+{limit.pendingQuantity} 대기중)
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 구매 가능 한도 */}
      <div className="flex items-center justify-between py-1">
        <span className="typo-10-600 text-color-gray-400">구매 가능 한도</span>
        <div className="flex items-center gap-4">
          {limits.map((limit) => (
            <span
              key={limit.itemType}
              className="typo-10-600 text-color-gray-400"
            >
              {limit.itemName} {limit.ownedQuantity + limit.pendingQuantity}/
              {limit.maxQuantity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
