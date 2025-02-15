import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
};

export default nextConfig;
