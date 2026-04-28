import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMatchingAction } from "@/lib/actions/matchingAction";

/**
 * 매칭 실행 Mutation 훅
 * 성공 시 매칭된 유저 정보를 반환합니다.
 */
export const useMatching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMatchingAction,
    onSuccess: (data) => {
      console.log("✅ 매칭 성공:", data);
      // 매칭권 소모되므로 아이템 정보 무효화
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.error("❌ 매칭 실패:", (error as Error).message);
    },
  });
};
