import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone", // Docker 최적화를 위한 standalone 모드
  devIndicators: false,
  // @ts-expect-error Next.js 16 AI agent rules generation toggle
  agentRules: false,
  // compiler: {
  //   removeConsole:
  //     process.env.NODE_ENV === "production"
  //       ? { exclude: ["error", "warn"] }
  //       : false,
  // },

  // 🔒 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // iframe으로 우리 사이트를 감싸서 클릭을 훔치는 공격(클릭재킹) 방지
          { key: "X-Frame-Options", value: "DENY" },
          // 브라우저가 Content-Type을 멋대로 추측해서 실행하는 것 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 외부 사이트로 이동할 때 Referer 헤더에 전체 URL 노출 방지
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HTTPS만 허용 (1년), 서브도메인 포함
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // 브라우저 기능 권한 제한 (카메라·마이크·위치 등 불필요한 기능 차단)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // XSS: 인라인 스크립트 및 외부 출처 스크립트 제한
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js 내부 + Firebase + 백엔드 API
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline'",
              // 이미지: S3, 백엔드 도메인 허용
              "img-src 'self' data: blob: https://comatching.site https://srv.comatching.site https://comatching5.s3.ap-northeast-2.amazonaws.com",
              // API, WebSocket 연결 허용 도메인
              "connect-src 'self' https://comatching.site https://srv.comatching.site wss://srv.comatching.site https://*.googleapis.com https://*.firebaseio.com",
              // Firebase FCM
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

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
