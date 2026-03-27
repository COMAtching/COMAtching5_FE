// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
);

let messaging = null;

// 메인 앱에서 Firebase Config를 받아서 초기화
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_FIREBASE") {
    const firebaseConfig = event.data.config;

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();

      // 백그라운드 알림 처리
      messaging.onBackgroundMessage((payload) => {
        console.log("[Service Worker] 백그라운드 메시지 수신:", payload);

        const notificationTitle = payload.notification?.title || "새 알림";
        const notificationOptions = {
          body: payload.notification?.body || "",
          icon: payload.notification?.icon || "/logo/logo.svg",
        };

        self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        );
      });
    }
  }
});
