"use client";
import { showAppAlert } from "@/lib/app-alert";
import { verificationMailError } from "@/hooks/useVerificationMailTimer";
import { BackButton } from "@/components/ui/BackButton";
import { useSendEmail } from "@/hooks/useSendEmail";
import { useSignUp } from "@/hooks/useSignUp";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EmailStep } from "./EmailStep";
import { VerificationStep } from "./VerificationStep";
import { PasswordStep } from "./PasswordStep";

export const ScreenRegister = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: sendEmail,
    mutateAsync: resendEmail,
    isPending: isSendingEmail,
  } = useSendEmail();
  const { verify, isPending: isVerifyingEmail } = useVerifyEmail();
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  const handleEmailSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSendingEmail) return;
    sendEmail(email, {
      onSuccess: () => {
        setVerificationCode("");
        setStep(2);
      },
      onError: (error) => showAppAlert(verificationMailError(error)),
    });
  };

  const handleVerify = (code: string, onError: (msg?: string) => void) => {
    verify(
      { email, code },
      {
        onSuccess: () => setStep(3),
        onError,
      },
    );
  };

  const handlePasswordSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningUp) return;
    signUp(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            showAppAlert("가입이 완료되었습니다.", () => router.push("/login"));
          } else {
            showAppAlert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        },
        onError: (error) => {
          const message =
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : "회원가입에 실패했습니다. 다시 시도해주세요.";
          if (
            axios.isAxiosError(error) &&
            (error.response?.data?.code === "AUTH-002" ||
              !error.response ||
              error.response.status >= 500)
          ) {
            setVerificationCode("");
            setPassword("");
            setStep(1);
            showAppAlert(
              "가입을 완료하지 못했습니다. 이메일을 다시 인증해주세요.",
            );
            return;
          }
          showAppAlert(message, () => {
            if (
              axios.isAxiosError(error) &&
              error.response?.data?.code === "MEM-002"
            ) {
              router.replace("/login");
            }
          });
        },
      },
    );
  };

  return (
    <main className="flex min-h-dvh flex-col items-start px-4 pt-2 pb-[6.2vh]">
      <BackButton text="회원가입" />
      {step === 1 && (
        <EmailStep
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleEmailSubmit}
          isSending={isSendingEmail}
        />
      )}
      {step === 2 && (
        <VerificationStep
          email={email}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          onVerify={handleVerify}
          onResend={() => resendEmail(email)}
          isSending={isSendingEmail}
          isVerifying={isVerifyingEmail}
        />
      )}
      {step === 3 && (
        <PasswordStep
          isSubmitting={isSigningUp}
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </main>
  );
};
