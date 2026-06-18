'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { yazilar } from '../../lib/icerikler';

// ─── YARDIMCI ────────────────────────────────────────────────────────────────
function shortLabel(baslik) {
  const colon = baslik.indexOf(':');
  const s = colon > 1 ? baslik.slice(0, colon).trim() : baslik;
  return s.length > 20 ? s.slice(0, 19) + '…' : s;
}

// ─── MANUEL KONUMLar ─────────────────────────────────────────────────────────
// href → { kategori, seviye, x, y }
// Buraya girmeyen yazilar itemları SVG altında otomatik görünür.

const MANUAL_META = {
  // ML
  '/yazilar/linear-regression':     { kategori: 'ml',         seviye: 1, x: 120, y: 200 },
  '/yazilar/gradient-descent':      { kategori: 'ml',         seviye: 2, x: 120, y: 310 },
  '/yazilar/confusion-matrix':      { kategori: 'ml',         seviye: 2, x: 230, y: 150 },
  '/yazilar/bias-variance':         { kategori: 'ml',         seviye: 2, x: 250, y: 260 },
  '/yazilar/kmeans':                { kategori: 'ml',         seviye: 2, x: 230, y: 370 },
  '/yazilar/decision-tree':         { kategori: 'ml',         seviye: 2, x: 360, y: 300 },
  '/yazilar/random-forest':         { kategori: 'ml',         seviye: 3, x: 480, y: 310 },
  '/yazilar/naive-bayes':           { kategori: 'ml',         seviye: 2, x: 370, y: 420 },
  '/yazilar/lojistik-regresyon':    { kategori: 'ml',         seviye: 2, x: 360, y: 185 },
  '/yazilar/sinir-agi':             { kategori: 'ml',         seviye: 3, x: 230, y: 450 },
  // İstatistik
  '/yazilar/merkezi-limit-teoremi': { kategori: 'istatistik', seviye: 1, x: 450, y: 80  },
  '/yazilar/sample-size':           { kategori: 'istatistik', seviye: 1, x: 560, y: 80  },
  '/yazilar/ab-test':               { kategori: 'istatistik', seviye: 2, x: 510, y: 180 },
  '/yazilar/anscombe':              { kategori: 'istatistik', seviye: 1, x: 640, y: 80  },
  '/yazilar/z-skor':                { kategori: 'istatistik', seviye: 1, x: 390, y: 130 },
  '/yazilar/bezier':                { kategori: 'istatistik', seviye: 2, x: 640, y: 165 },
  // Veri
  '/yazilar/sql-join-gorsellestirici': { kategori: 'veri',    seviye: 2, x: 700, y: 60  },
  '/yazilar/sql-temelleri':         { kategori: 'veri',       seviye: 1, x: 700, y: 150 },
  '/yazilar/pandas-7-sey':          { kategori: 'veri',       seviye: 1, x: 700, y: 260 },
  '/yazilar/veri-temizleme':        { kategori: 'veri',       seviye: 1, x: 700, y: 370 },
  '/yazilar/feature-engineering':   { kategori: 'veri',       seviye: 2, x: 580, y: 370 },
  '/yazilar/etl-nedir':             { kategori: 'veri',       seviye: 2, x: 800, y: 200 },
  '/yazilar/dbt-nedir':             { kategori: 'veri',       seviye: 3, x: 810, y: 310 },
  '/yazilar/cloud-rehberi':         { kategori: 'veri',       seviye: 2, x: 910, y: 160 },
  '/yazilar/bi-karsilastirma':      { kategori: 'veri',       seviye: 1, x: 910, y: 280 },
  // Analiz
  '/yazilar/cohort-analizi':        { kategori: 'analiz',     seviye: 3, x: 580, y: 460 },
  '/yazilar/veri-dedektifi':        { kategori: 'analiz',     seviye: 2, x: 450, y: 460 },
  '/yazilar/izmir-kira-analizi':    { kategori: 'analiz',     seviye: 2, x: 700, y: 460 },
  '/yazilar/superlig-xg':           { kategori: 'analiz',     seviye: 2, x: 810, y: 420 },
  '/yazilar/spotify-turkiye':       { kategori: 'analiz',     seviye: 2, x: 810, y: 490 },
  '/yazilar/deprem-analizi':        { kategori: 'analiz',     seviye: 1, x: 910, y: 450 },
  '/yazilar/churn-tahmini':        { kategori: 'analiz',     seviye: 2, x: 450, y: 555 },
  '/yazilar/kredi-shap':           { kategori: 'analiz',     seviye: 2, x: 580, y: 555 },
  '/yazilar/banka-fraud':          { kategori: 'analiz',     seviye: 2, x: 700, y: 555 },
  '/yazilar/sepet-terki':          { kategori: 'analiz',     seviye: 2, x: 580, y: 640 },
  '/yazilar/sosyal-medya-turkiye': { kategori: 'analiz',     seviye: 2, x: 710, y: 640 },
  '/yazilar/doviz-altin-tahmini':  { kategori: 'analiz',     seviye: 2, x: 840, y: 640 },
  // Veri
  '/yazilar/pandas-referans':      { kategori: 'veri',       seviye: 1, x: 820, y: 370 },
  // Kariyer
  '/yazilar/yol-haritasi':          { kategori: 'kariyer',    seviye: 1, x: 80,  y: 80  },
  '/yazilar/rol-farklari':          { kategori: 'kariyer',    seviye: 1, x: 200, y: 60  },
  '/yazilar/portfolyo':             { kategori: 'kariyer',    seviye: 2, x: 330, y: 60  },
  '/yazilar/linkedin-profili':      { kategori: 'kariyer',    seviye: 2, x: 450, y: 30  },
  '/yazilar/ilk-90-gun':            { kategori: 'kariyer',    seviye: 1, x: 80,  y: 170 },
  '/yazilar/mulakat-sql':           { kategori: 'kariyer',    seviye: 2, x: 330, y: 155 },
};

