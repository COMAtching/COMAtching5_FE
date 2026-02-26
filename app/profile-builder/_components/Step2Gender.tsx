"use client";

import React, { useState } from "react";
import ProfileButton from "./ProfileButton";

// GenderButton 컴포넌트 제거

interface Step2GenderProps {
  onGenderSelect: (gender: string) => void;
  defaultValue?: string;
}

export default function Step2Gender({
  onGenderSelect,
  defaultValue,
}: Step2GenderProps) {
  const [selected, setSelected] = useState(defaultValue || "");

  const handleSelect = (gender: string) => {
    setSelected(gender);
    onGenderSelect(gender);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="typo-16-600 text-black">성별</label>
        <div className="flex gap-1.5">
          <ProfileButton
            onClick={() => handleSelect("남자")}
            selected={selected === "남자"}
          >
            남자
          </ProfileButton>
          <ProfileButton
            onClick={() => handleSelect("여자")}
            selected={selected === "여자"}
          >
            여자
          </ProfileButton>
        </div>
      </div>
      <input type="hidden" name="gender" value={selected} />
    </div>
  );
}
