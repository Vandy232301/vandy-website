import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This engine is a self-contained app inside the vandy_website repo.
  // Pin the workspace root so Next doesn't infer a stray parent lockfile.
  turbopack: { root: __dirname },
};

export default nextConfig;
