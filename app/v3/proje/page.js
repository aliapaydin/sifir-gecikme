'use client';

import ZiyaretTakip from '../../../components/ZiyaretTakip';
import ProjePage from '../../proje/page';

export default function V3ProjePage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <ProjePage />
    </div>
  );
}
