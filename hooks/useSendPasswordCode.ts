import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type SendPasswordCodeResponse = {
  code: string;
  status: number;
  message: string;
};

const sendPasswordCode = async (
  email: string,
): Promise<SendPasswordCodeResponse> => {
  const { data } = await axios.post<SendPasswordCodeResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/code`,
    { email },
  );
  return data;
};

export const useSendPasswordCode = () => {
  const mutation = useMutation({
    mutationFn: sendPasswordCode,
    retry: false,
  });

  const sendCode = (
    email: string,
    options: { onSuccess: () => void; onError: (msg?: string) => void },
  ) => {
    mutation.mutate(email, {
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

  return { ...mutation, sendCode };
};
