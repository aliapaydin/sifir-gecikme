'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

// ─── VERİ SETİ ─────────────────────────────────────────────────────────────
// E-ticaret: Premium üyelik tahmini
// Özellikler: yaş (20-60), aylık harcama bin TL (1-15)
// s=1 Premium, s=0 Standart
const VERI = [
  {id:1,  yas:22, har:9.2,  s:1}, {id:2,  yas:25, har:11.5, s:1},
  {id:3,  yas:28, har:8.1,  s:1}, {id:4,  yas:24, har:12.3, s:1},
  {id:5,  yas:31, har:7.8,  s:1}, {id:6,  yas:29, har:10.2, s:1},
  {id:7,  yas:33, har:9.5,  s:1}, {id:8,  yas:26, har:13.1, s:1},
  {id:9,  yas:36, har:8.4,  s:1}, {id:10, yas:35, har:11.0, s:1},
  {id:11, yas:27, har:7.2,  s:1}, {id:12, yas:32, har:9.8,  s:1},
  {id:13, yas:21, har:3.5,  s:0}, {id:14, yas:23, har:2.8,  s:0},
  {id:15, yas:26, har:4.2,  s:0}, {id:16, yas:30, har:5.1,  s:0},
  {id:17, yas:34, har:3.9,  s:0}, {id:18, yas:28, har:2.2,  s:0},
  {id:19, yas:32, har:4.8,  s:0}, {id:20, yas:37, har:5.5,  s:0},
  {id:21, yas:42, har:12.5, s:1}, {id:22, yas:47, har:11.2, s:1},
  {id:23, yas:51, har:13.8, s:1}, {id:24, yas:45, har:10.5, s:1},
  {id:25, yas:55, har:12.1, s:1}, {id:26, yas:49, har:11.7, s:1},
  {id:27, yas:58, har:14.2, s:1}, {id:28, yas:43, har:10.8, s:1},
  {id:29, yas:40, har:5.5,  s:0}, {id:30, yas:44, har:7.2,  s:0},
  {id:31, yas:48, har:4.8,  s:0}, {id:32, yas:52, har:6.5,  s:0},
  {id:33, yas:56, har:3.2,  s:0}, {id:34, yas:41, har:8.1,  s:0},
  {id:35, yas:46, har:5.9,  s:0}, {id:36, yas:53, har:7.5,  s:0},
  {id:37, yas:59, har:4.1,  s:0}, {id:38, yas:50, har:6.8,  s:0},
  {id:39, yas:43, har:3.5,  s:0}, {id:40, yas:57, har:5.2,  s:0},
];

// ─── SCATTER PLOT KOORDİNATLARI ────────────────────────────────────────────
const SW = 480, SH = 360;
const ML = 54, MR = 16, MT = 22, MB = 46;
const PW = SW - ML - MR, PH = SH - MT - MB;
const YAS_MIN = 18, YAS_MAX = 62;
const HAR_MIN = 0,  HAR_MAX = 16;

const xP = v => ML + ((v - YAS_MIN) / (YAS_MAX - YAS_MIN)) * PW;
const yP = v => MT + PH - ((v - HAR_MIN) / (HAR_MAX - HAR_MIN)) * PH;
const xV = p => Math.max(YAS_MIN + 2, Math.min(YAS_MAX - 2, ((p - ML) / PW) * (YAS_MAX - YAS_MIN) + YAS_MIN));
const yV = p => Math.max(HAR_MIN + 0.5, Math.min(HAR_MAX - 0.5, ((MT + PH - p) / PH) * (HAR_MAX - HAR_MIN) + HAR_MIN));

// ─── MATEMATİK ─────────────────────────────────────────────────────────────
const gini = pts => {
  const n = pts.length;
  if (!n) return 0;
  const p = pts.filter(d => d.s === 1).length / n;
  return 1 - p * p - (1 - p) * (1 - p);
};
const majority = pts => pts.filter(d => d.s === 1).length >= pts.filter(d => d.s === 0).length ? 1 : 0;
const prem = pts => pts.filter(d => d.s === 1).length;
const std  = pts => pts.filter(d => d.s === 0).length;

