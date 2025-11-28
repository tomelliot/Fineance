import type { NextConfig } from "next";
import { baseURL } from "./baseUrl";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  assetPrefix: baseURL,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

// export default withPlausibleProxy()(nextConfig);
export default nextConfig;
