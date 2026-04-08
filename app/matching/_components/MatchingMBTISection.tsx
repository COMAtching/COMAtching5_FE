"use client";

import React, { useState } from "react";
import ProfileButton from "../../profile-builder/_components/ProfileButton";

interface MatchingMBTISectionProps {
  onMBTISelect: (mbti: string) => void;
  defaultValue?: string;
}

export default function MatchingMBTISection({
  onMBTISelect,
  defaultValue,
}: MatchingMBTISectionProps) {
  const [ei, setEi] = useState(defaultValue?.[0] || "");
  const [sn, setSn] = useState(defaultValue?.[1] || "");
  const [tf, setTf] = useState(defaultValue?.[2] || "");
  const [jp, setJp] = useState(defaultValue?.[3] || "");

  const handleSelect = (category: "ei" | "sn" | "tf" | "jp", value: string) => {
    let newEi = ei;
    let newSn = sn;
    let newTf = tf;
    let newJp = jp;

    if (category === "ei") {
      setEi(value);
      newEi = value;
    }
    if (category === "sn") {
      setSn(value);
      newSn = value;
    }
    if (category === "tf") {
      setTf(value);
      newTf = value;
    }
    if (category === "jp") {
      setJp(value);
      newJp = value;
    }

    if (newEi && newSn && newTf && newJp) {
      onMBTISelect(`${newEi}${newSn}${newTf}${newJp}`);
    } else {
      onMBTISelect("");
    }
  };

  return (
    <div className="border-color-gray-100 flex flex-col gap-4 border-b pb-5">
      <div className="flex flex-col gap-1">
        <label className="typo-20-700 text-color-text-black">MBTI</label>
        <p className="typo-14-500 text-color-text-caption3">
          상대방의 MBTI를 골라주세요.
        </p>
      </div>

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
  );
}
