'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { yazilar } from '../../../lib/icerikler';

const BADGE_COLORS = {
  'interaktif':     { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.2)' },
  'rehber':         { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'araç':           { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  'vaka çalışması': { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'kariyer':        { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
};

function getBadgeStyle(badge) {
  const b = BADGE_COLORS[badge] || BADGE_COLORS['rehber'];
  return {
    display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase',
    background: b.bg, color: b.color, border: `1px solid ${b.border}`,
  };
}

function v3href(href) {
  return href;
}

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function V3FeaturedSection() {
  const [items, setItems] = useState(() => yazilar.slice(0, 12));
  const [spinning, setSpinning] = useState(false);

  const shuffle = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 400);
    setItems(pickRandom(yazilar, 12));
  }, []);

  return (
    <div className="v3-section" style={{ paddingTop: 0 }}>
      <style>{`
        .feat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 12px; }
        .feat-shuffle-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          color: #818cf8; cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .feat-shuffle-btn:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); }
        .feat-shuffle-icon { display: inline-block; transition: transform 0.4s; }
        .feat-shuffle-icon.spin { transform: rotate(180deg); }
      `}</style>

      <div className="feat-header">
        <div>
          <h2 className="v3-section-title" style={{ marginBottom: 0 }}>Öne Çıkan İçerikler</h2>
          <p className="v3-section-sub" style={{ marginBottom: 0, marginTop: 4 }}>Rastgele seçildi — dene, öğren, anla.</p>
        </div>
        <button className="feat-shuffle-btn" onClick={shuffle}>
          <span className={`feat-shuffle-icon${spinning ? ' spin' : ''}`}>⇄</span>
          Karıştır
        </button>
      </div>

      <div className="v3-grid" style={{ marginTop: 24 }}>
        {items.map(yazi => {
          const badge = yazi.badge || yazi.kategori;
          return (
          <Link key={yazi.href} href={v3href(yazi.href)} className="v3-card">
            <div>{badge && <span style={getBadgeStyle(badge)}>{badge}</span>}</div>
            <h3 className="v3-card-title">{yazi.baslik}</h3>
            <p className="v3-card-desc">{yazi.ozet}</p>
            <p className="v3-card-meta">{yazi.meta}</p>
          </Link>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/icerikler" className="v3-btn-secondary">Tüm içerikleri gör →</Link>
      </div>
    </div>
  );
}
