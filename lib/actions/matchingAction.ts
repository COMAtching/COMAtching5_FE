"use server";

import { serverApi } from "@/lib/server-api";
import {
  MatchingRequest,
  MatchingResult,
  ApiResponse,
} from "@/lib/types/matching";
import { isAxiosError } from "@/lib/server-api";
import { MatchingRequestSchema } from "@/lib/validations";

export type MatchingActionResult = {
  success: boolean;
  message?: string;
  data?: MatchingResult;
};

/**
 * 매칭 실행 Server Action
 * 백엔드 API를 호출하여 매칭을 진행합니다.
 */
export async function postMatchingAction(
  payload: MatchingRequest,
): Promise<MatchingActionResult> {
  // ✅ 런타임 입력값 검증
  const parsed = MatchingRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: "매칭 요청 값이 올바르지 않습니다" };
  }

  try {
    const response = await serverApi.post<ApiResponse<MatchingResult>>({
      path: "/api/matching",
      body: parsed.data,
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message || "매칭 시스템 오류가 발생했습니다.";
      console.error("[postMatchingAction] API Error:", {
        status: error.response?.status,
        message,
        payload,
      });
      return { success: false, message };
    }

    console.error("[postMatchingAction] Unexpected Error:", error);
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
}
