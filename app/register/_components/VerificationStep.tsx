import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { useVerificationMailTimer } from "@/hooks/useVerificationMailTimer";
import React, { useState } from "react";

type VerificationStepProps = {
  email: string;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerify: (code: string, onError: (msg?: string) => void) => void;
  onResend: () => Promise<unknown>;
  isSending?: boolean;
  isVerifying?: boolean;
};

export const VerificationStep = ({
  email,
  verificationCode,
  onVerificationCodeChange,
  onVerify,
  onResend,
  isSending = false,
  isVerifying = false,
}: VerificationStepProps) => {
  const { timeLeft, resendCooldown, markSent, onFailure } =
    useVerificationMailTimer();
  const [errorMessage, setErrorMessage] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerificationCodeChange = (value: string) => {
    onVerificationCodeChange(value);
    if (errorMessage && value) {
      setErrorMessage("");
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onVerify(verificationCode, (msg?: string) =>
      setErrorMessage(msg || "인증번호를 다시 확인해 주세요."),
    );
  };

  const handleResend = async () => {
    if (isSending || resendCooldown > 0) return;
    try {
      await onResend();
      markSent();
      onVerificationCodeChange("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(onFailure(error));
    }
  };

  const maskEmail = (value: string) => {
    const [local, domain] = value.split("@");
    if (!local || !domain) return value;

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
          인증번호를 입력해 주세요
        </h1>
        <h2 className="typo-16-500 text-gray-600">
          {isSending ? (
            <LoadingSpinner
              variant="inline"
              label={`${maskEmail(email)}로 인증번호 전송 중`}
            />
          ) : (
            `${maskEmail(email)}로 인증번호를 보냈어요`
          )}
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
              error={!!errorMessage}
              maxLength={6}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSending}
              className="bg-bubble-background-white text-color-text-caption1 typo-18-600 h-12 w-[120px] shrink-0"
              shadow={false}
            >
              {isSending ? (
                <LoadingSpinner variant="inline" label="전송 중" />
              ) : resendCooldown > 0 ? (
                formatTime(resendCooldown)
              ) : (
                "재전송"
              )}
            </Button>
          </div>
          {errorMessage && (
            <span className="typo-12-400 text-color-text-highlight">
              *{errorMessage}
            </span>
          )}
        </div>

        <div className="mt-auto flex w-full flex-col gap-4">
          <div className="bg-color-gray-50-a80 w-full rounded-2xl border-[#b3b3b34d] p-4 leading-normal">
            <span className="typo-12-500 text-color-text-caption3">
              인증번호가 오지 않았나요?
              <br /> 이전 단계에서 이메일을 재확인하거나, 스팸함을 확인해
              주세요.
            </span>
          </div>

          <Button
            shadow={true}
            type="submit"
            disabled={verificationCode.length < 6 || isVerifying || isSending}
          >
            {isVerifying ? (
              <LoadingSpinner variant="inline" label="확인 중" />
            ) : (
              "인증확인"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};
