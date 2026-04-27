import { api } from "@/lib/axios";
import {
  Gender,
  MBTI,
  SocialType,
  Hobby,
  ContactFrequency,
} from "@/lib/types/profile";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface MatchingPartner {
  memberId: number;
  email: string;
  nickname: string;
  gender: Gender;
  birthDate: string | null;
  mbti: MBTI;
  intro: string | null;
  profileImageUrl: string | null;
  profileImageKey: string | null;
  socialType: SocialType | null;
  socialAccountId: string | null;
  university: string;
  major: string;
  contactFrequency: string;
  hobbies: { category: string; name: string }[];
  tags: { tag: string }[] | null;
  song: string | null;
  intros: { question: string; answer: string }[];
}

export interface MatchingHistoryItem {
  historyId: number;
  partner: MatchingPartner;
  favorite: boolean;
  matchedAt: string;
}

export interface MatchingHistoryPageData {
  content: MatchingHistoryItem[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MatchingHistoryResponse {
  code: string;
  status: number;
  message: string;
  data: MatchingHistoryPageData;
}

/** 매칭 히스토리 단일 페이지 조회 */
export const fetchMatchingHistoryPage = async (
  page: number = 0,
  size: number = 30,
): Promise<MatchingHistoryResponse> => {
  const { data } = await api.get<MatchingHistoryResponse>(
    "/api/matching/history",
    {
      params: {
        page,
        size,
        sort: "matchedAt,desc",
      },
    },
  );
  console.log("Matching History Data:", data);
  return data;
};

/** React Query useInfiniteQuery 훅 */
export const useMatchingHistory = () => {
  return useInfiniteQuery({
    queryKey: ["matchingHistory"],
    queryFn: ({ pageParam }) => fetchMatchingHistoryPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};
