"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setupForegroundMessageHandler } from "@/lib/firebase";
import { refreshPushToken } from "@/lib/push-preference";
import { IS_FIREBASE_ENABLED } from "@/lib/runtime-config";
import { isPushRoute } from "@/lib/push-routes";

export default function FcmInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    if (!IS_FIREBASE_ENABLED || !isPushRoute(pathname)) return;
    return setupForegroundMessageHandler() ?? undefined;
  }, [pathname]);

  useEffect(() => {
    if (!IS_FIREBASE_ENABLED || !("Notification" in window)) return;
    if (!isPushRoute(pathname)) return;
    let active = true;
    let busy = false;
    async function register() {
      if (busy || document.visibilityState !== "visible") return;
      busy = true;
      try {
        if (active && Notification.permission === "granted")
          await refreshPushToken();
      } catch {
        // The next protected navigation or focus retries with the current login cookies.
      } finally {
        busy = false;
      }
    }
    void register();
    window.addEventListener("focus", register);
    return () => {
      active = false;
      window.removeEventListener("focus", register);
    };
  }, [pathname]);
  return null;
}
