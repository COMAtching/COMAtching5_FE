"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface MatchingHobbySectionProps {
  onHobbyClick?: () => void;
  selectedHobbies?: string[];
}

export default function MatchingHobbySection({
  onHobbyClick,
  selectedHobbies = [],
}: MatchingHobbySectionProps) {
  return (
    <button
      className="border-color-gray-100 flex w-full flex-col gap-4 border-b pb-5 text-left"
      onClick={onHobbyClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="typo-20-700 text-color-text-black">관심사</h2>
          <p className="typo-14-500 text-color-text-caption3">
            상대방이 가졌음 하는 관심사를 골라주세요.
          </p>
        </div>
        <ChevronRight className="text-color-text-caption3 h-6 w-6" />
      </div>

      {/* 선택된 관심사들이 있다면 여기에 표시 (추후 구현 가능) */}
      {selectedHobbies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedHobbies.map((hobby) => (
            <span
              key={hobby}
              className="typo-14-500 bg-color-gray-50 text-color-gray-800 rounded-full px-3 py-1"
            >
              {hobby}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
