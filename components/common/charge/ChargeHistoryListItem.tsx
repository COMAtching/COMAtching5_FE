"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ChargeStatus = "success" | "failed" | "cancelled" | "event";

export interface ChargeHistoryItemProps {
  date: string;
  orderId: string;
  points: string;
  paymentAmount: string;
  status: ChargeStatus;
  statusLabel: string;
}

/* ── 상태별 스타일 헬퍼 ── */
function getStatusStyles(status: ChargeStatus) {
  const isInactive = status === "failed" || status === "cancelled";
  return {
    dateColor: isInactive ? "text-color-gray-400" : "text-color-text-black",
    pointsColor: isInactive ? "text-color-gray-400" : "text-color-text-black",
    amountColor: isInactive ? "text-color-gray-400" : "text-color-text-black",
    amountStrike: isInactive,
  };
}

export default function ChargeHistoryListItem({
  date,
  orderId,
  points,
  paymentAmount,
  status,
  statusLabel,
}: ChargeHistoryItemProps) {
  const styles = getStatusStyles(status);

  return (
    <div className="border-color-gray-100 flex flex-col gap-2 border-b py-4">
      {/* 날짜 | 주문번호 */}
      <span className={cn("typo-12-500", styles.dateColor)}>
        {date} | {orderId}
      </span>

      {/* 포인트 · 결제금액 */}
      <div className="flex items-center justify-between">
        <span className={cn("typo-16-600", styles.pointsColor)}>{points}</span>
        <span
          className={cn(
            "typo-16-600",
            styles.amountColor,
            styles.amountStrike && "line-through",
          )}
        >
          {paymentAmount}
        </span>
      </div>

      {/* 상태 */}
      <span className="typo-12-600 text-color-gray-400">{statusLabel}</span>
    </div>
  );
}
