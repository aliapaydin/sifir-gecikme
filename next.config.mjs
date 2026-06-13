/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/v3', destination: '/', permanent: true },
      { source: '/v3/:path*', destination: '/:path*', permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/v3' },
        { source: '/icerikler', destination: '/v3/icerikler' },
        { source: '/icerikler/:path*', destination: '/v3/icerikler/:path*' },
        { source: '/yazilar/:slug', destination: '/v3/yazilar/:slug' },
        { source: '/ogren', destination: '/v3/ogren' },
        { source: '/ogren/:slug', destination: '/v3/ogren/:slug' },
        { source: '/python', destination: '/v3/python' },
        { source: '/sql', destination: '/v3/sql' },
        { source: '/regex', destination: '/v3/regex' },
        { source: '/ciz', destination: '/v3/ciz' },
        { source: '/nn', destination: '/v3/nn' },
        { source: '/hipotez', destination: '/v3/hipotez' },
        { source: '/mulakat', destination: '/v3/mulakat' },
        { source: '/mulakat/:slug', destination: '/v3/mulakat/:slug' },
        { source: '/kalori', destination: '/v3/kalori' },
        { source: '/tech-center', destination: '/v3/tech-center' },
        { source: '/harita', destination: '/v3/harita' },
        { source: '/milyon', destination: '/v3/milyon' },
        { source: '/veri-setleri', destination: '/v3/veri-setleri' },
        { source: '/proje', destination: '/v3/proje' },
        { source: '/grafik', destination: '/v3/grafik' },
        { source: '/promilmetre', destination: '/v3/promilmetre' },
        { source: '/csv', destination: '/v3/csv' },
        { source: '/renk', destination: '/v3/renk' },
        { source: '/sinav', destination: '/v3/sinav' },
        { source: '/hakkimda', destination: '/v3/hakkimda' },
        { source: '/versiyon', destination: '/v3/versiyon' },
        { source: '/giris', destination: '/v3/giris' },
        { source: '/kayit', destination: '/v3/kayit' },
        { source: '/kayit-tamam', destination: '/v3/kayit-tamam' },
        { source: '/dogrula', destination: '/v3/dogrula' },
        { source: '/sifremi-unuttum', destination: '/v3/sifremi-unuttum' },
        { source: '/sifre-sifirla', destination: '/v3/sifre-sifirla' },
        { source: '/destek', destination: '/v3/destek' },
        { source: '/panel', destination: '/v3/panel' },
        { source: '/admin', destination: '/v3/admin' },
        { source: '/admin/:path*', destination: '/v3/admin/:path*' },
        { source: '/analiz', destination: '/v3/analiz' },
      ],
    };
  },
};

export default nextConfig;
