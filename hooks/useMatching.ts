import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MatchingRequest,
  MatchingResult,
  ApiResponse,
} from "@/lib/types/matching";
import { useMatchingStore } from "@/stores/matching-store";
import { useRouter } from "next/navigation";

/**
 * 매칭 API 호출 (클라이언트 사이드)
 */
const postMatching = async (
  payload: MatchingRequest,
): Promise<ApiResponse<MatchingResult>> => {
  const { data } = await api.post<ApiResponse<MatchingResult>>(
    "/api/matching",
    payload,
  );
  return data;
};

/**
 * 매칭 실행 Mutation 훅
 * 성공 시 매칭 결과를 Zustand store에 저장하고 결과 페이지로 이동합니다.
 */
export const useMatching = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setResult, setLastPayload, setIsMatching } = useMatchingStore();

  return useMutation({
    mutationFn: postMatching,
    onMutate: () => {
      setIsMatching(true);
    },
    onSuccess: (response, payload) => {
      console.log("✅ 매칭 성공:", response);

      // 1. 결과 데이터를 Zustand store에 저장
      setResult(response.data);
      setIsMatching(false);

      // 2. 마지막 매칭 조건 저장 (같은 조건 재매칭용)
      setLastPayload(payload);

      // 3. 매칭권/아이템 소모 → 아이템 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["items"] });

      // 4. 매칭 히스토리 캐시도 무효화
      queryClient.invalidateQueries({ queryKey: ["matchingHistory"] });

      // 5. 결과 페이지로 이동
      router.push("/matching-result");
    },
    onError: (error) => {
      setIsMatching(false);
      const message =
        error instanceof Error ? error.message : "매칭 중 오류가 발생했습니다.";
      console.error("❌ 매칭 실패:", message);
      alert(message);
    },
  });
};
