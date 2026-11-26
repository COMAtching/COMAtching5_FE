"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  registerServiceWorkerAndGetToken,
  setupForegroundMessageHandler,
} from "@/lib/firebase";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
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
        await api.post("/api/members/push-installation");
        if (!active || (await Notification.requestPermission()) !== "granted")
          return;
        const token = await registerServiceWorkerAndGetToken();
        if (!active || !token) return;
        try {
          await api.post("/api/fcm/token", { token });
        } catch (error) {
          if (
            !active ||
            !isAxiosError(error) ||
            error.response?.data?.code !== "PUSH_TOKEN_IN_USE"
          )
            throw error;
          const fresh = await registerServiceWorkerAndGetToken(true);
          if (active && fresh)
            await api.post("/api/fcm/token", { token: fresh });
        }
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
