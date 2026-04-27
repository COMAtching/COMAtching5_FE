"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface NoMatchingListProps {
  nickname?: string;
}

const NoMatchingList = ({ nickname = "회원" }: NoMatchingListProps) => {
  const router = useRouter();

  return (
    <div className="flex w-[345px] flex-col items-center gap-4">
      {/* her image */}
      <div className="relative h-[48px] w-[78.96px]">
        <Image
          src="/her.png" // User provided "her.png"
          alt="her"
          fill
          className="object-contain"
        />
      </div>

      {/* Message */}
      <p className="typo-14-500 text-color-gray-500 w-[345px] text-center leading-[160%]">
        아직 매칭된 상대가 없어요.
        <br />
        아직 <span className="text-color-flame-700 typo-14-700">
          732
        </span>명이 {nickname}님을 기다리고 있어요.
        <br />
        나와 딱 맞는 이성친구를 만들어봐요!
      </p>

      {/* button */}
      <button
        onClick={() => router.push("/matching")}
        className="bg-milky-pink flex h-[38px] w-[136px] items-center justify-center gap-2 rounded-full px-4 py-2 shadow-sm transition-transform active:scale-95"
      >
        <span className="typo-14-600 text-white">매칭하러 가기</span>
        <ArrowLeft size={20} className="rotate-180 text-white" />
      </button>
    </div>
  );
};

export default NoMatchingList;
