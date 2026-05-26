'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { yazilar } from '../../lib/icerikler';
import V3EmbeddedTutor from './components/V3EmbeddedTutor';

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

function fmtMoney(n) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₺${(n / 1_000).toFixed(0)}K`;
  return `₺${n}`;
}

const kategoriler = [
  { icon: '⚡', label: 'İnteraktif', desc: 'Deneye deneye öğren',    href: '/v3/icerikler?tip=interaktif', color: '#14b8a6' },
  { icon: '📖', label: 'Rehber',     desc: 'Adım adım açıklamalar',  href: '/v3/icerikler?tip=rehber',    color: '#8b5cf6' },
  { icon: '🔧', label: 'Araç',       desc: 'Hazır hesaplayıcılar',   href: '/v3/icerikler?tip=arac',      color: '#6366f1' },
  { icon: '📊', label: 'Vaka',       desc: 'Gerçek veri analizleri', href: '/v3/icerikler?tip=vaka',      color: '#f97316' },
  { icon: '💼', label: 'Kariyer',    desc: 'İş hayatına hazırlık',   href: '/v3/icerikler?tip=kariyer',   color: '#10b981' },
];

const playground = [
  { emoji: '📈', title: 'Linear Regression',    desc: 'Noktaları sürükle, regresyon çizgisi anlık güncellensin.',            href: '/v3/yazilar/linear-regression',   accent: '#14b8a6' },
  { emoji: '⛰️', title: 'Gradient Descent',     desc: 'Top yuvarlama oyunu — öğrenme hızını sen belirle.',                   href: '/v3/yazilar/gradient-descent',    accent: '#818cf8' },
  { emoji: '🔵', title: 'K-Means Kümeleme',     desc: "Centroid'lerin adım adım yer değiştirmesini izle.",                  href: '/v3/yazilar/kmeans',              accent: '#a78bfa' },
  { emoji: '🧠', title: 'Sinir Ağı',            desc: 'Katmanları, nöronları ve aktivasyonları görselleştir.',               href: '/v3/yazilar/sinir-agi',           accent: '#fb923c' },
  { emoji: '📧', title: 'Lojistik Regresyon',   desc: 'Spam filtresini eğit — gradient descent canlı izle.',                href: '/v3/yazilar/lojistik-regresyon',  accent: '#34d399' },
  { emoji: '🎯', title: 'Confusion Matrix',     desc: 'Precision, recall ve F1 skorunu interaktif keşfet.',                 href: '/v3/yazilar/confusion-matrix',    accent: '#fb7185' },
  { emoji: '📐', title: 'A/B Test Hesaplayıcı', desc: 'p-değeri, güven aralığı ve etki büyüklüğünü anında hesapla.',        href: '/v3/yazilar/ab-test',             accent: '#fb923c' },
  { emoji: '🧪', title: 'Hipotez Testi Seçici', desc: 'Verini anlat, doğru istatistiksel testi bul.',                       href: '/hipotez',                        accent: '#818cf8' },
];

function TechCenterCard() {
  const [save, setSave] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tc_game_v2');
      if (raw) setSave(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const hasSave = loaded && save && save.currentDay > 1;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: '24px',
      border: '1px solid rgba(139,92,246,0.3)',
      background: 'linear-gradient(135deg, rgba(17,7,40,0.95) 0%, rgba(13,20,65,0.95) 50%, rgba(7,30,50,0.95) 100%)',
      padding: '40px 40px',
    }}>
      {/* Parlayan arka plan efekti */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.12) 0%, transparent 50%)',
      }} />
      {/* Izgara desen */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Sol: içerik */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '20px', marginBottom: '18px',
            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
            fontSize: '11px', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.8px', textTransform: 'uppercase',
          }}>
            🕹️ Simülasyon Oyunu
          </div>

          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, margin: '0 0 12px',
            letterSpacing: '-0.8px', lineHeight: 1.1,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 60%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Tech Center
          </h2>

          <p style={{ fontSize: '15px', color: 'rgba(203,213,225,0.75)', margin: '0 0 24px', lineHeight: 1.6, maxWidth: '440px' }}>
            Kendi bilgisayar mağazanı kur, personel işe al, pazar stratejisi belirle ve şirket değerini <strong style={{ color: '#a78bfa' }}>₺1 milyara</strong> ulaştır.
          </p>

          {/* Kayıtlı oyun varsa göster */}
          {hasSave && (
            <div style={{
              display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
            }}>
              {[
                { label: 'Gün', val: save.currentDay, color: '#a78bfa' },
                { label: 'Kasa', val: fmtMoney(save.cash), color: '#34d399' },
                { label: 'Şirket', val: save.companyName, color: '#93c5fd' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '8px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ fontSize: '10px', color: 'rgba(203,213,225,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/tech-center"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '15px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
            >
              {hasSave ? '▶ Devam Et' : '▶ Oyna'}
            </Link>
          </div>
        </div>

        {/* Sağ: büyük emoji / ikon */}
        <div style={{
          fontSize: '96px', lineHeight: 1, userSelect: 'none', opacity: 0.85,
          filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.4))',
          flexShrink: 0,
        }}>
          🏪
        </div>
      </div>
    </div>
  );
}

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
        .v3-light .v3-hero-title {
          background: linear-gradient(135deg, #1e293b 0%, #4f46e5 50%, #0d9488 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-hero-sub {
          font-size: clamp(16px, 2.5vw, 20px); color: var(--v3-text-muted);
          max-width: 560px; margin: 0 auto 36px; line-height: 1.6;
        }
        .v3-hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
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
        .v3-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
        .v3-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 24px; transition: border-color 0.2s, transform 0.2s;
          display: flex; flex-direction: column; gap: 12px;
          text-decoration: none; color: inherit; cursor: pointer;
        }
        .v3-card:hover { border-color: var(--v3-border-bright); transform: translateY(-2px); }
        .v3-card-title { font-size: 16px; font-weight: 600; color: var(--v3-text); line-height: 1.4; margin: 0; }
        .v3-card-desc { font-size: 14px; color: var(--v3-text-muted); line-height: 1.5; margin: 0; flex: 1; }
        .v3-card-meta { font-size: 12px; color: var(--v3-text-faint); margin: 0; }

        /* Playground kartları */
        .pg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .pg-card {
          border: 1px solid var(--v3-border); border-radius: 16px;
          padding: 22px; display: flex; flex-direction: column; gap: 12px;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .pg-card:hover {
          border-color: var(--v3-border-bright); transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        .pg-emoji-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 26px;
        }
        .pg-title { font-size: 15px; font-weight: 700; color: var(--v3-text); margin: 0; }
        .pg-desc  { font-size: 13px; color: var(--v3-text-muted); line-height: 1.5; margin: 0; flex: 1; }
        .pg-cta   { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        .v3-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .v3-cat-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(12px);
          border: 1px solid var(--v3-border); border-radius: 14px; padding: 20px;
          display: flex; flex-direction: column; gap: 8px;
          transition: border-color 0.2s, background 0.2s; text-decoration: none; color: inherit;
        }
        .v3-cat-card:hover { border-color: var(--v3-border-bright); background: rgba(255,255,255,0.05); }
        .v3-cat-icon { font-size: 24px; }
        .v3-cat-label { font-size: 15px; font-weight: 600; }
        .v3-cat-desc { font-size: 12px; color: var(--v3-text-muted); }

        @media (max-width: 600px) {
          .v3-hero { padding: 60px 20px 48px; }
          .v3-section { padding: 40px 16px; }
          .pg-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 400px) { .pg-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <section className="v3-hero">
        <div className="v3-hero-bg" />
        <h1 className="v3-hero-title">Veriyi Anla,<br />Kararını Ver</h1>
        <p className="v3-hero-sub">
          İnteraktif demolar, gerçek veri analizleri ve AI destekli öğrenme ile veri bilimini sıfırdan ileri seviyeye öğren.
        </p>
        <div className="v3-hero-ctas">
          <Link href="/v3/icerikler" className="v3-btn-primary">İçerikleri Keşfet →</Link>
          {user === null && (
            <Link href="/v3/kayit" className="v3-btn-secondary">Ücretsiz Kaydol</Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="v3-stats-bar">
        <div className="v3-stats-inner">
          {[
            { color: '#14b8a6', val: '50+', label: 'içerik' },
            { color: '#8b5cf6', val: '10+', label: 'interaktif demo' },
            { color: '#6366f1', val: 'AI Tutor', label: 'desteği' },
            { color: '#10b981', val: 'Ücretsiz', label: '' },
          ].map((s, i) => (
            <div key={i} className="v3-stat">
              <div className="v3-stat-dot" style={{ background: s.color }} />
              <span><span className="v3-stat-value">{s.val}</span>{s.label ? ` ${s.label}` : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Center */}
      <div className="v3-section">
        <h2 className="v3-section-title">🕹️ Simülasyon Oyunu</h2>
        <p className="v3-section-sub">Öğrendiklerini uygulamaya dök — iş simülasyonu, stratejik kararlar.</p>
        <TechCenterCard />
      </div>

      {/* Playground */}
      <div className="v3-section" style={{ paddingTop: 0 }}>
        <h2 className="v3-section-title">⚡ Playground</h2>
        <p className="v3-section-sub">Algoritmaları çalışırken gör — sürükle, ayarla, keşfet.</p>
        <div className="pg-grid">
          {playground.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="pg-card"
              style={{ background: `linear-gradient(135deg, ${item.accent}14, ${item.accent}05)` }}
            >
              <div className="pg-emoji-wrap" style={{ background: `${item.accent}18` }}>
                {item.emoji}
              </div>
              <h3 className="pg-title">{item.title}</h3>
              <p className="pg-desc">{item.desc}</p>
              <div className="pg-cta" style={{ color: item.accent }}>Dene →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Öne çıkan içerikler */}
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
          <Link href="/v3/icerikler" className="v3-btn-secondary">Tüm içerikleri gör →</Link>
        </div>
      </div>

      {/* AI Tutor — gömülü sohbet */}
      <div className="v3-section" style={{ paddingTop: 0 }}>
        <h2 className="v3-section-title">🤖 AI Tutor</h2>
        <p className="v3-section-sub">Kafana takılan her şeyi sor — veri bilimi asistanın burada.</p>
        <V3EmbeddedTutor />
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
