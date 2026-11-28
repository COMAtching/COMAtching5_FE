import Button from "@/components/ui/Button";
import { Flag, ShieldX } from "lucide-react";

type Props =
  | { kind: "suspension" }
  | {
      kind: "warning";
      message: string;
      onConfirm?: () => void;
      pending?: boolean;
      error?: boolean;
    };

export default function MemberModerationNotice(props: Props) {
  const warning = props.kind === "warning";
  const Icon = warning ? Flag : ShieldX;
  const title = warning ? "운영자 경고" : "계정 이용이 정지되었어요";
  return (
    <section
      aria-label={title}
      className="text-color-text-black w-full rounded-3xl border border-white/30 bg-white/80 p-5 text-left shadow-[0_0_8px_rgba(0,0,0,0.08)]"
    >
      <div className="border-color-gray-100 mb-3 flex items-center gap-2 border-b pb-3">
        <span aria-hidden="true" className="text-color-flame-700 shrink-0">
          <Icon size={19} />
        </span>
        <h2 className="typo-16-600">{title}</h2>
      </div>
      <p className="typo-14-500 text-color-gray-600 leading-relaxed break-words whitespace-pre-wrap">
        {warning
          ? props.message
          : "정지 기간에는 로그인하거나 매칭과 채팅을 이용할 수 없어요. 정지가 해제되면 다시 로그인할 수 있어요."}
      </p>
      {warning && (
        <Button
          type="button"
          shadow={false}
          disabled={props.pending || !props.onConfirm}
          onClick={props.onConfirm}
          className="bg-color-gray-50 text-color-text-black typo-14-600 mt-4"
        >
          내용을 확인했어요
        </Button>
      )}
      {warning && props.error && (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          확인 상태를 저장하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </section>
  );
}
