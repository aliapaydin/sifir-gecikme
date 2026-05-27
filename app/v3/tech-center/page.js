'use client';

import GameApp from '../../../components/tech-center/GameApp';

export default function V3TechCenterPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--color-bg)',
    }}>
      <GameApp />
    </div>
  );
}
