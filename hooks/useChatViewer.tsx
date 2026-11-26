"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  BrowserSessionEnded,
  confirmBrowserSession,
  EXPECTED_SESSION,
  handleBrowserSessionEnd,
} from "@/lib/browser-session";
import type { ProfileResponse } from "@/hooks/useProfile";

type Viewer = { owner: string; memberId: number };
const viewerKey = ["chatViewer"] as const;
const ChatViewer = createContext<{
  viewer?: Viewer;
  failed: boolean;
  retry: () => void;
} | null>(null);

async function fetchViewer(signal: AbortSignal): Promise<Viewer> {
  try {
    const owner = await confirmBrowserSession();
    const { data } = await api.get<ProfileResponse>("/api/members/profile", {
      signal,
      headers: { [EXPECTED_SESSION]: owner },
    });
    return { owner, memberId: data.data.memberId };
  } catch (error) {
    if (!signal.aborted) handleBrowserSessionEnd(error);
    throw error;
  }
}

export function ChatViewerProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const identity = useQuery({
    queryKey: viewerKey,
    queryFn: ({ signal }) => fetchViewer(signal),
    gcTime: 0,
    staleTime: Infinity,
    refetchOnMount: "always",
    retry: (count, error) =>
      !(error instanceof BrowserSessionEnded) && count < 1,
  });

  useEffect(() => {
    const verify = () => {
      // A suspended tab may have missed a room visibility event.
      client.removeQueries({ queryKey: ["chatRooms"] });
      void client.resetQueries({ queryKey: viewerKey });
    };
    const resume = () => {
      if (document.visibilityState === "visible") verify();
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) verify();
    };
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("comatching-auth-change");
    if (channel)
      channel.onmessage = (event) => {
        if (event.data === "check" || event.data?.signedOut) verify();
      };
    window.addEventListener("comatching-session-ended", verify);
    window.addEventListener("pageshow", restore);
    document.addEventListener("visibilitychange", resume);
    return () => {
      channel?.close();
      window.removeEventListener("comatching-session-ended", verify);
      window.removeEventListener("pageshow", restore);
      document.removeEventListener("visibilitychange", resume);
      client.removeQueries({ queryKey: ["chatRooms"] });
    };
  }, [client]);

  return (
    <ChatViewer.Provider
      value={{
        viewer:
          identity.isFetchedAfterMount && identity.isSuccess
            ? identity.data
            : undefined,
        failed: identity.isError,
        retry: () => void identity.refetch(),
      }}
    >
      {children}
    </ChatViewer.Provider>
  );
}

export function useChatViewer() {
  const value = useContext(ChatViewer);
  if (!value) throw new Error("ChatViewerProvider is required");
  return value;
}
