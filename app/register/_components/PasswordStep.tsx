import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import React from "react";

type PasswordStepProps = {
  password: string;
  passwordConfirm: string;
  onPasswordChange: (password: string) => void;
  onPasswordConfirmChange: (passwordConfirm: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const PasswordStep = ({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  onSubmit,
}: PasswordStepProps) => {
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
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <FormInput
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label htmlFor="password-confirm" className="sr-only">
            비밀번호 확인
          </label>
          <FormInput
            id="password-confirm"
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => onPasswordConfirmChange(e.target.value)}
          />
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
