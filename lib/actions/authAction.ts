"use server";

import { serverApi, isAxiosError } from "@/lib/server-api";

export type ResetPasswordRequest = {
  email: string;
  authCode: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  code: string;
  status: number;
  message: string;
};

/**
 * 비밀번호 재설정 Server Action
 */
export async function resetPasswordAction(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  try {
    const { data } = await serverApi.patch<ResetPasswordResponse>({
      path: "/api/auth/password/code",
      body: payload,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      console.error("[resetPasswordAction] API Error", { status, message });

      return {
        code: error.response?.data?.code || "ERROR",
        status,
        message,
      };
    }

    console.error("[resetPasswordAction] Unexpected Error", error);
    return {
      code: "UNKNOWN_ERROR",
      status: 500,
      message: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
