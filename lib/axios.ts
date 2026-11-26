import axios from "axios";

import {
  BROWSER_API_URL,
  handleBrowserSessionEnd,
  confirmBrowserSession,
  EXPECTED_SESSION,
  forgetBrowserSession,
  requestSessionOwner,
} from "@/lib/browser-session";
import { useFeatureStates } from "@/stores/features";

export const api = axios.create({
  baseURL: BROWSER_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function isProtected(path: string | undefined) {
  const route = path?.split(/[?#]/, 1)[0] ?? "";
  return (
    /^\/api\/(?:members|items|matching|chat|fcm|notices|v1)(?:\/|$)/.test(
      route,
    ) ||
    /^\/api\/auth\/(?:session|signup\/profile|password\/change|withdraw|logout)$/.test(
      route,
    )
  );
}

api.interceptors.request.use(async (config) => {
  if (
    typeof window !== "undefined" &&
    isProtected(config.url) &&
    !config.headers.has(EXPECTED_SESSION)
  ) {
    try {
      config.headers.set(EXPECTED_SESSION, await requestSessionOwner());
    } catch (error) {
      handleBrowserSessionEnd(error);
      throw error;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (
      response.config.url === "/api/auth/logout" ||
      response.config.url === "/api/auth/withdraw"
    ) {
      const owner = response.config.headers.get(EXPECTED_SESSION);
      if (typeof owner === "string") forgetBrowserSession(owner);
    }
    return response;
  },
  async (error) => {
    if (
      error.response?.data?.code === "FEATURE_CLOSED" &&
      error.response.data.data
    )
      useFeatureStates.getState().update([error.response.data.data]);

    const original = error.config;
    const expected = original?.headers?.get?.(EXPECTED_SESSION);
    if (
      typeof expected !== "string" ||
      original._retry ||
      (error.response?.status !== 401 && error.response?.status !== 403)
    )
      throw error;
    original._retry = true;
    try {
      await confirmBrowserSession(expected);
    } catch (sessionError) {
      handleBrowserSessionEnd(sessionError);
      throw sessionError;
    }
    if (
      error.response.status === 403 ||
      original.url === "/api/auth/logout" ||
      original.signal?.aborted
    )
      throw error;
    return api(original);
  },
);
