"use client";

import { useEffect } from "react";
import { api } from "@/lib/axios";
import { useFeatureStates, type FeatureState } from "@/stores/features";

export function ServiceStatusProvider() {
  useEffect(() => {
    const url = (api.defaults.baseURL ?? "") + "/api/public/operations";
    let pending: AbortController | undefined;
    let sequence = 0;
    const offline = () => {
      sequence++;
      useFeatureStates.getState().unavailable();
    };
    const refresh = async () => {
      if (document.visibilityState === "hidden") return;
      const reading = ++sequence;
      pending?.abort();
      const controller = new AbortController();
      pending = controller;
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const values: FeatureState[] = await res.json();
        if (reading === sequence) useFeatureStates.getState().update(values);
      } catch {
        if (reading === sequence) offline();
      } finally {
        window.clearTimeout(timeout);
        if (pending === controller) pending = undefined;
      }
    };
    void refresh();
    const events =
      typeof EventSource === "undefined"
        ? null
        : new EventSource(url + "/stream");
    events?.addEventListener("features", (event: MessageEvent<string>) => {
      try {
        sequence++;
        useFeatureStates
          .getState()
          .update(JSON.parse(event.data) as FeatureState[]);
      } catch {
        void refresh();
      }
    });
    events?.addEventListener("error", refresh);
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("offline", offline);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      sequence++;
      pending?.abort();
      events?.close();
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", refresh);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return null;
}
