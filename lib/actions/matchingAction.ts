"use server";

import { serverApi } from "@/lib/server-api";
import {
  MatchingRequest,
  MatchingResult,
  ApiResponse,
} from "@/lib/types/matching";
import { isAxiosError } from "@/lib/server-api";

/**
 * 매칭 실행 Server Action
 * 백엔드 API를 호출하여 매칭을 진행합니다.
 */
export async function postMatchingAction(
  payload: MatchingRequest,
): Promise<MatchingResult> {
  try {
    const response = await serverApi.post<MatchingResult>({
      path: "/api/matching",
      body: payload,
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message || "매칭 시스템 오류가 발생했습니다.";
      console.error("[postMatchingAction] API Error:", {
        status: error.response?.status,
        message,
        payload,
      });
      throw new Error(message);
    }

    console.error("[postMatchingAction] Unexpected Error:", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
}
