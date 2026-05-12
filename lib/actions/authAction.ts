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
    if (
      error instanceof Error &&
      (error as Error & { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

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

export type WithdrawResponse = {
  success: boolean;
  message: string;
};

/**
 * 회원 탈퇴 Server Action
 */
export async function withdrawAction(): Promise<WithdrawResponse> {
  try {
    await serverApi.delete({
      path: "/api/auth/withdraw",
    });

    // 탈퇴 성공 시 로컬 쿠키(토큰) 삭제
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("sessionId");

    return { success: true, message: "회원 탈퇴가 완료되었습니다." };
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message || "회원 탈퇴에 실패했습니다.";
      console.error("[withdrawAction] API Error", {
        status: error.response?.status,
        message,
      });
      return { success: false, message };
    }

    console.error("[withdrawAction] Unexpected Error", error);
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
}
