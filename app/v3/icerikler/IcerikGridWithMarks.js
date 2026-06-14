'use client';

import Link from 'next/link';
import { useContentMarks } from '../../../lib/useContentMarks';
import DataCardBg from '../components/DataCardBg';

const V3_PAGES = ['/yazilar/', '/ogren/', '/python', '/sql', '/regex', '/ciz', '/nn',
  '/hipotez', '/mulakat', '/kalori', '/tech-center', '/harita', '/milyon',
  '/veri-setleri', '/proje', '/grafik', '/promilmetre', '/csv', '/renk', '/sinav'];

function v3href(href) {
  if (href.startsWith('/v3')) return href;
  if (href.startsWith('http')) return href;
  return V3_PAGES.some(p => href === p || href.startsWith(p)) ? `/v3${href}` : href;
}

const BADGE_COLORS = {
  'interaktif':      { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.2)' },
  'rehber':          { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'araç':            { bg: 'rgba(99,102,241,0.12)',   color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  'vaka çalışması':  { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'kariyer':         { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
};

const BADGE_ACCENT = {
  'interaktif': '#2dd4bf', 'rehber': '#a78bfa', 'araç': '#818cf8',
  'vaka çalışması': '#fb923c', 'kariyer': '#34d399',
};

function badgeStyle(badge) {
  const c = BADGE_COLORS[badge] || BADGE_COLORS['rehber'];
  return {
    display: 'inline-block', padding: '2px 9px', borderRadius: '4px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase',
    background: c.bg, color: c.color, border: `1px solid ${c.border}`,
  };
}

export default function IcerikGridWithMarks({ yazilar }) {
  const { marks } = useContentMarks();

  return (
    <div className="ic-grid">
      {yazilar.map(yazi => {
        const mark     = marks[yazi.href];
        const isAnladi = mark === 'anladi';
        const isTekrar = mark === 'tekrar';
        const accent   = BADGE_ACCENT[yazi.badge] || '#818cf8';

        return (
          <Link
            key={yazi.href}
            href={v3href(yazi.href)}
            className="ic-card"
            style={{
              position: 'relative', overflow: 'hidden',
              borderColor: isAnladi
                ? 'rgba(16,185,129,0.3)'
                : isTekrar
                ? 'rgba(251,191,36,0.3)'
                : undefined,
              background: isAnladi
                ? 'rgba(16,185,129,0.04)'
                : isTekrar
                ? 'rgba(251,191,36,0.04)'
                : undefined,
            }}
          >
            <DataCardBg href={yazi.href} opacity={0.18} color={accent} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <span style={badgeStyle(yazi.badge)}>{yazi.badge}</span>
              {isAnladi && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  background: 'rgba(16,185,129,0.12)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.25)', whiteSpace: 'nowrap', flexShrink: 0,
                }}>✓ Anladım</span>
              )}
              {isTekrar && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
                  border: '1px solid rgba(251,191,36,0.3)', whiteSpace: 'nowrap', flexShrink: 0,
                }}>↩ Tekrar</span>
              )}
            </div>
            <h2 className="ic-card-title" style={{ position: 'relative' }}>{yazi.baslik}</h2>
            <p className="ic-card-desc" style={{ position: 'relative' }}>{yazi.ozet}</p>
            <p className="ic-card-meta" style={{ position: 'relative' }}>{yazi.meta}</p>
          </Link>
        );
      })}
    </div>
  );
}
