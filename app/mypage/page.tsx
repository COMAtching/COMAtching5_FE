import { serverApi } from "@/lib/server-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ScreenMyPage from "./_components/ScreenMyPage";
import { ProfileResponse } from "@/hooks/useProfile";

export default async function MyPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await serverApi.get<ProfileResponse>({
        path: "/api/members/profile",
      });
      console.log("[Server SSR] My Profile Data:", res.data);
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenMyPage />
    </HydrationBoundary>
  );
}
