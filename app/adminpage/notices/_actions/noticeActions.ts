"use server";

import { serverApi, isAxiosError } from "@/lib/server-api";
import {
  type CreateNoticeBody,
  type UpdateNoticeBody,
} from "@/hooks/admin/useAdminNotices";

/**
 * 공지사항 등록 Server Action
 */
export async function createNoticeAction(body: CreateNoticeBody) {
  try {
    const response = await serverApi.post({
      path: "/api/v1/admin/notices",
      body,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("공지사항 등록 중 알 수 없는 에러가 발생했습니다.");
  }
}

/**
 * 공지사항 수정 Server Action
 */
export async function updateNoticeAction(
  noticeId: number,
  body: UpdateNoticeBody,
) {
  try {
    const response = await serverApi.patch({
      path: `/api/v1/admin/notices/${noticeId}`,
      body,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("공지사항 수정 중 알 수 없는 에러가 발생했습니다.");
  }
}

/**
 * 공지사항 삭제 Server Action
 */
export async function deleteNoticeAction(noticeId: number) {
  try {
    const response = await serverApi.delete({
      path: `/api/v1/admin/notices/${noticeId}`,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("공지사항 삭제 중 알 수 없는 에러가 발생했습니다.");
  }
}
