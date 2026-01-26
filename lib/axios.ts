import axios from "axios";

// 1. 공통 설정 (URL, 헤더 등)
const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

// 2. 클라이언트용(CSR) 인스턴스 생성 및 export
export const api = axios.create(axiosConfig);

// 3. 응답 인터셉터: 401 에러 시 토큰 자동 재발급
api.interceptors.response.use(
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
        // refreshToken으로 새 accessToken 발급 (withCredentials로 쿠키 자동 전송)
        await api.post("/api/auth/login");

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (reissueError) {
        // 재발급 실패 → 로그인 페이지로 리다이렉트
        window.location.href = "/login";
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);
