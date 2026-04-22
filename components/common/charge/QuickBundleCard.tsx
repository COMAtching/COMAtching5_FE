"use client";

import React from "react";
import Image from "next/image";
import { ICON_SIZE } from "@/lib/constants/charge";

interface QuickBundleCardProps {
  title: string;
  icon: string;
  description: string;
  bonus: string;
  price: string;
}

export default function QuickBundleCard({
  title,
  icon,
  description,
  bonus,
  price,
}: QuickBundleCardProps) {
  return (
    <div className="border-color-gray-64 bg-color-gray-50 flex flex-1 flex-col items-center justify-between rounded-[16px] border p-2 pt-4">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={icon}
          alt={title}
          width={ICON_SIZE.lg}
          height={ICON_SIZE.lg}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="typo-16-600 text-color-gray-800">{title}</span>
          <div className="flex flex-col items-center gap-1">
            <span className="typo-12-600 text-color-gray-400 text-center">
              {description}
            </span>
            <span className="typo-12-600 text-color-flame-700 text-center">
              {bonus}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="typo-16-600 bg-color-flame-700 mt-4 flex h-10 w-full items-center justify-center rounded-[8px] text-white"
      >
        {price}
      </button>
    </div>
  );
}
