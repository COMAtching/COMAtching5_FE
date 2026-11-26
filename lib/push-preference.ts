"use client";

import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import { EXPECTED_SESSION, requestSessionOwner } from "@/lib/browser-session";
import { registerServiceWorkerAndGetToken } from "@/lib/firebase";

const muteKey = "comatching-push-muted";

export function locallyMuted() {
  try {
    return localStorage.getItem(muteKey) === "1";
  } catch {
    return false;
  }
}

async function installation() {
  const owner = await requestSessionOwner();
  const config = { headers: { [EXPECTED_SESSION]: owner } };
  await api.post("/api/members/push-installation", null, config);
  return config;
}

export async function readPushPreference() {
  const config = await installation();
  const { data } = await api.get<{ muted: boolean; registered: boolean }>(
    "/api/fcm/preference",
    config,
  );
  return !data.muted && data.registered;
}

async function register(config: Awaited<ReturnType<typeof installation>>) {
  const send = async (rotate: boolean) => {
    const token = await registerServiceWorkerAndGetToken(rotate);
    if (!token) throw new Error("기기에 알림을 등록하지 못했어요.");
    await api.post("/api/fcm/token", { token }, config);
  };
  try {
    await send(false);
  } catch (error) {
    if (
      !isAxiosError(error) ||
      error.response?.data?.code !== "PUSH_TOKEN_IN_USE"
    )
      throw error;
    await send(true);
  }
}

// A refresh can update a token, but never changes the user's switch or prompts for permission.
export async function refreshPushToken() {
  if (locallyMuted() || Notification.permission !== "granted") return;
  await register(await installation());
  window.dispatchEvent(new Event("push-preference-changed"));
}

export async function setPushPreference(enabled: boolean) {
  const config = await installation();
  if (enabled) await register(config);
  await api.put("/api/fcm/preference", { enabled }, config);
  try {
    if (enabled) localStorage.removeItem(muteKey);
    else localStorage.setItem(muteKey, "1");
  } catch {
    /* The server still enforces this installation's choice. */
  }
  window.dispatchEvent(new Event("push-preference-changed"));
}
