import type { NextConfig } from 'next';

const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:53959/api';
const backendHubUrl = process.env.BACKEND_HUB_URL ?? 'http://localhost:53959/notification';

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: '/backend-hub/:path*',
        destination: `${backendHubUrl}/:path*`,
      },
      {
        source: '/backend-api/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
