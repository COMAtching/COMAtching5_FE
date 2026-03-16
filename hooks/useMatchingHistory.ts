import { api } from "@/lib/axios";
import {
  Gender,
  MBTI,
  SocialType,
  Hobby,
  IntroItem,
  ContactFrequency,
} from "@/lib/types/profile";
import { useQuery } from "@tanstack/react-query";

export interface MatchingPartner {
  memberId: number;
  email: string;
  nickname: string;
  gender: Gender;
  birthDate: string;
  mbti: MBTI;
  intro: string | null;
  profileImageKey: string;
  socialType: SocialType | null;
  socialAccountId: string | null;
  university: string;
  major: string;
  contactFrequency: ContactFrequency;
  hobbies: Hobby[];
  intros: IntroItem[];
  tags: { tag: string }[] | null;
  song: string | null;
}

export interface MatchingHistoryItem {
  historyId: number;
  partner: MatchingPartner;
  favorite: boolean;
  matchedAt: string;
}

export interface MatchingHistoryResponse {
  code: string;
  status: number;
  message: string;
  data: {
    content: MatchingHistoryItem[];
    currentPage: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const fetchMatchingHistory =
  async (): Promise<MatchingHistoryResponse> => {
    const { data } = await api.get<MatchingHistoryResponse>(
      "/api/matching/history",
    );
    return data;
  };

export const useMatchingHistory = () => {
  return useQuery({
    queryKey: ["matchingHistory"],
    queryFn: fetchMatchingHistory,
    staleTime: Infinity, // 새로운 매칭이나 즐겨찾기 변경 전까지는 캐시 유지
    gcTime: 1000 * 60 * 60, // 메모리에서 1시간 동안 유지
  });
};
