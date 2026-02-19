"use client";
import { BackButton } from "@/components/ui/BackButton";
import { useSendEmail } from "@/hooks/useSendEmail";
import { useSignUp } from "@/hooks/useSignUp";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import React, { useState } from "react";
import { EmailStep } from "./EmailStep";
import { VerificationStep } from "./VerificationStep";
import { PasswordStep } from "./PasswordStep";

export const ScreenRegister = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: sendEmail, isPending: isSendingEmail } = useSendEmail();
  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail();
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  const handleEmailSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendEmail(email, {
      onSuccess: () => setStep(2),
    });
  };

  const handleVerify = (code: string, onError: () => void) => {
    verifyEmail(
      { email, code },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            setStep(3);
          } else {
            onError();
          }
        },
        onError,
      },
    );
  };

  const handlePasswordSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            // TODO: 회원가입 완료 후 이동 (예: router.push("/login"))
          } else {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        },
        onError: () => alert("회원가입에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  const handleResendCode = () => {
    sendEmail(email, {
      onError: () => alert("재전송에 실패했습니다. 다시 시도해주세요."),
    });
  };

  return (
    <main className="flex min-h-dvh flex-col items-start px-4 pt-2 pb-[6.2vh]">
      <BackButton text="회원가입" />
      {step === 1 && (
        <EmailStep
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleEmailSubmit}
        />
      )}
      {step === 2 && (
        <VerificationStep
          email={email}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          onVerify={handleVerify}
          onResend={handleResendCode}
          isVerifying={isVerifyingEmail}
        />
      )}
      {step === 3 && (
        <PasswordStep
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </main>
  );
};
