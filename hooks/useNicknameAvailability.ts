import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export interface NicknameAvailabilityResponse {
  code: string;
  status: number;
  message: string;
  data?:
    | boolean
    | {
        available?: boolean;
        isAvailable?: boolean;
        duplicate?: boolean;
      };
}

const checkNicknameAvailability = async (
  nickname: string,
): Promise<NicknameAvailabilityResponse> => {
  const { data: response } = await api.get<NicknameAvailabilityResponse>(
    "/api/auth/signup/nickname/availability",
    {
      params: { nickname },
    },
  );

  return response;
};

export const useNicknameAvailability = () => {
  return useMutation({
    mutationFn: checkNicknameAvailability,
    retry: false,
  });
};
