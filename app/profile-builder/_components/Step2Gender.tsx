"use client";

import React, { useState } from "react";

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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSelect("남자")}
            className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
              selected === "남자"
                ? "bg-[#FF69B4] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            남자
          </button>
          <button
            type="button"
            onClick={() => handleSelect("여자")}
            className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
              selected === "여자"
                ? "bg-[#FF69B4] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            여자
          </button>
        </div>
      </div>
      <input type="hidden" name="gender" value={selected} />
    </div>
  );
}
