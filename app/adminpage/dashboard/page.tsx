import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import AdminDashboard from "./_components/AdminDashboard";

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 대기 주문 목록을 미리 가져옵니다.
  await queryClient.prefetchQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await serverApi.get({
        path: "/api/v1/admin/payment/requests",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard />
    </HydrationBoundary>
  );
}
