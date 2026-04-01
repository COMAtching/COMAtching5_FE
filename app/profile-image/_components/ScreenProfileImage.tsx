"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProfileImageSelection from "./ProfileImageSelection";
import NicknameSection from "./NicknameSection";
import IntroSection from "./IntroSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TermsDrawer from "./TermsDrawer";
import { useProfile } from "@/stores/profile-store";
import { generateRandomNickname } from "@/lib/utils/nickname";
import { getDefaultProfilesByGender } from "../_constants/defaultProfiles";

const ScreenProfileImage = () => {
  const router = useRouter();
  const { profile, updateProfile, isReady } = useProfile();

  // local preview states (not as critical to persist, but good for UX)
  const [selectedType, setSelectedType] = useState<"default" | "custom">(
    "default",
  );
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(
    null,
  );

  const availableDefaultProfiles = useMemo(
    () => getDefaultProfilesByGender(profile.gender),
    [profile.gender],
  );
  const fallbackProfileId = availableDefaultProfiles[0]?.id || "dog";

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!profile.gender) {
      alert("성별을 선택해주세요");
      router.replace("/profile-builder");
    }
  }, [isReady, profile.gender, router]);

  // 저장된 profileImageUrl 유효성 확인: 없으면 기본값으로 설정
  useEffect(() => {
    const selectedProfileId = profile.profileImageUrl;
    if (selectedProfileId) {
      // 이미 선택된 값이 있으면 (성별 변경해도 같은 동물id로 자동 전환)
      return;
    }

    // 저장값이 없으면 기본 첫 번째 프로필로 설정
    updateProfile({ profileImageUrl: fallbackProfileId });
  }, [fallbackProfileId, profile.profileImageUrl, updateProfile]);

  const handleNicknameChange = (val: string) =>
    updateProfile({ nickname: val });
  const handleRandomNickname = () => {
    const randomName = generateRandomNickname();
    updateProfile({ nickname: randomName });
  };
  const handleIntroChange = (val: string) => updateProfile({ intro: val });

  const handleSelectProfileType = (type: "default" | "custom") => {
    setSelectedType(type);
    if (type === "default") {
      updateProfile({ profileImageFile: undefined });
      setCustomImagePreview(null);
    }
  };

  const isReadyToStart =
    (profile.nickname?.trim().length ?? 0) > 0 &&
    (profile.intro?.trim().length ?? 0) > 0;

  return (
    <main className="relative flex h-screen flex-col px-4 pb-15">
      <h1 className="typo-20-600 mt-3 mb-[26px] text-center text-black">
        프로필 설정
      </h1>

      <ProfileImageSelection
        selected={selectedType}
        onSelect={handleSelectProfileType}
        gender={profile.gender}
        selectedProfile={profile.profileImageUrl || fallbackProfileId}
        onProfileSelect={(id) => updateProfile({ profileImageUrl: id })}
        customImage={customImagePreview}
        onCustomImageChange={setCustomImagePreview}
        onFileChange={(file) => updateProfile({ profileImageFile: file })}
      />

      <NicknameSection
        nickname={profile.nickname || ""}
        onNicknameChange={handleNicknameChange}
        onRandomClick={handleRandomNickname}
      />
      <IntroSection
        intro={profile.intro || ""}
        onIntroChange={handleIntroChange}
      />
      <footer className="mt-auto flex flex-col items-center justify-center">
        <Image
          src="/profile/bubble-.svg"
          alt="모든 정보가 맞나요? 이제 시작해요!"
          width={270}
          height={50}
          priority
        />
        <TermsDrawer>
          <Button shadow={true} disabled={!isReadyToStart}>
            코매칭 시작하기
          </Button>
        </TermsDrawer>
      </footer>
    </main>
  );
};

export default ScreenProfileImage;
