'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Sayfa görüntülemesini DB'ye kaydeder. Session başına bir kez çalışır.
export function useTrackView(hrefOverride) {
  const pathname = usePathname();

  useEffect(() => {
    const raw  = hrefOverride || pathname;
    const href = raw.startsWith('/v3') ? raw.slice(3) : raw;
    if (!href) return;

    const key = `sz_viewed_${href}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    fetch('/api/v3/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ href }),
    }).catch(() => {});
  }, [pathname, hrefOverride]);
}
