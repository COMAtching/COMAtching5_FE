"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface MyTicketSectionProps {
  className?: string;
}

const MyTicketSection = ({ className }: MyTicketSectionProps) => {
  // Temporary mock data for UI preview (no network)
  const data = { data: { matchingTicketCount: 3, optionTicketCount: 1 } };
  const { matchingTicketCount, optionTicketCount } = data.data;

  return (
    <section
      className={cn(
        "flex h-9.5 w-full items-center justify-center gap-6 rounded-full border border-white/30 bg-white/50 px-4 backdrop-blur-[50px]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Image src="/main/ticket.png" alt="ticket" width={20} height={20} />
        <span className="typo-12-600 text-color-text-caption3">보유뾽기권</span>
        <span className="typo-14-600 text-color-text-black">
          {matchingTicketCount}개
        </span>
      </div>
      <div className="h-4 w-px bg-black/30" />
      <div className="flex items-center gap-2">
        <Image src="/main/option.png" alt="option" width={20} height={20} />
        <span className="typo-12-600 text-color-text-caption3">옵션권</span>
        <span className="typo-14-600 text-color-text-black">
          {optionTicketCount}개
        </span>
      </div>
    </section>
  );
};

export default MyTicketSection;
