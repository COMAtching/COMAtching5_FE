import axios from "axios";

// 1. 공통 설정 (URL, 헤더 등)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in environments");
}

const axiosConfig = {
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

// 2. 클라이언트용(CSR) 인스턴스 생성 및 export
export const api = axios.create(axiosConfig);

// 🚨 토큰 재발급 중복 요청 방지를 위한 변수 및 대기 큐
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// 3. 응답 인터셉터: 401 에러 시 토큰 자동 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 && 재발급 시도 전 && 재발급 API가 아닐 때
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/reissue")
    ) {
      originalRequest._retry = true;

      // 이미 재발급 요청이 진행 중이라면, 완료될 때까지 대기 큐에서 기다린 후 원래 요청 재시도
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // refreshToken으로 새 accessToken 발급 (withCredentials로 쿠키 자동 전송)
        await api.post("/api/auth/reissue");
        isRefreshing = false;

        // 대기 중인 모든 요청 재실행
        onRefreshed();

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (reissueError) {
        isRefreshing = false;
        refreshSubscribers = []; // 대기 큐 비우기

        // 재발급 실패 → 로그인 페이지로 리다이렉트
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/";
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);
