// public/firebase-messaging-sw.js
// Service Worker는 Next.js 환경 밖에서 실행되어 환경변수에 접근 불가.
// Firebase Config 값을 직접 기입합니다.

importScripts(
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCmwNjO2gXNy92-FBguQUXvPcQDaVk7lD0",
  authDomain: "comatching5.firebaseapp.com",
  projectId: "comatching5",
  storageBucket: "comatching5.firebasestorage.app",
  messagingSenderId: "179266935580",
  appId: "1:179266935580:web:3b56e0f8cf763787f838d9",
  measurementId: "G-P0WBX4VND7",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 알림 처리
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] 백그라운드 메시지 수신:", payload);

  const notificationTitle = payload.notification?.title || "새 알림";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/logo/logo.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
