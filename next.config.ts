import type { NextConfig } from "next";
import { baseURL } from "./baseUrl";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  assetPrefix: baseURL,
};

export default withPlausibleProxy()(nextConfig);
