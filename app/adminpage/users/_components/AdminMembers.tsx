"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useAdminMembers,
  useAdjustMemberItems,
  AdminMember,
} from "@/hooks/admin/useAdminMembers";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Users,
  Search,
  Inbox,
  X,
  User,
  Plus,
  Minus,
  Edit3,
  AlertTriangle,
} from "lucide-react";

export default function AdminMembers() {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingMember, setEditingMember] = useState<AdminMember | null>(null);

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // 아이템 조절 모달 폼 상태 (동시 수정 지원)
  const [matchingAction, setMatchingAction] = useState<
    "ADD" | "REMOVE" | "NONE"
  >("NONE");
  const [matchingQuantity, setMatchingQuantity] = useState<number | "">(1);
  const [optionAction, setOptionAction] = useState<"ADD" | "REMOVE" | "NONE">(
    "NONE",
  );
  const [optionQuantity, setOptionQuantity] = useState<number | "">(1);
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    data: membersData,
    isLoading,
    isRefetching,
  } = useAdminMembers(searchKeyword || undefined, page, size);

  const adjustMutation = useAdjustMemberItems();

  const pagingInfo = membersData?.data;
  const members = pagingInfo?.content ?? [];

  // 검색 실행
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearchKeyword(searchInput.trim());
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setPage(0);
  };

  // 조정 모달 열기
  const openEditModal = (member: AdminMember) => {
    setEditingMember(member);
    setMatchingAction("NONE");
    setMatchingQuantity(1);
    setOptionAction("NONE");
    setOptionQuantity(1);
    setAdjustReason("");
  };

  // 조정 모달 닫기
  const closeEditModal = () => {
    setEditingMember(null);
  };

  // 실제 조정 API 요청 (동시 수정 지원)
  const handleSave = async () => {
    if (!editingMember) return;
    if (matchingAction === "NONE" && optionAction === "NONE") {
      alert("조정할 아이템 수량을 최소 하나 이상 설정해주세요.");
      return;
    }
    if (!adjustReason.trim()) {
      alert("조정 사유를 입력해주세요.");
      return;
    }

    // 백엔드 요청 전 전송 제한 검증 (최대 10개)
    if (
      (matchingAction !== "NONE" && (Number(matchingQuantity) || 0) > 10) ||
      (optionAction !== "NONE" && (Number(optionQuantity) || 0) > 10)
    ) {
      alert("각 매칭권과 옵션권은 10장씩만 조정할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);
    const promises: Promise<unknown>[] = [];

    if (matchingAction !== "NONE") {
      promises.push(
        adjustMutation.mutateAsync({
          memberId: editingMember.id,
          body: {
            itemType: "MATCHING_TICKET",
            quantity: Number(matchingQuantity) || 1,
            action: matchingAction,
            reason: adjustReason.trim(),
          },
        }),
      );
    }

    if (optionAction !== "NONE") {
      promises.push(
        adjustMutation.mutateAsync({
          memberId: editingMember.id,
          body: {
            itemType: "OPTION_TICKET",
            quantity: Number(optionQuantity) || 1,
            action: optionAction,
            reason: adjustReason.trim(),
          },
        }),
      );
    }

    try {
      await Promise.all(promises);
      alert(
        `${editingMember.nickname}님의 아이템이 정상적으로 조정되었습니다.`,
      );
      closeEditModal();
    } catch (error) {
      const axiosError = error as AxiosError<{
        code?: string;
        message?: string;
      }>;
      const errorCode = axiosError.response?.data?.code;
      const errorMessage = axiosError.response?.data?.message;

      let bodyMsg = "아이템 수량을 조정하는 중 에러가 발생했습니다.";
      if (errorCode === "ITEM-006") {
        bodyMsg =
          "동일한 내용의 조정 요청이 이미 처리 중입니다. (3초 중복 방지)";
      } else if (errorCode === "ITEM-001") {
        bodyMsg = "보유 수량이 부족하여 차감할 수 없습니다.";
      } else if (errorMessage) {
        bodyMsg = errorMessage;
      }

      alert("조정 실패: " + bodyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 실시간 예상 결과 수량 계산
  const getExpectedQuantity = (
    itemType: "MATCHING_TICKET" | "OPTION_TICKET",
  ) => {
    if (!editingMember) return 0;
    const current =
      itemType === "MATCHING_TICKET"
        ? editingMember.matchingTicketCount
        : editingMember.optionTicketCount;
    const action =
      itemType === "MATCHING_TICKET" ? matchingAction : optionAction;
    const quantity =
      itemType === "MATCHING_TICKET" ? matchingQuantity : optionQuantity;

    if (action === "ADD") {
      return current + (Number(quantity) || 0);
    } else if (action === "REMOVE") {
      return Math.max(0, current - (Number(quantity) || 0));
    }
    return current;
  };

  // 차감 가능 여부 체크
  const isInsufficient = (itemType: "MATCHING_TICKET" | "OPTION_TICKET") => {
    if (!editingMember) return false;
    const action =
      itemType === "MATCHING_TICKET" ? matchingAction : optionAction;
    const quantity =
      itemType === "MATCHING_TICKET" ? matchingQuantity : optionQuantity;
    if (action !== "REMOVE") return false;

    const current =
      itemType === "MATCHING_TICKET"
        ? editingMember.matchingTicketCount
        : editingMember.optionTicketCount;
    return current < (Number(quantity) || 0);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#06b6d4]/40"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-admin-ink font-sans text-lg font-bold sm:text-xl">
                사용자 관리
              </h1>
              <p className="text-admin-muted text-xs">
                {searchKeyword ? `'${searchKeyword}' 검색 결과 ` : "전체 "}{" "}
                {pagingInfo?.totalElements ?? 0}명 사용자
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 검색 바 */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="text-admin-muted absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="사용자 닉네임 또는 이메일로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border-admin-edge bg-admin-panel text-admin-ink placeholder:text-admin-muted focus:bg-admin-panel w-full rounded-xl border py-2.5 pr-10 pl-10 text-sm transition-all duration-200 focus:border-[#06b6d4]/50 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-admin-muted hover:text-admin-ink absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || isRefetching}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#06b6d4]/10 transition-all duration-200 hover:shadow-xl hover:shadow-[#06b6d4]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefetching ? (
            <LoadingSpinner variant="inline" label="사용자 검색 중" />
          ) : (
            <Search size={16} />
          )}
          검색
        </button>
      </form>

      {/* 사용자 목록 */}
      {isLoading ? (
        <LoadingSpinner label="사용자 목록 불러오는 중" />
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="bg-admin-panel mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Inbox size={28} className="text-admin-muted" />
          </div>
          <p className="text-admin-muted text-base font-medium">
            {searchKeyword
              ? "검색 결과에 맞는 사용자가 없습니다"
              : "가입된 사용자가 없습니다"}
          </p>
          <p className="text-admin-muted mt-1 text-sm">
            {searchKeyword
              ? "다른 검색어로 다시 시도해보세요"
              : "사용자가 가입하면 목록에 나타납니다"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="border-admin-edge bg-admin-panel/80 hover:border-admin-line flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              {/* 사용자 기본 정보 */}
              <div className="flex flex-1 items-center gap-3.5">
                <div className="border-admin-line bg-admin-hover relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                  <User size={20} className="text-admin-secondary" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-admin-ink text-sm font-bold sm:text-base">
                      {member.nickname}
                    </span>
                    <span
                      className={`typo-10-700 rounded-full px-2 py-0.5 ${
                        member.gender === "FEMALE"
                          ? "text-admin-danger bg-rose-500/10"
                          : "text-admin-info bg-blue-500/10"
                      }`}
                    >
                      {member.gender === "FEMALE" ? "여성" : "남성"}
                    </span>
                  </div>
                  <span className="text-admin-muted text-xs break-all">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* 보유 아이템 정보 및 수정 버튼 */}
              <div className="border-admin-edge flex flex-wrap items-center justify-between gap-4 border-t pt-3 sm:border-t-0 sm:pt-0">
                <div className="flex gap-3">
                  {/* 매칭권 */}
                  <div className="bg-admin-subtle flex items-center gap-2 rounded-xl px-3.5 py-2">
                    <Image
                      src="/main/ticket.png"
                      alt="매칭권"
                      width={18}
                      height={18}
                    />
                    <div className="flex flex-col">
                      <span className="typo-10-500 text-admin-muted">
                        매칭권
                      </span>
                      <span className="text-admin-ink text-xs font-bold">
                        {member.matchingTicketCount}장
                      </span>
                    </div>
                  </div>
                  {/* 옵션권 */}
                  <div className="bg-admin-subtle flex items-center gap-2 rounded-xl px-3.5 py-2">
                    <Image
                      src="/main/option.png"
                      alt="옵션권"
                      width={18}
                      height={18}
                    />
                    <div className="flex flex-col">
                      <span className="typo-10-500 text-admin-muted">
                        옵션권
                      </span>
                      <span className="text-admin-ink text-xs font-bold">
                        {member.optionTicketCount}장
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(member)}
                  className="border-admin-line bg-admin-hover/50 text-admin-secondary hover:bg-admin-hover hover:text-admin-ink flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:border-[#06b6d4]/40"
                >
                  <Edit3 size={13} />
                  수량 조정
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pagingInfo && pagingInfo.totalPages >= 1 && (
        <div className="border-admin-edge mt-8 flex items-center justify-between border-t pt-6">
          <button
            type="button"
            disabled={!pagingInfo.hasPrevious || isLoading || isRefetching}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            className="border-admin-line bg-admin-panel text-admin-secondary hover:bg-admin-hover hover:text-admin-ink disabled:hover:border-admin-line disabled:hover:bg-admin-panel disabled:hover:text-admin-secondary flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:border-[#06b6d4]/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>

          <div className="hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: pagingInfo.totalPages }).map((_, idx) => {
              const isActive = idx === pagingInfo.currentPage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPage(idx)}
                  disabled={isLoading || isRefetching}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white shadow-lg shadow-[#06b6d4]/10"
                      : "border-admin-edge bg-admin-panel/40 text-admin-secondary hover:border-admin-line hover:bg-admin-hover hover:text-admin-ink border"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-admin-muted text-xs font-semibold sm:hidden">
            {pagingInfo.currentPage + 1} / {pagingInfo.totalPages} 페이지
          </div>

          <button
            type="button"
            disabled={!pagingInfo.hasNext || isLoading || isRefetching}
            onClick={() =>
              setPage((prev) => Math.min(pagingInfo.totalPages - 1, prev + 1))
            }
            className="border-admin-line bg-admin-panel text-admin-secondary hover:bg-admin-hover hover:text-admin-ink disabled:hover:border-admin-line disabled:hover:bg-admin-panel disabled:hover:text-admin-secondary flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 hover:border-[#06b6d4]/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {/* 수량 조정 상세 모달 */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="border-admin-line bg-admin-panel w-full max-w-md scale-100 rounded-2xl border p-6 shadow-2xl transition-all duration-300">
            {/* 모달 헤더 */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-admin-ink text-base font-bold sm:text-lg">
                아이템 수량 조정
              </h2>
              <button
                onClick={closeEditModal}
                className="text-admin-muted hover:bg-admin-subtle hover:text-admin-ink rounded-lg p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 모달 대상 사용자 정보 */}
            <div className="bg-admin-subtle/50 mb-6 flex items-center gap-3 rounded-xl p-3.5">
              <div className="border-admin-line bg-admin-hover flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                <User size={16} className="text-admin-secondary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-admin-ink text-sm font-bold">
                    {editingMember.nickname}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                      editingMember.gender === "FEMALE"
                        ? "text-admin-danger bg-rose-500/10"
                        : "text-admin-info bg-blue-500/10"
                    }`}
                  >
                    {editingMember.gender === "FEMALE" ? "여성" : "남성"}
                  </span>
                </div>
                <span className="text-admin-muted text-xs break-all">
                  {editingMember.email}
                </span>
              </div>
            </div>

            {/* 아이템 설정 필드들 */}
            <div className="space-y-5">
              {/* ─── 1. 매칭권 설정 ─── */}
              <div className="border-admin-edge bg-admin-subtle/20 space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/main/ticket.png"
                    alt="매칭권"
                    width={20}
                    height={20}
                  />
                  <span className="text-admin-ink text-xs font-bold">
                    매칭권
                  </span>
                  <span className="typo-10-500 text-admin-muted">
                    (보유: {editingMember.matchingTicketCount}장)
                  </span>
                </div>

                {/* 작업 방식 선택 */}
                <div className="flex gap-1.5">
                  {(["NONE", "ADD", "REMOVE"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setMatchingAction(act)}
                      className={`flex-1 rounded-lg border py-1.5 text-[11px] font-bold transition-all duration-200 ${
                        matchingAction === act
                          ? act === "ADD"
                            ? "text-admin-success border-emerald-500 bg-emerald-500/10"
                            : act === "REMOVE"
                              ? "text-admin-danger border-red-500 bg-red-500/10"
                              : "text-admin-secondary border-[#8b8fa3] bg-[#8b8fa3]/10"
                          : "border-admin-edge bg-admin-subtle/30 text-admin-muted hover:text-admin-ink"
                      }`}
                    >
                      {act === "NONE"
                        ? "유지"
                        : act === "ADD"
                          ? "지급"
                          : "차감"}
                    </button>
                  ))}
                </div>

                {/* 수량 설정 */}
                {matchingAction !== "NONE" && (
                  <div className="border-admin-edge bg-admin-panel flex items-center justify-between rounded-lg border p-1.5">
                    <span className="text-admin-muted pl-1.5 text-[11px]">
                      조정 수량
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setMatchingQuantity(
                            Math.max(1, (Number(matchingQuantity) || 0) - 1),
                          )
                        }
                        className="bg-admin-subtle text-admin-secondary hover:text-admin-ink flex h-6 w-6 items-center justify-center rounded transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={matchingQuantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setMatchingQuantity("");
                          } else {
                            const parsed = parseInt(val, 10);
                            setMatchingQuantity(
                              Number.isNaN(parsed) ? "" : Math.max(1, parsed),
                            );
                          }
                        }}
                        className="bg-admin-panel text-admin-ink h-6 w-10 [appearance:textfield] border-0 text-center text-xs font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMatchingQuantity(
                            (Number(matchingQuantity) || 0) + 1,
                          )
                        }
                        className="bg-admin-subtle text-admin-secondary hover:text-admin-ink flex h-6 w-6 items-center justify-center rounded transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── 2. 옵션권 설정 ─── */}
              <div className="border-admin-edge bg-admin-subtle/20 space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/main/option.png"
                    alt="옵션권"
                    width={20}
                    height={20}
                  />
                  <span className="text-admin-ink text-xs font-bold">
                    옵션권
                  </span>
                  <span className="typo-10-500 text-admin-muted">
                    (보유: {editingMember.optionTicketCount}장)
                  </span>
                </div>

                {/* 작업 방식 선택 */}
                <div className="flex gap-1.5">
                  {(["NONE", "ADD", "REMOVE"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setOptionAction(act)}
                      className={`flex-1 rounded-lg border py-1.5 text-[11px] font-bold transition-all duration-200 ${
                        optionAction === act
                          ? act === "ADD"
                            ? "text-admin-success border-emerald-500 bg-emerald-500/10"
                            : act === "REMOVE"
                              ? "text-admin-danger border-red-500 bg-red-500/10"
                              : "text-admin-secondary border-[#8b8fa3] bg-[#8b8fa3]/10"
                          : "border-admin-edge bg-admin-subtle/30 text-admin-muted hover:text-admin-ink"
                      }`}
                    >
                      {act === "NONE"
                        ? "유지"
                        : act === "ADD"
                          ? "지급"
                          : "차감"}
                    </button>
                  ))}
                </div>

                {/* 수량 설정 */}
                {optionAction !== "NONE" && (
                  <div className="border-admin-edge bg-admin-panel flex items-center justify-between rounded-lg border p-1.5">
                    <span className="text-admin-muted pl-1.5 text-[11px]">
                      조정 수량
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setOptionQuantity(
                            Math.max(1, (Number(optionQuantity) || 0) - 1),
                          )
                        }
                        className="bg-admin-subtle text-admin-secondary hover:text-admin-ink flex h-6 w-6 items-center justify-center rounded transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={optionQuantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setOptionQuantity("");
                          } else {
                            const parsed = parseInt(val, 10);
                            setOptionQuantity(
                              Number.isNaN(parsed) ? "" : Math.max(1, parsed),
                            );
                          }
                        }}
                        className="bg-admin-panel text-admin-ink h-6 w-10 [appearance:textfield] border-0 text-center text-xs font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setOptionQuantity((Number(optionQuantity) || 0) + 1)
                        }
                        className="bg-admin-subtle text-admin-secondary hover:text-admin-ink flex h-6 w-6 items-center justify-center rounded transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 조정 사유 작성 */}
              <div className="flex flex-col gap-2">
                <span className="text-admin-secondary text-xs font-semibold">
                  조정 사유 (필수)
                </span>
                <input
                  type="text"
                  placeholder="예: 이벤트 보상 누락 보정, 결제 환불에 따른 회수"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  maxLength={255}
                  className="border-admin-edge bg-admin-panel text-admin-ink placeholder:text-admin-muted w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all duration-200 focus:border-[#06b6d4]/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 실시간 계산결과 미리보기 */}
            <div className="border-admin-edge bg-admin-subtle/30 mt-5 space-y-2 rounded-xl border p-3 text-xs">
              <div className="typo-10-700 text-admin-secondary mb-1 tracking-wider uppercase">
                최종 수량 변동 예상
              </div>

              {/* 매칭권 */}
              <div className="border-admin-edge/50 flex items-center justify-between border-b pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/main/ticket.png"
                    alt="매칭권"
                    width={14}
                    height={14}
                  />
                  <span className="text-admin-secondary">매칭권</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-admin-muted">
                    {editingMember.matchingTicketCount}장
                  </span>
                  <span className="text-admin-muted">→</span>
                  <span
                    className={`font-bold ${matchingAction === "NONE" ? "text-admin-ink" : matchingAction === "ADD" ? "text-admin-success" : "text-admin-danger"}`}
                  >
                    {getExpectedQuantity("MATCHING_TICKET")}장
                    {matchingAction !== "NONE" &&
                      ` (${matchingAction === "ADD" ? "+" : "-"}${matchingQuantity})`}
                  </span>
                </div>
              </div>

              {/* 옵션권 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/main/option.png"
                    alt="옵션권"
                    width={14}
                    height={14}
                  />
                  <span className="text-admin-secondary">옵션권</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-admin-muted">
                    {editingMember.optionTicketCount}장
                  </span>
                  <span className="text-admin-muted">→</span>
                  <span
                    className={`font-bold ${optionAction === "NONE" ? "text-admin-ink" : optionAction === "ADD" ? "text-admin-success" : "text-admin-danger"}`}
                  >
                    {getExpectedQuantity("OPTION_TICKET")}장
                    {optionAction !== "NONE" &&
                      ` (${optionAction === "ADD" ? "+" : "-"}${optionQuantity})`}
                  </span>
                </div>
              </div>
            </div>

            {/* 경고 알림 (차감 가능량 초과 시) */}
            {(isInsufficient("MATCHING_TICKET") ||
              isInsufficient("OPTION_TICKET")) && (
              <div className="text-admin-danger mt-4 flex items-start gap-2 rounded-xl border border-red-800/20 bg-red-950/20 p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="mt-0.5 shrink-0 animate-pulse"
                />
                <p className="leading-relaxed">
                  보유한 수량보다 차감하려는 수량이 많습니다. 요청 시
                  에러(`ITEM-001`)가 발생할 수 있습니다.
                </p>
              </div>
            )}

            {/* 작업 버튼 */}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isSubmitting}
                className="border-admin-line bg-admin-subtle text-admin-secondary hover:text-admin-ink flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSubmitting ||
                  (matchingAction === "NONE" && optionAction === "NONE") ||
                  !adjustReason.trim()
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#06b6d4]/10 transition-all duration-200 hover:shadow-xl hover:shadow-[#06b6d4]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && (
                  <LoadingSpinner variant="inline" label="조정 요청 중" />
                )}
                조정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
