import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // CRITICAL: Stops the service worker from caching your local dev environment
  // disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["jsdom", "firebase-admin"],
};

export default withPWA(nextConfig);