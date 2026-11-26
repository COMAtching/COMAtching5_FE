"use client";

import { useEffect } from "react";
import { IS_FIREBASE_ENABLED } from "@/lib/runtime-config";

export default function PwaInitializer() {
  useEffect(() => {
    if ("caches" in window) {
      void caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => /^comatching-cache-v[123]$/.test(key))
              .map((key) => caches.delete(key)),
          ),
        )
        .catch(() => {});
    }
    if (!("serviceWorker" in navigator)) return;

    if (!IS_FIREBASE_ENABLED && process.env.NODE_ENV === "development") {
      const scriptUrl = new URL("/sw.js", window.location.origin).href;
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          const worker =
            registration.active ??
            registration.waiting ??
            registration.installing;
          if (worker?.scriptURL === scriptUrl) void registration.unregister();
        }
      });
      return;
    }

    if (!window.isSecureContext) return;
    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("PWA Service Worker registration failed:", error);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
