import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useProfileStore } from "@/stores/profile-store";
import { ProfileSubmitData } from "@/lib/types/profile";
import { uploadProfileImage } from "@/lib/image-upload";

// 2. 가공된 프로필 제출 타입 (백엔드 요구사항에 맞춤)
interface SignUpResponse {
  code: string;
  status: number;
  message: string;
}

/**
 * 2단계: 최종 프로필 데이터를 전송하는 함수
 */
const signUpProfile = async (
  payload: ProfileSubmitData,
): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>(
    "/api/auth/signup/profile",
    payload,
    { headers: { "X-Onboarding-Session": useProfileStore.getState().owner } },
  );
  return data;
};

/**
 * 이미지 업로드 Mutation 훅
 */
export const useImageUpload = () => {
  return useMutation({
    mutationFn: uploadProfileImage,
  });
};

/**
 * 프로필 가입 Mutation 훅
 */
export const useProfileSignUp = () => {
  return useMutation({
    mutationFn: signUpProfile,
  });
};
