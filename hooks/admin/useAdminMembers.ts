import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* ── 타입 정의 ── */
export interface AdminMember {
  id: number;
  email: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  profileImageUrl: string | null;
  matchingTicketCount: number;
  optionTicketCount: number;
}

interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

export interface AdjustMemberItemsBody {
  itemType: "MATCHING_TICKET" | "OPTION_TICKET";
  quantity: number;
  action: "ADD" | "REMOVE";
  reason: string;
}

/* ── 1. 관리자 사용자 목록 조회 ── */
const fetchAdminMembers = async (
  keyword?: string,
): Promise<ApiResponse<AdminMember[]>> => {
  const params = keyword ? { keyword } : {};
  const { data } = await api.get<ApiResponse<AdminMember[]>>(
    "/api/v1/admin/users",
    { params },
  );
  return data;
};

/* ── 훅: 사용자 목록 조회 ── */
export const useAdminMembers = (keyword?: string) => {
  return useQuery({
    queryKey: ["adminMembers", keyword],
    queryFn: () => fetchAdminMembers(keyword),
  });
};

/* ── 2. 관리자 특정 사용자 상세 정보 조회 ── */
const fetchAdminMemberDetail = async (
  memberId: number,
): Promise<ApiResponse<AdminMember>> => {
  const { data } = await api.get<ApiResponse<AdminMember>>(
    `/api/v1/admin/users/${memberId}`,
  );
  return data;
};

/* ── 훅: 사용자 상세 정보 조회 ── */
export const useAdminMemberDetail = (memberId: number) => {
  return useQuery({
    queryKey: ["adminMemberDetail", memberId],
    queryFn: () => fetchAdminMemberDetail(memberId),
    enabled: !!memberId,
  });
};

/* ── 3. 관리자 사용자 아이템 수량 조정 (실제 API 연동) ── */
const adjustMemberItems = async ({
  memberId,
  body,
}: {
  memberId: number;
  body: AdjustMemberItemsBody;
}): Promise<ApiResponse<null>> => {
  const { data } = await api.patch<ApiResponse<null>>(
    `/api/v1/admin/users/${memberId}/items`,
    body,
  );
  return data;
};

/* ── 훅: 사용자 아이템 수량 조정 ── */
export const useAdjustMemberItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      body,
    }: {
      memberId: number;
      body: AdjustMemberItemsBody;
    }) => adjustMemberItems({ memberId, body }),
    onSuccess: (_, variables) => {
      // 목록 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      // 해당 사용자의 상세 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: ["adminMemberDetail", variables.memberId],
      });
    },
    onError: (error: AxiosError<{ code?: string; message?: string }>) => {
      const errorData = error.response?.data;
      console.error(
        "❌ 아이템 조정 실패:",
        errorData?.message || error.message,
      );
    },
  });
};
