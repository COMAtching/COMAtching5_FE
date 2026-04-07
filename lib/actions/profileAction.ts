"use server";

import { serverApi } from "@/lib/server-api";
import { ProfileSubmitData } from "@/lib/types/profile";
import { isAxiosError } from "@/lib/server-api";

export type ProfileSignUpState = {
  success: boolean;
  message: string;
};

export async function profileSignUpAction(
  prevState: ProfileSignUpState | null,
  data: ProfileSubmitData,
): Promise<ProfileSignUpState> {
  try {
    await serverApi.post({
      path: "/api/auth/signup/profile",
      body: data,
    });

    return { success: true, message: "회원가입 성공" };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "회원가입 실패";
      console.error("[profileSignUpAction] API Error", {
        status,
        message,
        requestBody: data,
      });
      return { success: false, message };
    }
    console.error("[profileSignUpAction] Unexpected Error", {
      error,
      requestBody: data,
    });
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
}
