"use client";

import React, { useState } from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingAgeSectionProps {
  onAgeGroupSelect: (ageGroup: string) => void;
  defaultValue?: string;
}

export default function MatchingAgeSection({
  onAgeGroupSelect,
  defaultValue,
}: MatchingAgeSectionProps) {
  const [selected, setSelected] = useState(defaultValue || "");
  const ageGroups = ["연하", "동갑", "연상"];

  const handleSelect = (group: string) => {
    setSelected(group);
    onAgeGroupSelect(group);
  };

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex flex-col gap-1">
        <label className="typo-20-700 text-color-text-black">나이</label>
        <p className="typo-14-500 text-color-text-caption3">
          상대의 나이를 골라주세요.
        </p>
      </div>
      <div className="flex gap-1.5">
        {ageGroups.map((group) => (
          <ProfileButton
            key={group}
            selected={selected === group}
            onClick={() => handleSelect(group)}
          >
            {group}
          </ProfileButton>
        ))}
      </div>
    </div>
  );
}
