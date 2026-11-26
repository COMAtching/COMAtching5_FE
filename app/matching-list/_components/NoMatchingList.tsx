"use client";

import React from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useParticipantsCount } from "@/hooks/useParticipantsCount";

interface NoMatchingListProps {
  type?: "matching" | "chat";
}

const NoMatchingList = ({ type = "matching" }: NoMatchingListProps) => {
  const router = useRouter();
  const { data, isPending } = useParticipantsCount();
  const count = data?.data?.count;

  return (
    <div className="flex w-[345px] flex-col items-center gap-4">
      {/* her image */}
      <div className="relative h-12 w-[78.96px]">
        <Image
          src="/main/no-contact.png"
          alt="her"
          fill
          className="object-contain"
        />
      </div>

      {/* Message */}
      <p className="typo-14-500 text-color-gray-500 w-[345px] text-center leading-[160%]">
        {type === "chat"
          ? "아직 대화 중인 채팅방이 없어요."
          : "아직 매칭된 상대가 없어요."}
        <br />
        <span aria-live="polite">
          {count != null ? (
            <>
              현재{" "}
              <span className="text-color-flame-700 typo-14-700">
                {count.toLocaleString("ko-KR")}
              </span>
              명이 참여중이에요.
            </>
          ) : isPending ? (
            <LoadingSpinner variant="inline" label="참여 인원 불러오는 중" />
          ) : (
            "참여 인원을 불러오지 못했어요."
          )}
        </span>
        <br />
        {type === "chat"
          ? "매칭된 상대와 대화를 시작해보세요!"
          : "나와 딱 맞는 이성친구를 만들어봐요!"}
      </p>

      {/* button */}
      <button
        onClick={() => {
          router.push("/matching");
        }}
        className="bg-milky-pink flex h-[38px] w-[136px] items-center justify-center gap-2 rounded-full px-4 py-2 shadow-sm transition-transform active:scale-95"
      >
        <span className="typo-14-600 text-white">매칭하러 가기</span>
        <ArrowLeft size={20} className="rotate-180 text-white" />
      </button>
    </div>
  );
};

export default NoMatchingList;
