'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── VERİ ───────────────────────────────────────────────────────────────────

const NODES = [
  { id: 'linear-reg',    href: '/yazilar/linear-regression',     label: 'Linear Regression',    kategori: 'ml',         seviye: 1 },
  { id: 'gradient',      href: '/yazilar/gradient-descent',       label: 'Gradient Descent',     kategori: 'ml',         seviye: 2 },
  { id: 'confusion',     href: '/yazilar/confusion-matrix',       label: 'Confusion Matrix',     kategori: 'ml',         seviye: 2 },
  { id: 'bias-var',      href: '/yazilar/bias-variance',          label: 'Bias-Variance',        kategori: 'ml',         seviye: 2 },
  { id: 'kmeans',        href: '/yazilar/kmeans',                 label: 'K-Means',              kategori: 'ml',         seviye: 2 },
  { id: 'decision-tree', href: '/yazilar/decision-tree',          label: 'Decision Tree',        kategori: 'ml',         seviye: 2 },
  { id: 'random-forest', href: '/yazilar/random-forest',          label: 'Random Forest',        kategori: 'ml',         seviye: 3 },
  { id: 'naive-bayes',   href: '/yazilar/naive-bayes',            label: 'Naive Bayes',          kategori: 'ml',         seviye: 2 },
  { id: 'sinir-agi',     href: '/yazilar/sinir-agi',              label: 'Sinir Ağı',            kategori: 'ml',         seviye: 3 },
  { id: 'ab-test',       href: '/yazilar/ab-test',                label: 'A/B Test',             kategori: 'istatistik', seviye: 2 },
  { id: 'sample-size',   href: '/yazilar/sample-size',            label: 'Sample Size',          kategori: 'istatistik', seviye: 1 },
  { id: 'clt',           href: '/yazilar/merkezi-limit-teoremi',  label: 'Merkezi Limit Teoremi',kategori: 'istatistik', seviye: 1 },
  { id: 'anscombe',      href: '/yazilar/anscombe',               label: "Anscombe'un Dörtlüsü", kategori: 'istatistik', seviye: 1 },
  { id: 'sql',           href: '/yazilar/sql-temelleri',          label: 'SQL Temelleri',        kategori: 'veri',       seviye: 1 },
  { id: 'pandas',        href: '/yazilar/pandas-7-sey',           label: 'Pandas',               kategori: 'veri',       seviye: 1 },
  { id: 'veri-temizleme',href: '/yazilar/veri-temizleme',         label: 'Veri Temizleme',       kategori: 'veri',       seviye: 1 },
  { id: 'feature-eng',   href: '/yazilar/feature-engineering',    label: 'Feature Engineering',  kategori: 'veri',       seviye: 2 },
  { id: 'etl',           href: '/yazilar/etl-nedir',              label: 'ETL',                  kategori: 'veri',       seviye: 2 },
  { id: 'dbt',           href: '/yazilar/dbt-nedir',              label: 'dbt',                  kategori: 'veri',       seviye: 3 },
  { id: 'cohort',        href: '/yazilar/cohort-analizi',         label: 'Cohort Analizi',       kategori: 'analiz',     seviye: 3 },
  { id: 'veri-ded',      href: '/yazilar/veri-dedektifi',         label: 'Veri Dedektifi',       kategori: 'analiz',     seviye: 2 },
  { id: 'izmir-kira',    href: '/yazilar/izmir-kira-analizi',     label: 'İzmir Kira Analizi',   kategori: 'analiz',     seviye: 2 },
  { id: 'superlig',      href: '/yazilar/superlig-xg',            label: 'Süperlig xG',          kategori: 'analiz',     seviye: 2 },
  { id: 'spotify',       href: '/yazilar/spotify-turkiye',        label: 'Spotify Türkiye',      kategori: 'analiz',     seviye: 2 },
  { id: 'yol-haritasi',  href: '/yazilar/yol-haritasi',           label: 'Yol Haritası',         kategori: 'kariyer',    seviye: 1 },
  { id: 'rol-farklari',  href: '/yazilar/rol-farklari',           label: 'Rol Farkları',         kategori: 'kariyer',    seviye: 1 },
  { id: 'portfolyo',     href: '/yazilar/portfolyo',              label: 'Portföy',              kategori: 'kariyer',    seviye: 2 },
  { id: 'linkedin',      href: '/yazilar/linkedin-profili',       label: 'LinkedIn Profili',     kategori: 'kariyer',    seviye: 2 },
];

