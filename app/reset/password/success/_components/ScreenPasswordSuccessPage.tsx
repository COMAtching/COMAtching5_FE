"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";

const ScreenPasswordSuccessPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    // 성공 페이지에 도달하면 히스토리에 현재 상태를 추가하여 뒤로가기를 가로챔
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // 뒤로가기 시 비밀번호 재설정 시작 페이지로 강제 이동 (인증 폼 재진입 방지)
      router.replace("/reset/password");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return (
    <div className="flex h-[100dvh] flex-col px-4">
      <header className="flex items-center justify-center pt-5">
        <Image
          src="/logo/comatching-logo.svg"
          alt="COMatching Logo"
          width={96}
          height={16}
          priority
        />
      </header>

      <main className="mt-[12.8vh] flex w-full flex-col items-center text-center">
        <div className="flex flex-col items-center gap-4">
          {/* 성공 아이콘 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#60CE00]">
            <Check size={28} strokeWidth={3} className="text-white" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="typo-28-600 text-black">비밀번호 변경 완료!</h1>
            <p className="typo-16-500 text-gray-600">
              홈 화면에서 다시 로그인해 주세요.
            </p>
          </div>
        </div>
      </main>

      <Button
        type="button"
        onClick={() => router.replace("/login")}
        fixed
        bottom={80}
      >
        홈 화면으로 돌아가기
      </Button>
    </div>
  );
};

export default ScreenPasswordSuccessPage;
