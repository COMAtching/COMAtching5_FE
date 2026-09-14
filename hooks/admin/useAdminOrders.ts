import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* ── 타입 정의 ── */
export interface AdminOrder {
  requestId: number;
  memberId: number;
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

interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

/* ── 대기 주문 목록 조회 ── */
const fetchAdminOrders = async (): Promise<ApiResponse<AdminOrder[]>> => {
  const { data } = await api.get<ApiResponse<AdminOrder[]>>(
    "/api/v1/admin/payment/requests",
  );
  return data;
};

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
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchAdminOrders,
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
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 거절 실패:", errorData?.message || error.message);
    },
  });
};
