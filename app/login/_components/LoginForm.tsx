"use client";
import BubbleDiv from "@/app/_components/BubbleDiv";
import Button from "@/components/ui/Button";
import { User } from "lucide-react";
import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/loginAction";

const INPUT_STYLE = {
  background:
    "linear-gradient(180deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.24) 100%)",
};
const INPUT_CLASSNAME =
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] leading-[19px] placeholder:text-[#B3B3B3]";

export const LoginForm = () => {
  // React 19: useActionState로 폼 상태 및 팬딩 처리 관리
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  return (
    <section className="mt-10 flex w-full flex-1 flex-col items-start gap-6">
      <form className="flex w-full flex-col gap-4" action={formAction}>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="email" className="typo-14-500 text-gray-700">
            아이디(이메일)
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="이메일 입력"
            required
            autoComplete="email"
            className={INPUT_CLASSNAME}
            style={INPUT_STYLE}
          />
        </div>

        <div className="relative mb-6 flex w-full flex-col gap-2">
          <label htmlFor="password" className="typo-14-500 text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            required
            autoComplete="current-password"
            className={INPUT_CLASSNAME}
            style={INPUT_STYLE}
          />
          {!state.success && (
            <span className="typo-12-400 text-color-flame-700 absolute bottom-[-25px] left-0">
              * 이메일 혹은 비밀번호가 틀립니다
            </span>
          )}
        </div>
        <Button shadow={true} type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
      <div className="typo-14-500 text-color-text-caption2 flex w-full justify-center">
        <Link href="/find-email" className="cursor-pointer">
          이메일 찾기
        </Link>
        <span className="mx-4">|</span>
        <Link href="/reset-password" className="cursor-pointer">
          비밀번호 변경
        </Link>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-4">
        <BubbleDiv w={162} h={26} typo="typo-12-600" top={3}>
          아직 계정이 없으신가요?!
        </BubbleDiv>
        <button
          type="button"
          className="typo-14-500 flex items-center gap-1 border-b-2 border-gray-500 text-gray-500"
        >
          <User />
          이메일로 회원가입
        </button>
      </div>
    </section>
  );
};
