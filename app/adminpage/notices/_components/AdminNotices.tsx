"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  useAllNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  type CreateNoticeBody,
  type NoticeItem,
} from "@/hooks/admin/useAdminNotices";
import {
  ArrowLeft,
  Bell,
  Loader2,
  Plus,
  Trash2,
  X,
  Inbox,
  Pencil,
  Clock,
  Calendar,
  Check,
} from "lucide-react";

/* ── 날짜 포맷 헬퍼 ── */
function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocalDateTimeString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getStatusInfo(startTime: string, endTime: string, active: boolean) {
  if (active) {
    return {
      label: "활성",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    };
  }

  const now = new Date();
  const start = new Date(startTime);

  if (now < start) {
    return { label: "예정", color: "text-amber-400", bg: "bg-amber-500/10" };
  } else {
    return { label: "종료", color: "text-[#4a4e69]", bg: "bg-[#1e2030]" };
  }
}

/* ── 공지사항 작성/수정 폼 컴포넌트 ── */
function NoticeForm({
  onSuccess,
  editingNotice,
  onCancelEdit,
}: {
  onSuccess: () => void;
  editingNotice?: NoticeItem | null;
  onCancelEdit?: () => void;
}) {
  const isEditMode = !!editingNotice;
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [title, setTitle] = useState(editingNotice?.title || "");
  const [content, setContent] = useState(editingNotice?.content || "");
  const [startTime, setStartTime] = useState(
    editingNotice
      ? toLocalDateTimeString(new Date(editingNotice.startTime))
      : "",
  );
  const [endTime, setEndTime] = useState(
    editingNotice ? toLocalDateTimeString(new Date(editingNotice.endTime)) : "",
  );

  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const contentId = `${idPrefix}-content`;
  const startTimeId = `${idPrefix}-startTime`;
  const endTimeId = `${idPrefix}-endTime`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("제목을 입력해 주세요.");
    if (title.length > 200) return alert("제목은 200자 이내로 입력해 주세요.");
    if (!content.trim()) return alert("내용을 입력해 주세요.");
    if (!startTime) return alert("시작 시간을 선택해 주세요.");
    if (!endTime) return alert("종료 시간을 선택해 주세요.");
    if (new Date(startTime) >= new Date(endTime))
      return alert("시작 시간은 종료 시간보다 이전이어야 합니다.");

    const body: CreateNoticeBody = {
      title: title.trim(),
      content: content.trim(),
      startTime,
      endTime,
    };

    if (isEditMode && editingNotice) {
      updateMutation.mutate(
        { noticeId: editingNotice.noticeId, body },
        {
          onSuccess: () => {
            onSuccess();
            onCancelEdit?.();
          },
          onError: (error) => {
            alert(
              error.response?.data?.message || "공지사항 수정에 실패했습니다.",
            );
          },
        },
      );
    } else {
      createMutation.mutate(body, {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setStartTime("");
          setEndTime("");
          onSuccess();
        },
        onError: (error) => {
          alert(
            error.response?.data?.message || "공지사항 등록에 실패했습니다.",
          );
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-6"
    >
      <h3 className="mb-5 text-sm font-semibold text-white">
        {isEditMode ? "공지사항 수정" : "새 공지사항 등록"}
      </h3>

      <div className="flex flex-col gap-4">
        {/* 제목 */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={titleId}
            className="text-xs font-medium text-[#8b8fa3]"
          >
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="공지사항 제목을 입력하세요"
            className="rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-[#4a4e69] focus:border-[#10b981] focus:outline-none"
          />
          <span className="text-right text-[10px] text-[#4a4e69]">
            {title.length}/200
          </span>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={contentId}
            className="text-xs font-medium text-[#8b8fa3]"
          >
            내용 <span className="text-red-400">*</span>
          </label>
          <textarea
            id={contentId}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지사항 내용을 입력하세요"
            rows={4}
            className="resize-none rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-[#4a4e69] focus:border-[#10b981] focus:outline-none"
          />
        </div>

        {/* 시작/종료 시간 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={startTimeId}
              className="flex items-center gap-1.5 text-xs font-medium text-[#8b8fa3]"
            >
              <Calendar size={12} />
              시작 시간 <span className="text-red-400">*</span>
            </label>
            <input
              id={startTimeId}
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 py-3 text-sm text-white [color-scheme:dark] focus:border-[#10b981] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={endTimeId}
              className="flex items-center gap-1.5 text-xs font-medium text-[#8b8fa3]"
            >
              <Clock size={12} />
              종료 시간 <span className="text-red-400">*</span>
            </label>
            <input
              id={endTimeId}
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 py-3 text-sm text-white [color-scheme:dark] focus:border-[#10b981] focus:outline-none"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          {isEditMode && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-2 rounded-xl border border-[#2a2d42] bg-[#161827] px-5 py-2.5 text-sm font-semibold text-[#8b8fa3] transition-all duration-200 hover:text-white"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {isEditMode ? "수정 중..." : "등록 중..."}
              </>
            ) : (
              <>
                <Check size={14} />
                {isEditMode ? "수정 완료" : "등록"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── 메인 컴포넌트 ── */
export default function AdminNotices() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: noticesData, isLoading, refetch } = useAllNotices();
  const deleteMutation = useDeleteNotice();

  const notices = noticesData?.data ?? [];

  const handleDelete = (noticeId: number) => {
    if (deleteConfirmId === noticeId) {
      deleteMutation.mutate(noticeId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    } else {
      setDeleteConfirmId(noticeId);
    }
  };

  const handleEdit = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setShowCreateForm(false);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] transition-colors duration-200 hover:border-[#10b981]/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669]">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white sm:text-xl">
                공지사항 관리
              </h1>
              <p className="text-xs text-[#6b7094]">
                전체 공지 {notices.length}건
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingNotice(null);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            showCreateForm
              ? "border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] hover:text-white"
              : "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl"
          }`}
        >
          {showCreateForm ? (
            <>
              <X size={16} />
              닫기
            </>
          ) : (
            <>
              <Plus size={16} />
              공지 등록
            </>
          )}
        </button>
      </header>

      {/* 등록 폼 */}
      {showCreateForm && (
        <div className="mb-8">
          <NoticeForm
            onSuccess={() => {
              setShowCreateForm(false);
              refetch();
            }}
          />
        </div>
      )}

      {/* 수정 폼 */}
      {editingNotice && (
        <div className="mb-8">
          <NoticeForm
            editingNotice={editingNotice}
            onSuccess={() => refetch()}
            onCancelEdit={() => setEditingNotice(null)}
          />
        </div>
      )}

      {/* 공지사항 목록 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#6b7094]" />
          <p className="mt-4 text-sm text-[#6b7094]">공지사항 불러오는 중...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#161827]">
            <Inbox size={28} className="text-[#4a4e69]" />
          </div>
          <p className="text-base font-medium text-[#6b7094]">
            등록된 공지사항이 없습니다
          </p>
          <p className="mt-1 text-sm text-[#4a4e69]">
            공지 등록 버튼을 눌러 새 공지사항을 추가하세요
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => {
            const status = getStatusInfo(
              notice.startTime,
              notice.endTime,
              notice.active,
            );
            return (
              <div
                key={notice.noticeId}
                className="flex flex-col rounded-2xl border border-[#1e2030] bg-[#161827]/80 transition-all duration-200 hover:border-[#2a2d42] sm:flex-row sm:items-start sm:justify-between"
              >
                {/* 공지 정보 */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-white">
                      {notice.title}
                    </h3>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed whitespace-pre-wrap text-[#6b7094]">
                    {notice.content}
                  </p>

                  {/* 시간 정보 */}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#4a4e69]">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      시작: {formatDateTime(notice.startTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      종료: {formatDateTime(notice.endTime)}
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 border-t border-[#1e2030] px-5 py-3 sm:border-t-0 sm:border-l sm:py-5">
                  <button
                    onClick={() => handleEdit(notice)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#2a2d42] bg-[#161827] px-3 py-2 text-xs font-semibold text-[#8b8fa3] transition-all duration-200 hover:border-[#10b981]/40 hover:text-white"
                  >
                    <Pencil size={13} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(notice.noticeId)}
                    disabled={deleteMutation.isPending}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                      deleteConfirmId === notice.noticeId
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <Trash2 size={13} />
                    {deleteConfirmId === notice.noticeId ? "확인" : "삭제"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
