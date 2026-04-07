import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
export { isAxiosError };
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("SERVER_API_URL or NEXT_PUBLIC_API_URL is not defined");
}

// 0. 인증 및 재발급 처리가 필요 없는 Public API 목록
const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/password/code"];
const isPublicPath = (url?: string) =>
  url ? PUBLIC_PATHS.some((path) => url.includes(path)) : false;

// 1. 서버 전용 Axios 인스턴스 생성
const serverClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  maxRedirects: 0, // 🚨 자동으로 리다이렉트를 따라가지 않도록 설정
  validateStatus: (status) => (status >= 200 && status < 300) || status === 302, // 302도 성공으로 간주
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🍪 백엔드로부터 받은 set-cookie 헤더를 파싱하여 Next.js 쿠키 저장소에 업데이트합니다.
 */
async function saveCookies(setCookieHeaders: string[] | undefined) {
  if (!setCookieHeaders || setCookieHeaders.length === 0) return;

  try {
    const cookieStore = await cookies();

    setCookieHeaders.forEach((cookieStr) => {
      const [nameValue, ...options] = cookieStr.split(";");
      const [name, ...nameParts] = nameValue.split("=");
      const value = nameParts.join("=");

      const cookieOptions: {
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
        maxAge?: number;
        expires?: Date;
        sameSite?: "strict" | "lax" | "none";
      } = {};

      options.forEach((opt) => {
        const [key, ...valueParts] = opt.trim().split("=");
        const val = valueParts.join("=");
        const k = key.toLowerCase();
        if (k === "path") cookieOptions.path = val;
        if (k === "httponly") cookieOptions.httpOnly = true;
        if (k === "secure") cookieOptions.secure = true;
        if (k === "max-age") cookieOptions.maxAge = parseInt(val);
        if (k === "expires") cookieOptions.expires = new Date(val);
        if (k === "samesite")
          cookieOptions.sameSite = val.toLowerCase() as
            | "strict"
            | "lax"
            | "none";
      });

      cookieStore.set(name, value, cookieOptions);
    });
  } catch (error) {
    // 서버 컴포넌트 등에서 cookies().set()이 불가능한 경우 대비
    console.error("[saveCookies] Failed to set cookies", error);
  }
}

// 2. [핵심] 요청 인터셉터: 인증에 필요한 쿠키만 선별하여 전달 (Public API는 제외)
serverClient.interceptors.request.use(
  async (config) => {
    // 🛡️ Public API라면 쿠키 조회 및 전송을 생략합니다.
    if (isPublicPath(config.url)) {
      return config;
    }

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log(
      `[Server API Request] Cookies found:`,
      allCookies.map((c) => c.name),
    );

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

    // 401 에러 && 재발급 시도 전 && 재발급 API가 아닐 때 && Public API가 아닐 때
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/reissue") &&
      !isPublicPath(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 새 accessToken 발급 (쿠키 자동 전송됨)
        const response = await serverClient.post("/api/auth/reissue");

        // 🍪 새로 발급된 토큰(쿠키)을 브라우저 저장소에 동기화
        await saveCookies(response.headers["set-cookie"] as string[]);

        // 원래 요청 재시도
        return serverClient(originalRequest);
      } catch {
        // 재발급 실패 → 로그인 페이지로
        redirect("/");
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

// 요청 결과 타입 정의
type ApiResponse<T> = {
  data: T;
  finalUrl?: string;
  setCookie?: string[]; // ✅ 백엔드에서 온 쿠키 헤더
};

// 3. 통합 요청 함수
async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  { path, params, headers, body }: RequestOptions,
): Promise<ApiResponse<T>> {
  // Axios 설정 객체
  const config: AxiosRequestConfig = {
    url: path,
    method,
    headers,
    params,
    data: body,
  };

  try {
    const response = await serverClient.request<T>(config);

    // 💡 성공 시 로그를 출력합니다.
    console.log(`[Server API Success] ${method} ${path}`, {
      status: response.status,
      location: response.headers["location"], // 리다이렉트 지점
      hasCookie: !!response.headers["set-cookie"],
    });

    // 🍪 응답에서 온 쿠키가 있다면 자동으로 저장소에 반영
    const setCookieHeaders = response.headers["set-cookie"] as string[];
    if (setCookieHeaders) {
      await saveCookies(setCookieHeaders);
    }

    return {
      data: response.data,
      finalUrl:
        response.headers["location"] || response.request?.res?.responseUrl,
      setCookie: setCookieHeaders,
    };
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
