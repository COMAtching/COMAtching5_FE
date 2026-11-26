import { BackButton } from "@/components/ui/BackButton";
import type { ReactNode } from "react";

export default function MatchingListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="조회하기" />
      <span className="typo-14-500 mt-2 text-center leading-[17px] text-[#858585]">
        내가 뽑은 상대들을 여기서 확인할 수 있어요.
        <br />
        용기내서 연락해보세요!
      </span>
      {children}
    </main>
  );
}
