import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/workspace' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/workspace/' : '',
  trailingSlash: true,
  reactStrictMode: true,

  // Empty turbopack config to acknowledge Turbopack usage
  turbopack: {
    rules: {
      '*.wasm': {
        loaders: ['@vercel/turbopack-wasm-loader'],
        as: '*.js',
      },
    },
  },

  // Keep webpack config for fallback (when using --webpack flag)
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename =
      isServer ? '../static/wasm/[modulehash].wasm' : 'static/wasm/[modulehash].wasm';
    return config;
  }
};

export default nextConfig;