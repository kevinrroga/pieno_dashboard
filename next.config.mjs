/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              `default-src 'self'`,
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
              `style-src 'self' 'unsafe-inline'`,
              `img-src 'self' data:`,
              `font-src 'self'`,
              `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
