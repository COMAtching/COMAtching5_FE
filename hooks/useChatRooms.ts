import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type ChatRoom = {
  id: string;
  matchingId: number;
  initiatorUserId: number;
  targetUserId: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
};

export type ChatRoomsResponse = {
  code: string;
  status: number;
  message: string;
  data: ChatRoom[];
};

export const fetchChatRooms = async (): Promise<ChatRoomsResponse> => {
  const { data } = await api.get<ChatRoomsResponse>("/api/chat/rooms");
  return data;
};

export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
