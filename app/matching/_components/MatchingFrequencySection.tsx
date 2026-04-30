"use client";

import React from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingFrequencySectionProps {
  onFrequencySelect: (frequency: string) => void;
  selected: string;
}

const OPTIONS = ["자주", "보통", "적음"];

export default function MatchingFrequencySection({
  onFrequencySelect,
  selected,
}: MatchingFrequencySectionProps) {
  const handleSelect = (frequency: string) => {
    onFrequencySelect(frequency);
  };

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="typo-20-700 text-color-text-black">연락빈도</h2>
          <p className="typo-14-500 text-color-text-caption3">
            상대방의 연락빈도를 골라주세요.
          </p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {OPTIONS.map((option) => (
          <ProfileButton
            key={option}
            selected={selected === option}
            onClick={() => handleSelect(option)}
          >
            {option}
          </ProfileButton>
        ))}
      </div>
    </div>
  );
}
