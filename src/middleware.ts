import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isLocalhost = Boolean(
    request.headers.get("host")?.match(/^localhost(:\d+)?$/),
  );

  // script-src 'unsafe-eval' is needed for XDR JSON WebAssembly scripts
  // connect-src http://localhost:* to allow local network
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline' 'unsafe-eval';
    script-src-elem 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com/ https: 'unsafe-inline';
    style-src 'self' https: 'unsafe-inline';
    img-src 'self' https://stellar.creit.tech/wallet-icons/ https://www.googletagmanager.com/ blob: data:;
    connect-src 'self' http://localhost:* https:;
    font-src 'self' https://fonts.gstatic.com/ https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/base/browser/ui/codicons/codicon/codicon.ttf;
    object-src 'none';
    frame-src 'self' https://connect.trezor.io/;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    ${isLocalhost ? "" : "upgrade-insecure-requests;"}
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s+/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
