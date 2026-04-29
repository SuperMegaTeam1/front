import type { NextConfig } from 'next';

const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:53959/api';

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
