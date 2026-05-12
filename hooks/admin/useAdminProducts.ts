import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductAction,
  deleteProductAction,
} from "@/app/adminpage/products/_actions/productActions";
import { AxiosError } from "axios";
import type { ShopProduct } from "@/hooks/useShopProducts";

/* ── 타입 정의 ── */
interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

export interface CreateProductReward {
  itemType: "MATCHING_TICKET" | "OPTION_TICKET";
  quantity: number;
}

export interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
  isBundle: boolean;
  rewards: CreateProductReward[];
  bonusRewards: CreateProductReward[];
}

/* ── 관리자 상품 목록 조회 ── */
const fetchAdminProducts = async (
  isBundle?: boolean,
): Promise<ApiResponse<ShopProduct[]>> => {
  const params = isBundle !== undefined ? { isBundle } : {};
  const { data } = await api.get<ApiResponse<ShopProduct[]>>(
    "/api/v1/admin/shop/products",
    { params },
  );
  return data;
};

/* ── 훅: 상품 목록 조회 ── */
export const useAdminProducts = (isBundle?: boolean) => {
  return useQuery({
    queryKey: ["adminProducts", isBundle],
    queryFn: () => fetchAdminProducts(isBundle),
  });
};

/* ── 훅: 상품 등록 ── */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(
        "❌ 상품 등록 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

/* ── 훅: 상품 삭제(판매 중지) ── */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(
        "❌ 상품 삭제 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};
