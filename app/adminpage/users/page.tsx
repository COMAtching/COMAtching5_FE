import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import AdminMembers from "./_components/AdminMembers";

export default async function AdminMembersPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 전체 사용자 목록을 미리 가져옵니다. (기본 검색어 없음)
  await queryClient.prefetchQuery({
    queryKey: ["adminMembers", undefined],
    queryFn: async () => {
      const res = await serverApi.get({
        path: "/api/v1/admin/users",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminMembers />
    </HydrationBoundary>
  );
}
