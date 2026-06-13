/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // / → /v3 içeriği gösterilir, URL olduğu gibi kalır
      { source: '/', destination: '/v3' },
    ];
  },
};

export default nextConfig;
