import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    NEXT_PUBLIC_DP_DEPLOYMENT_ENV:
      process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    NEXT_PUBLIC_DP_GIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "unknown",
  },
};

export default nextConfig;