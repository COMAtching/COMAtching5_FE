import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

/* ── API 응답 타입 ── */
export interface ShopReward {
  itemType: "MATCHING_TICKET" | "OPTION_TICKET";
  itemName: string;
  quantity: number;
}

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
  isBundle: boolean;
  purchaseLimitPerMember?: number | null;
  firstPurchaseOnly?: boolean;
  usedPurchaseCount?: number;
  remainingPurchaseCount?: number | null;
  purchaseCountPurchasable?: boolean;
  purchaseBlockReason?: string;
  rewards: ShopReward[];
  bonusRewards: ShopReward[];
}

export interface ShopProductsResponse {
  code: string;
  status: number;
  message: string;
  data: ShopProduct[];
}

/* ── fetcher ── */
export const fetchShopProducts = async (): Promise<ShopProductsResponse> => {
  const { data } = await api.get<ShopProductsResponse>("/api/v1/shop/products");
  return data;
};

/* ── hook ── */
export const useShopProducts = () => {
  return useQuery({
    queryKey: ["shopProducts"],
    queryFn: fetchShopProducts,
    staleTime: 0, // 항상 최신 데이터를 백그라운드에서 다시 가져옴
    gcTime: Infinity, // 기존 데이터를 메모리에 유지하여 로딩 스피너 방지
  });
};
