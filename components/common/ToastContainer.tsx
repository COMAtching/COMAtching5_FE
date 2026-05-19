"use client";
import React from "react";
import { useToastStore } from "@/stores/toast-store";
import Image from "next/image";
import { X } from "lucide-react";

export default function ToastContainer() {
  const { toast, hideToast } = useToastStore();

  if (!toast) return null;

  return (
    <div
      className="animate-in slide-in-from-top fixed top-4 left-1/2 z-[9999] w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 transform transition-all duration-300 ease-out"
      onClick={hideToast}
    >
      <div className="flex w-full cursor-pointer items-start gap-3 rounded-[20px] border border-gray-100 bg-white/95 p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform active:scale-[0.98]">
        {/* 알림 아이콘: COMAtching 그라데이션 브랜드 테두리 적용 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-tr from-[#FF775E] to-[#E83ABC] p-[1.5px]">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
            <Image
              src="/logo/icon.png"
              alt="COMAtching"
              width={22}
              height={22}
              className="rounded-full"
            />
          </div>
        </div>

        {/* 텍스트 내용 */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-4">
          <span className="typo-14-700 truncate font-bold text-[#1A1A1A]">
            {toast.title}
          </span>
          <span className="typo-12-500 line-clamp-2 leading-[1.4] text-gray-500">
            {toast.body}
          </span>
        </div>

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            hideToast();
          }}
          className="mt-0.5 shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
