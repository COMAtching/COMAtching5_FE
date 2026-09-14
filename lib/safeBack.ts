import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// SPA 내부에서 실제 라우팅 이동(pushState 또는 popstate)이 있었는지 추적하는 전역 카운터
let internalNavCount = 0;

if (typeof window !== "undefined") {
  // router.push() 등 클라이언트 사이드 이동 감지
  const originalPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    internalNavCount++;
    return originalPushState.apply(this, args);
  };

  // 브라우저 뒤로가기/앞으로가기 감지
  window.addEventListener("popstate", () => {
    internalNavCount++;
  });
}

/**
 * 안전한 뒤로가기 유틸리티
 *
 * 사용자가 현재 브라우저 탭/창에서 앱 내부를 탐색한 이력(internalNavCount > 0)이 있으면
 * 안전하게 router.back()을 호출합니다.
 *
 * 외부 링크(구글 등)를 통해 들어왔거나, 새로고침, 혹은 URL을 직접 입력하여 진입한 직후(즉, internalNavCount === 0)라면
 * 뒤로가기 시 앱 밖으로 튕겨나가거나 무반응이 되므로 fallback 경로로 강제 이동(replace)시킵니다.
 */
export function safeBack(router: AppRouterInstance, fallbackPath: string) {
  if (typeof window !== "undefined" && internalNavCount > 0) {
    // 앱 내부에서 클릭 등을 통해 이동한 이력이 명확히 존재함
    router.back();
  } else {
    // 앱에 처음 진입한 직후이므로 뒤로갈 앱 내 히스토리가 없음
    router.replace(fallbackPath);
  }
}
