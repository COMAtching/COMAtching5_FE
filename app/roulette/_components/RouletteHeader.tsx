"use client";

import { BackButton } from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";
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

    // 어느 경로에서든 항상 이전 페이지로 이동
    // (push 대신 back을 사용해야 히스토리 스택에 /roulette가 중복으로 쌓이지 않음)
    router.back();
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
