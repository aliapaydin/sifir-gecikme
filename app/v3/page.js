import Link from 'next/link';
import { yazilar } from '../../lib/icerikler';
import { sql, initDb } from '../../lib/v3/db';

export const dynamic = 'force-dynamic';
import HeroAnimation from './components/HeroAnimations';
import HeroRegisterBtn from './components/HeroRegisterBtn';
import OgrenCard from './components/OgrenCard';
import TechCenterCard from './components/TechCenterCard';
import V3EmbeddedTutor from './components/V3EmbeddedTutor';
import StatsBar from './components/StatsBar';
import V3FeaturedSection from './components/V3FeaturedSection';
import DataCardBg from './components/DataCardBg';

const HERO_DEFAULTS = {
  title: 'Veriyi Anla,\nKararını Ver',
  subtitle: 'İnteraktif demolar, gerçek veri analizleri ve AI destekli öğrenme ile veri bilimini sıfırdan ileri seviyeye öğren.',
  animation: '1',
};

const kategoriler = [
  { icon: '⚡', label: 'İnteraktif', desc: 'Deneye deneye öğren',    href: '/icerikler?tip=interaktif', color: '#14b8a6' },
  { icon: '📖', label: 'Rehber',     desc: 'Adım adım açıklamalar',  href: '/icerikler?tip=rehber',    color: '#8b5cf6' },
  { icon: '🔧', label: 'Araç',       desc: 'Hazır hesaplayıcılar',   href: '/icerikler?tip=arac',      color: '#6366f1' },
  { icon: '📊', label: 'Vaka',       desc: 'Gerçek veri analizleri', href: '/icerikler?tip=vaka',      color: '#f97316' },
  { icon: '💼', label: 'Kariyer',    desc: 'İş hayatına hazırlık',   href: '/icerikler?tip=kariyer',   color: '#10b981' },
];

const tools = [
  { emoji: '🐍', title: 'Python Playground', desc: 'Tarayıcıda gerçek Python — Pyodide ile kurulum yok, anında çalıştır.', href: '/python', accent: '#3b82f6', tag: 'Pyodide' },
  { emoji: '🗄️', title: 'SQL Playground',    desc: '3 farklı veritabanı, şema gezgini ve sql.js motoru — tarayıcıda SQLite.', href: '/sql',    accent: '#8b5cf6', tag: 'sql.js' },
  { emoji: '🔍', title: 'Regex Tester',       desc: 'Türkçe açıklamalı regex playground — pattern yaz, anlık test et.', href: '/regex',  accent: '#14b8a6', tag: 'Regex' },
  { emoji: '✏️', title: 'Rakam Çiz',          desc: 'El yazısı rakam çiz, tarayıcıda CNN modelini eğit — TensorFlow.js.', href: '/ciz',   accent: '#f59e0b', tag: 'CNN' },
  { emoji: '🧪', title: 'Sinir Ağı',          desc: 'XOR/çember/spiral veri setleriyle karar sınırını gerçek zamanlı görselleştir.', href: '/nn', accent: '#fb923c', tag: 'Neural Net' },
];

const playground = [
  { emoji: '📈', title: 'Linear Regression',    desc: 'Noktaları sürükle, regresyon çizgisi anlık güncellensin.',          href: '/yazilar/linear-regression',  accent: '#14b8a6' },
  { emoji: '⛰️', title: 'Gradient Descent',     desc: 'Top yuvarlama oyunu — öğrenme hızını sen belirle.',                 href: '/yazilar/gradient-descent',   accent: '#818cf8' },
  { emoji: '🔵', title: 'K-Means Kümeleme',     desc: "Centroid'lerin adım adım yer değiştirmesini izle.",                href: '/yazilar/kmeans',             accent: '#a78bfa' },
  { emoji: '🧠', title: 'Sinir Ağı',            desc: 'Katmanları, nöronları ve aktivasyonları görselleştir.',             href: '/yazilar/sinir-agi',          accent: '#fb923c' },
  { emoji: '📧', title: 'Lojistik Regresyon',   desc: 'Spam filtresini eğit — gradient descent canlı izle.',              href: '/yazilar/lojistik-regresyon', accent: '#34d399' },
  { emoji: '🎯', title: 'Confusion Matrix',     desc: 'Precision, recall ve F1 skorunu interaktif keşfet.',               href: '/yazilar/confusion-matrix',   accent: '#fb7185' },
  { emoji: '📐', title: 'A/B Test Hesaplayıcı', desc: 'p-değeri, güven aralığı ve etki büyüklüğünü anında hesapla.',      href: '/yazilar/ab-test',            accent: '#fb923c' },
  { emoji: '🧪', title: 'Hipotez Testi Seçici', desc: 'Verini anlat, doğru istatistiksel testi bul.',                     href: '/hipotez',                    accent: '#818cf8' },
];

