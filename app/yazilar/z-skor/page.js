'use client'
import { useState, useMemo } from 'react';

// Abramowitz & Stegun erf approximation
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return sign * y;
}

function phi(z)  { return 0.5 * (1 + erf(z / Math.SQRT2)); }
function pdf(z)  { return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI); }

// SVG dimensions
const W = 560, H = 180, PX = 36, PT = 14, PB = 38;
const CH = H - PT - PB;           // curve height
const BY = PT + CH;                // baseline y
const ZMIN = -4, ZMAX = 4;
const YPEAK = pdf(0);

function zx(z)  { return PX + ((z - ZMIN) / (ZMAX - ZMIN)) * (W - 2 * PX); }
function zy(y)  { return PT + CH - (y / YPEAK) * CH; }

function buildCurve(steps = 220) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const z = ZMIN + (ZMAX - ZMIN) * i / steps;
    d += (i === 0 ? 'M' : 'L') + ` ${zx(z).toFixed(1)} ${zy(pdf(z)).toFixed(1)} `;
  }
  return d;
}

function buildShade(z1, z2, steps = 100) {
  const a = Math.max(z1, ZMIN), b = Math.min(z2, ZMAX);
  if (a >= b) return '';
  let d = `M ${zx(a).toFixed(1)} ${BY} L ${zx(a).toFixed(1)} ${zy(pdf(a)).toFixed(1)} `;
  for (let i = 1; i <= steps; i++) {
    const z = a + (b - a) * i / steps;
    d += `L ${zx(z).toFixed(1)} ${zy(pdf(z)).toFixed(1)} `;
  }
  return d + `L ${zx(b).toFixed(1)} ${BY} Z`;
}

const CURVE = buildCurve();
const TICKS = [-3, -2, -1, 0, 1, 2, 3];

const MODLAR = [
  { id: 'sol',  label: 'P(X < x)',    aciklama: 'Sol kuyruk olasılığı' },
  { id: 'sag',  label: 'P(X > x)',    aciklama: 'Sağ kuyruk olasılığı' },
  { id: 'orta', label: 'P(−|z| < Z < |z|)', aciklama: 'Merkezi alan' },
  { id: 'iki',  label: 'P(|Z| > |z|)', aciklama: 'İki kuyruk (dışarıda kalan)' },
];

function fmt(n, d = 4) { return n.toFixed(d); }
function pct(n)        { return (n * 100).toFixed(2) + '%'; }
function fmtZ(n)       { return (n >= 0 ? '+' : '') + n.toFixed(3); }

