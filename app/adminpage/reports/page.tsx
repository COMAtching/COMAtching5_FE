"use client";

import Link from "next/link";
import { useState } from "react";
import { Select } from "radix-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Flag,
  RotateCw,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Check,
  Inbox,
} from "lucide-react";
import {
  reportCategories,
  type ReportCategory,
} from "@/lib/constants/reportCategories";
import { isAxiosError } from "axios";
import MemberModerationNotice from "@/components/common/MemberModerationNotice";
import ProfileThumbnail from "@/components/common/ProfileThumbnail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";

const base = "/api/v1/admin/reports";
const labels = {
  OPEN: "접수",
  WARNED: "경고",
  SUSPENDED: "정지 조치",
  DISMISSED: "조치 없이 종결",
};
type Status = keyof typeof labels;
const filterLabels = { ALL: "전체", ...labels };
type StatusFilter = keyof typeof filterLabels;
type Summary = {
  id: number;
  nickname: string | null;
  targetId: number;
  source: "CHAT" | "PROFILE";
  category: ReportCategory | null;
  status: Status;
  createdAt: string;
};
type Detail = {
  report: Summary;
  reporterId: number;
  reason: string;
  intro: string | null;
  imageUrl: string | null;
  major: string | null;
  decisionNote: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  liftedAt: string | null;
  liftedBy: number | null;
};
type Action = "WARN" | "SUSPEND" | "DISMISS" | "LIFT";
const actions = {
  WARN: "경고 보내기",
  SUSPEND: "이용 정지",
  DISMISS: "조치 없이 종결",
  LIFT: "정지 해제",
};
const button =
  "rounded-xl border border-admin-line px-4 py-2 text-sm disabled:opacity-40";
const card = "rounded-2xl border border-admin-edge bg-admin-panel p-5";
const date = (value: string) => value.replace("T", " ").slice(0, 16);

const statusColor: Record<Status, string> = {
  OPEN: "bg-sky-500/10 text-admin-info",
  WARNED: "bg-amber-500/10 text-admin-warning",
  SUSPENDED: "bg-rose-500/10 text-admin-danger",
  DISMISSED: "bg-admin-subtle text-admin-secondary",
};

function MemberPreview() {
  const [kind, setKind] = useState<"warning" | "suspension">("warning");
  return (
    <details className={card}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold">
        <Smartphone size={18} aria-hidden="true" />
        회원 화면 미리보기
        <ChevronRight
          size={16}
          className="ml-auto in-[[open]]:rotate-90"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3 flex gap-2" role="group" aria-label="안내 종류">
        {(["warning", "suspension"] as const).map((v) => (
          <button
            type="button"
            key={v}
            aria-pressed={kind === v}
            className={
              button +
              " aria-pressed:bg-admin-ink aria-pressed:text-admin-panel"
            }
            onClick={() => setKind(v)}
          >
            {v === "warning" ? "경고 · 홈" : "정지 · 로그인"}
          </button>
        ))}
      </div>
      <div className="mt-4 max-w-sm">
        {kind === "warning" ? (
          <MemberModerationNotice
            kind="warning"
            message="서로를 존중하는 표현을 사용해 주세요."
          />
        ) : (
          <MemberModerationNotice kind="suspension" />
        )}
      </div>
      <p className="text-admin-muted mt-2 text-xs">
        {kind === "warning"
          ? "예시 경고 문구입니다. 실제 회원에게는 운영자가 입력한 내용이 표시됩니다."
          : "회원이 정지된 계정으로 다시 로그인할 때 표시됩니다."}
      </p>
    </details>
  );
}

