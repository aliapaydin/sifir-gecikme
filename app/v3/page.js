'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { yazilar } from '../../lib/icerikler';

const BADGE_COLORS = {
  'interaktif':      { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.2)' },
  'rehber':          { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'araç':            { bg: 'rgba(99,102,241,0.12)',   color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  'vaka çalışması':  { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'kariyer':         { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
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
  return href.startsWith('/yazilar/') ? `/v3${href}` : href;
}

const kategoriler = [
  { icon: '⚡', label: 'İnteraktif', desc: 'Deneye deneye öğren',    href: '/v3/icerikler?tip=interaktif', color: '#14b8a6' },
  { icon: '📖', label: 'Rehber',     desc: 'Adım adım açıklamalar',  href: '/v3/icerikler?tip=rehber',    color: '#8b5cf6' },
  { icon: '🔧', label: 'Araç',       desc: 'Hazır hesaplayıcılar',   href: '/v3/icerikler?tip=arac',      color: '#6366f1' },
  { icon: '📊', label: 'Vaka',       desc: 'Gerçek veri analizleri', href: '/v3/icerikler?tip=vaka',      color: '#f97316' },
  { icon: '💼', label: 'Kariyer',    desc: 'İş hayatına hazırlık',   href: '/v3/icerikler?tip=kariyer',   color: '#10b981' },
];

const playground = [
  {
    emoji: '📈', title: 'Linear Regression',
    desc: 'Noktaları sürükle, regresyon çizgisi anlık güncellensin.',
    href: '/v3/yazilar/linear-regression',
    gradient: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(20,184,166,0.05))',
    accent: '#14b8a6',
  },
  {
    emoji: '⛰️', title: 'Gradient Descent',
    desc: 'Top yuvarlama oyunu — öğrenme hızını sen belirle.',
    href: '/v3/yazilar/gradient-descent',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
    accent: '#818cf8',
  },
  {
    emoji: '🔵', title: 'K-Means Kümeleme',
    desc: "Centroid'lerin adım adım nasıl yer değiştirdiğini izle.",
    href: '/v3/yazilar/kmeans',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
    accent: '#a78bfa',
  },
  {
    emoji: '🧠', title: 'Sinir Ağı',
    desc: 'Katmanları, nöronları ve aktivasyonları görselleştir.',
    href: '/v3/yazilar/sinir-agi',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))',
    accent: '#fb923c',
  },
  {
    emoji: '📧', title: 'Lojistik Regresyon',
    desc: 'Spam filtresini eğit — gradient descent\'i izle.',
    href: '/v3/yazilar/lojistik-regresyon',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
    accent: '#34d399',
  },
  {
    emoji: '🎯', title: 'Confusion Matrix',
    desc: 'Precision, recall ve F1 skorunu interaktif keşfet.',
    href: '/v3/yazilar/confusion-matrix',
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.05))',
    accent: '#fb7185',
  },
  {
    emoji: '🧪', title: 'Hipotez Testi Seçici',
    desc: 'Verini anlat, doğru istatistiksel testi bul.',
    href: '/hipotez',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(20,184,166,0.1))',
    accent: '#818cf8',
  },
  {
    emoji: '📐', title: 'A/B Test Hesaplayıcı',
    desc: 'p-değeri, güven aralığı ve etki büyüklüğünü anında hesapla.',
    href: '/v3/yazilar/ab-test',
    gradient: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))',
    accent: '#fb923c',
  },
  {
    emoji: '🕹️', title: 'Tech Center Oyun',
    desc: 'Veri bilimi kavramlarını oyun oynayarak öğren.',
    href: '/tech-center',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.1))',
    accent: '#a78bfa',
  },
];

