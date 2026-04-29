"use client";

import React from "react";
import { useItems } from "@/hooks/useItems";
import ChargeInventoryCard from "./ChargeInventoryCard";
import ChargeHistoryListItem from "./ChargeHistoryListItem";
import {
  BUSINESS_INFO,
  NOTICE_INFO,
  CHARGE_HISTORY,
} from "@/lib/constants/charge";

export default function ChargeHistoryContent() {
  return (
    <div className="flex flex-col gap-[23px] pt-8">
      {/* ── 보유현황 카드 ── */}
      <ChargeInventoryCard />

      {/* ── 충전 내역 리스트 ── */}
      <div className="flex flex-col">
        {CHARGE_HISTORY.map((item) => (
          <ChargeHistoryListItem key={item.id} {...item} />
        ))}
      </div>

      {/* ── 유의사항 ── */}
      <div className="flex flex-col gap-2 pb-6">
        <span className="typo-10-600 text-color-gray-400">유의사항</span>
        <div className="flex flex-col gap-2">
          <p className="typo-10-500 text-color-gray-400 leading-[180%]">
            {NOTICE_INFO}
          </p>
          <p className="typo-10-500 text-color-gray-400 leading-[140%]">
            {BUSINESS_INFO}
          </p>
        </div>
      </div>
    </div>
  );
}
