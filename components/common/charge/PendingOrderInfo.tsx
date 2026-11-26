"use client";

import { useActiveOrders } from "@/hooks/usePurchaseOrders";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PurchaseOrderRow, {
  canShowDeposit,
  useOrderClock,
} from "./PurchaseOrderRow";
import { OrderReadError } from "./OrderHistoryContent";

export default function PendingOrderInfo({ back }: { back: () => void }) {
  const query = useActiveOrders();
  const rows = query.data?.content ?? [];
  const now = useOrderClock(rows);
  const pending = rows.find((order) => canShowDeposit(order, now));
  return (
    <section className="pt-6">
      {query.isError && (
        <OrderReadError retry={query.retry} cached={!!query.data} />
      )}
      {!query.isFetchedAfterMount && !query.isError ? (
        <LoadingSpinner label="신청한 주문 확인 중" />
      ) : pending ? (
        <PurchaseOrderRow
          key={pending.orderId}
          order={pending}
          initiallyExpanded
        />
      ) : (
        query.data && (
          <p className="typo-14-500 py-3">
            현재 입금 확인 대기 중인 주문이 없습니다.
          </p>
        )
      )}
      <button
        type="button"
        onClick={back}
        className="typo-14-600 py-2 underline underline-offset-4"
      >
        주문 내역 보기
      </button>
    </section>
  );
}