const bestThreshold = (pts, feat) => {
  const vals = [...new Set(pts.map(d => d[feat]))].sort((a, b) => a - b);
  let best = { val: (vals[0] + vals[vals.length - 1]) / 2, g: Infinity };
  for (let i = 0; i < vals.length - 1; i++) {
    const mid = (vals[i] + vals[i + 1]) / 2;
    const L = pts.filter(d => d[feat] <= mid);
    const R = pts.filter(d => d[feat] > mid);
    const g = (L.length * gini(L) + R.length * gini(R)) / pts.length;
    if (g < best.g) best = { val: mid, g };
  }
  return best.val;
};

// ─── AĞAÇ SVG DÜĞÜMÜ ───────────────────────────────────────────────────────
function SvgDugum({ x, y, w, h, baslik, g, pts, yaprak, tahmin, titleColor = '#555' }) {
  const bg     = yaprak ? (tahmin === 1 ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)') : '#FAF8F3';
  const border = yaprak ? (tahmin === 1 ? '#86EFAC' : '#FCA5A5') : '#D5CCBA';
  const n = pts.length;
  const pr = prem(pts), st = std(pts);
  const lines = [
    baslik,
    `Gini: ${g.toFixed(3)}`,
    `n=${n}  ✓${pr}  ✗${st}`,
    yaprak ? (tahmin === 1 ? '→ Premium' : '→ Standart') : null,
  ].filter(Boolean);
  const lineH = 13;
  const totalTextH = lines.length * lineH;
  const startY = y + (h - totalTextH) / 2 + 10;

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={bg} stroke={border} strokeWidth={1} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * lineH}
          textAnchor="middle"
          fontSize={i === 0 ? 10.5 : 9.5}
          fontWeight={i === 0 || (yaprak && i === lines.length - 1) ? 700 : 400}
          fill={
            i === 0 ? titleColor
            : yaprak && i === lines.length - 1 ? (tahmin === 1 ? '#16a34a' : '#ea580c')
            : '#888'
          }
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ─── AĞAÇ DİYAGRAMI ────────────────────────────────────────────────────────
function AgacDiyagrami({ derinlik, split1, split2L, split2R, sol, sag, solSol, solSag, sagSol, sagSag, tahminSol, tahminSag, tahminSolSol, tahminSolSag, tahminSagSol, tahminSagSag }) {
  const all = VERI;
  const LINE = '#D5CCBA';

  if (derinlik === 1) {
    const TW = 316, TH = 168;
    const RX = 58, RY = 6, RW = 200, RH = 60;
    const LX = 4,  LY = 108, LW = 138, LH = 56;
    const RLX = 174, RLY = 108, RLW = 138, RLH = 56;
    const midX = RX + RW / 2;
    return (
      <svg viewBox={`0 0 ${TW} ${TH}`} style={{ width: '100%', display: 'block' }}>
        <line x1={midX} y1={RY + RH} x2={LX + LW / 2}  y2={LY}  stroke={LINE} strokeWidth={1.5} />
        <line x1={midX} y1={RY + RH} x2={RLX + RLW / 2} y2={RLY} stroke={LINE} strokeWidth={1.5} />
        <text x={(midX + LX + LW/2)/2 - 6} y={(RY+RH+LY)/2+1} fontSize={8.5} fill="#1D9E75" fontWeight={700}>Evet</text>
        <text x={(midX + RLX+RLW/2)/2 + 4} y={(RY+RH+RLY)/2+1} fontSize={8.5} fill="#999" fontWeight={600}>Hayır</text>
        <SvgDugum x={RX} y={RY} w={RW} h={RH} baslik={`Yaş ≤ ${Math.round(split1)}?`} g={gini(all)} pts={all} titleColor="#1D9E75" />
        <SvgDugum x={LX}  y={LY}  w={LW}  h={LH}  g={gini(sol)} pts={sol} yaprak tahmin={tahminSol} />
        <SvgDugum x={RLX} y={RLY} w={RLW} h={RLH} g={gini(sag)} pts={sag} yaprak tahmin={tahminSag} />
      </svg>
    );
  }

  // Derinlik 2
  const TW = 348, TH = 268;
  const RX = 74, RY = 4, RW = 200, RH = 56;
  const LMX = 4,   LMY = 98, LMW = 150, LMH = 56;
  const RMX = 194, RMY = 98, RMW = 150, RMH = 56;
  const LLX = 0,   LLY = 202, LLW = 88,  LLH = 62;
  const LRX = 94,  LRY = 202, LRW = 88,  LRH = 62;
  const RLX2 = 188, RLY2 = 202, RLW2 = 72, RLH2 = 62;
  const RRX = 268,  RRY = 202, RRW = 72,  RRH = 62;
  const midX = RX + RW / 2;

  return (
    <svg viewBox={`0 0 ${TW} ${TH}`} style={{ width: '100%', display: 'block' }}>
      <line x1={midX} y1={RY+RH}   x2={LMX+LMW/2} y2={LMY}  stroke={LINE} strokeWidth={1.5} />
      <line x1={midX} y1={RY+RH}   x2={RMX+RMW/2} y2={RMY}  stroke={LINE} strokeWidth={1.5} />
      <text x={(midX+LMX+LMW/2)/2-6} y={(RY+RH+LMY)/2+1} fontSize={8} fill="#1D9E75" fontWeight={700}>Evet</text>
      <text x={(midX+RMX+RMW/2)/2+4} y={(RY+RH+RMY)/2+1} fontSize={8} fill="#999" fontWeight={600}>Hayır</text>

      <line x1={LMX+LMW/2} y1={LMY+LMH} x2={LLX+LLW/2}  y2={LLY}  stroke={LINE} strokeWidth={1} />
      <line x1={LMX+LMW/2} y1={LMY+LMH} x2={LRX+LRW/2}  y2={LRY}  stroke={LINE} strokeWidth={1} />
      <line x1={RMX+RMW/2} y1={RMY+RMH} x2={RLX2+RLW2/2} y2={RLY2} stroke={LINE} strokeWidth={1} />
      <line x1={RMX+RMW/2} y1={RMY+RMH} x2={RRX+RRW/2}  y2={RRY}  stroke={LINE} strokeWidth={1} />

      <SvgDugum x={RX} y={RY} w={RW} h={RH} baslik={`Yaş ≤ ${Math.round(split1)}?`} g={gini(all)} pts={all} titleColor="#1D9E75" />
      <SvgDugum x={LMX} y={LMY} w={LMW} h={LMH} baslik={`Har ≤ ${split2L.toFixed(1)}k?`} g={gini(sol)} pts={sol} titleColor="#7F77DD" />
      <SvgDugum x={RMX} y={RMY} w={RMW} h={RMH} baslik={`Har ≤ ${split2R.toFixed(1)}k?`} g={gini(sag)} pts={sag} titleColor="#7F77DD" />
      <SvgDugum x={LLX}  y={LLY}  w={LLW}  h={LLH}  g={gini(solSol)} pts={solSol} yaprak tahmin={tahminSolSol} />
      <SvgDugum x={LRX}  y={LRY}  w={LRW}  h={LRH}  g={gini(solSag)} pts={solSag} yaprak tahmin={tahminSolSag} />
      <SvgDugum x={RLX2} y={RLY2} w={RLW2} h={RLH2} g={gini(sagSol)} pts={sagSol} yaprak tahmin={tahminSagSol} />
      <SvgDugum x={RRX}  y={RRY}  w={RRW}  h={RRH}  g={gini(sagSag)} pts={sagSag} yaprak tahmin={tahminSagSag} />
    </svg>
  );
}

