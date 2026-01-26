import { cookies } from "next/headers";
import { api } from "./axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 서버 환경에서 사용할 API 클라이언트입니다.
// next/headers의 cookies()를 사용하여 요청에 자동으로 쿠키를 포함시킵니다.
async function request<T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return api({
    ...config,
    headers: {
      ...config.headers,
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
  });
}

export const serverApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url }),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, method: "POST", url, data }),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, method: "PUT", url, data }),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url }),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, method: "PATCH", url, data }),
};
