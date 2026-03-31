"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProfileBottomSheet from "./ProfileBottomSheet";
import type { Gender } from "@/lib/types/profile";
import { getDefaultProfilesByGender } from "../_constants/defaultProfiles";

interface DefaultProfileDrawerProps {
  children: React.ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  }>;
  selectedProfile: string;
  gender?: Gender;
  onSelect: (profileId: string) => void;
}

const DefaultProfileDrawer = ({
  children,
  selectedProfile,
  gender,
  onSelect,
}: DefaultProfileDrawerProps) => {
  const profiles = getDefaultProfilesByGender(gender);
  const firstProfileId = profiles[0]?.id || "";

  const [selected, setSelected] = useState<string>(selectedProfile);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => {
    const hasSelected = profiles.some(
      (profile) => profile.id === selectedProfile,
    );
    setSelected(hasSelected ? selectedProfile : firstProfileId);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleComplete = () => {
    onSelect(selected);
    setIsOpen(false);
  };

  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(e);
      openDrawer();
    },
  });

  return (
    <>
      {trigger}

      <ProfileBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="기본 이미지 변경"
        description={
          <>
            기본 프로필 이미지를 변경해 보세요
            <br />
            나와 닮은 동물로 설정하면 좋아요!
          </>
        }
        footer={
          <Button
            type="button"
            className="bg-button-primary text-button-primary-text-default"
            onClick={handleComplete}
            disabled={!selected}
          >
            확인
          </Button>
        }
      >
        <div className="flex flex-wrap justify-between gap-y-8 px-1 py-8">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelected(profile.id)}
              className="flex w-[100px] flex-col items-center gap-2"
            >
              <div
                className={`flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-gray-200 transition-all duration-300 ease-out ${
                  selected === profile.id
                    ? "border-color-flame-700 scale-[1.03]"
                    : "scale-100"
                }`}
              >
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={90}
                  height={90}
                  className="rounded-full"
                />
              </div>
              <span
                className={`typo-14-500 transition-colors duration-300 ease-out ${
                  selected === profile.id
                    ? "text-color-flame-700 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {profile.name}
              </span>
            </button>
          ))}
        </div>
      </ProfileBottomSheet>
    </>
  );
};

export default DefaultProfileDrawer;
