'use client';

import ZiyaretTakip from '../../../components/ZiyaretTakip';
import MilyonPage from '../../milyon/page';

export default function V3MilyonPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <ZiyaretTakip />
      <MilyonPage />
    </div>
  );
}
