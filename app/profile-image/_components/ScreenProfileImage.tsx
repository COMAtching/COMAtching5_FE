"use client";
import React, { useState } from "react";
import ProfileImageSelection from "./ProfileImageSelection";
import NicknameSection from "./NicknameSection";
import IntroSection from "./IntroSection";
import Image from "next/image";
import Button from "@/components/ui/Button";
import TermsDrawer from "./TermsDrawer";
import { useProfile } from "@/providers/profile-provider";
import { generateRandomNickname } from "@/lib/utils/nickname";

const ScreenProfileImage = () => {
  const { profile, updateProfile } = useProfile();

  // local preview states (not as critical to persist, but good for UX)
  const [selectedType, setSelectedType] = useState<"default" | "custom">(
    "default",
  );
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(
    null,
  );

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
        selectedProfile={profile.profileImageUrl || "bear"}
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
