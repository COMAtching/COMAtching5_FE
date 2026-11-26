"use client";

import React, { useMemo, useEffect } from "react";
import {
  useMatchingHistory,
  useUpdateFavorite,
} from "@/hooks/useMatchingHistory";
import NoMatchingList from "./NoMatchingList";
import YesMatchingList from "./YesMatchingList";
import MatchingListLoading from "../loading";

const ScreenMatchingList = () => {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMatchingHistory();
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

  if (isPending) return <MatchingListLoading />;

  if (allHistory.length === 0) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-3">
        {isError ? (
          <>
            <p role="alert" className="typo-14-500 text-color-gray-500">
              매칭 내역을 불러오지 못했어요.
            </p>
            <button
              type="button"
              className="typo-14-600 underline"
              onClick={() => void refetch()}
            >
              다시 시도
            </button>
          </>
        ) : (
          <NoMatchingList />
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 flex w-full flex-col items-center">
      <YesMatchingList
        history={allHistory}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
};

export default ScreenMatchingList;
