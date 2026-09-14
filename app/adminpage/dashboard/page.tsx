import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import AdminDashboard from "./_components/AdminDashboard";
import {
  AdminOrder,
  ApiResponse,
  PaginatedResponse,
} from "@/hooks/admin/useAdminOrders";

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 대기 주문 목록을 미리 가져옵니다.
  await queryClient.prefetchQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      let allOrders: AdminOrder[] = [];
      let page = 0;
      let hasNext = true;

      while (hasNext) {
        const res = await serverApi.get<
          ApiResponse<PaginatedResponse<AdminOrder>>
        >({
          path: `/api/v1/admin/payment/requests?page=${page}&size=100&sort=requestedAt,desc`,
        });
        const responseData = res.data?.data;
        if (!responseData) break;

        allOrders = [...allOrders, ...(responseData.content || [])];
        hasNext = responseData.hasNext;
        page += 1;
      }

      return allOrders;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard />
    </HydrationBoundary>
  );
}
