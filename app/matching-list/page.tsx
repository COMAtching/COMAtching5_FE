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

  await queryClient.prefetchQuery({
    queryKey: ["matchingHistory"],
    queryFn: async () => {
      const res = await serverApi.get<MatchingHistoryResponse>({
        path: "/api/matching/history",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenMatchingList />
    </HydrationBoundary>
  );
}
