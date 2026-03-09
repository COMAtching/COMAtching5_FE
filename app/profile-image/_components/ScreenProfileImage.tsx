"use client";
import React, { useState } from "react";
import ProfileImageSelection from "./ProfileImageSelection";
import NicknameSection from "./NicknameSection";
import IntroSection from "./IntroSection";
import BubbleDiv from "@/app/_components/BubbleDiv";
import Button from "@/components/ui/Button";
import TermsDrawer from "./TermsDrawer";

const ScreenProfileImage = () => {
  const [selected, setSelected] = useState<"default" | "custom">("default");
  const [selectedProfile, setSelectedProfile] = useState("bear");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const isReadyToStart = nickname.trim().length > 0 && intro.trim().length > 0;

  return (
    <main className="relative flex h-screen flex-col px-4 pb-15">
      <h1 className="typo-20-600 mt-3 mb-[26px] text-center text-black">
        프로필 설정
      </h1>

      <ProfileImageSelection
        selected={selected}
        onSelect={setSelected}
        selectedProfile={selectedProfile}
        onProfileSelect={setSelectedProfile}
        customImage={customImage}
        onCustomImageChange={setCustomImage}
      />

      <NicknameSection nickname={nickname} onNicknameChange={setNickname} />
      <IntroSection intro={intro} onIntroChange={setIntro} />
      <footer className="mt-auto flex flex-col items-center justify-center gap-5">
        <BubbleDiv w={270} h={38} shadow={true} typo="typo-16-500">
          모든 정보가 <span className="text-bubble-text-highight">맞나요?</span>{" "}
          이제 시작해요!
        </BubbleDiv>
        <Button
          shadow={true}
          disabled={!isReadyToStart}
          onClick={() => setTermsOpen(true)}
        >
          코매칭 시작하기
        </Button>
      </footer>

      <TermsDrawer isOpen={termsOpen} onOpenChange={setTermsOpen} />
    </main>
  );
};

export default ScreenProfileImage;
