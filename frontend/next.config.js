const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3003',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.8',
        port: '3003',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.9',
        port: '3003',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.11',
        port: '3003',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;