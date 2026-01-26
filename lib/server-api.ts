import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

// 1. 서버 전용 Axios 인스턴스 생성
const serverClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. [핵심] 요청 인터셉터: 인증에 필요한 쿠키만 선별하여 전달
serverClient.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();

    // 백엔드 API 인증에 필요한 쿠키만 선별
    const authCookieNames = ["accessToken", "refreshToken", "sessionId"];
    const authCookies: string[] = [];

    authCookieNames.forEach((name) => {
      const cookie = cookieStore.get(name);
      if (cookie) {
        authCookies.push(`${name}=${cookie.value}`);
      }
    });

    // 인증 쿠키가 있을 때만 헤더에 추가
    if (authCookies.length > 0) {
      config.headers.Cookie = authCookies.join("; ");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. [핵심] 응답 인터셉터: 401 에러 시 토큰 재발급 시도
serverClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 && 재발급 시도 전 && 재발급 API가 아닐 때
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/login"
    ) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 새 accessToken 발급 (쿠키 자동 전송됨)
        await serverClient.post("/api/auth/login");

        // 원래 요청 재시도
        return serverClient(originalRequest);
      } catch (reissueError) {
        // 재발급 실패 → 로그인 페이지로
        redirect("/login");
      }
    }

    return Promise.reject(error);
  },
);

// 요청 옵션 타입 정의
type RequestOptions = {
  path: string;
  params?: Record<string, string | number | boolean>; // 쿼리 파라미터
  headers?: Record<string, string>; // 추가 헤더
  body?: unknown; // POST, PUT 등에서 보낼 데이터
};

// 3. 통합 요청 함수
async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  { path, params, headers, body }: RequestOptions,
): Promise<T> {
  // Axios 설정 객체
  const config: AxiosRequestConfig = {
    url: path,
    method,
    headers,
    params, // Axios가 객체를 쿼리스트링(?key=value)으로 자동 변환해줍니다. (buildQuery 불필요)
    data: body,
  };

  try {
    const response = await serverClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || "API Error";

      console.error(`[Server API Error] ${method} ${path}`, {
        status,
        message: errorMessage,
        data: error.response?.data,
      });

      // 원본 에러를 그대로 던져서 상위에서 전체 컨텍스트 활용 가능
      // (401은 이미 인터셉터에서 처리됨)
      throw error;
    }

    // Axios 외의 알 수 없는 에러
    throw error;
  }
}

// 4. 사용하기 편하게 메서드별 export
export const serverApi = {
  // GET 요청은 body가 없으므로 Omit으로 타입 제외
  get: <T>(options: Omit<RequestOptions, "body">) => request<T>("GET", options),

  post: <T>(options: RequestOptions) => request<T>("POST", options),
  put: <T>(options: RequestOptions) => request<T>("PUT", options),
  delete: <T>(options: RequestOptions) => request<T>("DELETE", options),
  patch: <T>(options: RequestOptions) => request<T>("PATCH", options),
};
