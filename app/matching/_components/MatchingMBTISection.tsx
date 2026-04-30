"use client";

import React from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingMBTISectionProps {
  onMBTISelect: (mbti: string) => void;
  selected: string;
}

const OPPOSITES: Record<string, string> = {
  E: "I",
  I: "E",
  S: "N",
  N: "S",
  T: "F",
  F: "T",
  J: "P",
  P: "J",
};

const ROWS = [
  ["E", "S", "F", "P"],
  ["I", "N", "T", "J"],
];

export default function MatchingMBTISection({
  onMBTISelect,
  selected,
}: MatchingMBTISectionProps) {
  const selectedChars = selected.split("").filter(Boolean);

  const handleSelect = (char: string) => {
    const newSelection = [...selectedChars];
    const index = newSelection.indexOf(char);

    if (index > -1) {
      // 이미 선택된 경우 해제
      newSelection.splice(index, 1);
    } else {
      // 2개 미만인 경우에만 새로 선택 가능
      if (newSelection.length < 2) {
        const oppositeChar = OPPOSITES[char];
        const oppositeIndex = newSelection.indexOf(oppositeChar);

        if (oppositeIndex > -1) {
          // 반대 성향(예: E인데 I가 선택된 경우)은 교체
          newSelection[oppositeIndex] = char;
        } else {
          newSelection.push(char);
        }
      } else {
        // 이미 2개가 선택된 상태에서 새로운(교체 대상도 아닌) MBTI를 누른 경우
        const oppositeChar = OPPOSITES[char];
        const oppositeIndex = newSelection.indexOf(oppositeChar);

        if (oppositeIndex > -1) {
          // 이미 2개여도 반대 성향 교체는 허용
          newSelection[oppositeIndex] = char;
        } else {
          alert("MBTI는 2개만 선택할 수 있어요!");
        }
      }
    }

    onMBTISelect(newSelection.join(""));
  };

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="typo-20-700 text-color-text-black">MBTI</h2>
          <p className="typo-14-500 text-color-text-caption3">
            상대방의 MBTI를 2개 골라주세요.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((char) => (
              <ProfileButton
                key={char}
                selected={selectedChars.includes(char)}
                onClick={() => handleSelect(char)}
              >
                {char}
              </ProfileButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