function ReportReview({ id }: { id: number }) {
  const client = useQueryClient();
  const [action, setAction] = useState<Action | null>(null);
  const [note, setNote] = useState("");
  const detail = useQuery({
    queryKey: ["adminReports", "detail", id],
    queryFn: async ({ signal }) =>
      (await api.get<{ data: Detail }>(base + "/" + id, { signal })).data.data,
  });
  const decision = useMutation({
    mutationFn: async (selected: Action) => {
      if (selected === "LIFT") await api.post(base + "/" + id + "/lift");
      else
        await api.post(base + "/" + id + "/decision", {
          action: selected,
          note: note.trim(),
        });
    },
    onSuccess: async () => {
      setAction(null);
      setNote("");
      await client.invalidateQueries({ queryKey: ["adminReports"] });
    },
    onError: () => {
      void client.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });
  if (detail.isLoading) return <LoadingSpinner label="신고 상세 불러오는 중" />;
  const row = detail.data;
  if (!row)
    return (
      <button className={button} onClick={() => void detail.refetch()}>
        신고 상세 다시 불러오기
      </button>
    );
  const open = row.report.status === "OPEN";
  const canLift = row.report.status === "SUSPENDED" && !row.liftedAt;
  return (
    <section aria-label="신고 상세" className={card + " space-y-5"}>
      <header className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
          <ProfileThumbnail url={row.imageUrl} alt="신고 당시 프로필 사진" />
        </div>
        <div>
          <p className="text-admin-muted text-xs">
            신고 당시 프로필 · 회원 #{row.report.targetId}
          </p>
          <h2 className="text-lg font-bold">
            {row.report.nickname || "닉네임 없음"}
          </h2>
          <p className="text-sm">{row.major}</p>
        </div>
      </header>
      <p className="text-admin-secondary break-words whitespace-pre-wrap">
        {row.intro || "등록한 자기소개가 없습니다."}
      </p>
      <div className="bg-admin-subtle rounded-xl p-4">
        <p className="text-admin-muted mb-2 text-xs">
          신고 분류 ·{" "}
          {row.report.category
            ? reportCategories[row.report.category]
            : "미분류"}
        </p>
        <h3 className="font-semibold">신고 사유</h3>
        <p className="my-2 break-words whitespace-pre-wrap">{row.reason}</p>
        <p className="text-admin-muted text-xs">
          {row.report.source === "CHAT" ? "채팅" : "프로필"} · 신고자 #
          {row.reporterId} · {date(row.report.createdAt)}
        </p>
      </div>
      {row.reviewedAt && (
        <div>
          <h3 className="font-semibold">{labels[row.report.status]}</h3>
          <p className="break-words whitespace-pre-wrap">{row.decisionNote}</p>
          <p className="text-admin-muted text-xs">
            {date(row.reviewedAt)} · 운영자 #{row.reviewedBy}
          </p>
        </div>
      )}
      {row.liftedAt && (
        <p>
          정지 해제 · {date(row.liftedAt)} · 운영자 #{row.liftedBy}
        </p>
      )}
      {(open || canLift) && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(open
              ? (["WARN", "SUSPEND", "DISMISS"] as const)
              : (["LIFT"] as const)
            ).map((key) => (
              <button
                type="button"
                key={key}
                disabled={decision.isPending}
                aria-pressed={action === key}
                className={
                  button +
                  " aria-pressed:bg-admin-ink aria-pressed:text-admin-panel"
                }
                onClick={() => {
                  setAction(key);
                  decision.reset();
                }}
              >
                {actions[key]}
              </button>
            ))}
          </div>
          {action && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!decision.isPending) decision.mutate(action);
              }}
            >
              {action !== "LIFT" && (
                <label className="grid gap-2 text-sm font-semibold">
                  {action === "WARN" ? "회원에게 보낼 경고 내용" : "처리 사유"}
                  <textarea
                    required
                    maxLength={500}
                    rows={3}
                    value={note}
                    disabled={decision.isPending}
                    onChange={(e) => setNote(e.target.value)}
                    className="border-admin-line bg-admin-panel rounded-xl border p-3"
                  />
                </label>
              )}
              {action === "WARN" && note.trim() && (
                <div className="max-w-sm">
                  <p className="text-admin-muted mb-2 text-xs">
                    회원에게 보이는 내용
                  </p>
                  <MemberModerationNotice
                    kind="warning"
                    message={note.trim()}
                  />
                </div>
              )}
              {action === "SUSPEND" && (
                <p className="text-admin-danger text-sm">
                  회원의 현재 세션이 종료되고 로그인이 제한됩니다.
                </p>
              )}
              {action === "LIFT" && (
                <p className="text-sm">회원이 다시 로그인할 수 있게 됩니다.</p>
              )}
              <button
                disabled={
                  decision.isPending || (action !== "LIFT" && !note.trim())
                }
                className={button + " bg-admin-ink text-admin-panel"}
              >
                {actions[action]} 확정
              </button>
            </form>
          )}
        </div>
      )}
      {decision.isError && (
        <p role="alert" className="text-admin-danger">
          {(isAxiosError(decision.error) &&
            decision.error.response?.data?.message) ||
            "처리하지 못했습니다. 다시 확인해 주세요."}
        </p>
      )}
    </section>
  );
}

