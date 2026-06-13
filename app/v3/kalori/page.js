'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ZiyaretTakip from '../../../components/ZiyaretTakip';
import KaloriApp from '../../../components/kalori/KaloriApp';

export default function V3KaloriPage() {
  useEffect(() => {
    try {
      localStorage.setItem('sz_kalori_ziyaret', '1');
      import('../../../lib/syncStats').then(({ syncSingleStat }) => syncSingleStat('sz_kalori_ziyaret', '1')).catch(() => {});
    } catch {}
  }, []);

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <KaloriApp />
    </div>
  );
}
