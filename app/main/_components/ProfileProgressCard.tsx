"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/hooks/useProfile";
import { ProfileData } from "@/lib/types/profile";
import { User, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProfileProgressCard() {
  const router = useRouter();
  const { data: profileResponse, isLoading, isError } = useMyProfile();

  if (isLoading || isError || !profileResponse) {
    return (
      <div className="h-[88px] w-full animate-pulse rounded-[20px] border border-white/30 bg-white/30" />
    );
  }

  const profile = profileResponse.data;

  // 진척도 계산 로직 (13가지 핵심 필드 체크)
  const checkFields = [
    { key: "nickname", weight: 1 },
    { key: "gender", weight: 1 },
    { key: "birthDate", weight: 1 },
    { key: "mbti", weight: 1 },
    { key: "intro", weight: 1 },
    { key: "profileImageUrl", weight: 1 },
    { key: "socialAccountId", weight: 1 },
    { key: "university", weight: 1 },
    { key: "major", weight: 1 },
    { key: "contactFrequency", weight: 1 },
    { key: "hobbies", weight: 1 },
    { key: "tags", weight: 1 },
    { key: "song", weight: 1 },
  ];

  let filledCount = 0;
  checkFields.forEach((field) => {
    const val = profile[field.key as keyof ProfileData];
    if (val !== undefined && val !== null && val !== "") {
      if (Array.isArray(val)) {
        if (val.length > 0) filledCount += field.weight;
      } else {
        filledCount += field.weight;
      }
    }
  });

  const progressPercent = Math.round((filledCount / checkFields.length) * 100);
  const isCompleted = progressPercent === 100;

  return (
    <div
      onClick={() => router.push("/mypage")}
      className="w-full cursor-pointer rounded-[20px] border border-white/30 bg-white/50 p-4.5 shadow-sm backdrop-blur-[50px] transition-all duration-300 hover:border-pink-300 hover:bg-white/70 active:scale-[0.99]"
    >
      <div className="flex flex-col gap-2.5">
        {/* 상단 타이틀 영역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-[#e83abc]/10 text-[#e83abc]"
              }`}
            >
              {isCompleted ? <CheckCircle2 size={15} /> : <User size={15} />}
            </div>
            <span className="typo-14-700 text-color-text-caption1">
              내 프로필 완성도
            </span>
          </div>
          <span
            className={`typo-15-700 ${
              isCompleted ? "text-emerald-600" : "text-[#e83abc]"
            }`}
          >
            {progressPercent}%
          </span>
        </div>

        {/* 프로그래스 바 */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/60">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isCompleted
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-[#e83abc] to-[#ff4d61]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 안내 문구 및 CTA */}
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-color-text-caption3 text-[11px] leading-[14px] font-semibold">
            {isCompleted
              ? "완벽해요! 프로필이 모두 채워졌습니다. ✨"
              : "프로필 정보를 채우고 완벽한 상대를 만나보세요!"}
          </span>
          {!isCompleted && (
            <div className="flex items-center gap-0.5 text-[11px] leading-[14px] font-bold text-[#e83abc]">
              <span>작성하러 가기</span>
              <ArrowRight size={11} className="mt-[1px] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
