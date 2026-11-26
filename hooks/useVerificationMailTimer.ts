import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";

export function retryAfterSeconds(error: unknown): number {
  if (!isAxiosError(error) || error.response?.status !== 429) return 0;
  const value = Number(
    error.response.headers["retry-after"] ??
      error.response.data?.data?.retryAfterSeconds,
  );
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 60;
}

export function verificationMailError(error: unknown): string {
  const retry = retryAfterSeconds(error);
  if (retry > 0) return `${retry}초 후에 인증 메일을 다시 요청해주세요.`;
  return isAxiosError(error) && error.response?.data?.message
    ? error.response.data.message
    : "인증 메일을 보내지 못했습니다. 다시 시도해주세요.";
}

export function useVerificationMailTimer() {
  const [now, setNow] = useState(Date.now);
  const [expiresAt, setExpiresAt] = useState(now + 300_000);
  const [resendAt, setResendAt] = useState(now + 60_000);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, []);

  const markSent = useCallback((sentAt = Date.now()) => {
    setExpiresAt(sentAt + 300_000);
    setResendAt(sentAt + 60_000);
    setNow(Date.now());
  }, []);
  const onFailure = (error: unknown) => {
    const retry = retryAfterSeconds(error);
    if (retry) setResendAt(Date.now() + retry * 1000);
    return verificationMailError(error);
  };
  return {
    timeLeft: Math.max(0, Math.ceil((expiresAt - now) / 1000)),
    resendCooldown: Math.max(0, Math.ceil((resendAt - now) / 1000)),
    markSent,
    onFailure,
  };
}
