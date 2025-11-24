/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aggregator.walrus-testnet.walrus.space',
      },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://aggregator.walrus-testnet.walrus.space",
      "media-src 'self' blob: data:",
      "connect-src 'self' https://fullnode.devnet.sui.io https://fullnode.testnet.sui.io https://fullnode.mainnet.sui.io https://api.enoki.mystenlabs.com https://oauth2.googleapis.com https://accounts.google.com https://aggregator.walrus-testnet.walrus.space https://publisher.walrus-testnet.walrus.space https://seal-key-server-testnet-1.mystenlabs.com https://seal-key-server-testnet-2.mystenlabs.com https://seal-key-server-testnet-3.mystenlabs.com",
      "frame-src https://accounts.google.com",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Only effective over HTTPS in production
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
