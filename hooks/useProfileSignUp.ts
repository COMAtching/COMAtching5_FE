import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ProfileSubmitData } from "@/lib/types/profile";
import axios from "axios";

// 1. 이미지 업로드 관련 타입
interface PresignedUrlResponse {
  code: string;
  status: number;
  message: string;
  data: {
    presignedUrl: string;
    imageKey: string; // S3에 저장될 경로/키
  };
}

// 2. 가공된 프로필 제출 타입 (백엔드 요구사항에 맞춤)
interface SignUpResponse {
  code: string;
  status: number;
  message: string;
}

/**
 * 1단계: Presigned URL을 받아오고 S3에 업로드하는 함수
 */
const uploadImage = async (file: File): Promise<string> => {
  let presignedUrl: string;
  let imageKey: string;

  // 1단계: Presigned URL 발급
  try {
    const { data: response } = await api.get<PresignedUrlResponse>(
      "/api/members/files/presigned/profiles",
      { params: { filename: file.name } },
    );
    presignedUrl = response.data.presignedUrl;
    imageKey = response.data.imageKey;
  } catch (error) {
    console.error("❌ Presigned URL을 받아오지 못했습니다.", error);
    throw error;
  }

  // 2단계: S3에 직접 업로드 (Axios 인스턴스 대신 표준 axios 사용 - baseURL 무시를 위해)
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    console.error("❌ 이미지 업로드에 실패했습니다.", error);
    throw error;
  }

  return imageKey;
};

/**
 * 2단계: 최종 프로필 데이터를 전송하는 함수
 */
const signUpProfile = async (
  payload: ProfileSubmitData,
): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>(
    "/api/auth/signup/profile",
    payload,
  );
  return data;
};

/**
 * 이미지 업로드 Mutation 훅
 */
export const useImageUpload = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};

/**
 * 프로필 가입 Mutation 훅
 */
export const useProfileSignUp = () => {
  return useMutation({
    mutationFn: signUpProfile,
  });
};