// Yazilar'da olmayan ama kendine ait sayfası bulunan ekstra node'lar
const EXTRA_NODES = [
  { href: '/yazilar/cohort-analizi', label: 'Cohort Analizi' },
];

// ─── BAĞLANTILAR (slug ID kullanır) ──────────────────────────────────────────
const EDGES = [
  // ML
  ['linear-regression',    'gradient-descent'],
  ['gradient-descent',     'sinir-agi'],
  ['linear-regression',    'bias-variance'],
  ['bias-variance',        'decision-tree'],
  ['decision-tree',        'random-forest'],
  ['linear-regression',    'confusion-matrix'],
  ['confusion-matrix',     'bias-variance'],
  ['kmeans',               'decision-tree'],
  ['linear-regression',    'lojistik-regresyon'],
  ['lojistik-regresyon',   'confusion-matrix'],
  ['lojistik-regresyon',   'bias-variance'],
  // İstatistik
  ['merkezi-limit-teoremi','ab-test'],
  ['sample-size',          'ab-test'],
  ['ab-test',              'cohort-analizi'],
  ['z-skor',               'merkezi-limit-teoremi'],
  ['z-skor',               'ab-test'],
  ['bezier',               'anscombe'],
  // Veri
  ['pandas-7-sey',         'veri-temizleme'],
  ['veri-temizleme',       'feature-engineering'],
  ['feature-engineering',  'linear-regression'],
  ['sql-temelleri',        'sql-join-gorsellestirici'],
  ['sql-join-gorsellestirici', 'mulakat-sql'],
  ['sql-temelleri',        'etl-nedir'],
  ['etl-nedir',            'dbt-nedir'],
  ['sql-temelleri',        'cohort-analizi'],
  ['cloud-rehberi',        'etl-nedir'],
  ['cloud-rehberi',        'dbt-nedir'],
  ['bi-karsilastirma',     'sql-temelleri'],
  // Analiz
  ['pandas-7-sey',         'izmir-kira-analizi'],
  ['sql-temelleri',        'superlig-xg'],
  ['deprem-analizi',       'pandas-7-sey'],
  ['deprem-analizi',       'izmir-kira-analizi'],
  ['confusion-matrix',     'churn-tahmini'],
  ['decision-tree',        'churn-tahmini'],
  ['confusion-matrix',     'kredi-shap'],
  ['decision-tree',        'kredi-shap'],
  ['churn-tahmini',        'banka-fraud'],
  ['kredi-shap',           'banka-fraud'],
  ['churn-tahmini',        'sepet-terki'],
  ['ab-test',              'sepet-terki'],
  ['deprem-analizi',       'sosyal-medya-turkiye'],
  ['spotify-turkiye',      'sosyal-medya-turkiye'],
  ['linear-regression',    'doviz-altin-tahmini'],
  ['feature-engineering',  'doviz-altin-tahmini'],
  ['izmir-kira-analizi',   'doviz-altin-tahmini'],
  // Veri
  ['pandas-7-sey',         'pandas-referans'],
  ['veri-temizleme',       'pandas-referans'],
  // Kariyer
  ['yol-haritasi',         'rol-farklari'],
  ['rol-farklari',         'portfolyo'],
  ['portfolyo',            'linkedin-profili'],
  ['ilk-90-gun',           'yol-haritasi'],
  ['ilk-90-gun',           'rol-farklari'],
  ['mulakat-sql',          'sql-temelleri'],
  ['mulakat-sql',          'portfolyo'],
];

