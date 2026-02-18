"use client";
import { BackButton } from "@/components/ui/BackButton";
import React, { useState } from "react";
import { EmailStep } from "./EmailStep";
import { VerificationStep } from "./VerificationStep";
import { PasswordStep } from "./PasswordStep";

export const ScreenRegister = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to send verification code
    // await sendVerificationCode(email);
    setStep(2);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to verify code
    // await verifyCode(email, verificationCode);
    setStep(3);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to complete registration
    // await registerUser(email, password);
    // Navigate to next step or complete registration
  };

  const handleResendCode = () => {
    // TODO: API call to resend verification code
    // await sendVerificationCode(email);
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
          onSubmit={handleVerificationSubmit}
          onResend={handleResendCode}
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
