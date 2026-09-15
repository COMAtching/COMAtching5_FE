import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type { ApiResponse } from "./useAdminOrders";
import { ApiResponse } from "./useAdminOrders";
import { useToastStore } from "@/stores/toast-store";

export interface AdminGiftCardWinner {
  historyId: number;
  memberId: number;
  email: string;
  realName: string;
  nickname: string;
  rewardName: string;
  rouletteType: "FREE" | "SPECIAL";
  participatedAt: string;
}

const fetchAdminGiftCards = async (): Promise<AdminGiftCardWinner[]> => {
  const { data } = await api.get<ApiResponse<AdminGiftCardWinner[]>>(
    "/api/v1/admin/roulette/gift-cards/unpaid",
  );
  return data.data || [];
};

const grantGiftCard = async (historyId: number): Promise<ApiResponse<null>> => {
  const { data } = await api.patch<ApiResponse<null>>(
    `/api/v1/admin/roulette/gift-cards/${historyId}/grant`,
  );
  return data;
};

export const useAdminGiftCards = () => {
  return useQuery({
    queryKey: ["adminGiftCards"],
    queryFn: fetchAdminGiftCards,
  });
};

export const useGrantGiftCard = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (historyId: number) => grantGiftCard(historyId),
    onSuccess: (data) => {
      console.log("✅ [Admin] 상품권 지급 처리 완료:", data);
      showToast({
        title: "지급 완료",
        body: "상품권 지급 처리가 성공적으로 완료되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminGiftCards"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 지급 실패:", errorData?.message || error.message);
      showToast({
        title: "지급 실패",
        body: errorData?.message || "상품권 지급 처리 중 오류가 발생했습니다.",
      });
    },
  });
};
