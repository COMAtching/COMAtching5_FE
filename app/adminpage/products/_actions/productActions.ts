"use server";

import { serverApi, isAxiosError } from "@/lib/server-api";
import { type CreateProductBody } from "@/hooks/admin/useAdminProducts";

/**
 * 상품 등록 Server Action
 */
export async function createProductAction(body: CreateProductBody) {
  try {
    const response = await serverApi.post({
      path: "/api/v1/admin/shop/products",
      body,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("상품 등록 중 알 수 없는 에러가 발생했습니다.");
  }
}

/**
 * 상품 삭제 Server Action
 */
export async function deleteProductAction(productId: number) {
  try {
    const response = await serverApi.delete({
      path: `/api/v1/admin/shop/products/${productId}`,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("상품 삭제 중 알 수 없는 에러가 발생했습니다.");
  }
}
