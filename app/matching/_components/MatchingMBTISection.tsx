"use client";

import React from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingMBTISectionProps {
  onMBTISelect: (mbti: string) => void;
  defaultValue?: string;
}

export default function MatchingMBTISection({
  onMBTISelect,
  defaultValue = "",
}: MatchingMBTISectionProps) {
  // 온보딩 MBTI와 느낌을 맞추기 위해 내부 상태(useState) 사용
  const [selected, setSelected] = React.useState<string[]>(
    defaultValue.split("").filter(Boolean),
  );

  const opposites: Record<string, string> = {
    E: "I",
    I: "E",
    S: "N",
    N: "S",
    T: "F",
    F: "T",
    J: "P",
    P: "J",
  };

  const handleSelect = (char: string) => {
    const newSelection = [...selected];
    const index = newSelection.indexOf(char);

    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      const oppositeChar = opposites[char];
      const oppositeIndex = newSelection.indexOf(oppositeChar);

      if (oppositeIndex > -1) {
        newSelection[oppositeIndex] = char;
      } else {
        if (newSelection.length >= 2) {
          newSelection.shift();
        }
        newSelection.push(char);
      }
    }

    setSelected(newSelection);
    onMBTISelect(newSelection.join(""));
  };

  const rows = [
    ["E", "S", "F", "P"],
    ["I", "N", "T", "J"],
  ];

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex flex-col gap-1">
        <h2 className="typo-20-700 text-color-text-black">MBTI</h2>
        <p className="typo-14-500 text-color-text-caption3">
          상대방의 MBTI를 2개 골라주세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((char) => (
              <ProfileButton
                key={char}
                selected={selected.includes(char)}
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
