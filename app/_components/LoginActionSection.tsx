"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import { KakaoLoginButton, GoogleLoginButton } from "./SocialButtonList";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";

export default function ScreenLoginActionSection() {
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;
    // alert("코매칭 서비스는 10/13일부로 종료되었습니다.");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
    // alert("코매칭 서비스는 10/13일부로 종료되었습니다.");
  };

  return (
    <section className="flex flex-col items-center">
      <BubbleDiv top={5} />
      <KakaoLoginButton
        className="mt-[1.6vh] mb-[0.49vh]"
        onClick={handleKakaoLogin}
        shadow={true}
      >
        카카오로 빠르게 시작하기
      </KakaoLoginButton>
      <Drawer>
        <div className="typo-14-600 text-color-text-caption2 flex flex-col items-center leading-[1.6]">
          <span>또는</span>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="all-[unset] cursor-pointer underline"
            >
              다른 방법으로 로그인
            </button>
          </DrawerTrigger>
        </div>
        <DrawerContent
          showHandle={false}
          className="mx-auto flex h-auto min-h-[44.33dvh] w-full flex-col items-center px-4 pt-6 pb-[32px] md:max-w-[430px]"
        >
          <DrawerTitle className="sr-only">다른 로그인 방법</DrawerTitle>
          <div className="flex w-full flex-col items-start gap-2">
            <span className="typo-20-700 text-bottomsheet-text-title">
              로그인/회원가입
            </span>
            <span className="typo-14-500 text-[#999]">
              로그인과 회원가입 수단은 동일합니다.
              <br />
              원하는 계정으로 시작하세요.
            </span>
          </div>
          <KakaoLoginButton onClick={handleKakaoLogin} className="mt-8 mb-4">
            카카오로 시작하기
          </KakaoLoginButton>
          <GoogleLoginButton className="w-full" onClick={handleGoogleLogin}>
            구글로 시작하기
          </GoogleLoginButton>
          <div className="typo-14-500 text-bottomsheet-text-caption mt-6 flex flex-col items-center">
            <span>혹은</span>
            <Link
              href="/login"
              className="all-[unset] cursor-pointer underline"
            >
              이메일로 로그인
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
      <span className="typo-12-600 text-footo-text-main mt-[6.75vh] mb-[6.15vh]">
        Developed By Team Comatching, Catholic University of Korea
      </span>
    </section>
  );
}
