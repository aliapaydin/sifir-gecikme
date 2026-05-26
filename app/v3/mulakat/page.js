'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ZiyaretTakip from '../../../components/ZiyaretTakip';
import MulakatPage from '../../mulakat/page';

export default function V3MulakatPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <MulakatPage />
    </div>
  );
}
