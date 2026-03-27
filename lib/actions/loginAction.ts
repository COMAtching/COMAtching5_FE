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

    // 🍪 백엔드로부터 받은 쿠키가 있다면 브라우저에 배달해줍니다.
    if (setCookie) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      setCookie.forEach((cookieStr) => {
        // Axios가 준 쿠키 문자열을 파싱합니다 (name=value; Path=/ ...)
        const [nameValue, ...options] = cookieStr.split(";");
        const [name, ...nameParts] = nameValue.split("=");
        const value = nameParts.join("=");

        const cookieOptions: {
          path?: string;
          httpOnly?: boolean;
          secure?: boolean;
          maxAge?: number;
          expires?: Date;
          sameSite?: "strict" | "lax" | "none" | boolean;
        } = {};

        options.forEach((opt) => {
          const [key, ...valueParts] = opt.trim().split("=");
          const val = valueParts.join("=");
          const k = key.toLowerCase();
          if (k === "path") cookieOptions.path = val;
          if (k === "httponly") cookieOptions.httpOnly = true;
          if (k === "secure") cookieOptions.secure = true;
          if (k === "max-age") cookieOptions.maxAge = parseInt(val);
          if (k === "expires") cookieOptions.expires = new Date(val);
          if (k === "samesite")
            cookieOptions.sameSite = val.toLowerCase() as
              | "strict"
              | "lax"
              | "none";
        });

        cookieStore.set(name, value, cookieOptions);
      });
    }

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
