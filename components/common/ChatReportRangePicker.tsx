import { useMemo } from "react";
import type { ChatRange } from "./ReportConversation";

export type ChatReportHistory = {
  roomId: string;
  viewerId: number;
  messages: ReadonlyArray<{
    id: string;
    createdAt: string;
    text: string;
    type: string;
    senderId: number;
  }>;
  hasEarlier: boolean;
  loading: boolean;
  failed: boolean;
  loadEarlier: () => void;
};

export default function ChatReportRangePicker({
  history,
  range,
  onChange,
}: {
  history: ChatReportHistory;
  range: ChatRange | null;
  onChange: (value: ChatRange | null) => void;
}) {
  const messages = useMemo(() => {
    const unique = new Map(
      history.messages
        .filter((m) => m.id && m.type !== "READ")
        .map((m) => [m.id, m]),
    );
    return [...unique.values()].sort(
      (a, b) =>
        Date.parse(a.createdAt) - Date.parse(b.createdAt) ||
        a.id.localeCompare(b.id),
    );
  }, [history.messages]);
  const start = messages.findIndex((m) => m.id === range?.firstMessageId);
  const option = (m: (typeof messages)[number]) => (
    <option value={m.id} key={m.id}>
      {m.createdAt.replace("T", " ").slice(5, 19)} ·{" "}
      {m.type === "SYSTEM"
        ? "시스템"
        : history.viewerId === m.senderId
          ? "나"
          : "상대방"}{" "}
      · {m.type === "IMAGE" ? "사진" : m.text.slice(0, 48)}
    </option>
  );
  const select =
    "mt-1 min-h-11 w-full min-w-0 truncate rounded-xl border border-gray-200 bg-white px-3 text-sm font-normal";
  return (
    <div className="space-y-3" data-vaul-no-drag>
      <div>
        <h3 className="typo-14-600">신고할 대화 범위</h3>
        <p className="mt-1 text-sm text-gray-600">
          시작부터 끝까지 최대 50개를 고를 수 있어요. 접수할 때 앞뒤 대화도 각각
          최대 3개씩 함께 전달돼요.
        </p>
      </div>
      {(history.hasEarlier || history.failed) && (
        <button
          type="button"
          onClick={history.loadEarlier}
          disabled={history.loading}
          className="min-h-11 text-sm underline"
        >
          {history.failed ? "대화 다시 불러오기" : "이전 대화 불러오기"}
        </button>
      )}
      {!messages.length ? (
        <p role="status" className="text-sm">
          {history.loading
            ? "대화를 불러오는 중이에요."
            : history.failed
              ? "대화를 불러오지 못했어요."
              : "아직 신고할 대화가 없어요."}
        </p>
      ) : (
        <>
          <label className="block text-sm font-semibold">
            시작 메시지
            <select
              aria-label="시작 메시지"
              className={select}
              value={range?.firstMessageId ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                onChange(
                  id
                    ? {
                        roomId: history.roomId,
                        firstMessageId: id,
                        lastMessageId: id,
                      }
                    : null,
                );
              }}
            >
              <option value="">시작 메시지를 고르세요</option>
              {messages.map(option)}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            끝 메시지
            <select
              aria-label="끝 메시지"
              className={select}
              disabled={start < 0}
              value={range?.lastMessageId ?? ""}
              onChange={(e) =>
                range && onChange({ ...range, lastMessageId: e.target.value })
              }
            >
              {start < 0 ? (
                <option value="">시작 메시지를 먼저 고르세요</option>
              ) : (
                messages.slice(start, start + 50).map(option)
              )}
            </select>
          </label>
        </>
      )}
    </div>
  );
}
