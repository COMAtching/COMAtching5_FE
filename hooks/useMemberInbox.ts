"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { EXPECTED_SESSION } from "@/lib/browser-session";
import { inboxKey, useMemberSession } from "./useMemberSession";

export const noticeTitles = {
  IN_REVIEW: "검토 중",
  ACTION_TAKEN: "조치 완료",
  NO_ACTION: "조치 없이 종결",
  WARNING: "운영자 경고",
} as const;
export type InboxItem = {
  reportId: number;
  kind: keyof typeof noticeTitles;
  at: string;
  unread: boolean;
  warningMessage?: string | null;
};
type InboxPage = {
  content: InboxItem[];
  currentPage: number;
  hasNext: boolean;
};
const path = "/api/members/me/inbox";

export function useInboxUnreadCount() {
  const { owner } = useMemberSession();
  return useQuery({
    queryKey: [...inboxKey, owner, "count"],
    enabled: !!owner,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    queryFn: async ({ signal }) =>
      (
        await api.get<{ data: number }>(path + "/unread-count", {
          signal,
          headers: { [EXPECTED_SESSION]: owner },
        })
      ).data.data,
  });
}

export function useMemberInbox(page: number) {
  const session = useMemberSession();
  const client = useQueryClient();
  const { owner } = session;
  const list = useQuery({
    queryKey: [...inboxKey, owner, "list", page],
    enabled: !!owner,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: page === 0 ? 30000 : false,
    queryFn: async ({ signal }) =>
      (
        await api.get<{ data: InboxPage }>(path, {
          params: { page },
          headers: { [EXPECTED_SESSION]: owner },
          signal,
        })
      ).data.data,
  });
  const mark = useMutation({
    mutationFn: (notice: InboxItem) =>
      api.post(path + "/" + notice.reportId + "/read", null, {
        params: { kind: notice.kind },
        headers: { [EXPECTED_SESSION]: owner },
      }),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: [...inboxKey, owner] }),
        client.invalidateQueries({ queryKey: ["memberWarnings"] }),
      ]);
    },
  });
  return {
    list,
    mark,
    failed: list.isError || session.isError,
    retry: () => session.retry(list.refetch),
  };
}
