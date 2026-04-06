"use client";
import React, { useState } from "react";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/validators";
import { useSendPasswordCode } from "@/hooks/useSendPasswordCode";

const ScreenPasswordResetPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "" });
  const sendCodeMutation = useSendPasswordCode();
  const { isPending } = sendCodeMutation;

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "" });

    if (!email) {
      setMessage({ text: "이메일을 입력해 주세요." });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ text: "이메일 형식이 잘못되었습니다." });
      return;
    }

    // 새로운 프로세스 시작 시 이전 잔여 세션이 있다면 초기화
    sessionStorage.removeItem("reset_verified");

    sendCodeMutation.mutate(email, {
      onSuccess: () => {
        sessionStorage.setItem("reset_email_to_verify", email);
        router.replace("/reset/password/verification");
      },
      onError: (error) => {
        setMessage({
          text:
            error.message || "이메일 전송에 실패했습니다. 다시 시도해 주세요.",
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col px-4 pb-10">
      <header className="py-4">
        <BackButton />
      </header>

      <main className="mt-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="typo-24-700 text-gray-900">비밀번호 변경</h2>
          <p className="typo-16-400 whitespace-pre-line text-gray-500">
            가입한 이메일을 입력해주세요.{"\n"}
            이메일 인증을 통해 비밀번호를 변경합니다.
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="typo-16-600 text-black">
              아이디(이메일)
            </label>
            <FormInput
              id="email"
              type="text"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="typo-14-500 text-color-flame-500 mt-1 min-h-[20px]">
              {message.text ? `*${message.text}` : ""}
            </p>
          </div>

          <Button
            type="submit"
            className="bg-button-primary text-button-primary-text-default mt-4"
            disabled={isPending}
          >
            {isPending ? "전송 중..." : "이메일 전송하기"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default ScreenPasswordResetPage;
