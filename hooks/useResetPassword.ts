import { useMutation } from "@tanstack/react-query";
import {
  resetPasswordAction,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/lib/actions/authAction";

export const useResetPassword = () => {
  const mutation = useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: resetPasswordAction,
    retry: false,
  });

  const reset = (
    payload: ResetPasswordRequest,
    options: { onSuccess: () => void; onError: (msg?: string) => void },
  ) => {
    mutation.mutate(payload, {
      onSuccess: (data) => {
        if (data.status === 200) {
          options.onSuccess();
        } else {
          options.onError(data.message);
        }
      },
      onError: (error) => {
        // Server Action에서 에러가 발생해도 data 형태로 반환되므로
        // mutation.mutate의 onError는 네트워크 단절 등의 상황에서만 발생합니다.
        options.onError(error.message || "알 수 없는 오류가 발생했습니다.");
      },
    });
  };

  return { ...mutation, reset };
};
