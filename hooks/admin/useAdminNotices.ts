import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* ── 타입 정의 ── */
interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

export interface NoticeItem {
  noticeId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
}

export interface CreateNoticeBody {
  title: string;
  content: string;
  startTime: string;
  endTime: string;
}

export type UpdateNoticeBody = CreateNoticeBody;

/* ── 활성 공지사항 조회 ── */
const fetchActiveNotices = async (): Promise<ApiResponse<NoticeItem[]>> => {
  const { data } = await api.get<ApiResponse<NoticeItem[]>>(
    "/api/v1/notices/active",
  );
  return data;
};

/* ── 공지사항 등록 ── */
const createNotice = async (
  body: CreateNoticeBody,
): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    "/api/v1/admin/notices",
    body,
  );
  return data;
};

/* ── 공지사항 수정 ── */
const updateNotice = async (
  noticeId: number,
  body: UpdateNoticeBody,
): Promise<ApiResponse<null>> => {
  const { data } = await api.patch<ApiResponse<null>>(
    `/api/v1/admin/notices/${noticeId}`,
    body,
  );
  return data;
};

/* ── 공지사항 삭제 ── */
const deleteNotice = async (noticeId: number): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/api/v1/admin/notices/${noticeId}`,
  );
  return data;
};

/* ── 훅: 활성 공지사항 조회 ── */
export const useActiveNotices = () => {
  return useQuery({
    queryKey: ["adminNotices"],
    queryFn: fetchActiveNotices,
  });
};

/* ── 훅: 공지사항 등록 ── */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateNoticeBody) => createNotice(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      console.error(
        "❌ 공지사항 등록 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

/* ── 훅: 공지사항 수정 ── */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      body,
    }: {
      noticeId: number;
      body: UpdateNoticeBody;
    }) => updateNotice(noticeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      console.error(
        "❌ 공지사항 수정 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};

/* ── 훅: 공지사항 삭제 ── */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      console.error(
        "❌ 공지사항 삭제 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};
