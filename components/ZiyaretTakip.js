'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sayfaZiyaretEt } from '../lib/takip';

export default function ZiyaretTakip() {
  const pathname = usePathname();
  useEffect(() => { sayfaZiyaretEt(pathname); }, [pathname]);

  useEffect(() => {
    try {
      // İlk ziyaret tarihi
      if (!localStorage.getItem('sz_ilk_ziyaret')) {
        localStorage.setItem('sz_ilk_ziyaret', new Date().toISOString().slice(0, 10));
      }

      // Günlük seri
      const bugun = new Date().toISOString().slice(0, 10);
      const seriSon  = localStorage.getItem('sz_seri_son') || '';
      const seriSayi = Number(localStorage.getItem('sz_seri') || 0);
      if (seriSon !== bugun) {
        const dun = new Date();
        dun.setDate(dun.getDate() - 1);
        const yeniSeri = seriSon === dun.toISOString().slice(0, 10) ? seriSayi + 1 : 1;
        localStorage.setItem('sz_seri', String(yeniSeri));
        localStorage.setItem('sz_seri_son', bugun);
      }

      // Oturum başlangıcı
      localStorage.setItem('sz_oturum_bas', String(Date.now()));
    } catch {}

    const kaydetSure = () => {
      try {
        const bas = Number(localStorage.getItem('sz_oturum_bas') || 0);
        if (!bas) return;
        const dk = (Date.now() - bas) / 60000;
        if (dk > 0.1 && dk < 120) {
          const toplam = Number(localStorage.getItem('sz_sure_dk') || 0);
          localStorage.setItem('sz_sure_dk', String(toplam + dk));
        }
        localStorage.removeItem('sz_oturum_bas');
      } catch {}
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        kaydetSure();
      } else {
        try { localStorage.setItem('sz_oturum_bas', String(Date.now())); } catch {}
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', kaydetSure);
    return () => {
      kaydetSure();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', kaydetSure);
    };
  }, []);

  return null;
}
