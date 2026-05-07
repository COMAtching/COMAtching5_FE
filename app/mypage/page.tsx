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

  const data = await queryClient.fetchQuery<ProfileResponse>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await serverApi.get<ProfileResponse>({
        path: "/api/members/profile",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenMyPage initialProfile={data.data} />
    </HydrationBoundary>
  );
}