export default function ReportsPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>("OPEN");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const list = useQuery({
    queryKey: ["adminReports", "list", status, page],
    queryFn: async ({ signal }) =>
      (
        await api.get<{
          data: { content: Summary[]; hasNext: boolean; totalElements: number };
        }>(base, {
          params: { page, status: status === "ALL" ? undefined : status },
          signal,
        })
      ).data.data,
  });
  return (
    <main className="mx-auto max-w-5xl space-y-5 p-4 sm:p-8">
      <Link
        href="/adminpage/main"
        className="text-admin-secondary inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} />
        관리자 콘솔
      </Link>
      <header className="flex items-center gap-3">
        <span className="text-admin-danger flex size-11 items-center justify-center rounded-xl bg-rose-500/10">
          <Flag size={21} aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">신고 관리</h1>
      </header>
      <MemberPreview />
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <section className={card}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <label
                htmlFor="report-status"
                className="text-admin-secondary shrink-0 text-sm font-medium"
              >
                처리 상태
              </label>
              <Select.Root
                value={status}
                onValueChange={(value: StatusFilter) => {
                  setStatus(value);
                  setPage(0);
                  setSelected(null);
                }}
              >
                <Select.Trigger
                  id="report-status"
                  className="group border-admin-line bg-admin-panel text-admin-ink hover:bg-admin-hover data-[state=open]:border-admin-muted focus-visible:ring-admin-info flex h-11 w-36 items-center justify-between gap-2 rounded-xl border px-3 text-sm font-semibold outline-none focus-visible:ring-2"
                >
                  <Select.Value />
                  <Select.Icon asChild>
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className="text-admin-muted group-data-[state=open]:rotate-180 motion-safe:transition-transform"
                    />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content
                  position="popper"
                  align="start"
                  sideOffset={5}
                  collisionPadding={8}
                  className="border-admin-edge bg-admin-panel text-admin-ink z-50 max-h-[var(--radix-select-content-available-height)] w-44 overflow-y-auto rounded-xl border p-1 shadow-md"
                >
                  <Select.Viewport>
                    {Object.entries(filterLabels).map(([value, label]) => (
                      <Select.Item
                        key={value}
                        value={value}
                        className="data-[highlighted]:bg-admin-hover data-[state=checked]:text-admin-ink text-admin-secondary flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 text-sm outline-none select-none data-[state=checked]:font-semibold"
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check size={16} aria-hidden="true" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
            <button
              type="button"
              title="신고 새로고침"
              aria-label="신고 새로고침"
              disabled={list.isFetching}
              className="border-admin-edge text-admin-secondary hover:bg-admin-hover inline-flex size-11 items-center justify-center rounded-xl border disabled:opacity-60"
              onClick={() =>
                void client.invalidateQueries({ queryKey: ["adminReports"] })
              }
            >
              <RotateCw
                aria-hidden="true"
                size={17}
                className={
                  list.isFetching ? "motion-safe:animate-spin" : undefined
                }
              />
            </button>
          </div>
          {list.data && !list.isError && (
            <p className="border-admin-edge text-admin-muted border-t py-3 text-xs font-medium">
              {filterLabels[status]} · {list.data.totalElements}건
            </p>
          )}
          {list.isLoading ? (
            <LoadingSpinner label="신고 불러오는 중" />
          ) : list.isError ? (
            <p role="alert">신고 목록을 불러오지 못했습니다.</p>
          ) : !list.data?.content.length ? (
            <p className="text-admin-muted flex flex-col items-center gap-3 py-8 text-center">
              <Inbox size={24} aria-hidden="true" />
              해당하는 신고가 없습니다.
            </p>
          ) : (
            list.data.content.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                aria-pressed={selected === r.id}
                className="border-admin-edge aria-pressed:bg-admin-subtle block w-full border-b p-3 text-left"
              >
                <span
                  className={
                    statusColor[r.status] +
                    " inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                  }
                >
                  {labels[r.status]}
                </span>
                <strong className="my-1.5 block">
                  {r.nickname || "닉네임 없음"}
                </strong>
                <span className="text-admin-muted text-xs">
                  #{r.id} ·{" "}
                  {r.category ? reportCategories[r.category] : "미분류"} ·{" "}
                  {r.source === "CHAT" ? "채팅" : "프로필"} ·{" "}
                  {date(r.createdAt)}
                </span>
              </button>
            ))
          )}
          {(page > 0 || list.data?.hasNext) && (
            <nav className="mt-4 flex items-center justify-between">
              <button
                className={button}
                disabled={!page}
                onClick={() => {
                  setPage(page - 1);
                  setSelected(null);
                }}
              >
                이전
              </button>
              {page + 1}
              <button
                className={button}
                disabled={!list.data?.hasNext}
                onClick={() => {
                  setPage(page + 1);
                  setSelected(null);
                }}
              >
                다음
              </button>
            </nav>
          )}
        </section>
        {selected !== null && <ReportReview key={selected} id={selected} />}
      </div>
    </main>
  );
}
