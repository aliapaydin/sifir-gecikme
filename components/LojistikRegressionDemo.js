'use client';

import { useState, useMemo, useRef } from 'react';

const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));

function fitModel(points, epochs = 3000, lr = 0.15) {
  if (points.length < 2) return null;

  // Normalize features
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const sx = Math.sqrt(xs.map(v => (v - mx) ** 2).reduce((a, b) => a + b, 0) / xs.length) || 1;
  const sy = Math.sqrt(ys.map(v => (v - my) ** 2).reduce((a, b) => a + b, 0) / ys.length) || 1;

  const norm = points.map(p => ({ x: (p.x - mx) / sx, y: (p.y - my) / sy, label: p.label }));

  // Gradient descent: weights [w0(bias), w1(x), w2(y)]
  let w = [0, 0, 0];

  for (let e = 0; e < epochs; e++) {
    const dw = [0, 0, 0];
    for (const p of norm) {
      const z = w[0] + w[1] * p.x + w[2] * p.y;
      const pred = sigmoid(z);
      const err = pred - p.label;
      dw[0] += err;
      dw[1] += err * p.x;
      dw[2] += err * p.y;
    }
    const n = norm.length;
    w[0] -= lr * dw[0] / n;
    w[1] -= lr * dw[1] / n;
    w[2] -= lr * dw[2] / n;
  }

  // predict(svgX, svgY) → probability, using denorm
  const predict = (rawX, rawY) => {
    const nx = (rawX - mx) / sx;
    const ny = (rawY - my) / sy;
    return sigmoid(w[0] + w[1] * nx + w[2] * ny);
  };

  // boundary line in raw space: w0 + w1*(x-mx)/sx + w2*(y-my)/sy = logit(threshold)
  // stored as w (normalized) and stats
  return { w, mx, my, sx, sy, predict };
}

// ────────────────────────────────────────────────────────────────────────────
// PART A — Sigmoid Explorer
// ────────────────────────────────────────────────────────────────────────────

