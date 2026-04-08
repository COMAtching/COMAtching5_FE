/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export type AdminLoginRequest = {
  accountId: string;
  password: string;
};

export type AdminLoginResponse = {
  status: number;
  message?: string;
  redirectUrl?: string;
  data?: any;
};

export type AdminInfoResponse = {
  status: number;
  message: string;
  data: {
    accountId: string;
    schoolEmail: string;
    nickname: string;
    role: string;
    university: string;
    universityAuth: string;
  };
};

export type AdminRegisterRequest = {
  accountId: string;
  password: string;
  schoolEmail: string;
  nickname: string;
  university: string;
  role: string;
};

export type AdminRegisterResponse = {
  status: number;
  message: string;
};

const adminLogin = async (
  payload: AdminLoginRequest,
): Promise<AdminLoginResponse> => {
  const { data } = await api.post<AdminLoginResponse>("/admin/login", payload);
  return data;
};

const getAdminInfo = async (): Promise<AdminInfoResponse> => {
  const { data } = await api.get<AdminInfoResponse>("/auth/any-admin/info");
  return data;
};

const adminRegister = async (
  payload: AdminRegisterRequest,
): Promise<AdminRegisterResponse> => {
  const { data } = await api.post<AdminRegisterResponse>(
    "/admin/register",
    payload,
  );
  return data;
};

const verifyWebmail = async (code: string) => {
  const { data } = await api.post("/auth/admin/webmail/verify", { code });
  return data;
};

const resendWebmail = async () => {
  const { data } = await api.post("/auth/admin/webmail/resend");
  return data;
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useAdminInfo = () => {
  return useQuery({
    queryKey: ["adminInfo"],
    queryFn: getAdminInfo,
    retry: false,
  });
};

export const useVerifyWebmail = () => {
  return useMutation({
    mutationFn: verifyWebmail,
  });
};

export const useResendWebmail = () => {
  return useMutation({
    mutationFn: resendWebmail,
  });
};

export const useAdminRegister = () => {
  return useMutation({
    mutationFn: adminRegister,
  });
};
