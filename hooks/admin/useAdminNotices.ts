import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNoticeAction,
  updateNoticeAction,
  deleteNoticeAction,
} from "@/app/adminpage/notices/_actions/noticeActions";
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
  active: boolean;
}

export interface CreateNoticeBody {
  title: string;
  content: string;
  startTime: string;
  endTime: string;
}

export type UpdateNoticeBody = CreateNoticeBody;

/* ── 전체 공지사항 조회 (관리자용) ── */
const fetchAllNotices = async (): Promise<ApiResponse<NoticeItem[]>> => {
  const { data } = await api.get<ApiResponse<NoticeItem[]>>(
    "/api/v1/admin/notices",
  );
  return data;
};

/* ── 훅: 전체 공지사항 조회 ── */
export const useAllNotices = () => {
  return useQuery({
    queryKey: ["adminNotices"],
    queryFn: fetchAllNotices,
  });
};

/* ── 훅: 공지사항 등록 ── */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNoticeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
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
    }) => updateNoticeAction(noticeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
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
    mutationFn: deleteNoticeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(
        "❌ 공지사항 삭제 실패:",
        error.response?.data?.message || error.message,
      );
    },
  });
};
