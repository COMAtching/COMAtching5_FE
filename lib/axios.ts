import axios from "axios";

// 1. 공통 설정 (URL, 헤더 등)
const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

// 2. 클라이언트용(CSR) 인스턴스 생성 및 export
export const api = axios.create(axiosConfig);
