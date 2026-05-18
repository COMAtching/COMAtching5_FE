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

messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] 백그라운드 메시지 수신:", payload);

  // 1. 만약 payload.notification 필드가 존재한다면, FCM SDK가 백그라운드에서 자동으로 알림을 보여줍니다.
  // 이 상황에서 수동으로 showNotification을 또 부르면 알림이 2개 뜨게 되므로 수동 팝업은 패스합니다!
  if (payload.notification) {
    console.log("[Service Worker] notification 필드 존재로 인한 자동 알림 완료. 수동 노출 생략.");
    return;
  }

  // 2. 오직 payload.notification이 없고 payload.data만 있는 'Data-only Message' 형태일 때만 수동으로 띄웁니다.
  if (payload.data) {
    const notificationTitle = payload.data.title || "새 알림";
    const notificationOptions = {
      body: payload.data.body || payload.data.message || "",
      icon: payload.data.icon || "/logo/logo.svg",
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
