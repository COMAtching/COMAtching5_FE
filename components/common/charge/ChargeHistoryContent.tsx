"use client";

import React, { useState } from "react";
import ChargeInventoryCard from "./ChargeInventoryCard";
import ChargeHistoryListItem from "./ChargeHistoryListItem";
import { BUSINESS_INFO, NOTICE_INFO } from "@/lib/constants/charge";
import { useItemHistory } from "@/hooks/useItemHistory";

export default function ChargeHistoryContent() {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useItemHistory();

  const allItems =
    data?.pages.flatMap((page) => page?.data?.content || []) || [];

  const filteredItems = React.useMemo(() => {
    if (!filterType) return allItems;
    if (filterType === "CHARGE") {
      // 충전/획득은 CHARGE와 EVENT 타입을 포함합니다.
      return allItems.filter(
        (item) => item.historyType === "CHARGE" || item.historyType === "EVENT",
      );
    }
    return allItems.filter((item) => item.historyType === filterType);
  }, [allItems, filterType]);

  return (
    <div className="flex flex-col gap-[23px] pt-8">
      {/* ── 보유현황 카드 ── */}
      <ChargeInventoryCard />

      {/* ── 필터 옵션 (선택 사항) ── */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType(undefined)}
          className={`typo-12-600 rounded-full px-3 py-1.5 ${!filterType ? "bg-black text-white" : "bg-color-gray-100 text-color-gray-500"}`}
        >
          전체 내역
        </button>
        <button
          onClick={() => setFilterType("CHARGE")}
          className={`typo-12-600 rounded-full px-3 py-1.5 ${filterType === "CHARGE" ? "bg-black text-white" : "bg-color-gray-100 text-color-gray-500"}`}
        >
          충전/획득
        </button>
        <button
          onClick={() => setFilterType("USE")}
          className={`typo-12-600 rounded-full px-3 py-1.5 ${filterType === "USE" ? "bg-black text-white" : "bg-color-gray-100 text-color-gray-500"}`}
        >
          사용 내역
        </button>
      </div>

      {/* ── 충전 내역 리스트 ── */}
      <div className="flex min-h-[200px] flex-col">
        {isLoading ? (
          <div className="text-color-gray-400 typo-14-500 flex items-center justify-center py-10">
            불러오는 중...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-color-gray-400 typo-14-500 flex items-center justify-center py-10">
            내역이 없습니다.
          </div>
        ) : (
          filteredItems.map((item) => (
            <ChargeHistoryListItem key={item.historyId} item={item} />
          ))
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="typo-14-500 text-color-gray-500 bg-color-gray-50 mt-4 rounded-lg py-3"
          >
            {isFetchingNextPage ? "불러오는 중..." : "더보기"}
          </button>
        )}
      </div>

      {/* ── 유의사항 ── */}
      <div className="flex flex-col gap-2 pb-6">
        <span className="typo-10-600 text-color-gray-400">유의사항</span>
        <div className="flex flex-col gap-2">
          <p className="typo-10-500 text-color-gray-400 leading-[180%] whitespace-pre-wrap">
            {NOTICE_INFO}
          </p>
          <p className="typo-10-500 text-color-gray-400 leading-[140%] whitespace-pre-wrap">
            {BUSINESS_INFO}
          </p>
        </div>
      </div>
    </div>
  );
}
