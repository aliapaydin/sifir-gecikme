'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── TARİHSEL VERİ (Ocak 2023 – Mayıs 2025, aylık kapanış yaklaşımı) ────────
const HISTORICAL = [
  { t: '2023-01', usd: 18.85, altin: 1075 },
  { t: '2023-02', usd: 18.92, altin: 1130 },
  { t: '2023-03', usd: 19.02, altin: 1200 },
  { t: '2023-04', usd: 19.47, altin: 1290 },
  { t: '2023-05', usd: 23.70, altin: 1420 },
  { t: '2023-06', usd: 25.98, altin: 1620 },
  { t: '2023-07', usd: 26.87, altin: 1710 },
  { t: '2023-08', usd: 26.99, altin: 1715 },
  { t: '2023-09', usd: 26.97, altin: 1680 },
  { t: '2023-10', usd: 27.25, altin: 1740 },
  { t: '2023-11', usd: 28.84, altin: 1920 },
  { t: '2023-12', usd: 29.51, altin: 2000 },
  { t: '2024-01', usd: 30.28, altin: 2060 },
  { t: '2024-02', usd: 31.25, altin: 2230 },
  { t: '2024-03', usd: 32.02, altin: 2450 },
  { t: '2024-04', usd: 32.38, altin: 2620 },
  { t: '2024-05', usd: 32.71, altin: 2720 },
  { t: '2024-06', usd: 32.87, altin: 2740 },
  { t: '2024-07', usd: 33.17, altin: 2820 },
  { t: '2024-08', usd: 33.48, altin: 2970 },
  { t: '2024-09', usd: 34.05, altin: 3040 },
  { t: '2024-10', usd: 34.28, altin: 3150 },
  { t: '2024-11', usd: 34.41, altin: 3100 },
  { t: '2024-12', usd: 35.02, altin: 3260 },
  { t: '2025-01', usd: 36.08, altin: 3680 },
  { t: '2025-02', usd: 37.43, altin: 3900 },
  { t: '2025-03', usd: 38.50, altin: 4250 },
  { t: '2025-04', usd: 39.30, altin: 4700 },
  { t: '2025-05', usd: 40.17, altin: 4900 },
];

// ─── ML ARAÇLARI ─────────────────────────────────────────────────────────────

function mean(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; }
function std(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}
function pearson(a, b) {
  const ma = mean(a), mb = mean(b), sa = std(a), sb = std(b);
  const cov = a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0) / a.length;
  return cov / (sa * sb);
}
function rmse(actual, pred) {
  return Math.sqrt(actual.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0) / actual.length);
}
function mape(actual, pred) {
  return actual.reduce((s, v, i) => s + Math.abs((v - pred[i]) / v), 0) / actual.length * 100;
}

// OLS lineer regresyon: X (n×m), y (n) → beta (m)
function ols(X, y) {
  const n = X.length, m = X[0].length;
  // X'X
  const XtX = Array.from({ length: m }, () => Array(m).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < m; j++)
      for (let k = 0; k < n; k++) XtX[i][j] += X[k][i] * X[k][j];
  // X'y
  const Xty = Array(m).fill(0);
  for (let i = 0; i < m; i++)
    for (let k = 0; k < n; k++) Xty[i] += X[k][i] * y[k];
  // Gauss eliminasyonu
  const A = XtX.map((row, i) => [...row, Xty[i]]);
  for (let p = 0; p < m; p++) {
    let max = p;
    for (let r = p + 1; r < m; r++) if (Math.abs(A[r][p]) > Math.abs(A[max][p])) max = r;
    [A[p], A[max]] = [A[max], A[p]];
    const pv = A[p][p];
    if (Math.abs(pv) < 1e-12) continue;
    for (let r = 0; r < m; r++) {
      if (r === p) continue;
      const f = A[r][p] / pv;
      for (let c = p; c <= m; c++) A[r][c] -= f * A[p][c];
    }
  }
  return A.map((row, i) => row[m] / row[i]);
}

// Lag feature matrisi oluştur
function buildFeatures(series, lags = 3) {
  const X = [], y = [];
  for (let i = lags; i < series.length; i++) {
    const row = [1]; // bias
    for (let l = 1; l <= lags; l++) row.push(series[i - l]);
    row.push(i); // trend
    X.push(row);
    y.push(series[i]);
  }
  return { X, y };
}

