"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ProfileButton({
  children,
  selected = false,
  onClick,
  disabled = false,
}: ProfileButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "typo-20-700 flex h-12 flex-1 items-center justify-center rounded-full transition-colors",
        selected
          ? "bg-pink-gradient border-color-pink-700 text-color-pink-700 border"
          : "bg-color-gray-0-a30 text-color-gray-300",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
