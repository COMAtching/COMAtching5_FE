"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import ProfileButton from "@/app/profile-builder/_components/ProfileButton";
import ProfileImageSelection from "@/app/profile-image/_components/ProfileImageSelection";
import { ChevronRight, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/stores/profile-store";
import { generateRandomNickname } from "@/lib/utils/nickname";
import { getDefaultProfilesByGender } from "@/lib/constants/defaultProfiles";
import type {
  Gender,
  ContactFrequency,
  MBTI,
  Hobby,
} from "@/lib/types/profile";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

/* ───── 상수 맵핑 ───── */

const genderMap: Record<string, Gender> = { 남자: "MALE", 여자: "FEMALE" };
const reverseGenderMap: Record<string, string> = {
  MALE: "남자",
  FEMALE: "여자",
};

const INTRO_MAX_LENGTH = 60;

/* ───── 메뉴 행 컴포넌트 ───── */

interface MenuRowProps {
  label: string;
  value?: React.ReactNode;
  hasChevron?: boolean;
  underline?: boolean;
  onClick?: () => void;
}

const MenuRow = ({
  label,
  value,
  hasChevron = false,
  underline = false,
  onClick,
}: MenuRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6 text-left"
  >
    <span className="typo-16-600 shrink-0 text-[#1A1A1A]">{label}</span>
    <div className="flex items-center gap-2">
      {value && (
        <span
          className={cn("typo-16-600 text-[#999999]", underline && "underline")}
        >
          {value}
        </span>
      )}
      {hasChevron && (
        <ChevronRight className="h-3 w-3 shrink-0 text-[#999999]" />
      )}
    </div>
  </button>
);

/* ───── 메인 화면 ───── */

const ScreenMyPage = () => {
  const router = useRouter();

  // 서버에서 프로필 데이터 가져오기
  const { data: profileResponse, isLoading, isError } = useMyProfile();
  const { mutate: updateMyProfileMutate } = useUpdateMyProfile();

  const profile = profileResponse?.data;

  /* --- 로컬 편집 상태 --- */
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [mbtiEI, setMbtiEI] = useState("");
  const [mbtiSN, setMbtiSN] = useState("");
  const [mbtiTF, setMbtiTF] = useState("");
  const [mbtiJP, setMbtiJP] = useState("");
  const [frequency, setFrequency] = useState("");
  const [intro, setIntro] = useState("");
  const [song, setSong] = useState("");
  const [tags, setTags] = useState("");
  const [socialAccountId, setSocialAccountId] = useState("");

  // 프로필 이미지
  const [selectedType, setSelectedType] = useState<"default" | "custom">(
    "default",
  );
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(
    null,
  );

  const availableDefaultProfiles = useMemo(
    () => getDefaultProfilesByGender(profile?.gender),
    [profile?.gender],
  );
  const fallbackProfileId = availableDefaultProfiles[0]?.id || "dog";

  const hasInitialized = useRef(false);

  /* --- 서버 데이터 → 로컬 편집 상태 동기화 --- */
  useEffect(() => {
    if (!profile || hasInitialized.current) return;

    const timeoutId = setTimeout(() => {
      setNickname(profile.nickname || "");
      setGender(profile.gender ? (reverseGenderMap[profile.gender] ?? "") : "");
      if (profile.mbti) {
        setMbtiEI(profile.mbti[0] || "");
        setMbtiSN(profile.mbti[1] || "");
        setMbtiTF(profile.mbti[2] || "");
        setMbtiJP(profile.mbti[3] || "");
      }
      setFrequency(profile.contactFrequency || "");
      setIntro(profile.intro || "");
      setSong(profile.song || "");
      setSocialAccountId(profile.socialAccountId || "");

      if (profile.tags && profile.tags.length > 0) {
        setTags(profile.tags.map((t) => t.tag).join(", "));
      }

      hasInitialized.current = true;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [profile]);

  /* --- 파생 표시값 --- */
  const mbtiStr = `${mbtiEI}${mbtiSN}${mbtiTF}${mbtiJP}`;
  const birthYear = profile?.birthDate
    ? profile.birthDate.split("-")[0]
    : undefined;
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - Number(birthYear) + 1 : undefined;

  const hobbyDisplay = (() => {
    if (!profile.hobbies || profile.hobbies.length === 0) return "선택 전";
    const hobbies = profile.hobbies as Array<string | { name: string }>;
    const names = hobbies.map((h) => (typeof h === "string" ? h : h.name));
    if (names.length <= 2) return names.join(", ");
    return `${names[0]}, ${names[1]} 외 ${names.length - 2}개`;
  })();

  /* --- 수정하기 제출 --- */
  const handleSubmit = () => {
    const normalizedMBTI = mbtiStr.toUpperCase();
    const mbtiSet = new Set<MBTI>([
      "ISTJ",
      "ISFJ",
      "INFJ",
      "INTJ",
      "ISTP",
      "ISFP",
      "INFP",
      "INTP",
      "ESTP",
      "ESFP",
      "ENFP",
      "ENTP",
      "ESTJ",
      "ESFJ",
      "ENFJ",
      "ENTJ",
    ]);

    const payload = {
      nickname: nickname.trim() || undefined,
      gender: (genderMap[gender] as Gender) || undefined,
      mbti: mbtiSet.has(normalizedMBTI as MBTI)
        ? (normalizedMBTI as MBTI)
        : undefined,
      contactFrequency: (frequency as ContactFrequency) || undefined,
      intro: intro.trim() || undefined,
      song: song.trim() || undefined,
      socialAccountId: socialAccountId.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => ({ tag: t })),
    };

    updateMyProfileMutate(payload, {
      onSuccess: () => {
        alert("프로필이 성공적으로 수정되었습니다.");
      },
      onError: () => {
        alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  /* --- 프로필 이미지 핸들러 --- */
  const handleSelectProfileType = (type: "default" | "custom") => {
    setSelectedType(type);
    if (type === "default") {
      updateProfile({ profileImageFile: undefined });
      setCustomImagePreview(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col pb-32">
      {/* 헤더 */}
      <div className="px-4 py-2">
        <BackButton text="프로필 수정" />
      </div>

      {/* 서브타이틀 */}
      <p className="typo-14-500 px-4 text-center text-[#999999]">
        자신의 프로필을 수정할 수 있어요.
        <br />
        연락처 등은 신중하게 기입 해주세요.
      </p>

      {/* ===== 프로필 이미지 영역 ===== */}
      <section className="mt-6 px-4">
        <ProfileImageSelection
          selected={selectedType}
          onSelect={handleSelectProfileType}
          gender={profile?.gender}
          selectedProfile={profile?.profileImageUrl || fallbackProfileId}
          onProfileSelect={(id) => {
            /* TODO: 프로필 이미지 ID(또는 URL) 업데이트 로직 */
          }}
          customImage={customImagePreview}
          onCustomImageChange={setCustomImagePreview}
          onFileChange={(file) => {
            /* TODO: 파일 업로드 로직 */
          }}
        />
      </section>

      {/* ===== 편집 폼 영역 ===== */}
      <section className="mt-8 flex flex-col gap-8 px-4">
        {/* ── 텍스트 메뉴 행들 ── */}
        <div className="flex flex-col">
          {/* 닉네임 */}
          <div className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">닉네임</span>
            <div className="flex items-center gap-2">
              <span className="typo-16-600 text-[#999999] underline">
                {nickname || "미설정"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const name = generateRandomNickname();
                  setNickname(name);
                }}
                className="text-[#999999]"
              >
                <Shuffle size={16} />
              </button>
            </div>
          </div>

          {/* 나이 */}
          <MenuRow
            label="나이"
            value={
              age ? (
                <span className="flex items-center gap-2">
                  <span>{age}세</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-[#999999]" />
                  <span className="underline">{birthYear}년생</span>
                </span>
              ) : (
                "미설정"
              )
            }
          />

          {/* 학과 */}
          <MenuRow
            label="학과"
            value={profile.major || "미설정"}
            underline
            hasChevron
          />

          {/* 연락처 */}
          <div className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">연락처</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="typo-16-600 text-[#999999]">인스타그램 :</span>
                <input
                  type="text"
                  value={socialAccountId}
                  onChange={(e) => setSocialAccountId(e.target.value)}
                  placeholder="@아이디"
                  className="typo-16-600 w-28 bg-transparent text-[#999999] underline outline-none placeholder:text-[#B3B3B3]"
                />
              </div>
              <ChevronRight className="h-3 w-3 shrink-0 text-[#999999]" />
            </div>
          </div>

          {/* 관심사 */}
          <MenuRow
            label="관심사"
            value={hobbyDisplay}
            hasChevron
            onClick={() => router.push("/hobby-select")}
          />

          {/* ── 성별 ── */}
          <div className="box-border border-b border-[#E5E5E5] py-4">
            <label className="typo-16-600 mb-2 block text-black">성별</label>
            <div className="flex gap-1.5">
              <ProfileButton
                selected={gender === "여자"}
                onClick={() => setGender("여자")}
              >
                여자
              </ProfileButton>
              <ProfileButton
                selected={gender === "남자"}
                onClick={() => setGender("남자")}
              >
                남자
              </ProfileButton>
            </div>
          </div>

          {/* ── MBTI ── */}
          <div className="box-border border-b border-[#E5E5E5] py-4">
            <label className="typo-16-600 mb-4 block text-[#1A1A1A]">
              MBTI
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <ProfileButton
                  selected={mbtiEI === "E"}
                  onClick={() => setMbtiEI("E")}
                >
                  E
                </ProfileButton>
                <ProfileButton
                  selected={mbtiSN === "S"}
                  onClick={() => setMbtiSN("S")}
                >
                  S
                </ProfileButton>
                <ProfileButton
                  selected={mbtiTF === "F"}
                  onClick={() => setMbtiTF("F")}
                >
                  F
                </ProfileButton>
                <ProfileButton
                  selected={mbtiJP === "P"}
                  onClick={() => setMbtiJP("P")}
                >
                  P
                </ProfileButton>
              </div>
              <div className="flex gap-1.5">
                <ProfileButton
                  selected={mbtiEI === "I"}
                  onClick={() => setMbtiEI("I")}
                >
                  I
                </ProfileButton>
                <ProfileButton
                  selected={mbtiSN === "N"}
                  onClick={() => setMbtiSN("N")}
                >
                  N
                </ProfileButton>
                <ProfileButton
                  selected={mbtiTF === "T"}
                  onClick={() => setMbtiTF("T")}
                >
                  T
                </ProfileButton>
                <ProfileButton
                  selected={mbtiJP === "J"}
                  onClick={() => setMbtiJP("J")}
                >
                  J
                </ProfileButton>
              </div>
            </div>
          </div>

          {/* ── 연락빈도 ── */}
          <div className="box-border border-b border-[#E5E5E5] py-4">
            <label className="typo-16-600 mb-4 block text-[#1A1A1A]">
              연락빈도
            </label>
            <div className="flex gap-1.5">
              <ProfileButton
                selected={frequency === "자주"}
                onClick={() => setFrequency("자주")}
              >
                자주
              </ProfileButton>
              <ProfileButton
                selected={frequency === "보통"}
                onClick={() => setFrequency("보통")}
              >
                보통
              </ProfileButton>
              <ProfileButton
                selected={frequency === "적음"}
                onClick={() => setFrequency("적음")}
              >
                적음
              </ProfileButton>
            </div>
          </div>

          {/* 좋아하는 노래 */}
          <div className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">
              좋아하는 노래
            </span>
            <div className="ml-4 flex flex-1 justify-end">
              <input
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="아티스트 - 제목"
                className="typo-16-600 w-full bg-transparent text-right text-[#999999] underline outline-none placeholder:text-[#B3B3B3]"
              />
            </div>
          </div>

          {/* 내 장점 */}
          <div className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">내 장점</span>
            <div className="ml-4 flex flex-1 items-center justify-end gap-2">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="쉼표로 구분 (예: 유머, 다정함)"
                className="typo-16-600 w-full bg-transparent text-right text-[#999999] outline-none placeholder:text-[#B3B3B3]"
              />
              <ChevronRight className="h-3 w-3 shrink-0 text-[#999999]" />
            </div>
          </div>

          {/* 자기소개 */}
          <div className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">
              자기소개
            </span>
            <div className="ml-4 flex flex-1 justify-end">
              <input
                type="text"
                value={intro}
                onChange={(e) => {
                  if (e.target.value.length <= INTRO_MAX_LENGTH) {
                    setIntro(e.target.value);
                  }
                }}
                placeholder="한 줄 자기소개"
                className="typo-16-600 w-full bg-transparent text-right text-[#999999] underline outline-none placeholder:text-[#B3B3B3]"
              />
            </div>
          </div>
        </div>

        {/* ── 탈퇴하기 ── */}
        <button
          type="button"
          className="typo-16-500 self-center text-[#B3B3B3] underline"
          onClick={() => {
            if (confirm("정말 탈퇴하시겠습니까?")) {
              // TODO: 탈퇴 API 호출
            }
          }}
        >
          탈퇴하기
        </button>
      </section>

      {/* ===== 하단 수정하기 버튼 ===== */}
      <Button fixed bottom={40} sideGap={16} safeArea onClick={handleSubmit}>
        수정하기
      </Button>
    </main>
  );
};

export default ScreenMyPage;
