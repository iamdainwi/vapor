import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["jsdom", "firebase-admin"],
};

export default nextConfig;
