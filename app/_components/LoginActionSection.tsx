"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import { KakaoLoginButton, GoogleLoginButton } from "./SocialButtonList";
import LoginMethodDrawer from "./LoginMethodDrawer";

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
      <BubbleDiv top={-4} />
      <KakaoLoginButton
        className="mt-[1.6vh] mb-[0.49vh]"
        onClick={handleKakaoLogin}
        shadow={true}
      >
        카카오로 빠르게 시작하기
      </KakaoLoginButton>
      <LoginMethodDrawer
        onKakaoLogin={handleKakaoLogin}
        onGoogleLogin={handleGoogleLogin}
      >
        <button type="button" className="all-[unset] cursor-pointer underline">
          다른 방법으로 로그인
        </button>
      </LoginMethodDrawer>
      <span className="typo-12-600 text-footo-text-main mt-[6.75vh] mb-[6.15vh]">
        Developed By Team Comatching, Catholic University of Korea
      </span>
    </section>
  );
}
