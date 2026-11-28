import { useState } from "react";
import type { ChatRange } from "@/components/common/ReportConversation";

type Draft = { anchor: string | null; end: string | null };
type Selection = {
  owner: number | undefined;
  room: string;
  confirmed: ChatRange | null;
  draft: Draft | null;
};

export function useChatReportRange(
  room: string,
  owner: number | undefined,
  indices: Map<string, number>,
) {
  const [saved, setSaved] = useState<Selection | null>(null);
  const state =
    saved?.room === room && saved.owner === owner
      ? saved
      : { room, owner, confirmed: null, draft: null };
  const { draft, confirmed } = state;
  const anchor = (draft?.anchor ? indices.get(draft.anchor) : undefined) ?? -1;
  const end = draft?.end ? (indices.get(draft.end) ?? -1) : anchor;
  const startIndex = Math.min(anchor, end);
  const endIndex = startIndex < 0 ? -1 : Math.max(anchor, end);
  const count = startIndex < 0 ? 0 : endIndex - startIndex + 1;
  const valid = count > 0 && count <= 50;

  function finish() {
    if (!valid || !draft?.anchor) return;
    const other = draft.end ?? draft.anchor;
    const forward = anchor === startIndex;
    setSaved({
      ...state,
      draft: null,
      confirmed: {
        roomId: room,
        firstMessageId: forward ? draft.anchor : other,
        lastMessageId: forward ? other : draft.anchor,
      },
    });
  }
  return {
    choosing: !!draft,
    confirmed,
    count,
    valid,
    startIndex,
    endIndex,
    waitingForEnd: !!draft?.anchor && !draft.end,
    begin() {
      setSaved({ ...state, draft: { anchor: null, end: null } });
    },
    cancel() {
      setSaved({ ...state, draft: null });
    },
    clear() {
      setSaved(null);
    },
    tap(id: string) {
      if (!draft || !indices.has(id)) return;
      setSaved({
        ...state,
        draft:
          draft.anchor && !draft.end
            ? { anchor: draft.anchor, end: id }
            : { anchor: id, end: null },
      });
    },
    finish,
  };
}
