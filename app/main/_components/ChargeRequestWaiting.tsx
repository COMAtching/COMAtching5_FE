"use client";

import { RotateCw } from "lucide-react";
import ChargeDrawer from "@/components/common/ChargeDrawer";
import { useActiveOrders } from "@/hooks/usePurchaseOrders";
import PurchaseOrderRow, {
  canShowDeposit,
  useOrderClock,
} from "@/components/common/charge/PurchaseOrderRow";
import { OrderReadError } from "@/components/common/charge/OrderHistoryContent";

export default function ChargeRequestWaiting() {
  const query = useActiveOrders(true);
  const rows = query.data?.content ?? [];
  const now = useOrderClock(rows);
  const visible = rows.filter(
    (order) =>
      order.status !== "AWAITING_DEPOSIT" || canShowDeposit(order, now),
  );
  const first = visible[0];
  const count =
    (query.data?.totalElements ?? 0) - (rows.length - visible.length);
  return (
    <section
      hidden={!first && !query.isError}
      aria-label="내 충전 요청"
      className="w-full rounded-3xl border border-white/30 bg-white/50 px-5 py-4 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="typo-16-600 flex items-center gap-3">
          {(first?.status === "AWAITING_DEPOSIT" ||
            first?.status === "GRANTING") && (
            <span
              aria-hidden="true"
              className="relative size-8 shrink-0 motion-safe:animate-spin"
            >
              {Array.from({ length: 7 }, (_, i) => (
                <span
                  key={i}
                  className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${(i * 360) / 7}deg)` }}
                >
                  <span
                    className="h-2 w-1 rounded-full bg-[#FCCD00]"
                    style={{ opacity: 1 - i * 0.12 }}
                  />
                </span>
              ))}
            </span>
          )}
          내 충전 요청
        </h2>
        <button
          type="button"
          aria-label="입금 상태 새로고침"
          onClick={query.retry}
          disabled={query.isFetching}
          className="text-color-gray-500 p-1"
        >
          <RotateCw
            size={16}
            className={query.isFetching ? "animate-spin" : ""}
          />
        </button>
      </div>
      {query.isError && (
        <OrderReadError retry={query.retry} cached={!!query.data} />
      )}
      {first && <PurchaseOrderRow key={first.orderId} order={first} />}
      <ChargeDrawer
        initialTab={1}
        trigger={
          <button
            type="button"
            hidden={count < 2}
            className="typo-14-600 text-color-gray-700 border-color-gray-100 w-full border-t pt-3 text-right underline underline-offset-4"
          >
            진행 중 {count}건 · 모두 보기
          </button>
        }
      />
    </section>
  );
}
