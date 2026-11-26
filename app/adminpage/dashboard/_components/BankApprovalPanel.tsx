"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { type ReactNode, useState } from "react";
import {
  Activity,
  Check,
  Inbox,
  Landmark,
  Power,
  RefreshCw,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import type { AdminOrder, ApiResponse } from "@/hooks/admin/useAdminOrders";

import ObservationLedger, { type Observation } from "./ObservationLedger";

const path = "/api/v1/admin/payment/bank";
interface Status {
  enabled: boolean;
  epoch: number;
  switchedAt: string | null;
  lastSuccess: string | null;
  checkpoint: string | null;
  issue: string | null;
  queueDepth: number;
  oldestPublishWaitSeconds: number | null;
}
interface Deposit {
  id: number;
  payer: string;
  amount: number;
  second: string;
  reason: string;
  candidates: {
    id: number;
    name: string;
    status: string;
    requestedAt: string;
  }[];
}
const reasons: Record<string, string> = {
  NEW: "자동 대조 대기",
  MULTIPLE_ORDERS: "같은 이름·금액의 주문 여러 건",
  IDENTICAL_ROWS: "같은 초·이름·금액의 입금 여러 건",
  MANUAL_REVIEW: "입금 또는 주문 중복",
  NO_ORDER: "일치하는 주문 없음",
  MANUAL_PERIOD: "자동 승인 대상 시간 밖",
  ORDER_TIME_OR_STATUS: "주문 시각 또는 상태 확인",
  INCOMPLETE_IDENTITY: "입금자 또는 시각 확인",
  COVERAGE_GAP: "조회 범위 누락",
  STALE_SCAN: "이전 조회 회차",
  COUNT_CONFLICT: "원본 행 개수 불일치",
  READ_FAILED: "KB 화면 읽기 실패",
  TRANSFER_HELD: "전송 보류",
  STORAGE_FULL: "확장 저장 공간 부족",
};
export function useBankStatus() {
  return useQuery({
    queryKey: ["bankStatus"],
    refetchInterval: 15000,
    retry: false,
    queryFn: async ({ signal }) => {
      try {
        return (
          await api.get<ApiResponse<Status>>(path + "/status", { signal })
        ).data.data;
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) return null;
        throw e;
      }
    },
  });
}
const button =
  "shrink-0 cursor-pointer rounded-xl border border-admin-line bg-admin-panel px-3 py-2 text-xs font-semibold text-admin-secondary shadow-sm transition hover:bg-admin-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-40";

