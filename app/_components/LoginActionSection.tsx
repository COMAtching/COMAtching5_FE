"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import Button from "@/components/ui/Button";
import { KakaoLoginButton, GoogleLoginButton } from "./SocialButtonList";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function ScreenLoginActionSection() {
  const handleKakaoLogin = () => {
    // window.location.href = "https://backend.comatching.site/oauth2/authorization/kakao";
    alert("코매칭 서비스는 10/13일부로 종료되었습니다.");
  };

  const handleGoogleLogin = () => {
    // window.location.href = "https://backend.comatching.site/oauth2/authorization/google";
    alert("코매칭 서비스는 10/13일부로 종료되었습니다.");
  };

  return (
    <section className="flex flex-col items-center">
      <BubbleDiv />
      <KakaoLoginButton
        className="mt-[1.6vh] mb-[0.49vh]"
        onClick={handleKakaoLogin}
      >
        카카오로 빠르게 시작하기
      </KakaoLoginButton>
      <Drawer>
        <div className="typo-14-600 text-color-text-caption2 flex flex-col items-center leading-[1.6]">
          <span>또는</span>
          <DrawerTrigger asChild>
            <span className="cursor-pointer underline">
              다른 방법으로 로그인
            </span>
          </DrawerTrigger>
        </div>
        <DrawerContent
          showHandle={false}
          className="mx-auto flex h-[44.33vh] w-full flex-col items-center gap-4 p-6 md:max-w-[430px]"
        >
          <DrawerTitle className="sr-only">다른 로그인 방법</DrawerTitle>
          <div className="typo-18-700 mb-2">다른 로그인 방법</div>
          <KakaoLoginButton
            className="mt-[1.6vh] mb-[0.49vh]"
            onClick={handleKakaoLogin}
          >
            카카오로 시작하기
          </KakaoLoginButton>
          <GoogleLoginButton className="w-full" onClick={handleGoogleLogin}>
            구글로 시작하기
          </GoogleLoginButton>
        </DrawerContent>
      </Drawer>
      <span className="typo-12-600 text-footo-text-main mt-[6.75vh] mb-[6.15vh]">
        Developed By Team Comatching, Catholic University of Korea
      </span>
    </section>
  );
}
