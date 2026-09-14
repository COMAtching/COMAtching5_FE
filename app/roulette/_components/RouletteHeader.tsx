"use client";

import { BackButton } from "@/components/ui/BackButton";
import { useRouter, usePathname } from "next/navigation";
import { safeBack } from "@/lib/safeBack";
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

    if (pathname === "/roulette") {
      // 메인 허브 화면(/roulette)의 fallback은 홈("/")
      // 허브는 기대되는 단일 부모 경로가 없으므로 (어디서든 진입 가능), expectedParentPath를 생략합니다.
      safeBack(router, "/");
    } else {
      // 하위 룰렛 화면(/roulette/free 등)의 fallback은 룰렛 메인("/roulette")
      // 뒤로가기를 눌렀을 때 직전 목적지가 "/roulette"일 때만 브라우저 back()을 실행하고, 아니면 replace() 시킵니다.
      safeBack(router, "/roulette", "/roulette");
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
