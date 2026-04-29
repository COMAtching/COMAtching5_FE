import { serverApi } from "@/lib/server-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import ScreenMainPage from "./_components/ScreenMainPage";

import { ItemsResponse } from "@/hooks/useItems";
import { MatchingHistoryResponse } from "@/hooks/useMatchingHistory";

export default async function MainPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 데이터를 미리 가져와서 캐시에 채워줍니다.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["items"],
      queryFn: async () => {
        const res = await serverApi.get<ItemsResponse>({ path: "/api/items" });
        return res.data;
      },
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ["matchingHistory"],
      queryFn: async ({ pageParam }) => {
        const res = await serverApi.get<MatchingHistoryResponse>({
          path: "/api/matching/history",
          params: {
            page: pageParam as number,
            size: 30,
            sort: "matchedAt,desc",
          },
        });
        return res.data;
      },
      initialPageParam: 0,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenMainPage />
    </HydrationBoundary>
  );
}
