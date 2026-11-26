"use client";

import React from "react";
import Link from "next/link";
import { useAdminGiftCards } from "@/hooks/admin/useAdminGiftCards";
import GiftCardItem from "./GiftCardItem";
import { ArrowLeft, Gift, Loader2, RefreshCw, Inbox } from "lucide-react";

export default function GiftCardsDashboard() {
  const {
    data: giftCards,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminGiftCards();

  const unpaidCount = giftCards?.length || 0;

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#ec4899]/40"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899] to-[#be185d]">
              <Gift size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-admin-ink text-lg font-bold sm:text-xl">
                상품권 지급 관리
              </h1>
              <p className="text-admin-muted text-xs">
                미지급 내역{" "}
                <span className="text-admin-pink font-semibold">
                  {unpaidCount}
                </span>
                건
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 새로고침 */}
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-200 hover:border-[#ec4899]/40 disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw
              size={14}
              className={isRefetching ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </header>

      {/* 목록 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={32} className="text-admin-muted animate-spin" />
          <p className="text-admin-muted mt-4 text-sm">
            미지급 내역을 불러오는 중...
          </p>
        </div>
      ) : unpaidCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="bg-admin-panel mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Inbox size={28} className="text-admin-muted" />
          </div>
          <p className="text-admin-muted text-base font-medium">
            미지급된 상품권 내역이 없습니다
          </p>
          <p className="text-admin-muted mt-1 text-sm">
            모든 상품권이 정상적으로 지급되었습니다
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {giftCards?.map((giftCard) => (
            <GiftCardItem key={giftCard.historyId} giftCard={giftCard} />
          ))}
        </div>
      )}
    </div>
  );
}
