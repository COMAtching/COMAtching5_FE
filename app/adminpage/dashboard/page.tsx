import { unstable_rethrow } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import { adminOrderPageKey, adminOrderPagePath } from "@/lib/admin-order-page";
import AdminDashboard from "./_components/AdminDashboard";
import type {
  AdminOrder,
  ApiResponse,
  PaginatedResponse,
} from "@/hooks/admin/useAdminOrders";

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 대기 주문 목록을 미리 가져옵니다.
  await queryClient
    .fetchQuery({
      queryKey: adminOrderPageKey(0),
      queryFn: async () => {
        const res = await serverApi.get<
          ApiResponse<PaginatedResponse<AdminOrder>>
        >({
          path: adminOrderPagePath(0),
        });
        return res.data.data;
      },
    })
    .catch(unstable_rethrow);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard />
    </HydrationBoundary>
  );
}
