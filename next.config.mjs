/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/v3',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
