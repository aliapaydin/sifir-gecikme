'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── MNIST + Model sabitleri ───────────────────────────────────────────────
const SPRITE_URL   = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const LABELS_URL   = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';
const MODEL_KEY    = 'indexeddb://sifirgecikme-mnist-v6';
const N_TOTAL      = 65000;
const N_TRAIN      = 11000;
const TEST_OFFSET  = 55000;
const N_TEST       = 1000;
const IMG_SIZE     = 784;
const N_CLASSES    = 10;
const EPOCHS       = 5;
const BATCH_SIZE   = 64;

function buildModel(tf) {
  const m = tf.sequential();
  m.add(tf.layers.conv2d({ inputShape: [28, 28, 1], kernelSize: 5, filters: 8, strides: 1, activation: 'relu', kernelInitializer: 'varianceScaling' }));
  m.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
  m.add(tf.layers.conv2d({ kernelSize: 5, filters: 16, strides: 1, activation: 'relu', kernelInitializer: 'varianceScaling' }));
  m.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
  m.add(tf.layers.flatten());
  m.add(tf.layers.dense({ units: N_CLASSES, kernelInitializer: 'varianceScaling', activation: 'softmax' }));
  m.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
  return m;
}

// ─── Component ────────────────────────────────────────────────────────────
export default function CizPage() {
  const [phase,    setPhase]    = useState('init');   // init|idle|loading|training|ready|error
  const [loadPct,  setLoadPct]  = useState(0);
  const [batch,    setBatch]    = useState({ loss: '—', acc: '—', pct: 0 });
  const [epochLog, setEpochLog] = useState([]);       // {n, tAcc, vAcc}[]
  const [pred,     setPred]     = useState(null);     // {digit, conf, probs}
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wasCached,setWasCached]= useState(false);
  const [errMsg,   setErrMsg]   = useState('');

  const canvasRef  = useRef(null);
  const prevRef    = useRef(null);
  const tfLib      = useRef(null);
  const modelRef   = useRef(null);
  const isDown     = useRef(false);
  const lastPt     = useRef({ x: 0, y: 0 });
  const timer      = useRef(null);

  // isMobile
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // TF.js başlat + önbellek kontrol
  useEffect(() => {
    (async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        tfLib.current = tf;
        try {
          const saved = await tf.loadLayersModel(MODEL_KEY);
          modelRef.current = saved;
          setWasCached(true);
          setPhase('ready');
        } catch {
          setPhase('idle');
        }
      } catch (e) {
        setErrMsg(String(e));
        setPhase('error');
      }
    })();
  }, []);

  // Canvas siyah zemin
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [phase]);

  // ─── Veri yükleme ─────────────────────────────────────────────────────────
  const loadData = async () => {
    setPhase('loading'); setLoadPct(0);
    const resp  = await fetch(SPRITE_URL);
    const total = parseInt(resp.headers.get('Content-Length') || '0');
    const rdr   = resp.body.getReader();
    const chunks = []; let recv = 0;
    for (;;) {
      const { done, value } = await rdr.read();
      if (done) break;
      chunks.push(value); recv += value.length;
      if (total) setLoadPct(Math.round(recv / total * 72));
    }
    const blobUrl = URL.createObjectURL(new Blob(chunks));
    const img = new Image(); img.src = blobUrl;
    await new Promise(r => { img.onload = r; });

    const oc = document.createElement('canvas');
    oc.width = img.width; oc.height = img.height;
    oc.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(blobUrl);
    setLoadPct(80);

    const pixels = new Float32Array(N_TOTAL * IMG_SIZE);
    const chunk  = 5000;
    const ctx    = oc.getContext('2d');
    for (let i = 0; i < N_TOTAL / chunk; i++) {
      const id = ctx.getImageData(0, i * chunk, img.width, chunk);
      for (let j = 0; j < id.data.length / 4; j++)
        pixels[i * chunk * IMG_SIZE + j] = id.data[j * 4] / 255;
    }
    setLoadPct(92);

    const labResp = await fetch(LABELS_URL);
    const labels  = new Uint8Array(await labResp.arrayBuffer());
    setLoadPct(100);
    return { pixels, labels };
  };

  // ─── Eğitim ───────────────────────────────────────────────────────────────
  const startTraining = async () => {
    const tf = tfLib.current;
    if (!tf) return;
    try {
      const { pixels, labels } = await loadData();
      setPhase('training'); setEpochLog([]);

      // Stride sampling: MNIST sprite is sorted by class (first ~5923 = all "0").
      // Taking slice(0, N_TRAIN) gives only 0s. Sample every 10th across all 55000 instead.
      const trainStride = Math.floor(55000 / N_TRAIN);
      const sampTrain   = new Float32Array(N_TRAIN * IMG_SIZE);
      const sampTrainL  = new Uint8Array(N_TRAIN);
      for (let i = 0; i < N_TRAIN; i++) {
        const src = i * trainStride;
        sampTrain.set(pixels.subarray(src * IMG_SIZE, (src + 1) * IMG_SIZE), i * IMG_SIZE);
        // labels is one-hot (10 bytes per image) — find the index of the 1
        const off = src * N_CLASSES;
        let cls = 0;
        for (let j = 1; j < N_CLASSES; j++) if (labels[off + j] === 1) { cls = j; break; }
        sampTrainL[i] = cls;
      }
      const testStride = Math.floor(10000 / N_TEST);
      const sampTest   = new Float32Array(N_TEST * IMG_SIZE);
      const sampTestL  = new Uint8Array(N_TEST);
      for (let i = 0; i < N_TEST; i++) {
        const src = TEST_OFFSET + i * testStride;
        sampTest.set(pixels.subarray(src * IMG_SIZE, (src + 1) * IMG_SIZE), i * IMG_SIZE);
        const off = src * N_CLASSES;
        let cls = 0;
        for (let j = 1; j < N_CLASSES; j++) if (labels[off + j] === 1) { cls = j; break; }
        sampTestL[i] = cls;
      }
      const trainX = tf.tensor4d(sampTrain, [N_TRAIN, 28, 28, 1]);
      const testX  = tf.tensor4d(sampTest,  [N_TEST,  28, 28, 1]);
      const trainY = tf.oneHot(tf.tensor1d(Array.from(sampTrainL), 'int32'), N_CLASSES);
      const testY  = tf.oneHot(tf.tensor1d(Array.from(sampTestL),  'int32'), N_CLASSES);

      const m = buildModel(tf);
      modelRef.current = m;
      const totalBatches = Math.ceil(N_TRAIN / BATCH_SIZE);
      const log = [];

      await m.fit(trainX, trainY, {
        batchSize: BATCH_SIZE, validationData: [testX, testY],
        epochs: EPOCHS, shuffle: true,
        callbacks: {
          onBatchEnd: (b, s) => setBatch({
            loss: s.loss.toFixed(4),
            acc:  ((s.acc ?? 0) * 100).toFixed(1) + '%',
            pct:  Math.round((b + 1) / totalBatches * 100),
          }),
          onEpochEnd: (e, s) => {
            const entry = { n: e + 1, tAcc: ((s.acc ?? 0) * 100).toFixed(1), vAcc: ((s.val_acc ?? 0) * 100).toFixed(1) };
            log.push(entry); setEpochLog([...log]);
            setBatch(p => ({ ...p, pct: 100 }));
          },
        },
      });

      [trainX, testX, trainY, testY].forEach(t => t.dispose());
      await m.save(MODEL_KEY);
      setPhase('ready');
    } catch (e) {
      setErrMsg(String(e)); setPhase('error');
    }
  };

  // ─── Canvas çizim ─────────────────────────────────────────────────────────
  const getPoint = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width, sy = c.height / r.height;
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  };

  const stroke = (to) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 22;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.shadowBlur  = 12;
    ctx.shadowColor = 'rgba(255,255,255,0.55)';
    ctx.stroke();
    lastPt.current = to;
  };

  const syncPreview = () => {
    if (!prevRef.current) return;
    prevRef.current.getContext('2d').drawImage(canvasRef.current, 0, 0, 28, 28);
  };

  const predict = useCallback(() => {
    const tf = tfLib.current, m = modelRef.current;
    if (!tf || !m) return;
    const c = canvasRef.current;
    const W = c.width, H = c.height;

    // Find bounding box of drawn pixels (threshold > 30/255 to ignore faint glow)
    const rawCtx = c.getContext('2d');
    const full = rawCtx.getImageData(0, 0, W, H);
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (full.data[(y * W + x) * 4] > 30) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x0 >= x1 || y0 >= y1) return;

    // Square crop with 20% padding — MNIST digits are tightly cropped + centered
    const bw = x1 - x0, bh = y1 - y0;
    const sq = Math.max(bw, bh);
    const pad = Math.round(sq * 0.2);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const half = sq / 2 + pad;
    const sx = Math.max(0, Math.round(cx - half));
    const sy = Math.max(0, Math.round(cy - half));
    const ss = Math.min(Math.round(half * 2), W - sx, H - sy);

    const oc = document.createElement('canvas'); oc.width = oc.height = 28;
    const octx = oc.getContext('2d');
    octx.fillStyle = '#000'; octx.fillRect(0, 0, 28, 28);
    octx.drawImage(c, sx, sy, ss, ss, 0, 0, 28, 28);

    // Update preview to show exactly what the model sees
    if (prevRef.current) prevRef.current.getContext('2d').drawImage(oc, 0, 0, 28, 28);

    const id   = octx.getImageData(0, 0, 28, 28);
    const data = new Float32Array(784);
    for (let i = 0; i < 784; i++) data[i] = id.data[i * 4] / 255;
    const t   = tf.tensor4d(data, [1, 28, 28, 1]);
    const out = Array.from(m.predict(t).dataSync());
    t.dispose();
    const digit = out.indexOf(Math.max(...out));
    setPred({ digit, conf: (out[digit] * 100).toFixed(1), probs: out });
    try {
      const prev = Number(localStorage.getItem('sz_ciz_tahmin') || 0);
      localStorage.setItem('sz_ciz_tahmin', String(prev + 1));
    } catch {}
  }, []);

  const debouncedPredict = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(predict, 100);
  };

  const onPointerDown = (e) => {
    isDown.current = true; e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPoint(e); lastPt.current = pt;
    stroke(pt); setHasDrawn(true);
  };
  const onPointerMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    stroke(getPoint(e)); syncPreview();
    if (phase === 'ready') debouncedPredict();
  };
  const onPointerUp = () => {
    isDown.current = false;
    if (phase === 'ready' && hasDrawn) predict();
  };

  const clear = () => {
    const c = canvasRef.current, ctx = c.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
    if (prevRef.current) { const p = prevRef.current.getContext('2d'); p.fillStyle = '#000'; p.fillRect(0, 0, 28, 28); }
    setHasDrawn(false); setPred(null);
  };

  const resetModel = async () => {
    try { await tfLib.current.io.removeModel(MODEL_KEY); } catch {}
    setPhase('idle'); setPred(null); setHasDrawn(false); setWasCached(false);
  };

  const CS = isMobile ? 260 : 320;

  // ─── RENDER ───────────────────────────────────────────────────────────────

  // Init (TF.js yükleniyor)
  if (phase === 'init') return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '14px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⚙️</div>
        <p>TensorFlow.js yükleniyor…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  // Error
  if (phase === 'error') return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ color: 'var(--color-text)', marginBottom: '8px' }}>Bir şeyler yanlış gitti</h2>
        <p style={{ color: 'var(--color-text-mute)', fontSize: '13px', marginBottom: '20px' }}>
          Tarayıcı WebGL desteklemiyorsa TF.js çalışmaz. Chrome veya Firefox önerilir.
        </p>
        {errMsg && <code style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-mute)', background: 'var(--color-cream-card)', padding: '8px', borderRadius: '6px' }}>{errMsg}</code>}
      </div>
    </div>
  );

  // Idle — başla ekranı
  if (phase === 'idle') return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{opacity:0.6}50%{opacity:1}}
      `}</style>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🧠</div>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '12px', lineHeight: 1.15 }}>
          Rakam Çiz,<br />Yapay Zeka Öğrensin
        </h1>
        <p style={{ color: 'var(--color-text-soft)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          Bu sayfa <strong style={{ color: 'var(--color-text)' }}>MNIST veri setindeki 65.000 el yazısı rakamla</strong> sıfırdan bir CNN modeli eğitir — tamamen tarayıcında, sunucu yok.
          Eğitim bitince sen çiz, model tahmin etsin.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '36px' }}>
          {[
            { label: '65.000', sub: 'eğitim örneği' },
            { label: 'CNN', sub: '2 conv katmanı' },
            { label: '~%98', sub: 'doğruluk hedefi' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 10px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-accent)' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '3px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <button onClick={startTraining} style={{
          padding: '15px 40px', borderRadius: '12px', background: 'var(--color-accent)',
          color: '#fff', border: 'none', fontSize: '16px', fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.02em',
        }}>
          Eğitime Başla →
        </button>
        <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '12px' }}>
          ~12 MB veri indirilecek · ~30 saniye eğitim · model önbelleğe alınır
        </p>
      </div>
    </div>
  );

  // Loading — veri indirme
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
        <h2 style={{ color: 'var(--color-text)', marginBottom: '6px', fontSize: '1.4rem' }}>MNIST veri seti indiriliyor</h2>
        <p style={{ color: 'var(--color-text-mute)', fontSize: '13px', marginBottom: '28px' }}>
          65.000 el yazısı rakam görüntüsü · ~12 MB
        </p>
        <div style={{ background: 'var(--color-border)', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ height: '100%', background: 'var(--color-accent)', width: `${loadPct}%`, transition: 'width 0.3s ease', borderRadius: '999px' }} />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: 700 }}>{loadPct}%</div>
      </div>
    </div>
  );

  // Training — eğitim ekranı
  if (phase === 'training') return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(0.97)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }}>🧠</div>
          <h2 style={{ color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 800 }}>Model Öğreniyor</h2>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '13px', marginTop: '4px' }}>
            {N_TRAIN.toLocaleString()} eğitim · {N_TEST.toLocaleString()} test · {EPOCHS} epoch
          </p>
        </div>

        {/* Epoch kartları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {Array.from({ length: EPOCHS }, (_, i) => {
            const done = epochLog.find(e => e.n === i + 1);
            const current = !done && epochLog.length === i;
            return (
              <div key={i} style={{
                padding: '14px 18px', borderRadius: '12px',
                background: done ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                border: `1px solid ${done ? 'var(--color-accent)' : current ? 'var(--color-accent)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', gap: '14px',
                animation: done ? 'slideIn 0.3s ease' : 'none',
                opacity: !done && !current && epochLog.length < i ? 0.4 : 1,
                transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: '20px', flexShrink: 0 }}>{done ? '✅' : current ? '⏳' : '○'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Epoch {i + 1} / {EPOCHS}</div>
                  {done && (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                      Eğitim: <strong style={{ color: '#10B981' }}>{done.tAcc}%</strong>
                      {' · '}
                      Doğrulama: <strong style={{ color: 'var(--color-accent)' }}>{done.vAcc}%</strong>
                    </div>
                  )}
                  {current && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ background: 'var(--color-border)', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--color-accent)', width: `${batch.pct}%`, transition: 'width 0.2s', borderRadius: '999px' }} />
                      </div>
                    </div>
                  )}
                </div>
                {current && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', textAlign: 'right', flexShrink: 0 }}>
                    <div>Kayıp: <strong style={{ color: 'var(--color-text)' }}>{batch.loss}</strong></div>
                    <div>Doğruluk: <strong style={{ color: '#10B981' }}>{batch.acc}</strong></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-mute)' }}>
          WebGL hızlandırması aktif — model önbelleğe alınacak, bir daha eğitmek gerekmeyecek
        </p>
      </div>
    </div>
  );

  // ─── Ready — çizim ekranı ─────────────────────────────────────────────────
  const topConf = pred ? parseFloat(pred.conf) : 0;
  const confColor = topConf > 85 ? '#10B981' : topConf > 60 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        .bar-fill{transition:width 0.25s cubic-bezier(.4,0,.2,1)}
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '20px 16px 40px' : '36px 24px 60px' }}>
        {/* Başlık */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              🧠 Rakam Çiz
            </h1>
            <p style={{ color: 'var(--color-text-mute)', fontSize: '13px' }}>
              {wasCached ? 'Önbellekten yüklendi' : 'Eğitim tamamlandı'} · CNN · MNIST ·{' '}
              {epochLog.length > 0 && <span style={{ color: 'var(--color-accent)' }}>Doğruluk: {epochLog[epochLog.length - 1]?.vAcc}%</span>}
            </p>
          </div>
          <button onClick={resetModel} style={{ padding: '6px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-mute)', fontSize: '12px', cursor: 'pointer' }}>
            Yeniden Eğit
          </button>
        </div>

        {/* Ana grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* SOL — canvas */}
          <div>
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 40px rgba(29,158,117,0.15), 0 0 0 1px var(--color-border)' }}>
              <canvas
                ref={canvasRef}
                width={CS}
                height={CS}
                style={{ display: 'block', cursor: 'crosshair', touchAction: 'none', borderRadius: '16px' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
              <button onClick={clear} style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                background: 'var(--color-cream-card)', border: '1px solid var(--color-border)',
                color: 'var(--color-text-soft)', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
              }}>
                🗑 Temizle
              </button>

              {/* 28×28 önizleme */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <canvas ref={prevRef} width={28} height={28} style={{ imageRendering: 'pixelated', border: '1px solid var(--color-border)', borderRadius: '4px', width: '56px', height: '56px' }} />
                <span style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>28×28</span>
              </div>
            </div>
          </div>

          {/* SAĞ — tahmin */}
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            {!hasDrawn ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px', opacity: 0.4 }}>✏️</div>
                <p style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>Sola bir rakam çiz</p>
                <p style={{ color: 'var(--color-text-mute)', fontSize: '12px', marginTop: '4px' }}>0 – 9 arası herhangi bir rakam</p>
              </div>
            ) : (
              <div>
                {/* Ana tahmin */}
                <div style={{ padding: '24px', background: 'var(--color-cream-card)', border: `1px solid ${pred ? confColor + '40' : 'var(--color-border)'}`, borderRadius: '16px', textAlign: 'center', marginBottom: '16px', transition: 'border-color 0.3s' }}>
                  {pred ? (
                    <>
                      <div style={{ fontSize: '96px', fontWeight: 900, color: confColor, lineHeight: 1, animation: 'popIn 0.25s ease', fontFamily: 'var(--font-mono)', letterSpacing: '-4px' }}>{pred.digit}</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: confColor, marginTop: '6px' }}>{pred.conf}%</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '4px' }}>
                        {topConf > 90 ? 'Çok emin 🎯' : topConf > 70 ? 'Oldukça emin' : 'Biraz kararsız 🤔'}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '48px', opacity: 0.3 }}>?</div>
                  )}
                </div>

                {/* Olasılık çubukları */}
                <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pred && pred.probs.map((p, d) => {
                    const pct = (p * 100);
                    const isTop = d === pred.digit;
                    return (
                      <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: isTop ? 800 : 400, color: isTop ? confColor : 'var(--color-text-mute)', width: '16px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{d}</span>
                        <div style={{ flex: 1, background: 'var(--color-border)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                          <div className="bar-fill" style={{ height: '100%', width: `${pct}%`, background: isTop ? confColor : 'var(--color-text-mute)', borderRadius: '999px', opacity: isTop ? 1 : 0.45 }} />
                        </div>
                        <span style={{ fontSize: '11px', color: isTop ? confColor : 'var(--color-text-mute)', width: '38px', textAlign: 'right', fontWeight: isTop ? 700 : 400 }}>{pct.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nasıl çalışır */}
        <div style={{ marginTop: '40px', padding: '20px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px', letterSpacing: '0.06em' }}>NASIL ÇALIŞIYOR?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: '12px' }}>
            {[
              { icon: '📦', title: 'Veri', desc: 'Google\'ın MNIST sprite\'ından 5.500 eğitim + 1.000 test görüntüsü' },
              { icon: '🏗', title: 'Mimari', desc: '2× Conv2D + MaxPooling → Flatten → Dense(10, softmax)' },
              { icon: '⚡', title: 'Hız', desc: 'TF.js WebGL backend ile GPU\'da eğitim, tamamen tarayıcında' },
              { icon: '💾', title: 'Önbellek', desc: 'Eğitilen model IndexedDB\'ye kaydedilir, bir daha eğitmez' },
            ].map(s => (
              <div key={s.icon} style={{ padding: '12px', background: 'var(--color-cream)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
