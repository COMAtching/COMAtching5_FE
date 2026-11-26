"use client";

import { useOrderHistory } from "@/hooks/usePurchaseOrders";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PurchaseOrderRow from "./PurchaseOrderRow";

export function OrderReadError({
  retry,
  cached,
}: {
  retry: () => void;
  cached: boolean;
}) {
  return (
    <div
      role="status"
      className="typo-12-500 text-color-gray-600 flex items-center justify-between gap-2 py-2"
    >
      {cached
        ? "마지막으로 확인한 상태예요."
        : "주문 상태를 불러오지 못했어요."}
      <button
        type="button"
        onClick={retry}
        className="typo-12-600 shrink-0 px-2 py-1 underline underline-offset-4"
      >
        다시 확인
      </button>
    </div>
  );
}

export default function OrderHistoryContent() {
  const query = useOrderHistory();
  const rows = query.data?.pages.flatMap((p) => p.content) ?? [];
  // A newly placed order can shift the offset between successive pages.
  const orders = new Map(rows.map((order) => [order.orderId, order]));
  return (
    <div className="flex min-h-[160px] flex-col">
      {query.isError && (
        <OrderReadError retry={query.retry} cached={!!query.data} />
      )}
      {!query.data && !query.isError && (
        <LoadingSpinner label="주문 내역 불러오는 중" />
      )}
      {query.data && !orders.size && (
        <p className="typo-14-500 text-color-gray-400 py-10 text-center">
          주문 내역이 없습니다.
        </p>
      )}
      <div className="divide-color-gray-100 divide-y">
        {Array.from(orders.values(), (order) => (
          <PurchaseOrderRow key={order.orderId} order={order} />
        ))}
      </div>
      {query.hasNextPage && (
        <button
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
          className="typo-14-500 text-color-gray-500 bg-color-gray-50 mt-4 rounded-lg py-3"
        >
          주문 더 보기
        </button>
      )}
    </div>
  );
}
