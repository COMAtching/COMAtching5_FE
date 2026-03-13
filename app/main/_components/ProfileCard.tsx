"use client";

import { Hobby, ProfileData } from "@/lib/types/profile";
import Image from "next/image";
import { Send } from "lucide-react";
import React, { useRef } from "react";

/* ── 유틸 함수 ── */
const getContactFrequencyLabel = (freq?: string) => {
  switch (freq) {
    case "FREQUENT":
      return "자주";
    case "NORMAL":
      return "보통";
    case "RARE":
      return "드물게";
    default:
      return freq || "보통";
  }
};

const getAge = (birthDate?: string) => {
  if (!birthDate) return "?? ";
  return new Date().getFullYear() - new Date(birthDate).getFullYear() + 1;
};

/* ── 태그 컴포넌트 ── */
const Tag = ({ text }: { text: string }) => (
  <div className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B31A] px-3 py-2 backdrop-blur-[50px]">
    <span className="typo-14-500 whitespace-nowrap text-black">{text}</span>
  </div>
);

/* ── 프로필 헤더 (이미지 + 닉네임 + 액션 아이콘) ── */
const ProfileHeader = ({ profile }: { profile: ProfileData }) => (
  <div className="flex w-full items-center gap-4">
    {/* 프로필 이미지 (48x48 container, 44x44 image) */}
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/0 p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#D9D9D9]">
        <Image
          src={profile.profileImageUrl || "/default-profile.png"}
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>
    </div>

    {/* 닉네임 */}
    <div className="flex flex-1 flex-col items-start gap-1">
      <span className="typo-12-600 text-[#777777]">내가 뽑은 사람</span>
      <span className="typo-16-600 text-black">
        {profile.nickname || "익명"}
      </span>
    </div>

    <div className="flex items-center gap-4">
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Send size={16} className="text-[#333333]" />
      </button>
      <button
        type="button"
        className="flex h-4 w-4 flex-col items-center justify-center gap-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[2.57px] w-[2.57px] rounded-full bg-[#333333]" />
        <div className="h-[2.57px] w-[2.57px] rounded-full bg-[#333333]" />
        <div className="h-[2.57px] w-[2.57px] rounded-full bg-[#333333]" />
      </button>
    </div>
  </div>
);

/* ── 나이 + MBTI + 연락빈도 ── */
const ProfileStats = ({ profile }: { profile: ProfileData }) => (
  <div className="flex w-full items-start gap-2">
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">나이</span>
      <span className="typo-16-700 text-black">
        {getAge(profile.birthDate)}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">MBTI</span>
      <span className="typo-16-700 text-black">{profile.mbti}</span>
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <span className="typo-12-600 whitespace-nowrap text-[#777777]">
        연락빈도
      </span>
      <span className="typo-16-700 text-black">
        {getContactFrequencyLabel(profile.contactFrequency)}
      </span>
    </div>
  </div>
);

/* ── 확장 가능한 상세 정보 ── */
const ProfileDetails = ({
  profile,
  isExpanded,
}: {
  profile: ProfileData;
  isExpanded: boolean;
}) => (
  <div
    className="flex flex-col gap-3 overflow-hidden transition-[max-height] duration-500 ease-in-out"
    style={{
      maxHeight: isExpanded ? "1000px" : "114px",
      // WebkitMaskImage와 maskImage에 트랜지션 효과를 주어
      // 줄어들 때 블러가 서서히 나타나거나 늦게 나타나도록 설정
      maskImage: isExpanded
        ? "linear-gradient(to bottom, black 0%, black 100%, transparent 100%)"
        : "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
      WebkitMaskImage: isExpanded
        ? "linear-gradient(to bottom, black 0%, black 100%, transparent 100%)"
        : "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
      // 줄어들 때(Expanded -> Click) 블러가 나중에 생기도록 delay 부여
      transition: isExpanded
        ? "max-height 500ms ease-in-out, mask-image 300ms ease-out, -webkit-mask-image 300ms ease-out"
        : "max-height 500ms ease-in-out, mask-image 400ms ease-in 100ms, -webkit-mask-image 400ms ease-in 100ms",
    }}
  >
    {/* 관심사 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">관심사</span>
      <div className="flex flex-wrap gap-1">
        {profile.hobbies && profile.hobbies.length > 0 ? (
          profile.hobbies.map((hobby, idx) => (
            <Tag
              key={idx}
              text={typeof hobby === "string" ? hobby : hobby.name}
            />
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
        {profile.advantages && profile.advantages.length > 0 ? (
          profile.advantages.map((adv, idx) => <Tag key={idx} text={adv} />)
        ) : (
          <Tag text="없음" />
        )}
      </div>
    </div>

    {/* 좋아하는 노래 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">좋아하는 노래</span>
      <span className="typo-16-600 text-black">
        {profile.favoriteSong || "아직 없어요!"}
      </span>
    </div>

    {/* 나를 소개하는 한마디 */}
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-[#777777]">나를 소개하는 한마디</span>
      <span className="typo-16-600 text-black">
        {profile.intro || "잘 부탁드립니다!! 😆"}
      </span>
    </div>
  </div>
);

/* ── 소셜 ID 표시 ── */
const SocialIdDisplay = ({ profile }: { profile: ProfileData }) => {
  if (!profile.socialType || !profile.socialAccountId) return null;

  if (profile.socialType === "KAKAO") {
    return (
      <div className="flex items-center gap-2">
        <Image src="/sns/kakao-sns.svg" alt="kakao" width={16} height={16} />
        <span className="typo-15-600 text-white">
          {profile.socialAccountId}
        </span>
      </div>
    );
  }
  return (
    <span className="typo-15-600 text-white">@{profile.socialAccountId}</span>
  );
};

/* ── 메인 프로필 카드 컴포넌트 ── */
interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const touchStartTime = useRef<number>(0);

  const handleCardClick = () => {
    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration < 200) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[24px] border border-b-0 border-white/30 bg-white/50 backdrop-blur-[50px]">
      {/* 카드 본체 */}
      <div
        onTouchStart={() => (touchStartTime.current = Date.now())}
        onMouseDown={() => (touchStartTime.current = Date.now())}
        onClick={handleCardClick}
        className="flex w-full cursor-pointer flex-col items-center justify-start gap-3 p-4"
      >
        <ProfileHeader profile={profile} />
        <ProfileStats profile={profile} />
        <div className="flex w-full flex-col">
          <ProfileDetails profile={profile} isExpanded={isExpanded} />
        </div>
      </div>

      {/* 그라디언트 푸터 */}
      <footer
        style={{
          background:
            "linear-gradient(93.29deg, #FF775E 0.01%, #FF4D61 47.4%, #E83ABC 100%)",
        }}
        className="flex h-[42px] w-full items-center justify-between rounded-b-[24px] border border-t-0 border-white/30 px-4 backdrop-blur-[50px]"
      >
        <SocialIdDisplay profile={profile} />
      </footer>
    </div>
  );
};

export default ProfileCard;
