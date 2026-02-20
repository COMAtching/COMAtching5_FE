"use server";

import { serverApi } from "@/lib/server-api";

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
  } catch {
    return { success: false, message: "이메일 혹은 비밀번호가 틀립니다" };
  }

  return { success: true, message: "로그인 성공" };
}
