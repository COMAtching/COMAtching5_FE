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
): Promise<ChatMessagesResponse> => {
  const { data } = await api.get<ChatMessagesResponse>(
    `/api/chat/rooms/${roomId}/messages`,
    {
      params: {
        page,
        size,
      },
    },
  );
  return data;
};

export const useChatMessages = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: ({ pageParam = 0 }) =>
      fetchChatMessages(roomId, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 만약 응답 메시지 개수가 요청 크기(20)보다 작으면 다음 페이지 없음
      const lastPageSize = lastPage.data?.length ?? 0;
      if (lastPageSize < 20) {
        return undefined;
      }
      return allPages.length; // 다음 페이지 번호 (0부터 시작하므로 allPages.length와 같음)
    },
    enabled: !!roomId,
    staleTime: 0,
    gcTime: 0, // 캐시를 남기지 않음
  });
};
