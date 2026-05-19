import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Firebase SDK 버전은 package.json과 일치시킵니다. (현재 12.8.0 확인됨)
  const script = `
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js");

const firebaseConfig = ${JSON.stringify(firebaseConfig)};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const messaging = firebase.messaging();

// 서비스 워커 업데이트 즉시 활성화 및 클라이언트 제어 권한 획득
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log(
    "%c🔔 [Service Worker FCM] 백그라운드 알림 수신!",
    "background: #111827; color: #06b6d4; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
  );
  console.log("👉 페이로드 전체 구조:", JSON.stringify(payload, null, 2));

  // 1. 만약 payload.notification 필드가 존재한다면, FCM SDK가 백그라운드에서 자동으로 알림을 보여줍니다.
  // 이 상황에서 수동으로 showNotification을 또 부르면 알림이 2개 뜨게 되므로 수동 팝업은 패스합니다!
  if (payload.notification) {
    console.log("[Service Worker] notification 필드 존재로 인한 자동 알림 완료. 수동 노출 생략.");
    return;
  }

  // 2. 오직 payload.notification이 없고 payload.data만 있는 'Data-only Message' 형태일 때만 수동으로 띄웁니다.
  if (payload.data) {
    const notificationTitle = payload.data.title || "새 알림";
    
    // 알림이 쌓여서 스팸 감지(도배)되는 현상을 방지하기 위해 고유 태그(tag) 지정
    // tag가 같으면 이전 알림을 덮어쓰고, renotify: true로 진동/사운드만 다시 울립니다.
    const tag = payload.data.roomId ? "comatching-room-" + payload.data.roomId : "comatching-chat";
    
    const notificationOptions = {
      body: payload.data.body || payload.data.message || "",
      icon: payload.data.icon || "/logo/logo.svg",
      tag: tag,
      renotify: true,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
  `;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
