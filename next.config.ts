import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone", // Docker 최적화를 위한 standalone 모드
};

export default nextConfig;
