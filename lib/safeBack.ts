import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * 브라우저의 앞/뒤로가기 이벤트를 완벽하게 추적하기 위해
 * window.history.state 내부에 고유 인덱스(__idx)를 주입하고,
 * 세션 스토리지에 해당 인덱스별 경로를 매핑합니다.
 */
if (typeof window !== "undefined") {
  // 초기 인덱스 부여
  const getIdx = () => window.history.state?.__idx ?? Date.now();

  if (window.history.state && typeof window.history.state === "object") {
    if (window.history.state.__idx === undefined) {
      window.history.replaceState(
        { ...window.history.state, __idx: getIdx() },
        "",
      );
    }
  } else {
    window.history.replaceState({ __idx: getIdx() }, "");
  }

  const saveUrl = (idx: number, url: string) => {
    try {
      const parsed = new URL(url, window.location.origin);
      sessionStorage.setItem(`hist_${idx}`, parsed.pathname);
    } catch {
      sessionStorage.setItem(`hist_${idx}`, url);
    }
  };

  // 현재 경로 저장
  saveUrl(getIdx(), window.location.pathname);

  // pushState 오버라이드: 새 인덱스 부여 및 저장
  const originalPushState = window.history.pushState;
  window.history.pushState = function (data, unused, url) {
    const currentIdx = getIdx();
    const nextIdx = currentIdx + 1;
    let newData = data;
    if (typeof data === "object" && data !== null) {
      newData = { ...data, __idx: nextIdx };
    } else if (data === undefined || data === null) {
      newData = { __idx: nextIdx };
    }

    if (url) {
      saveUrl(nextIdx, url.toString());
    }
    return originalPushState.call(this, newData, unused, url);
  };

  // replaceState 오버라이드: 현재 인덱스 유지하며 경로 갱신
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (data, unused, url) {
    const currentIdx = getIdx();
    let newData = data;
    if (typeof data === "object" && data !== null) {
      newData = { ...data, __idx: currentIdx };
    } else if (data === undefined || data === null) {
      newData = { __idx: currentIdx };
    }

    if (url) {
      saveUrl(currentIdx, url.toString());
    }
    return originalReplaceState.call(this, newData, unused, url);
  };
}

/**
 * 안전한 뒤로가기 유틸리티
 *
 * 브라우저 히스토리 상태(__idx)를 기반으로 직전 페이지의 정확한 경로를 알아냅니다.
 * 앞으로/뒤로가기 등 어떠한 조작에도 인덱스가 유지되므로 실제 방문한 부모 경로를 정확히 검증합니다.
 */
export function safeBack(
  router: AppRouterInstance,
  fallbackPath: string,
  expectedParentPath?: string,
) {
  if (typeof window === "undefined") return;

  const currentIdx = window.history.state?.__idx;
  if (currentIdx === undefined) {
    router.replace(fallbackPath);
    return;
  }

  // 직전 인덱스에 매핑된 경로 가져오기
  const previousPath = sessionStorage.getItem(`hist_${currentIdx - 1}`);

  if (expectedParentPath) {
    // 직전 경로가 우리가 기대하는 부모 경로와 일치할 때만 back()
    if (previousPath && previousPath.includes(expectedParentPath)) {
      router.back();
    } else {
      router.replace(fallbackPath);
    }
  } else {
    // 기대 부모가 명시되지 않은 경우 (예: 메인 허브)
    if (previousPath) {
      router.back();
    } else {
      router.replace(fallbackPath);
    }
  }
}
