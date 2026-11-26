import type { Client } from "@stomp/stompjs";
import {
  BrowserSessionEnded,
  confirmBrowserSession,
  EXPECTED_SESSION,
} from "@/lib/browser-session";

/** Pin the first STOMP identity for every reconnect, including ordinary network closes. */
export function activateSessionSocket(
  client: Client,
  active: () => boolean,
  onSessionEnded?: (changed: boolean) => void,
) {
  let expected: string | undefined;
  const endIfDenied = async (error: unknown) => {
    if (!(error instanceof BrowserSessionEnded)) return false;
    if (active() && client.active) {
      await client.deactivate({ force: true });
      if (active()) onSessionEnded?.(error.changed);
    }
    return true;
  };
  client.beforeConnect = async () => {
    while (active() && client.active) {
      try {
        expected = await confirmBrowserSession(expected);
        client.connectHeaders[EXPECTED_SESSION] = expected;
        return;
      } catch (error) {
        if (!active() || !client.active) return;
        if (await endIfDenied(error)) return;
        // A temporary network or service failure should not permanently disable the socket.
        await new Promise((done) =>
          window.setTimeout(done, client.reconnectDelay || 5000),
        );
      }
    }
  };
  const checkOwner = async () => {
    if (!expected || !active() || !client.active) return;
    try {
      await confirmBrowserSession(expected);
    } catch (error) {
      await endIfDenied(error);
    }
  };
  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("comatching-auth-change")
      : null;
  if (channel) {
    channel.onmessage = (event) => {
      if (expected && event.data?.signedOut === expected) {
        void endIfDenied(new BrowserSessionEnded());
      } else if (event.data === "check") {
        void checkOwner();
      }
    };
  }
  window.addEventListener("focus", checkOwner);
  client.activate();
  return () => {
    channel?.close();
    window.removeEventListener("focus", checkOwner);
  };
}

export function handleSessionClose(client: Client, code: number) {
  // A 4401 uses STOMP's normal reconnect timer and the beforeConnect session check above.
  if (code !== 4403 && code !== 1008) return false;
  void client.deactivate();
  return true;
}
