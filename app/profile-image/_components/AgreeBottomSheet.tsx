"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // 부드러운 애니메이션을 위해 렌더링/애니메이션 상태를 다음 틱에서 설정
      timer = setTimeout(() => {
        setIsRendered(true);
        setTimeout(() => setIsAnimating(true), 10);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      timer = setTimeout(() => setIsAnimating(false), 0);
      // transition duration(300ms) 후 언마운트
      setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out",
          isAnimating ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "relative z-10 w-full rounded-t-[24px] bg-white px-4 pt-6 pb-8 md:max-w-[430px]",
          "transition-transform duration-300 ease-out",
          isAnimating ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-6 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1 text-left">
            <div className="typo-20-700 text-black">{title}</div>
            {description && (
              <div className="typo-14-500 !leading-[1.4] text-[#858585]">
                {description}
              </div>
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
      </div>
    </div>
  );
};

export default AgreeBottomSheet;
