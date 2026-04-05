"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { useSendPasswordCode } from "@/hooks/useSendPasswordCode";

const ScreenVerificationPage = () => {
  const router = useRouter();
  const { sendCode, isPending: isSending } = useSendPasswordCode();

  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // 이메일 전송 여부 확인 로직
  useEffect(() => {
    const emailToVerify = sessionStorage.getItem("reset_email_to_verify");
    if (!emailToVerify) {
      alert("잘못된 접근입니다.");
      router.replace("/reset/password");
    } else {
      Promise.resolve().then(() => setIsAuthorized(true));
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cooldownTimer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    if (errorMessage && value) {
      setErrorMessage("");
    }
  };

  const handleResend = () => {
    const email = sessionStorage.getItem("reset_email_to_verify");
    if (!email) return;
    sendCode(email, {
      onSuccess: () => {
        setTimeLeft(300);
        setResendCooldown(180);
        setErrorMessage("");
      },
      onError: (msg) => {
        setErrorMessage(msg ?? "재전송에 실패했습니다. 다시 시도해 주세요.");
      },
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // 인증코드와 이메일을 sessionStorage에 저장만 하고 새 비밀번호 페이지에서 PATCH API 호출
    // (PATCH /api/auth/password/code 는 email+code+newPassword 를 한 번에 요청)
    sessionStorage.setItem("reset_verified", "true");
    sessionStorage.setItem("reset_code", verificationCode);
    router.replace("/reset/password/new");
  };

  const handleBack = () => {
    if (confirm("비밀번호 재설정을 중단하고 처음으로 돌아가시겠습니까?")) {
      sessionStorage.removeItem("reset_email_to_verify");
      router.replace("/reset/password");
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (confirm("비밀번호 재설정을 중단하고 처음으로 돌아가시겠습니까?")) {
        sessionStorage.removeItem("reset_email_to_verify");
        router.replace("/reset/password");
      } else {
        // 뒤로가기를 취소하고 현재 페이지 유지
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  if (isAuthorized === null) return null;

  return (
    <div className="flex h-dvh flex-col px-4">
      <header className="py-4">
        <BackButton onClick={handleBack} />
      </header>

      <main className="mt-10 flex w-full flex-1 flex-col items-start gap-8 pb-20">
        <div className="flex flex-col">
          <h1 className="typo-28-600 mt-4 mb-1 text-left text-black">
            인증번호를 입력해 주세요
          </h1>
          <h2 className="typo-16-500 text-left text-gray-600">
            {isSending
              ? "인증번호를 보내는 중이에요"
              : "등록된 이메일로 인증번호를 보냈어요"}
          </h2>
        </div>

        <form
          className="flex w-full flex-1 flex-col gap-4"
          onSubmit={handleVerify}
        >
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="verification-code" className="sr-only">
              인증번호
            </label>
            <div className="flex gap-2">
              <FormInput
                id="verification-code"
                type="text"
                name="verificationCode"
                placeholder={formatTime(timeLeft)}
                required
                value={verificationCode}
                onChange={(e) => handleVerificationCodeChange(e.target.value)}
                error={!!errorMessage}
                maxLength={6}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isSending}
                className="bg-color-gray-50 text-color-text-caption1 typo-18-600 h-12 w-30 shrink-0"
                shadow={false}
                style={{ boxShadow: "none" }}
              >
                {isSending
                  ? "전송 중.."
                  : resendCooldown > 0
                    ? formatTime(resendCooldown)
                    : "재전송"}
              </Button>
            </div>
            {errorMessage && (
              <span className="typo-12-400 text-color-text-highlight mt-1 block text-left">
                *{errorMessage}
              </span>
            )}
          </div>

          <div className="mt-auto flex w-full flex-col gap-4">
            <div className="bg-color-gray-50-a80 w-full rounded-[16px] border-[#b3b3b34d] p-4">
              <span className="typo-12-500 text-color-text-caption3 block text-left">
                인증번호가 오지 않았나요?
                <br /> 이전 단계에서 이메일을 재확인하거나, 스팸함을 확인해
                주세요.
              </span>
            </div>
            <Button
              type="submit"
              disabled={verificationCode.length < 6 || isVerifying}
              className="mt-4"
            >
              {isVerifying ? "확인 중..." : "인증하기"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ScreenVerificationPage;