// Log-lineer model (TRY varlıkları için çok daha iyi)
function buildLogFeatures(series, lags = 3) {
  const logSeries = series.map(v => Math.log(v));
  const { X, y } = buildFeatures(logSeries, lags);
  return { X, y, logSeries };
}

// Modelleri eğit ve forecast üret
function runModels(series, horizon = 6) {
  const n = series.length;
  const LAGS = 3;

  // — Naive —
  const naiveForecast = [];
  let naivePrev = series[n - 1];
  for (let h = 0; h < horizon; h++) { naiveForecast.push(naivePrev); }

  // — SMA3 —
  const smaForecast = [];
  let smaWindow = [...series.slice(-3)];
  for (let h = 0; h < horizon; h++) {
    const next = mean(smaWindow);
    smaForecast.push(next);
    smaWindow = [...smaWindow.slice(1), next];
  }

  // — Log-Lineer Regresyon (lag1, lag2, lag3, trend) —
  const { X, y, logSeries } = buildLogFeatures(series, LAGS);
  const beta = ols(X, y);
  const logRegForecast = [];
  let logWindow = [...logSeries.slice(-LAGS)];
  for (let h = 0; h < horizon; h++) {
    const row = [1, ...logWindow, n + h];
    const logPred = row.reduce((s, v, i) => s + v * beta[i], 0);
    logRegForecast.push(Math.exp(logPred));
    logWindow = [...logWindow.slice(1), logPred];
  }

  // — Backtesting (son 6 ay) —
  const testSize = Math.min(6, Math.floor(n * 0.2));
  const trainSeries = series.slice(0, n - testSize);
  const testSeries = series.slice(n - testSize);

  // Naive backtest
  const naiveBT = testSeries.map((_, i) => trainSeries[trainSeries.length - 1 + i] ?? trainSeries[trainSeries.length - 1]);
  // Gerçek naive: her adımda önceki gerçek değer
  const naiveBT2 = [series[n - testSize - 1], ...testSeries.slice(0, testSize - 1)];

  // Log-reg backtest
  const { X: Xtr, y: ytr, logSeries: logTr } = buildLogFeatures(trainSeries, LAGS);
  const betaBT = ols(Xtr, ytr);
  const regBT = [];
  let logWinBT = [...logTr.slice(-LAGS)];
  for (let h = 0; h < testSize; h++) {
    const row = [1, ...logWinBT, trainSeries.length + h];
    const lp = row.reduce((s, v, i) => s + v * betaBT[i], 0);
    regBT.push(Math.exp(lp));
    logWinBT = [...logWinBT.slice(1), lp];
  }

  // Hata metrikleri
  const metrics = {
    naive: { rmse: rmse(testSeries, naiveBT2), mape: mape(testSeries, naiveBT2) },
    sma: { rmse: rmse(testSeries, smaForecast.slice(0, testSize)), mape: mape(testSeries, smaForecast.slice(0, testSize)) },
    logReg: { rmse: rmse(testSeries, regBT), mape: mape(testSeries, regBT) },
  };

  // Güven aralığı: backtest hatalarının std'si
  const regErrors = testSeries.map((v, i) => Math.abs(v - regBT[i]));
  const errStd = std(regErrors) || mean(regErrors) * 0.1;
  const ci = logRegForecast.map((v, h) => ({
    lo: v - errStd * (1 + h * 0.2),
    hi: v + errStd * (1 + h * 0.2),
  }));

  return { naiveForecast, smaForecast, logRegForecast, metrics, testSeries, regBT, ci };
}

