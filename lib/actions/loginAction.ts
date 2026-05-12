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

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  let redirectUrl: string | null = null;

  try {
    const { finalUrl, setCookie } = await serverApi.post<LoginResponse>({
      path: "/api/auth/login",
      body: { email, password },
    });

    // 🍪 serverApi.post 내부에서 response header의 set-cookie를 파싱하여
    // 이미 cookieStore에 저장했으므로, 여기서 별도로 처리할 필요가 없습니다.

    if (finalUrl) {
      // https://comatching.site/onboarding -> /onboarding 추출
      try {
        const url = new URL(finalUrl);
        redirectUrl = url.pathname + url.search;
      } catch {
        // 이미 상대 경로인 경우
        redirectUrl = finalUrl;
      }
    }
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

  // 성공 시 리다이렉트 (Next.js 규칙: try-catch 밖에서 호출 권장)
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { success: true, message: "로그인 성공" };
}
