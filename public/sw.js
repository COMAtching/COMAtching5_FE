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
    event.request.url.includes("firebase")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Offline fallback could go here
      });
    }),
  );
});