// ─── ANA SAYFA ──────────────────────────────────────────────────────────────
export default function DecisionTreePage() {
  const [derinlik, setDerinlik] = useState(1);
  const [split1,  setSplit1]  = useState(38);
  const [split2L, setSplit2L] = useState(7.0);
  const [split2R, setSplit2R] = useState(10.0);
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);

  // Bölünmüş gruplar
  const sol    = VERI.filter(d => d.yas <= split1);
  const sag    = VERI.filter(d => d.yas >  split1);
  const solSol = sol.filter(d => d.har <= split2L);
  const solSag = sol.filter(d => d.har >  split2L);
  const sagSol = sag.filter(d => d.har <= split2R);
  const sagSag = sag.filter(d => d.har >  split2R);

  const tahminSol    = majority(sol);
  const tahminSag    = majority(sag);
  const tahminSolSol = majority(solSol);
  const tahminSolSag = majority(solSag);
  const tahminSagSol = majority(sagSol);
  const tahminSagSag = majority(sagSag);

  // Doğruluk
  const dogru = derinlik === 1
    ? sol.filter(d => d.s === tahminSol).length + sag.filter(d => d.s === tahminSag).length
    : solSol.filter(d => d.s === tahminSolSol).length + solSag.filter(d => d.s === tahminSolSag).length
    + sagSol.filter(d => d.s === tahminSagSol).length + sagSag.filter(d => d.s === tahminSagSag).length;

  // ─── DRAG ─────────────────────────────────────────────────────────────────
  const onMove = useCallback((clientX, clientY) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = (clientX - rect.left) * (SW / rect.width);
    const sy = (clientY - rect.top)  * (SH / rect.height);
    if (dragging === 'v1')  setSplit1( Math.round(xV(sx)));
    if (dragging === 'h2L') setSplit2L(Math.round(yV(sy) * 10) / 10);
    if (dragging === 'h2R') setSplit2R(Math.round(yV(sy) * 10) / 10);
  }, [dragging]);

  useEffect(() => {
    const up = () => setDragging(null);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  // ─── EN İYİ BÖLME ─────────────────────────────────────────────────────────
  const enIyiBolme = () => {
    const s1 = bestThreshold(VERI, 'yas');
    const newSol = VERI.filter(d => d.yas <= s1);
    const newSag = VERI.filter(d => d.yas >  s1);
    setSplit1(Math.round(s1));
    if (derinlik === 2) {
      setSplit2L(Math.round(bestThreshold(newSol, 'har') * 10) / 10);
      setSplit2R(Math.round(bestThreshold(newSag, 'har') * 10) / 10);
    }
  };

  // ─── RENKLİ BÖLGELER ──────────────────────────────────────────────────────
  const PBG = 'rgba(22,163,74,0.09)';
  const SBG = 'rgba(234,88,12,0.09)';
  const x1  = xP(split1);
  const y2L = yP(split2L);
  const y2R = yP(split2R);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen">
      <article className="max-w-5xl mx-auto px-6 py-12">

        {/* Başlık */}
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>
        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Decision tree: ağacı sen büyüt
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-mute)' }}>
          Bölme eşiklerini sürükle · Gini impurity'nin nasıl düştüğünü izle · E-ticaret premium üyelik senaryosu
        </p>

        {/* Kontroller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* Derinlik toggle */}
          <div style={{ display: 'flex', border: '0.5px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            {[1, 2].map(d => (
              <button key={d} onClick={() => setDerinlik(d)} style={{
                padding: '6px 18px', fontSize: '13px', fontWeight: 500,
                border: 'none', cursor: 'pointer',
                background: derinlik === d ? 'var(--color-accent)' : 'var(--color-cream-card)',
                color:      derinlik === d ? '#fff' : 'var(--color-text-soft)',
                transition: 'background 0.15s',
              }}>
                Derinlik {d}
              </button>
            ))}
          </div>

          <button onClick={enIyiBolme} style={{
            padding: '6px 14px', fontSize: '13px', fontWeight: 500,
            border: '0.5px solid var(--color-accent)', borderRadius: '8px', cursor: 'pointer',
            background: 'var(--color-accent-soft)', color: 'var(--color-accent-text)',
          }}>
            ✦ En iyi bölmeyi bul
          </button>

          {/* Doğruluk */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
            fontSize: '13px',
          }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Doğruluk</span>
            <strong style={{ color: dogru === 40 ? '#16a34a' : 'var(--color-text)' }}>
              {dogru}/40
            </strong>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
              background: dogru === 40 ? 'rgba(22,163,74,0.12)' : dogru >= 35 ? 'rgba(245,158,11,0.12)' : 'rgba(220,38,38,0.12)',
              color:      dogru === 40 ? '#16a34a' : dogru >= 35 ? '#e65100' : '#dc2626',
            }}>
              %{Math.round(dogru / 40 * 100)}
            </span>
          </div>

          {/* Gini göstergesi */}
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
            Gini: <span style={{ fontFamily: 'monospace', color: 'var(--color-text)' }}>
              {derinlik === 1
                ? ((sol.length * gini(sol) + sag.length * gini(sag)) / 40).toFixed(3)
                : ((solSol.length*gini(solSol) + solSag.length*gini(solSag) + sagSol.length*gini(sagSol) + sagSag.length*gini(sagSag)) / 40).toFixed(3)
              }
            </span>
          </div>
        </div>

        {/* Ana içerik: scatter + ağaç */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* ── Scatter Plot ── */}
          <div style={{ flex: '1 1 440px' }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SW} ${SH}`}
              style={{
                width: '100%', display: 'block',
                border: '0.5px solid var(--color-border)',
                borderRadius: '12px',
                background: 'var(--color-cream-card)',
                userSelect: 'none', touchAction: 'none',
                cursor: dragging ? (dragging === 'v1' ? 'ew-resize' : 'ns-resize') : 'default',
              }}
              onMouseMove={e => onMove(e.clientX, e.clientY)}
              onTouchMove={e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }}
            >
              {/* Renkli bölgeler */}
              {derinlik === 1 ? (<>
                <rect x={ML} y={MT} width={x1-ML}      height={PH} fill={tahminSol===1 ? PBG : SBG} />
                <rect x={x1} y={MT} width={ML+PW-x1}   height={PH} fill={tahminSag===1 ? PBG : SBG} />
              </>) : (<>
                <rect x={ML} y={MT}  width={x1-ML}    height={y2L-MT}    fill={tahminSolSag===1?PBG:SBG} />
                <rect x={ML} y={y2L} width={x1-ML}    height={MT+PH-y2L} fill={tahminSolSol===1?PBG:SBG} />
                <rect x={x1} y={MT}  width={ML+PW-x1} height={y2R-MT}    fill={tahminSagSag===1?PBG:SBG} />
                <rect x={x1} y={y2R} width={ML+PW-x1} height={MT+PH-y2R} fill={tahminSagSol===1?PBG:SBG} />
              </>)}

              {/* Izgara */}
              {[25,30,35,40,45,50,55,60].map(v => (
                <line key={v} x1={xP(v)} y1={MT} x2={xP(v)} y2={MT+PH} stroke="var(--color-border)" strokeWidth={0.5} />
              ))}
              {[2,4,6,8,10,12,14].map(v => (
                <line key={v} x1={ML} y1={yP(v)} x2={ML+PW} y2={yP(v)} stroke="var(--color-border)" strokeWidth={0.5} />
              ))}
              <rect x={ML} y={MT} width={PW} height={PH} fill="none" stroke="var(--color-border)" strokeWidth={0.8} />

              {/* Eksen etiketleri */}
              {[20,30,40,50,60].map(v => (
                <text key={v} x={xP(v)} y={MT+PH+16} textAnchor="middle" fontSize={10} fill="#8A8070">{v}</text>
              ))}
              <text x={ML+PW/2} y={SH-4} textAnchor="middle" fontSize={11} fill="#8A8070">Yaş</text>
              {[0,4,8,12,16].map(v => (
                <text key={v} x={ML-7} y={yP(v)+4} textAnchor="end" fontSize={10} fill="#8A8070">{v}k</text>
              ))}
              <text x={13} y={MT+PH/2} textAnchor="middle" fontSize={11} fill="#8A8070"
                transform={`rotate(-90,13,${MT+PH/2})`}>Harcama</text>

              {/* Veri noktaları */}
              {VERI.map(d => (
                <circle key={d.id} cx={xP(d.yas)} cy={yP(d.har)} r={5.5}
                  fill={d.s===1?'#16a34a':'#ea580c'} fillOpacity={0.85}
                  stroke={d.s===1?'#14532d':'#9a3412'} strokeWidth={0.8} />
              ))}

              {/* ── Split 1: dikey çizgi (yaş) ── */}
              <line x1={x1} y1={MT} x2={x1} y2={MT+PH} stroke="#1D9E75" strokeWidth={2} strokeDasharray="7 4" />
              <rect x={x1-30} y={MT-20} width={60} height={18} rx={5} fill="#1D9E75" />
              <text x={x1} y={MT-7} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">
                yaş ≤ {Math.round(split1)}
              </text>
              {/* Handle */}
              <circle cx={x1} cy={MT+PH/2} r={9} fill="white" stroke="#1D9E75" strokeWidth={2}
                style={{ cursor: 'ew-resize' }}
                onMouseDown={e => { e.preventDefault(); setDragging('v1'); }}
                onTouchStart={e => { e.preventDefault(); setDragging('v1'); }}
              />
              <text x={x1} y={MT+PH/2+4} textAnchor="middle" fontSize={10} fill="#1D9E75" style={{ pointerEvents: 'none' }}>↔</text>

              {/* ── Split 2L: yatay çizgi sol dal ── */}
              {derinlik === 2 && (<>
                <line x1={ML} y1={y2L} x2={x1} y2={y2L} stroke="#7F77DD" strokeWidth={2} strokeDasharray="7 4" />
                <rect x={ML+4} y={y2L-18} width={68} height={17} rx={5} fill="#7F77DD" />
                <text x={ML+38} y={y2L-6} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="white">
                  har ≤ {split2L.toFixed(1)}k
                </text>
                <circle cx={ML+(x1-ML)/2} cy={y2L} r={9} fill="white" stroke="#7F77DD" strokeWidth={2}
                  style={{ cursor: 'ns-resize' }}
                  onMouseDown={e => { e.preventDefault(); setDragging('h2L'); }}
                  onTouchStart={e => { e.preventDefault(); setDragging('h2L'); }}
                />
                <text x={ML+(x1-ML)/2} y={y2L+4} textAnchor="middle" fontSize={10} fill="#7F77DD" style={{ pointerEvents: 'none' }}>↕</text>
              </>)}

              {/* ── Split 2R: yatay çizgi sağ dal ── */}
              {derinlik === 2 && (<>
                <line x1={x1} y1={y2R} x2={ML+PW} y2={y2R} stroke="#7F77DD" strokeWidth={2} strokeDasharray="7 4" />
                <rect x={ML+PW-72} y={y2R-18} width={68} height={17} rx={5} fill="#7F77DD" />
                <text x={ML+PW-38} y={y2R-6} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="white">
                  har ≤ {split2R.toFixed(1)}k
                </text>
                <circle cx={x1+(ML+PW-x1)/2} cy={y2R} r={9} fill="white" stroke="#7F77DD" strokeWidth={2}
                  style={{ cursor: 'ns-resize' }}
                  onMouseDown={e => { e.preventDefault(); setDragging('h2R'); }}
                  onTouchStart={e => { e.preventDefault(); setDragging('h2R'); }}
                />
                <text x={x1+(ML+PW-x1)/2} y={y2R+4} textAnchor="middle" fontSize={10} fill="#7F77DD" style={{ pointerEvents: 'none' }}>↕</text>
              </>)}

              {/* Legend */}
              <circle cx={ML+6}   cy={MT+PH+32} r={5} fill="#16a34a" />
              <text x={ML+14}  y={MT+PH+36} fontSize={10} fill="#16a34a" fontWeight={500}>Premium (n=20)</text>
              <circle cx={ML+118} cy={MT+PH+32} r={5} fill="#ea580c" />
              <text x={ML+126} y={MT+PH+36} fontSize={10} fill="#ea580c" fontWeight={500}>Standart (n=20)</text>
            </svg>
          </div>

          {/* ── Ağaç Diyagramı ── */}
          <div style={{ flex: '0 1 360px', minWidth: '280px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Ağaç Diyagramı
            </div>

            <div style={{ border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px', background: 'var(--color-cream-card)' }}>
              <AgacDiyagrami
                derinlik={derinlik}
                split1={split1} split2L={split2L} split2R={split2R}
                sol={sol} sag={sag}
                solSol={solSol} solSag={solSag} sagSol={sagSol} sagSag={sagSag}
                tahminSol={tahminSol} tahminSag={tahminSag}
                tahminSolSol={tahminSolSol} tahminSolSag={tahminSolSag}
                tahminSagSol={tahminSagSol} tahminSagSag={tahminSagSag}
              />
            </div>

            {/* Renk açıklaması */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[['#1D9E75','Yaş bölmesi (yeşil çizgi)'],['#7F77DD','Harcama bölmesi (mor çizgi)']].map(([c,l]) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
                  <div style={{ width: '20px', height: '2px', background: c, borderRadius: '1px' }} />
                  {l}
                </div>
              ))}
            </div>

            {/* Gini kutusu */}
            <div style={{
              marginTop: '12px', padding: '12px 14px',
              background: 'var(--color-cream)', border: '0.5px solid var(--color-border)',
              borderRadius: '8px', fontSize: '12px', lineHeight: '1.65', color: 'var(--color-text-soft)',
            }}>
              <strong style={{ color: 'var(--color-text)' }}>Gini impurity:</strong>
              {' '}0 = tek sınıf (mükemmel ayrışma), 0.5 = tam karışık. Her bölmede ağırlıklı Gini minimize edilir.
            </div>
          </div>
        </div>

        {/* Açıklama */}
        <div style={{ marginTop: '40px', maxWidth: '680px' }}>
          <h2 className="font-serif text-2xl font-medium mb-4" style={{ color: 'var(--color-text)' }}>
            Nasıl çalışır?
          </h2>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: '1.75', marginBottom: '1rem' }}>
            Grafik, bir e-ticaret platformunun 40 müşterisini gösteriyor. Yeşil noktalar premium üyeliğe geçenler, turuncu noktalar geçmeyenler. Yaş ve aylık harcama olmak üzere iki özellik var.
          </p>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: '1.75', marginBottom: '1rem' }}>
            Decision tree, veriyi en temiz bölen eşiği arar. &quot;Temizlik&quot; Gini impurity ile ölçülür — bir bölgede tek sınıf varsa Gini=0, eşit karışımsa Gini=0.5. Yeşil çizgiyi sürükleyerek yaş eşiğini değiştir, doğruluk ve Gini&apos;nin nasıl değiştiğini gözlemle.
          </p>
          <p style={{ color: 'var(--color-text-soft)', lineHeight: '1.75' }}>
            <strong style={{ color: 'var(--color-text)' }}>Derinlik 2&apos;de</strong> her dal ayrıca harcama üzerinden de bölünür. Mor çizgileri sürükle. &quot;En iyi bölmeyi bul&quot; butonu algoritmik optimumu hesaplayıp tüm çizgileri yerleştirir — %100 doğruluğa ulaşabilir misin?
          </p>
        </div>

      </article>
    </main>
  );
}
