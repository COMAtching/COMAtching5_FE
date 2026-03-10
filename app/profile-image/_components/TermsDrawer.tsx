"use client";
import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { SelectCheckButton } from "./ProfileImageSelection";
import ProfileBottomSheet from "./ProfileBottomSheet";
import { TERMS_TEXT, PRIVACY_TEXT } from "../_constants/terms";
import { Hobby, ProfileSubmitData } from "@/lib/types/profile";
import { useProfile } from "@/providers/profile-provider";
import { useImageUpload, useProfileSignUp } from "@/hooks/useProfileSignUp";
import { useRouter } from "next/navigation";
import { HOBBIES, HobbyCategory } from "@/lib/constants/hobbies";

interface TermsDrawerProps {
  children?: React.ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  }>;
}

type ViewMode = "list" | "terms" | "privacy";

const DEFAULT_PROFILE_IDS = new Set([
  "dog",
  "cat",
  "dinosaur",
  "otter",
  "bear",
  "fox",
  "penguin",
  "wolf",
  "rabbit",
  "snake",
  "horse",
  "frog",
]);

const toDefaultProfileImageKey = (profileId?: string) => {
  const rawId = profileId || "bear";
  if (rawId.startsWith("default_")) return rawId;
  return DEFAULT_PROFILE_IDS.has(rawId) ? `default_${rawId}` : rawId;
};

const TermsDrawer = ({ children }: TermsDrawerProps) => {
  const router = useRouter();
  const { profile, clearProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  const { mutateAsync: uploadImage } = useImageUpload();
  const { mutate: signUp, isPending: isSubmitting } = useProfileSignUp();

  const checkGradient =
    "linear-gradient(220.53deg, #FF775E -18.87%, #FF4D61 62.05%, #E83ABC 125.76%)";

  const allAgreed = agreements.terms && agreements.privacy;

  const handleToggle = (key: "terms" | "privacy") => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    if (viewMode !== "list") {
      setViewMode("list");
    } else {
      setIsOpen(false);
    }
  };

  /**
   * 취미 및 장점 매핑 로직
   */
  const mapHobbies = (hobbies: (string | Hobby)[]) => {
    const categoryMap: Record<string, string> = {
      스포츠: "SPORTS",
      문화예술: "CULTURE",
      음악: "MUSIC",
      여행: "TRAVEL",
      "일상/공부": "DAILY",
      게임: "GAME",
    };

    return hobbies.map((h) => {
      const isObject = typeof h === "object" && h !== null;
      const hobbyName = isObject ? h.name : h;
      let hobbyCategoryKr: string | undefined = isObject
        ? h.category
        : undefined;

      if (!hobbyCategoryKr) {
        // 카테고리가 없으면 ALL_HOBBIES에서 찾음
        hobbyCategoryKr = (Object.keys(HOBBIES) as HobbyCategory[]).find(
          (cat) => (HOBBIES[cat] as readonly string[]).includes(hobbyName),
        );
      }

      // 이모지 제거 (정규식 사용)
      const nameWithoutEmoji = hobbyName
        .replace(
          /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]|\uD83D[\uDE00-\uDE4F]|\uD83E[\uDD00-\uDDFF]/g,
          "",
        )
        .trim();

      return {
        category: categoryMap[hobbyCategoryKr || ""] || "DAILY",
        name: nameWithoutEmoji,
      };
    });
  };

  const handleComplete = async () => {
    if (!allAgreed || isSubmitting) return;

    try {
      let finalImageUrl = toDefaultProfileImageKey(profile.profileImageUrl);

      // 1. 커스텀 이미지가 있으면 먼저 업로드 (Key 획득)
      if (profile.profileImageFile) {
        finalImageUrl = await uploadImage(profile.profileImageFile);
      }

      // 2. 최종 데이터 객체 생성 (백엔드 양식 준수)
      const submitData: ProfileSubmitData = {
        nickname: profile.nickname || "",
        gender: profile.gender || "MALE",
        birthDate: profile.birthDate || "",
        mbti: profile.mbti || "ISTJ",
        intro: profile.intro || "",
        profileImageUrl: finalImageUrl || profile.profileImageUrl || "",
        socialType: profile.socialType || null,
        socialAccountId: profile.socialAccountId || null,
        university: profile.university || "가톨릭대학교",
        major: profile.major || "",
        contactFrequency: profile.contactFrequency || "NORMAL",
        hobbies: mapHobbies(profile.hobbies || []),
        intros: profile.intros || [],
        advantages:
          profile.advantages && profile.advantages.length > 0
            ? profile.advantages
            : null,
        favoriteSong: profile.favoriteSong || null,
      };

      // 3. 백엔드로 전송
      signUp(submitData, {
        onSuccess: () => {
          setIsOpen(false);
          clearProfile();
          router.push("/main"); // 가입 완료 페이지로 이동
        },
        onError: (error) => {
          console.error("Signup failed:", error);
          alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
        },
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const trigger = children
    ? React.cloneElement(children, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(e);
          setIsOpen(true);
        },
      })
    : null;

  const agreementsList = [
    { key: "terms" as const, label: "이용약관 동의" },
    { key: "privacy" as const, label: "개인정보 수집 이용 동의" },
  ];

  const renderContent = () => {
    if (viewMode === "terms") {
      return (
        <div className="typo-14-500 leading-[1.6] whitespace-pre-wrap text-black">
          {TERMS_TEXT}
        </div>
      );
    }
    if (viewMode === "privacy") {
      return (
        <div className="typo-14-500 leading-[1.6] whitespace-pre-wrap text-black">
          {PRIVACY_TEXT}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 pb-4">
        {agreementsList.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <SelectCheckButton
              label={label}
              isSelected={agreements[key]}
              onClick={() => handleToggle(key)}
              gradient={checkGradient}
              marginClassName=""
            />
            <span className="typo-16-700 flex flex-1 items-center gap-2 text-black">
              {label}
              <span className="typo-12-700 text-gray-400">필수</span>
            </span>
            <button type="button" onClick={() => setViewMode(key)}>
              <ChevronRight
                size={20}
                className="cursor-pointer text-gray-400"
              />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const currentTitle =
    viewMode === "list"
      ? "약관에 동의해주세요"
      : viewMode === "terms"
        ? "이용약관"
        : "개인정보 처리방침";

  const currentDescription =
    viewMode === "list"
      ? "여러분의 소중한 개인정보를 잘 지켜 드릴게요"
      : undefined;

  return (
    <>
      {trigger}

      <ProfileBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={
          <div className="flex items-center gap-2">
            {viewMode !== "list" && (
              <button onClick={() => setViewMode("list")} className="mr-1">
                <ArrowLeft size={20} className="text-black" />
              </button>
            )}
            {currentTitle}
          </div>
        }
        description={currentDescription}
        footer={
          viewMode === "list" ? (
            <Button
              type="button"
              className="bg-button-primary text-button-primary-text-default"
              style={
                !allAgreed
                  ? {
                      background: "#1A1A1A",
                      border: "0.8px solid rgba(255, 255, 255, 0.3)",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                    }
                  : undefined
              }
              onClick={handleComplete}
              disabled={!allAgreed}
            >
              모두 동의하고 시작하기
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-button-primary text-button-primary-text-default"
              onClick={() => setViewMode("list")}
            >
              확인
            </Button>
          )
        }
      >
        {renderContent()}
      </ProfileBottomSheet>
    </>
  );
};

export default TermsDrawer;
