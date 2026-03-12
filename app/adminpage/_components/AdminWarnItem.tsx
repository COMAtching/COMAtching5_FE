"use client";

import React from "react";

interface AdminWarnItemProps {
  reason: string;
  time: string;
}

export const AdminWarnItem = ({ reason, time }: AdminWarnItemProps) => {
  return (
    <div className="w-full h-[95px] flex items-center gap-4 border-b border-[#808080]">
      <div className="w-[160px] text-2xl font-semibold text-black text-center shrink-0">
        {reason}
      </div>
      <div className="text-2xl font-medium text-[#828282]">
        {time}
      </div>
    </div>
  );
};
