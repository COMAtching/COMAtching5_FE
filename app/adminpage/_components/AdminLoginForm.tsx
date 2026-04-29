"use client";

import React, { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions/adminLoginAction";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, {
    success: false,
    message: "",
  });

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      {/* 이메일 */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-email"
          className="text-sm font-medium text-[#a0a3bd]"
        >
          아이디
        </label>
        <input
          id="admin-email"
          type="text"
          name="email"
          placeholder="아이디 입력"
          required
          autoComplete="username"
          className="h-12 w-full rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 text-sm font-medium text-white placeholder-[#4a4e69] transition-all duration-200 outline-none focus:border-[#ff4d61] focus:ring-1 focus:ring-[#ff4d61]/30"
        />
      </div>

      {/* 비밀번호 */}
      <div className="relative flex flex-col gap-2">
        <label
          htmlFor="admin-password"
          className="text-sm font-medium text-[#a0a3bd]"
        >
          비밀번호
        </label>
        <input
          id="admin-password"
          type="password"
          name="password"
          placeholder="비밀번호 입력"
          required
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-[#2a2d42] bg-[#0f1117] px-4 text-sm font-medium text-white placeholder-[#4a4e69] transition-all duration-200 outline-none focus:border-[#ff4d61] focus:ring-1 focus:ring-[#ff4d61]/30"
        />
        {!state.success && state.message && (
          <span className="absolute -bottom-5 left-0 text-xs font-medium text-[#ff4d61]">
            * {state.message}
          </span>
        )}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4d61] to-[#ff775e] text-base font-semibold text-white shadow-lg shadow-[#ff4d61]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[#ff4d61]/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            로그인 중...
          </div>
        ) : (
          "로그인"
        )}
      </button>
    </form>
  );
}
