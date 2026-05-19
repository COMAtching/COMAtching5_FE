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
import { Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MatchingResultProps {
  data: MatchingResultType;
}

const MatchingResult = ({ data }: MatchingResultProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

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
    <div className="mt-6 flex w-full flex-col gap-6 rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      {/* ── 항상 선명하게 보이는 헤더 ── */}
      <div className="flex w-full flex-col gap-4">
        {/* 프로필 이미지 + 닉네임 */}
        <div className="flex w-full flex-row items-center gap-4">
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

        {/* 전공 */}
        <div className="flex w-full flex-col items-start gap-1">
          <span className="typo-12-600 flex items-center text-[#777777]">
            전공
          </span>
          <span className="typo-16-700 flex items-center text-black">
            {data.major}
          </span>
        </div>

        {/* 나이 / MBTI / 연락빈도 */}
        <div className="flex w-full flex-row items-start gap-2">
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="typo-12-600 flex w-full items-center text-[#777777]">
              나이
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {data.age}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="typo-12-600 flex w-full items-center text-[#777777]">
              MBTI
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {data.mbti}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="typo-12-600 flex items-center text-[#777777]">
              연락빈도
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {getContactFrequencyLabel(data.contactFrequency)}
            </span>
          </div>
        </div>
      </div>

      {/* ── 블러 공개 영역 ── */}
      <div
        className="relative cursor-pointer select-none"
        onClick={() => setIsRevealed(true)}
      >
        {/* 실제 상세 콘텐츠 (blur 애니메이션 적용) */}
        <motion.div
          className="flex w-full flex-col gap-5 border-t border-black/5 pt-4"
          animate={{
            filter: isRevealed ? "blur(0px)" : "blur(7px)",
            opacity: isRevealed ? 1 : 0.55,
          }}
          transition={{ duration: 0.55, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {/* 취미 */}
          {hobbyNames.length > 0 && (
            <div className="flex w-full flex-col items-start gap-1">
              <span className="typo-12-600 flex items-center text-[#777777]">
                취미
              </span>
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
            </div>
          )}

          {/* 장점 */}
          {tagNames.length > 0 && (
            <div className="flex w-full flex-col items-start gap-1">
              <span className="typo-12-600 flex items-center text-[#777777]">
                장점
              </span>
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
            </div>
          )}

          {/* 좋아하는 노래 */}
          {data.song && (
            <div className="flex w-full flex-col items-start gap-1">
              <span className="typo-12-600 flex items-center text-[#777777]">
                좋아하는 노래
              </span>
              <span className="typo-16-700 flex items-center text-black">
                {data.song}
              </span>
            </div>
          )}

          {/* 나를 소개하는 한마디 */}
          {data.intro && (
            <div className="flex w-full flex-col items-start gap-1">
              <span className="typo-12-600 flex items-center text-[#777777]">
                나를 소개하는 한마디
              </span>
              <span className="typo-16-700 flex items-center text-black">
                {data.intro}
              </span>
            </div>
          )}

          {/* SNS */}
          {data.socialAccountId && (
            <div className="flex w-full flex-col items-start gap-1 py-2">
              <span className="typo-12-600 flex w-full items-center justify-center text-center text-[#777777]">
                {socialLabel}
              </span>
              <span className="typo-16-700 flex w-full items-center justify-center text-center text-[#FF4D61]">
                {data.socialAccountId}
              </span>
            </div>
          )}
        </motion.div>

        {/* ── 블러 오버레이 (공개 전에만 표시) ── */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-4"
            >
              {/* 잠금 아이콘 + 안내 텍스트 */}
              <motion.div
                className="flex flex-col items-center gap-2.5"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{
                  duration: 1.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF775E 0%, #FF4D61 50%, #E83ABC 100%)",
                  }}
                >
                  <Lock size={22} className="text-white" />
                </div>
                <span
                  className="typo-12-600 rounded-full px-4 py-[6px] text-white shadow-md"
                  style={{
                    background:
                      "linear-gradient(93deg, #FF775E 0%, #FF4D61 47%, #E83ABC 100%)",
                  }}
                >
                  터치하면 상세 정보가 공개돼요 ✨
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 공개 후 해제 뱃지 ── */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 flex w-full items-center justify-center gap-1.5"
            >
              <Unlock size={12} className="text-[#aaa]" />
              <span className="typo-10-500 text-[#aaa]">상세 정보 공개됨</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MatchingResult;
