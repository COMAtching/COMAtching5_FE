"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#f59e0b]/40"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444]">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-admin-ink font-sans text-lg font-bold sm:text-xl">
                서비스 이용 통계
              </h1>
              <p className="text-admin-muted text-xs">
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
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 hover:border-[#f59e0b]/40 disabled:opacity-50"
          >
            {isRefetching ? (
              <LoadingSpinner variant="inline" label="새로고침 중" />
            ) : (
              <RefreshCw size={14} aria-hidden="true" />
            )}
            <span>새로고침</span>
          </button>
        </div>
      </header>

      {isLoading ? (
        <LoadingSpinner label="실시간 전체 가입자 데이터를 가공 중입니다" />
      ) : (
        <div className="space-y-6">
          {/* 주요 지표 요약 (Key Metrics) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 전체 사용자 카드 */}
            <div className="border-admin-edge bg-admin-panel/80 hover:border-admin-line hover:bg-admin-hover relative overflow-hidden rounded-2xl border p-5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-admin-muted text-xs font-bold tracking-wider uppercase">
                  전체 사용자
                </span>
                <div className="text-admin-warning flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-admin-ink text-2xl font-extrabold sm:text-3xl">
                  {stats.total}
                </span>
                <span className="text-admin-secondary text-sm font-semibold">
                  명
                </span>
              </div>
              <p className="text-admin-muted mt-1 text-[11px]">
                COMAtching 가입완료 및 등록 이용자 수
              </p>
            </div>

            {/* 남성 사용자 카드 */}
            <div className="border-admin-edge bg-admin-panel/80 hover:border-admin-line hover:bg-admin-hover relative overflow-hidden rounded-2xl border p-5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-admin-muted text-xs font-bold tracking-wider uppercase">
                  남성 사용자
                </span>
                <div className="text-admin-info flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <User size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-admin-ink text-2xl font-extrabold sm:text-3xl">
                  {stats.maleCount}
                </span>
                <span className="text-admin-secondary text-sm font-semibold">
                  명
                </span>
                <span className="text-admin-info ml-auto text-sm font-bold">
                  {stats.maleRatio}%
                </span>
              </div>
              <p className="text-admin-muted mt-1 text-[11px]">
                남성 가입자 인원 및 비율 현황
              </p>
            </div>

            {/* 여성 사용자 카드 */}
            <div className="border-admin-edge bg-admin-panel/80 hover:border-admin-line hover:bg-admin-hover relative overflow-hidden rounded-2xl border p-5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-admin-muted text-xs font-bold tracking-wider uppercase">
                  여성 사용자
                </span>
                <div className="text-admin-danger flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                  <User size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-admin-ink text-2xl font-extrabold sm:text-3xl">
                  {stats.femaleCount}
                </span>
                <span className="text-admin-secondary text-sm font-semibold">
                  명
                </span>
                <span className="text-admin-danger ml-auto text-sm font-bold">
                  {stats.femaleRatio}%
                </span>
              </div>
              <p className="text-admin-muted mt-1 text-[11px]">
                여성 가입자 인원 및 비율 현황
              </p>
            </div>
          </div>

          {/* 메인 차트 및 세부 통계 레이아웃 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 1. 성비 시각화 차트 카드 */}
            <div className="border-admin-edge bg-admin-panel/80 rounded-2xl border p-6 shadow-2xl lg:col-span-2">
              <h2 className="text-admin-ink flex items-center gap-2 text-sm font-bold sm:text-base">
                <CircleDot size={18} className="text-admin-warning" />
                가입자 성비 현황 (Gender Ratio)
              </h2>
              <p className="text-admin-muted mt-1 text-xs">
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
                      stroke="var(--admin-subtle)"
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
                    <span className="typo-10-700 text-admin-muted tracking-wider uppercase">
                      Dominant
                    </span>
                    <span className="text-admin-ink text-xl font-extrabold">
                      {stats.maleCount >= stats.femaleCount
                        ? "남성 우세"
                        : "여성 우세"}
                    </span>
                    <span className="text-admin-secondary mt-0.5 text-[11px] font-medium">
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
                        <span className="text-admin-ink font-semibold">
                          남성 (MALE)
                        </span>
                      </div>
                      <span className="text-admin-info font-bold">
                        {stats.maleCount}명 ({stats.maleRatio}%)
                      </span>
                    </div>
                    <div className="bg-admin-subtle h-2 w-full overflow-hidden rounded-full">
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
                        <span className="text-admin-ink font-semibold">
                          여성 (FEMALE)
                        </span>
                      </div>
                      <span className="text-admin-danger font-bold">
                        {stats.femaleCount}명 ({stats.femaleRatio}%)
                      </span>
                    </div>
                    <div className="bg-admin-subtle h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-rose-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.femaleRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* 팁 박스 */}
                  <div className="border-admin-line/30 bg-admin-subtle/30 mt-4 flex items-start gap-2 rounded-xl border p-3">
                    <Sparkles
                      size={14}
                      className="text-admin-warning mt-0.5 shrink-0"
                    />
                    <p className="text-admin-secondary text-[11px] leading-relaxed">
                      상단의 남성/여성 통계 카드를 클릭하거나 하단 탭을 조작하여
                      성별에 해당하는 가입자들을 즉시 추려내고 티켓 조정이나
                      회원 관리를 진행하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 티켓 보유 통계 분석 카드 */}
            <div className="border-admin-edge bg-admin-panel/80 flex flex-col justify-between rounded-2xl border p-6 shadow-2xl">
              <div>
                <h2 className="text-admin-ink flex items-center gap-2 text-sm font-bold sm:text-base">
                  <Award size={18} className="text-admin-warning" />
                  성별 아이템(티켓) 통계
                </h2>
                <p className="text-admin-muted mt-1 text-xs">
                  남성과 여성의 평균 티켓 소유 현황 비교
                </p>

                <div className="mt-6 space-y-5">
                  {/* 매칭권 분석 */}
                  <div className="border-admin-line/40 bg-admin-subtle/40 space-y-2 rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/main/ticket.png"
                        alt="매칭권"
                        width={18}
                        height={18}
                      />
                      <span className="text-admin-ink text-xs font-bold">
                        평균 보유 매칭권
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="typo-10-500 text-admin-muted block">
                          남성 평균
                        </span>
                        <span className="text-admin-info text-sm font-extrabold">
                          {stats.avgMaleMatchingTickets}장
                        </span>
                      </div>
                      <div>
                        <span className="typo-10-500 text-admin-muted block">
                          여성 평균
                        </span>
                        <span className="text-admin-danger text-sm font-extrabold">
                          {stats.avgFemaleMatchingTickets}장
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 옵션권 분석 */}
                  <div className="border-admin-line/40 bg-admin-subtle/40 space-y-2 rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/main/option.png"
                        alt="옵션권"
                        width={18}
                        height={18}
                      />
                      <span className="text-admin-ink text-xs font-bold">
                        평균 보유 옵션권
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="typo-10-500 text-admin-muted block">
                          남성 평균
                        </span>
                        <span className="text-admin-info text-sm font-extrabold">
                          {stats.avgMaleOptionTickets}장
                        </span>
                      </div>
                      <div>
                        <span className="typo-10-500 text-admin-muted block">
                          여성 평균
                        </span>
                        <span className="text-admin-danger text-sm font-extrabold">
                          {stats.avgFemaleOptionTickets}장
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 총 유통량 */}
              <div className="border-admin-edge text-admin-secondary mt-6 flex items-center justify-between border-t pt-4 text-xs">
                <div>
                  총 유통 매칭권:{" "}
                  <span className="text-admin-ink font-bold">
                    {stats.totalMatchingTickets}장
                  </span>
                </div>
                <div>
                  총 유통 옵션권:{" "}
                  <span className="text-admin-ink font-bold">
                    {stats.totalOptionTickets}장
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