// ─── RENK & ETİKET ───────────────────────────────────────────────────────────
const KAT_RENK = {
  ml:         { fill: '#1D9E75', bg: 'rgba(29,158,117,0.15)'  },
  istatistik: { fill: '#7F77DD', bg: 'rgba(127,119,221,0.15)' },
  veri:       { fill: '#185FA5', bg: 'rgba(24,95,165,0.15)'   },
  analiz:     { fill: '#e8a04a', bg: 'rgba(232,160,74,0.15)'  },
  kariyer:    { fill: '#BA7517', bg: 'rgba(186,117,23,0.15)'  },
};
const KAT_ETIKET = {
  ml: 'Makine Öğrenmesi', istatistik: 'İstatistik',
  veri: 'Veri', analiz: 'Analiz', kariyer: 'Kariyer',
};

// ─── NODE & POSİSYON HESAPLAMA ───────────────────────────────────────────────
function getAutoKategori(y) {
  if (y.badge === 'vaka çalışması' || y.kategori === 'vaka') return 'analiz';
  if (y.badge === 'kariyer'        || y.kategori === 'kariyer') return 'kariyer';
  if (y.badge === 'rehber'         || y.kategori === 'rehber') return 'veri';
  if (y.badge === 'araç'           || y.kategori === 'arac') return 'veri';
  return 'ml';
}

