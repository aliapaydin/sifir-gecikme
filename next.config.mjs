/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // beforeFiles: dosya sistemi kontrolünden ÖNCE çalışır.
      // app/page.js var olsa bile / → /v3 rewrite'ı önce ateşlenir.
      beforeFiles: [
        { source: '/', destination: '/v3' },
      ],
    };
  },
};

export default nextConfig;
