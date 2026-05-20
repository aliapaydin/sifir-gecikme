'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

// Server'da window yok, useLayoutEffect SSR warning verir — isomorphic pattern
const useSyncEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ThemeSync() {
  const pathname = usePathname();

  useSyncEffect(() => {
    try {
      const t = localStorage.getItem('theme') ?? 'light';
      const el = document.documentElement;
      el.classList.remove('dark', 'lacivert', 'gece');
      if (t === 'dark')          el.classList.add('dark');
      else if (t === 'lacivert') el.classList.add('lacivert');
      else if (t === 'gece')     el.classList.add('gece');
    } catch (e) {}
  }, [pathname]);

  return null;
}
