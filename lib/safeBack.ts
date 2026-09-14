import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * 안전한 뒤로가기 유틸리티
 *
 * 브라우저에 이전 히스토리가 있으면 router.back()을 사용하고,
 * 직접 접근(URL 직타 등) 등으로 히스토리가 없으면 fallback 경로로 이동합니다.
 *
 * window.history.length가 1이면 이 페이지가 히스토리의 첫 항목이라는 의미이므로
 * back()이 앱 밖으로 이탈하거나 무응답이 됩니다.
 */
export function safeBack(router: AppRouterInstance, fallbackPath: string) {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
  } else {
    router.replace(fallbackPath);
  }
}
