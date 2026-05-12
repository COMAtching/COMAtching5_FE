"use server";

import { redirect } from "next/navigation";
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

/**
 * 관리자 전용 로그인 액션
 * 기존 loginAction과 동일한 로직이지만, 성공 시 /adminpage/main으로 리다이렉트합니다.
 */
export async function adminLoginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const { setCookie } = await serverApi.post<LoginResponse>({
      path: "/api/auth/login",
      body: { email, password },
    });

    // 🍪 serverApi.post 내부에서 response header의 set-cookie를 파싱하여
    // 이미 cookieStore에 저장했으므로, 여기서 별도로 처리할 필요가 없습니다.
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 || status === 401) {
        return { success: false, message: "이메일 혹은 비밀번호가 틀립니다" };
      }
      console.error("[adminLoginAction] API error", {
        status,
        data: error.response?.data,
      });
    } else {
      console.error("[adminLoginAction] Unexpected error", error);
    }
    return {
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  // 관리자는 항상 /adminpage/main으로 이동
  redirect("/adminpage/main");
}
