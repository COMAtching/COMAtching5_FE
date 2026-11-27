"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { api } from "@/lib/axios";
import { useMyProfile } from "@/hooks/useProfile";

type Warning = { id: number; message: string };
export default function MemberWarnings() {
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
    onSuccess: () => warnings.refetch(),
  });
  const current = warnings.data?.[0];
  if (!current) return null;
  return (
    <section
      className="w-full rounded-2xl border border-rose-200 bg-white p-4"
      aria-label="운영자 경고"
    >
      <h2 className="flex items-center gap-2 font-semibold text-rose-700">
        <Flag size={17} />
        운영자 경고
      </h2>
      <p className="my-3 break-words whitespace-pre-wrap">{current.message}</p>
      <button
        className="rounded-full border px-4 py-2 text-sm"
        disabled={ack.isPending}
        onClick={() => ack.mutate(current.id)}
      >
        내용을 확인했어요
      </button>
      {ack.isError && (
        <p role="alert">확인 상태를 저장하지 못했어요. 다시 시도해 주세요.</p>
      )}
    </section>
  );
}
