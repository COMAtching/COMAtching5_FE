import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone", // Docker 최적화를 위한 standalone 모드
  devIndicators: false,

  // 🛠️ 로컬 개발 환경: CORS/쿠키 문제 해결을 위한 API 프록시
  // localhost:3000/api/* → srv.comatching.site/api/* 로 중계
  // 브라우저 입장에선 Same-Origin 요청이 되어 쿠키가 정상 동작함
  async rewrites() {
    // 프로덕션 배포 환경에서는 rewrites 불필요 (백엔드와 직접 통신)
    if (process.env.NODE_ENV === "production") return [];

    const backendUrl =
      process.env.SERVER_API_URL || "https://srv.comatching.site";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/ws/:path*",
        destination: `${backendUrl}/ws/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comatching.site",
      },
      {
        protocol: "https",
        hostname: "srv.comatching.site",
      },
      {
        protocol: "https",
        hostname: "comatching5.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
