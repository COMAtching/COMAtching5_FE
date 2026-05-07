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
import {
  getDefaultProfilesByGender,
  DEFAULT_PROFILE_ASSETS,
} from "@/lib/constants/defaultProfiles";
import type {
  Gender,
  ContactFrequency,
  MBTI,
  Hobby,
} from "@/lib/types/profile";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/useProfile";
import { useImageUpload } from "@/hooks/useProfileSignUp";
import { Loader2 } from "lucide-react";
import HobbyEditDrawer from "./HobbyEditDrawer";
import AdvantageEditDrawer from "./AdvantageEditDrawer";
import FormSelect from "@/components/ui/FormSelect";
import { majorCategories, universities } from "@/lib/constants/majors";
import {
  getDepartmentOptions,
  getMajorOptions,
  getUniversityOptions,
} from "@/app/profile-builder/_lib/options";
import Image from "next/image";
import { getContactFrequencyLabel } from "@/lib/utils/profile";

/* ───── 상수 맵핑 ───── */

const genderMap: Record<string, Gender> = { 남자: "MALE", 여자: "FEMALE" };
const reverseGenderMap: Record<string, string> = {
  MALE: "남자",
  FEMALE: "여자",
};

const frequencyMap: Record<string, ContactFrequency> = {
  자주: "FREQUENT",
  보통: "NORMAL",
  적음: "RARE",
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

interface ScreenMyPageProps {
  initialProfile: ProfileData;
}

const ScreenMyPage = ({ initialProfile }: ScreenMyPageProps) => {
  const router = useRouter();

  // 서버에서 프로필 데이터 가져오기
  const { data: profileResponse, isLoading, isError } = useMyProfile();
  const { mutate: updateMyProfileMutate } = useUpdateMyProfile();

  const profile = profileResponse?.data;

  /* --- 로컬 편집 상태 (initialProfile로 즉시 초기화) --- */
  const [nickname, setNickname] = useState(initialProfile.nickname || "");
  const [gender, setGender] = useState(
    initialProfile.gender
      ? (reverseGenderMap[initialProfile.gender] ?? initialProfile.gender)
      : "",
  );
  const [mbtiEI, setMbtiEI] = useState(initialProfile.mbti?.[0] || "");
  const [mbtiSN, setMbtiSN] = useState(initialProfile.mbti?.[1] || "");
  const [mbtiTF, setMbtiTF] = useState(initialProfile.mbti?.[2] || "");
  const [mbtiJP, setMbtiJP] = useState(initialProfile.mbti?.[3] || "");
  const [frequency, setFrequency] = useState(
    getContactFrequencyLabel(initialProfile.contactFrequency) || "",
  );
  const [intro, setIntro] = useState(initialProfile.intro || "");
  const [song, setSong] = useState(initialProfile.song || "");
  const [tags, setTags] = useState<string[]>(
    initialProfile.tags?.map((t) => t.tag) || [],
  );
  const [socialAccountId, setSocialAccountId] = useState(
    initialProfile.socialType === "INSTAGRAM"
      ? initialProfile.socialAccountId || ""
      : "",
  );
  const [kakaoId, setKakaoId] = useState(
    initialProfile.socialType === "KAKAO"
      ? initialProfile.socialAccountId || ""
      : "",
  );
  const [socialType, setSocialType] = useState<"INSTAGRAM" | "KAKAO">(
    initialProfile.socialType || "INSTAGRAM",
  );
  const [editableBirthYear, setEditableBirthYear] = useState(
    initialProfile.birthDate ? initialProfile.birthDate.split("-")[0] : "",
  );
  const [university, setUniversity] = useState(initialProfile.university || "");
  const [major, setMajor] = useState(initialProfile.major || "");

  const initialDepartment = useMemo(() => {
    if (initialProfile.department) return initialProfile.department;
    if (!initialProfile.university || !initialProfile.major) return "";
    const uniObj = majorCategories.find(
      (c) => c.label === initialProfile.university,
    );
    if (!uniObj) return "";
    const deptObj = uniObj.departments.find((d) =>
      d.majors.includes(initialProfile.major as string),
    );
    return deptObj ? deptObj.label : "";
  }, [
    initialProfile.university,
    initialProfile.department,
    initialProfile.major,
  ]);

  const [department, setDepartment] = useState(initialDepartment);
  const [hobbies, setHobbies] = useState<Hobby[]>(
    (initialProfile.hobbies as Hobby[]) || [],
  );

  // 모달 상태
  const [isHobbyDrawerOpen, setIsHobbyDrawerOpen] = useState(false);
  const [isAdvantageDrawerOpen, setIsAdvantageDrawerOpen] = useState(false);

  const availableDefaultProfiles = useMemo(
    () => getDefaultProfilesByGender(initialProfile.gender),
    [initialProfile.gender],
  );
  const fallbackProfileId = availableDefaultProfiles[0]?.id || "dog";

  const getProfileIdFromUrl = (url: string | undefined): string => {
    if (!url) return fallbackProfileId;
    const cleanUrl = url.replace("default_", "");
    // url이 이미 "rabbit" 이거나, "https://.../rabbit_male%201.png" 일 때 대응
    const asset = DEFAULT_PROFILE_ASSETS.find(
      (p) => cleanUrl.includes(p.id) || cleanUrl.includes(p.id.toLowerCase()),
    );
    return asset ? asset.id : fallbackProfileId;
  };

  // 프로필 이미지
  const [selectedType, setSelectedType] = useState<"default" | "custom">(
    "default",
  );
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(
    null,
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() =>
    getProfileIdFromUrl(initialProfile.profileImageUrl),
  );
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>(
    undefined,
  );

  /* --- 파생 표시값 --- */
  const mbtiStr = `${mbtiEI}${mbtiSN}${mbtiTF}${mbtiJP}`;

  const hobbyDisplay = (() => {
    if (!hobbies || hobbies.length === 0) return "선택 전";
    const names = hobbies.map((h) => (typeof h === "string" ? h : h.name));
    if (names.length <= 2) return names.join(", ");
    return `${names[0]}, ${names[1]} 외 ${names.length - 2}개`;
  })();

  const tagDisplay = (() => {
    if (!tags || tags.length === 0) return "선택 전";
    if (tags.length <= 2) return tags.join(", ");
    return `${tags[0]}, ${tags[1]} 외 ${tags.length - 2}개`;
  })();

  const birthYear = initialProfile.birthDate
    ? initialProfile.birthDate.split("-")[0]
    : undefined;
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - Number(birthYear) + 1 : undefined;

  const { mutateAsync: uploadImage } = useImageUpload();

  /* --- 수정하기 제출 --- */
  const handleSubmit = async () => {
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

    // 연락처 포맷팅 (인스타그램인 경우 @ 추가)
    let formattedSocialId = (
      socialType === "INSTAGRAM" ? socialAccountId : kakaoId
    ).trim();
    if (
      socialType === "INSTAGRAM" &&
      formattedSocialId &&
      !formattedSocialId.startsWith("@")
    ) {
      formattedSocialId = `@${formattedSocialId}`;
    }

    try {
      let finalImageUrl: string;

      if (profileImageFile) {
        finalImageUrl = await uploadImage(profileImageFile);
      } else if (profileImageUrl && !profileImageUrl.startsWith("default_")) {
        finalImageUrl = `default_${profileImageUrl}`;
      } else {
        finalImageUrl = profileImageUrl || "default";
      }

      const payload = {
        nickname: nickname.trim() || undefined,
        gender: (genderMap[gender] as Gender) || undefined,
        mbti: mbtiSet.has(normalizedMBTI as MBTI)
          ? (normalizedMBTI as MBTI)
          : undefined,
        contactFrequency: frequencyMap[frequency] || undefined,
        intro: intro.trim() || undefined,
        song: song.trim() || undefined,
        socialType: socialType,
        socialAccountId: formattedSocialId || undefined,
        major: major.trim() || undefined,
        birthDate: editableBirthYear ? `${editableBirthYear}-01-01` : undefined,
        hobbies: hobbies,
        tags: tags.filter(Boolean).map((t) => ({ tag: t })),
        profileImageKey: finalImageUrl || "default",
        isMatchable: true,
      };

      updateMyProfileMutate(payload, {
        onSuccess: () => {
          alert("프로필이 성공적으로 수정되었습니다.");
        },
        onError: () => {
          alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
        },
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /* --- 프로필 이미지 핸들러 --- */
  const handleSelectProfileType = (type: "default" | "custom") => {
    setSelectedType(type);
    if (type === "default") {
      setProfileImageFile(undefined);
      setCustomImagePreview(null);
    }
  };

  const hasChanged = (() => {
    const normalizedMBTI = mbtiStr.toUpperCase();
    const serverMBTI = initialProfile.mbti || "";
    const serverGender = initialProfile.gender === "MALE" ? "남자" : "여자";
    const serverTags = JSON.stringify(
      (initialProfile.tags || []).map((t) => t.tag).sort(),
    );
    const currentTagsStr = JSON.stringify([...tags].sort());
    const serverHobbies = JSON.stringify(initialProfile.hobbies || []);
    const currentHobbies = JSON.stringify(hobbies);
    const serverBirthYear = initialProfile.birthDate
      ? initialProfile.birthDate.split("-")[0]
      : "";
    const currentSocialId =
      socialType === "INSTAGRAM" ? socialAccountId : kakaoId;

    return (
      nickname !== (initialProfile.nickname || "") ||
      gender !== serverGender ||
      normalizedMBTI !== serverMBTI ||
      frequency !==
        (getContactFrequencyLabel(initialProfile.contactFrequency) || "") ||
      intro !== (initialProfile.intro || "") ||
      song !== (initialProfile.song || "") ||
      currentSocialId !== (initialProfile.socialAccountId || "") ||
      socialType !== (initialProfile.socialType || "INSTAGRAM") ||
      university !== (initialProfile.university || "") ||
      department !== (initialProfile.department || "") ||
      major !== (initialProfile.major || "") ||
      editableBirthYear !== serverBirthYear ||
      serverTags !== currentTagsStr ||
      serverHobbies !== currentHobbies ||
      profileImageUrl !== getProfileIdFromUrl(initialProfile.profileImageUrl) ||
      profileImageFile !== undefined
    );
  })();

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
          selectedProfile={profileImageUrl}
          onProfileSelect={(id) => {
            setProfileImageUrl(id);
          }}
          customImage={customImagePreview}
          onCustomImageChange={setCustomImagePreview}
          onFileChange={(file) => {
            setProfileImageFile(file);
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
          <div className="box-border flex w-full items-center border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">나이</span>
            <div className="ml-auto flex items-center gap-1">
              <input
                type="text"
                maxLength={4}
                value={editableBirthYear}
                onChange={(e) => setEditableBirthYear(e.target.value.trim())}
                placeholder="출생연도"
                className="typo-16-600 w-[64px] bg-transparent text-right text-[#999999] underline outline-none placeholder:text-[#B3B3B3]"
              />
              {editableBirthYear && (
                <span className="typo-16-600 text-[#999999]">년생</span>
              )}
            </div>
          </div>

          {/* 학과 */}
          <div className="box-border border-b border-[#E5E5E5] py-4">
            <label className="typo-16-600 mb-4 block text-[#1A1A1A]">
              학과
            </label>
            <div className="flex flex-col gap-3">
              <FormSelect
                id="university"
                name="university"
                options={getUniversityOptions(universities)}
                placeholder="학교 선택"
                value={university}
                onChange={(e) => {
                  setUniversity(e.target.value);
                  setDepartment("");
                  setMajor("");
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  id="department"
                  name="department"
                  options={getDepartmentOptions(university, majorCategories)}
                  placeholder="계열"
                  value={department}
                  disabled={!university}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setMajor("");
                  }}
                />
                <FormSelect
                  id="major"
                  name="major"
                  options={getMajorOptions(
                    university,
                    department,
                    majorCategories,
                  )}
                  placeholder="전공"
                  value={major}
                  disabled={!department}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 연락처 */}
          <div className="box-border flex w-full items-center border-b border-[#E5E5E5] py-6">
            <span className="typo-16-600 shrink-0 text-[#1A1A1A]">연락처</span>
            <div className="ml-auto flex items-center gap-2">
              {/* SNS 타입 토글 아이콘 */}
              <button
                type="button"
                onClick={() => setSocialType("INSTAGRAM")}
                className="flex-shrink-0"
              >
                <Image
                  src={
                    socialType === "INSTAGRAM"
                      ? "/sns/insta-sns.svg"
                      : "/sns/unactive-insta.svg"
                  }
                  alt="인스타그램"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </button>
              <button
                type="button"
                onClick={() => setSocialType("KAKAO")}
                className="flex-shrink-0"
              >
                <Image
                  src={
                    socialType === "KAKAO"
                      ? "/sns/kakao-sns.svg"
                      : "/sns/unactive-kakao.svg"
                  }
                  alt="카카오톡"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </button>
              {/* 아이디 입력 */}
              <input
                type="text"
                value={socialType === "INSTAGRAM" ? socialAccountId : kakaoId}
                onChange={(e) =>
                  socialType === "INSTAGRAM"
                    ? setSocialAccountId(e.target.value.trim())
                    : setKakaoId(e.target.value.trim())
                }
                placeholder="아이디 입력"
                className="typo-16-600 w-[140px] bg-transparent text-right text-[#999999] underline outline-none placeholder:text-[#B3B3B3]"
              />
            </div>
          </div>

          {/* 관심사 */}
          <MenuRow
            label="관심사"
            value={hobbyDisplay}
            hasChevron
            onClick={() => setIsHobbyDrawerOpen(true)}
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
          <MenuRow
            label="내 장점"
            value={tagDisplay}
            hasChevron
            onClick={() => setIsAdvantageDrawerOpen(true)}
          />

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
      <Button
        fixed
        bottom={40}
        sideGap={16}
        safeArea
        onClick={handleSubmit}
        disabled={!hasChanged}
      >
        수정하기
      </Button>

      {/* 관심사 수정 드로어 */}
      <HobbyEditDrawer
        isOpen={isHobbyDrawerOpen}
        onClose={() => setIsHobbyDrawerOpen(false)}
        initialHobbies={hobbies}
        onSave={(updatedHobbies) => setHobbies(updatedHobbies)}
      />

      {/* 장점 수정 드로어 */}
      <AdvantageEditDrawer
        isOpen={isAdvantageDrawerOpen}
        onClose={() => setIsAdvantageDrawerOpen(false)}
        initialTags={tags}
        onSave={(updatedTags) => setTags(updatedTags)}
      />
    </main>
  );
};

export default ScreenMyPage;
