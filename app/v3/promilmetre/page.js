'use client';

import ZiyaretTakip from '../../../components/ZiyaretTakip';
import PromilmetreApp from '../../promilmetre/PromilmetreApp';

export default function V3PromilmetrePage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <PromilmetreApp />
    </div>
  );
}
