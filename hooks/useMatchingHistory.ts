import { api } from "@/lib/axios";
import {
  Gender,
  MBTI,
  SocialType,
  Hobby,
  ContactFrequency,
} from "@/lib/types/profile";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

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
  hobbies: { category: string; name: string }[] | null;
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
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext
        ? lastPage.data.currentPage + 1
        : undefined;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};

/** 매칭 히스토리 즐겨찾기 변경 */
export const updateFavorite = async (
  historyId: number,
  favorite: boolean,
): Promise<void> => {
  await api.post("/api/matching/history/favorite", {
    historyId,
    favorite,
  });
};

/** 매칭 히스토리 즐겨찾기 변경 mutation */
export const useUpdateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      historyId,
      favorite,
    }: {
      historyId: number;
      favorite: boolean;
    }) => updateFavorite(historyId, favorite),
    onMutate: async ({ historyId, favorite }) => {
      // 캔슬 쿼리
      await queryClient.cancelQueries({ queryKey: ["matchingHistory"] });

      // 이전 값 저장
      const previousHistory = queryClient.getQueryData(["matchingHistory"]);

      // 낙관적 업데이트
      queryClient.setQueryData<InfiniteData<MatchingHistoryResponse>>(
        ["matchingHistory"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                content: page.data.content.map((item) =>
                  item.historyId === historyId ? { ...item, favorite } : item,
                ),
              },
            })),
          };
        },
      );

      return { previousHistory };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousHistory) {
        queryClient.setQueryData(["matchingHistory"], context.previousHistory);
      }
    },
    onSettled: () => {
      // 최종적으로 무효화
      queryClient.invalidateQueries({ queryKey: ["matchingHistory"] });
    },
  });
};
