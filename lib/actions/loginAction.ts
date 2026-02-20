"use server";

import { serverApi } from "@/lib/server-api";
import { isAxiosError } from "axios";

type LoginState = {
  success: boolean;
  message: string;
};

type LoginResponse = {
  code: string;
  status: number;
  message: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await serverApi.post<LoginResponse>({
      path: "/api/auth/login",
      body: { email, password },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 || status === 401) {
        return { success: false, message: "이메일 혹은 비밀번호가 틀립니다" };
      }
      console.error("[loginAction] API error", {
        status,
        data: error.response?.data,
      });
    } else {
      console.error("[loginAction] Unexpected error", error);
    }
    return {
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  return { success: true, message: "로그인 성공" };
}
