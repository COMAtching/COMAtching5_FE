import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface RealNameResponse {
  code: string;
  status: number;
  message: string;
  data: {
    realName: string | null;
  };
}

/**
 * 사용자 실명 조회 API 호출 함수
 */
export const getRealName = async (): Promise<RealNameResponse> => {
  const { data } = await api.get<RealNameResponse>("/api/members/real-name");
  console.log("📡 [GET] /api/members/real-name 응답 데이터:", data);
  return data;
};

/**
 * 사용자 실명 조회 훅
 */
export const useRealName = () => {
  return useQuery({
    queryKey: ["realName"],
    queryFn: getRealName,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
