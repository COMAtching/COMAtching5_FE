import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface NicknameAvailabilityResponse {
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

const parseNicknameAvailability = (
  response: NicknameAvailabilityResponse,
): boolean => {
  const payload = response.data;

  if (typeof payload === "boolean") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (typeof payload.available === "boolean") {
      return payload.available;
    }

    if (typeof payload.isAvailable === "boolean") {
      return payload.isAvailable;
    }

    if (typeof payload.duplicate === "boolean") {
      return !payload.duplicate;
    }
  }

  throw new Error("닉네임 중복 검사 응답 형식을 확인할 수 없습니다.");
};

const checkNicknameAvailability = async (
  nickname: string,
): Promise<boolean> => {
  const { data: response } = await api.get<NicknameAvailabilityResponse>(
    "/api/auth/signup/nickname/availability",
    {
      params: { nickname },
    },
  );

  return parseNicknameAvailability(response);
};

export const useNicknameAvailability = () => {
  return useMutation({
    mutationFn: checkNicknameAvailability,
    retry: false,
  });
};
