import { serverApi } from "@/lib/server-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ScreenChatList from "./_components/ScreenChatList";
import { ChatRoomsResponse } from "@/hooks/useChatRooms";

export default async function ChatListPage() {
  const queryClient = new QueryClient();

  console.log("[SSR] Prefetching chat rooms...");
  await queryClient.prefetchQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const res = await serverApi.get<ChatRoomsResponse>({
        path: "/api/chat/rooms",
      });
      console.log("[SSR] Chat rooms response count:", res.data.data.length);
      // 클라이언트 훅과 동일하게 배열만 반환하도록 수정
      return res.data.data || [];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScreenChatList />
    </HydrationBoundary>
  );
}
