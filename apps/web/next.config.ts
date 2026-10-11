import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.19"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  transpilePackages: ["@nguyenthanhduyofficial/ui"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
