const title = "채팅 서비스가 종료되었습니다.";
const detail = "이전 대화는 계속 볼 수 있어요.";

export default function ChatReadOnlyNotice({ message }: { message: string }) {
  const additionalNotice = message?.trim();
  const normalized = additionalNotice?.replace(/\s+/g, " ");
  return (
    <div
      role="status"
      className="typo-13-500 mx-auto w-fit max-w-full rounded-2xl border border-white/80 bg-white/70 px-5 py-2.5 text-center leading-5 text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
    >
      <p className="break-keep">
        <strong className="typo-14-600 text-[#4D4D4D]">{title}</strong>
        <br />
        {detail}
      </p>
      {additionalNotice &&
        normalized !== "채팅 종료" &&
        normalized !== `${title} ${detail}` && (
          <p className="mt-1 [overflow-wrap:anywhere] whitespace-pre-line">
            {additionalNotice}
          </p>
        )}
    </div>
  );
}
