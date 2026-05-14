import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

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
): Promise<ChatMessagesResponse> => {
  const { data } = await api.get<ChatMessagesResponse>(
    `/api/chat/rooms/${roomId}/messages`,
  );
  return data;
};

export const useChatMessages = (roomId: string) => {
  return useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => fetchChatMessages(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });
};
