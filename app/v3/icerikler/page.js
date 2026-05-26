import Link from 'next/link';
import { yazilar } from '../../../lib/icerikler';

export const metadata = { title: 'İçerikler' };

const BADGE_COLORS = {
  'interaktif':      { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.2)' },
  'rehber':          { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'araç':            { bg: 'rgba(99,102,241,0.12)',   color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  'vaka çalışması':  { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'kariyer':         { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
};

function badgeStyle(badge) {
  const c = BADGE_COLORS[badge] || BADGE_COLORS['rehber'];
  return {
    display: 'inline-block', padding: '2px 9px', borderRadius: '4px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase',
    background: c.bg, color: c.color, border: `1px solid ${c.border}`,
  };
}

// URL-safe slug → gerçek badge değeri
const SLUG_TO_BADGE = {
  'interaktif':  'interaktif',
  'rehber':      'rehber',
  'arac':        'araç',
  'vaka':        'vaka çalışması',
  'kariyer':     'kariyer',
};

function v3href(href) {
  return href.startsWith('/yazilar/') ? `/v3${href}` : href;
}

const KATEGORILER = [
  { key: '',            label: 'Tümü' },
  { key: 'interaktif',  label: 'İnteraktif' },
  { key: 'rehber',      label: 'Rehber' },
  { key: 'arac',        label: 'Araç' },
  { key: 'vaka',        label: 'Vaka' },
  { key: 'kariyer',     label: 'Kariyer' },
];

export default async function IceriklerPage({ searchParams }) {
  const params = await searchParams;
  const tip = params?.tip || '';
  const badgeFilter = SLUG_TO_BADGE[tip] || tip;
  const filtered = badgeFilter ? yazilar.filter(y => y.badge === badgeFilter) : yazilar;

  return (
    <>
      <style>{`
        .ic-page { max-width: 1200px; margin: 0 auto; padding: 56px 24px 80px; }
        .ic-header { margin-bottom: 40px; }
        .ic-title { font-size: 32px; font-weight: 800; letter-spacing: -0.6px; color: var(--v3-text); margin: 0 0 8px; }
        .ic-sub   { font-size: 15px; color: var(--v3-text-muted); margin: 0; }
        .ic-tabs {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--v3-border);
        }
        .ic-tab {
          padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
          border: 1px solid var(--v3-border); color: var(--v3-text-muted);
          cursor: pointer; text-decoration: none;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .ic-tab:hover { color: var(--v3-text); border-color: var(--v3-border-bright); }
        .ic-tab.active {
          background: rgba(99,102,241,0.12); color: #818cf8;
          border-color: rgba(99,102,241,0.3);
        }
        .ic-count { font-size: 12px; color: var(--v3-text-faint); margin-bottom: 20px; }
        .ic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .ic-card {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 24px;
          display: flex; flex-direction: column; gap: 12px;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.15s;
        }
        .ic-card:hover { border-color: var(--v3-border-bright); transform: translateY(-2px); }
        .ic-card-title { font-size: 15px; font-weight: 600; color: var(--v3-text); line-height: 1.4; margin: 0; }
        .ic-card-desc  { font-size: 13px; color: var(--v3-text-muted); line-height: 1.5; margin: 0; flex: 1; }
        .ic-card-meta  { font-size: 12px; color: var(--v3-text-faint); margin: 0; }
        @media (max-width: 600px) { .ic-page { padding: 32px 16px 60px; } .ic-title { font-size: 24px; } }
      `}</style>

      <div className="ic-page">
        <div className="ic-header">
          <h1 className="ic-title">İçerikler</h1>
          <p className="ic-sub">Veri bilimi, makine öğrenmesi ve istatistik üzerine Türkçe içerikler.</p>
        </div>

        <div className="ic-tabs">
          {KATEGORILER.map(k => (
            <Link
              key={k.key}
              href={k.key ? `/v3/icerikler?tip=${k.key}` : '/v3/icerikler'}
              className={`ic-tab${tip === k.key ? ' active' : ''}`}
            >
              {k.label}
            </Link>
          ))}
        </div>

        <div className="ic-count">{filtered.length} içerik</div>

        <div className="ic-grid">
          {filtered.map(yazi => (
            <Link key={yazi.href} href={v3href(yazi.href)} className="ic-card">
              <div><span style={badgeStyle(yazi.badge)}>{yazi.badge}</span></div>
              <h2 className="ic-card-title">{yazi.baslik}</h2>
              <p className="ic-card-desc">{yazi.ozet}</p>
              <p className="ic-card-meta">{yazi.meta}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