export default async function V3HomePage() {
  // Hero ayarları + analiz özeti server-side
  let hero = { ...HERO_DEFAULTS };
  let analiz = null;
  try {
    await initDb();
    const [settings, weeklyRows, anladiCount, tekrarCount, viewCount] = await Promise.all([
      sql`SELECT key, value FROM v3_settings WHERE key IN ('hero_title', 'hero_subtitle', 'hero_animation')`,
      sql`SELECT href, SUM(count)::int AS total FROM v3_content_views WHERE day >= CURRENT_DATE - INTERVAL '7 days' GROUP BY href ORDER BY total DESC LIMIT 3`,
      sql`SELECT COUNT(*)::int AS n FROM v3_content_marks WHERE mark = 'anladi'`,
      sql`SELECT COUNT(*)::int AS n FROM v3_content_marks WHERE mark = 'tekrar'`,
      sql`SELECT COALESCE(SUM(count),0)::int AS n FROM v3_content_views WHERE day >= CURRENT_DATE - INTERVAL '7 days'`,
    ]);
    const map = {};
    for (const r of settings) map[r.key] = r.value;
    if (map.hero_title)     hero.title     = map.hero_title;
    if (map.hero_subtitle)  hero.subtitle  = map.hero_subtitle;
    if (map.hero_animation) hero.animation = map.hero_animation;
    analiz = {
      weekly: weeklyRows,
      anladiCount: anladiCount[0]?.n || 0,
      tekrarCount: tekrarCount[0]?.n || 0,
      weeklyViews: viewCount[0]?.n || 0,
    };
  } catch {}

  return (
    <>
      <style>{`
        .v3-hero {
          position: relative; padding: 52px 24px 44px;
          overflow: hidden;
        }
        .v3-hero-bg {
          position: absolute; inset: 0; z-index: 1;
          background: radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .v3-hero-anim-bg {
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none; opacity: 0.3; overflow: hidden;
        }
        .v3-hero-inner {
          max-width: 1200px; margin: 0 auto;
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
        }
        .v3-hero-text { flex: 1; max-width: 560px; }
        /* Analiz kartı */
        .v3-analiz-card {
          flex-shrink: 0; width: 320px;
          background: rgba(13,20,33,0.72);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px; padding: 20px;
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: block;
        }
        .v3-analiz-card:hover {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 28px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          transform: translateY(-2px);
        }
        .v3-light .v3-analiz-card {
          background: rgba(255,255,255,0.85);
          border-color: rgba(99,102,241,0.15);
          box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(99,102,241,0.08);
        }
        .v3-analiz-card-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .v3-analiz-card-title { font-size: 13px; font-weight: 700; color: var(--v3-text); }
        .v3-analiz-card-link  { font-size: 11px; color: #818cf8; font-weight: 600; }
        .v3-analiz-stat-row {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px;
        }
        .v3-analiz-stat {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 8px; text-align: center;
        }
        .v3-light .v3-analiz-stat { background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.1); }
        .v3-analiz-stat-val { font-size: 18px; font-weight: 800; color: var(--v3-text); line-height: 1; }
        .v3-analiz-stat-lbl { font-size: 10px; color: var(--v3-text-muted); margin-top: 3px; }
        .v3-analiz-trending  { display: flex; flex-direction: column; gap: 6px; }
        .v3-analiz-trend-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; border-radius: 8px;
          background: rgba(255,255,255,0.03); font-size: 11.5px;
          color: var(--v3-text-muted); line-height: 1.3;
        }
        .v3-light .v3-analiz-trend-item { background: rgba(99,102,241,0.04); }
        .v3-analiz-trend-badge {
          font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px;
          background: rgba(99,102,241,0.15); color: #818cf8; flex-shrink: 0;
        }
        @media (max-width: 900px) { .v3-analiz-card { display: none; } }
        @media (max-width: 768px) { .v3-hero-inner { flex-direction: column; align-items: flex-start; } }
        .v3-hero-title {
          font-size: clamp(30px, 4.5vw, 52px); font-weight: 800;
          line-height: 1.12; letter-spacing: -1.2px; margin: 0 0 16px;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 50%, #a5f3fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          white-space: pre-line;
        }
        .v3-light .v3-hero-title {
          background: linear-gradient(135deg, #1e293b 0%, #4f46e5 50%, #0d9488 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-hero-sub {
          font-size: clamp(14px, 2vw, 17px); color: var(--v3-text-muted);
          max-width: 480px; margin: 0 0 28px; line-height: 1.65;
          white-space: pre-line;
        }
        .v3-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
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
        .v3-stat { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--v3-text-muted); flex-shrink: 0; }
        .v3-stat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--v3-accent); flex-shrink: 0; }
        .v3-stat-value { font-weight: 600; color: var(--v3-text); white-space: nowrap; }
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
        .tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .tool-card {
          border: 1px solid var(--v3-border); border-radius: 14px;
          padding: 18px 20px; display: flex; flex-direction: column; gap: 10px;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .tool-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 14px 14px 0 0;
        }
        .tool-card:hover { border-color: var(--v3-border-bright); transform: translateY(-2px); }
        .tool-card-top { display: flex; align-items: center; gap: 10px; }
        .tool-card-emoji { font-size: 24px; flex-shrink: 0; }
        .tool-card-title { font-size: 14px; font-weight: 700; color: var(--v3-text); }
        .tool-card-desc { font-size: 12px; color: var(--v3-text-muted); line-height: 1.55; flex: 1; }
        .tool-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .tool-card-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; }
        .tool-card-run { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
        @media (max-width: 860px) {
          .v3-hero-title { font-size: clamp(28px, 7vw, 40px); }
          .v3-hero-ctas { justify-content: flex-start; }
        }
        @media (max-width: 600px) {
          .v3-hero { padding: 36px 20px 32px; }
          .v3-section { padding: 40px 16px; }
          .pg-grid { grid-template-columns: 1fr 1fr; }
          .tool-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 400px) {
          .pg-grid { grid-template-columns: 1fr; }
          .tool-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero — server-side render, flash yok */}
      <section className="v3-hero">
        <div className="v3-hero-bg" />
        <div className="v3-hero-anim-bg">
          <HeroAnimation id={hero.animation} />
        </div>
        <div className="v3-hero-inner">
          <div className="v3-hero-text">
            <h1 className="v3-hero-title">{hero.title}</h1>
            <p className="v3-hero-sub">{hero.subtitle}</p>
            <div className="v3-hero-ctas">
              <Link href="/icerikler" className="v3-btn-primary">İçerikleri Keşfet →</Link>
              <HeroRegisterBtn />
            </div>
          </div>

          {/* Analiz özet kartı — yalnızca desktop */}
          <Link href="/v3/analiz" className="v3-analiz-card">
            <div className="v3-analiz-card-head">
              <span className="v3-analiz-card-title">📈 İçerik Analizi</span>
              <span className="v3-analiz-card-link">Tümünü gör →</span>
            </div>
            <div className="v3-analiz-stat-row">
              <div className="v3-analiz-stat">
                <div className="v3-analiz-stat-val" style={{ color: '#818cf8' }}>
                  {analiz?.weeklyViews ?? '—'}
                </div>
                <div className="v3-analiz-stat-lbl">Bu hafta</div>
              </div>
              <div className="v3-analiz-stat">
                <div className="v3-analiz-stat-val" style={{ color: '#10b981' }}>
                  {analiz?.anladiCount ?? '—'}
                </div>
                <div className="v3-analiz-stat-lbl">Anladım</div>
              </div>
              <div className="v3-analiz-stat">
                <div className="v3-analiz-stat-val" style={{ color: '#fbbf24' }}>
                  {analiz?.tekrarCount ?? '—'}
                </div>
                <div className="v3-analiz-stat-lbl">Tekrar Bak</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--v3-text-muted)', marginBottom: '8px' }}>
              🔥 Bu Hafta Trend
            </div>
            <div className="v3-analiz-trending">
              {analiz?.weekly?.length > 0 ? analiz.weekly.map((item, i) => {
                const slug = item.href.split('/').filter(Boolean).pop();
                return (
                  <div key={item.href} className="v3-analiz-trend-item">
                    <span style={{ fontSize: '13px', flexShrink: 0 }}>
                      {['🥇','🥈','🥉'][i] || `${i+1}.`}
                    </span>
                    <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {slug}
                    </span>
                    <span className="v3-analiz-trend-badge">{item.total}</span>
                  </div>
                );
              }) : (
                <div className="v3-analiz-trend-item" style={{ justifyContent: 'center', color: 'var(--v3-text-faint)' }}>
                  Veri biriktirilmekte...
                </div>
              )}
            </div>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* Öğren Progress — client (localStorage) */}
      <div className="v3-section" style={{ paddingBottom: '32px' }}>
        <h2 className="v3-section-title">📚 İnteraktif Öğrenme</h2>
        <p className="v3-section-sub">Adım adım dersler, sorular ve anında geri bildirim ile veri bilimini öğren.</p>
        <OgrenCard />
      </div>

      {/* Tech Center — client (localStorage) */}
      <div className="v3-section" style={{ paddingTop: '32px' }}>
        <h2 className="v3-section-title">🕹️ Simülasyon Oyunu</h2>
        <p className="v3-section-sub">Öğrendiklerini uygulamaya dök — iş simülasyonu, stratejik kararlar.</p>
        <TechCenterCard />
      </div>

      {/* Araçlar */}
      <div className="v3-section" style={{ paddingTop: 0, paddingBottom: '32px' }}>
        <h2 className="v3-section-title">🛠️ Araçlar & Playgroundlar</h2>
        <p className="v3-section-sub">Doğrudan tarayıcıda çalışan araçlar — kurulum yok, anında başla.</p>
        <div className="tool-grid">
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} className="tool-card"
              style={{ background: `linear-gradient(135deg, ${tool.accent}0f, ${tool.accent}04)`, position: 'relative', overflow: 'hidden' }}>
              <DataCardBg href={tool.href} opacity={0.09} color={tool.accent} />
              <div className="tool-card-top" style={{ position: 'relative' }}>
                <span className="tool-card-emoji">{tool.emoji}</span>
                <span className="tool-card-title">{tool.title}</span>
              </div>
              <p className="tool-card-desc" style={{ position: 'relative' }}>{tool.desc}</p>
              <div className="tool-card-footer" style={{ position: 'relative' }}>
                <span className="tool-card-tag" style={{ background: `${tool.accent}18`, color: tool.accent }}>{tool.tag}</span>
                <span className="tool-card-run" style={{ color: tool.accent }}>Aç →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Playground */}
      <div className="v3-section" style={{ paddingTop: 0 }}>
        <h2 className="v3-section-title">⚡ İnteraktif Demolar</h2>
        <p className="v3-section-sub">Algoritmaları çalışırken gör — sürükle, ayarla, keşfet.</p>
        <div className="pg-grid">
          {playground.map(item => (
            <Link key={item.href} href={item.href} className="pg-card"
              style={{ background: `linear-gradient(135deg, ${item.accent}14, ${item.accent}05)`, position: 'relative', overflow: 'hidden' }}>
              <DataCardBg href={item.href} opacity={0.09} color={item.accent} />
              <div className="pg-emoji-wrap" style={{ background: `${item.accent}18`, position: 'relative' }}>{item.emoji}</div>
              <h3 className="pg-title" style={{ position: 'relative' }}>{item.title}</h3>
              <p className="pg-desc" style={{ position: 'relative' }}>{item.desc}</p>
              <div className="pg-cta" style={{ color: item.accent, position: 'relative' }}>Dene →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Öne çıkan içerikler */}
      <V3FeaturedSection />

      {/* AI Tutor — client */}
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
