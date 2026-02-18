import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type SendEmailResponse = {
  code: string;
  status: number;
  message: string;
};

const sendEmail = async (email: string): Promise<SendEmailResponse> => {
  const { data } = await api.post<SendEmailResponse>("/api/auth/email/send", {
    email,
  });
  return data;
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: sendEmail,
    retry: 1,
  });
};
