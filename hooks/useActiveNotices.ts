import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
}

export interface NoticeResponse {
  code: string;
  status: number;
  message: string;
  data: Notice[];
}

/** 활성 공지사항 조회 API */
export const fetchActiveNotices = async (): Promise<NoticeResponse> => {
  const { data } = await api.get<NoticeResponse>("/api/v1/notices/active");
  return data;
};

/** 활성 공지사항 조회 훅 */
export const useActiveNotices = () => {
  return useQuery({
    queryKey: ["activeNotices"],
    queryFn: fetchActiveNotices,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
