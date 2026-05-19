"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useAdminMembers,
  useAdjustMemberItems,
  AdminMember,
} from "@/hooks/admin/useAdminMembers";
import { useToastStore } from "@/stores/toast-store";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  Users,
  Loader2,
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

  const { showToast } = useToastStore();

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
      showToast({
        title: "입력 오류",
        body: "조정할 아이템 수량을 최소 하나 이상 설정해주세요.",
        icon: "error",
      });
      return;
    }
    if (!adjustReason.trim()) {
      showToast({
        title: "입력 오류",
        body: "조정 사유를 입력해주세요.",
        icon: "error",
      });
      return;
    }

    // 백엔드 요청 전 전송 제한 검증 (최대 10개)
    if (
      (matchingAction !== "NONE" && (Number(matchingQuantity) || 0) > 10) ||
      (optionAction !== "NONE" && (Number(optionQuantity) || 0) > 10)
    ) {
      alert("각 매칭권과 옵션권은 10개씩만 조정할 수 있습니다.");
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
      showToast({
        title: "조정 완료",
        body: `${editingMember.nickname}님의 아이템이 정상적으로 조정되었습니다.`,
        icon: "success",
      });
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

      showToast({
        title: "조정 실패",
        body: bodyMsg,
        icon: "error",
      });
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] transition-colors duration-200 hover:border-[#06b6d4]/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold text-white sm:text-xl">
                사용자 관리
              </h1>
              <p className="text-xs text-[#6b7094]">
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
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#4a4e69]"
          />
          <input
            type="text"
            placeholder="사용자 닉네임 또는 이메일로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-[#1e2030] bg-[#161827] py-2.5 pr-10 pl-10 text-sm text-white placeholder-[#4a4e69] transition-all duration-200 focus:border-[#06b6d4]/50 focus:bg-[#161827] focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#4a4e69] transition-colors hover:text-white"
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
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          검색
        </button>
      </form>

      {/* 사용자 목록 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#6b7094]" />
          <p className="mt-4 text-sm text-[#6b7094]">
            사용자 목록 불러오는 중...
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#161827]">
            <Inbox size={28} className="text-[#4a4e69]" />
          </div>
          <p className="text-base font-medium text-[#6b7094]">
            {searchKeyword
              ? "검색 결과에 맞는 사용자가 없습니다"
              : "가입된 사용자가 없습니다"}
          </p>
          <p className="mt-1 text-sm text-[#4a4e69]">
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
              className="flex flex-col gap-4 rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-4 transition-all duration-200 hover:border-[#2a2d42] sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              {/* 사용자 기본 정보 */}
              <div className="flex flex-1 items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#2a2d42] bg-[#22253a]">
                  <User size={20} className="text-[#8b8fa3]" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white sm:text-base">
                      {member.nickname}
                    </span>
                    {member.realName && (
                      <span className="rounded-md bg-[#1e2030] px-2 py-0.5 text-[10px] font-bold text-[#a0a3bd]">
                        {member.realName}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        member.gender === "FEMALE"
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {member.gender === "FEMALE" ? "여성" : "남성"}
                    </span>
                  </div>
                  <span className="text-xs break-all text-[#6b7094]">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* 보유 아이템 정보 및 수정 버튼 */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1e2030] pt-3 sm:border-t-0 sm:pt-0">
                <div className="flex gap-3">
                  {/* 매칭권 */}
                  <div className="flex items-center gap-2 rounded-xl bg-[#1e2030] px-3.5 py-2">
                    <Image
                      src="/main/ticket.png"
                      alt="매칭권"
                      width={18}
                      height={18}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6b7094]">매칭권</span>
                      <span className="text-xs font-bold text-white">
                        {member.matchingTicketCount}개
                      </span>
                    </div>
                  </div>
                  {/* 옵션권 */}
                  <div className="flex items-center gap-2 rounded-xl bg-[#1e2030] px-3.5 py-2">
                    <Image
                      src="/main/option.png"
                      alt="옵션권"
                      width={18}
                      height={18}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6b7094]">옵션권</span>
                      <span className="text-xs font-bold text-white">
                        {member.optionTicketCount}개
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(member)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2a2d42] bg-[#22253a]/50 px-3.5 py-2 text-xs font-semibold text-[#a0a3bd] transition-all duration-200 hover:border-[#06b6d4]/40 hover:bg-[#22253a] hover:text-white"
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
        <div className="mt-8 flex items-center justify-between border-t border-[#1e2030] pt-6">
          <button
            type="button"
            disabled={!pagingInfo.hasPrevious || isLoading || isRefetching}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 rounded-xl border border-[#2a2d42] bg-[#161827] px-4 py-2 text-xs font-semibold text-[#8b8fa3] transition-all duration-200 hover:border-[#06b6d4]/40 hover:bg-[#22253a] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2a2d42] disabled:hover:bg-[#161827] disabled:hover:text-[#8b8fa3]"
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
                      : "border border-[#1e2030] bg-[#161827]/40 text-[#8b8fa3] hover:border-[#2a2d42] hover:bg-[#22253a] hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-[#6b7094] sm:hidden">
            {pagingInfo.currentPage + 1} / {pagingInfo.totalPages} 페이지
          </div>

          <button
            type="button"
            disabled={!pagingInfo.hasNext || isLoading || isRefetching}
            onClick={() =>
              setPage((prev) => Math.min(pagingInfo.totalPages - 1, prev + 1))
            }
            className="flex items-center gap-1.5 rounded-xl border border-[#2a2d42] bg-[#161827] px-4 py-2 text-xs font-semibold text-[#8b8fa3] transition-all duration-200 hover:border-[#06b6d4]/40 hover:bg-[#22253a] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#2a2d42] disabled:hover:bg-[#161827] disabled:hover:text-[#8b8fa3]"
          >
            다음
          </button>
        </div>
      )}

      {/* 수량 조정 상세 모달 */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md scale-100 rounded-2xl border border-[#2a2d42] bg-[#161827] p-6 shadow-2xl transition-all duration-300">
            {/* 모달 헤더 */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-white sm:text-lg">
                아이템 수량 조정
              </h2>
              <button
                onClick={closeEditModal}
                className="rounded-lg p-1 text-[#6b7094] transition-colors hover:bg-[#1e2030] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* 모달 대상 사용자 정보 */}
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#1e2030]/50 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#2a2d42] bg-[#22253a]">
                <User size={16} className="text-[#8b8fa3]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">
                    {editingMember.nickname}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                      editingMember.gender === "FEMALE"
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {editingMember.gender === "FEMALE" ? "여성" : "남성"}
                  </span>
                </div>
                <span className="text-xs break-all text-[#6b7094]">
                  {editingMember.email}
                </span>
              </div>
            </div>

            {/* 아이템 설정 필드들 */}
            <div className="space-y-5">
              {/* ─── 1. 매칭권 설정 ─── */}
              <div className="space-y-3 rounded-xl border border-[#1e2030] bg-[#1e2030]/20 p-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/main/ticket.png"
                    alt="매칭권"
                    width={20}
                    height={20}
                  />
                  <span className="text-xs font-bold text-white">매칭권</span>
                  <span className="text-[10px] text-[#6b7094]">
                    (보유: {editingMember.matchingTicketCount}개)
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
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : act === "REMOVE"
                              ? "border-red-500 bg-red-500/10 text-red-400"
                              : "border-[#8b8fa3] bg-[#8b8fa3]/10 text-[#8b8fa3]"
                          : "border-[#1e2030] bg-[#1e2030]/30 text-[#6b7094] hover:text-white"
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
                  <div className="flex items-center justify-between rounded-lg border border-[#1e2030] bg-[#161827] p-1.5">
                    <span className="pl-1.5 text-[11px] text-[#6b7094]">
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
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#1e2030] text-[#a0a3bd] transition-colors hover:text-white"
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
                        className="h-6 w-10 [appearance:textfield] border-0 bg-[#161827] text-center text-xs font-bold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMatchingQuantity(
                            (Number(matchingQuantity) || 0) + 1,
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#1e2030] text-[#a0a3bd] transition-colors hover:text-white"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── 2. 옵션권 설정 ─── */}
              <div className="space-y-3 rounded-xl border border-[#1e2030] bg-[#1e2030]/20 p-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/main/option.png"
                    alt="옵션권"
                    width={20}
                    height={20}
                  />
                  <span className="text-xs font-bold text-white">옵션권</span>
                  <span className="text-[10px] text-[#6b7094]">
                    (보유: {editingMember.optionTicketCount}개)
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
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : act === "REMOVE"
                              ? "border-red-500 bg-red-500/10 text-red-400"
                              : "border-[#8b8fa3] bg-[#8b8fa3]/10 text-[#8b8fa3]"
                          : "border-[#1e2030] bg-[#1e2030]/30 text-[#6b7094] hover:text-white"
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
                  <div className="flex items-center justify-between rounded-lg border border-[#1e2030] bg-[#161827] p-1.5">
                    <span className="pl-1.5 text-[11px] text-[#6b7094]">
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
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#1e2030] text-[#a0a3bd] transition-colors hover:text-white"
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
                        className="h-6 w-10 [appearance:textfield] border-0 bg-[#161827] text-center text-xs font-bold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setOptionQuantity((Number(optionQuantity) || 0) + 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#1e2030] text-[#a0a3bd] transition-colors hover:text-white"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 조정 사유 작성 */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[#8b8fa3]">
                  조정 사유 (필수)
                </span>
                <input
                  type="text"
                  placeholder="예: 이벤트 보상 누락 보정, 결제 환불에 따른 회수"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  maxLength={255}
                  className="w-full rounded-xl border border-[#1e2030] bg-[#161827] px-3.5 py-2.5 text-xs text-white placeholder-[#4a4e69] transition-all duration-200 focus:border-[#06b6d4]/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 실시간 계산결과 미리보기 */}
            <div className="mt-5 space-y-2 rounded-xl border border-[#1e2030] bg-[#1e2030]/30 p-3 text-xs">
              <div className="mb-1 text-[10px] font-bold tracking-wider text-[#8b8fa3] uppercase">
                최종 수량 변동 예상
              </div>

              {/* 매칭권 */}
              <div className="flex items-center justify-between border-b border-[#1e2030]/50 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/main/ticket.png"
                    alt="매칭권"
                    width={14}
                    height={14}
                  />
                  <span className="text-[#8b8fa3]">매칭권</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7094]">
                    {editingMember.matchingTicketCount}개
                  </span>
                  <span className="text-[#4a4e69]">→</span>
                  <span
                    className={`font-bold ${matchingAction === "NONE" ? "text-white" : matchingAction === "ADD" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {getExpectedQuantity("MATCHING_TICKET")}개
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
                  <span className="text-[#8b8fa3]">옵션권</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7094]">
                    {editingMember.optionTicketCount}개
                  </span>
                  <span className="text-[#4a4e69]">→</span>
                  <span
                    className={`font-bold ${optionAction === "NONE" ? "text-white" : optionAction === "ADD" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {getExpectedQuantity("OPTION_TICKET")}개
                    {optionAction !== "NONE" &&
                      ` (${optionAction === "ADD" ? "+" : "-"}${optionQuantity})`}
                  </span>
                </div>
              </div>
            </div>

            {/* 경고 알림 (차감 가능량 초과 시) */}
            {(isInsufficient("MATCHING_TICKET") ||
              isInsufficient("OPTION_TICKET")) && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-800/20 bg-red-950/20 p-3 text-xs text-red-400">
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
                className="flex-1 rounded-xl border border-[#2a2d42] bg-[#1e2030] py-2.5 text-sm font-semibold text-[#8b8fa3] transition-colors hover:text-white disabled:opacity-50"
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
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                조정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
