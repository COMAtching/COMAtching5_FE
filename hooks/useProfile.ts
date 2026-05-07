import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileData } from "@/lib/types/profile";

export interface ProfileResponse {
  code: string;
  status: number;
  message: string;
  data: ProfileData;
}

/** 내 프로필 조회 API */
export const fetchMyProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get<ProfileResponse>("/api/members/profile");
  return data;
};

/** 내 프로필 수정 API */
export const updateMyProfile = async (
  payload: Partial<ProfileData>,
): Promise<ProfileResponse> => {
  const { data } = await api.patch<ProfileResponse>(
    "/api/members/profile",
    payload,
  );
  return data;
};

/** 프로필 조회 훅 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 60, // 1시간 동안 신선한 상태 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
  });
};

/** 프로필 수정 훅 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<ProfileData>) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
};
