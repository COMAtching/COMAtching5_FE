import assert from "node:assert/strict";
import test from "node:test";
import { sameChatMinute } from "../lib/chat-message-group.ts";
import { formatTicketUnits } from "../lib/utils/ticket-units.ts";

test("chat runs require adjacent messages from the same sender in the same absolute minute", () => {
  const a = {
    senderId: 7,
    type: "TALK",
    createdAt: "2026-11-26T13:05:00+09:00",
  };
  assert.ok(
    sameChatMinute(a, {
      ...a,
      type: "IMAGE",
      createdAt: "2026-11-26T13:05:59+09:00",
    }),
  );
  for (const next of [
    undefined,
    { ...a, senderId: 8 },
    { ...a, type: "SYSTEM" },
    { ...a, createdAt: "2026-11-26T13:06:00+09:00" },
    { ...a, createdAt: "2026-11-27T13:05:00+09:00" },
    { ...a, createdAt: "invalid" },
  ]) {
    assert.equal(sameChatMinute(a, next), false);
  }
});

test("older ticket descriptions retain bundle and non-ticket units", () => {
  assert.equal(
    formatTicketUnits("상품 2개, 매칭권 2개 + 옵션권 10개"),
    "상품 2개, 매칭권 2장 + 옵션권 10장",
  );
  assert.equal(formatTicketUnits("뽑기권 3장"), "뽑기권 3장");
});
