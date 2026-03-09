"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Button from "@/components/ui/Button";

export const DEFAULT_PROFILES = [
  { id: "bear", name: "곰", image: "/profile/bear.svg" },
  { id: "cat", name: "고양이", image: "/profile/cat.svg" },
  { id: "dog", name: "강아지", image: "/profile/dog.svg" },
  { id: "rabbit", name: "토끼", image: "/profile/rabbit.svg" },
  { id: "fox", name: "여우", image: "/profile/fox.svg" },
  { id: "panda", name: "판다", image: "/profile/panda.svg" },
  { id: "hamster", name: "햄스터", image: "/profile/hamster.svg" },
  { id: "deer", name: "사슴", image: "/profile/deer.svg" },
  { id: "penguin", name: "펭귄", image: "/profile/penguin.svg" },
];

interface DefaultProfileDrawerProps {
  children: React.ReactNode;
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSelected(selectedProfile);
    }
  };

  const handleComplete = () => {
    onSelect(selected);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="mx-auto w-full rounded-t-[24px] px-[15px] py-6 md:max-w-[430px]"
      >
        <DrawerHeader className="flex flex-row items-start justify-between p-0">
          <div className="flex flex-col gap-2 text-left">
            <DrawerTitle className="typo-20-700">기본 이미지 변경</DrawerTitle>
            <p className="typo-14-500 !leading-[17px] text-[#858585]">
              기본프로필 이미지를 변경해 보세요
              <br />
              나와 닮은 동물로 설정하면 좋아요!
            </p>
          </div>
          <DrawerClose
            aria-label="닫기"
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>

        {/* 동물 프로필 그리드 */}
        <div className="scrollbar-hide mt-6 max-h-[60vh] overflow-y-auto pb-8">
          <div className="grid grid-cols-3 gap-4">
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
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div className="mt-4 w-full">
          <Button
            type="button"
            className="bg-button-primary text-button-primary-text-default"
            onClick={handleComplete}
            disabled={!selected}
          >
            확인
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DefaultProfileDrawer;
