import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface ChatMemberProfile {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  major: string;
  historyId: number | null;
  favorite: boolean;
}

export interface ChatMemberProfileResponse {
  code: string;
  status: number;
  message: string;
  data: ChatMemberProfile;
}

export const fetchChatMemberProfile = async (
  memberId: number,
): Promise<ChatMemberProfileResponse> => {
  const { data } = await api.get<ChatMemberProfileResponse>(
    `/api/chat/members/${memberId}/profile`,
  );
  return data;
};

export const useChatMemberProfile = (memberId?: number) => {
  return useQuery({
    queryKey: ["chatMemberProfile", memberId],
    queryFn: () => fetchChatMemberProfile(memberId!),
    enabled: !!memberId,
    staleTime: 1000 * 60 * 60, // 📡 상대방 프로필 정보는 1시간 동안 완전 신선(Fresh)하다고 판단하여 API 재호출 완벽 차단
    gcTime: 1000 * 60 * 90, // 🧠 1시간 30분 동안 메모리에 든든하게 캐시 보관
  });
};
