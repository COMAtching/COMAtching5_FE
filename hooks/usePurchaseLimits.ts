import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type ItemType = "MATCHING_TICKET" | "OPTION_TICKET";

export interface PurchaseLimit {
  itemType: ItemType;
  itemName: string;
  ownedQuantity: number;
  pendingQuantity: number;
  maxQuantity: number;
  remainingQuantity: number;
  purchasable: boolean;
}

export interface PurchaseLimitsResponse {
  code: string;
  status: number;
  message: string;
  data: {
    limits: PurchaseLimit[];
  };
}

/**
 * 아이템 구매 한도 조회 API 호출 함수
 */
export const getPurchaseLimits = async (): Promise<PurchaseLimitsResponse> => {
  const { data } = await api.get<PurchaseLimitsResponse>(
    "/api/v1/shop/purchase/limits",
  );
  return data;
};

/**
 * 아이템 구매 한도 조회 훅
 */
export const usePurchaseLimits = () => {
  return useQuery({
    queryKey: ["purchaseLimits"],
    queryFn: getPurchaseLimits,
    staleTime: 0, // 1분 대기 없이 항상 서버에서 최신 한도를 백그라운드 갱신
    gcTime: Infinity, // 메모리에 남겨둬서 화면 깜빡임/로딩바 방지
  });
};
