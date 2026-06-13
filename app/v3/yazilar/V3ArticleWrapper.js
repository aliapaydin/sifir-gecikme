'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function V3ArticleWrapper({ children }) {
  const router   = useRouter();
  const pathname = usePathname();

  // Yazı href'ini /v3 prefix'inden temizle ve view kaydet
  useEffect(() => {
    const href = pathname.startsWith('/v3') ? pathname.slice(3) : pathname;
    if (!href) return;

    // Session başına bir kez kaydet (tab kapatılana kadar tekrar sayma)
    const key = `sz_viewed_${href}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    fetch('/api/v3/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ href }),
    }).catch(() => {});
  }, [pathname]);

  // Ana sayfaya dönüş linklerini /v3'e yönlendir
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '/' || href === window.location.origin + '/') {
        e.preventDefault();
        router.push('/v3');
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [router]);

  return children;
}
