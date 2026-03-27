import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type SignUpRequest = {
  email: string;
  password: string;
};

type SignUpResponse = {
  code: string;
  status: number;
  message: string;
};

const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>("/api/auth/signup", payload);
  return data;
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    retry: false,
  });
};