function addMonths(ymStr, n) {
  const [y, m] = ymStr.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function fmtMonth(ym) {
  const [y, m] = ym.split('-');
  const months = ['', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${months[+m]} ${y.slice(2)}`;
}
function fmtNum(n, d = 0) {
  if (n == null) return '—';
  return n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
}

// ─── SVG GRAFİKLERİ ──────────────────────────────────────────────────────────

function LineChart({ series, width = 640, height = 260, colors, labels, yLabel, showCI, ciLo, ciHi }) {
  const PAD = { t: 16, r: 20, b: 40, l: 72 };
  const W = width - PAD.l - PAD.r;
  const H = height - PAD.t - PAD.b;

  const allVals = [...series.flatMap(s => s.data), ...(ciLo || []), ...(ciHi || [])].filter(v => v != null);
  const minV = Math.min(...allVals) * 0.95;
  const maxV = Math.max(...allVals) * 1.05;

  const px = (i, totalLen) => (i / (totalLen - 1)) * W + PAD.l;
  const py = v => H - ((v - minV) / (maxV - minV)) * H + PAD.t;

  // Y gridlines
  const ticks = 5;
  const ys = Array.from({ length: ticks }, (_, i) => minV + (maxV - minV) * i / (ticks - 1));

  const totalLen = series[0]?.data.length ?? 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {/* Grid */}
      {ys.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} x2={PAD.l + W} y1={py(v)} y2={py(v)} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
          <text x={PAD.l - 6} y={py(v) + 4} textAnchor="end" fontSize="10" fill="var(--color-text-mute)">
            {v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* CI shading */}
      {showCI && ciLo && ciHi && (() => {
        const hiPts = ciHi.map((v, i) => `${px(totalLen - 1 + i, totalLen + ciHi.length)},${py(v)}`).join(' ');
        const loPts = [...ciLo].reverse().map((v, i) => `${px(totalLen - 1 + ciLo.length - 1 - i, totalLen + ciLo.length)},${py(v)}`).join(' ');
        return <polygon points={`${hiPts} ${loPts}`} fill="rgba(99,102,241,0.12)" />;
      })()}

      {/* Lines */}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => v != null ? `${px(i, totalLen)},${py(v)}` : null).filter(Boolean);
        return (
          <g key={si}>
            <polyline points={pts.join(' ')} fill="none" stroke={colors[si]} strokeWidth={s.dashed ? 1.5 : 2.5} strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinecap="round" strokeLinejoin="round" opacity={s.dim ? 0.55 : 1} />
            {s.data.map((v, i) => v != null && s.dots && (
              <circle key={i} cx={px(i, totalLen)} cy={py(v)} r={3} fill={colors[si]} />
            ))}
          </g>
        );
      })}

      {/* X axis labels — every 3 months */}
      {series[0]?.labels?.map((lbl, i) => i % 3 === 0 && (
        <text key={i} x={px(i, totalLen)} y={height - PAD.b + 16} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{lbl}</text>
      ))}

      {/* Y label */}
      {yLabel && (
        <text x={14} y={PAD.t + H / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)" transform={`rotate(-90, 14, ${PAD.t + H / 2})`}>{yLabel}</text>
      )}

      {/* Legend */}
      {labels?.map((lbl, i) => (
        <g key={i} transform={`translate(${PAD.l + i * 130}, ${height - 8})`}>
          <line x1={0} x2={20} y1={0} y2={0} stroke={colors[i]} strokeWidth={2.5} strokeDasharray={series[i]?.dashed ? '4 3' : undefined} />
          <text x={24} y={4} fontSize="10" fill="var(--color-text-mute)">{lbl}</text>
        </g>
      ))}
    </svg>
  );
}

function ScatterPlot({ xData, yData, xLabel, yLabel, color }) {
  const PAD = { t: 16, r: 16, b: 40, l: 56 };
  const W = 320 - PAD.l - PAD.r, H = 260 - PAD.t - PAD.b;
  const minX = Math.min(...xData) * 0.98, maxX = Math.max(...xData) * 1.02;
  const minY = Math.min(...yData) * 0.98, maxY = Math.max(...yData) * 1.02;
  const px = v => ((v - minX) / (maxX - minX)) * W + PAD.l;
  const py = v => H - ((v - minY) / (maxY - minY)) * H + PAD.t;
  const r = pearson(xData, yData);
  // Regression line
  const mx = mean(xData), my = mean(yData), sx = std(xData), sy = std(yData);
  const slope = r * sy / sx;
  const intercept = my - slope * mx;
  const x1 = minX, x2 = maxX;
  return (
    <svg viewBox="0 0 320 260" style={{ width: '100%', height: 'auto' }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={PAD.l} x2={PAD.l + W} y1={PAD.t + (1 - f) * H} y2={PAD.t + (1 - f) * H} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      <line x1={px(x1)} y1={py(slope * x1 + intercept)} x2={px(x2)} y2={py(slope * x2 + intercept)} stroke={color} strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
      {xData.map((x, i) => (
        <circle key={i} cx={px(x)} cy={py(yData[i])} r={4} fill={color} opacity="0.65" />
      ))}
      <text x={PAD.l + W / 2} y={255} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">{xLabel}</text>
      <text x={12} y={PAD.t + H / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)" transform={`rotate(-90, 12, ${PAD.t + H / 2})`}>{yLabel}</text>
      <text x={PAD.l + W - 4} y={PAD.t + 12} textAnchor="end" fontSize="11" fontWeight="700" fill={color}>r = {r.toFixed(3)}</text>
    </svg>
  );
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────

export default function DovizAltinTahmini() {
  const [live, setLive] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [horizon, setHorizon] = useState(6);
  const [asset, setAsset] = useState('usd'); // 'usd' | 'altin'
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetch('/api/doviz')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setLive(d); setLiveLoading(false); })
      .catch(() => setLiveLoading(false));
  }, []);

  // Canlı fiyatı son veri noktasına ekle
  const fullData = [...HISTORICAL];
  if (live) {
    const lastT = HISTORICAL[HISTORICAL.length - 1].t;
    const nextT = addMonths(lastT, 1);
    if (live.USDTRY && live.goldTRYgram) {
      fullData.push({ t: nextT, usd: live.USDTRY, altin: live.goldTRYgram, isLive: true });
    }
  }

  const usdSeries = fullData.map(d => d.usd);
  const altinSeries = fullData.map(d => d.altin);
  const labels = fullData.map(d => fmtMonth(d.t));
  const series = asset === 'usd' ? usdSeries : altinSeries;

  // ML modelleri çalıştır
  const { naiveForecast, smaForecast, logRegForecast, metrics, testSeries, regBT, ci } = runModels(series, horizon);
  const forecastLabels = Array.from({ length: horizon }, (_, i) => fmtMonth(addMonths(fullData[fullData.length - 1].t, i + 1)));
  const allLabels = [...labels, ...forecastLabels];

  // Grafik verileri
  const padNull = (arr, before) => [...Array(before).fill(null), ...arr];
  const chartSeries = [
    { data: [...series, ...Array(horizon).fill(null)], dots: false },
    { data: padNull([...Array(series.length - 1).fill(null), series[series.length - 1], ...naiveForecast], 0), dashed: true, dim: true },
    { data: padNull([...Array(series.length - 1).fill(null), series[series.length - 1], ...smaForecast], 0), dashed: true, dim: true },
    { data: padNull([...Array(series.length - 1).fill(null), series[series.length - 1], ...logRegForecast], 0), dots: false },
  ];
  const ciLoChart = [series[series.length - 1], ...ci.map(c => c.lo)];
  const ciHiChart = [series[series.length - 1], ...ci.map(c => c.hi)];

  const bestModel = Object.entries(metrics).sort((a, b) => a[1].mape - b[1].mape)[0];
  const lastVal = series[series.length - 1];
  const forecast6 = logRegForecast[horizon - 1];
  const changeP = ((forecast6 - lastVal) / lastVal * 100).toFixed(1);

  // Korelasyon değişim serileri
  const usdChanges = usdSeries.slice(1).map((v, i) => (v - usdSeries[i]) / usdSeries[i] * 100);
  const altinChanges = altinSeries.slice(1).map((v, i) => (v - altinSeries[i]) / altinSeries[i] * 100);
  const corrLevel = pearson(usdSeries, altinSeries);
  const corrChange = pearson(usdChanges, altinChanges);

  const S = {
    card: {
      background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
      borderRadius: '16px', padding: '24px 28px', marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '20px', fontWeight: 700, color: 'var(--color-text)',
      margin: '0 0 8px', letterSpacing: '-0.3px',
    },
    sub: { fontSize: '14px', color: 'var(--color-text-mute)', margin: '0 0 20px', lineHeight: 1.6 },
    label: { fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
  };

  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <style>{`
        .fg-badge { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;borderRadius:999px;fontSize:12px;fontWeight:600; }
        .fg-chip { padding:6px 14px;borderRadius:8px;border:'1px solid var(--color-border)';fontSize:13px;fontWeight:500;cursor:pointer;transition:all .15s;background:var(--color-cream-card);color:var(--color-text-mute); }
        .fg-chip.active { background:var(--color-accent-soft);color:var(--color-accent);border-color:var(--color-accent); }
        .fg-slider { width:100%;accentColor:'var(--color-accent)'; }
        .fg-metric { background:var(--color-cream);border:0.5px solid var(--color-border);borderRadius:12px;padding:14px 18px; }
        @media (max-width:600px) { .fg-grid-3{grid-template-columns:1fr!important;} }
      `}</style>

      {/* ─── BAŞLIK ─── */}
      <a href="/icerikler" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-mute)', textDecoration: 'none', marginBottom: '20px' }}>← İçerikler</a>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(20,184,166,0.1)', color: '#14b8a6', fontSize: '11px', fontWeight: 700 }}>İNTERAKTİF</span>
          <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontSize: '11px', fontWeight: 700 }}>ML</span>
          <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(249,115,22,0.1)', color: '#f97316', fontSize: '11px', fontWeight: 700 }}>CANLI VERİ</span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
          Döviz & Altın:<br />Korelasyondan Tahminine
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-text-mute)', lineHeight: 1.65, maxWidth: '640px', margin: 0 }}>
          Gerçek zamanlı döviz ve altın verileriyle korelasyon analizi yap, makine öğrenmesi modellerini karşılaştır, ileriye dönük tahmin üret. Sistem her sayfa açılışında güncel fiyatlarla çalışır.
        </p>
      </div>

      {/* ─── CANLI FİYATLAR ─── */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(20,184,166,0.04))', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ ...S.sectionTitle, margin: 0 }}>📊 Canlı Piyasa</h2>
          {live && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
              {live.isFallback ? '⚠ Yaklaşık değerler' : `✓ ${new Date(live.fetchedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} güncellendi`}
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { label: 'USD / TRY', val: live?.USDTRY, icon: '🇺🇸', color: '#6366f1', suffix: '₺', dec: 2 },
            { label: 'EUR / TRY', val: live?.EURTRY, icon: '🇪🇺', color: '#14b8a6', suffix: '₺', dec: 2 },
            { label: 'GBP / TRY', val: live?.GBPTRY, icon: '🇬🇧', color: '#8b5cf6', suffix: '₺', dec: 2 },
            { label: 'Altın (g/TRY)', val: live?.goldTRYgram, icon: '🥇', color: '#f59e0b', suffix: '₺', dec: 0 },
          ].map(({ label, val, icon, color, suffix, dec }) => (
            <div key={label} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{icon} {label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color, letterSpacing: '-0.5px' }}>
                {liveLoading ? <span style={{ opacity: 0.4 }}>—</span> : val ? `${suffix}${fmtNum(val, dec)}` : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TARİHSEL TREND ─── */}
      <div style={S.card}>
        <h2 style={S.sectionTitle}>📈 Tarihsel Trend (2023 – Günümüz)</h2>
        <p style={S.sub}>Aylık kapanış değerleri. Canlı fiyat son nokta olarak ekleniyor.</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[{ id: 'usd', label: '🇺🇸 USD/TRY' }, { id: 'altin', label: '🥇 Altın (g/TRY)' }].map(({ id, label }) => (
            <button key={id} onClick={() => setAsset(id)}
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                borderColor: asset === id ? 'var(--color-accent)' : 'var(--color-border)',
                background: asset === id ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                color: asset === id ? 'var(--color-accent)' : 'var(--color-text-mute)',
              }}>
              {label}
            </button>
          ))}
        </div>
        <LineChart
          series={[{ data: fullData.map((d, i) => ({ x: i, v: asset === 'usd' ? d.usd : d.altin })).map(p => p.v), dots: fullData.length < 20, labels }]}
          labels={labels}
          colors={[asset === 'usd' ? '#6366f1' : '#f59e0b']}
          yLabel={asset === 'usd' ? 'USD/TRY' : '₺/gram'}
        />
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: 'var(--color-amber-bg)', border: '0.5px solid var(--color-border)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--color-amber-text)' }}>Neden üstel büyüme?</strong>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '4px 0 0', lineHeight: 1.55 }}>
            TRY varlıkları enflasyon + kur erimesi etkisiyle doğrusal değil, <strong>üstel</strong> büyüme gösterir.
            Bu yüzden ML modellerimiz log-dönüşüm kullanır: log(fiyat) yaklaşık doğrusal trend izler,
            bu da tahmin doğruluğunu önemli ölçüde artırır.
          </p>
        </div>
      </div>

      {/* ─── KORELASYON ANALİZİ ─── */}
      <div style={S.card}>
        <h2 style={S.sectionTitle}>🔗 Korelasyon Analizi</h2>
        <p style={S.sub}>Altın ile dolar arasındaki ilişkiyi iki farklı perspektiften inceleyelim: seviye korelasyonu ve aylık değişim korelasyonu.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="fg-grid-3">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Seviye Korelasyonu</div>
            <ScatterPlot xData={usdSeries} yData={altinSeries} xLabel="USD/TRY" yLabel="Altın ₺/g" color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Aylık Değişim Korelasyonu (%)</div>
            <ScatterPlot xData={usdChanges} yData={altinChanges} xLabel="Δ USD/TRY (%)" yLabel="Δ Altın (%)" color="#f59e0b" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }} className="fg-grid-3">
          {[
            { label: 'Seviye Korelasyonu (r)', val: corrLevel.toFixed(3), color: '#6366f1', desc: 'USD/TRY ve Altın/TRY mutlak seviyeleri' },
            { label: 'Değişim Korelasyonu (r)', val: corrChange.toFixed(3), color: '#f59e0b', desc: 'Aylık yüzde değişimler arası' },
          ].map(({ label, val, color, desc }) => (
            <div key={label} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--color-correct-bg)', border: '0.5px solid var(--color-correct-border)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--color-correct-text)' }}>💡 Yorum</strong>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '6px 0 0', lineHeight: 1.6 }}>
            <strong>Seviye korelasyonu</strong> {corrLevel > 0.9 ? 'çok yüksek' : 'yüksek'} ({corrLevel.toFixed(2)}) — ikisi de TRY değer kaybından aynı anda etkileniyor, ama bu <em>sahte korelasyon</em> (spurious correlation) içerebilir.
            <br />
            <strong>Değişim korelasyonu</strong> ({corrChange.toFixed(2)}) daha anlamlı: altın, TRY'nin değer kaybedeceği aylarda dolar kadar mı hareketleniyor? {corrChange > 0.7 ? 'Güçlü' : corrChange > 0.4 ? 'Orta düzey' : 'Zayıf'} bir ilişki görünüyor.
          </p>
        </div>
      </div>

      {/* ─── FEATURE ENGINEERING ─── */}
      <div style={S.card}>
        <h2 style={S.sectionTitle}>🛠️ Feature Engineering</h2>
        <p style={S.sub}>Model "ham" fiyatı değil, geçmişten türetilen <strong>özellikleri</strong> kullanır. İşte modelimize giren değişkenler:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { name: 'Lag-1 (t−1)', icon: '⏮️', desc: 'Geçen ay değeri — en güçlü sinyal' },
            { name: 'Lag-2 (t−2)', icon: '⏮️', desc: '2 ay önceki değer' },
            { name: 'Lag-3 (t−3)', icon: '⏮️', desc: '3 ay önceki değer' },
            { name: 'Trend (t)', icon: '📈', desc: 'Zaman indeksi — genel yön' },
            { name: 'Bias (1)', icon: '⚓', desc: 'Sabit terim (intercept)' },
            { name: 'Log transform', icon: '🔢', desc: 'Tüm değerlere log() uygulanır' },
          ].map(f => (
            <div key={f.name} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>{f.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: 'var(--color-purple-bg)', border: '0.5px solid rgba(139,92,246,0.2)' }}>
          <strong style={{ fontSize: '13px', color: 'var(--color-purple-text)' }}>Neden log dönüşümü?</strong>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '4px 0 0', lineHeight: 1.55 }}>
            Lineer regresyon <em>katkısal değişimleri</em> modellemek için tasarlanmıştır. Oysa kur ve altın <em>çarpımsal büyür</em> — %10'luk artış bugün 3 TL iken gelecek yıl 4 TL anlamına gelir. log(fiyat) bu ölçek sorununu giderir, artıklar (residuals) daha homojen dağılır ve RMSE düşer.
          </p>
        </div>
      </div>

      {/* ─── ML TAHMİN ─── */}
      <div style={S.card}>
        <h2 style={S.sectionTitle}>🤖 Model Karşılaştırması & Forecast</h2>
        <p style={S.sub}>4 model eğitildi, son {Math.min(6, Math.floor(series.length * 0.2))} ay üzerinde backtesting yapıldı. Tahmin ufkunu seçin:</p>

        {/* Kontroller */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[{ id: 'usd', label: '🇺🇸 USD' }, { id: 'altin', label: '🥇 Altın' }].map(({ id, label }) => (
              <button key={id} onClick={() => setAsset(id)}
                style={{ padding: '5px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
                  borderColor: asset === id ? 'var(--color-accent)' : 'var(--color-border)',
                  background: asset === id ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                  color: asset === id ? 'var(--color-accent)' : 'var(--color-text-mute)',
                }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>Ufuk: <strong style={{ color: 'var(--color-accent)' }}>{horizon} ay</strong></span>
            <input type="range" min={1} max={12} value={horizon} onChange={e => setHorizon(+e.target.value)} className="fg-slider" />
          </div>
        </div>

        {/* Forecast grafiği */}
        <LineChart
          series={chartSeries}
          colors={['var(--color-accent)', '#94a3b8', '#f59e0b', '#10b981']}
          labels={allLabels}
          yLabel={asset === 'usd' ? 'USD/TRY' : '₺/gram'}
          showCI
          ciLo={ciLoChart}
          ciHi={ciHiChart}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
          <span><span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>——</span> Gerçek</span>
          <span><span style={{ color: '#94a3b8' }}>- -</span> Naive</span>
          <span><span style={{ color: '#f59e0b' }}>- -</span> SMA-3</span>
          <span><span style={{ color: '#10b981', fontWeight: 700 }}>——</span> Log-Lineer Regresyon</span>
          <span><span style={{ background: 'rgba(99,102,241,0.15)', padding: '0 4px' }}>░</span> %80 güven aralığı</span>
        </div>

        {/* Metrikler */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '10px' }}>Backtest Sonuçları (son {Math.min(6, Math.floor(series.length * 0.2))} ay)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(metrics).map(([key, m]) => {
              const names = { naive: '⏮ Naive', sma: '📊 SMA-3', logReg: '🤖 Log-Reg' };
              const isBest = key === bestModel[0];
              return (
                <div key={key} style={{
                  background: isBest ? 'var(--color-correct-bg)' : 'var(--color-cream)',
                  border: isBest ? '1px solid var(--color-correct-border)' : '0.5px solid var(--color-border)',
                  borderRadius: '10px', padding: '12px 14px',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isBest ? 'var(--color-correct-text)' : 'var(--color-text)', marginBottom: '6px' }}>
                    {names[key]} {isBest && '✓ En İyi'}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div><div style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>RMSE</div><div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{m.rmse.toFixed(1)}</div></div>
                    <div><div style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>MAPE</div><div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>%{m.mape.toFixed(1)}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Özet tahmin */}
        <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.06))', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '6px' }}>Log-Lineer Regresyon — {horizon} Aylık Tahmin</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>
              {asset === 'usd' ? '₺' : '₺'}{fmtNum(forecast6, asset === 'usd' ? 2 : 0)}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: +changeP > 0 ? '#f59e0b' : '#10b981' }}>
              {+changeP > 0 ? '+' : ''}{changeP}%
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              mevcut: {asset === 'usd' ? '₺' : '₺'}{fmtNum(lastVal, asset === 'usd' ? 2 : 0)} → {fmtMonth(addMonths(fullData[fullData.length - 1].t, horizon))}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '8px' }}>
            %80 güven aralığı: <strong>{asset === 'usd' ? '₺' : '₺'}{fmtNum(ci[horizon - 1]?.lo, asset === 'usd' ? 1 : 0)}</strong> – <strong>{asset === 'usd' ? '₺' : '₺'}{fmtNum(ci[horizon - 1]?.hi, asset === 'usd' ? 1 : 0)}</strong>
          </div>
        </div>
      </div>

      {/* ─── NASIL ÇALIŞIR ─── */}
      <div style={S.card}>
        <h2 style={S.sectionTitle}>📚 Sistem Nasıl Çalışır?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              title: '1. Canlı Veri Akışı',
              body: 'Sayfa her açıldığında sunucu tarafı API route\'umuz open.er-api.com (döviz) ve api.metals.live (altın spot) kaynaklarından güncel fiyatları çeker. Sonuçlar 30 dakika önbelleğe alınır. USD/gram altın TRY\'ye şu formülle dönüştürülür: (XAU/USD ÷ 31.1035) × USD/TRY.',
            },
            {
              title: '2. Veri Birleştirme',
              body: 'Ocak 2023\'ten bu yana aylık kapanış değerleri gömülü (hardcoded). Canlı fiyat bu serinin sonuna yeni bir nokta olarak eklenir — bu sayede model her zaman en güncel değerden tahmin yapar.',
            },
            {
              title: '3. Log-Lineer Regresyon Modeli',
              body: 'Seçilen varlığın (USD/TRY veya altın) log dönüşümü alınır. Özellikler: [1, log(t-1), log(t-2), log(t-3), trend_index]. OLS (Ordinary Least Squares) kapalı form çözümü: β = (XᵀX)⁻¹Xᵀy. Tahminler geri exp() ile dönüştürülür.',
            },
            {
              title: '4. Backtesting ve Metrikler',
              body: "Model son 6 ayda test edilir: son 6 ay hariç tüm veri ile eğitim yapılır, 6 ay için yürüyen tahmin (walk-forward) üretilir. RMSE: tahmin hatalarının karekök ortalaması. MAPE: mutlak yüzde hata ortalaması — ortalama olarak gerçeğin %X kadar sapıyoruz anlamına gelir.",
            },
            {
              title: '5. Güven Aralığı',
              body: 'Backtesting residuallarının (gerçek - tahmin) standart sapması hesaplanır. İleriki adımlarda belirsizlik arttığı için her h adımda aralık genişler: ±std × (1 + 0.2h). Bu yaklaşık bir %80 güven aralığı verir; istatistiksel açıdan kesin değil, pratik bir belirsizlik tahminidir.',
            },
            {
              title: '6. Neden Kesin Tahmin Mümkün Değil?',
              body: 'Etkin Piyasa Hipotezi (EMH): eğer tahmin mümkün olsaydı, arbitrajcılar bu fırsatı hemen kapardı. TCMB kur müdahaleleri, jeopolitik şoklar, ABD Fed kararları, doğal afetler — bunların hiçbiri geçmiş veriden öğrenilemez. Modelimiz "tarihin kendini tekrar etmesi" varsayımına dayanır; yapısal kırılmalar (2023 Mayıs seçim sonrası kur atlaması gibi) tüm modelleri yanıltır.',
            },
          ].map(({ title, body }) => (
            <details key={title} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '14px 16px' }}>
              <summary style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {title} <span style={{ color: 'var(--color-text-mute)', fontSize: '16px' }}>+</span>
              </summary>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '10px 0 0', lineHeight: 1.65 }}>{body}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── UYARI ─── */}
      <div style={{ ...S.card, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-wrong-text)', marginBottom: '6px' }}>Yatırım Tavsiyesi Değildir</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: 0, lineHeight: 1.65 }}>
              Bu içerik yalnızca makine öğrenmesi ve zaman serisi analizi eğitim amaçlıdır. Üretilen tahminler
              geçmiş veriye dayalı istatistiksel modellerdir; gerçek piyasa hareketlerini garantilemez.
              Finansal kararlar için lisanslı yatırım danışmanlarına başvurun.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
