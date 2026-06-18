'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── YARDIMCI MATEMATİK ────────────────────────────────────────────────────

function randn() {
  // Box-Muller dönüşümü → standart normal
  let u, v;
  do { u = Math.random(); } while (u === 0);
  do { v = Math.random(); } while (v === 0);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function mean(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; }
function std(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
}
function quantile(sorted, p) {
  const idx = p * (sorted.length - 1);
  const lo  = Math.floor(idx), hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// ─── POPÜLASYON ÜRETİCİ ────────────────────────────────────────────────────

const POP_SIZE = 5000;

function generatePopulation(type) {
  const arr = [];
  for (let i = 0; i < POP_SIZE; i++) {
    switch (type) {
      case 'uniform':
        arr.push(Math.random() * 100);
        break;
      case 'skewed': {
        // Sağa çarpık — maaş/gelir dağılımı benzeri
        const u = Math.random();
        arr.push(Math.min(100, -Math.log(1 - u * 0.9999) * 12 + 10));
        break;
      }
      case 'bimodal': {
        // İki tepe — iki farklı grup
        const group = Math.random() < 0.45;
        arr.push(group ? 25 + randn() * 8 : 72 + randn() * 9);
        break;
      }
      case 'normal':
        arr.push(50 + randn() * 15);
        break;
    }
  }
  return arr.map(v => Math.max(0, Math.min(100, v)));
}

// ─── HİSTOGRAM ARAÇLARI ────────────────────────────────────────────────────

function makeBins(data, nBins = 30, minVal = 0, maxVal = 100) {
  const bins = Array(nBins).fill(0);
  const w = (maxVal - minVal) / nBins;
  data.forEach(v => {
    const i = Math.min(nBins - 1, Math.floor((v - minVal) / w));
    if (i >= 0) bins[i]++;
  });
  return bins;
}

// ─── SVG HİSTOGRAM BİLEŞENİ ────────────────────────────────────────────────

function Histogram({
  bins, color = '#6366f1', height = 120, label,
  vLines = [], minVal = 0, maxVal = 100,
  highlight, // {lo, hi} — shaded region
}) {
  const maxBin = Math.max(...bins, 1);
  const nBins  = bins.length;
  const W = 400, H = height;
  const PAD = { t: 8, b: 28, l: 8, r: 8 };
  const w = (W - PAD.l - PAD.r) / nBins;
  const bw = (maxVal - minVal) / nBins;

  return (
    <svg viewBox={`0 0 ${W} ${H + PAD.t + PAD.b}`} style={{ width: '100%', height: 'auto' }}>
      {/* Shaded region */}
      {highlight && (() => {
        const x1 = PAD.l + ((highlight.lo - minVal) / (maxVal - minVal)) * (W - PAD.l - PAD.r);
        const x2 = PAD.l + ((highlight.hi - minVal) / (maxVal - minVal)) * (W - PAD.l - PAD.r);
        return <rect x={x1} y={PAD.t} width={x2 - x1} height={H} fill={color} opacity="0.12" />;
      })()}

      {/* Bars */}
      {bins.map((v, i) => {
        const barH = (v / maxBin) * H;
        const x = PAD.l + i * w;
        const binMid = minVal + (i + 0.5) * bw;
        const inCI = highlight && binMid >= highlight.lo && binMid <= highlight.hi;
        return (
          <rect key={i} x={x + 0.5} y={PAD.t + H - barH} width={Math.max(1, w - 1)}
            height={barH} fill={color} opacity={inCI ? 0.85 : 0.45}
            style={{ transition: 'height .12s, y .12s' }}
          />
        );
      })}

      {/* Vertical lines (mean, CI bounds) */}
      {vLines.map(({ x: val, color: lc, dash, label: ll }, i) => {
        const xPx = PAD.l + ((val - minVal) / (maxVal - minVal)) * (W - PAD.l - PAD.r);
        return (
          <g key={i}>
            <line x1={xPx} x2={xPx} y1={PAD.t} y2={PAD.t + H}
              stroke={lc || '#fff'} strokeWidth="1.5" strokeDasharray={dash ? '4 3' : undefined} />
            {ll && <text x={xPx + 3} y={PAD.t + 12} fontSize="9" fill={lc || '#fff'} fontWeight="700">{ll}</text>}
          </g>
        );
      })}

      {/* X axis ticks */}
      {[0, 25, 50, 75, 100].map(v => {
        const xPx = PAD.l + (v / (maxVal - minVal)) * (W - PAD.l - PAD.r);
        return (
          <g key={v}>
            <line x1={xPx} x2={xPx} y1={PAD.t + H} y2={PAD.t + H + 4} stroke="var(--color-border)" strokeWidth="1" />
            <text x={xPx} y={PAD.t + H + 16} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">{v}</text>
          </g>
        );
      })}

      {/* Baseline */}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + H} y2={PAD.t + H} stroke="var(--color-border)" strokeWidth="1" />

      {/* Label */}
      {label && <text x={W / 2} y={H + PAD.t + PAD.b - 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">{label}</text>}
    </svg>
  );
}

// ─── ANA BİLEŞEN ────────────────────────────────────────────────────────────

const POP_TYPES = [
  { id: 'normal',   label: 'Normal',     emoji: '🔔', desc: 'Simetrik, çan eğrisi — boy, sınav notu' },
  { id: 'skewed',   label: 'Çarpık',     emoji: '📊', desc: 'Sağa uzanan kuyruk — maaş, servet' },
  { id: 'bimodal',  label: 'İki Tepeli', emoji: '⛰️', desc: 'İki grup — erkek/kadın boy' },
  { id: 'uniform',  label: 'Düzgün',     emoji: '📏', desc: 'Her değer eşit olası — zar atışı' },
];

export default function BootstrapOrnekleme() {
  const [popType, setPopType]       = useState('skewed');
  const [population, setPopulation] = useState([]);
  const [n, setN]                   = useState(30);
  const [sample, setSample]         = useState([]);
  const [samplingMeans, setSamplingMeans] = useState([]);
  const [isRunning, setIsRunning]   = useState(false);
  const [bootstrapMeans, setBootstrapMeans] = useState([]);
  const [isBootRunning, setIsBootRunning] = useState(false);
  const [animStep, setAnimStep]     = useState(0);
  const cancelRef = useRef(false);

  // Popülasyonu üret
  useEffect(() => {
    const pop = generatePopulation(popType);
    setPopulation(pop);
    setSample([]);
    setSamplingMeans([]);
    setBootstrapMeans([]);
    setAnimStep(0);
  }, [popType]);

  const popMean = population.length ? mean(population) : 0;

  // Tek örneklem çek
  const drawSample = useCallback(() => {
    const s = Array.from({ length: n }, () => population[Math.floor(Math.random() * population.length)]);
    setSample(s);
    setBootstrapMeans([]);
  }, [population, n]);

  // 1000 örneklem çek — animasyonlu
  const runSampling = useCallback(async () => {
    setIsRunning(true);
    cancelRef.current = false;
    setSamplingMeans([]);

    const TOTAL = 1000, BATCH = 20, DELAY = 16;
    const means = [];
    for (let i = 0; i < TOTAL; i += BATCH) {
      if (cancelRef.current) break;
      const batch = Array.from({ length: Math.min(BATCH, TOTAL - i) }, () => {
        const s = Array.from({ length: n }, () => population[Math.floor(Math.random() * population.length)]);
        return mean(s);
      });
      means.push(...batch);
      setSamplingMeans([...means]);
      setAnimStep(means.length);
      await new Promise(r => setTimeout(r, DELAY));
    }
    setIsRunning(false);
  }, [population, n]);

  // Bootstrap
  const runBootstrap = useCallback(async () => {
    if (!sample.length) return;
    setIsBootRunning(true);
    cancelRef.current = false;
    setBootstrapMeans([]);

    const TOTAL = 2000, BATCH = 40, DELAY = 16;
    const means = [];
    for (let i = 0; i < TOTAL; i += BATCH) {
      if (cancelRef.current) break;
      const batch = Array.from({ length: Math.min(BATCH, TOTAL - i) }, () => {
        const bs = Array.from({ length: sample.length }, () => sample[Math.floor(Math.random() * sample.length)]);
        return mean(bs);
      });
      means.push(...batch);
      setBootstrapMeans([...means]);
      await new Promise(r => setTimeout(r, DELAY));
    }
    setIsBootRunning(false);
  }, [sample]);

  const stopAll = () => { cancelRef.current = true; setIsRunning(false); setIsBootRunning(false); };

  // Hesaplamalar
  const sampleMean = sample.length ? mean(sample) : null;
  const sampleStd  = sample.length > 1 ? std(sample) : null;
  const semFormula = sampleStd && n ? sampleStd / Math.sqrt(n) : null;

  const samplingMean = samplingMeans.length ? mean(samplingMeans) : null;
  const samplingStd  = samplingMeans.length > 1 ? std(samplingMeans) : null;

  const bootSorted = [...bootstrapMeans].sort((a, b) => a - b);
  const bootLo  = bootSorted.length ? quantile(bootSorted, 0.025) : null;
  const bootHi  = bootSorted.length ? quantile(bootSorted, 0.975) : null;
  const bootMeanVal = bootSorted.length ? mean(bootstrapMeans) : null;

  // Histogramlar
  const popBins     = makeBins(population, 30);
  const sampleBins  = makeBins(sample, 30);
  const sampBins    = makeBins(samplingMeans, 30, Math.max(0, popMean - 50), Math.min(100, popMean + 50));
  const bootBins    = makeBins(bootstrapMeans, 30, Math.max(0, (sampleMean ?? 50) - 40), Math.min(100, (sampleMean ?? 50) + 40));

  const sampMin = Math.max(0, popMean - 50), sampMax = Math.min(100, popMean + 50);
  const bootMin = Math.max(0, (sampleMean ?? 50) - 40), bootMax = Math.min(100, (sampleMean ?? 50) + 40);

  const S = {
    card: { background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '16px', padding: '22px 26px', marginBottom: '24px' },
    h2: { fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px', letterSpacing: '-0.2px' },
    sub: { fontSize: '13px', color: 'var(--color-text-mute)', lineHeight: 1.6, margin: '0 0 18px' },
    stat: { background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px 14px' },
  };

  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <style>{`
        .bs-btn { padding: 9px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all .15s; }
        .bs-btn:disabled { opacity: .45; cursor: not-allowed; }
        .bs-chip { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--color-border); background: var(--color-cream-card); color: var(--color-text-mute); transition: all .15s; white-space: nowrap; }
        .bs-chip:hover { border-color: #6366f155; }
        .bs-chip.active { background: rgba(99,102,241,0.1); border-color: #6366f1; color: #818cf8; }
        @media(max-width:600px){ .two-col{ grid-template-columns:1fr!important; } }
      `}</style>

      {/* ─── BAŞLIK ─── */}
      <a href="/icerikler" style={{ fontSize: '13px', color: 'var(--color-text-mute)', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← İçerikler</a>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(20,184,166,0.1)', color: '#14b8a6', fontSize: '11px', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>İNTERAKTİF · SİMÜLASYON</span>
        <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Örnekleme & Bootstrap:<br />Belirsizliği Ölç
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-mute)', lineHeight: 1.65, maxWidth: '620px', margin: 0 }}>
          85 milyon nüfustan 30 kişiyle neden güvenilir sonuç çıkarılabilir? Popülasyondan örneklem çek, dağılımın nasıl şekillendiğini izle, bootstrap ile güven aralığını hesapla.
        </p>
      </div>

      {/* ─── 1. POPÜLASYON SEÇ ─── */}
      <div style={S.card}>
        <h2 style={S.h2}>🌍 1. Popülasyonu Seç</h2>
        <p style={S.sub}>Gerçek hayatta popülasyonun tam dağılımını bilmeyiz — ama burada kontrol bizde. Farklı şekillerde dene.</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {POP_TYPES.map(p => (
            <button key={p.id} onClick={() => setPopType(p.id)}
              className={`bs-chip${popType === p.id ? ' active' : ''}`}>
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '14px' }}>
          {POP_TYPES.find(p => p.id === popType)?.desc} · Popülasyon ortalaması:{' '}
          <strong style={{ color: 'var(--color-accent)' }}>{popMean.toFixed(2)}</strong> · N = {POP_SIZE.toLocaleString('tr-TR')}
        </div>
        <Histogram bins={popBins} color="#6366f1" height={100} label="Popülasyon dağılımı (0–100)"
          vLines={[{ x: popMean, color: '#818cf8', label: `μ=${popMean.toFixed(1)}` }]} />
        <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.07)', fontSize: '12px', color: 'var(--color-text-mute)' }}>
          💡 <strong>Çarpık dağılım</strong> dene — sampling dağılımının yine de normal görünmesi Merkezi Limit Teoremi'nin büyüsüdür.
        </div>
      </div>

      {/* ─── 2. ÖRNEKLEM ÇEK ─── */}
      <div style={S.card}>
        <h2 style={S.h2}>🎲 2. Tek Örneklem Çek</h2>
        <p style={S.sub}>Popülasyondan rastgele n kişi seçiyoruz. Bu bizim "anketimiz".</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>
              n = <strong style={{ color: 'var(--color-accent)', fontSize: '15px' }}>{n}</strong>
            </span>
            <input type="range" min={5} max={200} value={n} onChange={e => { setN(+e.target.value); setSample([]); setBootstrapMeans([]); }}
              style={{ flex: 1, accentColor: '#6366f1' }} />
          </div>
          <button className="bs-btn" onClick={drawSample}
            style={{ background: '#6366f1', color: '#fff' }}>
            🎲 {n} Kişi Örnekle
          </button>
        </div>

        {sample.length > 0 ? (
          <>
            <Histogram bins={sampleBins} color="#8b5cf6" height={90} label={`Örneklem (n=${n})`}
              vLines={[
                { x: popMean, color: '#6366f155', dash: true, label: `μ=${popMean.toFixed(1)}` },
                { x: sampleMean, color: '#a78bfa', label: `x̄=${sampleMean.toFixed(1)}` },
              ]} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: '10px', marginTop: '14px' }} className="two-col">
              {[
                { label: 'Örneklem ort. (x̄)', val: sampleMean?.toFixed(2), color: '#a78bfa' },
                { label: 'Gerçek ort. (μ)',    val: popMean.toFixed(2),     color: '#6366f1' },
                { label: 'Hata',               val: Math.abs(sampleMean - popMean).toFixed(2), color: '#f59e0b' },
                { label: 'Std. sapma (s)',      val: sampleStd?.toFixed(2),  color: 'var(--color-text)' },
                { label: 'Standart hata (SE)',  val: semFormula?.toFixed(2), color: '#10b981' },
              ].map(({ label, val, color }) => (
                <div key={label} style={S.stat}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: 'monospace' }}>{val ?? '—'}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.08)', fontSize: '12px', color: 'var(--color-text-mute)' }}>
              <strong>SE = s / √n = {sampleStd?.toFixed(2)} / √{n} = {semFormula?.toFixed(2)}</strong>
              <br />Standart hata, örneklem ortalamasının ne kadar "oynayacağını" ölçer. n büyüdükçe küçülür.
            </div>
          </>
        ) : (
          <div style={{ height: '90px', background: 'var(--color-cream)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-faint)', fontSize: '13px' }}>
            Yukarıdaki butona tıkla → örneklem burada görünecek
          </div>
        )}
      </div>

      {/* ─── 3. ÖRNEKLEME DAĞILIMI ─── */}
      <div style={S.card}>
        <h2 style={S.h2}>📈 3. Örnekleme Dağılımı</h2>
        <p style={S.sub}>
          Aynı n'lik örneklemi 1000 kez çekip her seferinde ortalamasını hesaplıyoruz.
          Bu ortalamaların dağılımı <strong>örnekleme dağılımı</strong>'dır — ve neredeyse her zaman normal görünür!
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="bs-btn" onClick={runSampling} disabled={isRunning || !population.length}
            style={{ background: '#14b8a6', color: '#fff' }}>
            {isRunning ? `Çekiliyor… ${animStep}/1000` : '▶ 1000 Örneklem Çek'}
          </button>
          {isRunning && (
            <button className="bs-btn" onClick={stopAll} style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              ■ Durdur
            </button>
          )}
          {samplingMeans.length > 0 && !isRunning && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>✓ {samplingMeans.length} örneklem tamamlandı</span>
          )}
        </div>

        {samplingMeans.length > 0 ? (
          <>
            <Histogram bins={sampBins} color="#14b8a6" height={110}
              label={`Örneklem ortalamaları (her biri n=${n})`}
              minVal={sampMin} maxVal={sampMax}
              vLines={[
                { x: popMean,     color: '#6366f188', dash: true, label: `μ=${popMean.toFixed(1)}` },
                { x: samplingMean, color: '#2dd4bf', label: `x̄x̄=${samplingMean?.toFixed(1)}` },
              ]} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '10px', marginTop: '14px' }}>
              {[
                { label: 'Dağılım ort.', val: samplingMean?.toFixed(3), color: '#2dd4bf', note: '≈ μ' },
                { label: 'Dağılım std.',  val: samplingStd?.toFixed(3),  color: '#14b8a6', note: '≈ SE' },
                { label: 'Teorik SE',    val: semFormula?.toFixed(3),    color: '#6366f1', note: 'σ/√n' },
                { label: 'Örneklem n',   val: n, color: 'var(--color-text)' },
              ].map(({ label, val, color, note }) => (
                <div key={label} style={S.stat}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>{label} {note && <span style={{ color: '#6366f155' }}>{note}</span>}</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color, fontFamily: 'monospace' }}>{val ?? '—'}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: 'var(--color-correct-bg)', border: '0.5px solid var(--color-correct-border)' }}>
              <strong style={{ fontSize: '13px', color: 'var(--color-correct-text)' }}>✓ Merkezi Limit Teoremi çalışıyor!</strong>
              <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', margin: '4px 0 0', lineHeight: 1.6 }}>
                Popülasyon <strong>{POP_TYPES.find(p => p.id === popType)?.label}</strong> dağılımlı olsa da örneklem ortalamaları normal dağılıma yaklaşıyor.
                Dağılım std. {samplingStd?.toFixed(2)} ≈ SE = s/√n = {semFormula?.toFixed(2)}.
                n büyüdükçe bu tepe daralır, tahminimiz kesinleşir.
              </p>
            </div>

            {/* n karşılaştırma ipucu */}
            <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.07)', fontSize: '12px', color: 'var(--color-text-mute)' }}>
              💡 n kaydıracını değiştirip tekrar çalıştır — n artınca tepe nasıl daralıyor izle.
            </div>
          </>
        ) : (
          <div style={{ height: '110px', background: 'var(--color-cream)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-faint)', fontSize: '13px' }}>
            "1000 Örneklem Çek" butonuna bas → dağılım burada şekillenecek
          </div>
        )}
      </div>

      {/* ─── 4. BOOTSTRAP ─── */}
      <div style={S.card}>
        <h2 style={S.h2}>🔁 4. Bootstrap — Tek Örneklemden Güven Aralığı</h2>
        <p style={S.sub}>
          Gerçek hayatta popülasyona erişemeyiz — elimizde yalnızca <strong>bir</strong> örneklem var.
          Bootstrap, bu tek örneklemden <em>yeniden örnekleme</em> yaparak tahmin belirsizliğini ölçer.
        </p>

        {sample.length === 0 && (
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--color-amber-bg)', fontSize: '13px', color: 'var(--color-amber-text)', marginBottom: '16px' }}>
            ⚠ Önce <strong>2. bölümden</strong> bir örneklem çek.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="bs-btn" onClick={runBootstrap} disabled={isBootRunning || sample.length === 0}
            style={{ background: '#f59e0b', color: '#fff' }}>
            {isBootRunning ? `Bootstrap… ${bootstrapMeans.length}/2000` : '🔁 2000 Bootstrap Tekrarı'}
          </button>
          {isBootRunning && (
            <button className="bs-btn" onClick={stopAll} style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              ■ Durdur
            </button>
          )}
        </div>

        {bootstrapMeans.length > 0 ? (
          <>
            <Histogram bins={bootBins} color="#f59e0b" height={110}
              label="Bootstrap dağılımı (yeniden örneklem ortalamaları)"
              minVal={bootMin} maxVal={bootMax}
              highlight={bootLo && bootHi ? { lo: bootLo, hi: bootHi } : undefined}
              vLines={[
                { x: sampleMean, color: '#a78bfa', dash: true, label: `x̄=${sampleMean?.toFixed(1)}` },
                { x: popMean,    color: '#6366f155', dash: true, label: `μ=${popMean.toFixed(1)}` },
                { x: bootLo,  color: '#fbbf24', label: `%2.5` },
                { x: bootHi,  color: '#fbbf24', label: `%97.5` },
              ].filter(v => v.x != null)} />

            <div style={{ marginTop: '16px', padding: '18px 20px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.05))', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '6px' }}>%95 Bootstrap Güven Aralığı</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                  [{bootLo?.toFixed(2)}, {bootHi?.toFixed(2)}]
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '8px', lineHeight: 1.6 }}>
                Popülasyon ortalaması μ = <strong>{popMean.toFixed(2)}</strong> →{' '}
                {popMean >= bootLo && popMean <= bootHi
                  ? <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Güven aralığının içinde!</span>
                  : <span style={{ color: '#ef4444', fontWeight: 600 }}>✗ Bu seferlik dışarıda kaldı — %5 ihtimalle bu olur.</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '10px', marginTop: '14px' }}>
              {[
                { label: 'Alt sınır (%2.5)',   val: bootLo?.toFixed(3),      color: '#fbbf24' },
                { label: 'Üst sınır (%97.5)',  val: bootHi?.toFixed(3),      color: '#fbbf24' },
                { label: 'Aralık genişliği',   val: (bootHi - bootLo)?.toFixed(3), color: '#f59e0b' },
                { label: 'Boot. ort.',          val: bootMeanVal?.toFixed(3), color: 'var(--color-text)' },
                { label: 'Gerçek μ',           val: popMean.toFixed(3),      color: '#6366f1' },
                { label: 'Tekrar sayısı',       val: bootstrapMeans.length,   color: 'var(--color-text-mute)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={S.stat}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color, fontFamily: 'monospace' }}>{val ?? '—'}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.07)', fontSize: '12px', color: 'var(--color-text-mute)' }}>
              💡 <strong>n kaydıracını artır</strong>, yeni örneklem çek, tekrar bootstrap uygula — güven aralığının nasıl daraldığını gör.
            </div>
          </>
        ) : (
          <div style={{ height: '110px', background: 'var(--color-cream)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-faint)', fontSize: '13px' }}>
            Bootstrap uygula → güven aralığı burada şekillenecek
          </div>
        )}
      </div>

      {/* ─── TEMEL KAVRAMLAR ─── */}
      <div style={S.card}>
        <h2 style={S.h2}>📚 Temel Kavramlar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              q: 'Neden 1000 kişilik anket 85 milyonu temsil eder?',
              a: 'Standart hata SE = σ/√n formülüne göre çalışır. σ=15 (tipik) ve n=1000 için SE ≈ 0.47. Bu, tahminimizin gerçek ortalamadan yalnızca yarım puan sapabileceği anlamına gelir — yeterince hassas. n\'yi 4 katına çıkarmak SE\'yi yalnızca yarıya indirir (√4=2), bu yüzden 85 milyon yerine 4000 kişilik anket yapmak çok az şey katıyor.',
            },
            {
              q: 'Merkezi Limit Teoremi (CLT) nedir?',
              a: 'Popülasyon ne kadar "çirkin" (çarpık, bimodal, düzgün) olursa olsun, yeterince büyük n\'de örneklem ortalamaları normal dağılıma yaklaşır. Kural: n ≥ 30 çoğu durumda yeterli. Bu teoremi istatistiğin "sihiri" olarak düşünebilirsin — parametrik testlerin çoğu buna dayanır.',
            },
            {
              q: 'Bootstrap ne zaman kullanılır?',
              a: 'Teorik formülün olmadığı veya karmaşık olduğu durumlarda: medyan, oran, korelasyon gibi istatistikler için. Popülasyon dağılımı hakkında varsayımda bulunmak istemediğinde. Küçük örneklemlerde CLT\'ye güvenilemeyecek durumlarda. Modern makine öğrenmesinde model güvenilirlik aralığı için de kullanılır.',
            },
            {
              q: '%95 güven aralığı ne anlama gelir?',
              a: 'Yanlış anlaşılan istatistik kavramlarının başında gelir. "Gerçek parametre %95 ihtimalle bu aralıkta" DEĞİLDİR. Doğrusu: "Aynı yöntemle 100 deney yapsak, üretilen 100 güven aralığının 95\'i gerçek parametreyi kapsar." Bu sayfada birkaç kez örneklem çekip bootstrap uygularsan, bazen μ\'nun aralık dışında kaldığını göreceksin — işte o %5\'lik durum.',
            },
            {
              q: 'Örnekleme hatası vs. ölçüm hatası farkı?',
              a: 'Örnekleme hatası: rastgele seçimden kaynaklanır, n artınca azalır, formülle ölçülür. Ölçüm hatası: yanlı soru, anket tasarımı, yanıt eğilimi gibi sistematik sorunlardan kaynaklanır, n artınca azalmaz, istatistiksel yöntemlerle düzeltilmez. 85 milyon kişiye sormak da yanlı bir soruyla yapılırsa yanlış sonuç verir.',
            },
          ].map(({ q, a }) => (
            <details key={q} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px' }}>
              <summary style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {q} <span style={{ color: 'var(--color-text-mute)', fontSize: '14px', marginLeft: '8px', flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '10px 0 0', lineHeight: 1.65 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── ÖZET ─── */}
      <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(20,184,166,0.05))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', padding: '20px 24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>🗂 Formül Özeti</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '10px' }}>
          {[
            { name: 'Standart Hata', formula: 'SE = s / √n', desc: 'Örneklem ort. dalgalanması' },
            { name: '%95 Normal CI',  formula: 'x̄ ± 1.96 × SE', desc: 'Parametrik güven aralığı' },
            { name: 'Bootstrap CI',   formula: 'P2.5 — P97.5',   desc: 'Yeniden örneklem yüzdelikleri' },
            { name: 'CLT Koşulu',    formula: 'n ≥ 30',          desc: 'Genellikle yeterli' },
          ].map(({ name, formula, desc }) => (
            <div key={name} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{name}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#818cf8', marginBottom: '3px' }}>{formula}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
