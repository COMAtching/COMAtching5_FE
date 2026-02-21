"use server";

import { serverClient } from "@/lib/server-api";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";

type LoginState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  let redirectUrl = "/";

  try {
    const response = await serverClient.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        maxRedirects: 0,
        validateStatus: (status) => status < 400,
      },
    );

    // 백엔드가 보낸 Location 헤더가 있으면 그 경로로 이동
    const location = response.headers["location"];
    console.log(
      "[loginAction] status:",
      response.status,
      "| Location:",
      location ?? "(없음)",
    );
    console.log("[loginAction] response headers:", response.headers);
    console.log("[loginAction] response data:", response.data);
    if (location) {
      try {
        // 절대 URL이면 pathname만 추출, 상대 경로면 그대로 사용
        redirectUrl = new URL(location).pathname;
      } catch {
        redirectUrl = location;
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

  redirect(redirectUrl);
}