function RefreshListButton({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={button + " inline-flex items-center gap-1.5"}
      aria-label={label}
      disabled={busy}
      aria-busy={busy}
      onClick={onClick}
    >
      {busy ? (
        <LoadingSpinner variant="inline" label="새로고침 중" />
      ) : (
        <RefreshCw size={14} aria-hidden="true" />
      )}
      다시 조회
    </button>
  );
}
export default function BankApprovalPanel({
  active,
  orderPages,
  status,
  orders,
  selectedOrder,
  onSelect,
}: {
  active: boolean;
  orderPages: ReactNode;
  status: Status;
  orders: AdminOrder[];
  selectedOrder: number | null;
  onSelect: (id: number | null) => void;
}) {
  const client = useQueryClient();
  const [pendingAmountsOnly, setPendingAmountsOnly] = useState(true);
  const [cursors, setCursors] = useState([0]);
  const after = cursors[cursors.length - 1];
  const [depositId, setDeposit] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const raw = useQuery({
    queryKey: ["bankRecentObservations"],
    enabled: active,
    refetchInterval: active ? 15000 : false,
    queryFn: async ({ signal }) =>
      (
        await api.get<ApiResponse<Observation[]>>(
          path + "/observations/recent",
          {
            signal,
          },
        )
      ).data.data,
  });
  const reviewPath = pendingAmountsOnly ? "/review/pending-amounts" : "/review";
  const review = useQuery({
    queryKey: ["bankReview", reviewPath, after],
    enabled: active,
    refetchInterval: active ? 15000 : false,
    queryFn: async ({ signal }) =>
      (
        await api.get<ApiResponse<Deposit[]>>(path + reviewPath, {
          params: { after, limit: 31 },
          signal,
        })
      ).data.data,
  });
  const refresh = async () => {
    await Promise.all(
      ["bankReview", "bankStatus", "adminOrders"].map((key) =>
        client.invalidateQueries({ queryKey: [key] }),
      ),
    );
  };
  const toggle = useMutation({
    retry: false,
    mutationFn: () =>
      api.post<ApiResponse<Status>>(path + "/switch", {
        enabled: !status.enabled,
        epoch: status.epoch,
      }),
    onSuccess: ({ data }) => client.setQueryData(["bankStatus"], data.data),
    onSettled: refresh,
    onError: () =>
      setNotice(
        "자동 승인 설정을 확인하지 못했습니다. 현재 상태를 확인해 주세요.",
      ),
  });
  const link = useMutation({
    retry: false,
    mutationFn: ({ deposit, order }: { deposit: number; order: number }) =>
      api.post(path + "/deposits/" + deposit + "/orders/" + order),
    onSuccess: () => {
      setDeposit(null);
      onSelect(null);
      setNotice("선택한 입금과 주문을 연결해 승인했습니다.");
    },
    onError: () =>
      setNotice(
        "승인 결과를 확인해 주세요. 입금과 주문 목록을 다시 조회했습니다.",
      ),
    onSettled: refresh,
  });
  const rows = review.data?.slice(0, 30) ?? [];
  const deposit = rows.find((row) => row.id === depositId);
  const order = orders.find(
    (o) => o.requestId === selectedOrder && o.status === "PENDING",
  );
  const choices = deposit
    ? orders.filter(
        (o) => o.status === "PENDING" && o.expectedPrice === deposit.amount,
      )
    : [];
  const candidateChoices = (deposit?.candidates ?? []).filter(
    (candidate) => candidate.status === "PENDING",
  );
  const selectedCandidate = candidateChoices.find(
    (candidate) => candidate.id === selectedOrder,
  );
  const candidatesOnOtherPages = candidateChoices
    .filter((c) => !choices.some((o) => o.requestId === c.id))
    .filter((c, i) => i < 20 || c.id === selectedOrder);
  const canLink =
    deposit && (selectedCandidate || order?.expectedPrice === deposit.amount);
  return (
    <section
      id="bank-deposits"
      aria-label="계좌 입금 대조"
      className="text-admin-ink space-y-4 text-sm"
    >
      <div className="border-admin-edge bg-admin-panel overflow-hidden rounded-2xl border shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="text-admin-danger flex size-10 items-center justify-center rounded-xl bg-rose-500/10">
              <Landmark size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold">KB 계좌 자동 승인</h2>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${status.enabled ? "text-admin-success" : "text-admin-warning"}`}
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-current"
                />
                {status.enabled ? "켜짐 · 자동 승인 중" : "꺼짐 · 수동 승인 중"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px disabled:cursor-wait disabled:opacity-60 ${status.enabled ? "bg-rose-700 hover:bg-rose-800" : "bg-emerald-700 hover:bg-emerald-800"}`}
            disabled={toggle.isPending}
            onClick={() => {
              setNotice("");
              toggle.mutate();
            }}
          >
            <Power size={16} aria-hidden="true" />
            {toggle.isPending ? (
              <LoadingSpinner variant="inline" label="변경 중" />
            ) : status.enabled ? (
              "자동 승인 끄기"
            ) : (
              "자동 승인 켜기"
            )}
          </button>
        </div>
        <dl className="border-admin-edge bg-admin-subtle/40 grid grid-cols-2 gap-4 border-t px-5 py-4 sm:grid-cols-[2fr_1fr_1fr] sm:px-6">
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-admin-muted flex items-center gap-1 text-xs">
              <Activity size={13} aria-hidden="true" />
              마지막 정상 조회 · 한국 시각
            </dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {status.lastSuccess?.replace("T", " ").slice(0, 19) ??
                "기록 없음"}
            </dd>
          </div>
          <div>
            <dt className="text-admin-muted text-xs">확장 전송 대기</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {status.queueDepth}묶음
            </dd>
          </div>
          <div>
            <dt className="text-admin-muted text-xs">Kafka 발행 대기</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {status.oldestPublishWaitSeconds ?? 0}초
            </dd>
          </div>
        </dl>
      </div>
      {status.issue && (
        <p
          role="alert"
          className="text-admin-warning rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
        >
          {reasons[status.issue] ?? status.issue}
          {status.issue === "COVERAGE_GAP" && (
            <span className="mt-1 block text-sm">
              {status.checkpoint
                ? `KB 조회 기간에 마지막 확인 거래일(${status.checkpoint.slice(0, 10)})부터 오늘까지 포함해 주세요. `
                : "KB 조회 기간이 오늘을 포함하는지 확인해 주세요. "}
              조회를 눌러 첫 페이지를 연 뒤 확장에서 다음 자동 조회 결과를
              확인하세요.
            </span>
          )}
        </p>
      )}
      <div className="border-admin-edge bg-admin-panel space-y-4 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-bold">
            <Inbox size={17} className="text-admin-muted" aria-hidden="true" />
            미연결 입금
          </h3>
          <RefreshListButton
            label="미연결 입금 다시 조회"
            busy={review.isFetching}
            onClick={() => void review.refetch()}
          />
        </div>
        <div
          role="group"
          aria-label="미연결 입금 표시 범위"
          className="border-admin-edge bg-admin-subtle inline-flex max-w-full gap-1 rounded-xl border p-1"
        >
          {([true, false] as const).map((matching) => (
            <button
              key={String(matching)}
              type="button"
              aria-pressed={pendingAmountsOnly === matching}
              className="text-admin-muted hover:text-admin-ink aria-pressed:bg-admin-panel aria-pressed:text-admin-ink inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:shadow-sm"
              onClick={() => {
                if (pendingAmountsOnly === matching) return;
                setPendingAmountsOnly(matching);
                setCursors([0]);
                setDeposit(null);
                onSelect(null);
              }}
            >
              {pendingAmountsOnly === matching && (
                <Check
                  size={14}
                  aria-hidden="true"
                  className="text-admin-danger"
                />
              )}
              {matching ? "대기 주문 금액 일치" : "전체 입금"}
            </button>
          ))}
        </div>
        {order && (
          <p className="bg-admin-subtle text-admin-secondary rounded-xl px-3 py-2">
            선택한 주문 #{order.requestId} · {order.requesterRealName} ·{" "}
            {order.expectedPrice.toLocaleString()}원
          </p>
        )}
        {review.isError && (
          <p role="alert" className="text-admin-danger text-sm">
            미연결 입금을 불러오지 못했습니다.
          </p>
        )}
        {review.isPending && (
          <LoadingSpinner label="입금을 조회하고 있습니다" />
        )}
        {review.isSuccess && !rows.length && (
          <p className="border-admin-edge bg-admin-subtle/40 text-admin-muted rounded-xl border border-dashed px-4 py-8 text-center">
            {pendingAmountsOnly
              ? "대기 주문과 금액이 같은 미연결 입금이 없습니다."
              : "이 페이지에 미연결 입금이 없습니다."}
          </p>
        )}
        <ul className="divide-admin-edge divide-y empty:hidden">
          {rows.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div>
                <strong>
                  {d.payer || "입금자 미표시"} · {d.amount.toLocaleString()}원
                </strong>
                <p className="text-admin-muted mt-1 text-xs">
                  {d.second.replace("T", " ")} · {reasons[d.reason] ?? d.reason}
                </p>
                {d.candidates.length > 0 && (
                  <p>
                    후보 주문{" "}
                    {d.candidates
                      .slice(0, 3)
                      .map((c) => "#" + c.id + " (" + c.status + ")")
                      .join(", ")}
                    {d.candidates.length > 3 &&
                      ` 외 ${d.candidates.length - 3}건`}
                  </p>
                )}
              </div>
              <button
                className={button}
                aria-pressed={depositId === d.id}
                onClick={() => {
                  setDeposit(d.id);
                  setNotice("");
                  if (order?.expectedPrice !== d.amount) onSelect(null);
                }}
              >
                {depositId === d.id ? "선택됨" : "입금 선택"}
              </button>
            </li>
          ))}
        </ul>
        {(cursors.length > 1 || (review.data?.length ?? 0) > 30) && (
          <nav className="flex gap-3" aria-label="미연결 입금 페이지">
            <button
              className={button}
              disabled={cursors.length < 2}
              onClick={() => {
                setDeposit(null);
                setCursors((c) => c.slice(0, -1));
              }}
            >
              이전
            </button>
            <button
              className={button}
              disabled={(review.data?.length ?? 0) <= 30}
              onClick={() => {
                setDeposit(null);
                setCursors((c) => [...c, rows[29].id]);
              }}
            >
              다음
            </button>
          </nav>
        )}
        {deposit && (
          <div className="bg-admin-subtle/60 border-admin-edge grid gap-3 rounded-xl border p-4">
            <label className="text-admin-secondary grid gap-1.5 font-semibold">
              연결할 주문{" "}
              <select
                value={canLink ? (selectedOrder ?? "") : ""}
                onChange={(e) => onSelect(Number(e.target.value) || null)}
                className="border-admin-line bg-admin-panel w-full min-w-0 rounded-xl border px-3 py-2 font-normal"
              >
                <option value="">주문 선택</option>
                {candidatesOnOtherPages.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} {c.name} ·{" "}
                    {c.requestedAt.replace("T", " ").slice(0, 19)} · 후보 주문
                  </option>
                ))}
                {choices.map((o) => (
                  <option key={o.requestId} value={o.requestId}>
                    #{o.requestId} {o.requesterRealName} ({o.requesterUsername})
                    · {o.requestedItemName} ·{" "}
                    {o.requestedAt.replace("T", " ").slice(0, 19)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-admin-secondary text-xs">
              입금자와 금액이 일치하는 후보, 현재 주문 페이지에서 금액이
              일치하는 주문을 표시합니다.
            </p>
            {orderPages}
            <button
              className={button + " justify-self-start"}
              disabled={!canLink || link.isPending || review.isError}
              onClick={() => {
                if (canLink && selectedOrder !== null)
                  link.mutate({ deposit: deposit.id, order: selectedOrder });
              }}
            >
              입금 #{deposit.id} 연결 승인
            </button>
          </div>
        )}
      </div>
      <ObservationLedger
        rows={raw.data ?? []}
        loading={raw.isPending}
        failed={raw.isError}
        refreshButton={
          <RefreshListButton
            label="원본 관측 내역 다시 조회"
            busy={raw.isFetching}
            onClick={() => void raw.refetch()}
          />
        }
      />
      {notice && (
        <p
          role="status"
          className="border-admin-line bg-admin-panel rounded-xl border px-4 py-3"
        >
          {notice}
        </p>
      )}
    </section>
  );
}