const EDGES = [
  // ML zinciri
  ['linear-reg', 'gradient'],
  ['gradient', 'sinir-agi'],
  ['linear-reg', 'bias-var'],
  ['bias-var', 'decision-tree'],
  ['decision-tree', 'random-forest'],
  ['linear-reg', 'confusion'],
  ['confusion', 'bias-var'],
  ['kmeans', 'decision-tree'],
  // İstatistik
  ['clt', 'ab-test'],
  ['sample-size', 'ab-test'],
  ['ab-test', 'cohort'],
  // Veri
  ['pandas', 'veri-temizleme'],
  ['veri-temizleme', 'feature-eng'],
  ['feature-eng', 'linear-reg'],
  ['sql', 'etl'],
  ['etl', 'dbt'],
  ['sql', 'cohort'],
  // Analiz
  ['pandas', 'izmir-kira'],
  ['sql', 'superlig'],
  // Kariyer
  ['yol-haritasi', 'rol-farklari'],
  ['rol-farklari', 'portfolyo'],
  ['portfolyo', 'linkedin'],
];

const KAT_RENK = {
  ml:         { fill: '#1D9E75', bg: 'rgba(29,158,117,0.15)'  },
  istatistik: { fill: '#7F77DD', bg: 'rgba(127,119,221,0.15)' },
  veri:       { fill: '#185FA5', bg: 'rgba(24,95,165,0.15)'   },
  analiz:     { fill: '#e8a04a', bg: 'rgba(232,160,74,0.15)'  },
  kariyer:    { fill: '#BA7517', bg: 'rgba(186,117,23,0.15)'  },
};

const KAT_ETIKET = {
  ml:         'Makine Öğrenmesi',
  istatistik: 'İstatistik',
  veri:       'Veri',
  analiz:     'Analiz',
  kariyer:    'Kariyer',
};

const POSITIONS = {
  // ML grubu (sol-orta)
  'linear-reg':    { x: 120, y: 200 },
  'gradient':      { x: 120, y: 310 },
  'confusion':     { x: 230, y: 150 },
  'bias-var':      { x: 250, y: 260 },
  'kmeans':        { x: 230, y: 370 },
  'decision-tree': { x: 360, y: 300 },
  'random-forest': { x: 480, y: 310 },
  'naive-bayes':   { x: 370, y: 420 },
  'sinir-agi':     { x: 230, y: 450 },
  // İstatistik grubu (üst-orta)
  'clt':           { x: 450, y: 80  },
  'sample-size':   { x: 560, y: 80  },
  'ab-test':       { x: 510, y: 180 },
  'anscombe':      { x: 640, y: 80  },
  // Veri grubu (sağ)
  'sql':           { x: 700, y: 150 },
  'pandas':        { x: 700, y: 260 },
  'veri-temizleme':{ x: 700, y: 370 },
  'feature-eng':   { x: 580, y: 370 },
  'etl':           { x: 800, y: 200 },
  'dbt':           { x: 810, y: 310 },
  // Analiz (alt-orta)
  'cohort':        { x: 580, y: 460 },
  'veri-ded':      { x: 450, y: 460 },
  'izmir-kira':    { x: 700, y: 460 },
  'superlig':      { x: 810, y: 420 },
  'spotify':       { x: 810, y: 490 },
  // Kariyer (sol-üst)
  'yol-haritasi':  { x: 80,  y: 80  },
  'rol-farklari':  { x: 200, y: 60  },
  'portfolyo':     { x: 330, y: 60  },
  'linkedin':      { x: 450, y: 30  },
};

// ─── SAYFA ──────────────────────────────────────────────────────────────────

