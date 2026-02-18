import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { Check, X } from "lucide-react";
import React, { useState } from "react";

type PasswordStepProps = {
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const PasswordStep = ({
  password,
  onPasswordChange,
  onSubmit,
}: PasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isLengthValid = password.length >= 8 && password.length <= 20;
  const isPatternValid = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

  return (
    <section className="mt-10 flex w-full flex-1 flex-col items-start gap-8">
      <div className="flex flex-col">
        <span className="typo-13-600 text-color-flame-700">
          STEP 2 <span className="text-gray-300">/ 2</span>
        </span>
        <h1 className="typo-28-600 mt-4 mb-1 text-black">
          비밀번호를 설정해주세요
        </h1>
        <h2 className="typo-16-500 text-gray-600">
          안전한 비밀번호로 계정을 보호하세요
        </h2>
      </div>

      <form className="flex w-full flex-1 flex-col gap-4" onSubmit={onSubmit}>
        <div className="relative flex w-full items-center">
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <FormInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="8자 이상 비밀번호 입력"
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={password ? "pr-20" : "pr-10"}
          />
          <div className="absolute right-2 flex items-center gap-[27px]">
            {password && (
              <button
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            )}
            {password && (
              <button
                type="button"
                aria-label="입력 초기화"
                onClick={() => onPasswordChange("")}
                className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-(--inputfield-close-stroke) bg-(--inputfield-close-fill) text-gray-400"
              >
                <X width={12} height={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
        <div className="typo-14-400 flex gap-[13px]">
          <span
            className={`flex items-center gap-1 ${!password || isLengthValid ? "text-[#808080]" : "text-[#FF4D61]"}`}
          >
            <Check width={14} height={14} strokeWidth={2.5} />
            8~20자 이내
          </span>
          <span
            className={`flex items-center gap-1 ${!password || isPatternValid ? "text-[#808080]" : "text-[#FF4D61]"}`}
          >
            <Check width={14} height={14} strokeWidth={2.5} />
            영문 대소문자, 숫자 포함
          </span>
        </div>

        <div className="mt-auto">
          <Button shadow={true} type="submit">
            완료
          </Button>
        </div>
      </form>
    </section>
  );
};
