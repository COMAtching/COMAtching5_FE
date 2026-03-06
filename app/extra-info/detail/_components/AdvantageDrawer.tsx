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

interface AdvantageDrawerProps {
  children: React.ReactNode;
}

const AdvantageDrawer = ({ children }: AdvantageDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="mx-auto w-full rounded-t-[24px] px-[15px] pt-6 md:max-w-[430px]"
      >
        <DrawerHeader className="flex flex-row items-start justify-between p-0">
          <div className="flex flex-col gap-1 text-left">
            <DrawerTitle>제 장점은요...</DrawerTitle>
            <p className="typo-12-400 text-[#858585]">
              내가 생각하는 나의 장점을 골라주세요
            </p>
          </div>
          <DrawerClose
            aria-label="닫기"
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>
        <div className="mt-6 flex flex-col gap-4 pb-8">
          {/* 추후 장점 데이터가 제공되면 이곳에 UI 구현 */}
          <p className="typo-14-500 text-center text-gray-400">
            장점 목록을 준비 중입니다.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AdvantageDrawer;
