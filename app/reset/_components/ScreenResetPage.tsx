"use client";
import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";
import InfoCard from "./InfoCard";

const ScreenResetPage = () => {
  return (
    <div className="flex min-h-screen flex-col px-4 pb-10">
      <header className="py-4">
        <BackButton text="아이디 / 비밀번호 찾기" />
      </header>

      <main className="mt-10 flex flex-col items-center justify-center gap-6 text-center">
        <div className="mt-4 flex w-full flex-col items-center gap-4">
          <InfoCard
            title="아이디 찾기"
            detail={
              "현재 아이디 찾기는 구현 중에 있습니다.\n아래 인스타 계정으로 관리자에게 문의하세요."
            }
            email="@cuk_coma"
            disabled
          />
          <InfoCard
            href="/reset/password"
            title="비밀번호 재설정"
            detail={
              "비밀번호를 분실하셨나요?\n가입하신 이메일을 통해 비밀번호를 재설정합니다."
            }
          />
        </div>
      </main>
    </div>
  );
};

export default ScreenResetPage;
