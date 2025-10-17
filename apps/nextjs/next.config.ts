import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";

const nextConfig: NextConfig = {
  /* config options here */
};

const isProd = process.env.NODE_ENV === "production";

export default isProd
  ? withPostHogConfig(nextConfig, {
      personalApiKey: process.env.POSTHOG_API_KEY!, // Personal API Key
      envId: process.env.POSTHOG_ENV_ID!, // Environment ID
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST, // (optional), defaults to https://us.posthog.com
      sourcemaps: {
        // (optional)
        enabled: true, // (optional) Enable sourcemaps generation and upload, default to true on production builds
        project: "Spooky-Dev", // (optional) Project name, defaults to repository name
        version: "1.0.0", // (optional) Release version, defaults to current git commit
        deleteAfterUpload: true, // (optional) Delete sourcemaps after upload, defaults to true
      },
    })
  : nextConfig;