export default function V3HomePage() {
  const [user, setUser] = useState(undefined);
  const featured = yazilar.slice(0, 6);

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <style>{`
        .v3-hero {
          position: relative; padding: 100px 24px 80px;
          text-align: center; overflow: hidden;
        }
        .v3-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .v3-hero-title {
          font-size: clamp(36px, 6vw, 64px); font-weight: 800;
          line-height: 1.1; letter-spacing: -1.5px; margin: 0 0 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 50%, #a5f3fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-hero-sub {
          font-size: clamp(16px, 2.5vw, 20px); color: var(--v3-text-muted);
          max-width: 560px; margin: 0 auto 36px; line-height: 1.6;
        }
        .v3-hero-ctas {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
        }
        .v3-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s; text-decoration: none;
        }
        .v3-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .v3-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: rgba(255,255,255,0.05); color: var(--v3-text);
          border: 1px solid var(--v3-border-bright); cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none; backdrop-filter: blur(8px);
        }
        .v3-btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .v3-stats-bar {
          background: var(--v3-surface); border-top: 1px solid var(--v3-border);
          border-bottom: 1px solid var(--v3-border); padding: 16px 24px;
        }
        .v3-stats-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: center;
          gap: 32px; flex-wrap: wrap;
        }
        .v3-stat { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--v3-text-muted); }
        .v3-stat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--v3-accent); flex-shrink: 0; }
        .v3-stat-value { font-weight: 600; color: var(--v3-text); }
        .v3-section { max-width: 1200px; margin: 0 auto; padding: 64px 24px; }
        .v3-section-title { font-size: 22px; font-weight: 700; color: var(--v3-text); margin: 0 0 8px; letter-spacing: -0.3px; }
        .v3-section-sub { font-size: 14px; color: var(--v3-text-muted); margin: 0 0 32px; }
        .v3-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;
        }
        .v3-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 24px; transition: border-color 0.2s, transform 0.2s;
          display: flex; flex-direction: column; gap: 12px;
          cursor: pointer; text-decoration: none; color: inherit;
        }
        .v3-card:hover { border-color: var(--v3-border-bright); transform: translateY(-2px); }
        .v3-card-title { font-size: 16px; font-weight: 600; color: var(--v3-text); line-height: 1.4; margin: 0; }
        .v3-card-desc { font-size: 14px; color: var(--v3-text-muted); line-height: 1.5; margin: 0; flex: 1; }
        .v3-card-meta { font-size: 12px; color: var(--v3-text-faint); margin: 0; }

        /* Playground kartları */
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .pg-card {
          border: 1px solid var(--v3-border); border-radius: 18px;
          padding: 24px; display: flex; flex-direction: column; gap: 14px;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .pg-card:hover {
          border-color: var(--v3-border-bright);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        .pg-emoji {
          font-size: 36px; line-height: 1;
          width: 56px; height: 56px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
        }
        .pg-title { font-size: 16px; font-weight: 700; color: var(--v3-text); margin: 0; }
        .pg-desc { font-size: 13px; color: var(--v3-text-muted); line-height: 1.5; margin: 0; flex: 1; }
        .pg-cta { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        .v3-ai-block {
          background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12), rgba(20,184,166,0.08));
          border: 1px solid rgba(99,102,241,0.2); border-radius: 20px;
          padding: 48px 40px; text-align: center; position: relative; overflow: hidden;
        }
        .v3-ai-block::before {
          content: ''; position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .v3-ai-icon { font-size: 40px; margin-bottom: 16px; display: block; }
        .v3-ai-title {
          font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-ai-desc { font-size: 16px; color: var(--v3-text-muted); max-width: 500px; margin: 0 auto 28px; line-height: 1.6; }
        .v3-cat-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;
        }
        .v3-cat-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(12px);
          border: 1px solid var(--v3-border); border-radius: 14px; padding: 20px;
          display: flex; flex-direction: column; gap: 8px;
          transition: border-color 0.2s, background 0.2s; text-decoration: none; color: inherit;
        }
        .v3-cat-card:hover { border-color: var(--v3-border-bright); background: rgba(255,255,255,0.05); }
        .v3-cat-icon { font-size: 24px; }
        .v3-cat-label { font-size: 15px; font-weight: 600; color: var(--v3-text); }
        .v3-cat-desc { font-size: 12px; color: var(--v3-text-muted); }

        @media (max-width: 600px) {
          .v3-hero { padding: 60px 20px 48px; }
          .v3-section { padding: 40px 16px; }
          .pg-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .pg-card { padding: 16px; }
          .pg-emoji { width: 40px; height: 40px; font-size: 24px; border-radius: 10px; }
        }
        @media (max-width: 400px) {
          .pg-grid { grid-template-columns: 1fr; }
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
          {user === null && (
            <Link href="/v3/kayit" className="v3-btn-secondary">
              Ücretsiz Kaydol
            </Link>
          )}
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

      {/* Playground & Modüller */}
      <div className="v3-section">
        <h2 className="v3-section-title">Playground & Modüller</h2>
        <p className="v3-section-sub">Algoritmaları çalışırken gör — sürükle, ayarla, keşfet.</p>
        <div className="pg-grid">
          {playground.map(item => (
            <Link key={item.href} href={item.href} className="pg-card" style={{ background: item.gradient }}>
              <div className="pg-emoji" style={{ background: `${item.accent}18` }}>
                {item.emoji}
              </div>
              <h3 className="pg-title">{item.title}</h3>
              <p className="pg-desc">{item.desc}</p>
              <div className="pg-cta" style={{ color: item.accent }}>
                Dene <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured content */}
      <div className="v3-section" style={{ paddingTop: 0 }}>
        <h2 className="v3-section-title">Öne Çıkan İçerikler</h2>
        <p className="v3-section-sub">En popüler içerikler — dene, öğren, anla.</p>
        <div className="v3-grid">
          {featured.map(yazi => (
            <Link key={yazi.href} href={v3href(yazi.href)} className="v3-card">
              <div><span style={getBadgeStyle(yazi.badge)}>{yazi.badge}</span></div>
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
              AI Tutor&apos;ı Dene →
            </Link>
          </div>
        </div>
      </div>

      {/* Kategoriler */}
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
