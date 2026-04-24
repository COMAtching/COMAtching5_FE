"use client";

import { BackButton } from "@/components/ui/BackButton";
import React from "react";
import { useMatchingHistory } from "@/hooks/useMatchingHistory";
import NoMatchingList from "./NoMatchingList";
import YesMatchingList from "./YesMatchingList";
import { DUMMY_MATCHING_HISTORY } from "./dummyData";

const ScreenMatchingList = () => {
  const { data: historyData } = useMatchingHistory();

  // API 데이터가 있으면 실데이터를, 없거나 빈 배열이면 더미 데이터를 사용 (UI 테스트용)
  const history =
    historyData?.data.content && historyData.data.content.length > 0
      ? historyData.data.content
      : DUMMY_MATCHING_HISTORY;

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="조회하기" />
      <span className="typo-14-500 mt-2 text-center leading-[17px] text-[#858585]">
        내가 뽑은 상대들을 여기서 확인할 수 있어요.
        <br />
        용기내서 연락해보세요!
      </span>

      {history.length === 0 ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <NoMatchingList nickname="겨울이오길" />
        </div>
      ) : (
        <div className="mt-6 flex w-full flex-col items-center">
          <YesMatchingList history={history} />
        </div>
      )}
    </main>
  );
};

export default ScreenMatchingList;
