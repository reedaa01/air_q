import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // Production builds must not overwrite assets served by a running dev server.
  distDir:
    process.env.AERIS_E2E === "1"
      ? ".next-e2e"
      : phase === PHASE_DEVELOPMENT_SERVER
        ? ".next-dev"
        : ".next",
});

export default nextConfig;
