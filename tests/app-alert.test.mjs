import assert from "node:assert/strict";
import test from "node:test";
import {
  acknowledgeAppAlert,
  appAlerts,
  showAppAlert,
} from "../lib/app-alert.js";

test("queued alerts run their own action exactly once on acknowledgement", () => {
  const actions = [];
  showAppAlert("첫 안내", () => actions.push("first"));
  showAppAlert("다음 안내", () => actions.push("second"));
  const [first, second] = appAlerts.getState();

  acknowledgeAppAlert(second);
  assert.deepEqual(actions, []);
  acknowledgeAppAlert(first);
  acknowledgeAppAlert(first);
  assert.deepEqual(actions, ["first"]);
  assert.equal(appAlerts.getState()[0], second);
  acknowledgeAppAlert(second);
  assert.deepEqual(actions, ["first", "second"]);
  assert.equal(appAlerts.getState().length, 0);
});
