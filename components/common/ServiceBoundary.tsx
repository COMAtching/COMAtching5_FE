"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BrowserSessionEnded,
  confirmBrowserSession,
  handleBrowserSessionEnd,
  isAdminPage,
} from "@/lib/browser-session";
import { useFeature } from "@/stores/features";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/reset",
  "/FAQ",
  "/terms",
  "/privacy",
];

export default function ServiceBoundary({ children }: { children: ReactNode }) {
  const path = usePathname();
  const master = useFeature("LOGIN");
  const admin = isAdminPage(path);
  const member =
    !admin &&
    !publicRoutes.some((base) => path === base || path.startsWith(base + "/"));
  const open = master?.open;
  const version = master?.version;

  useEffect(() => {
    if (admin) {
      if (path === "/adminpage" || path === "/adminpage/") return;
    } else {
      if (open === undefined) return;
      if (!open && path !== "/") {
        window.location.replace("/");
        return;
      }
      if (!open || !member) return;
    }
    let active = true;
    // A suspended tab can miss both the closure and its subsequent reopening.
    const verify = () => {
      if (document.visibilityState === "hidden") return;
      void confirmBrowserSession().catch((error) => {
        if (!active || !(error instanceof BrowserSessionEnded)) return;
        if (admin) handleBrowserSessionEnd(error);
        else window.location.replace("/");
      });
    };
    verify();
    window.addEventListener("pageshow", verify);
    document.addEventListener("visibilitychange", verify);
    return () => {
      active = false;
      window.removeEventListener("pageshow", verify);
      document.removeEventListener("visibilitychange", verify);
    };
  }, [admin, member, open, path, version]);

  if (admin || open) return children;
  if (!master)
    return <LoadingSpinner variant="screen" label="운영 상태 확인 중" />;
  return (
    <main className="flex min-h-dvh flex-col justify-center px-7 py-12">
      <Image
        src="/logo/comatching-logo.svg"
        width={116}
        height={24}
        alt="코매칭"
      />
      <h1 className="mt-7 text-3xl leading-tight font-bold">
        서비스 운영이
        <br />
        종료됐어요
      </h1>
      {master.message?.trim() && (
        <p
          role="status"
          className="mt-4 leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line text-gray-700"
        >
          {master.message}
        </p>
      )}
      <p className="mt-3 text-sm text-[#70646b]">
        운영이 재개되면 다시 로그인해 주세요.
      </p>
    </main>
  );
}
