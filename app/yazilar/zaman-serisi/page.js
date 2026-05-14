'use client';

import { useState, useMemo } from 'react';

// ── Yardımcı fonksiyonlar ──────────────────────────────────────────────────

function generateSeries({ trend, seasonality, noise, n = 36 }) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const trendVal = trend * i;
    const seasonVal = seasonality * Math.sin((2 * Math.PI * i) / 12 - Math.PI / 2);
    const noiseVal = (Math.random() - 0.5) * noise * 2;
    data.push(Math.max(0, 1000 + trendVal + seasonVal + noiseVal));
  }
  return data;
}

const SEED_DATA = [
  980, 920, 870, 950, 1060, 1150, 1220, 1180, 1090, 990, 900, 860,
  1010, 960, 910, 980, 1110, 1200, 1280, 1240, 1140, 1040, 950, 920,
  1060, 1010, 970, 1050, 1170, 1260, 1340, 1300, 1200, 1100, 1000, 980,
];

const AYLAR = ['O','Ş','M','N','M','H','T','A','E','E','K','A'];

function movingAverage(data, window) {
  return data.map((_, i) => {
    const half = Math.floor(window / 2);
    const start = Math.max(0, i - half);
    const end = Math.min(data.length - 1, i + half);
    const slice = data.slice(start, end + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function decompose(data) {
  const n = data.length;
  const period = 12;
  const trend = movingAverage(data, period);
  const detrended = data.map((v, i) => v - trend[i]);
  const seasonal = Array(period).fill(0).map((_, m) => {
    const vals = [];
    for (let i = m; i < n; i += period) vals.push(detrended[i]);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
  const seasonalFull = data.map((_, i) => seasonal[i % period]);
  const residual = data.map((v, i) => v - trend[i] - seasonalFull[i]);
  return { trend, seasonal: seasonalFull, residual };
}

// ── SVG Chart ─────────────────────────────────────────────────────────────

function LineChart({ series, colors, labels, height = 180, showDots = false, yLabel = '', xLabels = null }) {
  const W = 560, H = height;
  const PAD = { l: 52, r: 20, t: 16, b: 32 };
  const allVals = series.flat().filter(v => !isNaN(v) && isFinite(v));
  const yMin = Math.min(...allVals);
  const yMax = Math.max(...allVals);
  const yRange = yMax - yMin || 1;
  const n = series[0].length;

  const tx = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const ty = (v) => PAD.t + (1 - (v - yMin) / yRange) * (H - PAD.t - PAD.b);

  const path = (data) => data.map((v, i) =>
    isNaN(v) || !isFinite(v) ? '' : `${i === 0 || !isFinite(data[i-1]) ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`
  ).join(' ');

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + (yRange * i) / ticks);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {/* Grid */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} x2={W - PAD.r} y1={ty(v)} y2={ty(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={PAD.l - 6} y={ty(v) + 4} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{Math.round(v)}</text>
        </g>
      ))}
      {/* X labels */}
      {xLabels && xLabels.map((lbl, i) => (
        i % 3 === 0 && <text key={i} x={tx(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{lbl}</text>
      ))}
      {/* Lines */}
      {series.map((data, si) => (
        <g key={si}>
          <path d={path(data)} fill="none" stroke={colors[si]} strokeWidth={si === 0 ? 1.5 : 2.5} opacity={si === 0 ? 0.4 : 1} strokeLinejoin="round" strokeLinecap="round" />
          {showDots && data.map((v, i) => isFinite(v) && (
            <circle key={i} cx={tx(i)} cy={ty(v)} r="2.5" fill={colors[si]} opacity="0.8" />
          ))}
        </g>
      ))}
      {/* Y label */}
      {yLabel && <text x={10} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)" transform={`rotate(-90, 10, ${H / 2})`}>{yLabel}</text>}
    </svg>
  );
}

// ── Demo 1: Zaman Serisi İnşacısı ─────────────────────────────────────────

function Demo1Insaci() {
  const [trend, setTrend] = useState(15);
  const [seasonality, setSeasonality] = useState(150);
  const [noise, setNoise] = useState(50);
  const [seed, setSeed] = useState(1);

  const data = useMemo(() => {
    Math.random = ((s) => {
      let state = s;
      return () => { state = (state * 1664525 + 1013904223) & 0xffffffff; return (state >>> 0) / 0xffffffff; };
    })(seed * 999983 + trend * 31 + seasonality * 7 + noise * 13);
    return generateSeries({ trend, seasonality, noise });
  }, [trend, seasonality, noise, seed]);

  const xLbls = data.map((_, i) => AYLAR[i % 12] + (i < 12 ? '1' : i < 24 ? '2' : '3'));

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
        Zaman Serisi İnşacısı
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Trend gücü', val: trend, set: setTrend, min: 0, max: 40, step: 1, color: '#1D9E75', unit: '+' + trend + '/ay' },
          { label: 'Mevsimsellik', val: seasonality, set: setSeasonality, min: 0, max: 400, step: 10, color: '#7F77DD', unit: '±' + seasonality },
          { label: 'Gürültü', val: noise, set: setNoise, min: 0, max: 300, step: 10, color: '#e8a04a', unit: '±' + noise },
        ].map(({ label, val, set, min, max, step, color, unit }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => { set(+e.target.value); setSeed(s => s + 1); }}
              style={{ width: '100%', accentColor: color }} />
          </div>
        ))}
      </div>
      <LineChart series={[data]} colors={['#1D9E75']} height={160} xLabels={xLbls} yLabel="Satış" />
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
          Min: <strong style={{ color: 'var(--color-text)' }}>{Math.round(Math.min(...data))}</strong>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
          Max: <strong style={{ color: 'var(--color-text)' }}>{Math.round(Math.max(...data))}</strong>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
          Ort: <strong style={{ color: 'var(--color-text)' }}>{Math.round(data.reduce((a, b) => a + b, 0) / data.length)}</strong>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
          Son değer: <strong style={{ color: 'var(--color-text)' }}>{Math.round(data[data.length - 1])}</strong>
        </div>
      </div>
    </div>
  );
}

// ── Demo 2: Hareketli Ortalama ─────────────────────────────────────────────

function Demo2HareketliOrtalama() {
  const [window, setWindow] = useState(3);
  const smoothed = useMemo(() => movingAverage(SEED_DATA, window), [window]);
  const xLbls = SEED_DATA.map((_, i) => AYLAR[i % 12] + (i < 12 ? '1' : i < 24 ? '2' : '3'));

  const noiseReduction = useMemo(() => {
    const origStd = Math.sqrt(SEED_DATA.reduce((a, v) => a + (v - SEED_DATA.reduce((x, y) => x + y) / SEED_DATA.length) ** 2, 0) / SEED_DATA.length);
    const smoothStd = Math.sqrt(smoothed.reduce((a, v) => a + (v - smoothed.reduce((x, y) => x + y) / smoothed.length) ** 2, 0) / smoothed.length);
    return Math.round((1 - smoothStd / origStd) * 100);
  }, [smoothed]);

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
        Hareketli Ortalama (Moving Average)
      </div>
      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
        Gri: orijinal seri · Mavi: {window} aylık hareketli ortalama
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>Pencere boyutu</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#7F77DD', fontFamily: 'var(--font-mono)' }}>
              {window} ay
            </span>
          </div>
          <input type="range" min={1} max={12} step={1} value={window}
            onChange={e => setWindow(+e.target.value)}
            style={{ width: '100%', accentColor: '#7F77DD' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '3px' }}>
            <span>1 ay (ham)</span><span>6 ay</span><span>12 ay (yıllık)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="card" style={{ padding: '10px 14px', textAlign: 'center', minWidth: '80px' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#7F77DD' }}>{noiseReduction}%</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '2px' }}>gürültü azalması</div>
          </div>
        </div>
      </div>
      <LineChart
        series={[SEED_DATA, smoothed]}
        colors={['var(--color-text-mute)', '#7F77DD']}
        height={160}
        xLabels={xLbls}
        yLabel="Satış"
      />
      {window >= 12 && (
        <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: '#7F77DD18', fontSize: '12px', color: '#7F77DD' }}>
          12 aylık pencerede mevsimsellik tamamen silinir — sadece trend kalır.
        </div>
      )}
    </div>
  );
}

