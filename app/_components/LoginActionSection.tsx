"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import { KakaoLoginButton } from "./SocialButtonList";
import Link from "next/link";
import { useFeature, featureMessage } from "@/stores/features";
import { alertIfLoginBlocked } from "@/lib/constants/date";

export default function ScreenLoginActionSection() {
  const login = useFeature("LOGIN");
  const handleKakaoLogin = () => {
    if (alertIfLoginBlocked()) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;
    console.log("🟡 카카오 로그인 URL:", url);
    // 외부 OAuth 엔드포인트로 리다이렉트 (Next.js 내부 경로 아님)
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = url;
  };

  return (
    <section className="flex w-full flex-col items-center">
      <BubbleDiv top={-4} />
      {login && !login.open && (
        <p role="status">{featureMessage("LOGIN", login)}</p>
      )}
      <KakaoLoginButton
        disabled={!login?.open}
        className="mt-[1.6vh] mb-[0.49vh]"
        onClick={handleKakaoLogin}
        shadow={true}
      >
        카카오로 빠르게 시작하기
      </KakaoLoginButton>
      <span className="typo-14-500 text-color-text-caption2 mt-4">또는</span>
      <Link
        aria-disabled={!login?.open}
        href="/login"
        className="all-[unset] typo-14-500 text-color-text-caption2 cursor-pointer underline transition-colors"
        onClick={(e) => {
          if (alertIfLoginBlocked()) e.preventDefault();
        }}
      >
        이메일로 로그인
      </Link>
      <span className="typo-12-600 text-footo-text-main mt-[6.75vh]">
        Developed By Team Comatching, Catholic University of Korea
      </span>
    </section>
  );
}
