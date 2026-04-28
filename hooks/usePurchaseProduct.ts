import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface PurchaseResponse {
  code: string;
  status: number;
  message: string;
  data: null;
}

/**
 * 상품 구매(주문 생성) API 호출 함수
 */
export const postPurchaseProduct = async (
  productId: number,
): Promise<PurchaseResponse> => {
  const { data } = await api.post<PurchaseResponse>(
    `/api/v1/shop/purchase/${productId}`,
    {},
  );
  return data;
};

/**
 * 상품 구매(주문 생성) Mutation 훅
 */
export const usePurchaseProduct = () => {
  return useMutation({
    mutationFn: (productId: number) => postPurchaseProduct(productId),
    onSuccess: (data) => {
      console.log("✅ 주문 생성 성공:", data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 주문 생성 실패:", errorData?.message || error.message);
    },
  });
};
