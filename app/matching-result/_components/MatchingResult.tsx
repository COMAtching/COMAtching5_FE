"use client";

import {
  ALL_ADVANTAGES,
  ALL_HOBBIES,
  findWithEmoji,
} from "@/lib/utils/matching";
import Image from "next/image";
import React, { useState } from "react";
import { getContactFrequencyLabel } from "@/lib/utils/profile";
import { MatchingResult as MatchingResultType } from "@/lib/types/matching";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface MatchingResultProps {
  data: MatchingResultType;
}

/* ── 개별 정보 블록 (글자 블러 + 터치 해제) ── */
const RevealBlock = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setRevealed(true);
      }}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-transparent p-2 transition-all select-none",
        !revealed &&
          "border-dashed border-black/10 bg-black/[0.02] hover:bg-black/5 active:scale-[0.99]",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="typo-12-600 text-[#777777]">{label}</span>
        {!revealed && (
          <span
            className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-sm"
            style={{
              background:
                "linear-gradient(93deg, #FF775E 0%, #FF4D61 47%, #E83ABC 100%)",
            }}
          >
            <Lock size={8} /> 터치해서 공개
          </span>
        )}
      </div>
      <div className="relative w-full">
        <motion.div
          animate={{
            filter: revealed ? "blur(0px)" : "blur(7px)",
            opacity: revealed ? 1 : 0.4,
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

/* ── 개별 수치형 블록 (나이, MBTI, 연락빈도 등) ── */
const StatBlock = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setRevealed(true);
      }}
      className={cn(
        "flex flex-1 cursor-pointer flex-col gap-1 rounded-xl border border-transparent p-2 transition-all select-none",
        !revealed &&
          "border-dashed border-black/10 bg-black/[0.02] hover:bg-black/5 active:scale-95",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="typo-12-600 text-[#777777]">{label}</span>
        {!revealed && <Lock size={9} className="text-[#FF4D61]" />}
      </div>
      <div className="relative flex min-h-[24px] items-center">
        <motion.span
          className="typo-16-700 text-color-text-black block"
          animate={{
            filter: revealed ? "blur(0px)" : "blur(6px)",
            opacity: revealed ? 1 : 0.4,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {value}
        </motion.span>
        {!revealed && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end">
            <span className="rounded bg-[#FF4D61]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#FF4D61]">
              터치
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const MatchingResult = ({ data }: MatchingResultProps) => {
  // 취미 이름 목록 추출
  const hobbyNames = (data.hobbies || []).map((h) =>
    typeof h === "string" ? h : h.name,
  );

  // 장점 이름 목록 추출
  const tagNames = (data.tags || []).map((t) =>
    typeof t === "string" ? t : t.tag,
  );

  // SNS 타입 레이블
  const socialLabel = data.socialType === "KAKAO" ? "KakaoTalk" : "Instagram";

  return (
    <div className="mt-6 flex w-full flex-col gap-5 rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      {/* ── 프로필 헤더 (닉네임, 프로필 이미지 등은 항상 보임) ── */}
      <div className="flex w-full flex-row items-center gap-4 border-b border-black/5 pb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white/0 p-[2px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src={data.profileImageUrl || "/animal/cat_female 1.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="typo-16-600 flex items-center text-black">
            {data.nickname}
          </span>
        </div>
      </div>

      {/* ── 전공 블록 ── */}
      <RevealBlock label="전공">
        <span className="typo-16-700 flex items-center text-black">
          {data.major}
        </span>
      </RevealBlock>

      {/* ── 수치형 정보 블록 (나이, MBTI, 연락빈도) ── */}
      <div className="flex w-full flex-row items-start gap-2">
        <StatBlock label="나이" value={data.age} />
        <StatBlock label="MBTI" value={data.mbti} />
        <StatBlock
          label="연락빈도"
          value={getContactFrequencyLabel(data.contactFrequency)}
        />
      </div>

      {/* ── 취미 ── */}
      {hobbyNames.length > 0 && (
        <RevealBlock label="취미">
          <div className="flex w-full flex-row flex-wrap items-start gap-1 py-1">
            {hobbyNames.map((hobby) => (
              <div
                key={hobby}
                className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B3]/10 px-3 py-2 backdrop-blur-[50px]"
              >
                <span className="typo-14-500 text-black">
                  {findWithEmoji(ALL_HOBBIES, hobby)}
                </span>
              </div>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── 장점 ── */}
      {tagNames.length > 0 && (
        <RevealBlock label="장점">
          <div className="flex w-full flex-row flex-wrap items-start gap-1 py-1">
            {tagNames.map((strength) => (
              <div
                key={strength}
                className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B3]/10 px-3 py-2 backdrop-blur-[50px]"
              >
                <span className="typo-14-500 text-black">
                  {findWithEmoji(ALL_ADVANTAGES, strength)}
                </span>
              </div>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── 좋아하는 노래 ── */}
      {data.song && (
        <RevealBlock label="좋아하는 노래">
          <span className="typo-16-700 flex items-center text-black">
            {data.song}
          </span>
        </RevealBlock>
      )}

      {/* ── 나를 소개하는 한마디 ── */}
      {data.intro && (
        <RevealBlock label="나를 소개하는 한마디">
          <span className="typo-16-700 flex items-center text-black">
            {data.intro}
          </span>
        </RevealBlock>
      )}

      {/* ── SNS ── */}
      {data.socialAccountId && (
        <RevealBlock label={socialLabel}>
          <span className="typo-16-700 flex w-full items-center justify-center py-1 text-center text-[#FF4D61]">
            {data.socialAccountId}
          </span>
        </RevealBlock>
      )}
    </div>
  );
};

export default MatchingResult;
