"use client";

import React, { useState, useMemo } from "react";
import { MatchingHistoryItem } from "@/hooks/useMatchingHistory";
import { Search, ArrowUpNarrowWide } from "lucide-react";
import MatchingListCard from "./MatchingListCard";

interface YesMatchingListProps {
  history: MatchingHistoryItem[];
}

const YesMatchingList = ({ history }: YesMatchingListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");

  const filteredHistory = useMemo(() => {
    let result = [...history];

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const p = item.partner;
        return (
          p.nickname.toLowerCase().includes(query) ||
          p.mbti.toLowerCase().includes(query) ||
          p.major.toLowerCase().includes(query) ||
          (p.birthDate && String(getAge(p.birthDate)).includes(query))
        );
      });
    }

    // 즐겨찾기 필터
    if (showFavoritesOnly) {
      result = result.filter((item) => item.favorite);
    }

    // 정렬
    result.sort((a, b) => {
      const dateA = new Date(a.matchedAt).getTime();
      const dateB = new Date(b.matchedAt).getTime();
      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [history, searchQuery, showFavoritesOnly, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "oldest" ? "newest" : "oldest"));
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 pb-10">
      {/* 검색 바 */}
      <div className="flex h-9 w-full max-w-[343px] items-center justify-between rounded-[12px] bg-[#B3B3B31A] px-4 py-[11px]">
        <input
          type="text"
          placeholder="닉네임, 나이, 전공, MBTI 등을 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="typo-12-500 text-color-text-black placeholder:text-color-gray-400 flex-1 bg-transparent outline-none"
        />
        <Search size={16} className="text-color-gray-300" />
      </div>

      {/* 필터 바 */}
      <div className="flex w-full max-w-[343px] items-center justify-end gap-6">
        {/* 즐겨찾기 필터 */}
        <button
          type="button"
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <div className="flex h-4 w-4 items-center justify-center">
            <div
              className={`flex h-[13.33px] w-[13.33px] items-center justify-center rounded-full ${
                showFavoritesOnly ? "bg-color-flame-700" : "bg-color-gray-100"
              }`}
            >
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path
                  d="M1 3L3 5L7 1"
                  stroke={showFavoritesOnly ? "#FFFFFF" : "#B3B3B3"}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <span className="typo-12-500 text-color-gray-600">즐겨찾기</span>
        </button>

        {/* 정렬 */}
        <button
          type="button"
          onClick={toggleSortOrder}
          className="flex items-center gap-[5px]"
        >
          <ArrowUpNarrowWide size={16} className="text-color-gray-600" />
          <span className="typo-12-500 text-color-gray-600">
            {sortOrder === "oldest" ? "오래된 순" : "최신 순"}
          </span>
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="flex w-full max-w-[343px] flex-col gap-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <MatchingListCard key={item.historyId} item={item} />
          ))
        ) : (
          <div className="flex h-40 items-center justify-center">
            <span className="typo-14-500 text-color-gray-400">
              검색 결과가 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── 유틸 함수 ── */
const getAge = (birthDate?: string | null) => {
  if (!birthDate) return "??";
  return new Date().getFullYear() - new Date(birthDate).getFullYear() + 1;
};

export default YesMatchingList;
