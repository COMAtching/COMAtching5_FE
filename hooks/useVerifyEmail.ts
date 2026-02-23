import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type VerifyEmailRequest = {
  email: string;
  code: string;
};

type VerifyEmailResponse = {
  code: string;
  status: number;
  message: string;
};

const verifyEmail = async (
  payload: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const { data } = await api.post<VerifyEmailResponse>(
    "/api/auth/email/verify",
    payload,
  );
  return data;
};

export const useVerifyEmail = () => {
  const mutation = useMutation({
    mutationFn: verifyEmail,
    retry: 1,
  });

  const verify = (
    payload: VerifyEmailRequest,
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

  return { ...mutation, verify };
};
