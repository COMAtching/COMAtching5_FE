import { useMutation } from "@tanstack/react-query";
import {
  resetPasswordAction,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/lib/actions/authAction";

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: async (payload) => {
      const data = await resetPasswordAction(payload);

      // 서버 액션이 성공하더라도 비즈니스 로직상 에러(status !== 200)인 경우
      // 명시적으로 에러를 던져서 mutate의 onError가 실행되도록 합니다.
      if (data.status !== 200) {
        throw new Error(data.message || "비밀번호 변경에 실패했습니다.");
      }

      return data;
    },
    retry: false,
  });
};
