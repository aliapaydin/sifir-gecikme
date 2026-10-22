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
        @media (max-width: 900px) {
          .v3-hero-inner { flex-direction: column; align-items: stretch; }
          .v3-analiz-card { width: 100%; flex-shrink: unset; }
        }
        @media (max-width: 600px) {
          .v3-analiz-stat-row { grid-template-columns: 1fr 1fr 1fr; }
          .v3-analiz-stat-val { font-size: 15px; }
        }
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

      {/* Yapay Zeka Ofisi — EN ÜST PROMO */}
      <div className="v3-section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <style>{`
          .yzo-promo-card {
            display: block; text-decoration: none; color: inherit;
            position: relative; overflow: hidden; border-radius: 24px;
            border: 1px solid rgba(99,102,241,0.35);
            background: linear-gradient(135deg, rgba(15,20,40,0.95) 0%, rgba(30,15,50,0.95) 100%);
            transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          }
          .yzo-promo-card:hover {
            border-color: rgba(99,102,241,0.65);
            transform: translateY(-3px);
            box-shadow: 0 24px 72px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.12);
          }
          .v3-light .yzo-promo-card {
            background: linear-gradient(135deg, rgba(238,242,255,0.97) 0%, rgba(245,243,255,0.97) 100%);
            border-color: rgba(99,102,241,0.25);
          }
          .yzo-promo-banner {
            width: 100%; height: 220px;
            display: block; border-radius: 24px 24px 0 0;
            border-bottom: 1px solid rgba(99,102,241,0.2);
            position: relative; overflow: hidden;
            background: linear-gradient(135deg, #0a0f1e 0%, #11062a 50%, #060d1f 100%);
          }
          .v3-light .yzo-promo-banner {
            background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #ecfdf5 100%);
          }
          @media (max-width: 700px) {
            .yzo-promo-banner { height: 160px; }
          }
          .yzo-promo-body {
            padding: 32px 36px 36px;
            display: flex; align-items: flex-start; justify-content: space-between;
            gap: 32px; flex-wrap: wrap;
          }
          @media (max-width: 700px) {
            .yzo-promo-body { padding: 24px 20px 28px; }
          }
          .yzo-promo-badge {
            display: inline-block; padding: 3px 12px; border-radius: 999px; margin-bottom: 14px;
            background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
            font-size: 11px; font-weight: 700; color: #818cf8; letter-spacing: 0.06em; text-transform: uppercase;
          }
          .v3-light .yzo-promo-badge { background: rgba(99,102,241,0.1); color: #4f46e5; border-color: rgba(99,102,241,0.2); }
          .yzo-promo-title {
            font-size: clamp(24px,4vw,36px); font-weight: 800; margin: 0 0 12px;
            letter-spacing: -0.7px;
            background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 45%, #5eead4 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .v3-light .yzo-promo-title {
            background: linear-gradient(135deg, #1e293b 0%, #4f46e5 50%, #0d9488 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .yzo-promo-sub {
            font-size: 15px; color: var(--v3-text-muted); margin: 0 0 22px;
            line-height: 1.7; max-width: 520px;
          }
          .yzo-promo-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
          .yzo-promo-tag {
            padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;
            background: rgba(99,102,241,0.1); color: #818cf8;
            border: 1px solid rgba(99,102,241,0.2);
          }
          .v3-light .yzo-promo-tag { background: rgba(99,102,241,0.08); color: #4f46e5; border-color: rgba(99,102,241,0.2); }
          .yzo-promo-cta {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
            box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          }
          .yzo-promo-stats {
            display: flex; flex-direction: column; gap: 14px; align-items: flex-end;
            min-width: 140px;
          }
          .yzo-promo-stat {
            text-align: center; padding: 14px 20px; border-radius: 14px;
            background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.18);
            min-width: 120px;
          }
          .v3-light .yzo-promo-stat { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.15); }
          .yzo-promo-stat-val {
            font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #818cf8;
          }
          .v3-light .yzo-promo-stat-val { color: #4f46e5; }
          .yzo-promo-stat-lbl { font-size: 11px; color: var(--v3-text-muted); margin-top: 2px; font-weight: 600; }
          @media (max-width: 700px) {
            .yzo-promo-stats { flex-direction: row; align-items: center; width: 100%; }
            .yzo-promo-stat { flex: 1; min-width: unset; }
          }
        `}</style>
        <Link href="/yapay-zeka-ofisi" className="yzo-promo-card">
          {/* SVG pixel-ofis banner — inline, kesme yok */}
          <div className="yzo-promo-banner">
            <svg viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', display: 'block' }}
              preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="yzo-bg-glow" cx="50%" cy="60%" r="60%">
                  <stop offset="0%" stopColor="#312e81" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="yzo-pi-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </radialGradient>
                <filter id="yzo-blur">
                  <feGaussianBlur stdDeviation="2.5"/>
                </filter>
                <filter id="yzo-glow-sm">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Arka plan gradyanları */}
              <rect width="900" height="220" fill="url(#yzo-bg-glow)"/>
              <circle cx="160" cy="110" r="130" fill="rgba(99,102,241,0.07)"/>
              <circle cx="750" cy="90" r="100" fill="rgba(20,184,166,0.06)"/>

              {/* Grid çizgileri */}
              {[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(99,102,241,0.07)" strokeWidth="1"/>
              ))}
              {[0,40,80,120,160,200].map(y => (
                <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="rgba(99,102,241,0.07)" strokeWidth="1"/>
              ))}

              {/* === MASA 1 — Postacı (sol) === */}
              <rect x="40" y="80" width="80" height="50" rx="4" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
              <rect x="48" y="88" width="64" height="34" rx="2" fill="rgba(10,15,35,0.7)" stroke="rgba(99,102,241,0.25)" strokeWidth="0.5"/>
              <rect x="52" y="92" width="56" height="4" rx="1" fill="rgba(99,102,241,0.5)"/>
              <rect x="52" y="99" width="40" height="3" rx="1" fill="rgba(99,102,241,0.3)"/>
              <rect x="52" y="105" width="48" height="3" rx="1" fill="rgba(99,102,241,0.3)"/>
              <rect x="52" y="111" width="32" height="3" rx="1" fill="rgba(99,102,241,0.2)"/>
              {/* Ajan avatarı */}
              <circle cx="80" cy="72" r="10" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
              <text x="80" y="76" textAnchor="middle" fontSize="11" fill="white">📬</text>
              <text x="80" y="148" textAnchor="middle" fontSize="8" fill="rgba(99,102,241,0.8)" fontFamily="monospace">Postacı</text>

              {/* === MASA 2 — Takvimci === */}
              <rect x="155" y="75" width="80" height="55" rx="4" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.35)" strokeWidth="1"/>
              <rect x="163" y="83" width="64" height="38" rx="2" fill="rgba(10,15,35,0.7)" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5"/>
              {/* Takvim grid */}
              {[0,1,2,3,4,5,6].map(i => [0,1,2,3].map(j => (
                <rect key={`${i}-${j}`} x={166+i*8} y={87+j*8} width="6" height="6" rx="1"
                  fill={i===2&&j===1 ? "rgba(139,92,246,0.8)" : "rgba(139,92,246,0.15)"}
                  stroke="rgba(139,92,246,0.2)" strokeWidth="0.5"/>
              )))}
              <circle cx="195" cy="67" r="10" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
              <text x="195" y="71" textAnchor="middle" fontSize="11" fill="white">📅</text>
              <text x="195" y="148" textAnchor="middle" fontSize="8" fill="rgba(139,92,246,0.8)" fontFamily="monospace">Takvimci</text>

              {/* === MASA 3 — Sekreter === */}
              <rect x="270" y="78" width="80" height="52" rx="4" fill="rgba(20,184,166,0.1)" stroke="rgba(20,184,166,0.35)" strokeWidth="1"/>
              <rect x="278" y="86" width="64" height="36" rx="2" fill="rgba(10,15,35,0.7)" stroke="rgba(20,184,166,0.2)" strokeWidth="0.5"/>
              <rect x="282" y="90" width="56" height="3" rx="1" fill="rgba(20,184,166,0.5)"/>
              <rect x="282" y="96" width="44" height="3" rx="1" fill="rgba(20,184,166,0.3)"/>
              <rect x="282" y="102" width="50" height="3" rx="1" fill="rgba(20,184,166,0.3)"/>
              <rect x="282" y="108" width="36" height="3" rx="1" fill="rgba(20,184,166,0.2)"/>
              <rect x="282" y="114" width="48" height="3" rx="1" fill="rgba(20,184,166,0.2)"/>
              <circle cx="310" cy="70" r="10" fill="rgba(20,184,166,0.2)" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5"/>
              <text x="310" y="74" textAnchor="middle" fontSize="11" fill="white">📋</text>
              <text x="310" y="148" textAnchor="middle" fontSize="8" fill="rgba(20,184,166,0.8)" fontFamily="monospace">Sekreter</text>

              {/* === TOPLANTI ODASI (merkez) === */}
              <rect x="390" y="55" width="120" height="110" rx="8" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" strokeDasharray="4 2"/>
              <text x="450" y="75" textAnchor="middle" fontSize="8" fill="rgba(99,102,241,0.5)" fontFamily="monospace" letterSpacing="1">TOPLANTI ODASI</text>
              {/* Yuvarlak masa */}
              <ellipse cx="450" cy="120" rx="36" ry="22" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1"/>
              {/* Küçük sandalyeler */}
              {[
                [450, 92, '📬'], [480, 108, '📅'], [476, 138, '📋'],
                [450, 148, '📰'], [420, 138, '✍️'], [418, 108, '🔍']
              ].map(([cx, cy, em], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.35)" strokeWidth="1"/>
                  <text x={cx} y={cy+3.5} textAnchor="middle" fontSize="8" fill="white">{em}</text>
                </g>
              ))}
              {/* Bekçi ayrıda */}
              <circle cx="450" cy="120" r="7" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1"/>
              <text x="450" y="123.5" textAnchor="middle" fontSize="7" fill="white">🛡️</text>

              {/* === MASA 4 — Haberci === */}
              <rect x="555" y="75" width="80" height="52" rx="4" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.35)" strokeWidth="1"/>
              <rect x="563" y="83" width="64" height="36" rx="2" fill="rgba(10,15,35,0.7)" stroke="rgba(249,115,22,0.2)" strokeWidth="0.5"/>
              {[0,1,2,3,4].map(i => (
                <rect key={i} x="567" y={87+i*6} width={i%2===0 ? 56 : 44} height="4" rx="1"
                  fill={i===0 ? "rgba(249,115,22,0.6)" : "rgba(249,115,22,0.25)"}/>
              ))}
              <circle cx="595" cy="67" r="10" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5"/>
              <text x="595" y="71" textAnchor="middle" fontSize="11" fill="white">📰</text>
              <text x="595" y="145" textAnchor="middle" fontSize="8" fill="rgba(249,115,22,0.8)" fontFamily="monospace">Haberci</text>

              {/* === MASA 5 — Yazar === */}
              <rect x="670" y="80" width="80" height="50" rx="4" fill="rgba(236,72,153,0.1)" stroke="rgba(236,72,153,0.35)" strokeWidth="1"/>
              <rect x="678" y="88" width="64" height="34" rx="2" fill="rgba(10,15,35,0.7)" stroke="rgba(236,72,153,0.2)" strokeWidth="0.5"/>
              <rect x="682" y="92" width="50" height="3" rx="1" fill="rgba(236,72,153,0.5)"/>
              <rect x="682" y="98" width="56" height="3" rx="1" fill="rgba(236,72,153,0.3)"/>
              <rect x="682" y="104" width="40" height="3" rx="1" fill="rgba(236,72,153,0.3)"/>
              <rect x="682" y="110" width="52" height="3" rx="1" fill="rgba(236,72,153,0.2)"/>
              {/* imleç */}
              <rect x="735" y="110" width="2" height="8" rx="1" fill="rgba(236,72,153,0.8)"/>
              <circle cx="710" cy="72" r="10" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.5)" strokeWidth="1.5"/>
              <text x="710" y="76" textAnchor="middle" fontSize="11" fill="white">✍️</text>
              <text x="710" y="148" textAnchor="middle" fontSize="8" fill="rgba(236,72,153,0.8)" fontFamily="monospace">Yazar</text>

              {/* === SUNUCU ODASI (sağ) === */}
              <rect x="795" y="60" width="90" height="100" rx="6" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5"/>
              <text x="840" y="78" textAnchor="middle" fontSize="7" fill="rgba(16,185,129,0.5)" fontFamily="monospace" letterSpacing="0.5">SUNUCU</text>
              {/* Raspberry Pi kutusu */}
              <rect x="810" y="85" width="60" height="36" rx="4" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
              <rect x="814" y="89" width="52" height="24" rx="2" fill="rgba(10,15,35,0.8)"/>
              <text x="840" y="104" textAnchor="middle" fontSize="7" fill="rgba(16,185,129,0.9)" fontFamily="monospace">Pi 5 · 8GB</text>
              {/* LED ışıkları */}
              {[0,1,2].map(i => (
                <circle key={i} cx={818+i*8} cy={130} r="2.5"
                  fill={i===0 ? "#10b981" : i===1 ? "#fbbf24" : "rgba(99,102,241,0.6)"}/>
              ))}
              <circle cx="840" cy="148" r="10" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5"/>
              <text x="840" y="152" textAnchor="middle" fontSize="11" fill="white">🛡️</text>
              <text x="840" y="168" textAnchor="middle" fontSize="7" fill="rgba(16,185,129,0.8)" fontFamily="monospace">Bekçi</text>

              {/* === Telegram baloncukları (sağ alt) === */}
              <rect x="40" y="165" width="160" height="20" rx="10" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.25)" strokeWidth="0.5"/>
              <text x="120" y="179" textAnchor="middle" fontSize="8.5" fill="rgba(200,210,255,0.8)" fontFamily="monospace">📬 3 yeni mail önemlendi</text>

              <rect x="230" y="165" width="170" height="20" rx="10" fill="rgba(20,184,166,0.1)" stroke="rgba(20,184,166,0.25)" strokeWidth="0.5"/>
              <text x="315" y="179" textAnchor="middle" fontSize="8.5" fill="rgba(180,240,230,0.8)" fontFamily="monospace">📅 Toplantı 15 dk sonra</text>

              <rect x="420" y="165" width="180" height="20" rx="10" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.25)" strokeWidth="0.5"/>
              <text x="510" y="179" textAnchor="middle" fontSize="8.5" fill="rgba(255,210,170,0.8)" fontFamily="monospace">📰 Sabah özeti hazır</text>

              <rect x="620" y="165" width="170" height="20" rx="10" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.5"/>
              <text x="705" y="179" textAnchor="middle" fontSize="8.5" fill="rgba(170,240,210,0.8)" fontFamily="monospace">🛡️ Pi: ✓ PC: ✓ Net: ✓</text>

              {/* Bağlantı çizgileri */}
              <line x1="140" y1="115" x2="390" y2="120" stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1="255" y1="110" x2="390" y2="115" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1="350" y1="110" x2="390" y2="115" stroke="rgba(20,184,166,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1="510" y1="110" x2="550" y2="115" stroke="rgba(249,115,22,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1="635" y1="105" x2="670" y2="105" stroke="rgba(236,72,153,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
              <line x1="750" y1="110" x2="795" y2="110" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
            </svg>
          </div>
          <div className="yzo-promo-body">
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div className="yzo-promo-badge">&#x1F4A1; KiSiSEL AI PROJESi</div>
              <h2 className="yzo-promo-title">Yapay Zeka Ofisi</h2>
              <p className="yzo-promo-sub">
                Raspberry Pi 5 &#252;zerinde tamamen yerel 7 ajanl&#305; ofis asistan&#305;.
                Bulut yok, abonelik yok, veri d&#305;&#351;ar&#305; &#231;&#305;km&#305;yor.
                Ayl&#305;k ek maliyet: 0 TL.
              </p>
              <div className="yzo-promo-tags">
                {['Gemma 3 12B', 'Raspberry Pi 5', 'Tailscale', 'Telegram', 'Pixel Ofis', '7 Ajan'].map(t => (
                  <span key={t} className="yzo-promo-tag">{t}</span>
                ))}
              </div>
              <span className="yzo-promo-cta">Projeyi &#304;ncele &#8594;</span>
            </div>
            <div className="yzo-promo-stats">
              <div className="yzo-promo-stat">
                <div className="yzo-promo-stat-val">7</div>
                <div className="yzo-promo-stat-lbl">Ajan</div>
              </div>
              <div className="yzo-promo-stat">
                <div className="yzo-promo-stat-val">0&#8202;TL</div>
                <div className="yzo-promo-stat-lbl">Ayl&#305;k Maliyet</div>
              </div>
              <div className="yzo-promo-stat">
                <div className="yzo-promo-stat-val">%100</div>
                <div className="yzo-promo-stat-lbl">Yerel</div>
              </div>
            </div>
          </div>
        </Link>
      </div>

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
              <DataCardBg href={tool.href} opacity={0.20} color={tool.accent} />
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
              <DataCardBg href={item.href} opacity={0.20} color={item.accent} />
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

      {/* Yapay Zeka Ofisi promo — KALDIRILDI, üstte gösteriliyor */}
      {false && <div className="v3-section" style={{ paddingTop: 0, paddingBottom: '32px' }}>
        <style>{`
          .yzo-promo-card-old {
            display: block; text-decoration: none; color: inherit;
            position: relative; overflow: hidden; border-radius: 20px;
            border: 1px solid rgba(99,102,241,0.3);
            background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(20,184,166,0.07) 100%);
            padding: 32px 36px;
            transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          }
          .yzo-promo-card:hover {
            border-color: rgba(99,102,241,0.55);
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .yzo-promo-inner {
            position: relative; z-index: 1;
            display: flex; align-items: center; justify-content: space-between;
            gap: 32px; flex-wrap: wrap;
          }
          .yzo-promo-badge {
            display: inline-block; padding: 3px 12px; border-radius: 999px; margin-bottom: 16px;
            background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
            font-size: 11px; font-weight: 700; color: #818cf8; letter-spacing: 0.05em;
          }
          .yzo-promo-title {
            font-size: clamp(22px,3.5vw,32px); font-weight: 800; margin: 0 0 10px;
            letter-spacing: -0.6px;
            background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 50%, #5eead4 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .v3-light .yzo-promo-title {
            background: linear-gradient(135deg, #1e293b 0%, #4f46e5 50%, #0d9488 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .yzo-promo-sub {
            font-size: 14px; color: var(--v3-text-muted); margin: 0 0 20px;
            line-height: 1.65; max-width: 480px;
          }
          .yzo-promo-tags { display: flex; gap: 8px; flex-wrap: wrap; }
          .yzo-promo-tag {
            padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
            background: rgba(99,102,241,0.1); color: #818cf8;
            border: 1px solid rgba(99,102,241,0.2);
          }
          .yzo-promo-emojis {
            display: grid; grid-template-columns: repeat(4, 44px); gap: 8px; margin-bottom: 12px;
          }
          .yzo-promo-emoji-box {
            width: 44px; height: 44px; border-radius: 12px;
            background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
            display: flex; align-items: center; justify-content: center; font-size: 20px;
          }
          .yzo-promo-cta {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
          }
          @media (max-width: 700px) {
            .yzo-promo-card { padding: 24px 20px; }
          }
        `}</style>
        <Link href="/yapay-zeka-ofisi" className="yzo-promo-card">
          <div className="yzo-promo-inner">
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div className="yzo-promo-badge">KisiSEL AI PROJESI</div>
              <h2 className="yzo-promo-title">Yapay Zeka Ofisi</h2>
              <p className="yzo-promo-sub">
                Raspberry Pi 5 üzerinde tamamen yerel 7 ajanlı ofis asistanı.
                Bulut yok, abonelik yok, veri dışarı çıkmıyor. Aylık ek maliyet: 0 TL.
              </p>
              <div className="yzo-promo-tags">
                {['Gemma 3 12B', 'Raspberry Pi 5', 'Tailscale', 'Telegram', 'Pixel Ofis'].map(t => (
                  <span key={t} className="yzo-promo-tag">{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div className="yzo-promo-emojis">
                {['\u{1F4EC}', '\u{1F4C5}', '\u{1F4CB}', '\u{1F4F0}', '\u{270D}', '\u{1F50D}', '\u{1F6E1}'].map((e, i) => (
                  <div key={i} className="yzo-promo-emoji-box">{e}</div>
                ))}
                <div className="yzo-promo-emoji-box" style={{ opacity: 0 }} />
              </div>
              <span className="yzo-promo-cta">Projeyi Incele</span>
            </div>
          </div>
        </Link>
      </div>}
    </>
  );
}
