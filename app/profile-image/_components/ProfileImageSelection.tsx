"use client";
import React from "react";
import Image from "next/image";
import { convertHeicToJpg } from "@/lib/utils/image";
import DefaultProfileDrawer, { DEFAULT_PROFILES } from "./DefaultProfileDrawer";

type SelectCheckButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  gradient: string;
  marginClassName?: string;
};

export const SelectCheckButton = ({
  label,
  isSelected,
  onClick,
  gradient,
  marginClassName = "mt-2",
}: SelectCheckButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`${marginClassName} flex h-[20px] w-[20px] items-center justify-center rounded-full border text-[14px] leading-none ${
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

interface ProfileImageSelectionProps {
  selected: "default" | "custom";
  onSelect: (type: "default" | "custom") => void;
  selectedProfile: string;
  onProfileSelect: (profileId: string) => void;
  customImage: string | null;
  onCustomImageChange: (image: string | null) => void;
  onFileChange?: (file: File) => void;
}

const ProfileImageSelection = ({
  selected,
  onSelect,
  selectedProfile,
  onProfileSelect,
  customImage,
  onCustomImageChange,
  onFileChange,
}: ProfileImageSelectionProps) => {
  const checkGradient =
    "linear-gradient(220.53deg, #FF775E -18.87%, #FF4D61 62.05%, #E83ABC 125.76%)";

  const actionLabel =
    selected === "default" ? "기본 이미지 변경" : "프로필 사진 변경";

  const currentProfile = DEFAULT_PROFILES.find((p) => p.id === selectedProfile);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const targetFile = await convertHeicToJpg(file);

      if (targetFile.type.startsWith("image/")) {
        onFileChange?.(targetFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          onCustomImageChange(reader.result as string);
        };
        reader.readAsDataURL(targetFile);
      }
    } catch (error) {
      console.error("Image processing failed:", error);
      alert(
        "이미지 처리 중 오류가 발생했습니다. 다른 이미지 형식을 사용해 주세요.",
      );
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-row justify-center gap-8">
        {/* 기본 이미지 원 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full"
            onClick={() => onSelect("default")}
          >
            {currentProfile ? (
              <span className="relative block h-[90px] w-[90px] overflow-hidden rounded-full">
                <Image
                  src={currentProfile.image}
                  alt={currentProfile.name}
                  fill
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-400">
                기본
              </span>
            )}
          </button>
          <SelectCheckButton
            label="기본 이미지 선택"
            isSelected={selected === "default"}
            onClick={() => onSelect("default")}
            gradient={checkGradient}
          />
        </div>
        {/* 프로필 이미지 업로드 원 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full"
            onClick={() => onSelect("custom")}
          >
            <span className="relative block h-[90px] w-[90px] overflow-hidden rounded-full bg-gray-100">
              {customImage ? (
                <Image
                  src={customImage}
                  alt="업로드된 프로필 이미지"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/profile/default-profile.svg"
                  alt="기본 프로필 이미지"
                  fill
                  className="object-cover"
                />
              )}
            </span>
          </button>
          <SelectCheckButton
            label="프로필 사진 선택"
            isSelected={selected === "custom"}
            onClick={() => onSelect("custom")}
            gradient={checkGradient}
          />
        </div>
      </div>

      <div className="flex justify-center">
        {selected === "default" ? (
          <DefaultProfileDrawer
            selectedProfile={selectedProfile}
            onSelect={onProfileSelect}
          >
            <button
              type="button"
              className="flex h-[33px] items-center justify-center gap-[10px] rounded-[99px] bg-[#E5E5E5] px-4 py-2 text-[14px] leading-[17px] font-semibold tracking-[-0.03em] text-[#4D4D4D]"
            >
              {actionLabel}
            </button>
          </DefaultProfileDrawer>
        ) : (
          <label
            htmlFor="profile-image-upload"
            className="flex h-[33px] cursor-pointer items-center justify-center gap-[10px] rounded-[99px] bg-[#E5E5E5] px-4 py-2 text-[14px] leading-[17px] font-semibold tracking-[-0.03em] text-[#4D4D4D]"
          >
            {actionLabel}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </>
  );
};

export default ProfileImageSelection;
