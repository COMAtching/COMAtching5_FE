"use client";

import React, { useState } from "react";

interface Step3MBTIProps {
  onMBTISelect: (mbti: string) => void;
  defaultValue?: string;
}

interface MBTIButtonProps {
  value: string;
  selected: boolean;
  onClick: () => void;
}

function MBTIButton({ value, selected, onClick }: MBTIButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`typo-16-600 flex-1 rounded-full py-3 transition-colors ${
        selected ? "bg-[#FF69B4] text-white" : "bg-gray-100 text-gray-400"
      }`}
    >
      {value}
    </button>
  );
}

export default function Step3MBTI({
  onMBTISelect,
  defaultValue,
}: Step3MBTIProps) {
  const [ei, setEi] = useState(defaultValue?.[0] || "");
  const [sn, setSn] = useState(defaultValue?.[1] || "");
  const [tf, setTf] = useState(defaultValue?.[2] || "");
  const [jp, setJp] = useState(defaultValue?.[3] || "");

  const handleSelect = (category: "ei" | "sn" | "tf" | "jp", value: string) => {
    if (category === "ei") setEi(value);
    if (category === "sn") setSn(value);
    if (category === "tf") setTf(value);
    if (category === "jp") setJp(value);

    // MBTI 조합 완성 시 콜백 호출
    const newMBTI =
      (category === "ei" ? value : ei) +
      (category === "sn" ? value : sn) +
      (category === "tf" ? value : tf) +
      (category === "jp" ? value : jp);

    if (newMBTI.length === 4) {
      onMBTISelect(newMBTI);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="typo-16-600 text-black">MBTI</label>

        {/* E/I */}
        <div className="flex gap-3">
          <MBTIButton
            value="E"
            selected={ei === "E"}
            onClick={() => handleSelect("ei", "E")}
          />
          <MBTIButton
            value="I"
            selected={ei === "I"}
            onClick={() => handleSelect("ei", "I")}
          />
        </div>

        {/* S/N */}
        <div className="flex gap-3">
          <MBTIButton
            value="S"
            selected={sn === "S"}
            onClick={() => handleSelect("sn", "S")}
          />
          <MBTIButton
            value="N"
            selected={sn === "N"}
            onClick={() => handleSelect("sn", "N")}
          />
        </div>

        {/* T/F */}
        <div className="flex gap-3">
          <MBTIButton
            value="T"
            selected={tf === "T"}
            onClick={() => handleSelect("tf", "T")}
          />
          <MBTIButton
            value="F"
            selected={tf === "F"}
            onClick={() => handleSelect("tf", "F")}
          />
        </div>

        {/* J/P */}
        <div className="flex gap-3">
          <MBTIButton
            value="J"
            selected={jp === "J"}
            onClick={() => handleSelect("jp", "J")}
          />
          <MBTIButton
            value="P"
            selected={jp === "P"}
            onClick={() => handleSelect("jp", "P")}
          />
        </div>
      </div>
      <input type="hidden" name="mbti" value={ei + sn + tf + jp} />
    </div>
  );
}
