import React from "react";
import { Plus } from "lucide-react";

interface HobbyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  plus?: boolean;
}

const HobbyButton = ({
  children,
  onClick,
  selected,
  plus,
}: HobbyButtonProps) => {
  const baseClass =
    "typo-14-500 flex items-center gap-1 rounded-full border px-3 py-[7.5px] whitespace-nowrap text-black transition-all duration-200 ease-in-out";
  const selectedClass = selected
    ? "border-[#FF4D61] bg-[#FFEBED]"
    : "border-[#DFDFDF] bg-[#B3B3B3]/15";

  return (
    <button
      type="button"
      className={
        plus
          ? `${baseClass} border-[#DFDFDF] bg-[#B3B3B3]/15`
          : `${baseClass} ${selectedClass}`
      }
      onClick={onClick}
    >
      {plus && <Plus size={13} color="#000" strokeWidth={2} />}
      {children}
    </button>
  );
};

export default HobbyButton;
