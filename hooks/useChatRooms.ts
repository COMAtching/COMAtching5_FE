import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { MatchingPartner } from "./useMatchingHistory";

export type ChatRoom = {
  id: string; // 채팅방 ID
  matchingId: number; // 매칭 ID
  initiatorUserId: number;
  targetUserId: number;
  otherUser: {
    memberId: number;
    nickname: string;
    profileImageUrl: string;
    university: string;
    major: string;
    age: number;
    gender?: import("@/lib/types/profile").Gender;
  };
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

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  console.log("📡 [fetchChatRooms] API 호출 시작...");
  try {
    const { data } = await api.get<ChatRoom[] | ChatRoomsResponse>(
      "/api/chat/rooms",
    );
    console.log("📡 [fetchChatRooms] API 호출 성공:", data);

    // 백엔드 응답이 { data: [...] } 형태인지 아니면 배열 그 자체인지 확인하여 처리
    if (Array.isArray(data)) return data;
    return data.data || [];
  } catch (error) {
    console.error("❌ [fetchChatRooms] API 호출 실패:", error);
    throw error;
  }
};

export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    staleTime: 0, // 항상 최신 데이터를 유지하도록 설정
    gcTime: 0, // 메모리 캐싱을 아예 하지 않고 컴포넌트가 꺼지면 즉시 캐시 소멸
  });
};

export type UnreadCountResponse = {
  code: string;
  status: number;
  message: string;
  data: number;
};

export const fetchUnreadCount = async (): Promise<number> => {
  console.log("📡 [fetchUnreadCount] API 호출 시작...");
  try {
    const { data } = await api.get<number | UnreadCountResponse>(
      "/api/chat/rooms/unread-count",
    );
    console.log("📡 [fetchUnreadCount] API 호출 성공:", data);

    if (typeof data === "number") return data;
    return typeof data.data === "number" ? data.data : 0;
  } catch (error) {
    console.error("❌ [fetchUnreadCount] API 호출 실패:", error);
    return 0;
  }
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["chatUnreadCount"],
    queryFn: fetchUnreadCount,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 1000 * 15, // 15초마다 주기적으로 서버에서 데이터를 갱신
  });
};
