/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

// Need to allow unsafe-eval in development for code refresh.
const cspHeader = `
    default-src 'self';
    connect-src 'self' https://9sl3dhr1twv1.statuspage.io/api/v2/;
    script-src 'self' 'unsafe-inline' ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self' https://fonts.gstatic.com/;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

module.exports = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
