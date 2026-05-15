"use client";

import { BackButton } from "@/components/ui/BackButton";
import React, { useMemo, useEffect } from "react";
import {
  useMatchingHistory,
  useUpdateFavorite,
} from "@/hooks/useMatchingHistory";
import NoMatchingList from "./NoMatchingList";
import YesMatchingList from "./YesMatchingList";

const ScreenMatchingList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMatchingHistory();
  const { mutate: toggleFavorite } = useUpdateFavorite();

  const handleFavoriteToggle = (
    historyId: number,
    currentFavorite: boolean,
  ) => {
    toggleFavorite({ historyId, favorite: !currentFavorite });
  };

  // 모든 페이지의 content를 하나의 배열로 평탄화
  const allHistory = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data?.content || []) ?? [];
  }, [data]);

  // DEBUG: 매칭 내역 데이터 로그 출력
  useEffect(() => {
    if (data) {
      console.log("📂 [Matching History Raw Data]:", data);
      console.log("📜 [Matching History List]:", allHistory);
    }
  }, [data, allHistory]);

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="조회하기" />
      <span className="typo-14-500 mt-2 text-center leading-[17px] text-[#858585]">
        내가 뽑은 상대들을 여기서 확인할 수 있어요.
        <br />
        용기내서 연락해보세요!
      </span>

      {allHistory.length === 0 ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <NoMatchingList nickname="겨울이오길" />
        </div>
      ) : (
        <div className="mt-6 flex w-full flex-col items-center">
          <YesMatchingList
            history={allHistory}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      )}
    </main>
  );
};

export default ScreenMatchingList;
