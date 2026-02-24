import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import {
  validatePasswordLength,
  validatePasswordPattern,
} from "@/lib/validators";
import { Check, Eye, EyeOff, X } from "lucide-react";
import React, { useState } from "react";

type PasswordStepProps = {
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export const PasswordStep = ({
  password,
  onPasswordChange,
  onSubmit,
}: PasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isLengthValid = validatePasswordLength(password);
  const isPatternValid = validatePasswordPattern(password);
  const isPasswordValid = isLengthValid && isPatternValid;

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
                  <EyeOff width={18} height={18} strokeWidth={2} />
                ) : (
                  <Eye width={18} height={18} strokeWidth={2} />
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
        <div className="typo-14-400 flex flex-col gap-[8px]">
          <span
            className={`flex items-center gap-1 ${password && isLengthValid ? "text-color-text-highlight" : "text-color-text-caption2"}`}
          >
            <Check
              width={14}
              height={14}
              strokeWidth={2.5}
              className={
                password && isLengthValid
                  ? "stroke-color-text-highlight"
                  : "stroke-color-text-caption2"
              }
            />
            8자 이상 20자 이하
          </span>
          <span
            className={`flex items-center gap-1 ${password && isPatternValid ? "text-color-text-highlight" : "text-color-text-caption2"}`}
          >
            <Check
              width={14}
              height={14}
              strokeWidth={2.5}
              className={
                password && isPatternValid
                  ? "stroke-color-text-highlight"
                  : "stroke-color-text-caption2"
              }
            />
            영문, 숫자, 특수문자(@$!%*#?&) 포함
          </span>
        </div>

        <div className="mt-auto">
          <Button shadow={true} type="submit" disabled={!isPasswordValid}>
            완료
          </Button>
        </div>
      </form>
    </section>
  );
};
