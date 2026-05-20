"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { AdminMember, PagingResponse } from "@/hooks/admin/useAdminMembers";
import {
  ArrowLeft,
  Users,
  User,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UserCheck,
  Award,
  CircleDot,
} from "lucide-react";

interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

export default function AdminStats() {
  // 통계 계산용 사용자 전체 목록 데이터 조회 (사이즈 10000으로 요청하여 한 번에 가공)
  const {
    data: responseData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<ApiResponse<PagingResponse<AdminMember>>>({
    queryKey: ["adminStatsMembers"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PagingResponse<AdminMember>>>(
        "/api/v1/admin/users",
        {
          params: {
            page: 0,
            size: 10000,
            sort: "id,desc",
          },
        },
      );
      return data;
    },
  });

  const members = responseData?.data?.content ?? [];

  // 데이터 기반 전체 및 성별 통계 계산
  const stats = useMemo(() => {
    const total = members.length;
    if (total === 0) {
      return {
        total: 0,
        maleCount: 0,
        femaleCount: 0,
        maleRatio: 0,
        femaleRatio: 0,
        verifiedCount: 0,
        verifiedRatio: 0,
        avgMaleMatchingTickets: 0,
        avgMaleOptionTickets: 0,
        avgFemaleMatchingTickets: 0,
        avgFemaleOptionTickets: 0,
        totalMatchingTickets: 0,
        totalOptionTickets: 0,
      };
    }

    let maleCount = 0;
    let femaleCount = 0;
    let verifiedCount = 0;

    let maleMatchingSum = 0;
    let maleOptionSum = 0;
    let femaleMatchingSum = 0;
    let femaleOptionSum = 0;

    members.forEach((m) => {
      if (m.gender === "MALE") {
        maleCount++;
        maleMatchingSum += m.matchingTicketCount;
        maleOptionSum += m.optionTicketCount;
      } else if (m.gender === "FEMALE") {
        femaleCount++;
        femaleMatchingSum += m.matchingTicketCount;
        femaleOptionSum += m.optionTicketCount;
      }

      if (m.realName) {
        verifiedCount++;
      }
    });

    const totalMatchingTickets = maleMatchingSum + femaleMatchingSum;
    const totalOptionTickets = maleOptionSum + femaleOptionSum;

    return {
      total,
      maleCount,
      femaleCount,
      maleRatio: Number(((maleCount / total) * 100).toFixed(1)),
      femaleRatio: Number(((femaleCount / total) * 100).toFixed(1)),
      verifiedCount,
      verifiedRatio: Number(((verifiedCount / total) * 100).toFixed(1)),
      avgMaleMatchingTickets: Number(
        (maleMatchingSum / (maleCount || 1)).toFixed(2),
      ),
      avgMaleOptionTickets: Number(
        (maleOptionSum / (maleCount || 1)).toFixed(2),
      ),
      avgFemaleMatchingTickets: Number(
        (femaleMatchingSum / (femaleCount || 1)).toFixed(2),
      ),
      avgFemaleOptionTickets: Number(
        (femaleOptionSum / (femaleCount || 1)).toFixed(2),
      ),
      totalMatchingTickets,
      totalOptionTickets,
    };
  }, [members]);

  // SVG 도넛 차트 계산용 값
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327

  // 남성과 여성 비율별 stroke 길이 계산
  const maleStrokeOffset =
    circumference - (circumference * (stats.maleRatio || 0)) / 100;
  const femaleStrokeOffset =
    circumference - (circumference * (stats.femaleRatio || 0)) / 100;

  // 두 번째 세그먼트(여성)가 시작할 회전 각도 설정 (-90도(정상단) 기준 + 남성 비율 크기만큼 회전)
  const femaleRotation = -90 + (360 * (stats.maleRatio || 0)) / 100;

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] transition-colors duration-200 hover:border-[#f59e0b]/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444]">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold text-white sm:text-xl">
                서비스 이용 통계
              </h1>
              <p className="text-xs text-[#6b7094]">
                전체 가입자 분석 및 성비 데이터 현황
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 새로고침 */}
          <button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-2 rounded-xl border border-[#2a2d42] bg-[#161827] px-3.5 py-2.5 text-xs font-semibold text-[#8b8fa3] transition-all duration-200 hover:border-[#f59e0b]/40 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={isRefetching ? "animate-spin" : ""}
            />
            <span>새로고침</span>
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={40} className="animate-spin text-[#f59e0b]" />
          <p className="mt-4 text-sm text-[#8b8fa3]">
            실시간 전체 가입자 데이터를 가공 중입니다...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 주요 지표 요약 (Key Metrics) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 전체 사용자 카드 */}
            <div className="relative overflow-hidden rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-5 transition-all duration-300 hover:border-[#2a2d42] hover:bg-[#1a1d32]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#6b7094] uppercase">
                  전체 사용자
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stats.total}
                </span>
                <span className="text-sm font-semibold text-[#8b8fa3]">명</span>
              </div>
              <p className="mt-1 text-[11px] text-[#4a4e69]">
                COMAtching 가입완료 및 등록 이용자 수
              </p>
            </div>

            {/* 남성 사용자 카드 */}
            <div className="relative overflow-hidden rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-5 transition-all duration-300 hover:border-[#2a2d42] hover:bg-[#1a1d32]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#6b7094] uppercase">
                  남성 사용자
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <User size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stats.maleCount}
                </span>
                <span className="text-sm font-semibold text-[#8b8fa3]">명</span>
                <span className="ml-auto text-sm font-bold text-blue-400">
                  {stats.maleRatio}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#4a4e69]">
                남성 가입자 인원 및 비율 현황
              </p>
            </div>

            {/* 여성 사용자 카드 */}
            <div className="relative overflow-hidden rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-5 transition-all duration-300 hover:border-[#2a2d42] hover:bg-[#1a1d32]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#6b7094] uppercase">
                  여성 사용자
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                  <User size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white sm:text-3xl">
                  {stats.femaleCount}
                </span>
                <span className="text-sm font-semibold text-[#8b8fa3]">명</span>
                <span className="ml-auto text-sm font-bold text-rose-400">
                  {stats.femaleRatio}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#4a4e69]">
                여성 가입자 인원 및 비율 현황
              </p>
            </div>
          </div>

          {/* 메인 차트 및 세부 통계 레이아웃 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 1. 성비 시각화 차트 카드 */}
            <div className="rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-6 shadow-2xl lg:col-span-2">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white sm:text-base">
                <CircleDot size={18} className="text-[#f59e0b]" />
                가입자 성비 현황 (Gender Ratio)
              </h2>
              <p className="mt-1 text-xs text-[#6b7094]">
                남성과 여성 사용자 비율의 그래픽 도넛 분석표
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
                {/* 커스텀 SVG 도넛 차트 */}
                <div className="relative flex shrink-0 items-center justify-center">
                  <svg viewBox="0 0 120 120" className="h-44 w-44">
                    {/* 회색 베이스 원 */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#1e2030"
                      strokeWidth="12"
                    />

                    {stats.total > 0 && (
                      <>
                        {/* 남성 세그먼트 (Blue) */}
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray={circumference}
                          strokeDashoffset={maleStrokeOffset}
                          strokeLinecap={
                            stats.femaleRatio === 0 ? "round" : "butt"
                          }
                          transform="rotate(-90 60 60)"
                          className="transition-all duration-1000 ease-out"
                        />
                        {/* 여성 세그먼트 (Rose) */}
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke="#f43f5e"
                          strokeWidth="12"
                          strokeDasharray={circumference}
                          strokeDashoffset={femaleStrokeOffset}
                          strokeLinecap={
                            stats.maleRatio === 0 ? "round" : "butt"
                          }
                          transform={`rotate(${femaleRotation} 60 60)`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </>
                    )}
                  </svg>

                  {/* 중앙 성비 요약 라벨 */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold tracking-wider text-[#6b7094] uppercase">
                      Dominant
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      {stats.maleCount >= stats.femaleCount
                        ? "남성 우세"
                        : "여성 우세"}
                    </span>
                    <span className="mt-0.5 text-[11px] font-medium text-[#8b8fa3]">
                      차이: {Math.abs(stats.maleCount - stats.femaleCount)}명
                    </span>
                  </div>
                </div>

                {/* 성비 디테일 프로그레스 바 레이아웃 */}
                <div className="w-full max-w-sm space-y-4">
                  {/* 남성 상세 비율 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span className="font-semibold text-white">
                          남성 (MALE)
                        </span>
                      </div>
                      <span className="font-bold text-blue-400">
                        {stats.maleCount}명 ({stats.maleRatio}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e2030]">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.maleRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* 여성 상세 비율 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        <span className="font-semibold text-white">
                          여성 (FEMALE)
                        </span>
                      </div>
                      <span className="font-bold text-rose-400">
                        {stats.femaleCount}명 ({stats.femaleRatio}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e2030]">
                      <div
                        className="h-full rounded-full bg-rose-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.femaleRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* 팁 박스 */}
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#2a2d42]/30 bg-[#1e2030]/30 p-3">
                    <Sparkles
                      size={14}
                      className="mt-0.5 shrink-0 text-[#f59e0b]"
                    />
                    <p className="text-[11px] leading-relaxed text-[#8b8fa3]">
                      상단의 남성/여성 통계 카드를 클릭하거나 하단 탭을 조작하여
                      성별에 해당하는 가입자들을 즉시 추려내고 티켓 조정이나
                      회원 관리를 진행하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 티켓 보유 통계 분석 카드 */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-6 shadow-2xl">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-white sm:text-base">
                  <Award size={18} className="text-[#f59e0b]" />
                  성별 아이템(티켓) 통계
                </h2>
                <p className="mt-1 text-xs text-[#6b7094]">
                  남성과 여성의 평균 티켓 소유 현황 비교
                </p>

                <div className="mt-6 space-y-5">
                  {/* 매칭권 분석 */}
                  <div className="space-y-2 rounded-xl border border-[#2a2d42]/40 bg-[#1e2030]/40 p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/main/ticket.png"
                        alt="매칭권"
                        width={18}
                        height={18}
                      />
                      <span className="text-xs font-bold text-white">
                        평균 보유 매칭권
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-[#6b7094]">
                          남성 평균
                        </span>
                        <span className="text-sm font-extrabold text-blue-400">
                          {stats.avgMaleMatchingTickets}개
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#6b7094]">
                          여성 평균
                        </span>
                        <span className="text-sm font-extrabold text-rose-400">
                          {stats.avgFemaleMatchingTickets}개
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 옵션권 분석 */}
                  <div className="space-y-2 rounded-xl border border-[#2a2d42]/40 bg-[#1e2030]/40 p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/main/option.png"
                        alt="옵션권"
                        width={18}
                        height={18}
                      />
                      <span className="text-xs font-bold text-white">
                        평균 보유 옵션권
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-[#6b7094]">
                          남성 평균
                        </span>
                        <span className="text-sm font-extrabold text-blue-400">
                          {stats.avgMaleOptionTickets}개
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#6b7094]">
                          여성 평균
                        </span>
                        <span className="text-sm font-extrabold text-rose-400">
                          {stats.avgFemaleOptionTickets}개
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 총 유통량 */}
              <div className="mt-6 flex items-center justify-between border-t border-[#1e2030] pt-4 text-xs text-[#8b8fa3]">
                <div>
                  총 유통 매칭권:{" "}
                  <span className="font-bold text-white">
                    {stats.totalMatchingTickets}개
                  </span>
                </div>
                <div>
                  총 유통 옵션권:{" "}
                  <span className="font-bold text-white">
                    {stats.totalOptionTickets}개
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
