import assert from "node:assert/strict";
import test from "node:test";
import { appAlerts, acknowledgeAppAlert } from "../lib/app-alert.js";

test("expired sessions return to the login for the current screen only once", async (t) => {
  const calls = [];
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  globalThis.window = {
    location: {
      pathname: "",
      replace: (url) => calls.push(url),
      reload: () => calls.push("reload"),
    },
  };
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else delete globalThis.window;
  });
  for (const [pathname, expected] of [
    ["/adminpage/dashboard", "/adminpage"],
    ["/adminpage/users", "/adminpage"],
    ["/adminpage", null],
    ["/adminpage/", null],
    ["/adminpage-other", "/"],
    ["/main", "/"],
  ]) {
    const session = await import(`../lib/browser-session.ts?route=${pathname}`);
    window.location.pathname = pathname;
    session.handleBrowserSessionEnd(new Error("network"));
    session.handleBrowserSessionEnd(new session.BrowserSessionEnded());
    session.handleBrowserSessionEnd(new session.BrowserSessionEnded());
    if (expected === "/") {
      assert.deepEqual(calls, []);
      assert.equal(appAlerts.getState().length, 1);
      acknowledgeAppAlert(appAlerts.getState()[0]);
    }
    assert.deepEqual(calls.splice(0), expected ? [expected] : []);
  }
  const changed = await import("../lib/browser-session.ts?changed");
  window.location.pathname = "/adminpage/dashboard";
  changed.handleBrowserSessionEnd(new changed.BrowserSessionEnded(true));
  assert.deepEqual(calls, ["reload"]);
});

test("two documents share rotation and keep each request bound to its original login", async (t) => {
  const first = await import("../lib/browser-session.ts?first");
  const second = await import("../lib/browser-session.ts?second");
  const alice = "fixture-owner-alice-00001";
  const bob = "fixture-owner-bob-000002";
  let owner = alice;
  let locks = Promise.resolve();
  let rotations = 0;
  let issuerStatus = 200;

  Object.defineProperty(globalThis.navigator, "locks", {
    configurable: true,
    value: {
      request(name, work) {
        assert.equal(name, "comatching-auth-refresh");
        const acquired = locks.then(work);
        locks = acquired.catch(() => {});
        return acquired;
      },
    },
  });
  t.after(() => {
    delete globalThis.navigator.locks;
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.credentials, "include");
    assert.equal(options.cache, "no-store");
    if (url.endsWith("/api/auth/session"))
      return new Response(owner, { status: owner ? 200 : 401 });
    assert.equal(options.method, "POST");
    assert.ok(url.endsWith("/api/auth/reissue"));
    assert.equal(options.headers["X-Expected-Session"], alice);
    rotations++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (issuerStatus === 200) owner = alice;
    return new Response(null, { status: issuerStatus });
  });
  assert.deepEqual(
    await Promise.all([
      first.requestSessionOwner(),
      second.requestSessionOwner(),
    ]),
    [alice, alice],
  );
  owner = null;
  assert.deepEqual(
    await Promise.all([
      first.confirmBrowserSession(alice),
      first.confirmBrowserSession(alice),
      second.confirmBrowserSession(alice),
    ]),
    [alice, alice, alice],
  );
  assert.equal(rotations, 1);
  issuerStatus = 503;
  owner = null;
  const interrupted = await Promise.allSettled([
    first.confirmBrowserSession(alice),
    first.confirmBrowserSession(alice),
  ]);
  assert.deepEqual(
    interrupted.map((x) => x.status),
    ["rejected", "rejected"],
  );
  assert.equal(rotations, 2);
  issuerStatus = 200;
  assert.equal(await first.confirmBrowserSession(alice), alice);
  assert.equal(rotations, 3);

  owner = bob;
  assert.equal(await first.requestSessionOwner(), alice);
  await assert.rejects(
    first.confirmBrowserSession(alice),
    (error) => error.changed === true,
  );
  await assert.rejects(
    second.confirmBrowserSession(alice),
    (error) => error.changed === true,
  );
  assert.equal(rotations, 3);

  owner = null;
  issuerStatus = 403;
  await assert.rejects(
    first.confirmBrowserSession(alice),
    (error) => error.changed === true,
  );
  assert.equal(rotations, 4);
});
