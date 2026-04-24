import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Включаем SCSS Modules
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;
