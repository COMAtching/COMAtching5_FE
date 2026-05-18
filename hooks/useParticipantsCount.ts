import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

/* ── API 응답 타입 ── */
export interface ParticipantsCountResponse {
  code: string;
  status: number;
  message: string;
  data: {
    count: number;
  };
}

/* ── fetcher ── */
export const fetchParticipantsCount =
  async (): Promise<ParticipantsCountResponse> => {
    console.log(
      "📡 [useParticipantsCount] Fetching count from /api/auth/participants...",
    );
    try {
      const { data } = await api.get<ParticipantsCountResponse>(
        "/api/auth/participants",
      );
      console.log("✅ [useParticipantsCount] Fetch success:", data);
      return data;
    } catch (error) {
      console.error("❌ [useParticipantsCount] Fetch failed:", error);
      throw error;
    }
  };

/* ── hook ── */
/**
 * 활성 사용자 수(ROLE_USER + ACTIVE)를 조회하는 훅
 * 30분 동안 캐싱됩니다.
 */
export const useParticipantsCount = () => {
  return useQuery({
    queryKey: ["participantsCount"],
    queryFn: fetchParticipantsCount,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 35, // staleTime보다 약간 길게 설정하여 캐시 유지
  });
};
