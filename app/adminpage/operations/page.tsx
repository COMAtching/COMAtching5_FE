"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  HeartHandshake,
  MessagesSquare,
  Power,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { api } from "@/lib/axios";
import {
  FEATURE_NAMES,
  useFeatureStates,
  type Feature,
  type FeatureState,
} from "@/stores/features";

type Operation = FeatureState & { changedAt: string; changedBy: number | null };
const path = "/api/v1/admin/operations";
const closeButtonColor = "bg-[#bf293a] text-white";
const reopenButtonColor = "bg-[#167047] text-white";

type RowProps = {
  row: Operation;
  refresh: () => Promise<unknown>;
  serviceClosed: boolean;
  error?: string;
  setError: (message: string) => void;
};

const appearance = {
  LOGIN: { Icon: Power, gradient: "from-[#ff4d61] to-[#ff775e]" },
  CHAT: { Icon: MessagesSquare, gradient: "from-[#06b6d4] to-[#3b82f6]" },
  MATCHING: { Icon: HeartHandshake, gradient: "from-[#ec4899] to-[#be185d]" },
  SHOP_PAYMENT: { Icon: ShoppingBag, gradient: "from-[#6366f1] to-[#8b5cf6]" },
} as const;
const descriptions: Record<Feature, string> = {
  LOGIN:
    "종료하면 접속 중인 회원이 모두 로그아웃되고 모든 회원 기능이 중단됩니다.",
  CHAT: "개별 종료 중에는 기존 대화와 첨부만 볼 수 있습니다.",
  MATCHING: "개별 종료 중에는 신규 매칭 신청을 받지 않습니다.",
  SHOP_PAYMENT:
    "개별 종료 중에는 신규 주문을 받지 않습니다. 관리자는 기존 주문을 처리할 수 있습니다.",
};

