import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers are set in middleware.ts to avoid duplicate CSP headers
  // and to allow per-request nonce generation.
};

export default nextConfig;