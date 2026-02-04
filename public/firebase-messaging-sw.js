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
  apiKey: "AIzaSyDAE4IwNPU33dniaBSnHA7hjw33ByoQ-14",
  authDomain: "comatching-59f3e.firebaseapp.com",
  projectId: "comatching-59f3e",
  storageBucket: "comatching-59f3e.firebasestorage.app",
  messagingSenderId: "106298040488",
  appId: "1:106298040488:web:e4e7b9c54d55dcaab4229d",
  measurementId: "G-188J563VND",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 알림 처리
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] 백그라운드 메시지 수신:", payload);
  // 브라우저가 알아서 알림을 띄워주지만, 커스텀 하려면 여기에 작성
});
