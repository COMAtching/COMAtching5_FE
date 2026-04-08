"use client";

import React, { useState } from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingFrequencySectionProps {
  onFrequencySelect: (frequency: string) => void;
  defaultValue?: string;
}

export default function MatchingFrequencySection({
  onFrequencySelect,
  defaultValue,
}: MatchingFrequencySectionProps) {
  const [selected, setSelected] = useState(defaultValue || "");

  const handleSelect = (frequency: string) => {
    setSelected(frequency);
    onFrequencySelect(frequency);
  };

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex flex-col gap-1">
        <label className="typo-20-700 text-color-text-black">연락빈도</label>
        <p className="typo-14-500 text-color-text-caption3">
          상대방의 연락빈도를 골라주세요.
        </p>
      </div>
      <div className="flex gap-1.5">
        <ProfileButton
          selected={selected === "자주"}
          onClick={() => handleSelect("자주")}
        >
          자주
        </ProfileButton>
        <ProfileButton
          selected={selected === "보통"}
          onClick={() => handleSelect("보통")}
        >
          보통
        </ProfileButton>
        <ProfileButton
          selected={selected === "적음"}
          onClick={() => handleSelect("적음")}
        >
          적음
        </ProfileButton>
      </div>
    </div>
  );
}
