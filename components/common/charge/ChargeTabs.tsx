"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TABS } from "@/lib/constants/charge";

interface ChargeTabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const ChargeTabs = ({ activeTab, setActiveTab }: ChargeTabsProps) => {
  return (
    <ul className="flex shrink-0 items-start gap-2 px-6 pt-6">
      {TABS.map((tab, i) => (
        <li key={tab.label}>
          <button
            type="button"
            onClick={() => setActiveTab(i)}
            className={cn(
              "typo-14-500 flex h-[33px] items-center justify-center rounded-full px-4",
              activeTab === i
                ? "bg-[#1A1A1A] text-white"
                : "border border-[#E5E5E5] bg-[#F5F5F5] text-[#666666]",
            )}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ChargeTabs;
