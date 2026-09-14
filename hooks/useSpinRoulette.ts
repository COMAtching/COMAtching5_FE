import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toast-store";
import { isAxiosError } from "axios";

export interface RouletteSpinResponse {
  rewardName: string;
}

export interface RouletteSpinApiResponse {
  code: string;
  status: number;
  message: string;
  data: RouletteSpinResponse;
}

export type RouletteType = "FREE" | "SPECIAL";

export const useSpinRoulette = (rouletteType: RouletteType) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<RouletteSpinApiResponse>(
        `/api/items/roulette/${rouletteType}/spins`,
      );
      return data.data;
    },
    onSuccess: () => {
      // 참여 이력 및 결제 금액 상태 동기화를 위해 무효화
      queryClient.invalidateQueries({ queryKey: ["rouletteStatus"] });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        const { code, message } = error.response.data;
        if (code === "ITEM-007") {
          showToast({
            title: "룰렛 참여 불가",
            body: "이미 룰렛에 참여하셨습니다",
          });
        } else if (code === "ITEM-008") {
          showToast({
            title: "스페셜 룰렛 참여 불가",
            body: "스페셜 룰렛 참여를 위한 오늘의 누적 결제 금액이 부족합니다.",
          });
        } else {
          showToast({
            title: "오류",
            body:
              message || "룰렛 실행에 실패했습니다. 관리자에게 문의해주세요.",
          });
        }
      } else {
        showToast({
          title: "오류",
          body: "오류가 발생했습니다.",
        });
      }
    },
  });
};
