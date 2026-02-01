import React from "react";
import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  variant?: "absolute" | "static";
  className?: string;
  onClick?: () => void;
};

export const BackButton = ({
  variant = "static",
  className = "",
  onClick,
}: BackButtonProps) => {
  const positionClass = variant === "absolute" ? "absolute left-4 top-2" : "";

  return (
    <div
      onClick={onClick}
      className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#FFFFFF]/30 bg-[#FFFFFF]/50 [box-shadow:0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px] ${positionClass} ${className}`}
    >
      <ChevronLeft className="text-[#282828]" size={20} />
    </div>
  );
};
