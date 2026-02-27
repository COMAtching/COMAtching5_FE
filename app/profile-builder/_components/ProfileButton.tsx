"use client";

import React from "react";

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
  const baseClass =
    "typo-20-700 flex-1 rounded-full h-12 flex items-center justify-center transition-colors";
  const activeClass = "bg-pink-conic border border-pink-700 text-pink-700";
  const inactiveClass = "bg-[#FFFFFF4D] text-gray-300";
  return (
    <button
      type="button"
      className={`${baseClass} ${selected ? activeClass : inactiveClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
