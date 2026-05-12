"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ItemHistoryItem } from "@/hooks/useItemHistory";

interface ChargeHistoryItemProps {
  item: ItemHistoryItem;
}

export default function ChargeHistoryListItem({
  item,
}: ChargeHistoryItemProps) {
  const dateObj = new Date(item.createdAt);
  const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")} ${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

  const isUse = item.historyType === "USE";
  const quantityPrefix = item.quantity > 0 ? "+" : "";

  const unit =
    item.itemType === "MATCHING_TICKET"
      ? "장"
      : item.itemType === "OPTION_TICKET"
        ? "개"
        : "코인";
  const typeLabel =
    item.historyType === "CHARGE"
      ? "충전"
      : item.historyType === "EVENT"
        ? "이벤트/보너스"
        : "사용";

  return (
    <div className="border-color-gray-100 flex flex-col gap-2 border-b py-4">
      <span className="typo-12-500 text-color-gray-500">
        {formattedDate} | 내역번호: {item.historyId}
      </span>

      <div className="flex items-center justify-between">
        <span className="typo-16-600 text-color-text-black">
          {item.description}
        </span>
        <span
          className={cn(
            "typo-16-600",
            isUse ? "text-color-text-black" : "text-color-flame-700",
          )}
        >
          {quantityPrefix}
          {item.quantity}
          {unit}
        </span>
      </div>

      <span className="typo-12-600 text-color-gray-400">{typeLabel}</span>
    </div>
  );
}
