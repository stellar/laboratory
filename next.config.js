/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  distDir: "build",
  basePath: process.env.NEXT_BASE_PATH || undefined,
};

module.exports = nextConfig;

// Sentry config
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "stellarorg",
  project: "labv2",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  reactComponentAnnotation: {
    enabled: true,
  },
});
