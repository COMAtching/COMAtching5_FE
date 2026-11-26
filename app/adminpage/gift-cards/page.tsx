import { unstable_rethrow } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import GiftCardsDashboard from "./_components/GiftCardsDashboard";
import { AdminGiftCardWinner } from "@/hooks/admin/useAdminGiftCards";
import { ApiResponse } from "@/hooks/admin/useAdminOrders";

export default async function AdminGiftCardsPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 상품권 미지급 내역을 미리 가져옵니다.
  await queryClient
    .fetchQuery({
      queryKey: ["adminGiftCards"],
      queryFn: async () => {
        const res = await serverApi.get<ApiResponse<AdminGiftCardWinner[]>>({
          path: `/api/v1/admin/roulette/gift-cards/unpaid`,
        });
        return res.data?.data || [];
      },
    })
    .catch(unstable_rethrow);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GiftCardsDashboard />
    </HydrationBoundary>
  );
}
