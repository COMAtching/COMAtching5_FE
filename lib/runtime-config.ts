// NEXT_PUBLIC_*는 브라우저 번들에 포함되므로 변경 후 dev 재시작/운영 재빌드가 필요하다.
// 개발은 외부 연동을 명시적으로 켜고, 운영은 기존 Firebase 동작을 유지한다.
export const IS_FIREBASE_ENABLED =
  (process.env.NEXT_PUBLIC_FIREBASE_ENABLED ??
    (process.env.NODE_ENV === "development" ? "false" : "true")) === "true";