// ── Demo 3: Ayrıştırma ────────────────────────────────────────────────────

function Demo3Ayristirma() {
  const { trend, seasonal, residual } = useMemo(() => decompose(SEED_DATA), []);
  const xLbls = SEED_DATA.map((_, i) => AYLAR[i % 12] + (i < 12 ? '1' : i < 24 ? '2' : '3'));

  const charts = [
    { label: 'Orijinal', data: SEED_DATA, color: '#1D9E75', desc: 'Ham gözlemlenen veri' },
    { label: 'Trend', data: trend, color: '#e8a04a', desc: 'Uzun vadeli yön (12 aylık MA)' },
    { label: 'Mevsimsellik', data: seasonal, color: '#7F77DD', desc: 'Tekrarlayan yıllık örüntü' },
    { label: 'Artık (Residual)', data: residual, color: '#E24B4A', desc: 'Açıklanamayan gürültü' },
  ];

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
        Ayrıştırma: Orijinal = Trend + Mevsimsellik + Artık
      </div>
      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '20px' }}>
        Bir zaman serisi birbirinden bağımsız üç bileşene ayrılır.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {charts.map(({ label, data, color, desc }) => (
          <div key={label}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color }}>{label}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{desc}</span>
            </div>
            <LineChart series={[data]} colors={[color]} height={100} xLabels={xLbls} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '8px', background: '#1D9E7518', fontSize: '12px', color: 'var(--color-text-soft)', lineHeight: '1.6' }}>
        <strong style={{ color: 'var(--color-text)' }}>Toplam doğrulama:</strong> Trend + Mevsimsellik + Artık = Orijinal. Bu yaklaşıma <strong>toplamalı (additive) ayrıştırma</strong> denir. Mevsimsellik genlikleri zamanla büyüyorsa <strong>çarpımsal (multiplicative)</strong> model tercih edilir.
      </div>
    </div>
  );
}

