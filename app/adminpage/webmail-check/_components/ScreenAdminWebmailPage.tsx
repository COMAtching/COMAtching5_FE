"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRegisterHeader } from "../../_components/AdminHeader";
import { useVerifyWebmail, useResendWebmail } from "@/hooks/useAdminAuth";

const EMAIL_VALID_DURATION = 180;

export default function ScreenAdminWebmailPage() {
  const router = useRouter();
  const [values, setValues] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(EMAIL_VALID_DURATION);
  const [failCount, setFailCount] = useState(0);

  const verifyMutation = useVerifyWebmail();
  const resendMutation = useResendWebmail();

  useEffect(() => {
    const storedTimestamp = localStorage.getItem("emailSendTimestamp");
    if (!storedTimestamp) {
      localStorage.setItem("emailSendTimestamp", Date.now().toString());
    } else {
      const elapsed = Math.floor(
        (Date.now() - parseInt(storedTimestamp, 10)) / 1000,
      );
      const remaining = EMAIL_VALID_DURATION - elapsed;
      setTimeout(() => setTimeLeft(remaining > 0 ? remaining : 0), 0);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync();
      localStorage.setItem("emailSendTimestamp", Date.now().toString());
      setTimeLeft(EMAIL_VALID_DURATION);
      alert("인증코드가 재발송되었습니다.");
    } catch (error) {
      alert("재발송에 실패했습니다.");
    }
  };

  const handleVerify = async () => {
    const codeString = values.join("");
    if (codeString.length !== 6) {
      alert("6자리 숫자를 모두 입력해주세요.");
      return;
    }
    if (timeLeft <= 0) {
      alert("시간이 만료되었습니다. 재발송 버튼을 눌러주세요.");
      return;
    }

    try {
      await verifyMutation.mutateAsync(codeString);
      alert("인증에 성공했습니다.");
      router.push("/adminpage");
    } catch (error) {
      setFailCount((prev) => prev + 1);
      alert("인증코드가 일치하지 않습니다.");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      <AdminRegisterHeader />

      <main className="mt-10 flex flex-col items-center gap-6 p-6 md:px-[max(5vw,20px)]">
        <div
          onClick={handleVerify}
          className="flex w-full cursor-pointer flex-col gap-4 rounded-[24px] border border-white/30 bg-white p-10 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
        >
          <div className="border-none text-[32px] font-bold text-black">
            웹메일 인증하기
          </div>
          <div className="text-xl leading-relaxed font-medium text-[#858585]">
            이전 절차에서 입력한 웹메일로 6자리 숫자코드가 전송되었습니다.
            <br />
            이메일 코드는 3분 뒤에 만료되며, 최대 10번의 입력이 가능합니다.
            이후에는 재발송 버튼을 눌러 인증코드를 다시 받아 주십시오.
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 rounded-[24px] border border-white/30 bg-white p-10 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="flex gap-2 md:gap-4">
            {values.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 rounded-xl border-none bg-[#e5e5e5] text-center text-3xl font-bold text-black transition-all outline-none focus:ring-2 focus:ring-[#ff775e] md:h-16 md:w-16"
              />
            ))}
          </div>

          <div className="mt-4 flex w-full items-center justify-end gap-8">
            <div className="text-2xl font-medium text-[#858585]">
              {timeLeft > 0 ? (
                <>
                  남은 시간: {minutes}:{seconds.toString().padStart(2, "0")}
                </>
              ) : (
                "유효시간이 만료되었습니다."
              )}
            </div>
            <button
              onClick={handleResend}
              className="rounded-lg bg-[#ff775e] px-6 py-3 text-xl font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              재발송
            </button>
          </div>

          <div className="w-full text-right text-2xl font-semibold text-[#666]">
            인증이 가능한 횟수 {10 - failCount}회
          </div>
        </div>
      </main>
    </div>
  );
}
