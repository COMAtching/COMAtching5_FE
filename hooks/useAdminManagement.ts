/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export type UserListItem = {
  uuid: string;
  email: string;
  username: string;
  role: string;
};

export type UserListResponse = {
  status: number;
  message: string;
  data: {
    content: UserListItem[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
};

export type AdminActionResponse = {
  status: number;
  message: string;
  data: any;
};

const getUserList = async (
  page: number,
  size: number,
): Promise<UserListResponse> => {
  const { data } = await api.get<UserListResponse>(`/auth/operator/user-list`, {
    params: { page, size },
  });
  return data;
};

const searchUsers = async (
  searchType: "email" | "username",
  keyword: string,
): Promise<UserListResponse> => {
  const { data } = await api.get<UserListResponse>(`/auth/operator/user-list`, {
    params: { searchType, keyword },
  });
  return data;
};

const toggle1000Button = async (): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>("/auth/admin/make1000");
  return data;
};

const getUserDetail = async (uuid: string): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(`/auth/operator/user`, {
    params: { uuid },
  });
  return data;
};

const getPaymentHistory = async (
  uuid: string,
): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(
    `/auth/operator/api/history/payment/${uuid}`,
  );
  return data;
};

const adjustPoint = async (payload: {
  uuid: string;
  point: number;
  reason: string;
}): Promise<AdminActionResponse> => {
  const { data } = await api.patch<AdminActionResponse>(
    `/auth/operator/api/point`,
    payload,
  );
  return data;
};

const registerNotice = async (payload: {
  title: string;
  content: string;
  postedAt: string;
  closedAt: string;
}): Promise<AdminActionResponse> => {
  const { data } = await api.post<AdminActionResponse>(
    "/auth/admin/notice",
    payload,
  );
  return data;
};

const getNoticeList = async (
  type: "RESERVATION" | "HISTORY",
): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(
    `/auth/admin/notice/list?type=${type}`,
  );
  return data;
};

const deleteNotice = async (noticeId: number): Promise<AdminActionResponse> => {
  const { data } = await api.delete<AdminActionResponse>(
    `/auth/admin/notice/${noticeId}`,
  );
  return data;
};

const registerDiscountEvent = async (payload: {
  eventType: "DISCOUNT";
  start: string;
  end: string;
  discountRate: string;
}): Promise<AdminActionResponse> => {
  const { data } = await api.post<AdminActionResponse>(
    "/auth/admin/event/discount",
    payload,
  );
  return data;
};

const registerFreeMatchEvent = async (payload: {
  eventType: "FREE_MATCH";
  start: string;
  end: string;
}): Promise<AdminActionResponse> => {
  const { data } = await api.post<AdminActionResponse>(
    "/auth/admin/event/free-match",
    payload,
  );
  return data;
};

const getEventList = async (
  type: "RESERVATION" | "HISTORY",
): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(
    `/auth/admin/event/list?type=${type}`,
  );
  return data;
};

const deleteEvent = async (eventId: number): Promise<AdminActionResponse> => {
  const { data } = await api.delete<AdminActionResponse>(
    `/auth/admin/event/${eventId}`,
  );
  return data;
};

const getWarnHistory = async (uuid: string): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(
    `/auth/operator/user/warnhistory?uuid=${uuid}`,
  );
  return data;
};

const sendWarnMessage = async (payload: {
  uuid: string;
  message: string;
}): Promise<AdminActionResponse> => {
  const { data } = await api.post<AdminActionResponse>(
    `/auth/operator/user/warn`,
    payload,
  );
  return data;
};

const getChargeList = async (): Promise<AdminActionResponse> => {
  const { data } = await api.get<AdminActionResponse>(
    "/auth/operator/tempay/charge-list",
  );
  return data;
};

const approveCharge = async (orderId: string): Promise<AdminActionResponse> => {
  const { data } = await api.post<AdminActionResponse>(
    "/auth/operator/tempay/approval",
    { orderId },
  );
  return data;
};

const rejectCharge = async (orderId: string): Promise<AdminActionResponse> => {
  const { data } = await api.delete<AdminActionResponse>(
    "/auth/operator/tempay/refund",
    { data: { orderId } },
  );
  return data;
};

export const useUserList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["userList", page, size],
    queryFn: () => getUserList(page, size),
  });
};

export const useChargeList = () => {
  return useQuery({
    queryKey: ["chargeList"],
    queryFn: getChargeList,
  });
};

export const useApproveCharge = () => {
  return useMutation({
    mutationFn: approveCharge,
  });
};

export const useRejectCharge = () => {
  return useMutation({
    mutationFn: rejectCharge,
  });
};

export const useUserDetail = (uuid: string) => {
  return useQuery({
    queryKey: ["userDetail", uuid],
    queryFn: () => getUserDetail(uuid),
    enabled: !!uuid,
  });
};

export const useSearchUsers = () => {
  return useMutation({
    mutationFn: ({
      searchType,
      keyword,
    }: {
      searchType: "email" | "username";
      keyword: string;
    }) => searchUsers(searchType, keyword),
  });
};

export const useSendWarnMessage = () => {
  return useMutation({
    mutationFn: sendWarnMessage,
  });
};

export const useAdjustPoint = () => {
  return useMutation({
    mutationFn: adjustPoint,
  });
};

export const useRegisterNotice = () => {
  return useMutation({
    mutationFn: registerNotice,
  });
};

export const useNoticeList = (type: "RESERVATION" | "HISTORY") => {
  return useQuery({
    queryKey: ["noticeList", type],
    queryFn: () => getNoticeList(type),
  });
};

export const useDeleteNotice = () => {
  return useMutation({
    mutationFn: deleteNotice,
  });
};

export const useRegisterDiscountEvent = () => {
  return useMutation({
    mutationFn: registerDiscountEvent,
  });
};

export const useRegisterFreeMatchEvent = () => {
  return useMutation({
    mutationFn: registerFreeMatchEvent,
  });
};

export const useEventList = (type: "RESERVATION" | "HISTORY") => {
  return useQuery({
    queryKey: ["eventList", type],
    queryFn: () => getEventList(type),
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: deleteEvent,
  });
};

export const useWarnHistory = (uuid: string) => {
  return useQuery({
    queryKey: ["warnHistory", uuid],
    queryFn: () => getWarnHistory(uuid),
    enabled: !!uuid,
  });
};

export const usePaymentHistory = (uuid: string) => {
  return useQuery({
    queryKey: ["paymentHistory", uuid],
    queryFn: () => getPaymentHistory(uuid),
    enabled: !!uuid,
  });
};

export const useToggle1000Button = () => {
  return useMutation({
    mutationFn: toggle1000Button,
  });
};
