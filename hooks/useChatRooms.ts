import { api } from "@/lib/axios";
import { EXPECTED_SESSION } from "@/lib/browser-session";
import { useChatViewer } from "@/hooks/useChatViewer";
import { useQuery } from "@tanstack/react-query";

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

export function useChatRooms({ refetchOnMount = true } = {}) {
  const { viewer } = useChatViewer();
  return useQuery({
    queryKey: ["chatRooms", viewer?.owner, viewer?.memberId],
    enabled: !!viewer,
    queryFn: async ({ signal }) => {
      if (!viewer) throw new Error("채팅 로그인 확인이 필요합니다.");
      const { data } = await api.get<ChatRoomsResponse | ChatRoom[]>(
        "/api/chat/rooms",
        {
          signal,
          headers: { [EXPECTED_SESSION]: viewer.owner },
        },
      );
      const rooms = Array.isArray(data) ? data : data?.data;
      if (!Array.isArray(rooms))
        throw new Error("채팅 목록을 확인할 수 없습니다.");
      return rooms;
    },
    refetchOnMount,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 60_000,
  });
}

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
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });
};
