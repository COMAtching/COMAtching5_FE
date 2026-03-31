"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registerServiceWorkerAndGetToken } from "@/lib/firebase";
import { api } from "@/lib/axios";

const FCM_REGISTERED_KEY = "fcm_registered";
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/terms",
  "/privacy",
  "/reset",
];

export default function FcmInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // 공개 페이지에서는 실행 안 함
    const isPublicPath = PUBLIC_PATHS.some((path) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path),
    );
    if (isPublicPath) return;

    // 세션 당 1회만 실행 (페이지 이동마다 중복 등록 방지)
    if (sessionStorage.getItem(FCM_REGISTERED_KEY)) return;

    const registerFcmToken = async () => {
      try {
        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("[FCM] 알림 권한 거부됨. 토큰 등록 skip.");
          return;
        }

        // Firebase에서 FCM 토큰 발급
        const token = await registerServiceWorkerAndGetToken();
        if (!token) {
          console.warn("[FCM] 토큰 발급 실패.");
          return;
        }

        // 백엔드에 FCM 토큰 등록
        await api.post("/api/fcm/token", { token });

        // 세션 플래그 저장 (재등록 방지)
        sessionStorage.setItem(FCM_REGISTERED_KEY, "true");
        console.log("[FCM] 토큰 등록 완료.");
      } catch (error) {
        console.error("[FCM] 토큰 등록 중 오류:", error);
      }
    };

    registerFcmToken();
  }, [pathname]);

  return null;
}
