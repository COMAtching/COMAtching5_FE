"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import BankApprovalPanel, { useBankStatus } from "./BankApprovalPanel";
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
  bank: "자동 승인",
  orders: "입금 승인 대기",
  grants: "지급 실패",
  IN_PROGRESS: "환불 진행 중",
  COMPLETED: "환불 완료",
} as const;
type DashboardTab = keyof typeof dashboardTabs;

export default function AdminDashboard() {
  const [ordersPage, setOrdersPage] = React.useState(0);
  const {
    data: ordersData,
    isLoading,
    isError: ordersError,
    refetch,
    isRefetching,
  } = useAdminOrders(ordersPage);
  const bank = useBankStatus();
  const [selectedBankOrder, setSelectedBankOrder] = React.useState<
    number | null
  >(null);
  const [tab, setTab] = React.useState<DashboardTab>("bank");
  const client = useQueryClient();
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
  const refreshing =
    tab === "bank"
      ? bank.isFetching
      : tab === "orders"
        ? isRefetching
        : activeList.isFetching;
  const { status: socketStatus } = useAdminOrderSocket();

  const orders = ordersData?.content ?? [];
  const lastOrdersPage = ordersData && Math.max(0, ordersData.totalPages - 1);
  if (lastOrdersPage !== undefined && ordersPage > lastOrdersPage)
    setOrdersPage(lastOrdersPage);

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#ff4d61]/40"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d61] to-[#ff775e]">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-admin-ink text-lg font-bold sm:text-xl">
                결제 승인 관리
              </h1>
              <p className="text-admin-muted text-xs">
                대기 중인 요청{" "}
                <span className="text-admin-danger font-semibold">
                  {ordersData?.totalElements.toLocaleString("ko-KR") ?? "—"}
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
            onClick={() => {
              if (tab === "bank") {
                for (const key of [
                  "bankStatus",
                  "bankReview",
                  "bankRecentObservations",
                ]) {
                  void client.invalidateQueries({ queryKey: [key] });
                }
              } else if (tab === "orders") void refetch();
              else void activeList.refetch();
            }}
            disabled={refreshing}
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-200 hover:border-[#ff4d61]/40 disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">새로고침</span>
          </button>

          {/* 연결 상태 */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium sm:px-4 sm:text-sm ${
              socketStatus === "connected"
                ? "text-admin-success border-emerald-500/30 bg-emerald-500/10"
                : socketStatus === "reconnecting"
                  ? "text-admin-warning border-amber-500/30 bg-amber-500/10"
                  : "text-admin-danger border-red-500/30 bg-red-500/10"
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
        <div className="text-admin-danger mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
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
        className="border-admin-line mb-6 flex flex-wrap gap-2 border-b pb-3"
        aria-label="결제 관리 목록"
        role="group"
      >
        {(Object.keys(dashboardTabs) as DashboardTab[]).map((value) => (
          <button
            key={value}
            aria-pressed={tab === value}
            onClick={() => selectTab(value)}
            className="text-admin-secondary aria-pressed:bg-admin-subtle aria-pressed:text-admin-ink rounded-lg px-4 py-2 text-sm font-semibold"
          >
            {dashboardTabs[value]}
            {value === "grants" &&
              failed.data &&
              ` (${failed.data.totalElements})`}
          </button>
        ))}
      </div>
      {notice && <RefundNotice result={notice} />}
      <section hidden={tab !== "bank"} aria-label="자동 승인">
        {bank.isPending && (
          <p role="status">계좌 자동 승인 상태를 조회하고 있습니다.</p>
        )}
        {bank.isError && (
          <div
            role="alert"
            className="bg-admin-panel border-admin-line flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
          >
            <span className="text-admin-danger">
              계좌 자동 승인 상태를 확인할 수 없습니다.
            </span>
            <button
              className="border-admin-line text-admin-secondary hover:bg-admin-hover inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold"
              disabled={bank.isFetching}
              onClick={() => void bank.refetch()}
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
                className={bank.isFetching ? "animate-spin" : ""}
              />
              다시 조회
            </button>
          </div>
        )}
        {bank.isSuccess && !bank.data && (
          <p className="text-admin-secondary">
            이 서버에서는 계좌 자동 승인 기능을 사용하지 않습니다.
          </p>
        )}
        {bank.isSuccess && bank.data && (
          <BankApprovalPanel
            active={tab === "bank"}
            status={bank.data}
            orders={orders}
            selectedOrder={selectedBankOrder}
            onSelect={setSelectedBankOrder}
            orderPages={
              ordersData && (
                <ListPages
                  data={ordersData}
                  label="연결할 대기 주문 페이지"
                  setPage={setOrdersPage}
                />
              )
            }
          />
        )}
      </section>
      {tab === "orders" && (
        <section aria-label="입금 승인 대기">
          {/* 주문 목록 */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 size={32} className="text-admin-muted animate-spin" />
              <p className="text-admin-muted mt-4 text-sm">
                주문 목록 불러오는 중...
              </p>
            </div>
          ) : ordersError ? (
            <p role="alert">
              대기 주문을 불러오지 못했습니다.{" "}
              <button onClick={() => void refetch()}>다시 조회</button>
            </p>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="bg-admin-panel mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Inbox size={28} className="text-admin-muted" />
              </div>
              <p className="text-admin-muted text-base font-medium">
                대기 중인 결제 요청이 없습니다
              </p>
              <p className="text-admin-muted mt-1 text-sm">
                새로운 요청이 들어오면 실시간으로 표시됩니다
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {orders.map((order) => (
                <OrderCard
                  key={order.requestId}
                  order={order}
                  onSelectDeposit={
                    bank.data?.enabled
                      ? () => {
                          setSelectedBankOrder(order.requestId);
                          selectTab("bank");
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
          {ordersData && (
            <ListPages
              data={ordersData}
              label="승인 대기 주문 페이지"
              setPage={setOrdersPage}
            />
          )}
        </section>
      )}
      <section hidden={tab !== "grants"} aria-label="지급 실패 주문">
        {failed.isPending && <p role="status">지급 실패 목록을 불러오는 중…</p>}
        {failed.isError && (
          <p role="alert">
            지급 실패 목록을 불러오지 못했습니다. 새로고침으로 다시 조회해
            주세요.
          </p>
        )}
        {failed.isSuccess && failed.data.totalElements === 0 && (
          <p className="text-admin-secondary mb-4 text-sm">
            현재 지급 실패 주문이 없습니다.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {grantRows.map((order, index) => (
            <React.Fragment key={order.orderId}>
              {tracked.length > 0 && index === 0 && (
                <h2 className="text-admin-secondary col-span-full text-sm font-semibold">
                  재시도한 주문
                </h2>
              )}
              {tracked.length > 0 && index === tracked.length && (
                <h2 className="text-admin-secondary col-span-full text-sm font-semibold">
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
            <p className="text-admin-secondary text-sm">
              {dashboardTabs[tab]} 주문이 없습니다.
            </p>
          )}
          {refunds.data && (
            <>
              {refunds.data.totalElements > 0 && (
                <p className="text-admin-secondary mb-3 text-sm">
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
