import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "bc63-137-59-146-89.ngrok-free.app",

  ],

  async rewrites() {
    return [
      {
        source: "/api/download",
        destination: `${process.env.BACKEND_URL ?? "http://127.0.0.1:8000"}/api/download`,
      },
      {
        source: "/api/video/info",
        destination: `${process.env.BACKEND_URL ?? "http://127.0.0.1:8000"}/api/video/info`,
      },
    ];
  },
};

export default nextConfig;