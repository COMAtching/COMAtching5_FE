import { api } from "@/lib/axios";
import { adminOrderPageKey, adminOrderPagePath } from "@/lib/admin-order-page";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* ── 타입 정의 ── */
export interface AdminOrder {
  requestId: number;
  memberId: number;
  productId: number;
  productCode: string;
  requestedItemName: string;
  requesterRealName: string;
  requesterUsername: string;
  optionTicketQty: number;
  matchingTicketQty: number;
  requestedPrice: number;
  expectedPrice: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "EXPIRED";
  requestedAt: string;
  expiresAt: string;
}

/* ── 페이징 응답 구조 ── */
export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

/* ── 승인 ── */
const approveOrder = async (requestId: number): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    `/api/v1/admin/payment/approve/${requestId}`,
  );
  return data;
};

/* ── 거절 ── */
const rejectOrder = async (requestId: number): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    `/api/v1/admin/payment/reject/${requestId}`,
  );
  return data;
};

/* ── 대기 주문 목록 훅 ── */
export const useAdminOrders = (page: number) => {
  return useQuery({
    queryKey: adminOrderPageKey(page),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<
        ApiResponse<PaginatedResponse<AdminOrder>>
      >(adminOrderPagePath(page), { signal });
      return data.data;
    },
    refetchInterval: 30_000, // 30초 간격 백그라운드 갱신 (STOMP 보완)
  });
};

/* ── 승인 뮤테이션 ── */
export const useApproveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => approveOrder(requestId),
    onSuccess: (data) => {
      console.log("✅ [Admin] 결제 승인 완료 응답:", data);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      // 관리자가 승인했을 때 관련 룰렛 캐시(누적 결제금액 등)도 초기화
      queryClient.invalidateQueries({ queryKey: ["rouletteStatus"] });
      // 상품 목록(구매 제한 횟수 등) 캐시 초기화
      queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 승인 실패:", errorData?.message || error.message);
    },
  });
};

/* ── 거절 뮤테이션 ── */
export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => rejectOrder(requestId),
    onSuccess: (data) => {
      console.log("🚫 [Admin] 결제 거절 완료 응답:", data);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      // 관리자가 거절(또는 취소)했을 때도 관련 룰렛 캐시 초기화
      queryClient.invalidateQueries({ queryKey: ["rouletteStatus"] });
      // 상품 목록(구매 제한 횟수 등) 캐시 초기화
      queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 거절 실패:", errorData?.message || error.message);
    },
  });
};

export interface OrderGrant {
  orderId: number;
  status: AdminOrder["status"];
  grantStatus:
    | "PENDING"
    | "GRANTED"
    | "FAILED"
    | "REVIEW_REQUIRED"
    | "NOT_REQUESTED";
  attempt: number;
  refundStatus: "NONE" | RefundListStatus;
}

export interface FailedGrant extends Omit<OrderGrant, "refundStatus"> {
  requestedItemName: string;
}

const paymentPath = "/api/v1/admin/payment";
const failedGrantsKey = ["adminFailedGrants"] as const;
const grantKey = (orderId: number) => ["adminOrderGrant", orderId] as const;

export function useFailedGrants(page: number, isGrantsTab: boolean) {
  return useQuery({
    queryKey: [...failedGrantsKey, page],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<
        ApiResponse<PaginatedResponse<FailedGrant>>
      >(`${paymentPath}/grants`, {
        params: { grantStatus: "FAILED", page, size: 20 },
        signal,
      });
      return data.data;
    },
    // 다른 탭에서도 상단의 지급 실패 알림은 갱신한다.
    refetchInterval: isGrantsTab ? 5_000 : 30_000,
  });
}

function orderGrantQuery(orderId: number) {
  return {
    queryKey: grantKey(orderId),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const { data } = await api.get<ApiResponse<OrderGrant>>(
        `${paymentPath}/requests/${orderId}/grant`,
        { signal },
      );
      return data.data;
    },
  };
}

export function useOrderGrant(orderId: number, enabled: boolean) {
  return useQuery({
    ...orderGrantQuery(orderId),
    enabled,
    refetchInterval: (query) =>
      query.state.status !== "error" &&
      query.state.data?.grantStatus === "PENDING"
        ? 3000
        : false,
  });
}

export function useRetryGrant(orderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(`${paymentPath}/requests/${orderId}/grant/retry`);
        return "accepted" as const;
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response?.status === 409 &&
          error.response.data?.code === "PAY-015"
        ) {
          return "conflict" as const;
        }
        throw error;
      }
    },
    retry: false,
    onSettled: (outcome) => {
      if (outcome === "conflict")
        void queryClient.invalidateQueries({ queryKey: refundListsKey });
      void queryClient.invalidateQueries({ queryKey: failedGrantsKey });
      void queryClient.resetQueries({
        queryKey: grantKey(orderId),
        exact: true,
      });
    },
  });
}

export type RefundListStatus = "IN_PROGRESS" | "COMPLETED";
export interface OrderRefund {
  orderId: number;
  requestedItemName: string;
  amount: number;
  refundStatus: RefundListStatus;
  startedAt: string;
  startedBy: number;
  completedAt: string | null;
  completedBy: number | null;
}

const refundListsKey = ["adminRefunds"] as const;
export function useAdminRefunds(
  status: RefundListStatus,
  page: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...refundListsKey, status, page],
    enabled,
    queryFn: async ({ signal }) => {
      const { data } = await api.get<
        ApiResponse<PaginatedResponse<OrderRefund>>
      >(`${paymentPath}/refunds`, {
        params: { status, page, size: 20 },
        signal,
      });
      return data.data;
    },
    refetchInterval: 30_000,
  });
}

type RefundRequest = { orderId: number; action: "start" | "complete" };
export type RefundResult =
  | { kind: "recorded"; refund: OrderRefund }
  | { kind: "review"; orderId: number }
  | {
      kind: "check";
      orderId: number;
      action: RefundRequest["action"];
      current?: OrderGrant;
    };

export function useAdminRefundAction() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async ({
      orderId,
      action,
    }: RefundRequest): Promise<RefundResult> => {
      try {
        const { data } = await api.post<ApiResponse<OrderRefund>>(
          `${paymentPath}/requests/${orderId}/refund/${action}`,
        );
        return { kind: "recorded", refund: data.data };
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response?.status === 409 &&
          error.response.data?.code === "PAY-016"
        ) {
          return { kind: "review", orderId };
        }
        // 응답 유실이나 상태 충돌은 POST를 반복하지 않고 서버의 현재 상태로 확인한다.
        await client.cancelQueries({
          queryKey: grantKey(orderId),
          exact: true,
        });
        const current = await client
          .fetchQuery({
            ...orderGrantQuery(orderId),
            staleTime: 0,
            retry: false,
          })
          .catch(() => undefined);
        return { kind: "check", orderId, action, current };
      }
    },
    onSettled: async (_result, _error, { orderId }) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: failedGrantsKey }),
        client.invalidateQueries({ queryKey: refundListsKey }),
        client.invalidateQueries({ queryKey: grantKey(orderId), exact: true }),
      ]);
    },
  });
}
