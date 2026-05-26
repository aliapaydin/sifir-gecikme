import Link from 'next/link';
import { yazilar } from '../../lib/icerikler';

const badgeColors = {
  'interaktif': { bg: 'rgba(20,184,166,0.12)', color: '#2dd4bf', border: 'rgba(20,184,166,0.2)' },
  'rehber': { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'araç': { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  'vaka çalışması': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'kariyer': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
};

function getBadgeStyle(badge) {
  const b = badgeColors[badge] || badgeColors['rehber'];
  return {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    background: b.bg,
    color: b.color,
    border: `1px solid ${b.border}`,
  };
}

const kategoriler = [
  { icon: '⚡', label: 'İnteraktif', desc: 'Deneye deneye öğren', href: '/v3/icerikler?tip=interaktif', color: '#14b8a6' },
  { icon: '📖', label: 'Rehber', desc: 'Adım adım açıklamalar', href: '/v3/icerikler?tip=rehber', color: '#8b5cf6' },
  { icon: '🔧', label: 'Araç', desc: 'Hazır hesaplayıcılar', href: '/v3/icerikler?tip=arac', color: '#6366f1' },
  { icon: '📊', label: 'Vaka', desc: 'Gerçek veri analizleri', href: '/v3/icerikler?tip=vaka', color: '#f97316' },
  { icon: '💼', label: 'Kariyer', desc: 'İş hayatına hazırlık', href: '/v3/icerikler?tip=kariyer', color: '#10b981' },
];

export default function V3HomePage() {
  const featured = yazilar.slice(0, 6);

  return (
    <>
      <style>{`
        .v3-hero {
          position: relative;
          padding: 100px 24px 80px;
          text-align: center;
          overflow: hidden;
        }
        .v3-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .v3-hero-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin: 0 0 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 50%, #a5f3fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .v3-hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          color: var(--v3-text-muted);
          max-width: 560px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }
        .v3-hero-ctas {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .v3-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .v3-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .v3-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
          color: var(--v3-text);
          border: 1px solid var(--v3-border-bright);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
          backdrop-filter: blur(8px);
        }
        .v3-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }
        .v3-stats-bar {
          background: var(--v3-surface);
          border-top: 1px solid var(--v3-border);
          border-bottom: 1px solid var(--v3-border);
          padding: 16px 24px;
        }
        .v3-stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .v3-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--v3-text-muted);
        }
        .v3-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--v3-accent);
          flex-shrink: 0;
        }
        .v3-stat-value {
          font-weight: 600;
          color: var(--v3-text);
        }
        .v3-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 24px;
        }
        .v3-section-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--v3-text);
          margin: 0 0 8px;
          letter-spacing: -0.3px;
        }
        .v3-section-sub {
          font-size: 14px;
          color: var(--v3-text-muted);
          margin: 0 0 32px;
        }
        .v3-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .v3-card {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .v3-card:hover {
          border-color: var(--v3-border-bright);
          transform: translateY(-2px);
        }
        .v3-card-badge {
          align-self: flex-start;
        }
        .v3-card-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--v3-text);
          line-height: 1.4;
          margin: 0;
        }
        .v3-card-desc {
          font-size: 14px;
          color: var(--v3-text-muted);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }
        .v3-card-meta {
          font-size: 12px;
          color: var(--v3-text-faint);
          margin: 0;
        }
        .v3-ai-block {
          background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12), rgba(20,184,166,0.08));
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .v3-ai-block::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .v3-ai-icon {
          font-size: 40px;
          margin-bottom: 16px;
          display: block;
        }
        .v3-ai-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 0 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .v3-ai-desc {
          font-size: 16px;
          color: var(--v3-text-muted);
          max-width: 500px;
          margin: 0 auto 28px;
          line-height: 1.6;
        }
        .v3-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .v3-cat-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid var(--v3-border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s, background 0.2s;
          text-decoration: none;
          color: inherit;
        }
        .v3-cat-card:hover {
          border-color: var(--v3-border-bright);
          background: rgba(255,255,255,0.05);
        }
        .v3-cat-icon {
          font-size: 24px;
        }
        .v3-cat-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--v3-text);
        }
        .v3-cat-desc {
          font-size: 12px;
          color: var(--v3-text-muted);
        }
      `}</style>

      {/* Hero */}
      <section className="v3-hero">
        <div className="v3-hero-bg" />
        <h1 className="v3-hero-title">Veriyi Anla,<br />Kararını Ver</h1>
        <p className="v3-hero-sub">
          İnteraktif demolar, gerçek veri analizleri ve AI destekli öğrenme ile veri bilimini sıfırdan ileri seviyeye öğren.
        </p>
        <div className="v3-hero-ctas">
          <Link href="/v3/icerikler" className="v3-btn-primary">
            İçerikleri Keşfet →
          </Link>
          <Link href="/v3/kayit" className="v3-btn-secondary">
            Ücretsiz Kaydol
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="v3-stats-bar">
        <div className="v3-stats-inner">
          <div className="v3-stat">
            <div className="v3-stat-dot" style={{ background: '#14b8a6' }} />
            <span><span className="v3-stat-value">50+</span> içerik</span>
          </div>
          <div className="v3-stat">
            <div className="v3-stat-dot" style={{ background: '#8b5cf6' }} />
            <span><span className="v3-stat-value">10+</span> interaktif demo</span>
          </div>
          <div className="v3-stat">
            <div className="v3-stat-dot" style={{ background: '#6366f1' }} />
            <span><span className="v3-stat-value">AI Tutor</span> desteği</span>
          </div>
          <div className="v3-stat">
            <div className="v3-stat-dot" style={{ background: '#10b981' }} />
            <span><span className="v3-stat-value">Ücretsiz</span></span>
          </div>
        </div>
      </div>

      {/* Featured content */}
      <div className="v3-section">
        <h2 className="v3-section-title">Öne Çıkan İçerikler</h2>
        <p className="v3-section-sub">En popüler içerikler — dene, öğren, anla.</p>
        <div className="v3-grid">
          {featured.map(yazi => (
            <Link key={yazi.href} href={yazi.href} className="v3-card">
              <div className="v3-card-badge">
                <span style={getBadgeStyle(yazi.badge)}>{yazi.badge}</span>
              </div>
              <h3 className="v3-card-title">{yazi.baslik}</h3>
              <p className="v3-card-desc">{yazi.ozet}</p>
              <p className="v3-card-meta">{yazi.meta}</p>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/v3/icerikler" className="v3-btn-secondary">
            Tüm içerikleri gör →
          </Link>
        </div>
      </div>

      {/* AI Tutor block */}
      <div style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="v3-ai-block">
            <span className="v3-ai-icon">🤖</span>
            <h2 className="v3-ai-title">Anlamadın mı? Sor.</h2>
            <p className="v3-ai-desc">
              AI Tutor, veri bilimi kavramlarını senin seviyene göre açıklar.
              Soru sor, örnekler iste, kafanda netleştir.
            </p>
            <Link href="/ogren" className="v3-btn-primary">
              AI Tutor'ı Dene →
            </Link>
          </div>
        </div>
      </div>

      {/* Kategori linkleri */}
      <div className="v3-section" style={{ paddingTop: 0 }}>
        <h2 className="v3-section-title">Kategoriler</h2>
        <p className="v3-section-sub">İlgilendiğin alana göre içerik bul.</p>
        <div className="v3-cat-grid">
          {kategoriler.map(kat => (
            <Link key={kat.href} href={kat.href} className="v3-cat-card">
              <div className="v3-cat-icon">{kat.icon}</div>
              <div className="v3-cat-label" style={{ color: kat.color }}>{kat.label}</div>
              <div className="v3-cat-desc">{kat.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
