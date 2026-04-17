"use client";

import { ImportantOption } from "@/lib/types/matching";
import { cn } from "@/lib/utils";
import React from "react";

interface MatchingOptionCardProps {
  label: string;
  value: ImportantOption;
  isSelected: boolean;
  selectionLabel: string;
  onPointerDown?: (e: React.PointerEvent, value: ImportantOption) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onClick?: (value: ImportantOption) => void;
}

export default function MatchingOptionCard({
  label,
  value,
  isSelected,
  selectionLabel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClick,
}: MatchingOptionCardProps) {
  return (
    <button
      onPointerDown={(e) => onPointerDown?.(e, value)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => onClick?.(value)}
      className={cn(
        "flex h-[75px] w-full cursor-grab touch-none items-center justify-between gap-1 rounded-lg border px-[17px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] active:cursor-grabbing",
        isSelected
          ? "border-color-main-700 ring-color-main-700 bg-white ring-1"
          : "border-color-gray-64 bg-color-gray-50",
      )}
    >
      <div className="flex items-end gap-2">
        <span className="typo-20-700 text-color-text-black">{label}</span>
        <span className="typo-15-600 text-color-text-caption3">
          {selectionLabel}
        </span>
      </div>
      {/* 드래그 핸들 아이콘 (Hamburger 형태) */}
      <div className="flex flex-col gap-[2px]" aria-hidden="true">
        <div className="bg-color-gray-200 h-[2px] w-4 rounded-[1px]" />
        <div className="bg-color-gray-200 h-[2px] w-4 rounded-[1px]" />
        <div className="bg-color-gray-200 h-[2px] w-4 rounded-[1px]" />
      </div>
    </button>
  );
}
