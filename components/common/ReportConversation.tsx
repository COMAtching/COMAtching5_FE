import Image from "next/image";

export type ChatRange = {
  roomId: string;
  firstMessageId: string;
  lastMessageId: string;
};
export type ReportChatEvidence = {
  range: ChatRange;
  messages: {
    id: string;
    senderId: number;
    createdAt: string;
    content: string;
    type: string;
    part: "BEFORE" | "SELECTED" | "AFTER";
  }[];
};
const labels = { BEFORE: "앞 대화", SELECTED: "선택한 대화", AFTER: "뒤 대화" };

export default function ReportConversation({
  evidence,
  reporterId,
  admin = false,
}: {
  evidence: ReportChatEvidence;
  reporterId: number;
  admin?: boolean;
}) {
  return (
    <ol
      aria-label="첨부 대화"
      tabIndex={0}
      data-vaul-no-drag
      className="max-h-72 space-y-2 overflow-y-auto overscroll-contain rounded-xl border border-current/15 px-3 py-2 text-sm"
    >
      {evidence.messages.map((m, i) => (
        <li key={m.id}>
          {m.part !== evidence.messages[i - 1]?.part && (
            <h4 className="border-b border-current/15 py-1 text-xs font-semibold">
              {labels[m.part]}
            </h4>
          )}
          <div className="mt-2 flex flex-wrap items-baseline gap-2 text-xs">
            <strong>
              {m.type === "SYSTEM"
                ? "시스템"
                : m.senderId === reporterId
                  ? admin
                    ? "신고자"
                    : "나"
                  : admin
                    ? "신고 대상"
                    : "상대방"}
            </strong>
            <time dateTime={m.createdAt} className="opacity-70">
              {m.createdAt.replace("T", " ").slice(0, 19)}
            </time>
          </div>
          {m.type === "IMAGE" && /^https?:\/\//.test(m.content) ? (
            <Image
              unoptimized
              src={m.content}
              alt="채팅에 첨부된 사진"
              width={200}
              height={160}
              className="my-1 h-auto max-h-40 max-w-full rounded object-contain"
            />
          ) : (
            <p className="my-1 wrap-anywhere whitespace-pre-wrap">
              {m.type === "IMAGE" ? "사진 메시지" : m.content}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
