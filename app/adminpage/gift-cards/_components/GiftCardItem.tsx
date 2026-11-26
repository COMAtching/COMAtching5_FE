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
      className={`bg-admin-panel/80 hover:bg-admin-hover relative flex flex-col rounded-2xl border border-amber-500/20 shadow-amber-500/5 transition-all duration-300`}
    >
      {/* 상단: 상태 배지 */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span
          className={`text-admin-warning inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase`}
        >
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          미지급
        </span>
        <span className="text-admin-pink text-[11px] font-bold">
          {giftCard.rouletteType === "SPECIAL" ? "스페셜 룰렛" : "무료 룰렛"}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-3 px-5 py-4">
        {/* 상품명 */}
        <div className="flex items-start gap-2.5">
          <Gift size={15} className="text-admin-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-admin-muted text-[11px]">당첨 상품</p>
            <p className="text-admin-ink text-sm font-semibold">
              {giftCard.rewardName}
            </p>
          </div>
        </div>

        {/* 당첨자 정보 */}
        <div className="flex items-start gap-2.5">
          <User size={15} className="text-admin-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-admin-muted text-[11px]">당첨자</p>
            <p className="text-admin-ink text-sm font-medium">
              {giftCard.realName}
              <span className="text-admin-muted ml-1.5 text-xs">
                ({giftCard.nickname})
              </span>
            </p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex items-start gap-2.5">
          <AtSign size={15} className="text-admin-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-admin-muted text-[11px]">이메일</p>
            <p className="text-admin-secondary text-sm font-medium">
              {giftCard.email}
            </p>
          </div>
        </div>

        {/* 당첨 시간 */}
        <div className="text-admin-muted mt-1 flex items-center gap-2.5 text-[11px]">
          <Clock size={12} className="shrink-0" />
          <span>{formatDateTime(giftCard.participatedAt)} 당첨</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="border-admin-edge flex gap-2 border-t px-5 py-4">
        <button
          onClick={handleGrant}
          disabled={isProcessing}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
            confirmAction
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-admin-success border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Check size={16} />
          {confirmAction ? "확실합니까?" : "지급 완료 처리"}
        </button>
      </div>
    </div>
  );
}
