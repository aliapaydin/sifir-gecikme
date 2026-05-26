'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ZiyaretTakip from '../../../components/ZiyaretTakip';
import GrafikPage from '../../grafik/page';

const V3_PREFIXED = [
  '/yazilar/', '/ogren/', '/python', '/sql', '/regex', '/ciz', '/nn',
  '/hipotez', '/mulakat', '/kalori', '/tech-center', '/harita',
  '/milyon', '/veri-setleri', '/proje', '/grafik', '/promilmetre',
];

function useV3LinkInterceptor(router) {
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('/v3')) return;
      const shouldPrefix = V3_PREFIXED.some(p => href === p || href.startsWith(p));
      if (shouldPrefix) {
        e.preventDefault();
        router.push('/v3' + href);
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);
}

export default function V3GrafikPage() {
  const router = useRouter();
  useV3LinkInterceptor(router);

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <GrafikPage />
    </div>
  );
}
