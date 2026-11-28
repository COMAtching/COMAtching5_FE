"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MemberModerationNotice from "@/components/common/MemberModerationNotice";
import { inboxKey } from "@/hooks/useMemberSession";
import { api } from "@/lib/axios";
import { useMyProfile } from "@/hooks/useProfile";

type Warning = { id: number; message: string };
export default function MemberWarnings() {
  const client = useQueryClient();
  const memberId = useMyProfile().data?.data.memberId;
  const warnings = useQuery({
    queryKey: ["memberWarnings", memberId],
    enabled: !!memberId,
    gcTime: 0,
    refetchInterval: 60000,
    queryFn: async ({ signal }) =>
      (
        await api.get<{ data: Warning[] }>("/api/members/me/warnings", {
          signal,
        })
      ).data.data,
  });
  const ack = useMutation({
    mutationFn: (id: number) =>
      api.post("/api/members/me/warnings/" + id + "/acknowledge"),
    onSuccess: () =>
      Promise.all([
        warnings.refetch(),
        client.invalidateQueries({ queryKey: inboxKey }),
      ]),
  });
  const current = warnings.data?.[0];
  if (!current) return null;
  return (
    <MemberModerationNotice
      kind="warning"
      message={current.message}
      pending={ack.isPending}
      onConfirm={() => ack.mutate(current.id)}
      error={ack.isError}
    />
  );
}
