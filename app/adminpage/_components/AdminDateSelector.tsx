"use client";

import React from "react";

interface AdminDateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const AdminDateSelector = ({
  selectedDate,
  onSelectDate,
}: AdminDateSelectorProps) => {
  const dates = ["오늘", "내일", "모레"];

  return (
    <div className="flex w-full gap-2">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onSelectDate(date)}
          className={`h-12 flex-1 rounded-lg text-xl font-bold shadow-sm transition-all ${selectedDate === date ? "bg-[#ff775e] text-white" : "bg-[#b3b3b3] text-white"}`}
        >
          {date}
        </button>
      ))}
    </div>
  );
};
