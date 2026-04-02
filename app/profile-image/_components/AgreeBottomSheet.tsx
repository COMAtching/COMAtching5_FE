"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

interface AgreeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AgreeBottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: AgreeBottomSheetProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        showHandle={false}
        className="z-[100] mx-auto max-h-none w-full rounded-t-[24px] border-0 bg-white px-4 pt-6 pb-8 md:max-w-[430px]"
      >
        <div className="mb-6 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1 text-left">
            <DrawerTitle className="typo-20-700 text-black">
              {title}
            </DrawerTitle>
            {description && (
              <DrawerDescription className="typo-14-500 !leading-[1.4] text-[#858585]">
                {description}
              </DrawerDescription>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="scrollbar-hide max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {footer && <div className="mt-6 w-full">{footer}</div>}
      </DrawerContent>
    </Drawer>
  );
};

export default AgreeBottomSheet;
