"use client";

import React, { useState, useEffect, startTransition } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import {
  validatePasswordLength,
  validatePasswordPattern,
} from "@/lib/validators";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useResetPassword } from "@/hooks/useResetPassword";

const ScreenNewPasswordPage = () => {
  const router = useRouter();
  const { mutate, isPending } = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 인증 여부 및 필수 정보 확인 로직
  useEffect(() => {
    const savedData = sessionStorage.getItem("COMATCHING_PW_RESET");
    if (!savedData) {
      alert(
        "잘못된 접근이거나 인증 정보가 만료되었습니다. 다시 시도해 주세요.",
      );
      router.replace("/reset/password");
      return;
    }

    try {
      const { email, authCode, isVerified: verified } = JSON.parse(savedData);

      if (verified !== true || !email || !authCode) {
        alert(
          "잘못된 접근이거나 인증 정보가 만료되었습니다. 다시 시도해 주세요.",
        );
        router.replace("/reset/password");
      } else {
        startTransition(() => {
          setIsVerified(true);
        });
      }
    } catch {
      router.replace("/reset/password");
    }
  }, [router]);

  const isLengthValid = validatePasswordLength(password);
  const isPatternValid = validatePasswordPattern(password);
  const isMatch = password === confirmPassword && confirmPassword !== "";
  const canSubmit = isLengthValid && isPatternValid && isMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;

    const savedData = sessionStorage.getItem("COMATCHING_PW_RESET");
    if (!savedData) return;
    const { email, authCode: code } = JSON.parse(savedData);

    mutate(
      { email, authCode: code, newPassword: password },
      {
        onSuccess: () => {
          sessionStorage.removeItem("COMATCHING_PW_RESET");
          router.replace("/reset/password/success");
        },

        onError: (error) => {
          setErrorMessage(
            error.message ||
              "비밀번호 변경에 실패했습니다. 다시 시도해 주세요.",
          );
        },
      },
    );
  };

  // 렌더링 조건을 변수로 추출하여 훅 호출 순서 관련 잠재적 이슈 방지
  const content =
    isVerified === null ? null : (
      <div className="flex h-dvh flex-col px-4">
        <header className="flex items-center justify-center pt-5">
          <Image
            src="/logo/comatching-logo.svg"
            alt="COMatching Logo"
            width={96}
            height={16}
            priority
          />
        </header>

        <main className="mt-10 flex w-full flex-1 flex-col items-start gap-8">
          <div className="flex flex-col text-left">
            <h1 className="typo-28-600 mt-4 mb-1 text-left whitespace-pre-line text-black">
              새로운 비밀번호를{"\n"}설정해 주세요
            </h1>
            <h2 className="typo-16-500 text-left text-gray-600">
              안전한 비밀번호로 계정을 보호하세요
            </h2>
          </div>

          <form
            className="flex w-full flex-1 flex-col gap-6"
            onSubmit={handleSubmit}
          >
            {/* 새 비밀번호 입력 */}
            <div className="flex flex-col gap-2 text-left">
              <label className="typo-14-500 ml-1 text-left text-gray-700">
                새 비밀번호
              </label>
              <div className="relative flex w-full items-center">
                <FormInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="8자 이상 비밀번호 입력"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={password ? "pr-20" : "pr-10"}
                />
                <div className="absolute right-2 flex items-center gap-2">
                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex items-center text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                  {password && (
                    <button
                      type="button"
                      onClick={() => setPassword("")}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>

              {/* 비밀번호 조건 체크 */}
              <div className="typo-14-400 mt-1 flex flex-col gap-1 text-left">
                <span
                  className={`flex items-center gap-1 ${password && isLengthValid ? "text-color-text-highlight" : "text-color-text-caption2"}`}
                >
                  <Check
                    size={14}
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
                    size={14}
                    className={
                      password && isPatternValid
                        ? "stroke-color-text-highlight"
                        : "stroke-color-text-caption2"
                    }
                  />
                  영문, 숫자, 특수문자(@$!%*#?&) 포함
                </span>
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="flex flex-col gap-2 text-left">
              <label className="typo-14-500 ml-1 text-left text-gray-700">
                비밀번호 확인
              </label>
              <div className="relative flex w-full items-center">
                <FormInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="비밀번호 재입력"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={confirmPassword ? "pr-20" : "pr-10"}
                />
                <div className="absolute right-2 flex items-center gap-2">
                  {confirmPassword && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="flex items-center text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  )}
                  {confirmPassword && (
                    <button
                      type="button"
                      onClick={() => setConfirmPassword("")}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
              {confirmPassword && !isMatch && (
                <span className="typo-12-400 text-color-flame-700 ml-1 block text-left">
                  * 비밀번호가 일치하지 않습니다.
                </span>
              )}
              {confirmPassword && isMatch && (
                <span className="typo-12-400 text-color-text-highlight ml-1 block text-left">
                  * 비밀번호가 일치합니다.
                </span>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              {errorMessage && (
                <span className="typo-12-400 text-color-flame-700 block text-center">
                  *{errorMessage}
                </span>
              )}
              <Button
                type="submit"
                disabled={!canSubmit || isPending}
                fixed
                bottom={16}
              >
                {isPending ? "변경 중..." : "비밀번호 변경하기"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    );

  return content;
};

export default ScreenNewPasswordPage;
