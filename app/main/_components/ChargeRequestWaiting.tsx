"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { RotateCw } from "lucide-react";
import { useRequestStatus } from "@/hooks/useRequestStatus";

const ChargeRequestWaiting = () => {
  const { isPurchasePending, refetch, isFetching } = useRequestStatus();

  if (!isPurchasePending) return null;

  return (
    <div className="flex h-[120px] w-full flex-col items-center justify-center gap-[11px] rounded-3xl border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      <div className="flex h-[72px] w-full items-center gap-4">
        <div className="grid size-10 shrink-0 place-items-center">
          <LoadingSpinner variant="inline" label="입금 대기 중" />
        </div>
        {/* 텍스트 영역 */}
        <div className="flex flex-1 flex-col items-start gap-2">
          {/* 타이틀 행 */}
          <div className="flex w-full items-center justify-between gap-2.5">
            <span className="typo-20-600 text-color-text-black leading-6">
              대기중
            </span>
            <button
              type="button"
              aria-label="입금 상태 새로고침"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex cursor-pointer items-center justify-center p-1 transition-opacity disabled:opacity-50"
            >
              {isFetching ? (
                <LoadingSpinner variant="inline" label="입금 상태 확인 중" />
              ) : (
                <RotateCw className="size-4 text-[#9E9E9E]" />
              )}
            </button>
          </div>

          {/* 설명 문구 */}
          <p className="typo-14-500 text-color-gray-700 leading-[140%] tracking-[-0.03em]">
            관리자가 입금 내역을 확인하고 있어요.
            <br />
            3분 이내로 완료되니 잠시만 기다려 주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChargeRequestWaiting;
