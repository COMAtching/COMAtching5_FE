"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import { KakaoLoginButton } from "./SocialButtonList";
import Link from "next/link";

export default function ScreenLoginActionSection() {
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <section className="flex flex-col items-center">
      <BubbleDiv top={-4} />
      <KakaoLoginButton
        className="mt-[1.6vh] mb-[0.49vh]"
        onClick={handleKakaoLogin}
        shadow={true}
      >
        카카오로 빠르게 시작하기
      </KakaoLoginButton>
      <Link
        href="/login"
        className="all-[unset] typo-12-500 text-color-gray-500 hover:text-color-gray-700 mt-2 cursor-pointer underline transition-colors"
      >
        이메일로 로그인
      </Link>
      <span className="typo-12-600 text-footo-text-main mt-[6.75vh] mb-[6.15vh]">
        Developed By Team Comatching, Catholic University of Korea
      </span>
    </section>
  );
}
