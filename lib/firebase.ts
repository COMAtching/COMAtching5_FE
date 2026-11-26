"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
} from "firebase/messaging";
import type { Unsubscribe } from "firebase/messaging";
import { useToastStore } from "@/stores/toast-store";
import { chatPushTitle } from "@/public/chat-push-title.js";
import { BROWSER_API_URL } from "@/lib/browser-session";
import { chatPushPath } from "@/lib/push-routes";
import { IS_FIREBASE_ENABLED } from "@/lib/runtime-config";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (중복 초기화 방지)
const app = IS_FIREBASE_ENABLED
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

// Analytics (브라우저에서만 실행, 유효한 설정이 있을 때만)
if (
  app &&
  typeof window !== "undefined" &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes("your_")
) {
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn(
      "[Firebase] Analytics 초기화 실패 (로컬 환경에서는 무시됩니다):",
      e,
    );
  }
}

// 서비스 워커 등록 및 FCM 토큰 가져오기 (토큰만 반환, 리스너 등록 안 함)
export async function registerServiceWorkerAndGetToken(rotate = false) {
  if (
    !app ||
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return null;
  }

  try {
    // 서비스 워커 등록 (PWA와 FCM을 통합한 sw.js로 등록)
    const registration = await navigator.serviceWorker.register("/sw.js");

    // 서비스 워커가 준비될 때까지 대기 (no active Service Worker 에러 방지)
    await navigator.serviceWorker.ready;

    // Messaging 인스턴스 가져오기
    const messaging = getMessaging(app);

    // FCM 토큰 요청
    const rawVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();
    console.log(
      "[FCM] VAPID Key 존재 여부:",
      !!rawVapidKey,
      "길이:",
      rawVapidKey?.length,
      "값: ",
      rawVapidKey,
    );

    if (!rawVapidKey) {
      console.warn(
        "[FCM] VAPID Key가 설정되지 않았습니다. .env 를 확인해주세요.",
      );
      return null;
    }

    // 유저 요청에 따라 변환 로직 삭제하고 직접 사용
    const vapidKey = rawVapidKey.replace(/["']/g, "");

    console.log("[FCM] getToken 시도 중...");
    if (rotate) await deleteToken(messaging);
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("서비스 워커 등록 실패:", error);
    return null;
  }
}

export function setupForegroundMessageHandler(): Unsubscribe | null {
  if (!app || typeof window === "undefined") return null;
  try {
    let subscribed = true;
    const unsubscribe = onMessage(getMessaging(app), async (payload) => {
      if (
        String(payload.from) !== firebaseConfig.messagingSenderId ||
        payload.notification ||
        !["CHAT", "ITEMS_GRANTED"].includes(payload.data?.type ?? "")
      )
        return;
      const grant = payload.data?.type === "ITEMS_GRANTED";
      if (!grant) window.dispatchEvent(new Event("fcm-chat-received"));
      const title = grant
        ? "코매칭"
        : await chatPushTitle(BROWSER_API_URL, payload.data?.chatRef);
      if (!subscribed) return;
      useToastStore.getState().showToast({
        title,
        body: grant ? "아이템 지급이 완료되었습니다." : "새 메시지가 있습니다.",
        link: grant ? "/main" : chatPushPath(payload.data?.chatRef),
      });
    });
    return () => {
      subscribed = false;
      unsubscribe();
    };
  } catch (error) {
    console.error("[FCM] 포그라운드 리스너 등록 실패", error);
    return null;
  }
}
