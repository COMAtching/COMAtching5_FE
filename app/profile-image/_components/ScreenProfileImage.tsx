"use client";
import React, { useState } from "react";
import Image from "next/image";

type SelectCheckButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  gradient: string;
};

const SelectCheckButton = ({
  label,
  isSelected,
  onClick,
  gradient,
}: SelectCheckButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`mt-2 flex h-[20px] w-[20px] items-center justify-center rounded-full border text-[14px] leading-none ${
        isSelected
          ? "border-[#FF4D61] text-white"
          : "border-gray-300 bg-white text-transparent"
      }`}
      style={isSelected ? { background: gradient } : undefined}
    >
      ✓
    </button>
  );
};

const ScreenProfileImage = () => {
  const [selected, setSelected] = useState<"default" | "custom">("default");
  const actionLabel =
    selected === "default" ? "기본 이미지 변경" : "프로필 사진 변경";
  const checkGradient =
    "linear-gradient(220.53deg, #FF775E -18.87%, #FF4D61 62.05%, #E83ABC 125.76%)";

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden px-4 pb-[120px]">
      <h1 className="typo-20-600 mt-3 mb-9 text-black">프로필 설정</h1>
      <div className="mb-10 flex flex-row justify-center gap-8">
        {/* 기본 이미지 원 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full"
            onClick={() => setSelected("default")}
          >
            {/* 기본 이미지 (임시) */}
            <span className="block flex h-[90px] w-[90px] items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-400">
              기본
            </span>
          </button>
          <SelectCheckButton
            label="기본 이미지 선택"
            isSelected={selected === "default"}
            onClick={() => setSelected("default")}
            gradient={checkGradient}
          />
        </div>
        {/* 프로필 이미지 업로드 원 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full"
            onClick={() => setSelected("custom")}
          >
            {/* 업로드 이미지 (임시) */}
            <span className="relative block h-[90px] w-[90px] overflow-hidden rounded-full bg-gray-100">
              <Image
                src="/profile/default-profile.svg"
                alt="기본 프로필 이미지"
                fill
                className="object-cover"
              />
            </span>
          </button>
          <SelectCheckButton
            label="프로필 사진 선택"
            isSelected={selected === "custom"}
            onClick={() => setSelected("custom")}
            gradient={checkGradient}
          />
        </div>
      </div>

      <div className="absolute top-[286px] left-1/2 -translate-x-1/2">
        <button
          type="button"
          className="flex h-[33px] w-[121px] items-center justify-center gap-[10px] rounded-[99px] bg-[#E5E5E5] px-4 py-2 text-[14px] leading-[17px] font-semibold tracking-[-0.03em] text-[#4D4D4D]"
        >
          {actionLabel}
        </button>
      </div>
    </main>
  );
};

export default ScreenProfileImage;