function OperationRow({
  row,
  refresh,
  serviceClosed,
  error,
  setError,
}: RowProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const master = row.feature === "LOGIN";
  const { Icon, gradient } = appearance[row.feature];
  const overridden = !master && serviceClosed;
  const [message, setMessage] = useState(row.message);
  const [saving, setSaving] = useState(false);
  async function save(open: boolean) {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch<Operation>(path + "/" + row.feature, {
        open,
        message,
        version: row.version,
      });
      if (master) useFeatureStates.getState().update([data]);
      await refresh();
    } catch (e) {
      setError(
        axios.isAxiosError(e) && e.response?.status === 409
          ? "다른 관리자가 변경했습니다. 최신 상태를 확인해주세요."
          : "저장하지 못했습니다. 다시 시도해주세요.",
      );
      await refresh();
    } finally {
      setSaving(false);
    }
  }
  return (
    <section
      aria-label={FEATURE_NAMES[row.feature]}
      className="border-admin-edge bg-admin-panel grid min-w-0 gap-4 rounded-2xl border p-5 md:grid-cols-2 md:gap-8"
    >
      <div className="min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white ${gradient}`}
          >
            <Icon size={20} aria-hidden />
          </span>
          <h2 className="text-lg font-semibold">
            {FEATURE_NAMES[row.feature]}
          </h2>
          <strong
            className={`rounded-full px-2.5 py-1 text-xs ${row.open && !overridden ? "text-admin-success bg-emerald-400/10" : "text-admin-danger bg-[#ff4d61]/10"}`}
          >
            {overridden ? "전체 종료 중" : row.open ? "운영 중" : "종료"}
          </strong>
        </div>
        <p className="text-admin-secondary text-sm leading-relaxed">
          {descriptions[row.feature]}
        </p>
        {overridden && (
          <p className="text-admin-secondary text-sm">
            서비스 재개 후 · {row.open ? "운영" : "종료 유지"}
          </p>
        )}
        <p className="text-admin-muted text-xs">
          {new Date(row.changedAt).toLocaleString("ko-KR")} ·{" "}
          {row.changedBy == null ? "초기 설정" : `관리자 #${row.changedBy}`}
        </p>
      </div>
      <div className="min-w-0 space-y-2">
        <label className="text-admin-secondary block text-sm font-medium">
          종료 안내 문구
          <textarea
            rows={2}
            className="border-admin-line bg-admin-canvas text-admin-ink mt-2 w-full resize-y rounded-lg border px-3 py-2.5 text-base"
            value={message}
            placeholder="비워 두면 기본 안내 사용"
            maxLength={240}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${row.open ? closeButtonColor : reopenButtonColor}`}
            disabled={saving || overridden}
            onClick={() =>
              master && row.open
                ? dialog.current?.showModal()
                : void save(!row.open)
            }
          >
            {master
              ? row.open
                ? "서비스 종료"
                : "서비스 재개"
              : row.open
                ? "운영 종료"
                : "운영 재개"}
          </button>
          <button
            className="border-admin-line bg-admin-panel text-admin-secondary rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            disabled={saving || message === row.message}
            onClick={() => save(row.open)}
          >
            문구 저장
          </button>
        </div>
      </div>
      {master && (
        <dialog
          ref={dialog}
          aria-labelledby="service-close-title"
          className="border-admin-line bg-admin-panel text-admin-ink fixed inset-0 m-auto w-[min(90vw,24rem)] rounded-2xl border p-6 backdrop:bg-black/65"
        >
          <h2 id="service-close-title" className="text-xl font-bold">
            서비스를 종료할까요?
          </h2>
          <p className="my-4 leading-relaxed">
            일반 회원이 모두 로그아웃되고 로그인·채팅·매칭·상점 이용이
            중단됩니다. 재개하면 개별 기능은 이전 설정을 따릅니다.
          </p>
          <form method="dialog" className="flex justify-end gap-2">
            <button autoFocus className="rounded-lg border px-4 py-2">
              취소
            </button>
            <button
              className={`rounded-lg px-4 py-2 font-semibold ${closeButtonColor}`}
              type="button"
              onClick={() => {
                dialog.current?.close();
                void save(false);
              }}
            >
              서비스 종료
            </button>
          </form>
        </dialog>
      )}
      {error && (
        <p className="text-admin-danger md:col-span-2" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default function OperationsPage() {
  const [errors, setErrors] = useState<Partial<Record<Feature, string>>>({});
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "operations"],
    queryFn: async () => (await api.get<Operation[]>(path)).data,
  });
  const versions = useFeatureStates((state) =>
    Object.values(state.versions).join(","),
  );
  useEffect(() => {
    if (versions) void refetch();
  }, [versions, refetch]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex items-center gap-3">
        <Link
          href="/adminpage/main"
          aria-label="관리자 콘솔로 돌아가기"
          className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#ff4d61]/40"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#ff4d61] to-[#ff775e]">
          <Shield size={20} className="text-white" aria-hidden />
        </span>
        <h1 className="text-admin-ink text-xl font-bold sm:text-2xl">
          기능 운영
        </h1>
      </header>
      <p className="text-admin-secondary mb-4 text-sm leading-relaxed">
        종료 안내 문구는 기능이 닫혔을 때 회원에게 보입니다. ‘문구 저장’은 운영
        상태를 유지하고 안내만 변경합니다.
      </p>
      {isLoading && <p role="status">상태를 불러오는 중…</p>}
      {isError && (
        <button onClick={() => refetch()}>운영 상태 다시 불러오기</button>
      )}
      <div
        role="region"
        aria-label="기능별 운영 설정"
        className="grid min-w-0 grid-cols-1 gap-3"
      >
        {data
          ?.slice()
          .sort(
            (a, b) =>
              Number(b.feature === "LOGIN") - Number(a.feature === "LOGIN"),
          )
          .map((row) => (
            <OperationRow
              key={row.feature + row.version}
              row={row}
              serviceClosed={
                data?.some(
                  (entry) => entry.feature === "LOGIN" && !entry.open,
                ) ?? false
              }
              refresh={refetch}
              error={errors[row.feature]}
              setError={(message) =>
                setErrors((old) => ({ ...old, [row.feature]: message }))
              }
            />
          ))}
      </div>
    </main>
  );
}