export default function ZSkorPage() {
  const [mu,       setMu]       = useState(0);
  const [sigmaRaw, setSigmaRaw] = useState(1);
  const [xRaw,     setXRaw]     = useState(1);
  const [mod,      setMod]      = useState('sol');

  const sigma = Math.max(0.1, sigmaRaw);
  const x     = Number(xRaw);
  const z     = (x - mu) / sigma;
  const zC    = Math.max(ZMIN, Math.min(ZMAX, z));
  const zAbs  = Math.abs(z);

  const pSol  = phi(z);
  const pSag  = 1 - pSol;
  const pOrta = phi(zAbs) - phi(-zAbs);
  const pIki  = 1 - pOrta;
  const aktifP = { sol: pSol, sag: pSag, orta: pOrta, iki: pIki }[mod];

  const shadePaths = useMemo(() => {
    if (mod === 'sol')  return [buildShade(ZMIN, zC)];
    if (mod === 'sag')  return [buildShade(zC, ZMAX)];
    if (mod === 'orta') return [buildShade(-zAbs, zAbs)];
    return [buildShade(ZMIN, -zAbs), buildShade(zAbs, ZMAX)];
  }, [mod, zC, zAbs]);

  const xMin = mu - 4 * sigma;
  const xMax = mu + 4 * sigma;
  const xStep = sigma * 0.1;

  const sigmaIntervals = [
    { label: 'μ ± 1σ', p: phi(1) - phi(-1), color: 'var(--color-correct-text)' },
    { label: 'μ ± 2σ', p: phi(2) - phi(-2), color: 'var(--color-accent-text)' },
    { label: 'μ ± 3σ', p: phi(3) - phi(-3), color: 'var(--color-purple-text)' },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      {/* Başlık */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-guide" style={{ marginBottom: '12px', display: 'inline-block' }}>araç</span>
        <h1 className="font-serif font-medium" style={{ fontSize: '1.9rem', color: 'var(--color-text)', marginBottom: '12px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          Normal Dağılım &amp; Z-Skor Hesaplayıcı
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-text-soft)', lineHeight: 1.65, maxWidth: '520px' }}>
          Ortalama (μ) ve standart sapma (σ) gir, bir değer seç — Z-skoru ve olasılık alanı anında görünsün.
        </p>
      </div>

      {/* Bell curve SVG */}
      <div className="card" style={{ padding: '20px 16px 16px', marginBottom: '20px', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Shaded area */}
          {shadePaths.map((d, i) => d && (
            <path key={i} d={d} fill="rgba(29,158,117,0.18)" />
          ))}

          {/* Sigma grid lines */}
          {[-2, -1, 0, 1, 2].map(t => (
            <line key={t} x1={zx(t)} y1={PT} x2={zx(t)} y2={BY}
              stroke="var(--color-border)" strokeWidth={t === 0 ? 1.5 : 0.8}
              strokeDasharray={t === 0 ? '' : '3 3'} opacity="0.5" />
          ))}

          {/* Baseline */}
          <line x1={PX} y1={BY} x2={W - PX} y2={BY} stroke="var(--color-border)" strokeWidth="1.2" />

          {/* Curve */}
          <path d={CURVE} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

          {/* Current x — dashed line + dot */}
          <line x1={zx(zC)} y1={PT} x2={zx(zC)} y2={BY}
            stroke="var(--color-accent)" strokeWidth="1.8" strokeDasharray="5 3" />
          <circle cx={zx(zC)} cy={zy(pdf(zC))} r="4.5" fill="var(--color-accent)" />
          <circle cx={zx(zC)} cy={zy(pdf(zC))} r="2.5" fill="white" />

          {/* Tick marks */}
          {TICKS.map(t => (
            <g key={t}>
              <line x1={zx(t)} y1={BY} x2={zx(t)} y2={BY + 5} stroke="var(--color-border)" strokeWidth="1" />
              <text x={zx(t)} y={BY + 17} textAnchor="middle" fontSize="10" fill="var(--color-text-faint)">
                {t === 0 ? 'μ' : `${t > 0 ? '+' : ''}${t}σ`}
              </text>
            </g>
          ))}

          {/* x label above dot */}
          <text x={Math.min(Math.max(zx(zC), 30), W - 30)} y={Math.max(zy(pdf(zC)) - 8, PT + 4)}
            textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-accent)">
            x={x % 1 === 0 ? x : x.toFixed(1)}
          </text>
        </svg>

        {/* Mod seçimi */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
          {MODLAR.map(m => {
            const aktif = mod === m.id;
            return (
              <button key={m.id} onClick={() => setMod(m.id)} style={{
                padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                border: aktif ? 'none' : '1px solid var(--color-border)',
                background: aktif ? 'var(--color-accent)' : 'transparent',
                color: aktif ? '#fff' : 'var(--color-text-soft)',
                fontWeight: aktif ? 600 : 400, transition: 'all 0.15s',
              }}>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Giriş + Sonuç */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Giriş */}
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>Parametreler</div>

          {[
            { label: 'Ortalama', sym: 'μ', min: -10, max: 10, step: 0.5, val: mu, set: setMu, fmt: v => v.toFixed(1) },
            { label: 'Standart Sapma', sym: 'σ', min: 0.5, max: 5, step: 0.5, val: sigmaRaw, set: setSigmaRaw, fmt: v => v.toFixed(1) },
          ].map(inp => (
            <div key={inp.sym} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-soft)' }}>{inp.label} ({inp.sym})</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: 600 }}>{inp.fmt(inp.val)}</span>
              </div>
              <input type="range" min={inp.min} max={inp.max} step={inp.step} value={inp.val}
                onChange={e => inp.set(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
            </div>
          ))}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-soft)' }}>Değer (x)</span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: 600 }}>{x % 1 === 0 ? x : x.toFixed(2)}</span>
            </div>
            <input type="range" min={xMin} max={xMax} step={xStep} value={xRaw}
              onChange={e => setXRaw(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>{xMin.toFixed(1)}</span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>{xMax.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Sonuç */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-mute)' }}>Sonuç</div>

          {/* Z-skor */}
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-accent-soft)', border: '1px solid var(--color-correct-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-accent-text)', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Z-Skoru</div>
            <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent-text)', lineHeight: 1 }}>
              {fmtZ(z)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-accent-text)', opacity: 0.7, marginTop: '5px', fontFamily: 'var(--font-mono)' }}>
              ({x % 1 === 0 ? x : x.toFixed(2)} − {mu}) / {sigma.toFixed(1)}
            </div>
          </div>

          {/* Aktif olasılık */}
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-cream)', border: '1px solid var(--color-border)', flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {MODLAR.find(m => m.id === mod)?.label}
            </div>
            <div style={{ fontSize: '34px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text)', lineHeight: 1 }}>
              {pct(aktifP)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-faint)', marginTop: '5px', fontFamily: 'var(--font-mono)' }}>
              p = {fmt(aktifP)}
            </div>
          </div>

          {/* Hızlı özet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { id: 'sol',  l: 'P(X < x)', v: pSol },
              { id: 'sag',  l: 'P(X > x)', v: pSag },
              { id: 'orta', l: 'Merkezi',  v: pOrta },
              { id: 'iki',  l: 'İki kuyruk', v: pIki },
            ].map(s => (
              <div key={s.id} onClick={() => setMod(s.id)} style={{
                padding: '7px 10px', borderRadius: '7px', cursor: 'pointer',
                background: mod === s.id ? 'var(--color-accent-soft)' : 'var(--color-cream)',
                border: `1px solid ${mod === s.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>{s.l}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: mod === s.id ? 'var(--color-accent-text)' : 'var(--color-text-soft)' }}>
                  {pct(s.v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sigma aralıkları */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>Sigma Kuralı</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {sigmaIntervals.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-cream)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {pct(s.p)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Açıklama */}
      <div className="prose-article" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '28px' }}>
        <h2>Z-Skor Nedir?</h2>
        <p>
          Z-skoru, bir değerin ortalamasından kaç standart sapma uzakta olduğunu söyler.
          Formül basit: <strong>Z = (x − μ) / σ</strong>. Z = 0 ortalamada; Z = +1 ortalamanın 1 standart sapma üzerinde demek.
        </p>
        <h2>Ne İşe Yarar?</h2>
        <p>
          Farklı ölçeklerdeki verileri karşılaştırmak için idealdir. Sınav puanı mı, boy ölçümü mü, hisse senedi getirisi mi —
          Z-skoruna çevirince hepsi aynı dile gelir. Ayrıca hipotez testlerinde p-değeri hesaplamak için temel araçtır.
        </p>
        <h2>68-95-99.7 Kuralı</h2>
        <p>
          Normal dağılımda verilerin <strong>%68'i</strong> μ ± 1σ içinde, <strong>%95'i</strong> μ ± 2σ içinde,
          <strong>%99.7'si</strong> μ ± 3σ içinde yer alır. Bu yüzden |Z| &gt; 3 olan değerler çok nadir görülür
          ve aykırı değer işareti sayılabilir.
        </p>
      </div>

    </main>
  );
}
