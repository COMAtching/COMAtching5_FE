"use client";

import React, { useState } from "react";
import {
  type AdminOrder,
  type OrderRefund,
  useApproveOrder,
  useRejectOrder,
} from "@/hooks/admin/useAdminOrders";
import ExpiryCountdown from "./ExpiryCountdown";
import { Check, X, User, Ticket, Tag, Clock, Coins } from "lucide-react";

interface OrderCardProps {
  order: AdminOrder;
  onSelectDeposit?: () => void;
}

const STATUS_CONFIG = {
  PENDING: {
    badge: "대기 중",
    badgeClass: "bg-amber-500/10 text-admin-warning border-amber-500/30",
    cardBorder: "border-amber-500/20",
    glow: "shadow-amber-500/5",
  },
  APPROVED: {
    badge: "승인 완료",
    badgeClass: "bg-emerald-500/10 text-admin-success border-emerald-500/30",
    cardBorder: "border-emerald-500/20",
    glow: "",
  },
  REJECTED: {
    badge: "거절됨",
    badgeClass: "bg-red-500/10 text-admin-danger border-red-500/30",
    cardBorder: "border-red-500/20",
    glow: "",
  },
  CANCELED: {
    badge: "취소됨",
    badgeClass: "bg-gray-500/10 text-admin-muted border-gray-500/30",
    cardBorder: "border-admin-edge",
    glow: "",
  },
  EXPIRED: {
    badge: "만료됨",
    badgeClass: "bg-gray-500/10 text-admin-muted border-gray-500/30",
    cardBorder: "border-admin-edge",
    glow: "",
  },
} as const;

export default function OrderCard({ order, onSelectDeposit }: OrderCardProps) {
  const approveMutation = useApproveOrder();
  const rejectMutation = useRejectOrder();
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  const isPending = order.status === "PENDING";
  const isProcessing = approveMutation.isPending || rejectMutation.isPending;
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

  const handleApprove = () => {
    if (onSelectDeposit) return onSelectDeposit();
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
      className={`bg-admin-panel/80 relative flex flex-col rounded-2xl border transition-all duration-300 ${config.cardBorder} ${config.glow} ${
        !isPending ? "opacity-60" : "hover:bg-admin-hover"
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
          <Tag size={15} className="text-admin-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-admin-muted text-[11px]">상품</p>
            <p className="text-admin-ink text-sm font-semibold">
              {order.requestedItemName}
            </p>
            <p className="text-admin-secondary text-xs">
              주문 #{order.requestId}
            </p>
          </div>
        </div>

        {/* 요청자 정보 */}
        <div className="flex items-start gap-2.5">
          <User size={15} className="text-admin-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-admin-muted text-[11px]">요청자</p>
            <p className="text-admin-ink text-sm font-medium">
              {order.requesterRealName}
              <span className="text-admin-muted ml-1.5 text-xs">
                @{order.requesterUsername}
              </span>
            </p>
          </div>
        </div>

        {/* 구매 수량 (조건부) + 가격 */}
        <div className="flex gap-4">
          {(() => {
            // STOMP 실시간 데이터는 productCode가 "UNKNOWN"이므로 수량 필드로 단품 여부 유추
            const isMatchingSingle =
              order.productCode === "MATCHING_TICKET_1" ||
              (order.productCode === "UNKNOWN" &&
                order.matchingTicketQty > 0 &&
                order.optionTicketQty === 0);

            const isOptionSingle =
              order.productCode === "OPTION_TICKET_1" ||
              (order.productCode === "UNKNOWN" &&
                order.optionTicketQty > 0 &&
                order.matchingTicketQty === 0);

            if (isMatchingSingle || isOptionSingle) {
              return (
                <div className="flex items-start gap-2.5">
                  <Ticket
                    size={15}
                    className="text-admin-muted mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-admin-muted text-[11px]">구매 수량</p>
                    <p className="text-admin-ink text-sm font-semibold">
                      {isMatchingSingle
                        ? order.matchingTicketQty
                        : order.optionTicketQty}
                      개
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="flex items-start gap-2.5">
            <Coins size={15} className="text-admin-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-admin-muted text-[11px]">금액</p>
              <p className="text-admin-ink text-sm font-semibold">
                {formatPrice(order.requestedPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* 요청 시간 */}
        <div className="text-admin-muted flex items-center gap-2.5 text-[11px]">
          <Clock size={12} className="shrink-0" />
          <span>{formatDateTime(order.requestedAt)} 요청</span>
        </div>
      </div>

      {/* 액션 버튼 (PENDING에서만 표시) */}
      {isPending && (
        <div className="border-admin-edge flex gap-2 border-t px-5 py-4">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              confirmAction === "reject"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "text-admin-danger border border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
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
                : "text-admin-success border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Check size={16} />
            {onSelectDeposit
              ? "입금 선택"
              : confirmAction === "approve"
                ? "확인"
                : "승인"}
          </button>
        </div>
      )}
    </div>
  );
}

export function RefundOrderCard({
  refund,
  busy,
  needsReview,
  onComplete,
}: {
  refund: OrderRefund;
  busy: boolean;
  needsReview: boolean;
  onComplete: (orderId: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { orderId, amount, refundStatus } = refund;
  const completed = refundStatus === "COMPLETED";
  const total = amount.toLocaleString("ko-KR") + "원";
  return (
    <article className="border-admin-line bg-admin-panel space-y-3 rounded-2xl border p-5">
      <p className="text-admin-secondary text-xs">
        주문 #{orderId} · {completed ? "환불 완료" : "환불 진행 중"}
      </p>
      <h3 className="text-admin-ink font-semibold">
        {refund.requestedItemName}
      </h3>
      <p className="text-lg font-bold">환불액 {total}</p>
      <div className="text-admin-secondary space-y-1 text-sm">
        <p>
          시작 · 관리자 #{refund.startedBy} ·{" "}
          <time dateTime={refund.startedAt}>
            {refund.startedAt.replace("T", " ").slice(0, 19)}
          </time>
        </p>
        {completed && refund.completedAt && (
          <p>
            완료 · 관리자 #{refund.completedBy} ·{" "}
            <time dateTime={refund.completedAt}>
              {refund.completedAt.replace("T", " ").slice(0, 19)}
            </time>
          </p>
        )}
      </div>
      {needsReview && !completed && (
        <p role="alert">기존 지급 이력 확인 필요 · 송금을 중단해 주세요.</p>
      )}
      {!completed &&
        !needsReview &&
        (confirming ? (
          <div className="space-y-3 rounded-xl border border-amber-500/40 p-3">
            <p>
              주문 #{orderId}의 환불액 {total} 전액을 고객에게 이체한 내역을
              확인했나요?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg border px-3 py-2 text-sm"
                disabled={busy}
                onClick={() => setConfirming(false)}
              >
                취소
              </button>
              <button
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={busy}
                onClick={() => {
                  setConfirming(false);
                  onComplete(orderId);
                }}
              >
                이체 내역 확인 · 완료 기록
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-admin-secondary text-sm">
              시작 담당자와 은행 이체 내역을 대조한 뒤 완료해 주세요.
            </p>
            <button
              className="text-admin-success rounded-lg border border-emerald-500/40 px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={busy}
              onClick={() => setConfirming(true)}
            >
              이체 확인 · 환불 완료
            </button>
          </>
        ))}
    </article>
  );
}
