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
        <h2 className="typo-16-600">내 충전 요청</h2>
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
