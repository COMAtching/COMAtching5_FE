import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import React, { useState } from "react";

type EmailStepProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const EmailStep = ({
  email,
  onEmailChange,
  onSubmit,
}: EmailStepProps) => {
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (emailError && value) {
      setEmailError(!validateEmail(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    onSubmit(e);
  };

  return (
    <section className="mt-10 flex w-full flex-1 flex-col items-start gap-8">
      <div className="flex flex-col">
        <span className="typo-13-600 text-color-flame-700">
          STEP 1 <span className="text-gray-300">/ 2</span>
        </span>
        <h1 className="typo-28-600 mt-4 mb-1 text-black">
          이메일을 입력해주세요
        </h1>
        <h2 className="typo-16-500 text-gray-600">
          이메일은 로그인 시 아이디로 사용됩니다.
        </h2>
      </div>

      <form
        className="flex w-full flex-1 flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="email" className="sr-only">
            이메일
          </label>
          <FormInput
            id="email"
            type="email"
            name="email"
            placeholder="이메일 입력"
            autoComplete="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            error={emailError}
          />
          {emailError && (
            <span className="typo-12-400 text-color-text-highlight">
              *이메일 형식이 올바르지 않습니다.
            </span>
          )}
        </div>

        <div className="mt-auto">
          <Button shadow={true} type="submit">
            다음
          </Button>
        </div>
      </form>
    </section>
  );
};
