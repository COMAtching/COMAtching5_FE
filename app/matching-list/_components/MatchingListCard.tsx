"use client";

import {
  MatchingHistoryItem,
  MatchingPartner,
} from "@/hooks/useMatchingHistory";
import Image from "next/image";
import { Send, Star, ChevronDown } from "lucide-react";
import React, { useRef, useState } from "react";
import { getAge } from "@/lib/utils/date";

/* ── 태그 컴포넌트 ── */
const Tag = ({ text }: { text: string }) => (
  <div className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B31A] px-3 py-2 backdrop-blur-[50px]">
    <span className="typo-14-500 text-color-text-black whitespace-nowrap">
      {text}
    </span>
  </div>
);

/* ── 프로필 헤더 (이미지 + 닉네임 + 액션 아이콘) ── */
const CardHeader = ({
  partner,
  isFavorite,
  onFavoriteToggle,
}: {
  partner: MatchingPartner;
  isFavorite: boolean;
  onFavoriteToggle?: () => void;
}) => (
  <div className="flex w-full items-center gap-4">
    {/* 프로필 이미지 (48x48 container, 44x44 image) */}
    <div className="border-color-gray-0 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/0 p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#D9D9D9]">
        <Image
          src={partner.profileImageUrl || "/default-profile.png"}
          alt={`${partner.nickname || "익명"}님의 프로필 사진`}
          fill
          className="object-cover"
        />
      </div>
    </div>

    {/* 닉네임 */}
    <div className="flex flex-1 flex-col items-start gap-1">
      <span className="typo-12-600 text-[#777777]">내가 뽑은 사람</span>
      <span className="typo-16-600 text-color-text-black">
        {partner.nickname || "익명"}
      </span>
    </div>

    {/* 액션 아이콘들 */}
    <div className="flex items-center gap-6">
      <button
        type="button"
        aria-label="즐겨찾기"
        className="flex h-4 w-4 items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle?.();
        }}
      >
        <Star
          size={16}
          className={
            isFavorite
              ? "fill-color-flame-700 text-color-flame-700"
              : "text-color-gray-500"
          }
        />
      </button>
      <button
        type="button"
        aria-label="메시지 보내기"
        className="flex h-4 w-4 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Send size={16} className="text-color-gray-500" />
      </button>
      <button
        type="button"
        aria-label="더 보기"
        className="flex h-4 w-4 flex-col items-center justify-center gap-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
        <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
        <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
      </button>
    </div>
  </div>
);

