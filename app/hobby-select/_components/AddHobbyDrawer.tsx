import React from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AddHobbyDrawerProps {
  children: React.ReactNode;
}

export default function AddHobbyDrawer({ children }: AddHobbyDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="mx-auto w-full rounded-t-[24px] px-[15px] pt-6 md:max-w-[430px]"
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
        {/* 내용물은 여기에 채워주세요 */}
      </DrawerContent>
    </Drawer>
  );
}
