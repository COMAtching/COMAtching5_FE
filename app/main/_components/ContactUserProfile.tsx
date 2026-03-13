import { Hobby, ProfileData } from "@/lib/types/profile";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

const getHobbyLabel = (hobbies?: (Hobby | string)[]) => {
  if (!hobbies || hobbies.length === 0) return "없음";
  const hobby = hobbies[0];
  return typeof hobby === "string" ? hobby : hobby.name;
};

const getAge = (birthDate?: string) => {
  if (!birthDate) return "?? ";
  return new Date().getFullYear() - new Date(birthDate).getFullYear() + 1;
};

/* ── 밑줄 값 텍스트 (반복 패턴) ── */
const UnderlinedValue = ({ children }: { children: React.ReactNode }) => (
  <span className="typo-14-600 border-color-gray-400 text-color-text-black border-b">
    {children}
  </span>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="typo-14-500 text-color-gray-500">{children}</span>
);

/* ── 프로필 헤더 (이미지 + 닉네임 + 액션 아이콘) ── */
const ProfileHeader = ({ profile }: { profile: ProfileData }) => (
  <div className="flex w-full items-center gap-4">
    {/* 프로필 이미지 */}
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/0 p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="bg-color-gray-100 relative h-11 w-11 overflow-hidden rounded-full">
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
      <span className="typo-12-600 text-color-gray-500">내가 뽑은 사람</span>
      <span className="typo-16-600 text-color-text-black">
        {profile.nickname || "익명"}
      </span>
    </div>

    {/* 액션 아이콘 */}
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center"
      >
        <Image src="/icons/send-message.svg" alt="dm" width={16} height={16} />
      </button>
      <button
        type="button"
        className="flex h-4 w-4 flex-col items-center justify-center gap-1"
      >
        <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
        <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
        <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
      </button>
    </div>
  </div>
);

/* ── 나이 + 전공 ── */
const ProfileStats = ({ profile }: { profile: ProfileData }) => (
  <div className="flex w-full items-start gap-2 pt-1">
    <div className="flex flex-col gap-1">
      <span className="typo-12-600 text-color-gray-500">나이</span>
      <span className="typo-14-600 text-color-text-black">
        {getAge(profile.birthDate)}
      </span>
    </div>
    <div className="ml-8 flex flex-col gap-1">
      <span className="typo-12-600 text-color-gray-500">전공</span>
      <span className="typo-14-600 text-color-text-black">
        {profile.major || "미지정"}
      </span>
    </div>
  </div>
);

/* ── 소개 텍스트 (MBTI, 연락빈도, 취미) ── */
const ProfileIntro = ({ profile }: { profile: ProfileData }) => (
  <>
    <div className="mb-2 flex items-center gap-1 text-[14px]">
      <Label>MBTI는</Label>
      <UnderlinedValue>{profile.mbti}</UnderlinedValue>
      <Label>, 연락빈도는</Label>
      <UnderlinedValue>
        {getContactFrequencyLabel(profile.contactFrequency)} ➡️
      </UnderlinedValue>
      <Label>이에요.</Label>
    </div>
    <div className="flex items-center gap-2 text-[14px]">
      <Label>저는 요즘</Label>
      <UnderlinedValue>{getHobbyLabel(profile.hobbies)}</UnderlinedValue>
      <Label>을 좋아해요.</Label>
    </div>
  </>
);

