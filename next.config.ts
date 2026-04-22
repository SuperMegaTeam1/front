import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Включаем SCSS Modules
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;
