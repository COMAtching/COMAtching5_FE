import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {
  isPushRoute,
  chatPushPath,
  chatPushReference,
} from "../lib/push-routes.ts";

const script = fs.readFileSync(
  new URL("../public/push-privacy.js", import.meta.url),
  "utf8",
);
function serviceWorker() {
  const events = {};
  const shown = [];
  const opened = [];
  const self = {
    addEventListener(name, callback) {
      events[name] = callback;
    },
    registration: { getNotifications: async () => shown },
    location: { origin: "https://comatching.example" },
    clients: {
      matchAll: async () => [],
      openWindow: async (path) => opened.push(path),
    },
  };
  vm.runInNewContext(script, { self, URL });
  self.installComatchingPushPrivacy("123");
  return { events, shown, opened, clients: self.clients };
}
const oldChat = {
  notification: { title: "private fixture", body: "private message" },
  data: {
    roomId: "1",
    senderNickname: "private fixture",
    content: "private message",
  },
};
const oldGrant = {
  notification: { title: "old purchase" },
  data: { type: "ITEMS_GRANTED", orderId: "15" },
};

test("queued legacy messages stop before Firebase auto-display; current messages and unrelated pushes propagate", () => {
  const { events } = serviceWorker();
  function stopped(payload) {
    let blocked = false;
    events.push({
      data: { json: () => payload },
      stopImmediatePropagation() {
        blocked = true;
      },
    });
    return blocked;
  }
  assert.ok(stopped({ from: "123", ...oldChat }));
  assert.ok(stopped(oldChat));
  assert.ok(stopped({ from: "123", ...oldGrant }));
  assert.ok(stopped(oldGrant));
  assert.ok(!stopped({ from: "123", data: { type: "CHAT" } }));
  assert.ok(!stopped({ from: "123", data: { type: "ITEMS_GRANTED" } }));
  assert.ok(!stopped({ from: "another", ...oldChat }));
  assert.ok(!stopped({ notification: { title: "unrelated notification" } }));
  events.push({
    data: {
      json() {
        throw new Error("plain text");
      },
    },
  });
});

test("activation closes old sensitive notifications; clicks route to authenticated lists without event identifiers", async () => {
  const { events, shown, opened } = serviceWorker();
  const wrap = (data) => ({
    data,
    closed: false,
    close() {
      this.closed = true;
    },
  });
  const old = wrap({ FCM_MSG: { from: "123", ...oldChat } });
  const unrelated = wrap({ FCM_MSG: { from: "456", ...oldChat } });
  const current = wrap({ comatchingPush: true, grant: true });
  shown.push(old, unrelated, current);
  let waiting;
  const waitUntil = (p) => {
    waiting = p;
  };
  events.activate({ waitUntil });
  await waiting;
  assert.ok(old.closed);
  assert.ok(!unrelated.closed && !current.closed);
  const stopImmediatePropagation = () => {};
  events.notificationclick({
    notification: old,
    waitUntil,
    stopImmediatePropagation,
  });
  await waiting;
  events.notificationclick({
    notification: current,
    waitUntil,
    stopImmediatePropagation,
  });
  await waiting;
  events.notificationclick({
    notification: unrelated,
    waitUntil,
    stopImmediatePropagation,
  });
  assert.deepEqual(opened, ["/chat-list", "/main"]);
  assert.ok(!unrelated.closed);
});

test("Firebase only registers on signed-in screens", () => {
  for (const path of [
    "/",
    "/FAQ",
    "/login",
    "/register",
    "/terms",
    "/privacy",
    "/reset/password/new",
    "/onboarding",
    "/adminpage",
    "/adminpage/",
    "/new-public-page",
    "/adminpage/help",
  ]) {
    assert.equal(isPushRoute(path), false, path);
  }
  for (const path of [
    "/main",
    "/chat/2",
    "/matching-list",
    "/adminpage/main",
    "/adminpage/operations",
  ]) {
    assert.equal(isPushRoute(path), true, path);
  }
});

test("new chat notifications open a scoped reference on cold and warm launches", async () => {
  const { events, opened, clients } = serviceWorker();
  const ref = "b1773f5e-88bf-423e-a34c-bfae5f671e4d";
  const path = chatPushPath(ref);
  assert.equal(chatPushReference(path.slice(path.indexOf("#"))), ref);
  async function click(chatRef) {
    let done;
    events.notificationclick({
      notification: {
        data: { comatchingPush: true, grant: false, chatRef },
        close() {},
      },
      stopImmediatePropagation() {},
      waitUntil(promise) {
        done = promise;
      },
    });
    await done;
  }
  await click(ref);
  await click("https://elsewhere.invalid/");
  assert.deepEqual(opened, [path, "/chat-list"]);
  let focused = false;
  clients.matchAll = async () => [
    {
      url: "https://comatching.example/main",
      async navigate(next) {
        assert.equal(next, path);
        return {
          async focus() {
            focused = true;
          },
        };
      },
    },
  ];
  await click(ref);
  assert.ok(focused);
  assert.equal(opened.length, 2);
  clients.matchAll = async () => [
    {
      url: "https://comatching.example/",
      async navigate() {
        return null;
      },
    },
  ];
  await click(ref);
  assert.equal(opened.at(-1), path);
});
