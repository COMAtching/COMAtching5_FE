"use client";

import React from "react";
import { Coins } from "lucide-react";
import { useApproveCharge, useRejectCharge } from "@/hooks/useAdminManagement";

interface RequestUserProps {
  contact: string;
  orderId: string;
  point: number;
  username: string;
  price: number;
  requestAt: string;
  productName: string;
  onUpdate: () => void;
  realName: string;
}

export const RequestUserComponent = ({
  orderId,
  username,
  price,
  requestAt,
  productName,
  onUpdate,
  realName,
}: RequestUserProps) => {
  const approveMutation = useApproveCharge();
  const rejectMutation = useRejectCharge();

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "알 수 없음";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "알 수 없음";

      // KST 시간대 적용 (UTC+9)
      const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

      const year = kstDate.getUTCFullYear();
      const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(kstDate.getUTCDate()).padStart(2, "0");
      const hours = String(kstDate.getUTCHours()).padStart(2, "0");
      const minutes = String(kstDate.getUTCMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}시 ${minutes}분`;
    } catch (error) {
      return "알 수 없음";
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(orderId);
      alert("충전 요청이 수락되었습니다.");
      onUpdate();
    } catch (error) {
      alert("수락 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync(orderId);
      alert("충전 요청이 거절되었습니다.");
      onUpdate();
    } catch (error) {
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col border-b border-gray-200 py-4 font-sans">
      <div className="mb-4 flex flex-wrap items-center gap-5">
        <div className="text-xl font-bold">
          닉네임 : <span className="font-semibold">{username}</span>
        </div>
        <div className="text-xl font-bold">
          입금자명 : <span className="font-semibold">{realName}</span>
        </div>
        <div className="text-lg text-gray-500">
          요청시각 : {formatDateTime(requestAt)}
        </div>
        <div className="text-lg text-gray-500">주문번호 : {orderId}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center">
            <Coins size={32} className="mr-2 fill-yellow-500 text-yellow-500" />
            <span className="text-xl font-semibold">{productName}</span>
          </div>
          <div className="flex items-center text-xl">
            <span className="font-medium text-gray-600">가격 : </span>
            <span className="ml-2 w-[120px] text-center font-bold">
              {price}원
            </span>
          </div>
        </div>

        <div className="flex h-12 items-center gap-2 pr-8">
          <button
            onClick={handleApprove}
            className="h-full w-[100px] rounded-lg bg-[#ff775e] text-xl font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? "..." : "수락"}
          </button>
          <button
            onClick={handleReject}
            className="h-full w-[100px] rounded-lg bg-[#ff775e] text-xl font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            disabled={rejectMutation.isPending}
          >
            {rejectMutation.isPending ? "..." : "거절"}
          </button>
        </div>
      </div>
    </div>
  );
};
