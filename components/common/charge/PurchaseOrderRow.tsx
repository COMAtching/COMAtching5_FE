"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { statusLabels, type PurchaseOrder } from "@/hooks/usePurchaseOrders";
import { BANK_INFO } from "@/lib/constants/charge";
import { formatTicketUnits } from "@/lib/utils/ticket-units";

export function canShowDeposit(order: PurchaseOrder, now: number) {
  return (
    order.status === "AWAITING_DEPOSIT" && Date.parse(order.expiresAt) > now
  );
}

// Wake at the next pending deadline even when a refetch fails or the expiry job has not run.
export function useOrderClock(orders: PurchaseOrder[]) {
  const [now, setNow] = useState(Date.now);
  const next = Math.min(
    ...orders
      .filter((order) => canShowDeposit(order, now))
      .map((order) => Date.parse(order.expiresAt)),
  );
  useEffect(() => {
    if (!Number.isFinite(next)) return;
    const tick = () => setNow(Date.now());
    const timer = window.setTimeout(
      tick,
      Math.min(Math.max(0, next - Date.now()), 2147483647),
    );
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [next, now]);
  return now;
}

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Seoul",
});

export default function PurchaseOrderRow({
  order,
  initiallyExpanded = false,
}: {
  order: PurchaseOrder;
  initiallyExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [feedback, setFeedback] = useState("");
  const now = useOrderClock([order]);
  const canPay = canShowDeposit(order, now);
  const status =
    order.status === "AWAITING_DEPOSIT" && !canPay ? "EXPIRED" : order.status;
  const details = [
    ["은행", BANK_INFO.bank],
    ["예금주", BANK_INFO.holder],
    ["계좌번호", BANK_INFO.account],
    ["입금할 금액", order.amount.toLocaleString("ko-KR") + "원"],
    ["신청 당시 입금자명", order.depositorName ?? ""],
  ];
  async function copy(label: string, value: string) {
    if (!canShowDeposit(order, Date.now())) return;
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(label + " 복사했어요.");
    } catch {
      setFeedback("복사할 내용을 길게 눌러 복사해 주세요.");
    }
  }
  return (
    <article className="flex min-w-0 flex-col gap-2 py-3">
      <span className="typo-12-500 text-color-gray-500">
        주문번호 {order.orderId} ·{" "}
        {dateFormat.format(new Date(order.requestedAt))}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="typo-16-600 text-color-text-black">
          {formatTicketUnits(order.productName)}
          {order.quantity != null && (
            <span className="typo-12-500 text-color-gray-500 ml-1">
              × {order.quantity}
            </span>
          )}
        </span>
        <span className="typo-16-600 shrink-0">
          {order.amount.toLocaleString("ko-KR")}원
        </span>
      </div>
      <span className="typo-14-600 text-color-flame-700">
        {statusLabels[status]}
      </span>
      {status === "GRANT_DELAYED" && (
        <p className="typo-12-500 text-color-gray-500">
          입금은 확인됐어요. 아이템 지급 상태를 확인하고 있어요.
        </p>
      )}
      {canPay && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="typo-14-600 self-start py-1 underline underline-offset-4"
        >
          {expanded ? "입금 정보 접기" : "입금 정보 다시 보기"}
        </button>
      )}
      {canPay && expanded && (
        <div className="bg-color-gray-50 mt-1 flex flex-col gap-3 rounded-2xl p-4">
          <p className="typo-14-600">
            이미 송금했다면 다시 보내지 않아도 돼요.
          </p>
          <dl className="flex flex-col gap-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2"
              >
                <dt className="typo-12-500 text-color-gray-500">{label}</dt>
                <dd className="typo-14-600 flex min-w-0 items-center gap-1 break-all">
                  {value}
                  <button
                    type="button"
                    aria-label={label + " 복사"}
                    onClick={() =>
                      copy(
                        label,
                        label === "입금할 금액" ? String(order.amount) : value,
                      )
                    }
                    className="shrink-0 p-1.5"
                  >
                    <Copy size={14} />
                  </button>
                </dd>
              </div>
            ))}
          </dl>
          {feedback && (
            <p role="status" className="typo-12-500">
              {feedback}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
