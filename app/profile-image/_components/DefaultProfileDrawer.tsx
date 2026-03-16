"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProfileBottomSheet from "./ProfileBottomSheet";

export const DEFAULT_PROFILES = [
  { id: "dog", name: "강아지", image: "/profile/dog.svg" },
  { id: "cat", name: "고양이", image: "/profile/cat.svg" },
  { id: "bear", name: "곰", image: "/profile/bear.svg" },
  { id: "rabbit", name: "토끼", image: "/profile/rabbit.svg" },
  { id: "fox", name: "여우", image: "/profile/fox.svg" },
  { id: "penguin", name: "펭귄", image: "/profile/penguin.svg" },
  { id: "dinosaur", name: "공룡", image: "/profile/dinosaur.svg" },
  { id: "otter", name: "수달", image: "/profile/otter.svg" },
  { id: "wolf", name: "늑대", image: "/profile/wolf.svg" },
  { id: "snake", name: "뱀", image: "/profile/snake.svg" },
  { id: "horse", name: "말", image: "/profile/horse.svg" },
  { id: "frog", name: "개구리", image: "/profile/frog.svg" },
];

interface DefaultProfileDrawerProps {
  children: React.ReactElement<{
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  }>;
  selectedProfile: string;
  onSelect: (profileId: string) => void;
}

const DefaultProfileDrawer = ({
  children,
  selectedProfile,
  onSelect,
}: DefaultProfileDrawerProps) => {
  const [selected, setSelected] = useState<string>(selectedProfile);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => {
    setSelected(selectedProfile);
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
        <div className="grid grid-cols-3 gap-4 pb-4">
          {DEFAULT_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelected(profile.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-[80px] w-[80px] items-center justify-center rounded-full transition-all ${
                  selected === profile.id
                    ? "ring-4 ring-[#FF4D61]"
                    : "ring-2 ring-gray-200"
                }`}
              >
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={70}
                  height={70}
                  className="rounded-full"
                />
              </div>
              <span
                className={`typo-14-500 ${
                  selected === profile.id
                    ? "font-semibold text-[#FF4D61]"
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
