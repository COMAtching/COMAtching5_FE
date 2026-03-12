"use client";

import React from "react";
import { TriangleAlert } from "lucide-react";

interface AdminWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: React.ReactNode;
}

export const AdminWarningModal = ({
  isOpen,
  onClose,
  message,
}: AdminWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[423px] flex-col items-center rounded-[24px] bg-white shadow-2xl">
        <div className="flex flex-col items-center gap-4 p-10 text-center">
          <TriangleAlert size={60} className="text-[#ff775e]" />
          <div className="text-2xl leading-relaxed font-semibold text-black">
            {message}
          </div>
        </div>
        <div
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-b-[24px] border-t border-[#b3b3b3] text-xl font-bold text-[#ff775e] hover:bg-gray-50"
          onClick={onClose}
        >
          확인
        </div>
      </div>
    </div>
  );
};
