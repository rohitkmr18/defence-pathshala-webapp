import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The plural /pyqs routes are canonical. Singular aliases must never become separate indexable pages.
  async redirects() {
    return [
      { source: "/pyq/:path*", destination: "/pyqs/:path*", permanent: true },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;