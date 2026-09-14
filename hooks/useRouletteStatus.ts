import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

/* ── 응답 타입 ── */
export interface RoulettePageResponse {
  isFreeParticipated: boolean;
  isSpecialParticipated: boolean;
  totalPay: number;
}

interface RoulettePageApiResponse {
  code: string;
  status: number;
  message: string;
  data: RoulettePageResponse;
}

/* ── fetcher ── */
export const fetchRouletteStatus = async (): Promise<RoulettePageResponse> => {
  const { data } = await api.get<RoulettePageApiResponse>(
    "/api/items/roulette",
  );
  console.log("🎰 [CSR] GET /api/items/roulette 응답:", data);
  return data.data;
};

/* ── hook ── */
export const useRouletteStatus = () => {
  return useQuery({
    queryKey: ["rouletteStatus"],
    queryFn: fetchRouletteStatus,
    // 오늘 참여 여부는 하루 단위로 초기화되므로, 페이지 진입 시 항상 최신값을 가져옴
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5분
  });
};
