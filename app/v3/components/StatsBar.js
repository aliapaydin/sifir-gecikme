'use client';

import { useState, useEffect } from 'react';

const ALL_STATS = [
  { color: '#14b8a6', val: '50+',        label: 'içerik' },
  { color: '#8b5cf6', val: '10+',        label: 'interaktif demo' },
  { color: '#6366f1', val: '5',          label: 'playground aracı' },
  { color: '#fb923c', val: '8',          label: 'modül' },
  { color: '#34d399', val: 'AI Tutor',   label: 'desteği' },
  { color: '#f472b6', val: 'Python & SQL', label: 'tarayıcıda' },
  { color: '#10b981', val: 'Ücretsiz',   label: '' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StatsBar() {
  const [stats, setStats] = useState(ALL_STATS);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setStats(shuffle(ALL_STATS).slice(0, 3));
    }
  }, []);

  return (
    <div className="v3-stats-bar">
      <div className="v3-stats-inner" style={{ flexWrap: 'nowrap', overflow: 'hidden' }}>
        {stats.map((s, i) => (
          <div key={i} className="v3-stat">
            <div className="v3-stat-dot" style={{ background: s.color }} />
            <span><span className="v3-stat-value">{s.val}</span>{s.label ? ` ${s.label}` : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
