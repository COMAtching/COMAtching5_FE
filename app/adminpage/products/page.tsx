import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverApi } from "@/lib/server-api";
import AdminProducts from "./_components/AdminProducts";

export default async function AdminProductsPage() {
  const queryClient = new QueryClient();

  // 서버사이드에서 상품 목록을 미리 가져옵니다.
  await queryClient.prefetchQuery({
    queryKey: ["adminProducts", undefined], // 필터가 'all'일 때
    queryFn: async () => {
      const res = await serverApi.get({
        path: "/api/v1/admin/shop/products",
      });
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProducts />
    </HydrationBoundary>
  );
}