/* ── 나이 + MBTI + 연락빈도 ── */
const CardStats = ({ partner }: { partner: MatchingPartner }) => (
  <div className="flex w-full items-start gap-2">
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">나이</span>
      <span className="typo-16-700 text-color-text-black">
        {getAge(partner.birthDate)}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">MBTI</span>
      <span className="typo-16-700 text-color-text-black">{partner.mbti}</span>
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 whitespace-nowrap text-[#777777]">
        연락빈도
      </span>
      <span className="typo-16-700 text-color-text-black">
        {partner.contactFrequency}
      </span>
    </div>
  </div>
);

/* ── 확장 가능한 상세 정보 ── */
const CardDetails = ({
  partner,
  isExpanded,
}: {
  partner: MatchingPartner;
  isExpanded: boolean;
}) => (
  <div
    className="flex w-full flex-col gap-3 overflow-hidden transition-all duration-500 ease-in-out"
    style={{
      maxHeight: isExpanded ? "1000px" : "60px",
      maskImage: isExpanded
        ? "linear-gradient(to bottom, black 0%, black 100%, transparent 100%)"
        : "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
      WebkitMaskImage: isExpanded
        ? "linear-gradient(to bottom, black 0%, black 100%, transparent 100%)"
        : "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
    }}
  >
    {/* 관심사 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">관심사</span>
      <div className="flex flex-wrap gap-1">
        {partner.hobbies && partner.hobbies.length > 0 ? (
          partner.hobbies.map((hobby) => (
            <Tag key={hobby.name} text={hobby.name} />
          ))
        ) : (
          <Tag text="없음" />
        )}
      </div>
    </div>

    {/* 장점 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">장점</span>
      <div className="flex flex-wrap gap-1">
        {partner.tags && partner.tags.length > 0 ? (
          partner.tags.map((t) => <Tag key={t.tag} text={t.tag} />)
        ) : (
          <Tag text="없음" />
        )}
      </div>
    </div>

    {/* 좋아하는 노래 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">좋아하는 노래</span>
      <span className="typo-16-600 text-color-text-black">
        {partner.song || "아직 없어요!"}
      </span>
    </div>

    {/* 나를 소개하는 한마디 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">나를 소개하는 한마디</span>
      <span className="typo-16-600 text-color-text-black">
        {partner.intro || "잘 부탁드립니다!! 😆"}
      </span>
    </div>
  </div>
);

/* ── 소셜 ID 표시 ── */
const SocialIdDisplay = ({ partner }: { partner: MatchingPartner }) => {
  if (!partner.socialType || !partner.socialAccountId) return null;

  if (partner.socialType === "KAKAO") {
    return (
      <div className="flex items-center gap-2">
        <Image src="/sns/kakao-sns.svg" alt="kakao" width={16} height={16} />
        <span className="typo-15-600 text-color-text-white">
          {partner.socialAccountId}
        </span>
      </div>
    );
  }
  return (
    <span className="typo-15-600 text-color-text-white">
      @{partner.socialAccountId}
    </span>
  );
};

/* ── 메인 매칭 리스트 카드 컴포넌트 ── */
interface MatchingListCardProps {
  item: MatchingHistoryItem;
  onFavoriteToggle?: (historyId: number) => void;
}

const MatchingListCard = ({
  item,
  onFavoriteToggle,
}: MatchingListCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartTime = useRef<number>(0);

  const handleCardClick = () => {
    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration < 200) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[24px] shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      {/* 카드 본체 */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${item.partner.nickname || "익명"} 프로필 상세 ${isExpanded ? "접기" : "펼치기"}`}
        onTouchStart={() => (touchStartTime.current = Date.now())}
        onMouseDown={() => (touchStartTime.current = Date.now())}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }
        }}
        className="flex w-full cursor-pointer flex-col items-start justify-start rounded-t-[24px] border border-b-0 border-white/30 bg-white/50 px-4 pt-6 pb-4"
      >
        <CardHeader
          partner={item.partner}
          isFavorite={item.favorite}
          onFavoriteToggle={() => onFavoriteToggle?.(item.historyId)}
        />
        <div className="mt-4 mb-3 w-full">
          <CardStats partner={item.partner} />
        </div>
        <CardDetails partner={item.partner} isExpanded={isExpanded} />
      </div>

      {/* 그라디언트 푸터 */}
      <footer
        style={{
          background:
            "linear-gradient(93.29deg, #FF775E 0.01%, #FF4D61 47.4%, #E83ABC 100%)",
        }}
        className="flex h-[42px] w-full items-center justify-between rounded-b-[24px] border border-t-0 border-white/30 px-4 backdrop-blur-[50px]"
      >
        <SocialIdDisplay partner={item.partner} />

        {/* 펼치기 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className="ml-auto flex items-center gap-1 rounded-full border border-white/20 bg-[linear-gradient(111.41deg,rgba(255,255,255,0.3)_5.28%,rgba(255,255,255,0.5)_101.41%)] px-[6px] py-[2px] backdrop-blur-[50px]"
        >
          <span className="typo-10-500 text-white">
            {isExpanded ? "접기" : "펼치기"}
          </span>
          <ChevronDown
            size={8}
            className={`text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </footer>
    </div>
  );
};

export default MatchingListCard;
