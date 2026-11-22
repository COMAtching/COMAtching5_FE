"use client";

import React from "react";
import Link from "next/link";
import {
  type FailedGrant,
  type RefundResult,
  type PaginatedResponse,
  useAdminRefundAction,
  useAdminRefunds,
  useFailedGrants,
  useAdminOrders,
} from "@/hooks/admin/useAdminOrders";
import { useAdminOrderSocket } from "@/hooks/admin/useAdminOrderSocket";
import { RefundNotice } from "./RefundNotice";
import OrderCard, { RefundOrderCard } from "./OrderCard";
import FailedGrantCard from "./FailedGrantCard";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Inbox,
} from "lucide-react";

const dashboardTabs = {
  orders: "입금 승인 대기",
  grants: "지급 실패",
  IN_PROGRESS: "환불 진행 중",
  COMPLETED: "환불 완료",
} as const;
type DashboardTab = keyof typeof dashboardTabs;

export default function AdminDashboard() {
  const {
    data: ordersData,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminOrders();
  const [tab, setTab] = React.useState<DashboardTab>("orders");
  const [page, setPage] = React.useState(0);
  const [tracked, setTracked] = React.useState<FailedGrant[]>([]);
  const failed = useFailedGrants(page, tab === "grants");
  const failureCount = failed.isSuccess ? failed.data.totalElements : 0;
  const onlyFailedOrder =
    failureCount === 1 ? failed.data?.content[0] : undefined;
  const [refundPage, setRefundPage] = React.useState(0);
  const refundStatus = tab === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
  const refundTab = tab === "IN_PROGRESS" || tab === "COMPLETED";
  const refunds = useAdminRefunds(refundStatus, refundPage, refundTab);
  const refundAction = useAdminRefundAction();
  const [notice, setNotice] = React.useState<RefundResult>();
  const [reviewIds, setReviewIds] = React.useState<number[]>([]);
  const lastRefundPage =
    refunds.data && Math.max(0, refunds.data.totalPages - 1);
  if (lastRefundPage !== undefined && refundPage > lastRefundPage)
    setRefundPage(lastRefundPage);

  function selectTab(value: DashboardTab) {
    if (value === "grants" && tab !== value) {
      void failed.refetch({ cancelRefetch: false });
    }
    setTab(value);
    setRefundPage(0);
  }

  function requestRefund(orderId: number, action: "start" | "complete") {
    setNotice(undefined);
    refundAction.mutate(
      { orderId, action },
      {
        onSuccess: (result) => {
          setNotice(result);
          if (result.kind === "review") {
            setReviewIds((ids) =>
              ids.includes(orderId) ? ids : [...ids, orderId],
            );
            return;
          }
          const status =
            result.kind === "recorded"
              ? result.refund.refundStatus
              : result.current?.refundStatus;
          if (status === "IN_PROGRESS" || status === "COMPLETED")
            selectTab(status);
        },
      },
    );
  }

  const lastPage = failed.data && Math.max(0, failed.data.totalPages - 1);
  if (lastPage !== undefined && page > lastPage) setPage(lastPage);

  function track(order: FailedGrant) {
    setTracked((previous) =>
      previous.some(({ orderId }) => orderId === order.orderId)
        ? previous
        : [order, ...previous],
    );
  }

  const grantRows = [
    ...tracked,
    ...(failed.data?.content ?? []).filter(
      (row) => !tracked.some((item) => item.orderId === row.orderId),
    ),
  ];
  const activeList = refundTab ? refunds : failed;
  const refreshing = tab === "orders" ? isRefetching : activeList.isFetching;
  const { status: socketStatus } = useAdminOrderSocket();

  // useAdminOrders가 이미 content 배열만 추출하여 반환하므로 바로 사용
  const orders = ordersData ?? [];

  // PENDING 주문을 먼저, 나머지는 뒤에
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === "PENDING" && b.status !== "PENDING") return -1;
    if (a.status !== "PENDING" && b.status === "PENDING") return 1;
    return (
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  });

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] transition-colors duration-200 hover:border-[#ff4d61]/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d61] to-[#ff775e]">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white sm:text-xl">
                결제 승인 관리
              </h1>
              <p className="text-xs text-[#6b7094]">
                대기 중인 요청{" "}
                <span className="font-semibold text-[#ff4d61]">
                  {pendingCount}
                </span>
                건
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 새로고침 */}
          <button
            aria-label="새로고침"
            onClick={() =>
              tab === "orders" ? refetch() : activeList.refetch()
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#2a2d42] bg-[#161827] px-3 py-2.5 text-xs font-medium text-[#8b8fa3] transition-all duration-200 hover:border-[#ff4d61]/40 hover:text-white disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">새로고침</span>
          </button>

          {/* 연결 상태 */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium sm:px-4 sm:text-sm ${
              socketStatus === "connected"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : socketStatus === "reconnecting"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {socketStatus === "connected" ? (
              <>
                <Wifi size={14} />
                <span className="hidden sm:inline">실시간 연결</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              </>
            ) : socketStatus === "reconnecting" ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span className="hidden sm:inline">재연결 중</span>
              </>
            ) : (
              <>
                <WifiOff size={14} />
                <span className="hidden sm:inline">연결 끊김</span>
              </>
            )}
          </div>
        </div>
      </header>

      {failureCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p role="alert">
            {onlyFailedOrder
              ? `주문 #${onlyFailedOrder.orderId}의 입금은 승인됐지만 아이템 지급에 실패했습니다.`
              : `입금이 승인된 주문 ${failureCount}건의 아이템 지급에 실패했습니다.`}
          </p>
          {tab !== "grants" && (
            <button
              type="button"
              onClick={() => selectTab("grants")}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 font-semibold hover:bg-red-500/10"
            >
              지급 실패 주문 보기
            </button>
          )}
        </div>
      )}

      <div
        className="mb-6 flex flex-wrap gap-2 border-b border-[#2a2d42] pb-3"
        aria-label="결제 관리 목록"
        role="group"
      >
        {(Object.keys(dashboardTabs) as DashboardTab[]).map((value) => (
          <button
            key={value}
            aria-pressed={tab === value}
            onClick={() => selectTab(value)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#a4a8bc] aria-pressed:bg-[#2a2d42] aria-pressed:text-white"
          >
            {dashboardTabs[value]}
            {value === "grants" &&
              failed.data &&
              ` (${failed.data.totalElements})`}
          </button>
        ))}
      </div>
      {notice && <RefundNotice result={notice} />}
      <section hidden={tab !== "orders"} aria-label="입금 승인 대기">
        {/* 주문 목록 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-[#6b7094]" />
            <p className="mt-4 text-sm text-[#6b7094]">
              주문 목록 불러오는 중...
            </p>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#161827]">
              <Inbox size={28} className="text-[#4a4e69]" />
            </div>
            <p className="text-base font-medium text-[#6b7094]">
              대기 중인 결제 요청이 없습니다
            </p>
            <p className="mt-1 text-sm text-[#4a4e69]">
              새로운 요청이 들어오면 실시간으로 표시됩니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedOrders.map((order) => (
              <OrderCard key={order.requestId} order={order} />
            ))}
          </div>
        )}
      </section>
      <section hidden={tab !== "grants"} aria-label="지급 실패 주문">
        {failed.isPending && <p role="status">지급 실패 목록을 불러오는 중…</p>}
        {failed.isError && (
          <p role="alert">
            지급 실패 목록을 불러오지 못했습니다. 새로고침으로 다시 조회해
            주세요.
          </p>
        )}
        {failed.isSuccess && failed.data.totalElements === 0 && (
          <p className="mb-4 text-sm text-[#a4a8bc]">
            현재 지급 실패 주문이 없습니다.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {grantRows.map((order, index) => (
            <React.Fragment key={order.orderId}>
              {tracked.length > 0 && index === 0 && (
                <h2 className="col-span-full text-sm font-semibold text-[#a4a8bc]">
                  재시도한 주문
                </h2>
              )}
              {tracked.length > 0 && index === tracked.length && (
                <h2 className="col-span-full text-sm font-semibold text-[#a4a8bc]">
                  그 밖의 지급 실패 주문
                </h2>
              )}
              <FailedGrantCard
                order={order}
                onTrack={track}
                onStartRefund={(id) => requestRefund(id, "start")}
                refundBusy={refundAction.isPending || failed.isError}
                needsReview={reviewIds.includes(order.orderId)}
              />
            </React.Fragment>
          ))}
        </div>
        {failed.data && (
          <ListPages
            data={failed.data}
            label="지급 실패 목록 페이지"
            setPage={setPage}
          />
        )}
      </section>
      {refundTab && (
        <section aria-label={dashboardTabs[tab] + " 주문"}>
          {refunds.isPending && <p role="status">환불 목록을 불러오는 중…</p>}
          {refunds.isError && (
            <p role="alert">
              환불 목록을 불러오지 못했습니다. 새로고침으로 다시 조회해 주세요.
            </p>
          )}
          {refunds.isSuccess && refunds.data.totalElements === 0 && (
            <p className="text-sm text-[#a4a8bc]">
              {dashboardTabs[tab]} 주문이 없습니다.
            </p>
          )}
          {refunds.data && (
            <>
              {refunds.data.totalElements > 0 && (
                <p className="mb-3 text-sm text-[#a4a8bc]">
                  전체 {refunds.data.totalElements.toLocaleString("ko-KR")}건
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {refunds.data.content.map((refund) => (
                  <RefundOrderCard
                    key={refund.orderId}
                    refund={refund}
                    busy={refundAction.isPending || refunds.isError}
                    needsReview={reviewIds.includes(refund.orderId)}
                    onComplete={(id) => requestRefund(id, "complete")}
                  />
                ))}
              </div>
              <ListPages
                data={refunds.data}
                label="환불 목록 페이지"
                setPage={setRefundPage}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}

function ListPages({
  data,
  label,
  setPage,
}: {
  data: PaginatedResponse<unknown>;
  label: string;
  setPage: (page: number) => void;
}) {
  if (data.totalPages <= 1) return null;
  return (
    <nav
      aria-label={label}
      className="mt-6 flex items-center justify-center gap-4 text-sm"
    >
      <button
        className="rounded-lg border px-3 py-2 disabled:opacity-40"
        disabled={!data.hasPrevious}
        onClick={() => setPage(data.currentPage - 1)}
      >
        이전
      </button>
      <span>
        {data.currentPage + 1} / {data.totalPages}
      </span>
      <button
        className="rounded-lg border px-3 py-2 disabled:opacity-40"
        disabled={!data.hasNext}
        onClick={() => setPage(data.currentPage + 1)}
      >
        다음
      </button>
    </nav>
  );
}
