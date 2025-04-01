/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  basePath: process.env.NEXT_BASE_PATH || undefined,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
