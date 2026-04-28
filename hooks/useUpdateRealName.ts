import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateRealNameResponse {
  code: string;
  status: number;
  message: string;
  data: null;
}

/**
 * 사용자 실명 수정 API 호출 함수
 */
export const postRealName = async (
  realName: string,
): Promise<UpdateRealNameResponse> => {
  const { data } = await api.post<UpdateRealNameResponse>(
    "/api/members/real-name",
    { realName },
  );
  return data;
};

/**
 * 사용자 실명 수정 Mutation 훅
 */
export const useUpdateRealName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (realName: string) => postRealName(realName),
    onSuccess: (data) => {
      console.log("✅ 실명 수정 성공:", data);
      // 실명이 바뀌었으므로 관련 쿼리 무효화 (필요시)
      // queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorData = error.response?.data;
      console.error("❌ 실명 수정 실패:", errorData?.message || error.message);
    },
  });
};
