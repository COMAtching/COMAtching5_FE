"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { noticeTitles, useMemberInbox } from "@/hooks/useMemberInbox";

const messages = {
  IN_REVIEW: "신고가 접수됐어요. 운영자가 내용을 확인하고 있어요.",
  ACTION_TAKEN: "신고하신 내용을 검토하고 조치했어요.",
  NO_ACTION: "신고하신 내용을 검토한 결과, 별도 조치 없이 종결됐어요.",
};
export default function InboxPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { list, mark, failed, retry } = useMemberInbox(page);
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col gap-6 px-4 pt-2 pb-10">
      <BackButton text="알림함" onClick={() => router.replace("/main")} />
      <section
        aria-label="내 알림"
        className="rounded-3xl border border-white/30 bg-white/70 px-5 shadow-[0_0_8px_rgba(0,0,0,0.08)]"
      >
        {failed && (
          <div
            role="status"
            className="typo-14-500 flex items-center justify-between gap-3 py-4"
          >
            알림을 불러오지 못했어요.
            <button onClick={retry} className="underline">
              다시 확인
            </button>
          </div>
        )}
        {!failed && !list.data && <LoadingSpinner label="알림 불러오는 중" />}
        {list.data?.content.length === 0 && (
          <p className="typo-14-500 text-color-gray-500 py-12 text-center">
            아직 도착한 알림이 없어요.
          </p>
        )}
        <ul className="divide-color-gray-100 divide-y">
          {list.data?.content.map((n) => (
            <li key={n.reportId} className="py-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="typo-16-600 flex items-center gap-2">
                  {n.unread && (
                    <span
                      className="bg-color-flame-700 size-1.5 rounded-full"
                      aria-label="읽지 않음"
                    />
                  )}
                  {n.kind === "WARNING"
                    ? noticeTitles.WARNING
                    : "내 신고 · " + noticeTitles[n.kind]}
                </h2>
                <time
                  dateTime={n.at}
                  className="typo-12-500 text-color-gray-500"
                >
                  {n.at.replace("T", " ").slice(0, 16)}
                </time>
              </div>
              <p className="typo-14-500 text-color-gray-700 mt-2 break-words whitespace-pre-wrap">
                {n.kind === "WARNING" ? n.warningMessage : messages[n.kind]}
              </p>
              <div className="mt-2 flex min-h-8 items-center justify-between">
                <span className="typo-12-500 text-color-gray-500">
                  {n.kind !== "WARNING" && "신고 #" + n.reportId}
                </span>
                {n.unread && (
                  <button
                    type="button"
                    onClick={() => mark.mutate(n)}
                    disabled={mark.isPending}
                    className="typo-12-600 min-h-10 underline underline-offset-4"
                  >
                    {n.kind === "WARNING" ? "내용을 확인했어요" : "읽음 표시"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {mark.isError && (
          <p role="alert" className="typo-12-500 text-color-flame-700 pb-3">
            읽음 상태를 저장하지 못했어요. 다시 시도해 주세요.
          </p>
        )}
        {(page > 0 || list.data?.hasNext) && (
          <nav
            aria-label="알림 페이지"
            className="border-color-gray-100 typo-14-600 flex items-center justify-between border-t py-3"
          >
            <button
              disabled={!page}
              onClick={() => setPage(page - 1)}
              className="min-h-10 disabled:opacity-40"
            >
              이전
            </button>
            {page + 1}
            <button
              disabled={!list.data?.hasNext}
              onClick={() => setPage(page + 1)}
              className="min-h-10 disabled:opacity-40"
            >
              다음
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
