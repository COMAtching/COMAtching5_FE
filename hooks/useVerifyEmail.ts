import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: verifyEmail,
    retry: 1,
  });
};
