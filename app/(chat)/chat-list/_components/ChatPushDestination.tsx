"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import { chatPushReference } from "@/lib/push-routes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ChatPushDestination() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let request: AbortController | undefined;
    const open = async () => {
      request?.abort();
      const reference = chatPushReference(location.hash);
      if (!reference) {
        setStatus("idle");
        return;
      }
      const controller = new AbortController();
      request = controller;
      setStatus("loading");
      try {
        const response = await api.get<string>(
          "/api/fcm/chat-links/" + reference,
          { signal: controller.signal, responseType: "text" },
        );
        if (
          controller.signal.aborted ||
          chatPushReference(location.hash) !== reference
        )
          return;
        // The list must remain a real, clean previous entry even for a cold PWA launch.
        window.history.replaceState(
          { comatchingPushEntry: true },
          "",
          "/chat-list",
        );
        if (/^[0-9a-f]{24}$/i.test(response.data))
          router.push("/chat/" + response.data);
        setStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        if (isAxiosError(error) && error.response?.status === 404) {
          window.history.replaceState(
            { comatchingPushEntry: true },
            "",
            "/chat-list",
          );
          setStatus("idle");
        } else setStatus("error");
      }
    };
    void open();
    window.addEventListener("hashchange", open);
    return () => {
      request?.abort();
      window.removeEventListener("hashchange", open);
    };
  }, [router, attempt]);

  if (status === "loading")
    return <LoadingSpinner variant="inline" label="알림의 채팅방 여는 중" />;
  if (status === "error")
    return (
      <button
        className="my-3 text-sm underline"
        onClick={() => setAttempt((i) => i + 1)}
      >
        알림의 채팅방 다시 열기
      </button>
    );
  return null;
}
