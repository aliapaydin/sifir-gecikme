'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Veri üreteci ─────────────────────────────────────────────────────────────
function generateDataset(type, n = 200) {
  const X = [], y = [];
  const noise = () => (Math.random() - 0.5) * 0.18;

  if (type === 'xor') {
    for (let i = 0; i < n; i++) {
      const x1 = (Math.random() - 0.5) * 2;
      const x2 = (Math.random() - 0.5) * 2;
      X.push([x1 + noise(), x2 + noise()]);
      y.push(((x1 > 0) !== (x2 > 0)) ? 1 : 0);
    }
  } else if (type === 'circles') {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const inner = i < n / 2;
      const r = inner ? Math.random() * 0.42 : 0.58 + Math.random() * 0.38;
      X.push([r * Math.cos(a) + noise(), r * Math.sin(a) + noise()]);
      y.push(inner ? 0 : 1);
    }
  } else if (type === 'spirals') {
    const half = n / 2;
    for (let i = 0; i < n; i++) {
      const t = (i % half) / half * 3 * Math.PI;
      const r = 0.1 + (t / (3 * Math.PI)) * 0.85;
      const offset = i < half ? 0 : Math.PI;
      X.push([r * Math.cos(t + offset) + noise(), r * Math.sin(t + offset) + noise()]);
      y.push(i < half ? 0 : 1);
    }
  }
  return { X, y };
}

// ─── Model ────────────────────────────────────────────────────────────────────
function buildModel(tf, layerSizes, activation, lr) {
  const m = tf.sequential();
  layerSizes.forEach((units, i) => {
    m.add(tf.layers.dense({
      ...(i === 0 ? { inputShape: [2] } : {}),
      units,
      activation,
      kernelInitializer: 'glorotUniform',
    }));
  });
  m.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  m.compile({
    optimizer: tf.train.adam(lr),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });
  return m;
}

// ─── Karar sınırı çizimi ──────────────────────────────────────────────────────
const GRID = 55;

function drawCanvas(tf, model, canvas, data) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (model) {
    const pts = [];
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++)
        pts.push([(c / (GRID - 1)) * 2 - 1, 1 - (r / (GRID - 1)) * 2]);

    const preds = tf.tidy(() =>
      Array.from(model.predict(tf.tensor2d(pts)).dataSync())
    );

    const cw = W / GRID, ch = H / GRID;
    for (let i = 0; i < GRID * GRID; i++) {
      const p = preds[i];
      // Mavi (#3b82f6) → Turuncu (#f97316)
      ctx.fillStyle = `rgba(${Math.round(59 + 190 * p)},${Math.round(130 - 15 * p)},${Math.round(246 - 224 * p)},0.55)`;
      ctx.fillRect(
        Math.floor((i % GRID) * cw), Math.floor(Math.floor(i / GRID) * ch),
        Math.ceil(cw) + 1, Math.ceil(ch) + 1
      );
    }
  }

  // Veri noktaları
  for (let i = 0; i < data.X.length; i++) {
    const cx = ((data.X[i][0] + 1) / 2) * W;
    const cy = ((1 - (data.X[i][1] + 1) / 2)) * H;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = data.y[i] === 1 ? '#f97316' : '#3b82f6';
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
  }
}

// ─── Kayıp grafiği ────────────────────────────────────────────────────────────
function LossChart({ history }) {
  if (history.length < 2) return (
    <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Eğitim başlayınca görünecek</span>
    </div>
  );
  const min = Math.min(...history), max = Math.max(...history);
  const range = max - min || 0.001;
  const W = 240, H = 64;
  const pts = history.map((v, i) =>
    `${(i / (history.length - 1)) * W},${H - 4 - ((v - min) / range) * (H - 8)}`
  ).join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: '64px' }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lg)" />
      <polyline points={pts} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Ağ diyagramı SVG ─────────────────────────────────────────────────────────
