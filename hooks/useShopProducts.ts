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
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};
