import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import React, { useState, useEffect } from "react";

type VerificationStepProps = {
  email: string;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerify: (code: string, onError: () => void) => void;
  onResend: () => void;
  isVerifying?: boolean;
};

export const VerificationStep = ({
  email,
  verificationCode,
  onVerificationCodeChange,
  onVerify,
  onResend,
  isVerifying = false,
}: VerificationStepProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerificationCodeChange = (value: string) => {
    onVerificationCodeChange(value);
    if (isWrong && value) {
      setIsWrong(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(verificationCode, () => setIsWrong(true));
  };

  const handleResend = () => {
    setTimeLeft(300); // 타이머 리셋
    setIsWrong(false); // 에러 상태 초기화
    onResend();
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    const maskedLocal = local[0] + "*".repeat(local.length - 1);

    return `${maskedLocal}@${domain}`;
  };

  return (
    <section className="mt-10 flex w-full flex-1 flex-col items-start gap-8">
      <div className="flex flex-col">
        <span className="typo-13-600 text-color-flame-700">
          STEP 1 <span className="text-gray-300">/ 2</span>
        </span>
        <h1 className="typo-28-600 mt-4 mb-1 text-black">
          인증번호를 입력해주세요
        </h1>
        <h2 className="typo-16-500 text-gray-600">
          {maskEmail(email)}로 인증번호를 보냈어요
        </h2>
      </div>

      <form
        className="flex w-full flex-1 flex-col gap-4"
        onSubmit={handleSubmit}
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
              error={isWrong}
              maxLength={6}
              inputMode="numeric"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleResend}
              className="bg-bubble-background-white text-color-text-caption1 typo-18-600 h-[48px] w-[120px] shrink-0"
              shadow={false}
            >
              재전송
            </Button>
          </div>
          {isWrong && (
            <span className="typo-12-400 text-color-text-highlight">
              *인증번호를 다시 확인해 주세요
            </span>
          )}
        </div>
        <div className="mt-auto flex w-full flex-col gap-4">
          <div className="bg-color-gray-50-a80 w-full rounded-[16px] border-[#b3b3b34d] p-4 leading-0">
            <span className="typo-12-500 text-color-text-caption3">
              인증번호가 오지 않았나요?
              <br /> 이전 단계에서 이메일을 재확인하거나, 스팸함을 확인해주세요.
            </span>
          </div>

          <Button
            shadow={true}
            type="submit"
            disabled={!verificationCode.trim() || isVerifying}
          >
            {isVerifying ? "확인 중..." : "인증확인"}
          </Button>
        </div>
      </form>
    </section>
  );
};
