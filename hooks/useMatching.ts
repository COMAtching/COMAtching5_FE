import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import {
  ApiResponse,
  MatchingRequest,
  MatchingResult,
} from "@/lib/types/matching";

/**
 * 매칭 실행 API 호출 함수
 */
const postMatching = async (
  payload: MatchingRequest,
): Promise<MatchingResult> => {
  const { data } = await api.post<ApiResponse<MatchingResult>>(
    "/api/matching",
    payload,
  );
  return data.data;
};

/**
 * 매칭 실행 Mutation 훅
 * 성공 시 매칭된 유저 정보를 반환합니다.
 */
export const useMatching = () => {
  return useMutation({
    mutationFn: postMatching,
    onSuccess: (data) => {
      console.log("✅ 매칭 성공:", data);
    },
    onError: (error) => {
      console.error("❌ 매칭 실패:", error);
    },
  });
};
