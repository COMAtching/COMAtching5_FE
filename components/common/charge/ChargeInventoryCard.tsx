"use client";

import React from "react";
import Image from "next/image";
import { ICON_SIZE, INVENTORY_ROWS } from "@/lib/constants/charge";

import { useItems } from "@/hooks/useItems";

export default function ChargeInventoryCard() {
  const { data: itemData } = useItems();

  const ticketCounts = {
    matching: itemData?.data.matchingTicketCount ?? 0,
    option: itemData?.data.optionTicketCount ?? 0,
  };

  return (
    <div className="bg-color-gray-50 flex flex-col gap-2 rounded-2xl p-4">
      {/* 보유 수량 */}
      <div className="flex flex-col gap-2 pb-1">
        {INVENTORY_ROWS.map((row) => {
          const count =
            row.key === "matching"
              ? ticketCounts.matching
              : ticketCounts.option;
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
                <span className="typo-16-700 text-color-text-black">
                  {count}개
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
