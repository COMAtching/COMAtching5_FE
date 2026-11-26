"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import {
  type FailedGrant,
  useOrderGrant,
  useRetryGrant,
} from "@/hooks/admin/useAdminOrders";

import { grantLabels } from "./grantLabels";

export default function FailedGrantCard({
  order,
  onTrack,
  onStartRefund,
  refundBusy,
  needsReview,
}: {
  order: FailedGrant;
  onTrack: (order: FailedGrant) => void;
  onStartRefund: (orderId: number) => void;
  refundBusy: boolean;
  needsReview: boolean;
}) {
  const retry = useRetryGrant(order.orderId);
  const tracking = retry.isSuccess || retry.isError;
  const grant = useOrderGrant(order.orderId, tracking);
  const current = tracking ? grant.data : order;
  const grantStatus = current?.grantStatus;
  // 실패 목록은 환불 상태가 NONE인 주문만 반환한다. 추적 중에는 단건 응답을 따른다.
  const refundStatus = tracking ? grant.data?.refundStatus : "NONE";
  const canAct =
    current?.status === "APPROVED" &&
    grantStatus === "FAILED" &&
    refundStatus === "NONE" &&
    !needsReview;
  const busy = retry.isPending || refundBusy || (tracking && grant.isFetching);

  return (
    <article className="border-admin-line bg-admin-panel rounded-2xl border p-5">
      <p className="text-admin-secondary text-xs">주문 #{order.orderId}</p>
      <h3 className="text-admin-ink mt-1 font-semibold">
        {order.requestedItemName}
      </h3>
      <div aria-live="polite" className="mt-3 space-y-1 text-sm">
        {retry.data === "accepted" && (
          <p className="text-admin-info">재시도 접수</p>
        )}
        {retry.data === "conflict" && (
          <p>이미 처리 중이거나 처리된 주문입니다.</p>
        )}
        {retry.isError && (
          <p role="alert">재시도 접수 여부를 확인하지 못했습니다.</p>
        )}
        {current && (
          <p>
            입금 승인 완료 · <strong>{grantLabels[current.grantStatus]}</strong>{" "}
            · 시도 {current.attempt}회
          </p>
        )}
        {needsReview && (
          <p role="alert">기존 지급 이력 확인 필요 · 송금을 중단해 주세요.</p>
        )}
        {refundStatus === "IN_PROGRESS" && <p>환불 진행 중</p>}
        {refundStatus === "COMPLETED" && <p>환불 완료</p>}
        {tracking && grant.isPending && (
          <LoadingSpinner variant="inline" label="현재 지급 상태 확인 중" />
        )}
        {tracking && grant.isError && (
          <p role="alert">최신 지급 상태를 불러오지 못했습니다.</p>
        )}
      </div>
      {tracking && grant.isError ? (
        <button
          className="mt-4 rounded-lg border px-3 py-2 text-sm"
          disabled={grant.isFetching}
          onClick={() => void grant.refetch()}
        >
          상태 다시 조회
        </button>
      ) : (
        canAct && (
          <div className="flex flex-wrap gap-2">
            <button
              className="text-admin-warning mt-4 rounded-lg border border-amber-500/40 px-3 py-2 text-sm font-semibold hover:bg-amber-500/10 disabled:opacity-50"
              disabled={busy}
              onClick={() => {
                onTrack(order);
                retry.mutate();
              }}
            >
              {retry.isPending ? (
                <LoadingSpinner variant="inline" label="재시도 요청 중" />
              ) : (
                "지급 재시도"
              )}
            </button>
            <button
              className="border-admin-line text-admin-ink mt-4 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={busy}
              onClick={() => onStartRefund(order.orderId)}
            >
              환불 시작
            </button>
          </div>
        )
      )}
    </article>
  );
}
