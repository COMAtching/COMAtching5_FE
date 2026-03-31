"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics (브라우저에서만 실행)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// 서비스 워커가 active 상태가 될 때까지 기다리는 헬퍼
function waitForServiceWorkerActive(
  registration: ServiceWorkerRegistration,
): Promise<ServiceWorker> {
  return new Promise((resolve) => {
    if (registration.active) {
      resolve(registration.active);
      return;
    }
    const sw = registration.installing ?? registration.waiting;
    if (!sw) {
      // fallback: navigator.serviceWorker.ready 사용
      navigator.serviceWorker.ready.then((r) => resolve(r.active!));
      return;
    }
    sw.addEventListener("statechange", function handler() {
      if (sw.state === "activated") {
        sw.removeEventListener("statechange", handler);
        resolve(sw);
      }
    });
  });
}

// 서비스 워커 등록 및 FCM 토큰 가져오기
export async function registerServiceWorkerAndGetToken() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    // 서비스 워커 등록
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // 서비스 워커가 완전히 active 상태가 될 때까지 대기
    const activeSW = await waitForServiceWorkerActive(registration);

    // 서비스 워커에 Firebase Config 전달 (active 보장 후)
    activeSW.postMessage({
      type: "INIT_FIREBASE",
      config: firebaseConfig,
    });

    // Messaging 인스턴스 가져오기
    const messaging = getMessaging(app);

    // FCM 토큰 요청
    const rawVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();

    if (!rawVapidKey) {
      console.warn(
        "[FCM] VAPID Key가 설정되지 않았습니다. .env 를 확인해주세요.",
      );
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: rawVapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);

    // 포그라운드 메시지 수신 리스너
    onMessage(messaging, (payload) => {
      console.log("[Foreground] 메시지 수신:", payload);
      // 여기에 포그라운드 알림 UI 처리
    });

    return token;
  } catch (error) {
    console.error("서비스 워커 등록 실패:", error);
    return null;
  }
}

export { app, analytics };
