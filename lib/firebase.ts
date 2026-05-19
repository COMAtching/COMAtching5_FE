"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useToastStore } from "@/stores/toast-store";

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

    // 87자(미패딩)인 경우 88자(패딩)로 보정하거나 Uint8Array로 변환하여 브라우저 호환성 확보
    // 유저 요청에 따라 변환 로직 삭제하고 직접 사용
    const vapidKey = rawVapidKey.replace(/["']/g, "");

    console.log("[FCM] getToken 시도 중...");
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);

    // 포그라운드 메시지 수신 리스너
    onMessage(messaging, (payload) => {
      console.log(
        "%c🔔 [Firebase Cloud Messaging] 포그라운드 알림 수신!",
        "background: #1e1b4b; color: #a855f7; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      );
      console.log(
        "👉 수신된 알림 전체 구조:",
        JSON.stringify(payload, null, 2),
      );
      console.dir(payload);

      // FCM 메시지 수신 커스텀 이벤트 디스패치 (채팅방 목록 등에서 실시간 최신화에 활용)
      if (typeof window !== "undefined" && payload.data?.roomId) {
        window.dispatchEvent(
          new CustomEvent("fcm-chat-received", { detail: payload }),
        );
      }

      // 채팅 메시지 알림이고, 사용자가 현재 해당 채팅방 안에 있다면 토스트 알림을 띄우지 않습니다.
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const chatRoomMatch = pathname.match(/^\/chat\/([^/]+)/);
      const currentChatId = chatRoomMatch ? chatRoomMatch[1] : null;
      const payloadRoomId = payload.data?.roomId;

      if (payloadRoomId && currentChatId === payloadRoomId) {
        console.log(
          `[FCM] 현재 활성화된 채팅방(${payloadRoomId})의 메시지이므로 인앱 알림을 표시하지 않습니다.`,
        );
        return;
      }

      // notification 이나 data 필드에서 어떻게든 정보를 추출합니다.
      const title =
        payload.notification?.title || payload.data?.title || "새로운 알림";
      const body =
        payload.notification?.body ||
        payload.data?.body ||
        payload.data?.message ||
        "";

      // 커스텀 인앱 토스트 알림 노출
      useToastStore.getState().showToast({
        title,
        body,
        link: payload.data?.roomId ? `/chat/${payload.data.roomId}` : undefined,
      });

      // 포그라운드 알림 수신 시 전역 커스텀 이벤트 발행 (메인 페이지 등 실시간 갱신용)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("fcm-message-received", { detail: payload }),
        );
      }
    });

    return token;
  } catch (error) {
    console.error("서비스 워커 등록 실패:", error);
    return null;
  }
}

export { app, analytics };
