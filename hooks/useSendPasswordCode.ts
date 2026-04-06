import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type SendPasswordCodeResponse = {
  code: string;
  status: number;
  message: string;
};

export const useSendPasswordCode = () => {
  return useMutation<SendPasswordCodeResponse, Error, string>({
    mutationFn: async (email: string) => {
      const { data } = await api.post<SendPasswordCodeResponse>(
        "/api/auth/password/code",
        { email },
      );

      if (data.status !== 200) {
        throw new Error(data.message || "이메일 전송에 실패했습니다.");
      }

      return data;
    },
    retry: false,
  });
};