// ─── SAYFA ──────────────────────────────────────────────────────────────────
export default function GrafikPage({ getHref = href => href }) {
  const [hover, setHover] = useState(null);

  const { nodes, positions, overflowNodes } = useMemo(() => {
    const seen = new Set();
    const allNodes = [];

    // yazilar'dan /yazilar/* olanları ekle
    yazilar
      .filter(y => y.href.startsWith('/yazilar/'))
      .forEach(y => {
        const slug = y.href.split('/').filter(Boolean).pop();
        if (seen.has(slug)) return;
        seen.add(slug);
        const meta = MANUAL_META[y.href];
        allNodes.push({
          id: slug, href: y.href,
          label: meta?.label || shortLabel(y.baslik),
          kategori: meta?.kategori || getAutoKategori(y),
          seviye: meta?.seviye || 1,
          positioned: !!meta,
        });
      });

    // Extra node'lar (yazilar'da olmayanlar)
    EXTRA_NODES.forEach(e => {
      const slug = e.href.split('/').filter(Boolean).pop();
      if (seen.has(slug)) return;
      seen.add(slug);
      const meta = MANUAL_META[e.href];
      if (meta) {
        allNodes.push({
          id: slug, href: e.href, label: e.label,
          kategori: meta.kategori, seviye: meta.seviye, positioned: true,
        });
      }
    });

    const positionedNodes = allNodes.filter(n => n.positioned);
    const overflowNodes   = allNodes.filter(n => !n.positioned);

    // Pozisyon map'i
    const positions = {};
    positionedNodes.forEach(n => {
      const meta = MANUAL_META[n.href];
      if (meta) positions[n.id] = { x: meta.x, y: meta.y };
    });

    // Overflow: SVG altında otomatik yerleştir
    const OY = 555, OX = 60, STEP = 88, PER_ROW = 10;
    overflowNodes.forEach((n, i) => {
      positions[n.id] = {
        x: OX + (i % PER_ROW) * STEP,
        y: OY + Math.floor(i / PER_ROW) * 72,
      };
    });

    return { nodes: allNodes, positions, overflowNodes };
  }, []);

  const overflowRows = Math.ceil(overflowNodes.length / 10);
  const svgH = overflowNodes.length > 0 ? 720 + overflowRows * 72 : 695;
  const svgW = 960;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>

        <Link href="/" style={{ fontSize: '12px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Ana sayfa
        </Link>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 500, color: 'var(--color-text)', letterSpacing: '-0.01em', lineHeight: 1.2, margin: '0 0 8px' }}>
            Bilgi Grafiği
          </h1>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '14px', margin: '0 0 16px' }}>
            {nodes.length} konu · konular arası bağlantılar ve öğrenme yolları
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(KAT_RENK).map(([kat, renk]) => (
              <div key={kat} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: renk.bg, border: `0.5px solid ${renk.fill}40` }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: renk.fill, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: renk.fill, fontWeight: 600 }}>{KAT_ETIKET[kat]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG */}
        <div style={{ borderRadius: '16px', border: '1px solid var(--color-border)', background: 'var(--color-cream-card)', overflow: 'hidden', marginBottom: '16px' }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Bilgi grafiği">

            {/* Edges */}
            {EDGES.map(([from, to], i) => {
              const a = positions[from], b = positions[to];
              if (!a || !b) return null;
              const isHover = hover === from || hover === to;
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isHover ? 'var(--color-accent)' : 'var(--color-border)'}
                  strokeWidth={isHover ? 2.5 : 1}
                  opacity={hover && !isHover ? 0.12 : isHover ? 0.9 : 0.5}
                  style={{ transition: 'all 0.15s' }}
                />
              );
            })}

            {/* Overflow divider */}
            {overflowNodes.length > 0 && (
              <>
                <line x1={40} y1={535} x2={svgW - 40} y2={535} stroke="var(--color-border)" strokeWidth="0.8" strokeDasharray="4 4" />
                <text x={48} y={549} fontSize="10" fill="var(--color-text-faint)" fontFamily="var(--font-sans, system-ui)">
                  Henüz konumlandırılmamış içerikler
                </text>
              </>
            )}

            {/* Nodes */}
            {nodes.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;
              const renk = KAT_RENK[node.kategori] || KAT_RENK.analiz;
              const isHov = hover === node.id;
              const isConnected = hover !== null && EDGES.some(([a, b]) =>
                (a === hover && b === node.id) || (b === hover && a === node.id)
              );
              const dimmed = hover !== null && !isHov && !isConnected;
              const r = isHov ? 19 : 13;
              const isOverflow = !node.positioned;

              return (
                <g key={node.id}
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => { window.location.href = getHref(node.href); }}
                  style={{ cursor: 'pointer', transition: 'opacity 0.15s', opacity: dimmed ? 0.18 : 1 }}
                >
                  {isHov && (
                    <circle cx={pos.x} cy={pos.y} r={28} fill={renk.fill} opacity={0.15} />
                  )}
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={isOverflow ? 'none' : renk.fill}
                    stroke={renk.fill}
                    strokeWidth={isOverflow ? 1.5 : (isHov ? 2 : 0)}
                    strokeDasharray={isOverflow ? '3 2' : 'none'}
                    opacity={isHov ? 1 : isOverflow ? 0.7 : 0.88}
                    style={{ transition: 'all 0.15s' }}
                  />
                  {node.seviye >= 3 && !isOverflow && (
                    <circle cx={pos.x} cy={pos.y} r={4} fill="rgba(255,255,255,0.55)" style={{ pointerEvents: 'none' }} />
                  )}
                  <text x={pos.x} y={pos.y + r + 13}
                    textAnchor="middle"
                    fontSize={isHov ? '10' : '9'}
                    fontWeight={isHov ? '600' : '400'}
                    fill={isHov ? 'var(--color-text)' : 'var(--color-text-soft)'}
                    fontFamily="var(--font-sans, system-ui, sans-serif)"
                    style={{ pointerEvents: 'none', userSelect: 'none', transition: 'all 0.15s' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover bilgi kartı */}
        <div style={{ minHeight: '52px', display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', marginBottom: '24px', transition: 'all 0.15s' }}>
          {hover ? (() => {
            const node = nodes.find(n => n.id === hover);
            if (!node) return null;
            const renk = KAT_RENK[node.kategori] || KAT_RENK.analiz;
            const baglantilar = EDGES
              .filter(([a, b]) => a === hover || b === hover)
              .map(([a, b]) => nodes.find(n => n.id === (a === hover ? b : a)))
              .filter(Boolean);
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: renk.fill }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{node.label}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: renk.bg, color: renk.fill, fontWeight: 600 }}>{KAT_ETIKET[node.kategori]}</span>
                </div>
                {baglantilar.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Bağlantılı:</span>
                    {baglantilar.map(b => (
                      <span key={b.id} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'var(--color-border)', color: 'var(--color-text-soft)' }}>{b.label}</span>
                    ))}
                  </div>
                )}
                <a href={getHref(node.href)} style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: renk.fill, textDecoration: 'none', padding: '4px 12px', borderRadius: '8px', background: renk.bg, flexShrink: 0 }}>
                  Konuya git →
                </a>
              </div>
            );
          })() : (
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              Bir konunun üzerine gel — bağlantılar vurgulanır
            </span>
          )}
        </div>

        <p style={{ fontSize: '11px', color: 'var(--color-text-mute)', textAlign: 'right', margin: 0 }}>
          Kesik çizgi daire = henüz konumlandırılmamış · Oklar önkoşul veya ilişki bağlantısını gösterir
        </p>

      </div>
    </main>
  );
}
