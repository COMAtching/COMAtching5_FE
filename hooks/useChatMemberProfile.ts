import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface ChatMemberProfile {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  major: string;
  age: number;
  mbti: string;
  contactFrequency: string;
  hobbies: { category: string; name: string }[];
  tags: { tag: string }[];
  song: string | null;
  intro: string | null;
  socialType: string | null;
  socialAccountId: string | null;
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
    staleTime: 1000 * 10, // 📡 10초 동안은 캐시를 유지하여 잦은 재진입 시 불필요한 API 호출을 차단합니다
    gcTime: 1000 * 15, // 🧠 15초 뒤에 미사용 캐시를 정리합니다
  });
};
