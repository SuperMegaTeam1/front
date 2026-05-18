import type { NextConfig } from 'next';

const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:53959/api';
const backendOrigin = backendApiUrl.replace(/\/api\/?$/, '');

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: '/backend-api/lessons/:path*/journal',
        destination: `${backendOrigin}/lessons/:path*/journal`,
      },
      {
        source: '/backend-api/journal/:subjectId/:groupId',
        destination: `${backendOrigin}/journal/:subjectId/:groupId`,
      },
      {
        source: '/backend-api/grades/:gradeId',
        destination: `${backendOrigin}/grades/:gradeId`,
      },
      {
        source: '/backend-api/:path*',
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
