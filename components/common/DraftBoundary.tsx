"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/axios";
import { discardLegacyProfile, useProfileStore } from "@/stores/profile-store";

const steps = [
  "/onboarding",
  "/profile-builder",
  "/hobby-select",
  "/extra-info",
  "/profile-image",
];

export default function DraftBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const onboarding = steps.some(
    (s) => pathname === s || pathname.startsWith(s + "/"),
  );
  const owner = useProfileStore((s) => s.owner);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, retry] = useState(0);
  useEffect(() => {
    discardLegacyProfile();
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("comatching-auth-change");
    if (!onboarding) {
      useProfileStore.getState().bind(null);
      if (["/", "/main", "/adminpage", "/adminpage/main"].includes(pathname))
        channel?.postMessage("check");
      channel?.close();
      return;
    }
    if (pathname === "/onboarding") channel?.postMessage("check");
    let generation = 0;
    async function check() {
      const current = ++generation;
      setReady(false);
      if (document.visibilityState === "hidden") return;
      try {
        const response = await api.get<string>("/api/auth/session");
        if (current !== generation) return;
        useProfileStore.getState().bind(response.data);
        setFailed(false);
        setReady(true);
      } catch {
        if (current !== generation) return;
        useProfileStore.getState().bind(null);
        setFailed(true);
      }
    }
    void check();
    if (channel) channel.onmessage = check;
    const onHide = () => {
      generation++;
      setReady(false);
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", check);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      generation++;
      channel?.close();
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", check);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [onboarding, pathname, attempt]);
  if (!onboarding) return children;
  return (
    <>
      {(!ready || !owner) && (
        <div role="status">
          {failed ? (
            <button onClick={() => retry(attempt + 1)}>
              가입 세션 다시 확인
            </button>
          ) : (
            "가입 세션 확인 중…"
          )}
        </div>
      )}
      {owner && (
        <div key={owner} hidden={!ready} inert={!ready || undefined}>
          {children}
        </div>
      )}
    </>
  );
}
