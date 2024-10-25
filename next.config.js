/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  env: {
    NEXT_PUBLIC_AMPLITUDE_API_KEY_1:
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_1,
    NEXT_PUBLIC_AMPLITUDE_API_KEY_2:
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_2,
  },
};

module.exports = nextConfig;
