import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { MatchingPartner } from "./useMatchingHistory";

export type ChatRoom = {
  historyId: number;
  chatRoomId: string;
  partner: MatchingPartner;
  favorite: boolean;
  matchedAt: string;
};

export type ChatRoomsResponse = {
  code: string;
  status: number;
  message: string;
  data: ChatRoom[];
};

/**
 * 채팅방 목록 조회 (전체 응답이 배열인 경우와 객체인 경우 대응)
 */
export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const { data } = await api.get<ChatRoom[] | ChatRoomsResponse>(
    "/api/chat/rooms",
  );
  // 백엔드 응답이 { data: [...] } 형태인지 아니면 배열 그 자체인지 확인하여 처리
  if (Array.isArray(data)) return data;
  return data.data || [];
};

export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
