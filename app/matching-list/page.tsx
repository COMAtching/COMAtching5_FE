import { serverApi } from "@/lib/server-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ScreenMatchingList from "./_components/ScreenMatchingList";
import { MatchingHistoryResponse } from "@/hooks/useMatchingHistory";

export default async function MatchingListPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["matchingHistory"],
    queryFn: async ({ pageParam }) => {
      const res = await serverApi.get<MatchingHistoryResponse>({
        path: "/api/matching/history",
        params: {
          page: pageParam,
          size: 30,
          sort: "matchedAt,desc",
        },
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: MatchingHistoryResponse) =>
      lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenMatchingList />
    </HydrationBoundary>
  );
}