function SigmoidExplorer() {
  const [z, setZ] = useState(0);

  const VBW = 400, VBH = 160;
  const PAD_L = 32, PAD_R = 16, PAD_T = 16, PAD_B = 32;
  const W = VBW - PAD_L - PAD_R;
  const H = VBH - PAD_T - PAD_B;

  // Map z in [-6,6] to x px, sigmoid(z) to y px
  const zToPx = zv => PAD_L + ((zv + 6) / 12) * W;
  const pToPy = pv => PAD_T + (1 - pv) * H;

  // Build the curve path
  const steps = 120;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const zv = -6 + (i / steps) * 12;
    return `${zToPx(zv).toFixed(1)},${pToPy(sigmoid(zv)).toFixed(1)}`;
  });
  const pathD = 'M ' + points.join(' L ');

  const sigVal = sigmoid(z);
  const cx = zToPx(z);
  const cy = pToPy(sigVal);

  // Color: near 0 → orange, near 1 → green
  const r = Math.round(232 + (29 - 232) * sigVal);
  const g = Math.round(160 + (158 - 160) * sigVal);
  const b = Math.round(74 + (117 - 74) * sigVal);
  const dotColor = `rgb(${r},${g},${b})`;

  // Y axis labels
  const yLabels = [0, 0.25, 0.5, 0.75, 1];
  // X axis labels
  const xLabels = [-6, -3, 0, 3, 6];

  return (
    <div style={{
      background: 'var(--color-bg-raised)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '20px',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Sigmoid Gezgini</span>
        <span style={{ fontFamily: 'monospace', fontSize: 15, color: dotColor, fontWeight: 700 }}>
          σ({z.toFixed(1)}) = {sigVal.toFixed(4)}
        </span>
      </div>

      <svg viewBox={`0 0 ${VBW} ${VBH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Grid lines */}
        {yLabels.map(v => (
          <line key={v}
            x1={PAD_L} y1={pToPy(v)}
            x2={VBW - PAD_R} y2={pToPy(v)}
            stroke="var(--color-border)" strokeWidth="0.5"
          />
        ))}
        {xLabels.map(v => (
          <line key={v}
            x1={zToPx(v)} y1={PAD_T}
            x2={zToPx(v)} y2={VBH - PAD_B}
            stroke="var(--color-border)" strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        <line x1={PAD_L} y1={VBH - PAD_B} x2={VBW - PAD_R} y2={VBH - PAD_B} stroke="var(--color-text-mute)" strokeWidth="1" />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={VBH - PAD_B} stroke="var(--color-text-mute)" strokeWidth="1" />

        {/* Y labels */}
        {yLabels.map(v => (
          <text key={v} x={PAD_L - 4} y={pToPy(v) + 4}
            textAnchor="end" fontSize="9" fill="var(--color-text-mute)"
          >{v}</text>
        ))}
        {/* X labels */}
        {xLabels.map(v => (
          <text key={v} x={zToPx(v)} y={VBH - PAD_B + 14}
            textAnchor="middle" fontSize="9" fill="var(--color-text-mute)"
          >{v}</text>
        ))}

        {/* Threshold line at 0.5 */}
        <line
          x1={PAD_L} y1={pToPy(0.5)}
          x2={VBW - PAD_R} y2={pToPy(0.5)}
          stroke="#7F77DD" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"
        />
        <text x={VBW - PAD_R + 2} y={pToPy(0.5) + 4} fontSize="8" fill="#7F77DD" opacity="0.8">0.5</text>

        {/* Sigmoid curve */}
        <path d={pathD} fill="none" stroke="#1D9E75" strokeWidth="2" />

        {/* Vertical guide line */}
        <line x1={cx} y1={PAD_T} x2={cx} y2={VBH - PAD_B} stroke={dotColor} strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        {/* Horizontal guide line */}
        <line x1={PAD_L} y1={cy} x2={cx} y2={cy} stroke={dotColor} strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

        {/* Moving dot */}
        <circle cx={cx} cy={cy} r="6" fill={dotColor} stroke="var(--color-bg)" strokeWidth="2" />
      </svg>

      <div style={{ marginTop: 12 }}>
        <input
          type="range"
          min="-6" max="6" step="0.1"
          value={z}
          onChange={e => setZ(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#1D9E75', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-mute)' }}>z = −6 (olasılık ≈ 0)</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-mute)' }}>z = +6 (olasılık ≈ 1)</span>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-soft)', marginTop: 10, lineHeight: 1.5 }}>
        Slider'ı hareket ettir: z = 0'da tam belirsizlik (σ = 0.5), z &gt; 0'da pozitif sınıf olasılığı artar.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PART B — 2D Decision Boundary
// ────────────────────────────────────────────────────────────────────────────

const INITIAL_POINTS = [
  // Class 0 (turuncu, alt-sol)
  { x: 55,  y: 195, label: 0 }, { x: 80,  y: 220, label: 0 },
  { x: 65,  y: 170, label: 0 }, { x: 100, y: 200, label: 0 },
  { x: 45,  y: 240, label: 0 }, { x: 120, y: 215, label: 0 },
  { x: 75,  y: 250, label: 0 }, { x: 90,  y: 185, label: 0 },
  // Class 1 (yeşil, üst-sağ)
  { x: 290, y: 60,  label: 1 }, { x: 320, y: 80,  label: 1 },
  { x: 310, y: 45,  label: 1 }, { x: 275, y: 85,  label: 1 },
  { x: 340, y: 65,  label: 1 }, { x: 300, y: 100, label: 1 },
  { x: 330, y: 55,  label: 1 }, { x: 285, y: 110, label: 1 },
];

function DecisionBoundaryDemo() {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [addLabel, setAddLabel] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const svgRef = useRef(null);

  const VBW = 400, VBH = 280;
  const PAD = 20;

  const model = useMemo(() => fitModel(points), [points]);

  // Background grid cells
  const COLS = 20, ROWS = 16;
  const cellW = (VBW - PAD * 2) / COLS;
  const cellH = (VBH - PAD * 2) / ROWS;

  const bgCells = useMemo(() => {
    if (!model) return [];
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = PAD + (c + 0.5) * cellW;
        const cy = PAD + (r + 0.5) * cellH;
        const prob = model.predict(cx, cy);
        cells.push({ x: PAD + c * cellW, y: PAD + r * cellH, w: cellW, h: cellH, prob });
      }
    }
    return cells;
  }, [model, threshold]);

  // Decision boundary line: w0 + w1*(x-mx)/sx + w2*(y-my)/sy = logit(threshold)
  const boundaryLine = useMemo(() => {
    if (!model || Math.abs(model.w[2]) < 1e-6) return null;
    const { w, mx, my, sx, sy } = model;
    const logitT = Math.log(threshold / (1 - threshold));
    // For x = PAD and x = VBW - PAD, compute y
    const computeY = (rawX) => {
      const nx = (rawX - mx) / sx;
      // w[0] + w[1]*nx + w[2]*(rawY-my)/sy = logitT
      // (rawY-my)/sy = (logitT - w[0] - w[1]*nx) / w[2]
      const ny = (logitT - w[0] - w[1] * nx) / w[2];
      return my + ny * sy;
    };
    const x1 = PAD, y1 = computeY(x1);
    const x2 = VBW - PAD, y2 = computeY(x2);
    return { x1, y1, x2, y2 };
  }, [model, threshold]);

  // Metrics
  const metrics = useMemo(() => {
    if (!model) return null;
    let tp = 0, fp = 0, tn = 0, fn = 0;
    for (const p of points) {
      const prob = model.predict(p.x, p.y);
      const pred = prob >= threshold ? 1 : 0;
      if (pred === 1 && p.label === 1) tp++;
      else if (pred === 1 && p.label === 0) fp++;
      else if (pred === 0 && p.label === 0) tn++;
      else fn++;
    }
    const acc = points.length > 0 ? (tp + tn) / points.length : 0;
    const prec = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const rec = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    return { acc, prec, rec };
  }, [model, points, threshold]);

  const svgCoords = (evt) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    const t = evt.touches ? evt.touches[0] : evt;
    pt.x = t.clientX; pt.y = t.clientY;
    const ctm = svg.getScreenCTM().inverse();
    const p = pt.matrixTransform(ctm);
    return { x: p.x, y: p.y };
  };

  const handleSvgClick = (evt) => {
    const coords = svgCoords(evt);
    if (!coords) return;
    const { x, y } = coords;
    if (x < PAD || x > VBW - PAD || y < PAD || y > VBH - PAD) return;
    setPoints(prev => [...prev, { x, y, label: addLabel }]);
  };

  const isWrong = (p) => {
    if (!model) return false;
    const prob = model.predict(p.x, p.y);
    const pred = prob >= threshold ? 1 : 0;
    return pred !== p.label;
  };

  return (
    <div style={{
      background: 'var(--color-bg-raised)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '20px',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>2D Karar Sınırı</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-mute)' }}>SVG'ye tıkla, nokta ekle</span>
      </div>

      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setAddLabel(0)}
          style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: addLabel === 0 ? 700 : 400,
            background: addLabel === 0 ? '#e8a04a22' : 'transparent',
            color: '#e8a04a', border: `1.5px solid ${addLabel === 0 ? '#e8a04a' : 'var(--color-border)'}`,
          }}
        >● Sınıf 0</button>
        <button
          onClick={() => setAddLabel(1)}
          style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: addLabel === 1 ? 700 : 400,
            background: addLabel === 1 ? '#1D9E7522' : 'transparent',
            color: '#1D9E75', border: `1.5px solid ${addLabel === 1 ? '#1D9E75' : 'var(--color-border)'}`,
          }}
        >● Sınıf 1</button>
        <button
          onClick={() => setPoints(INITIAL_POINTS)}
          style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
            background: 'transparent', color: 'var(--color-text-mute)',
            border: '1.5px solid var(--color-border)',
          }}
        >Sıfırla</button>
      </div>

      {/* SVG scatter plot */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VBW} ${VBH}`}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair', borderRadius: 8, border: '1px solid var(--color-border)' }}
        onClick={handleSvgClick}
      >
        {/* Background: model prediction wash */}
        {bgCells.map((cell, i) => (
          <rect
            key={i}
            x={cell.x} y={cell.y} width={cell.w} height={cell.h}
            fill={cell.prob >= threshold ? '#1D9E75' : '#e8a04a'}
            opacity={0.07}
          />
        ))}

        {/* Border */}
        <rect x={PAD} y={PAD} width={VBW - PAD * 2} height={VBH - PAD * 2}
          fill="none" stroke="var(--color-border)" strokeWidth="0.5" />

        {/* Decision boundary */}
        {boundaryLine && (() => {
          const { x1, y1, x2, y2 } = boundaryLine;
          // Clip to canvas bounds
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          // Only draw if within vertical range
          if (isNaN(y1) || isNaN(y2)) return null;
          const cy1 = clamp(y1, PAD, VBH - PAD);
          const cy2 = clamp(y2, PAD, VBH - PAD);
          return (
            <line
              x1={x1} y1={cy1} x2={x2} y2={cy2}
              stroke="#7F77DD" strokeWidth="2" strokeDasharray="6 4"
            />
          );
        })()}

        {/* Data points */}
        {points.map((p, i) => {
          const wrong = isWrong(p);
          const fill = p.label === 1 ? '#1D9E75' : '#e8a04a';
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={5.5}
              fill={fill}
              stroke={wrong ? '#ef4444' : 'var(--color-bg)'}
              strokeWidth={wrong ? 2.5 : 1.5}
              opacity={0.9}
            />
          );
        })}
      </svg>

      {/* Threshold slider */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-soft)' }}>Threshold (karar eşiği)</span>
          <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: '#7F77DD' }}>{threshold.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.01" max="0.99" step="0.01"
          value={threshold}
          onChange={e => setThreshold(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#7F77DD', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--color-text-mute)' }}>↑ Yüksek Duyarlılık</span>
          <span style={{ fontSize: 10, color: 'var(--color-text-mute)' }}>Yüksek Kesinlik ↑</span>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { label: 'Doğruluk', value: metrics.acc },
            { label: 'Kesinlik', value: metrics.prec },
            { label: 'Duyarlılık', value: metrics.rec },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 8, padding: '10px 12px',
            }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-mute)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'monospace' }}>
                {(value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--color-text-soft)', marginTop: 12, lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--color-text)' }}>Kırmızı halka</strong> = yanlış sınıflandırılan nokta.{' '}
        <strong style={{ color: '#7F77DD' }}>Mor kesikli çizgi</strong> = karar sınırı.{' '}
        Threshold'u kaydır: eşik yükseldikçe mor çizgi kayar, metrikler değişir.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main export — renders only the requested section
// ────────────────────────────────────────────────────────────────────────────

export default function LojistikRegressionDemo({ bölüm }) {
  if (bölüm === 'sigmoid') return <SigmoidExplorer />;
  if (bölüm === 'karar')   return <DecisionBoundaryDemo />;
  // Fallback: both
  return (
    <>
      <SigmoidExplorer />
      <DecisionBoundaryDemo />
    </>
  );
}
