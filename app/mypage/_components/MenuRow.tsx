import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuRowProps {
  label: string;
  value?: React.ReactNode;
  hasChevron?: boolean;
  underline?: boolean;
  onClick?: () => void;
}

export const MenuRow = ({
  label,
  value,
  hasChevron = false,
  underline = false,
  onClick,
}: MenuRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="box-border flex w-full items-center justify-between border-b border-[#E5E5E5] py-6 text-left"
  >
    <span className="typo-16-600 shrink-0 text-[#1A1A1A]">{label}</span>
    <div className="flex items-center gap-2">
      {value && (
        <span
          className={cn("typo-16-600 text-[#999999]", underline && "underline")}
        >
          {value}
        </span>
      )}
      {hasChevron && (
        <ChevronRight className="h-3 w-3 shrink-0 text-[#999999]" />
      )}
    </div>
  </button>
);
