"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registerServiceWorkerAndGetToken } from "@/lib/firebase";
import axios from "axios";

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

    // 🛡️ 페이지 이동 시 진행 중인 비동기 작업 취소를 위한 플래그
    let cancelled = false;

    const registerFcmToken = async () => {
      try {
        console.log(
          "[FCM] 권한 요청 중... (현재 상태:",
          Notification.permission,
          ")",
        );
        const permission = await Notification.requestPermission();
        if (cancelled) return;
        console.log("[FCM] 권한 요청 결과:", permission);

        if (permission !== "granted") {
          console.warn("[FCM] 알림 권한 거부됨. 상태:", permission);
          return;
        }

        const token = await registerServiceWorkerAndGetToken();
        if (cancelled) return;
        if (!token) {
          console.warn("[FCM] 토큰 발급 실패.");
          return;
        }

        // 백엔드에 FCM 토큰 등록
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/fcm/token`,
          { token },
          { withCredentials: true },
        );

        if (cancelled) return;

        sessionStorage.setItem(FCM_REGISTERED_KEY, "true");
        console.log("[FCM] 토큰 등록 완료.");
      } catch (error) {
        if (cancelled) return;
        console.error("[FCM] 토큰 등록 중 오류:", error);
      }
    };

    registerFcmToken();

    // 클린업: 페이지 이동 시 진행 중인 작업 취소
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
