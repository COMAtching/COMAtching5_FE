import { api } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export type ChatMessagePayload = {
  id: string;
  roomId: string;
  senderId: number;
  content: string;
  type: "TALK" | "ENTER" | "LEAVE" | "READ";
  createdAt: string;
  readCount: number;
};

export type ChatMessagesResponse = {
  code: string;
  status: number;
  message: string;
  data: ChatMessagePayload[];
};

export const fetchChatMessages = async (
  roomId: string,
  page: number = 0,
  size: number = 20,
  beforeMessageId?: string,
): Promise<ChatMessagesResponse> => {
  const params: Record<string, string | number> = { page, size };
  if (beforeMessageId) {
    params.beforeMessageId = beforeMessageId;
  }
  const { data } = await api.get<ChatMessagesResponse>(
    `/api/chat/rooms/${roomId}/messages`,
    { params },
  );
  return data;
};

export const useChatMessages = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: ({ pageParam }) => {
      if (!pageParam) {
        return fetchChatMessages(roomId, 0, 20);
      }
      const { page, beforeMessageId } = pageParam as {
        page: number;
        beforeMessageId: string;
      };
      return fetchChatMessages(roomId, page, 20, beforeMessageId);
    },
    initialPageParam: null as { page: number; beforeMessageId?: string } | null,
    getNextPageParam: (lastPage, allPages) => {
      const lastPageSize = lastPage.data?.length ?? 0;
      if (lastPageSize < 20) {
        return undefined;
      }
      return {
        page: allPages.length,
        beforeMessageId: lastPage.data[0]?.id,
      };
    },
    enabled: !!roomId,
    staleTime: 0,
    gcTime: 0, // 캐시를 남기지 않음
  });
};
