"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export default function ProfileButton({
  children,
  selected = false,
  onClick,
}: ProfileButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "typo-20-700 flex h-12 flex-1 items-center justify-center rounded-full transition-colors",
        selected
          ? "bg-pink-gradient border-color-pink-700 text-color-pink-700 border"
          : "bg-color-gray-0-a30 text-color-gray-300",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
