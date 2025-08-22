const REQUIRED = [
  'DATABASE_URL',
  'REDIS_URL',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY',
  'S3_SECRET_KEY',
  'S3_BUCKET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.warn(`[env] Missing ${k}. Check .env.local or Docker env.`);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  env: {
    NEXT_PUBLIC_S3_URL: process.env.NEXT_PUBLIC_S3_URL || 'http://localhost:9000/dups',
    RCLONE_RC_URL: process.env.RCLONE_RC_URL || 'http://localhost:5572',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
