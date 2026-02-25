"use client";

import React, { useState } from "react";

interface Step4ContactFrequencyProps {
  onFrequencySelect: (frequency: string) => void;
  defaultValue?: string;
}

export default function Step4ContactFrequency({
  onFrequencySelect,
  defaultValue,
}: Step4ContactFrequencyProps) {
  const [selected, setSelected] = useState(defaultValue || "");

  const handleSelect = (frequency: string) => {
    setSelected(frequency);
    onFrequencySelect(frequency);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="typo-16-600 text-black">연락빈도</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSelect("자주")}
            className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
              selected === "자주"
                ? "bg-[#FF69B4] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            자주
          </button>
          <button
            type="button"
            onClick={() => handleSelect("보통")}
            className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
              selected === "보통"
                ? "bg-[#FF69B4] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            보통
          </button>
          <button
            type="button"
            onClick={() => handleSelect("적음")}
            className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
              selected === "적음"
                ? "bg-[#FF69B4] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            적음
          </button>
        </div>
      </div>
      <input type="hidden" name="contactFrequency" value={selected} />
    </div>
  );
}
