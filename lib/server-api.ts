import { cookies } from "next/headers";
import { api } from "./axios";
import type { AxiosRequestConfig } from "axios";

export async function serverApi(url: string, options: AxiosRequestConfig = {}) {
  const cookieStore = await cookies();

  // 기존 api 인스턴스를 쓰되, 쿠키 헤더만 쓱 끼워넣기
  return api.get(url, {
    ...options,
    headers: {
      ...options.headers, // 기존 헤더 유지
      Cookie: cookieStore.toString(), // 쿠키 추가
    },
  });
}
