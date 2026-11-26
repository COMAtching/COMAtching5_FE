try {
  importScripts("/firebase-messaging-sw.js");
} catch {
  // Offline safety and legacy cache cleanup also run when the push SDK is unavailable.
}

const CACHE_NAME = "comatching-cache-v4";
const OFFLINE = "/offline.html";
const PUBLIC_ASSETS = [OFFLINE, "/logo/icon.png", "/logo/comatching-logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PUBLIC_ASSETS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) => key.startsWith("comatching-cache-") && key !== CACHE_NAME,
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(OFFLINE)) || Response.error();
      }),
    );
  } else if (!url.search && PUBLIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(url.pathname)) || fetch(request);
      })(),
    );
  }
});
