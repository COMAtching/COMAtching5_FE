"use client";

import { useEffect, useRef, useState } from "react";
import { IS_FIREBASE_ENABLED } from "@/lib/runtime-config";
import {
  readPushPreference,
  locallyMuted,
  setPushPreference,
} from "@/lib/push-preference";

function unavailable() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  const ios =
    /iPad|iPhone|iPod/.test(nav.userAgent) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  if (
    ios &&
    !nav.standalone &&
    !matchMedia("(display-mode: standalone)").matches
  )
    return "아이폰은 공유 → 홈 화면에 추가한 뒤, 홈 화면의 코매칭에서 켜 주세요.";
  if (
    !IS_FIREBASE_ENABLED ||
    !window.isSecureContext ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  )
    return "이 환경에서는 웹 푸시를 사용할 수 없어요.";
  if (Notification.permission === "denied")
    return ios
      ? "아이폰 설정 → 알림 → 코매칭에서 알림을 허용해 주세요."
      : "브라우저의 사이트 설정에서 코매칭 알림을 허용해 주세요.";
  return "";
}

export default function PushPreference() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const changing = useRef(false);
  const version = useRef(0);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (changing.current) return;
      const seq = ++version.current;
      const blocked = unavailable();
      setReason(blocked);
      setError("");
      if (blocked) {
        setEnabled(false);
        setBusy(false);
        return;
      }
      setBusy(true);
      try {
        const on = await readPushPreference();
        if (active && seq === version.current)
          setEnabled(
            on && !locallyMuted() && Notification.permission === "granted",
          );
      } catch {
        if (active && seq === version.current)
          setError("알림 설정을 확인하지 못했어요.");
      } finally {
        if (active && seq === version.current) setBusy(false);
      }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("push-preference-changed", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("push-preference-changed", refresh);
    };
  }, [reload]);

  const toggle = async () => {
    if (busy || reason || changing.current) return;
    changing.current = true;
    version.current++;
    setBusy(true);
    setError("");
    try {
      // iOS requires this call to occur in the click handler, before any network request.
      if (
        !enabled &&
        Notification.permission !== "granted" &&
        (await Notification.requestPermission()) !== "granted"
      ) {
        setReason(unavailable());
        setError("알림 권한이 허용되지 않았어요.");
        return;
      }
      await setPushPreference(!enabled);
      setEnabled(!enabled);
    } catch {
      setError("알림 설정을 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      changing.current = false;
      setBusy(false);
    }
  };

  return (
    <section
      aria-label="알림 설정"
      className="mx-4 mt-6 rounded-2xl border border-black/5 bg-white px-4 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="typo-16-700">이 기기 푸시 알림</h2>
          <p className="typo-14-500 mt-1 text-[#666]">
            채팅 메시지와 아이템 지급 알림
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="이 기기 푸시 알림"
          aria-checked={enabled}
          aria-busy={busy}
          disabled={Boolean(reason) || busy || Boolean(error)}
          onClick={toggle}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${enabled ? "bg-[#ff4d61]" : "bg-[#a6a6a6]"}`}
        >
          <span
            className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${enabled ? "translate-x-5" : ""}`}
          />
        </button>
      </div>
      {(reason || error) && (
        <p role="status" className="mt-3 text-sm text-[#666]">
          {reason || error}{" "}
          {!reason && (
            <button
              type="button"
              className="underline"
              onClick={() => setReload((i) => i + 1)}
            >
              다시 확인
            </button>
          )}
        </p>
      )}
    </section>
  );
}
