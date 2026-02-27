"use client";

import React, { useState } from "react";
import ProfileButton from "./ProfileButton";

interface Step3MBTIProps {
  onMBTISelect: (mbti: string) => void;
  defaultValue?: string;
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

        <div className="flex flex-col gap-2">
          {/* 상단 행: E S F P */}
          <div className="flex gap-1.5">
            <ProfileButton
              selected={ei === "E"}
              onClick={() => handleSelect("ei", "E")}
            >
              E
            </ProfileButton>
            <ProfileButton
              selected={sn === "S"}
              onClick={() => handleSelect("sn", "S")}
            >
              S
            </ProfileButton>
            <ProfileButton
              selected={tf === "F"}
              onClick={() => handleSelect("tf", "F")}
            >
              F
            </ProfileButton>
            <ProfileButton
              selected={jp === "P"}
              onClick={() => handleSelect("jp", "P")}
            >
              P
            </ProfileButton>
          </div>

          {/* 하단 행: I N T J */}
          <div className="flex gap-1.5">
            <ProfileButton
              selected={ei === "I"}
              onClick={() => handleSelect("ei", "I")}
            >
              I
            </ProfileButton>
            <ProfileButton
              selected={sn === "N"}
              onClick={() => handleSelect("sn", "N")}
            >
              N
            </ProfileButton>
            <ProfileButton
              selected={tf === "T"}
              onClick={() => handleSelect("tf", "T")}
            >
              T
            </ProfileButton>
            <ProfileButton
              selected={jp === "J"}
              onClick={() => handleSelect("jp", "J")}
            >
              J
            </ProfileButton>
          </div>
        </div>
      </div>
      <input type="hidden" name="mbti" value={ei + sn + tf + jp} />
    </div>
  );
}
