const CACHE_NAME = "comatching-cache-v1";
const ASSETS_TO_CACHE = ["/", "/logo/icon.png", "/logo/comatching-logo.svg"];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Do not intercept FCM route or API calls
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("firebase") ||
    event.request.url.includes("/ws/")
  ) {
    return;
  }

  // HTML 문서 요청(Navigation)이거나 루트("/") 요청일 경우 Network First 전략 사용
  // 이유: 캐시된 예전 HTML이 새 빌드의 CSS/JS 청크를 참조하여 404가 발생하는 것을 방지
  if (
    event.request.mode === "navigate" ||
    new URL(event.request.url).pathname === "/"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // 2xx 성공 응답일 때만 캐시 갱신
          // 4xx·5xx 오류 응답으로 정상 캐시를 덮어쓰지 않도록 방지
          if (networkResponse.ok) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // 네트워크 실패 시 오프라인 캐시 반환
          return caches.match(event.request);
        }),
    );
    return;
  }

  // 그 외 정적 에셋은 기존처럼 Cache First 전략
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return new Response("Network Error", {
          status: 503,
          statusText: "Network Error",
          headers: { "Content-Type": "text/plain" },
        });
      });
    }),
  );
});
