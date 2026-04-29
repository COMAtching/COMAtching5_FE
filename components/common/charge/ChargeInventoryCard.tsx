"use client";

import React from "react";
import Image from "next/image";
import {
  ICON_SIZE,
  INVENTORY_ROWS,
  PURCHASE_LIMITS,
} from "@/lib/constants/charge";

import { useItems } from "@/hooks/useItems";

export default function ChargeInventoryCard() {
  const { data, isLoading } = useItems();

  const ticketCounts = {
    matching: data?.data.matchingTicketCount ?? 0,
    option: data?.data.optionTicketCount ?? 0,
  };

  return (
    <div className="bg-color-gray-50 flex flex-col gap-2 rounded-[16px] p-4">
      {/* 보유 수량 */}
      <div className="border-color-gray-100 flex flex-col gap-2 border-b pb-3">
        {INVENTORY_ROWS.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <Image
              src={row.icon}
              alt={row.alt}
              width={ICON_SIZE.sm}
              height={ICON_SIZE.sm}
            />
            <div className="flex items-center gap-8">
              <span className="typo-10-600 text-color-gray-400">
                {row.label}
              </span>
              <span className="typo-16-700 text-color-text-black">
                {ticketCounts[row.key as keyof typeof ticketCounts]}개
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 구매 가능 한도 */}
      <div className="flex items-center justify-between py-1">
        <span className="typo-10-600 text-color-gray-400">구매 가능 한도</span>
        <div className="flex items-center gap-6">
          {Object.values(PURCHASE_LIMITS).map((limit) => (
            <span key={limit.label} className="typo-10-600 text-color-gray-400">
              {limit.label} {limit.current}/{limit.max}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
