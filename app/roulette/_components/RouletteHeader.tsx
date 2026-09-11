"use client";

import { BackButton } from "@/components/ui/BackButton";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

type RouletteHeaderProps = {
  title?: React.ReactNode;
  sidebar?: React.ReactNode;
  onBack?: () => void;
};

const RouletteHeader = ({ title, sidebar, onBack }: RouletteHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // 메인 허브 화면(/roulette)에서는 이전 방문 페이지로 이동
    if (pathname === "/roulette") {
      router.back();
    } else {
      // 무료/스페셜 등 하위 룰렛 화면에서는 룰렛 메인 허브로 이동
      router.push("/roulette");
    }
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
