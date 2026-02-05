// public/firebase-messaging-sw.js

// Firebase 라이브러리를 서비스 워커로 불러옵니다 (버전은 호환성을 위해 compat 사용 추천)
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
);

// 1. 아까 복사한 firebaseConfig 내용을 여기에도 똑같이 한 번 더 넣어줍니다.
// (서비스 워커는 메인 코드(firebase.ts)랑 별개로 돌아가서 설정이 또 필요해요)

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
  // 브라우저가 알아서 알림을 띄워주지만, 커스텀 하려면 여기에 작성
});
