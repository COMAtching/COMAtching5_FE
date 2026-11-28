"use client";
import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  BrowserSessionEnded,
  confirmBrowserSession,
  handleBrowserSessionEnd,
} from "@/lib/browser-session";

const sessionKey = ["verifiedMemberSession"] as const;
export const orderKey = ["purchaseOrders"] as const;
export const inboxKey = ["memberInbox"] as const;

export function useMemberSessionBoundary(client: QueryClient) {
  useEffect(() => {
    const clear = () => {
      client.removeQueries({ queryKey: orderKey });
      client.removeQueries({ queryKey: inboxKey });
      void client.resetQueries({ queryKey: sessionKey });
    };
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("comatching-auth-change");
    if (channel)
      channel.onmessage = ({ data }) => {
        if (data?.signedOut) clear();
        else if (data === "check")
          void client.invalidateQueries({ queryKey: sessionKey });
      };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void client.invalidateQueries({ queryKey: sessionKey });
        void client.invalidateQueries({ queryKey: orderKey });
        void client.invalidateQueries({ queryKey: inboxKey });
      }
    };
    window.addEventListener("comatching-session-ended", clear);
    window.addEventListener("pageshow", restore);
    return () => {
      channel?.close();
      window.removeEventListener("comatching-session-ended", clear);
      window.removeEventListener("pageshow", restore);
    };
  }, [client]);
}

export function useMemberSession() {
  const client = useQueryClient();
  const session = useQuery({
    queryKey: sessionKey,
    queryFn: async () => {
      try {
        return await confirmBrowserSession();
      } catch (error) {
        if (error instanceof BrowserSessionEnded) {
          client.removeQueries({ queryKey: orderKey });
          client.removeQueries({ queryKey: inboxKey });
          handleBrowserSessionEnd(error);
        }
        throw error;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    retry: (count, error) =>
      !(error instanceof BrowserSessionEnded) && count < 1,
  });
  const owner =
    session.error instanceof BrowserSessionEnded ? undefined : session.data;
  async function retry(refetch: () => Promise<unknown>) {
    if (session.isError || !owner) {
      const checked = await session.refetch();
      if (!checked.isSuccess || checked.data !== owner) return;
    }
    await refetch();
  }
  return { owner, isError: session.isError, retry };
}
