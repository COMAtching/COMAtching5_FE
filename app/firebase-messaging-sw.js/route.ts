import { NextResponse } from "next/server";
import { SDK_VERSION } from "firebase/app";
import { IS_FIREBASE_ENABLED } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = `importScripts("/push-privacy.js");
self.installComatchingPushPrivacy(${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)});`;
  if (!IS_FIREBASE_ENABLED) {
    return new NextResponse(guard, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-store",
      },
    });
  }
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const script = `
const firebaseConfig = ${JSON.stringify(firebaseConfig)};
${guard}
importScripts("https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-messaging-compat.js");

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
  if (String(payload.from) !== firebaseConfig.messagingSenderId || payload.notification ||
      !["CHAT", "ITEMS_GRANTED"].includes(payload.data?.type)) return;
  const grant = payload.data?.type === "ITEMS_GRANTED";
  return self.registration.showNotification("코매칭", {
    body: grant ? "아이템 지급이 완료되었습니다." : "새 메시지가 있습니다.",
    icon: "/logo/icon.png",
    tag: grant ? "comatching-grant" : "comatching-chat",
    data: { comatchingPush: true, grant }
  });
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
