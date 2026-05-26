'use client';

import GameApp from '../../../components/tech-center/GameApp';

export default function V3TechCenterPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <GameApp />
    </div>
  );
}
