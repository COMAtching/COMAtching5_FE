"use client";

import { BackButton } from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";
import { safeBack } from "@/lib/safeBack";
import React from "react";

type RouletteHeaderProps = {
  title?: React.ReactNode;
  sidebar?: React.ReactNode;
  onBack?: () => void;
};

const RouletteHeader = ({ title, sidebar, onBack }: RouletteHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // 직접 접근(URL 직타, 외부 링크)으로 히스토리가 없을 경우 /roulette로 fallback
    safeBack(router, "/roulette");
  };

  return (
    <header className="flex h-[64px] w-full items-center justify-between py-2">
      <BackButton className="shrink-0" onClick={handleBack} />

      {title && (
        <div className="flex flex-1 justify-center text-center">
          {typeof title === "string" ? (
            <span className="typo-20-700 text-color-text-black">{title}</span>
          ) : (
            title
          )}
        </div>
      )}

      <div className="flex shrink-0 items-center justify-end">
        {sidebar ?? null}
      </div>
    </header>
  );
};

export default RouletteHeader;
