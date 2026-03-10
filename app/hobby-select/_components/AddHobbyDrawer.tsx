"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FormInput from "@/components/ui/FormInput";

interface AddHobbyDrawerProps {
  children: React.ReactNode;
  onAdd?: (hobby: string, category: HobbyCategory) => void;
}

import { HOBBIES, type HobbyCategory } from "@/lib/constants/hobbies";
import HobbyButton from "./HobbyButton";
import Button from "@/components/ui/Button";

export default function AddHobbyDrawer({
  children,
  onAdd,
}: AddHobbyDrawerProps) {
  const [open, setOpen] = useState(false);
  const [hobbyName, setHobbyName] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<HobbyCategory | null>(null);

  const handleAdd = () => {
    if (!hobbyName.trim() || !selectedCategory || !onAdd) return;
    onAdd(hobbyName.trim(), selectedCategory);
    setOpen(false);
    setHobbyName("");
    setSelectedCategory(null);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="mx-auto flex w-full flex-col rounded-t-[24px] px-[15px] pt-6 md:max-w-[430px]"
      >
        <DrawerHeader className="flex flex-row items-start justify-between p-0">
          <div className="flex flex-col gap-1 text-left">
            <DrawerTitle>내 관심사 추가하기</DrawerTitle>
            <p className="typo-12-400 text-[#858585]">
              밑에 중분류를 설정하면 나만의 관심사를 추가할 수 있어요. 나만의
              관심사를 추가해 보세요.
            </p>
          </div>
          <DrawerClose
            aria-label="닫기"
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <h2 className="typo-16-600 mb-3 text-black">관심사</h2>
          <FormInput
            id="custom-hobby-input"
            name="customHobby"
            type="text"
            value={hobbyName}
            onChange={(e) => setHobbyName(e.target.value)}
            placeholder="관심사를 입력하세요"
            className="mb-8"
          />
          <h2 className="typo-16-600 mt-4 mb-3 text-black">중분류</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(HOBBIES) as HobbyCategory[]).map((category) => (
              <HobbyButton
                key={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </HobbyButton>
            ))}
          </div>
        </div>
        <div className="shrink-0 pt-2 pb-4">
          <Button
            type="button"
            disabled={!hobbyName.trim() || !selectedCategory}
            onClick={handleAdd}
            className="bg-button-primary text-button-primary-text-default w-full"
          >
            추가하기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
