"use client";

import { orderKey, useMemberSession } from "./useMemberSession";
export { orderKey } from "./useMemberSession";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { EXPECTED_SESSION } from "@/lib/browser-session";

export const statusLabels = {
  AWAITING_DEPOSIT: "입금 확인 대기",
  GRANTING: "입금 확인 완료 · 아이템 지급 중",
  GRANT_DELAYED: "아이템 지급 지연",
  REVIEW_REQUIRED: "주문 확인 중",
  GRANTED: "지급 완료",
  REJECTED: "요청 거절",
  CANCELED: "주문 취소",
  EXPIRED: "입금 확인 기한 만료",
  REFUNDING: "환불 진행 중",
  REFUNDED: "환불 완료",
} as const;

export interface PurchaseOrder {
  orderId: number;
  productName: string;
  quantity: number | null;
  amount: number;
  requestedAt: string;
  expiresAt: string;
  status: keyof typeof statusLabels;
  depositorName?: string;
}
interface OrdersPage {
  content: PurchaseOrder[];
  currentPage: number;
  totalElements: number;
  hasNext: boolean;
}

async function fetchOrders(
  owner: string,
  scope: "ACTIVE" | "ALL",
  page: number,
  signal: AbortSignal,
) {
  const { data } = await api.get<{ data: OrdersPage }>(
    "/api/v1/shop/purchase/orders",
    {
      params: { scope, page, size: 20 },
      headers: { [EXPECTED_SESSION]: owner },
      signal,
    },
  );
  return data.data;
}

function changed(previous: OrdersPage, next: OrdersPage) {
  return (
    previous.totalElements !== next.totalElements ||
    previous.content.some(
      (order, i) =>
        order.orderId !== next.content[i]?.orderId ||
        order.status !== next.content[i]?.status,
    )
  );
}

export function useActiveOrders(poll = false) {
  const client = useQueryClient();
  const session = useMemberSession();
  const { owner } = session;
  const key = [...orderKey, owner, "ACTIVE"];
  const query = useQuery({
    queryKey: key,
    enabled: !!owner,
    queryFn: async ({ signal }) => {
      const next = await fetchOrders(owner!, "ACTIVE", 0, signal);
      const previous = client.getQueryData<OrdersPage>(key);
      if (
        !signal.aborted &&
        previous &&
        (changed(previous, next) || previous.hasNext)
      ) {
        for (const key of [
          [...orderKey, owner, "ALL"],
          ["items"],
          ["itemHistory"],
          ["shopProducts"],
          ["purchaseLimits"],
        ]) {
          void client.invalidateQueries({ queryKey: key });
        }
      }
      return next;
    },
    refetchInterval: ({ state }) =>
      poll && state.data?.totalElements ? 5000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
  });
  return {
    ...query,
    isError: session.isError || query.isError,
    retry: () => session.retry(query.refetch),
  };
}

export function useOrderHistory() {
  const session = useMemberSession();
  const { owner } = session;
  const query = useInfiniteQuery({
    queryKey: [...orderKey, owner, "ALL"],
    enabled: !!owner,
    queryFn: ({ pageParam, signal }) =>
      fetchOrders(owner!, "ALL", pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.hasNext ? last.currentPage + 1 : undefined,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
  });
  return {
    ...query,
    isError: session.isError || query.isError,
    retry: () => session.retry(query.refetch),
  };
}
