import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The plural /pyqs routes are canonical. Singular exam aliases must redirect without intercepting existing /pyq/[questionId] question links.
  async redirects() {
    return [
      { source: "/pyq/cds/:path*", destination: "/pyqs/cds/:path*", statusCode: 301 },
      { source: "/pyq/capf/:path*", destination: "/pyqs/capf/:path*", statusCode: 301 },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;