import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 환경 변수 확인 (없으면 빌드 타임/런타임에 경고)
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

// 2. [핵심] 요청 인터셉터: 브라우저의 쿠키를 통째로 헤더에 이식
serverClient.interceptors.request.use(
  async (config) => {
    // next/headers의 cookies()는 서버 컴포넌트에서만 동작합니다.
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString(); // "key=value; key2=value2" 형태

    if (allCookies) {
      config.headers.Cookie = allCookies;
    }

    return config;
  },
  (error) => Promise.reject(error),
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

      // 401 인증 에러 발생 시 → 로그인 페이지로 튕겨내기
      if (status === 401) {
        redirect("/login");
      }

      console.error(`[Server API Error] ${method} ${path}`, {
        status,
        message: errorMessage,
      });

      // 에러를 던져서 상위 컴포넌트나 Error Boundary가 처리하게 함
      throw new Error(errorMessage);
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