export default function GrafikPage() {
  const [hover, setHover] = useState(null);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Geri link */}
        <Link href="/" style={{ fontSize: '12px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Ana sayfa
        </Link>

        {/* Başlık */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 500,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            margin: '0 0 8px',
          }}>
            Bilgi Grafiği
          </h1>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '14px', margin: '0 0 20px' }}>
            Konular arası bağlantılar ve öğrenme yolları. Bir konunun üzerine gel ya da tıkla.
          </p>

          {/* Kategori legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(KAT_RENK).map(([kat, renk]) => (
              <div key={kat} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px', borderRadius: '999px',
                background: renk.bg,
                border: `0.5px solid ${renk.fill}40`,
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: renk.fill, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: renk.fill, fontWeight: 600 }}>
                  {KAT_ETIKET[kat]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Grafiği */}
        <div style={{
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          background: 'var(--color-cream-card)',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          <svg
            viewBox="0 0 860 530"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="Bilgi grafiği"
          >
            {/* Edges — node'lardan önce render edilmeli */}
            {EDGES.map(([from, to], i) => {
              const a = POSITIONS[from];
              const b = POSITIONS[to];
              if (!a || !b) return null;
              const isHover = hover === from || hover === to;
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y}
                  x2={b.x} y2={b.y}
                  stroke={isHover ? 'var(--color-accent)' : 'var(--color-border)'}
                  strokeWidth={isHover ? 2.5 : 1}
                  opacity={hover && !isHover ? 0.15 : isHover ? 0.9 : 0.55}
                  style={{ transition: 'all 0.15s ease' }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const pos = POSITIONS[node.id];
              if (!pos) return null;
              const renk = KAT_RENK[node.kategori];
              const isHov = hover === node.id;
              const isConnected = hover !== null && EDGES.some(([a, b]) =>
                (a === hover && b === node.id) || (b === hover && a === node.id)
              );
              const dimmed = hover !== null && !isHov && !isConnected;
              const r = isHov ? 19 : 13;

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => { window.location.href = node.href; }}
                  style={{
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                    opacity: dimmed ? 0.2 : 1,
                  }}
                >
                  {/* Glow halkası — hover'da */}
                  {isHov && (
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={28}
                      fill={renk.fill}
                      opacity={0.15}
                      style={{ transition: 'all 0.15s ease' }}
                    />
                  )}

                  {/* Ana daire */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={r}
                    fill={renk.fill}
                    opacity={isHov ? 1 : 0.88}
                    stroke={isHov ? '#fff' : 'none'}
                    strokeWidth={isHov ? 2 : 0}
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* Seviye göstergesi: seviye 1 → nokta yok, 3 → küçük beyaz halka içinde */}
                  {node.seviye >= 3 && (
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={4}
                      fill="rgba(255,255,255,0.55)"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Label */}
                  <text
                    x={pos.x}
                    y={pos.y + r + 13}
                    textAnchor="middle"
                    fontSize={isHov ? '10' : '9'}
                    fontWeight={isHov ? '600' : '400'}
                    fill={isHov ? 'var(--color-text)' : 'var(--color-text-soft)'}
                    fontFamily="var(--font-sans, system-ui, sans-serif)"
                    style={{ pointerEvents: 'none', userSelect: 'none', transition: 'all 0.15s ease' }}
                  >
                    {node.label.length > 16 ? node.label.slice(0, 15) + '…' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover bilgi kartı */}
        <div style={{
          minHeight: '52px',
          display: 'flex', alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-cream-card)',
          marginBottom: '24px',
          transition: 'all 0.15s ease',
        }}>
          {hover ? (() => {
            const node = NODES.find(n => n.id === hover);
            const renk = KAT_RENK[node.kategori];
            const baglantilar = EDGES
              .filter(([a, b]) => a === hover || b === hover)
              .map(([a, b]) => {
                const otherId = a === hover ? b : a;
                return NODES.find(n => n.id === otherId);
              })
              .filter(Boolean);
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: renk.fill }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{node.label}</span>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                    background: renk.bg, color: renk.fill, fontWeight: 600,
                  }}>{KAT_ETIKET[node.kategori]}</span>
                </div>
                {baglantilar.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Bağlantılı:</span>
                    {baglantilar.map(b => (
                      <span key={b.id} style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                        background: 'var(--color-border)', color: 'var(--color-text-soft)',
                      }}>{b.label}</span>
                    ))}
                  </div>
                )}
                <a href={node.href} style={{
                  marginLeft: 'auto', fontSize: '12px', fontWeight: 600,
                  color: renk.fill, textDecoration: 'none',
                  padding: '4px 12px', borderRadius: '8px',
                  background: renk.bg, flexShrink: 0,
                }}>
                  Konuya git →
                </a>
              </div>
            );
          })() : (
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              Bir konunun üzerine gelin — bağlantılar vurgulanır
            </span>
          )}
        </div>

        {/* Alt not */}
        <p style={{
          fontSize: '11px',
          color: 'var(--color-text-mute)',
          textAlign: 'right',
          margin: 0,
        }}>
          Oklar önkoşul veya ilişki bağlantısını gösterir
        </p>

      </div>
    </main>
  );
}
