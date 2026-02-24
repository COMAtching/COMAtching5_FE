"use server";

import { ProfileData } from "@/lib/types/profile";

export type ProfileBuilderState = {
  success: boolean;
  message?: string;
  data?: Partial<ProfileData>;
  errors?: {
    birthYear?: boolean;
    department?: boolean;
    major?: boolean;
    university?: boolean;
  };
};

export async function profileBuilderAction(
  prevState: ProfileBuilderState,
  formData: FormData,
): Promise<ProfileBuilderState> {
  const birthYear = formData.get("birthYear") as string;
  const department = formData.get("department") as string;
  const major = formData.get("major") as string;
  const university = formData.get("university") as string;

  // 유효성 검사
  const errors: ProfileBuilderState["errors"] = {};

  if (!birthYear) {
    errors.birthYear = true;
  }

  if (!university) {
    errors.university = true;
  }

  if (!department) {
    errors.department = true;
  }

  if (!major) {
    errors.major = true;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  // birthYear를 birthDate 형식으로 변환 (YYYY-MM-DD)
  // 예: 2000 -> 2000-01-01 (임시로 1월 1일로 설정, 나중에 정확한 날짜 입력받을 수 있음)
  const birthDate = `${birthYear}-01-01`;

  const profileData: Partial<ProfileData> = {
    birthDate,
    major,
    university,
  };

  // 성공 시 데이터와 함께 반환
  return {
    success: true,
    data: profileData,
  };
}
