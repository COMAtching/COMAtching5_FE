import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import AdminNotices from "./_components/AdminNotices";

export default async function AdminNoticesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["adminNotices"],
    queryFn: async () => {
      const res = await serverApi.get({
        path: "/api/v1/admin/notices",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminNotices />
    </HydrationBoundary>
  );
}
