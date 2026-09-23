import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
  },
  allowedDevOrigins: [
    "http://localhost:3333",
    "http://127.0.0.1:3333",
    "http://[::1]:3333",
    "localhost:3333",
    "127.0.0.1:3333",
    "[::1]:3333",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "localhost:3001",
    "127.0.0.1:3000",
    "127.0.0.1:3001",
    "http://127.0.0.1:3000",
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/products", destination: "/products/pod", permanent: true },
      { source: "/favicon.ico", destination: "/icon-48.png", permanent: true },
      { source: "/zh", destination: "/", permanent: true },
      { source: "/cn", destination: "/", permanent: true },
      { source: "/zh-CN", destination: "/", permanent: true },
      { source: "/zh-cn", destination: "/", permanent: true },
      { source: "/products/ny", destination: "/products/capsule", permanent: true },
      { source: "/products/ny/:slug", destination: "/products/capsule/:slug", permanent: true },
      { source: "/blog/COC-certification-for-export", destination: "/blog/coc-certification-for-export", permanent: true },
      { source: "/es/blog/COC-certification-for-export", destination: "/es/blog/coc-certification-for-export", permanent: true },
      { source: "/fr/blog/COC-certification-for-export", destination: "/fr/blog/coc-certification-for-export", permanent: true },
      { source: "/ar/blog/COC-certification-for-export", destination: "/ar/blog/coc-certification-for-export", permanent: true },
      { source: "/es/products/ny", destination: "/es/products/capsule", permanent: true },
      { source: "/es/products/ny/:slug", destination: "/es/products/capsule/:slug", permanent: true },
      { source: "/fr/products/ny", destination: "/fr/products/capsule", permanent: true },
      { source: "/fr/products/ny/:slug", destination: "/fr/products/capsule/:slug", permanent: true },
      { source: "/ar/products/ny", destination: "/ar/products/capsule", permanent: true },
      { source: "/ar/products/ny/:slug", destination: "/ar/products/capsule/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' http://localhost:3333 http://127.0.0.1:3333 http://[::1]:3333 https://*.sanity.studio https://*.sanity.io",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
