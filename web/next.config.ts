import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async rewrites() {
    const rustBackend =
      process.env.RUST_BACKEND_INTERNAL_URL || "http://127.0.0.1:4180";
    return [
      {
        source: "/api/:path((?!mcp/sdk-bridge).*)",
        destination: `${rustBackend}/api/:path*`,
      },
      {
        source: "/v1/:path*",
        destination: `${rustBackend}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
