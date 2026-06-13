'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { yazilar } from '../../../lib/icerikler';
import { useContentMarks } from '../../../lib/useContentMarks';

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

const V3_PAGES = ['/yazilar/', '/ogren/', '/python', '/sql', '/regex', '/ciz', '/nn',
  '/hipotez', '/mulakat', '/kalori', '/tech-center', '/harita', '/milyon',
  '/veri-setleri', '/proje', '/grafik', '/promilmetre', '/csv', '/renk', '/sinav'];

function v3href(href) {
  if (!href || href.startsWith('http') || href.startsWith('/v3')) return href;
  return V3_PAGES.some(p => href === p || href.startsWith(p)) ? '/v3' + href : href;
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
  const [items, setItems] = useState(() => pickRandom(yazilar, 12));
  const [spinning, setSpinning] = useState(false);
  const { marks } = useContentMarks();

  // Tekrar bak olanları öne al
  const tekrarlar = Object.entries(marks).filter(([,v]) => v === 'tekrar').map(([k]) => k);
  const sortedItems = tekrarlar.length > 0
    ? [...items].sort((a, b) => {
        const aT = tekrarlar.includes(a.href) ? -1 : 0;
        const bT = tekrarlar.includes(b.href) ? -1 : 0;
        return aT - bT;
      })
    : items;

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
        .v3-mark-badge {
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px;
          margin-left: auto; white-space: nowrap; flex-shrink: 0;
        }
        .v3-mark-anladi { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
        .v3-mark-tekrar { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
      `}</style>

      <div className="feat-header">
        <div>
          <h2 className="v3-section-title" style={{ marginBottom: 0 }}>
            Öne Çıkan İçerikler
            {tekrarlar.length > 0 && (
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#fbbf24', marginLeft: '10px' }}>
                ↩ {tekrarlar.length} tekrar bak
              </span>
            )}
          </h2>
          <p className="v3-section-sub" style={{ marginBottom: 0, marginTop: 4 }}>Rastgele seçildi — dene, öğren, anla.</p>
        </div>
        <button className="feat-shuffle-btn" onClick={shuffle}>
          <span className={`feat-shuffle-icon${spinning ? ' spin' : ''}`}>⇄</span>
          Karıştır
        </button>
      </div>

      <div className="v3-grid" style={{ marginTop: 24 }}>
        {sortedItems.map(yazi => {
          const badge  = yazi.badge || yazi.kategori;
          const mark   = marks[yazi.href];
          return (
            <Link key={yazi.href} href={v3href(yazi.href)} className="v3-card" style={{
              borderColor: mark === 'tekrar' ? 'rgba(251,191,36,0.25)' : mark === 'anladi' ? 'rgba(16,185,129,0.2)' : undefined,
              background: mark === 'tekrar' ? 'rgba(251,191,36,0.04)' : undefined,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
                {badge && <span style={getBadgeStyle(badge)}>{badge}</span>}
                {mark === 'anladi' && <span className="v3-mark-badge v3-mark-anladi">✓ Anladım</span>}
                {mark === 'tekrar' && <span className="v3-mark-badge v3-mark-tekrar">↩ Tekrar</span>}
              </div>
              <h3 className="v3-card-title">{yazi.baslik}</h3>
              <p className="v3-card-desc">{yazi.ozet}</p>
              <p className="v3-card-meta">{yazi.meta}</p>
            </Link>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/v3/icerikler" className="v3-btn-secondary">Tüm içerikleri gör →</Link>
      </div>
    </div>
  );
}
