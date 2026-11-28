import Link from "next/link";

type Props =
  | { kind: "suspension"; preview?: boolean }
  | {
      kind: "warning";
      message: string;
      onConfirm?: () => void;
      pending?: boolean;
      error?: boolean;
    };

export default function MemberModerationNotice(props: Props) {
  if (props.kind === "suspension") {
    const button =
      "typo-16-600 bg-color-flame-700 flex min-h-12 w-full items-center justify-center rounded-full text-white";
    return (
      <section
        aria-labelledby="suspension-title"
        className={`text-color-text-black mx-auto flex w-full max-w-[430px] flex-col bg-linear-to-b from-white from-70% to-[#ffe5e9] px-8 text-center ${props.preview ? "min-h-80 py-8" : "min-h-dvh pt-[max(5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]"}`}
      >
        <div className="flex flex-1 flex-col items-center justify-center pb-10">
          <h1
            id="suspension-title"
            className="text-[28px] leading-tight font-bold tracking-tight"
          >
            계정 이용이
            <br />
            정지되었어요
          </h1>
          <p className="text-color-gray-600 mt-6 text-sm leading-7 break-keep">
            정지 기간에는 매칭과 채팅을 이용할 수 없어요.
            <br />
            정지가 해제되면 다시 로그인할 수 있어요.
          </p>
        </div>
        {props.preview ? (
          <span className={button}>로그인 화면으로</span>
        ) : (
          <Link href="/" className={button}>
            로그인 화면으로
          </Link>
        )}
      </section>
    );
  }
  return (
    <section
      aria-label="운영자 경고"
      className="text-color-text-black border-color-gray-100 w-full border-y bg-white px-3 py-3 text-left"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="typo-14-600 mb-1">운영자 경고</h2>
          <p className="typo-14-500 text-color-gray-600 wrap-anywhere whitespace-pre-wrap">
            {props.message}
          </p>
        </div>
        <button
          type="button"
          disabled={props.pending || !props.onConfirm}
          onClick={props.onConfirm}
          className="typo-14-500 text-color-gray-600 min-h-11 shrink-0 underline decoration-gray-300 underline-offset-4 focus-visible:outline-2"
        >
          내용을 확인했어요
        </button>
      </div>
      {props.error && (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          확인 상태를 저장하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </section>
  );
}
