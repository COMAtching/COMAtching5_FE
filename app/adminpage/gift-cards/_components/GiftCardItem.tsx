"use client";

import React, { useState } from "react";
import {
  type AdminGiftCardWinner,
  useGrantGiftCard,
} from "@/hooks/admin/useAdminGiftCards";
import { Check, User, Gift, Clock, AtSign } from "lucide-react";

interface GiftCardItemProps {
  giftCard: AdminGiftCardWinner;
}

export default function GiftCardItem({ giftCard }: GiftCardItemProps) {
  const grantMutation = useGrantGiftCard();
  const [confirmAction, setConfirmAction] = useState<boolean>(false);

  const isProcessing = grantMutation.isPending;

  const handleGrant = () => {
    if (confirmAction) {
      grantMutation.mutate(giftCard.historyId);
      setConfirmAction(false);
    } else {
      setConfirmAction(true);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-amber-500/20 bg-[#161827]/80 shadow-amber-500/5 transition-all duration-300 hover:bg-[#1a1d32]`}
    >
      {/* 상단: 상태 배지 */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span
          className={`inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-amber-400 uppercase`}
        >
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          미지급
        </span>
        <span className="text-[11px] font-bold text-[#ec4899]">
          {giftCard.rouletteType === "SPECIAL" ? "스페셜 룰렛" : "무료 룰렛"}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-3 px-5 py-4">
        {/* 상품명 */}
        <div className="flex items-start gap-2.5">
          <Gift size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
          <div>
            <p className="text-[11px] text-[#4a4e69]">당첨 상품</p>
            <p className="text-sm font-semibold text-white">
              {giftCard.rewardName}
            </p>
          </div>
        </div>

        {/* 당첨자 정보 */}
        <div className="flex items-start gap-2.5">
          <User size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
          <div>
            <p className="text-[11px] text-[#4a4e69]">당첨자</p>
            <p className="text-sm font-medium text-white">
              {giftCard.realName}
              <span className="ml-1.5 text-xs text-[#6b7094]">
                ({giftCard.nickname})
              </span>
            </p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex items-start gap-2.5">
          <AtSign size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
          <div>
            <p className="text-[11px] text-[#4a4e69]">이메일</p>
            <p className="text-sm font-medium text-[#8b8fa3]">
              {giftCard.email}
            </p>
          </div>
        </div>

        {/* 당첨 시간 */}
        <div className="mt-1 flex items-center gap-2.5 text-[11px] text-[#4a4e69]">
          <Clock size={12} className="shrink-0" />
          <span>{formatDateTime(giftCard.participatedAt)} 당첨</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 border-t border-[#1e2030] px-5 py-4">
        <button
          onClick={handleGrant}
          disabled={isProcessing}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
            confirmAction
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Check size={16} />
          {confirmAction ? "확실합니까?" : "지급 완료 처리"}
        </button>
      </div>
    </div>
  );
}
