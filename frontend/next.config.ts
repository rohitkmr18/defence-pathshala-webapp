import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The plural /pyqs routes are canonical. Singular exam aliases must redirect without intercepting existing /pyq/[questionId] question links.
  async redirects() {
    return [
      { source: "/pyqs/cds/science", destination: "/pyqs/cds/science-technology", statusCode: 301 },
      { source: "/pyqs/cds/2026/science", destination: "/pyqs/cds/2026/science-technology", statusCode: 301 },
      { source: "/pyq/cds/science", destination: "/pyqs/cds/science-technology", statusCode: 301 },
      { source: "/pyq/cds/2026/science", destination: "/pyqs/cds/2026/science-technology", statusCode: 301 },
      { source: "/pyq/cds/:path*", destination: "/pyqs/cds/:path*", statusCode: 301 },
      { source: "/pyq/capf/:path*", destination: "/pyqs/capf/:path*", statusCode: 301 },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;