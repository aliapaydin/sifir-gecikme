'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sayfaZiyaretEt } from '../lib/takip';

export default function ZiyaretTakip() {
  const pathname = usePathname();
  useEffect(() => { sayfaZiyaretEt(pathname); }, [pathname]);
  return null;
}
