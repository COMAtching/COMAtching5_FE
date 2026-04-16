"use client";

import { DrawerClose } from "@/components/ui/drawer";
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
}

export default function MatchingOptionCard({
  label,
  value,
  isSelected,
  selectionLabel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: MatchingOptionCardProps) {
  return (
    <button
      onPointerDown={(e) => onPointerDown?.(e, value)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "flex h-[75px] w-full cursor-grab touch-none flex-col items-start justify-center gap-1 rounded-lg border px-[17px] transition-all active:cursor-grabbing",
        isSelected
          ? "border-color-main-700 ring-color-main-700 bg-white ring-1"
          : "border-[#EFEFEF] bg-[#F5F5F5]",
      )}
    >
      <div className="pointer-events-none flex w-full items-center justify-between">
        <div className="flex items-end gap-2">
          <span className="typo-20-600 text-color-text-black">{label}</span>
          <span className="typo-15-600 text-color-gray-400">
            {selectionLabel}
          </span>
        </div>
        {/* 드래그 핸들 아이콘 (Hamburger 형태) */}
        <div className="flex flex-col gap-[2px]">
          <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
          <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
          <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
        </div>
      </div>
    </button>
  );
}
