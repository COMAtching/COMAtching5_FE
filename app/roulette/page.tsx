import ScreenRouletteMain from "./_components/ScreenRouletteMain";
import { serverApi } from "@/lib/server-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { RoulettePageResponse } from "@/hooks/useRouletteStatus";

export const metadata = {
  title: "룰렛",
  description: "룰렛 이벤트",
};

interface RoulettePageApiResponse {
  code: string;
  status: number;
  message: string;
  data: RoulettePageResponse;
}

export default async function RoulettePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["rouletteStatus"],
    queryFn: async () => {
      const res = await serverApi.get<RoulettePageApiResponse>({
        path: "/api/items/roulette",
      });
      console.log("🎰 [SSR-Main] GET /api/items/roulette 응답:", res.data);
      return res.data.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenRouletteMain />
    </HydrationBoundary>
  );
}