function NetworkDiagram({ layers, activation }) {
  const all = [2, ...layers, 1];
  const W = 200, H = 110;
  const xs = all.map((_, i) => 18 + (i / (all.length - 1)) * (W - 36));
  const ys = (li, ni) => {
    const n = all[li];
    const gap = Math.min(22, (H - 16) / Math.max(n - 1, 1));
    return H / 2 + (ni - (n - 1) / 2) * gap;
  };
  const lines = [];
  for (let l = 0; l < all.length - 1; l++)
    for (let i = 0; i < all[l]; i++)
      for (let j = 0; j < all[l + 1]; j++)
        lines.push(<line key={`${l}-${i}-${j}`} x1={xs[l]} y1={ys(l, i)} x2={xs[l + 1]} y2={ys(l + 1, j)} stroke="var(--color-border)" strokeWidth="0.8" />);

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {lines}
        {all.map((n, l) =>
          Array.from({ length: n }).map((_, i) => (
            <circle key={`n${l}-${i}`}
              cx={xs[l]} cy={ys(l, i)} r="7"
              fill={l === 0 ? 'var(--color-accent-soft)' : l === all.length - 1 ? '#fff8f0' : 'var(--color-cream)'}
              stroke={l === 0 ? 'var(--color-accent)' : l === all.length - 1 ? '#f97316' : 'var(--color-border)'}
              strokeWidth="1.5"
            />
          ))
        )}
      </svg>
      <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
        {all.join(' → ')} · {activation}
      </div>
    </div>
  );
}

