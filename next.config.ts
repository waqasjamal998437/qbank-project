import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile recharts to handle ESM/CJS compatibility
  transpilePackages: ["recharts"],
  // Explicitly exclude @babel/runtime from serverExternalPackages to avoid conflict
  // Recharts depends on @babel/runtime, and we're transpiling recharts, so
  // @babel/runtime should be bundled, not externalized
  experimental: {
    // Remove any serverComponentsExternalPackages if it exists
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
