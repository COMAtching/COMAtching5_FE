import type { RefundResult } from "@/hooks/admin/useAdminOrders";

import { grantLabels } from "./grantLabels";

export function RefundNotice({ result }: { result: RefundResult }) {
  let message: string;
  if (result.kind === "recorded") {
    const { refund } = result;
    const state =
      refund.refundStatus === "COMPLETED" ? "환불 완료" : "환불 시작";
    message = `주문 #${refund.orderId} · ${state} 기록 · 환불액 ${refund.amount.toLocaleString("ko-KR")}원`;
  } else if (result.kind === "review") {
    message = `주문 #${result.orderId} · 기존 지급 이력 확인 필요. 송금을 중단해 주세요.`;
  } else {
    const { current, action, orderId } = result;
    let detail: string;
    if (current?.refundStatus === "COMPLETED") {
      detail =
        "이미 환불 완료로 기록된 주문입니다. 완료 목록에서 담당자와 시각을 확인해 주세요.";
    } else if (current?.refundStatus === "IN_PROGRESS") {
      detail =
        action === "complete"
          ? "환불 진행 중입니다. 전액 이체 내역이 확인되면 추가 송금 없이 완료만 다시 기록해 주세요."
          : "이미 환불 진행 중입니다. 중복 송금을 막기 위해 시작 담당자와 은행 이체 내역을 먼저 확인해 주세요.";
    } else if (current?.refundStatus === "NONE") {
      detail = `환불이 시작되지 않았습니다. 현재 상태는 ‘${grantLabels[current.grantStatus]}’입니다. 송금하지 마세요.`;
    } else {
      detail =
        "환불 상태를 확인하지 못했습니다. 송금하기 전에 환불 진행 중·완료 목록을 새로고침해 주세요.";
    }
    message = `주문 #${orderId} · ${detail}`;
  }
  return (
    <p
      role="status"
      className="mb-4 rounded-xl border border-[#393e58] bg-[#161827] p-3 text-sm text-white"
    >
      {message}
    </p>
  );
}
