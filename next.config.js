/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
