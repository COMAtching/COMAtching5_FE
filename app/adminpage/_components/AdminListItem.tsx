"use client";

import React from "react";

interface AdminListItemProps {
  title: string;
  subTitle?: string;
  statusText: string;
  date: string;
  startTime: string;
  endTime: string;
  onCancel?: () => void;
  cancelButtonText?: string;
}

export const AdminListItem = ({
  title,
  subTitle,
  statusText,
  date,
  startTime,
  endTime,
  onCancel,
  cancelButtonText
}: AdminListItemProps) => {
  return (
    <div className="w-full border-b border-[#808080] py-6 flex flex-col gap-2">
      <div className="flex gap-8 items-center">
        <span className="text-2xl font-medium text-[#828282] shrink-0">{statusText}</span>
        <span className="text-2xl font-semibold text-[#1a1a1a] truncate">{title} {subTitle && <span className="text-gray-500 font-normal ml-2">{subTitle}</span>}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <div className="flex flex-wrap gap-8 text-2xl font-semibold text-black">
          <div className="flex gap-4">
            <span className="text-[#808080] font-medium w-[137px]">시작일:</span>
            <span className="text-[#4d4d4d] font-medium min-w-[120px]">{date}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#808080] font-medium w-[96px]">시작 시각:</span>
            <span className="text-[#4d4d4d] font-medium min-w-[80px]">{startTime}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#808080] font-medium w-[107px]">종료 시각:</span>
            <span className="text-[#4d4d4d] font-medium min-w-[80px]">{endTime}</span>
          </div>
        </div>
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="w-[120px] h-12 bg-[#dd272a] text-white text-xl font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            {cancelButtonText || "취소"}
          </button>
        )}
      </div>
    </div>
  );
};