// ── Demo 4: Basit Tahmin ──────────────────────────────────────────────────

function Demo4Tahmin() {
  const [horizon, setHorizon] = useState(6);

  const forecast = useMemo(() => {
    const n = SEED_DATA.length;
    const xs = Array.from({ length: n }, (_, i) => i);
    const meanX = xs.reduce((a, b) => a + b) / n;
    const meanY = SEED_DATA.reduce((a, b) => a + b) / n;
    const slope = xs.reduce((acc, x, i) => acc + (x - meanX) * (SEED_DATA[i] - meanY), 0) /
                  xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0);
    const intercept = meanY - slope * meanX;

    const residuals = SEED_DATA.map((v, i) => v - (intercept + slope * i));
    const resStd = Math.sqrt(residuals.reduce((a, b) => a + b ** 2, 0) / n);

    const seasonal = Array(12).fill(0).map((_, m) => {
      const vals = SEED_DATA.filter((_, i) => i % 12 === m);
      const trend_vals = vals.map((v, j) => intercept + slope * (m + j * 12));
      return vals.reduce((a, v, j) => a + v - trend_vals[j], 0) / vals.length;
    });

    const points = Array.from({ length: horizon }, (_, i) => {
      const idx = n + i;
      const trendVal = intercept + slope * idx;
      const seasonVal = seasonal[idx % 12];
      return {
        point: trendVal + seasonVal,
        upper: trendVal + seasonVal + 1.96 * resStd,
        lower: trendVal + seasonVal - 1.96 * resStd,
      };
    });
    return { points, slope };
  }, [horizon]);

  const allData = [...SEED_DATA, ...forecast.points.map(p => p.point)];
  const upperBand = [...Array(SEED_DATA.length).fill(NaN), ...forecast.points.map(p => p.upper)];
  const lowerBand = [...Array(SEED_DATA.length).fill(NaN), ...forecast.points.map(p => p.lower)];
  const xLbls = allData.map((_, i) => AYLAR[i % 12] + (i < 12 ? '1' : i < 24 ? '2' : i < 36 ? '3' : '4'));

  const W = 560, H = 180;
  const PAD = { l: 52, r: 20, t: 16, b: 32 };
  const allVals = [...SEED_DATA, ...upperBand.filter(isFinite), ...lowerBand.filter(isFinite)];
  const yMin = Math.min(...allVals) - 20;
  const yMax = Math.max(...allVals) + 20;
  const yRange = yMax - yMin;
  const n = allData.length;
  const tx = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const ty = (v) => PAD.t + (1 - (v - yMin) / yRange) * (H - PAD.t - PAD.b);
  const splitX = tx(SEED_DATA.length - 1);

  const linePath = (data) => data.map((v, i) =>
    !isFinite(v) ? '' : `${i === 0 || !isFinite(data[i - 1]) ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`
  ).join(' ');

  const bandPath = () => {
    const fwdUp = upperBand.map((v, i) => [i, v]).filter(([, v]) => isFinite(v));
    const fwdLo = lowerBand.map((v, i) => [i, v]).filter(([, v]) => isFinite(v));
    if (!fwdUp.length) return '';
    const up = fwdUp.map(([i, v]) => `${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' L');
    const lo = [...fwdLo].reverse().map(([i, v]) => `${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' L');
    return `M ${up} L ${lo} Z`;
  };

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
        Basit Tahmin (Trend + Mevsimsellik)
      </div>
      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
        Gölgeli alan: %95 güven aralığı · Kesikli: tahmin bölgesi
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>Tahmin ufku</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#E24B4A', fontFamily: 'var(--font-mono)' }}>{horizon} ay</span>
          </div>
          <input type="range" min={1} max={12} step={1} value={horizon}
            onChange={e => setHorizon(+e.target.value)}
            style={{ width: '100%', accentColor: '#E24B4A' }} />
        </div>
        <div className="card" style={{ padding: '10px 14px', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#E24B4A' }}>
            {forecast.slope > 0 ? '+' : ''}{Math.round(forecast.slope)}/ay
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '2px' }}>trend hızı</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        {Array.from({ length: 5 }, (_, i) => {
          const v = yMin + (yRange * i) / 4;
          return (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={ty(v)} y2={ty(v)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <text x={PAD.l - 6} y={ty(v) + 4} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{Math.round(v)}</text>
            </g>
          );
        })}
        {xLbls.map((lbl, i) => i % 3 === 0 && (
          <text key={i} x={tx(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{lbl}</text>
        ))}
        {/* Tahmin bölgesi arka planı */}
        <rect x={splitX} y={PAD.t} width={W - PAD.r - splitX} height={H - PAD.t - PAD.b} fill="#E24B4A" opacity="0.04" />
        <line x1={splitX} y1={PAD.t} x2={splitX} y2={H - PAD.b} stroke="#E24B4A" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        {/* Güven bandı */}
        <path d={bandPath()} fill="#E24B4A" opacity="0.15" />
        {/* Orijinal seri */}
        <path d={linePath(SEED_DATA)} fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinejoin="round" />
        {/* Tahmin */}
        <path
          d={(() => {
            const pts = forecast.points.map((p, i) => [SEED_DATA.length - 1 + i, i === 0 ? SEED_DATA[SEED_DATA.length - 1] : p.point]);
            return pts.map(([i, v], idx) => `${idx === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
          })()}
          fill="none" stroke="#E24B4A" strokeWidth="2" strokeDasharray="5 3" strokeLinejoin="round"
        />
        <text x={splitX + 6} y={PAD.t + 12} fontSize="9" fill="#E24B4A" opacity="0.8">tahmin →</text>
      </svg>
      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-mute)' }}>
        Tahmin ufku arttıkça güven aralığı genişler — belirsizlik birikir.
      </div>
    </div>
  );
}

// ── Makale ────────────────────────────────────────────────────────────────

function Kutucuk({ baslik, children, renk = '#1D9E75' }) {
  return (
    <div style={{ borderLeft: `3px solid ${renk}`, paddingLeft: '14px', marginBottom: '24px' }}>
      {baslik && <div style={{ fontSize: '11px', fontWeight: 700, color: renk, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '6px' }}>{baslik}</div>}
      <div style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: '1.7' }}>{children}</div>
    </div>
  );
}

function Tanim({ terim, children }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', minWidth: '120px', paddingTop: '2px' }}>{terim}</div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.6', flex: 1 }}>{children}</div>
    </div>
  );
}

export default function ZamanSerisi() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-12">
      <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
      <span className="badge badge-interactive inline-block mb-3">interaktif</span>

      <h1 className="font-serif" style={{ fontSize: '2.2rem', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '1rem' }}>
        Zaman serisi analizi: trendi, mevsimi, gürültüyü ayır
      </h1>

      <p style={{ fontSize: '17px', color: 'var(--color-text-soft)', lineHeight: '1.75', marginBottom: '2rem' }}>
        Veri sadece sayılardan ibaret değil — o sayıların <em>ne zaman</em> ölçüldüğü de anlam taşır. Zaman serisi analizi tam da bunu yapar: zamanın içinde saklı örüntüleri ortaya çıkarır.
      </p>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Bir zaman serisi nedir?
      </h2>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Belirli zaman aralıklarında ölçülen her veri bir zaman serisidir. Borsa kapanış fiyatları, aylık satış rakamları, saatlik sıcaklık ölçümleri, günlük web sitesi ziyaretleri — hepsi birer zaman serisi.
      </p>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '2rem' }}>
        Normal regresyondan farkı şu: gözlemler birbirinden bağımsız değil. Bugünkü satış rakamı, dünkünden etkilenir. Bu <strong style={{ color: 'var(--color-text)' }}>otokorelasyon</strong> özelliği, zaman serilerini özel bir alan yapar.
      </p>

      <Demo1Insaci />

      <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '2rem', marginTop: '-8px' }}>
        Kaydırıcıları hareket ettirerek trend, mevsimsellik ve gürültünün seriye nasıl katkıda bulunduğunu gözlemle.
      </p>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Üç temel bileşen
      </h2>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Herhangi bir zaman serisi, birbiriyle iç içe geçmiş üç bileşenden oluşur:
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <Tanim terim="Trend (T)">Uzun vadeli yön. Satışlar genel olarak artıyor mu, azalıyor mu, sabit mi? Mevsimsel iniş çıkışları yok sayarak bakıldığında görünen yapı.</Tanim>
        <Tanim terim="Mevsimsellik (S)">Periyodik ve tahmin edilebilir örüntüler. Yazın artan dondurma satışı, Ramazan'da değişen alışveriş davranışı, Cuma günleri düşen ofis trafiği.</Tanim>
        <Tanim terim="Artık / Residual (R)">Trend ve mevsimsellik çıkarıldıktan sonra kalan kısım. Açıklanamayan gürültü, ani şoklar, model hataları.</Tanim>
      </div>

      <Kutucuk baslik="Toplamalı model">
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--color-text)' }}>Y(t) = T(t) + S(t) + R(t)</code>
        <br /><br />
        Mevsimsel dalgalanmalar sabit genlikte kalıyorsa toplamalı model uygundur. Genlik zamanla büyüyorsa çarpımsal model (<code>Y = T × S × R</code>) veya önce log dönüşümü uygulanır.
      </Kutucuk>

      <Demo3Ayristirma />

      <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '2rem', marginTop: '-8px' }}>
        Üst grafikteki orijinal seri, alttaki üç grafiğin toplamına eşittir.
      </p>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Hareketli ortalama: gürültüyü sil
      </h2>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Hareketli ortalama (moving average), her noktayı komşularının ortalamasıyla değiştirir. Pencere büyüdükçe seri düzleşir — ama gecikme de artar.
      </p>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        12 aylık pencere özellikle güçlüdür: yıllık döngüyü tam olarak kapatır ve mevsimselliği tamamen siler. Geriye sadece trend kalır.
      </p>

      <Demo2HareketliOrtalama />

      <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '2rem', marginTop: '-8px' }}>
        Pencere boyutunu 12'ye getirdiğinde mavi çizginin neredeyse düz bir trend hattına dönüştüğünü gözlemle.
      </p>

      <Kutucuk baslik="Pratik kural" renk="#7F77DD">
        Periyodik seri için pencere boyutunu tam döngü uzunluğuna eşit seç. Aylık veri için 12, haftalık veri için 52, günlük veri için 7. Bu sayede MA mevsimselliği filtreler.
      </Kutucuk>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Basit tahmin
      </h2>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        En basit tahmin yöntemi: geçmişteki trendi uzat, mevsimselliği ekle. Bu yaklaşım <strong style={{ color: 'var(--color-text)' }}>naive decomposition forecasting</strong> olarak bilinir.
      </p>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Tahmin ufku uzadıkça belirsizlik birikir — bu nedenle güven aralığı genişler. 1 aylık tahmin oldukça güvenilirken, 12 aylık tahmin çok daha geniş bir hata payı taşır.
      </p>

      <Demo4Tahmin />

      <Kutucuk baslik="Uyarı" renk="#E24B4A">
        Bu demo doğrusal trend + sabit mevsimsellik varsayar. Gerçek dünyada ARIMA, SARIMA, Prophet veya LSTM gibi modeller çok daha karmaşık örüntüleri yakalayabilir.
      </Kutucuk>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Durağanlık (Stationarity)
      </h2>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Çoğu zaman serisi modeli (ARIMA dahil) seriyi <strong style={{ color: 'var(--color-text)' }}>durağan</strong> olmak üzere varsayar: ortalama ve varyansın zamanla değişmediği durum.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { baslik: 'Durağan değil', items: ['Yükselen/düşen trend var', 'Mevsimsellik var', 'Varyans zamanla artıyor'], color: '#E24B4A', bg: '#E24B4A18' },
          { baslik: 'Durağan hale getirmek için', items: ['1. fark al: ∆y = y(t) - y(t-1)', 'Log dönüşümü uygula', 'Mevsimsel fark al'], color: '#1D9E75', bg: '#1D9E7518' },
        ].map(({ baslik, items, color, bg }) => (
          <div key={baslik} style={{ padding: '14px', borderRadius: '10px', background: bg }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color, marginBottom: '8px' }}>{baslik}</div>
            {items.map(item => (
              <div key={item} style={{ fontSize: '12px', color: 'var(--color-text-soft)', lineHeight: '1.7' }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
        Durağanlığı test etmek için <strong style={{ color: 'var(--color-text)' }}>ADF (Augmented Dickey-Fuller)</strong> veya <strong style={{ color: 'var(--color-text)' }}>KPSS</strong> testleri kullanılır. Python'da ikisi de <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#7F77DD' }}>statsmodels</code> paketinde hazır gelir.
      </p>

      <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2rem 0' }} />

      <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem' }}>
        Sonraki adımlar
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
        {[
          { konu: 'ARIMA', aciklama: 'Otoregresif model. p, d, q parametreleri.', renk: '#1D9E75' },
          { konu: 'SARIMA', aciklama: 'ARIMA + mevsimsel bileşen. Aylık/yıllık veri için standart.', renk: '#7F77DD' },
          { konu: 'Prophet', aciklama: "Meta'nın açık kaynak kütüphanesi. Tatil efektleri dahil..", renk: '#e8a04a' },
          { konu: 'LSTM', aciklama: 'Derin öğrenme tabanlı. Karmaşık örüntüleri öğrenir.', renk: '#E24B4A' },
        ].map(({ konu, aciklama, renk }) => (
          <div key={konu} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '8px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: renk, fontFamily: 'var(--font-mono)', minWidth: '60px' }}>{konu}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-soft)' }}>{aciklama}</div>
          </div>
        ))}
      </div>

    </article>
  );
}
