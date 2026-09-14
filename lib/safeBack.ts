import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// 현재 브라우저 탭 내에서의 라우팅 히스토리를 추적하는 배열
const pathHistory: string[] = [];

if (typeof window !== "undefined") {
  // 초기 진입 경로 저장
  pathHistory.push(window.location.pathname);

  const originalPushState = window.history.pushState;
  window.history.pushState = function (data, unused, url) {
    if (url) {
      try {
        const parsedUrl = new URL(url.toString(), window.location.origin);
        pathHistory.push(parsedUrl.pathname);
      } catch (e) {
        pathHistory.push(url.toString());
      }
    }
    return originalPushState.apply(this, [data, unused, url]);
  };

  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (data, unused, url) {
    if (url) {
      try {
        const parsedUrl = new URL(url.toString(), window.location.origin);
        if (pathHistory.length > 0) {
          pathHistory[pathHistory.length - 1] = parsedUrl.pathname;
        } else {
          pathHistory.push(parsedUrl.pathname);
        }
      } catch (e) {
        if (pathHistory.length > 0) {
          pathHistory[pathHistory.length - 1] = url.toString();
        }
      }
    }
    return originalReplaceState.apply(this, [data, unused, url]);
  };

  window.addEventListener("popstate", () => {
    pathHistory.pop();
    if (pathHistory.length === 0) {
      pathHistory.push(window.location.pathname);
    }
  });
}

/**
 * 안전한 뒤로가기 유틸리티
 *
 * @param router Next.js AppRouterInstance
 * @param fallbackPath 히스토리가 없거나 부모 경로가 일치하지 않을 때 돌아갈 강제 경로
 * @param expectedParentPath (Optional) router.back()을 실행하기 위해 기대하는 직전 경로.
 *                           이 값이 주어지면, 직전 경로가 이 값과 일치(혹은 포함)할 때만 back()을 실행합니다.
 */
export function safeBack(
  router: AppRouterInstance,
  fallbackPath: string,
  expectedParentPath?: string,
) {
  if (typeof window === "undefined") return;

  const previousPath =
    pathHistory.length > 1 ? pathHistory[pathHistory.length - 2] : null;

  // 1. 기대하는 부모 경로가 명시된 경우 (예: 하위 룰렛 -> /roulette)
  if (expectedParentPath) {
    if (previousPath && previousPath.includes(expectedParentPath)) {
      router.back();
    } else {
      router.replace(fallbackPath);
    }
    return;
  }

  // 2. 기대 부모 경로가 명시되지 않은 일반적인 경우 (예: 메인 허브 -> 이전 방문지)
  if (pathHistory.length > 1) {
    router.back();
  } else {
    router.replace(fallbackPath);
  }
}
