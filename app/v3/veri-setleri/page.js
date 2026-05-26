'use client';

import ZiyaretTakip from '../../../components/ZiyaretTakip';
import VeriSetleriPage from '../../veri-setleri/page';

export default function V3VeriSetleriPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <VeriSetleriPage />
    </div>
  );
}
