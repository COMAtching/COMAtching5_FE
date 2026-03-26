"use client";

import React from "react";
import { AdminDropdown } from "./AdminDropdown";

interface AdminTimeRowProps {
  hours: string[];
  minutes: string[];
  selectedHour: string;
  selectedMinute: string;
  onHourSelect: (hour: string) => void;
  onMinuteSelect: (minute: string) => void;
  suffix: string;
}

export const AdminTimeRow = ({
  hours,
  minutes,
  selectedHour,
  selectedMinute,
  onHourSelect,
  onMinuteSelect,
  suffix,
}: AdminTimeRowProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AdminDropdown
        options={hours}
        selectedValue={selectedHour}
        onSelect={onHourSelect}
      />
      <span className="text-2xl font-semibold">시</span>
      <AdminDropdown
        options={minutes}
        selectedValue={selectedMinute}
        onSelect={onMinuteSelect}
      />
      <span className="text-2xl font-semibold">{suffix}</span>
    </div>
  );
};
