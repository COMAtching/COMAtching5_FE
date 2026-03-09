"use client";
import React, { useState } from "react";
import ProfileImageSelection from "./ProfileImageSelection";
import NicknameSection from "./NicknameSection";

const ScreenProfileImage = () => {
  const [selected, setSelected] = useState<"default" | "custom">("default");
  const [nickname, setNickname] = useState("");

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden px-4 pb-[120px]">
      <h1 className="typo-20-600 mt-3 mb-9 text-black">프로필 설정</h1>

      <ProfileImageSelection selected={selected} onSelect={setSelected} />

      <NicknameSection nickname={nickname} onNicknameChange={setNickname} />
    </main>
  );
};

export default ScreenProfileImage;
