import type { NextConfig } from "next";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['recharts'],
  experimental: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'victory-vendor/d3-array': require.resolve('d3-array'),
      'victory-vendor/d3-color': require.resolve('d3-color'),
      'victory-vendor/d3-format': require.resolve('d3-format'),
      'victory-vendor/d3-interpolate': require.resolve('d3-interpolate'),
      'victory-vendor/d3-path': require.resolve('d3-path'),
      'victory-vendor/d3-scale': require.resolve('d3-scale'),
      'victory-vendor/d3-shape': require.resolve('d3-shape'),
      'victory-vendor/d3-time': require.resolve('d3-time'),
      'victory-vendor/d3-time-format': require.resolve('d3-time-format'),
      'victory-vendor/d3-timer': require.resolve('d3-timer'),
    };
    return config;
  },
};

export default nextConfig;