/* ── 라벨 + 밑줄 값 행 (반복 패턴 제거) ── */
const IntroRow = ({
  label,
  value,
  suffix,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
}) => (
  <div className="flex w-full flex-col gap-2">
    <Label>{label}</Label>
    <div className="flex w-full items-center gap-1">
      <div className="border-color-gray-400 flex flex-1 items-center justify-center border-b pb-1 text-center">
        <span className="typo-14-600 text-color-text-black truncate">
          {value}
        </span>
      </div>
      {suffix && (
        <span className="typo-14-500 text-color-gray-500 whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/* ── 펼치기 영역 (장점, 노래, 한마디) ── */
const ExpandableDetails = ({
  profile,
  isExpanded,
}: {
  profile: ProfileData;
  isExpanded: boolean;
}) => (
  <div
    className={`grid transition-all duration-500 ease-in-out ${
      isExpanded
        ? "mt-4 grid-rows-[1fr] opacity-100"
        : "mt-0 grid-rows-[0fr] opacity-0"
    }`}
  >
    <div className="flex flex-col gap-4 overflow-hidden">
      <IntroRow
        label="제 장점은요,"
        value={profile.advantages?.[0] || "웃음이 많아요 �"}
      />
      <IntroRow
        label="요즘 좋아하는 노래는,"
        value={profile.favoriteSong || "아직 없어요!"}
        suffix="입니다!"
      />
      <IntroRow
        label="마지막 한마디는,"
        value={profile.intro || "잘 부탁드립니다!! 😆"}
      />
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

/* ── 메인 컴포넌트 ── */
interface ContactUserProfileProps {
  profiles: ProfileData[];
}

const ContactUserProfile = ({ profiles }: ContactUserProfileProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center">
      <section className="flex w-full flex-col overflow-hidden rounded-[24px] border border-b-0 border-white/30 bg-white/50 backdrop-blur-[50px]">
        {/* 스와이프 카드 영역 */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto"
        >
          {profiles.map((profile) => (
            <div
              key={profile.memberId}
              className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-3 p-4"
            >
              <ProfileHeader profile={profile} />
              <ProfileStats profile={profile} />
              <div className="bg-color-gray-100 h-px w-full" />
              <div className="flex w-full flex-col">
                <ProfileIntro profile={profile} />
                <ExpandableDetails profile={profile} isExpanded={isExpanded} />
              </div>
            </div>
          ))}
        </div>

        {/* 그라디언트 푸터 */}
        <footer
          style={{
            background:
              "linear-gradient(93.29deg, #FF775E 0.01%, #FF4D61 47.4%, #E83ABC 100%)",
          }}
          className="flex h-[42px] w-full items-center justify-between rounded-b-[24px] border border-t-0 border-white/30 px-4 backdrop-blur-[50px]"
        >
          <SocialIdDisplay profile={profiles[activeIndex]} />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto flex items-center justify-center gap-1 rounded-full border border-white/30 bg-white/30 px-2 py-1 transition-all"
          >
            <span className="typo-10-600 text-white">
              {isExpanded ? "접기" : "펼치기"}
            </span>
            {isExpanded ? (
              <ChevronUp size={10} className="text-white" />
            ) : (
              <ChevronDown size={10} className="text-white" />
            )}
          </button>
        </footer>
      </section>

      {/* 인디케이터 도트 (슬라이딩 트랙 방식) */}
      {profiles.length > 1 && (
        <div className="mt-4 flex justify-center">
          {/* 도트 5개 너비 (6px * 5 + 6px 간격 * 4 = 54px) */}
          <div className="relative h-1.5 w-[54px] overflow-hidden">
            <div
              className="flex items-center gap-1.5 transition-transform duration-300 ease-out"
              style={{
                // 현재 인덱스를 중앙(2번째 칸)에 맞추기 위한 트랙 이동
                transform: `translateX(${
                  -Math.max(0, Math.min(profiles.length - 5, activeIndex - 2)) *
                  12
                }px)`,
              }}
            >
              {profiles.map((profile, i) => {
                // 현재 보여지는 5개 도트의 윈도우 범위 계산
                const windowStart = Math.max(
                  0,
                  Math.min(profiles.length - 5, activeIndex - 2),
                );
                const windowEnd = windowStart + 4;

                // 윈도우 안에 있는지 확인
                const isVisible = i >= windowStart && i <= windowEnd;
                // 윈도우의 양 끝 도트인지 확인 (더 있다는 표시로 작게 만듦)
                const isEdge =
                  (i === windowStart && i > 0) ||
                  (i === windowEnd && i < profiles.length - 1);

                return (
                  <div
                    key={`dot-${profile.memberId}`}
                    className={`shrink-0 rounded-full transition-all duration-300 ${
                      isVisible
                        ? isEdge
                          ? "h-1 w-1"
                          : "h-1.5 w-1.5"
                        : "h-0 w-0 opacity-0"
                    } ${
                      i === activeIndex
                        ? "bg-color-gray-800"
                        : "bg-color-gray-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUserProfile;