// ─── Ana sayfa ────────────────────────────────────────────────────────────────
export default function NNPage() {
  const [dataset,    setDataset]    = useState('circles');
  const [layers,     setLayers]     = useState([4, 4]);
  const [activation, setActivation] = useState('relu');
  const [lr,         setLr]         = useState(0.003);
  const [phase,      setPhase]      = useState('idle');   // idle | training | paused
  const [epoch,      setEpoch]      = useState(0);
  const [lossHist,   setLossHist]   = useState([]);
  const [acc,        setAcc]        = useState('');
  const [isMobile,   setIsMobile]   = useState(false);

  const tfRef      = useRef(null);
  const modelRef   = useRef(null);
  const tfXRef     = useRef(null);
  const tfYRef     = useRef(null);
  const dataRef    = useRef(null);
  const canvasRef  = useRef(null);
  const runningRef = useRef(false);
  const epochRef   = useRef(0);
  const histRef    = useRef([]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // TF.js + ilk veri seti
  useEffect(() => {
    (async () => {
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();
      tfRef.current = tf;
      initData(tf, 'circles');
    })();
    return () => { runningRef.current = false; disposeTensors(); };
  }, []);

  function disposeTensors() {
    try { tfXRef.current?.dispose(); } catch {}
    try { tfYRef.current?.dispose(); } catch {}
    try { modelRef.current?.dispose(); } catch {}
    tfXRef.current = null;
    tfYRef.current = null;
    modelRef.current = null;
  }

  function initData(tf, type) {
    try { tfXRef.current?.dispose(); } catch {}
    try { tfYRef.current?.dispose(); } catch {}
    const data = generateDataset(type);
    dataRef.current = data;
    tfXRef.current = tf.tensor2d(data.X);
    tfYRef.current = tf.tensor2d(data.y, [data.y.length, 1]);
    // canvas'ı noktalarla çiz
    setTimeout(() => drawCanvas(tf, null, canvasRef.current, data), 50);
  }

  // Dataset değişince canvas'ı yenile
  useEffect(() => {
    if (!tfRef.current || !dataRef.current) return;
    drawCanvas(tfRef.current, null, canvasRef.current, dataRef.current);
  }, [dataset]);

  // ─── Eğitim döngüsü ─────────────────────────────────────────────────────────
  const runLoop = useCallback(async () => {
    const tf = tfRef.current;
    while (runningRef.current && modelRef.current && tfXRef.current && tfYRef.current) {
      const result = await modelRef.current.trainOnBatch(tfXRef.current, tfYRef.current);
      const loss = Array.isArray(result) ? result[0] : result;
      const accV = Array.isArray(result) ? result[1] : 0;

      epochRef.current++;
      histRef.current = [...histRef.current.slice(-120), parseFloat(loss.toFixed(4))];

      if (epochRef.current % 4 === 0 || epochRef.current === 1) {
        setEpoch(epochRef.current);
        setLossHist([...histRef.current]);
        setAcc((accV * 100).toFixed(1));
        drawCanvas(tf, modelRef.current, canvasRef.current, dataRef.current);
      }

      await tf.nextFrame();
    }
  }, []);

  const handleStart = async () => {
    const tf = tfRef.current;
    if (!tf) return;

    if (phase === 'paused') {
      runningRef.current = true;
      setPhase('training');
      runLoop();
      return;
    }

    // Sıfırdan başla — yeni model
    try { modelRef.current?.dispose(); } catch {}
    modelRef.current = buildModel(tf, layers, activation, lr);

    epochRef.current = 0;
    histRef.current  = [];
    setEpoch(0);
    setLossHist([]);
    setAcc('');

    runningRef.current = true;
    setPhase('training');
    runLoop();
  };

  const handlePause = () => {
    runningRef.current = false;
    setPhase('paused');
  };

  const handleReset = () => {
    runningRef.current = false;
    try { modelRef.current?.dispose(); } catch {}
    modelRef.current = null;
    epochRef.current = 0;
    histRef.current  = [];
    setPhase('idle');
    setEpoch(0);
    setLossHist([]);
    setAcc('');
    if (tfRef.current) drawCanvas(tfRef.current, null, canvasRef.current, dataRef.current);
  };

  const handleDataset = (type) => {
    runningRef.current = false;
    try { modelRef.current?.dispose(); } catch {}
    modelRef.current = null;
    epochRef.current = 0;
    histRef.current  = [];
    setDataset(type);
    setPhase('idle');
    setEpoch(0);
    setLossHist([]);
    setAcc('');
    if (tfRef.current) initData(tfRef.current, type);
  };

  const addLayer    = () => layers.length < 4 && setLayers(l => [...l, 4]);
  const removeLayer = (i) => layers.length > 1 && setLayers(l => l.filter((_, j) => j !== i));
  const setNeurons  = (i, v) => setLayers(l => l.map((n, j) => j === i ? v : n));

  const CS = isMobile ? 300 : 420;
  const lastLoss = lossHist[lossHist.length - 1];
  const accNum   = parseFloat(acc);

  const datasets = [
    { key: 'xor',     label: 'XOR',       desc: 'Çapraz pattern — doğrusal ayrılamaz' },
    { key: 'circles', label: 'Çemberler', desc: 'İç daire vs dış halka' },
    { key: 'spirals', label: 'Spiraller', desc: 'En zor — derin ağ gerektirir' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .blink { animation: blink 1.2s ease-in-out infinite; }
        input[type=range] { accent-color: var(--color-accent); }
      `}</style>

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: isMobile ? '20px 14px 48px' : '36px 24px 64px' }}>

        {/* ─── Başlık */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              🧠 Sinir Ağı Playground
            </h1>
            {phase === 'training' && (
              <span className="blink" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block', flexShrink: 0 }} />
            )}
          </div>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '14px', margin: 0 }}>
            Katmanları ayarla, veri setini seç, eğit — karar sınırının gerçek zamanlı şekillenişini izle.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: '20px', alignItems: 'start' }}>

          {/* ─── Sol panel — Kontroller */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Veri seti */}
            <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.07em', marginBottom: '10px' }}>VERİ SETİ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {datasets.map(({ key, label, desc }) => (
                  <button key={key} onClick={() => handleDataset(key)} style={{
                    padding: '9px 11px', borderRadius: '8px', border: `1px solid ${dataset === key ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: dataset === key ? 'var(--color-accent-soft)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: dataset === key ? 'var(--color-accent)' : 'var(--color-text)', marginBottom: '1px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mimari */}
            <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.07em', marginBottom: '10px' }}>MİMARİ</div>

              {/* Girdi */}
              <div style={{ padding: '7px 10px', borderRadius: '7px', background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)' }}>
                <span>Girdi</span><span style={{ fontFamily: 'var(--font-mono)' }}>2 nöron</span>
              </div>

              {/* Gizli katmanlar */}
              {layers.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                  <div style={{ flex: 1, padding: '8px 10px', borderRadius: '7px', background: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Katman {i + 1}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{n}</span>
                    </div>
                    <input type="range" min="2" max="8" value={n} style={{ width: '100%' }}
                      onChange={e => setNeurons(i, +e.target.value)} />
                  </div>
                  {layers.length > 1 && (
                    <button onClick={() => removeLayer(i)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>×</button>
                  )}
                </div>
              ))}

              {layers.length < 4 && (
                <button onClick={addLayer} style={{ width: '100%', padding: '7px', borderRadius: '7px', border: '1px dashed var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '12px', marginBottom: '8px' }}>
                  + Katman Ekle
                </button>
              )}

              {/* Çıktı */}
              <div style={{ padding: '7px 10px', borderRadius: '7px', background: '#fff8f0', border: '1px solid #f97316', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#c2410c', marginBottom: '12px' }}>
                <span>Çıktı</span><span style={{ fontFamily: 'var(--font-mono)' }}>1 nöron · sigmoid</span>
              </div>

              {/* Aktivasyon */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>AKTİVASYON</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['relu', 'tanh', 'sigmoid'].map(a => (
                    <button key={a} onClick={() => setActivation(a)} style={{
                      flex: 1, padding: '6px 3px', borderRadius: '7px',
                      border: `1px solid ${activation === a ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: activation === a ? 'var(--color-accent-soft)' : 'transparent',
                      fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                      color: activation === a ? 'var(--color-accent)' : 'var(--color-text-mute)',
                      fontFamily: 'var(--font-mono)',
                    }}>{a}</button>
                  ))}
                </div>
              </div>

              {/* Öğrenme hızı */}
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>ÖĞRENME HIZI</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[0.001, 0.003, 0.01, 0.03].map(rate => (
                    <button key={rate} onClick={() => setLr(rate)} style={{
                      flex: 1, padding: '5px 2px', borderRadius: '7px',
                      border: `1px solid ${lr === rate ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: lr === rate ? 'var(--color-accent-soft)' : 'transparent',
                      fontSize: '10px', cursor: 'pointer',
                      color: lr === rate ? 'var(--color-accent)' : 'var(--color-text-mute)',
                      fontFamily: 'var(--font-mono)',
                    }}>{rate}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {phase === 'training' ? (
                <button onClick={handlePause} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--color-cream-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  ⏸ Duraklat
                </button>
              ) : (
                <button onClick={handleStart} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  {phase === 'paused' ? '▶ Devam Et' : '▶ Eğit'}
                </button>
              )}
              <button onClick={handleReset} style={{ padding: '12px 15px', borderRadius: '10px', background: 'transparent', color: 'var(--color-text-mute)', border: '1px solid var(--color-border)', fontSize: '16px', cursor: 'pointer', lineHeight: 1 }}>
                ↺
              </button>
            </div>

            {/* İpuçları */}
            {phase === 'idle' && (
              <div style={{ padding: '12px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.6 }}>
                💡 <strong style={{ color: 'var(--color-text)' }}>İpucu:</strong> Spiraller için en az 2 gizli katman ve <span style={{ fontFamily: 'var(--font-mono)' }}>tanh</span> aktivasyonu dene.
              </div>
            )}

          </div>

          {/* ─── Sağ panel — Görselleştirme */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Canvas */}
            <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.07em' }}>KARAR SINIRI</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--color-text-mute)', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} /> Sınıf 0
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }} /> Sınıf 1
                  </span>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={CS}
                height={CS}
                style={{ display: 'block', width: '100%', aspectRatio: '1/1', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
            </div>

            {/* İstatistik kartlar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { label: 'Epoch', val: epoch > 0 ? epoch.toLocaleString('tr') : '—', mono: true },
                { label: 'Kayıp',    val: lastLoss != null ? lastLoss.toFixed(4) : '—', mono: true },
                {
                  label: 'Doğruluk',
                  val: acc ? `%${acc}` : '—',
                  color: accNum > 90 ? '#10b981' : accNum > 75 ? 'var(--color-accent)' : undefined,
                },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px 10px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '5px', fontWeight: 600, letterSpacing: '0.04em' }}>{s.label}</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: s.color || 'var(--color-text)', fontFamily: s.mono ? 'var(--font-mono)' : undefined }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Kayıp + Diyagram */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>

              {/* Kayıp grafiği */}
              <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.07em' }}>KAYIP EĞRİSİ</span>
                  {lastLoss != null && (
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: 700 }}>{lastLoss.toFixed(4)}</span>
                  )}
                </div>
                <LossChart history={lossHist} />
              </div>

              {/* Ağ diyagramı */}
              <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.07em', marginBottom: '6px' }}>YAPI</div>
                <NetworkDiagram layers={layers} activation={activation} />
              </div>

            </div>

            {/* Açıklama */}
            <div style={{ padding: '14px 16px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { icon: '📐', title: 'Karar Sınırı', desc: '50×50 grid üzerinde tahmin yapılır, renkler sınıfı gösterir' },
                  { icon: '⚡', title: 'WebGL', desc: 'TensorFlow.js tarayıcı GPU\'nuzda eğitir, sunucu yok' },
                  { icon: '🔬', title: 'Dene', desc: 'Spiraller için derin ağ + tanh, XOR için tek katman yeter' },
                ].map(s => (
                  <div key={s.icon}>
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
