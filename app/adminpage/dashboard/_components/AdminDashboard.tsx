"use client";

import React from "react";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useAdminOrderSocket } from "@/hooks/useAdminOrderSocket";
import OrderCard from "./OrderCard";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Inbox,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    data: ordersData,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminOrders();
  const { status: socketStatus } = useAdminOrderSocket();

  const orders = ordersData?.data ?? [];

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
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 rounded-xl border border-[#2a2d42] bg-[#161827] px-3 py-2.5 text-xs font-medium text-[#8b8fa3] transition-all duration-200 hover:border-[#ff4d61]/40 hover:text-white disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw
              size={14}
              className={isRefetching ? "animate-spin" : ""}
            />
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
    </div>
  );
}
