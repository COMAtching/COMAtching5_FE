"use client";

import React, { useState } from "react";
import ProfileButton from "./ProfileButton";
import { getContactFrequencyLabel } from "@/lib/utils/profile";

interface Step4ContactFrequencyProps {
  onFrequencySelect: (frequency: string) => void;
  defaultValue?: string;
}

export default function Step4ContactFrequency({
  onFrequencySelect,
  defaultValue,
}: Step4ContactFrequencyProps) {
  const [selected, setSelected] = useState(
    getContactFrequencyLabel(defaultValue) || "",
  );

  const handleSelect = (frequency: string) => {
    setSelected(frequency);
    onFrequencySelect(frequency);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="typo-16-600 text-color-text-black">연락빈도</label>
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
      <input type="hidden" name="contactFrequency" value={selected} />
    </div>
  );
}
