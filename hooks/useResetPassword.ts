import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type ResetPasswordRequest = {
  email: string;
  code: string;
  newPassword: string;
};

type ResetPasswordResponse = {
  code: string;
  status: number;
  message: string;
};

const resetPassword = async (
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const { data } = await axios.patch<ResetPasswordResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/code`,
    payload,
  );
  return data;
};

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: resetPassword,
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
        if (isAxiosError(error) && error.response?.data?.message) {
          options.onError(error.response.data.message);
        } else {
          options.onError();
        }
      },
    });
  };

  return { ...mutation, reset };
};
