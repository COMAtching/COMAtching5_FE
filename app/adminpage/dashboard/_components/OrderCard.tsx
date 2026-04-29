"use client";

import React, { useState } from "react";
import {
  type AdminOrder,
  useApproveOrder,
  useRejectOrder,
} from "@/hooks/admin/useAdminOrders";
import ExpiryCountdown from "./ExpiryCountdown";
import { Check, X, User, Ticket, Tag, Clock, Coins } from "lucide-react";

interface OrderCardProps {
  order: AdminOrder;
}

const STATUS_CONFIG = {
  PENDING: {
    badge: "대기 중",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    cardBorder: "border-amber-500/20",
    glow: "shadow-amber-500/5",
  },
  APPROVED: {
    badge: "승인 완료",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    cardBorder: "border-emerald-500/20",
    glow: "",
  },
  REJECTED: {
    badge: "거절됨",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
    cardBorder: "border-red-500/20",
    glow: "",
  },
  CANCELED: {
    badge: "취소됨",
    badgeClass: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    cardBorder: "border-[#1e2030]",
    glow: "",
  },
  EXPIRED: {
    badge: "만료됨",
    badgeClass: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    cardBorder: "border-[#1e2030]",
    glow: "",
  },
} as const;

export default function OrderCard({ order }: OrderCardProps) {
  const approveMutation = useApproveOrder();
  const rejectMutation = useRejectOrder();
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  const isPending = order.status === "PENDING";
  const isProcessing = approveMutation.isPending || rejectMutation.isPending;
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

  const handleApprove = () => {
    if (confirmAction === "approve") {
      approveMutation.mutate(order.requestId);
      setConfirmAction(null);
    } else {
      setConfirmAction("approve");
    }
  };

  const handleReject = () => {
    if (confirmAction === "reject") {
      rejectMutation.mutate(order.requestId);
      setConfirmAction(null);
    } else {
      setConfirmAction("reject");
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
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
      className={`relative flex flex-col rounded-2xl border bg-[#161827]/80 transition-all duration-300 ${config.cardBorder} ${config.glow} ${
        !isPending ? "opacity-60" : "hover:bg-[#1a1d32]"
      }`}
    >
      {/* 상단: 상태 배지 + 만료 시간 */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${config.badgeClass}`}
        >
          {isPending && (
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          )}
          {config.badge}
        </span>

        {isPending && (
          <ExpiryCountdown
            expiresAt={order.expiresAt}
            onExpired={() => {
              // 만료 시 캐시 갱신은 STOMP 또는 polling이 처리
            }}
          />
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-3 px-5 py-4">
        {/* 상품명 */}
        <div className="flex items-start gap-2.5">
          <Tag size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
          <div>
            <p className="text-[11px] text-[#4a4e69]">상품</p>
            <p className="text-sm font-semibold text-white">
              {order.requestedItemName}
            </p>
          </div>
        </div>

        {/* 요청자 정보 */}
        <div className="flex items-start gap-2.5">
          <User size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
          <div>
            <p className="text-[11px] text-[#4a4e69]">요청자</p>
            <p className="text-sm font-medium text-white">
              {order.requesterRealName}
              <span className="ml-1.5 text-xs text-[#6b7094]">
                @{order.requesterUsername}
              </span>
            </p>
          </div>
        </div>

        {/* 티켓 수량 + 가격 */}
        <div className="flex gap-4">
          <div className="flex items-start gap-2.5">
            <Ticket size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
            <div>
              <p className="text-[11px] text-[#4a4e69]">티켓</p>
              <div className="flex gap-2">
                {order.matchingTicketQty > 0 && (
                  <span className="rounded-md bg-[#ff4d61]/10 px-1.5 py-0.5 text-xs font-medium text-[#ff4d61]">
                    매칭 {order.matchingTicketQty}
                  </span>
                )}
                {order.optionTicketQty > 0 && (
                  <span className="rounded-md bg-[#6366f1]/10 px-1.5 py-0.5 text-xs font-medium text-[#818cf8]">
                    옵션 {order.optionTicketQty}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Coins size={15} className="mt-0.5 shrink-0 text-[#6b7094]" />
            <div>
              <p className="text-[11px] text-[#4a4e69]">금액</p>
              <p className="text-sm font-semibold text-white">
                {formatPrice(order.requestedPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* 요청 시간 */}
        <div className="flex items-center gap-2.5 text-[11px] text-[#4a4e69]">
          <Clock size={12} className="shrink-0" />
          <span>{formatDateTime(order.requestedAt)} 요청</span>
        </div>
      </div>

      {/* 액션 버튼 (PENDING에서만 표시) */}
      {isPending && (
        <div className="flex gap-2 border-t border-[#1e2030] px-5 py-4">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              confirmAction === "reject"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <X size={16} />
            {confirmAction === "reject" ? "확인" : "거절"}
          </button>
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              confirmAction === "approve"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Check size={16} />
            {confirmAction === "approve" ? "확인" : "승인"}
          </button>
        </div>
      )}
    </div>
  );
}
