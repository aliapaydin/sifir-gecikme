'use client';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';

// ─── VERİ SETİ (Decision Tree ile aynı) ────────────────────────────────────
const VERI = [
  {id:1,  yas:22,har:9.2, s:1},{id:2,  yas:25,har:11.5,s:1},{id:3,  yas:28,har:8.1, s:1},
  {id:4,  yas:24,har:12.3,s:1},{id:5,  yas:31,har:7.8, s:1},{id:6,  yas:29,har:10.2,s:1},
  {id:7,  yas:33,har:9.5, s:1},{id:8,  yas:26,har:13.1,s:1},{id:9,  yas:36,har:8.4, s:1},
  {id:10, yas:35,har:11.0,s:1},{id:11, yas:27,har:7.2, s:1},{id:12, yas:32,har:9.8, s:1},
  {id:13, yas:21,har:3.5, s:0},{id:14, yas:23,har:2.8, s:0},{id:15, yas:26,har:4.2, s:0},
  {id:16, yas:30,har:5.1, s:0},{id:17, yas:34,har:3.9, s:0},{id:18, yas:28,har:2.2, s:0},
  {id:19, yas:32,har:4.8, s:0},{id:20, yas:37,har:5.5, s:0},
  {id:21, yas:42,har:12.5,s:1},{id:22, yas:47,har:11.2,s:1},{id:23, yas:51,har:13.8,s:1},
  {id:24, yas:45,har:10.5,s:1},{id:25, yas:55,har:12.1,s:1},{id:26, yas:49,har:11.7,s:1},
  {id:27, yas:58,har:14.2,s:1},{id:28, yas:43,har:10.8,s:1},
  {id:29, yas:40,har:5.5, s:0},{id:30, yas:44,har:7.2, s:0},{id:31, yas:48,har:4.8, s:0},
  {id:32, yas:52,har:6.5, s:0},{id:33, yas:56,har:3.2, s:0},{id:34, yas:41,har:8.1, s:0},
  {id:35, yas:46,har:5.9, s:0},{id:36, yas:53,har:7.5, s:0},{id:37, yas:59,har:4.1, s:0},
  {id:38, yas:50,har:6.8, s:0},{id:39, yas:43,har:3.5, s:0},{id:40, yas:57,har:5.2, s:0},
];

// ─── SVG KOORDİNATLARI ──────────────────────────────────────────────────────
const SW = 480, SH = 340;
const ML = 50, MR = 16, MT = 18, MB = 44;
const PW = SW - ML - MR, PH = SH - MT - MB;
const YAS_MIN = 18, YAS_MAX = 62, HAR_MIN = 0, HAR_MAX = 16;
const xP = v => ML + ((v - YAS_MIN) / (YAS_MAX - YAS_MIN)) * PW;
const yP = v => MT + PH - ((v - HAR_MIN) / (HAR_MAX - HAR_MIN)) * PH;
const xV = px => YAS_MIN + Math.max(0, Math.min(1, (px - ML) / PW)) * (YAS_MAX - YAS_MIN);
const yV = py => HAR_MIN + Math.max(0, Math.min(1, (MT + PH - py) / PH)) * (HAR_MAX - HAR_MIN);

// ─── MATEMATİK ──────────────────────────────────────────────────────────────
const gini = pts => { const n = pts.length; if (!n) return 0; const p = pts.filter(d => d.s === 1).length / n; return 1 - p * p - (1 - p) * (1 - p); };
const majority = pts => pts.filter(d => d.s === 1).length >= pts.filter(d => d.s === 0).length ? 1 : 0;

function findBestSplit(pts) {
  let best = { feat: 'har', thresh: 8, score: Infinity };
  for (const feat of ['yas', 'har']) {
    const vals = [...new Set(pts.map(d => d[feat]))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const thresh = (vals[i] + vals[i + 1]) / 2;
      const L = pts.filter(d => d[feat] <= thresh);
      const R = pts.filter(d => d[feat] > thresh);
      if (!L.length || !R.length) continue;
      const score = (L.length * gini(L) + R.length * gini(R)) / pts.length;
      if (score < best.score) best = { feat, thresh, score };
    }
  }
  return best;
}

function buildNode(pts, depth) {
  if (depth === 0 || pts.length < 3) {
    const p1 = pts.filter(d => d.s === 1).length;
    return { leaf: true, pred: majority(pts), n: pts.length, p1 };
  }
  const { feat, thresh } = findBestSplit(pts);
  const L = pts.filter(d => d[feat] <= thresh);
  const R = pts.filter(d => d[feat] > thresh);
  if (!L.length || !R.length) {
    const p1 = pts.filter(d => d.s === 1).length;
    return { leaf: true, pred: majority(pts), n: pts.length, p1 };
  }
  return { leaf: false, feat, thresh, left: buildNode(L, depth - 1), right: buildNode(R, depth - 1) };
}

function treePredict(node, pt) {
  if (node.leaf) return node.pred;
  return treePredict(pt[node.feat] <= node.thresh ? node.left : node.right, pt);
}

function bootstrapSample(data) {
  return Array.from({ length: data.length }, () => data[Math.floor(Math.random() * data.length)]);
}

function buildTree(data) {
  const sample = bootstrapSample(data);
  const tree = buildNode(sample, 2);
  const acc = Math.round((data.filter(d => treePredict(tree, d) === d.s).length / data.length) * 100);
  const split = rootSplit(tree);
  return { tree, acc, split };
}

function rootSplit(node) {
  if (node.leaf) return null;
  const feat = node.feat === 'yas' ? 'Yaş' : 'Harcama';
  return `${feat} ≤ ${node.thresh.toFixed(1)}`;
}

function rfProb(forest, pt) {
  if (!forest.length) return 0.5;
  return forest.reduce((s, f) => s + treePredict(f.tree, pt), 0) / forest.length;
}

// ─── IZGARA (karar sınırı) ──────────────────────────────────────────────────
const GX = 28, GY = 22;
const GRID_PTS = Array.from({ length: GY }, (_, iy) =>
  Array.from({ length: GX }, (_, ix) => ({
    yas: YAS_MIN + (ix / (GX - 1)) * (YAS_MAX - YAS_MIN),
    har: HAR_MIN + ((GY - 1 - iy) / (GY - 1)) * (HAR_MAX - HAR_MIN),
  }))
);
const CW = PW / GX, CH = PH / GY;

// ─── ANA BİLEŞEN ────────────────────────────────────────────────────────────
export default function RandomForestSayfasi() {
  const [nTrees, setNTrees] = useState(1);
  const [testPt, setTestPt] = useState({ yas: 40, har: 8 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);
  const forestRef = useRef(null);

  // 25 ağacı bir kez oluştur
  if (!forestRef.current) {
    forestRef.current = Array.from({ length: 25 }, () => buildTree(VERI));
  }

  const forest = forestRef.current.slice(0, nTrees);

  // Izgara olasılıkları
  const gridProbs = useMemo(() => GRID_PTS.map(row => row.map(pt => rfProb(forest, pt))), [nTrees]);

  // Toplam doğruluk
  const acc = useMemo(() => {
    const dogru = VERI.filter(d => {
      const prob = rfProb(forest, d);
      return (prob >= 0.5 ? 1 : 0) === d.s;
    }).length;
    return Math.round((dogru / VERI.length) * 100);
  }, [nTrees]);

  // Test noktası oylama
  const testVotes = useMemo(() => {
    const v1 = forest.reduce((s, f) => s + treePredict(f.tree, testPt), 0);
    return { prem: v1, std: forest.length - v1, prob: forest.length ? v1 / forest.length : 0.5 };
  }, [nTrees, testPt]);

  // SVG etkileşim
  const getPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = SW / rect.width;
    const scaleY = SH / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;
    const yas = Math.max(YAS_MIN + 1, Math.min(YAS_MAX - 1, xV(px)));
    const har = Math.max(HAR_MIN + 0.3, Math.min(HAR_MAX - 0.3, yV(py)));
    return { yas, har };
  }, []);

  const onMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (pt) setTestPt(pt);
  }, [dragging, getPoint]);

  const onUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => { window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp); };
  }, [onUp]);

  const testRenk = testVotes.prob >= 0.5 ? '#1D9E75' : '#dc2626';
  const testLabel = testVotes.prob >= 0.5 ? 'Premium' : 'Standart';

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Random Forest: yüz ağaç bir orman yapar
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · makine öğrenmesi · ensemble · 14 dakika
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          Tek bir karar ağacı gürültüye takılır, eğitim verisini ezberler.
          Random Forest çözümü basit: yüzlerce farklı ağaç kur, hepsini oy kullandır,
          çoğunluğa bak. Aşağıda ağaç eklendikçe karar sınırının nasıl yumuşadığını
          ve doğruluğun nasıl arttığını canlı görüyorsun.
        </p>

        <h2>Ensemble öğrenimi nedir?</h2>
        <p>
          Tek uzman yerine çok sayıda uzmanın oyuna katıldığı yaklaşım.
          Her ağaç biraz farklı — çünkü farklı veri görür ve farklı bölmeler yapar.
          Ama hataları korelasyonsuz olduğundan, birlikte ortalamak hataları yok eder.
        </p>
        <p>
          Random Forest iki kaynak rastgelelik kullanır:
        </p>
        <ul>
          <li><strong>Bootstrap sampling:</strong> her ağaç, eğitim verisinin rastgele bir alt örneğini (yerine koyarak) görür</li>
          <li><strong>Feature randomness:</strong> her bölmede sadece rastgele seçilmiş özellikler denenir — ağaçlar birbirinden farklılaşır</li>
        </ul>

        {/* ─── İNTERAKTİF DEMO ─── */}
        <div style={{ border: '0.5px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', margin: '2rem 0' }}>

          {/* Header */}
          <div style={{
            padding: '14px 20px', borderBottom: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>⚡ Random Forest — Karar Sınırı</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
                Doğruluk: <strong style={{ color: acc >= 90 ? '#1D9E75' : 'var(--color-text)' }}>{acc}%</strong>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
                ● Premium &nbsp; ✕ Standart
              </span>
            </div>
          </div>

          {/* Slider */}
          <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>Ağaç sayısı</span>
            <input
              type="range" min={1} max={25} value={nTrees}
              onChange={e => setNTrees(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#1D9E75', cursor: 'pointer' }}
            />
            <span style={{
              fontSize: '15px', fontWeight: 700, color: '#1D9E75',
              minWidth: '28px', textAlign: 'right',
            }}>{nTrees}</span>
          </div>

          {/* SVG */}
          <div style={{ padding: '10px 20px 0', overflowX: 'auto' }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SW} ${SH}`}
              style={{ width: '100%', maxWidth: SW, display: 'block', touchAction: 'none', cursor: dragging ? 'grabbing' : 'default' }}
              onMouseMove={onMove}
              onTouchMove={onMove}
            >
              {/* Izgara arka plan */}
              {gridProbs.map((row, iy) => row.map((prob, ix) => {
                const x = ML + ix * CW;
                const y = MT + iy * CH;
                const isPrem = prob >= 0.5;
                const conf = Math.abs(prob - 0.5) * 2; // 0-1
                const alpha = 0.08 + conf * 0.28;
                return (
                  <rect key={`${ix}-${iy}`} x={x} y={y} width={CW + 0.5} height={CH + 0.5}
                    fill={isPrem ? `rgba(29,158,117,${alpha})` : `rgba(220,38,38,${alpha})`}
                  />
                );
              }))}

              {/* Eksenler */}
              <line x1={ML} y1={MT} x2={ML} y2={MT + PH} stroke="var(--color-border)" strokeWidth="1" />
              <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="var(--color-border)" strokeWidth="1" />

              {/* X ekseni etiketleri */}
              {[20, 30, 40, 50, 60].map(v => (
                <g key={v}>
                  <line x1={xP(v)} y1={MT + PH} x2={xP(v)} y2={MT + PH + 4} stroke="var(--color-border)" strokeWidth="1" />
                  <text x={xP(v)} y={MT + PH + 14} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">{v}</text>
                </g>
              ))}
              <text x={ML + PW / 2} y={SH - 4} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">Yaş</text>

              {/* Y ekseni etiketleri */}
              {[0, 4, 8, 12, 16].map(v => (
                <g key={v}>
                  <line x1={ML - 4} y1={yP(v)} x2={ML} y2={yP(v)} stroke="var(--color-border)" strokeWidth="1" />
                  <text x={ML - 7} y={yP(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--color-text-mute)">{v}</text>
                </g>
              ))}
              <text x={12} y={MT + PH / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)" transform={`rotate(-90, 12, ${MT + PH / 2})`}>Harcama (₺k)</text>

              {/* Veri noktaları */}
              {VERI.map(d => (
                d.s === 1 ? (
                  <circle key={d.id} cx={xP(d.yas)} cy={yP(d.har)} r={4.5}
                    fill="#1D9E75" stroke="white" strokeWidth="1.2" opacity={0.85} />
                ) : (
                  <g key={d.id} transform={`translate(${xP(d.yas)},${yP(d.har)})`}>
                    <line x1={-4} y1={-4} x2={4} y2={4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                    <line x1={4} y1={-4} x2={-4} y2={4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                  </g>
                )
              ))}

              {/* Test noktası */}
              <g
                transform={`translate(${xP(testPt.yas)},${yP(testPt.har)})`}
                style={{ cursor: 'grab' }}
                onMouseDown={e => { e.stopPropagation(); setDragging(true); }}
                onTouchStart={e => { e.stopPropagation(); setDragging(true); }}
              >
                <circle r={10} fill="transparent" />
                <polygon
                  points="0,-8 5,4 -5,4"
                  fill={testRenk} stroke="white" strokeWidth="1.5"
                  opacity={0.95}
                />
                <circle r={3} fill="white" />
              </g>
            </svg>
          </div>

          {/* Oylama Paneli */}
          <div style={{ padding: '14px 20px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '10px' }}>
              TEST NOKTASI — YAŞ {testPt.yas.toFixed(0)} · HARCAMA ₺{testPt.har.toFixed(1)}k — (sürükle ▲)
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', flexWrap: 'wrap' }}>
              {/* Oy dağılımı */}
              <div style={{ flex: 1, minWidth: '180px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '10px' }}>Oylama</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: testVotes.prem || 0.01, background: 'rgba(29,158,117,0.15)', border: '0.5px solid rgba(29,158,117,0.4)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#1D9E75' }}>{testVotes.prem}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>Premium</div>
                  </div>
                  <div style={{ flex: testVotes.std || 0.01, background: 'rgba(220,38,38,0.10)', border: '0.5px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626' }}>{testVotes.std}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>Standart</div>
                  </div>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(220,38,38,0.15)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${testVotes.prob * 100}%`, background: '#1D9E75', borderRadius: '999px', transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: 'var(--color-text-mute)' }}>
                  <span>%{Math.round(testVotes.prob * 100)} Premium</span>
                  <span style={{ fontWeight: 700, color: testRenk }}>→ {testLabel}</span>
                </div>
              </div>

              {/* Bireysel oy çipleri */}
              <div style={{ flex: 2, minWidth: '200px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '10px' }}>Her ağacın oyu</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {forest.map((f, i) => {
                    const v = treePredict(f.tree, testPt);
                    return (
                      <div key={i} title={`Ağaç ${i + 1}: ${f.split || '—'}`} style={{
                        width: '22px', height: '22px', borderRadius: '6px', fontSize: '9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, flexShrink: 0,
                        background: v === 1 ? 'rgba(29,158,117,0.15)' : 'rgba(220,38,38,0.10)',
                        color: v === 1 ? '#1D9E75' : '#dc2626',
                        border: `0.5px solid ${v === 1 ? 'rgba(29,158,117,0.4)' : 'rgba(220,38,38,0.3)'}`,
                      }}>
                        {i + 1}
                      </div>
                    );
                  })}
                  {Array.from({ length: 25 - nTrees }).map((_, i) => (
                    <div key={`empty-${i}`} style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: 'var(--color-cream)', border: '0.5px solid var(--color-border)',
                      opacity: 0.3,
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '8px' }}>
                  Yeşil = Premium oyu · Kırmızı = Standart oyu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini ağaç kartları */}
        {nTrees <= 9 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '10px' }}>
              AKTİF AĞAÇLAR — HER BİRİ FARKLI VERİ GÖRDÜ
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {forest.map((f, i) => {
                const vote = treePredict(f.tree, testPt);
                return (
                  <div key={i} style={{
                    background: 'var(--color-cream-card)', border: `0.5px solid ${vote === 1 ? 'rgba(29,158,117,0.4)' : 'rgba(220,38,38,0.3)'}`,
                    borderRadius: '10px', padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>Ağaç {i + 1}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
                      {f.split || '—'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>acc %{f.acc}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 700,
                        color: vote === 1 ? '#1D9E75' : '#dc2626',
                      }}>
                        {vote === 1 ? '● Prem' : '✕ Std'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2>Neden tek ağaçtan daha iyi?</h2>
        <p>
          Tek bir ağaç eğitim verisine aşırı uyar — her gürültüyü ezberler.
          Farklı bootstrap örnekleri gören ağaçlar farklı hataları öğrenir.
          Ama hatalar birbirinden bağımsız olduğundan, ortalamaları iptal olur.
          İstatistiksel olarak: N bağımsız ağacın varyansı, tek ağacın
          varyansının 1/N katıdır.
        </p>

        <div style={{
          background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
          borderRadius: '12px', padding: '16px 20px', margin: '1.5rem 0',
          fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#e8a04a' }}>Var(ortalama)</span> = <span style={{ color: '#1D9E75' }}>Var(tek ağaç)</span> / N &nbsp; (ağaçlar bağımsızsa)</div>
          <div style={{ color: 'var(--color-text-mute)', fontSize: '11px', lineHeight: 1.6, marginTop: '4px' }}>
            Gerçekte ağaçlar tamamen bağımsız değil (aynı veriyle eğitiliyor),<br/>
            feature randomness bu korelasyonu kırıp etkiyi artırıyor.
          </div>
        </div>

        <h2>OOB (Out-of-Bag) hatası</h2>
        <p>
          Bootstrap sampling sırasında her ağaç, eğitim verisinin ortalama
          <strong> %37'sini hiç görmez</strong> (OOB örnekleri). Bu noktalar,
          o ağaç için doğal bir test seti oluşturur — ayrı validation setine
          gerek kalmaz.
        </p>
        <p>
          Tüm ağaçların OOB tahminleri birleştirilince, cross-validation'a
          yakın ve hesaplaması çok daha ucuz bir hata tahmini elde edilir.
        </p>

        <h2>Feature importance</h2>
        <p>
          Random Forest her özelliğin ne kadar Gini düşürdüğünü takip eder.
          Çok sayıda bölmede kullanılan, Gini'yi çok düşüren özellikler
          önemli kabul edilir. Ücretsiz bir özellik seçimi aracı gibi davranır.
        </p>

        <h2>Python'da</h2>
        <pre>{`from sklearn.ensemble import RandomForestClassifier
import pandas as pd

# Veri
df = pd.read_csv('musteriler.csv')
X = df[['yas', 'harcama']]
y = df['premium']

# Model
rf = RandomForestClassifier(
    n_estimators=100,   # ağaç sayısı
    max_depth=5,        # ağaç derinliği
    max_features='sqrt',# bölmede denenen özellik sayısı
    oob_score=True,     # OOB hatası hesapla
    random_state=42,
)
rf.fit(X, y)

print(f"OOB Doğruluk: {rf.oob_score_:.2%}")        # ~%93
print(f"Özellik Önemi: {rf.feature_importances_}")  # [0.38, 0.62]

# Tahmin
rf.predict([[35, 8.5]])           # [1] → Premium
rf.predict_proba([[35, 8.5]])     # [[0.07, 0.93]]`}</pre>

        <h2>Ne zaman kullanılır?</h2>
        <ul>
          <li><strong>Tabular veri</strong> — yapılandırılmış CSV/SQL verileri için hâlâ en güvenilir baseline</li>
          <li><strong>Overfitting korkusu</strong> — tek ağaç ezberliyor, RF bunu otomatik bastırır</li>
          <li><strong>Feature importance</strong> gerektiğinde — hangi değişken önemli?</li>
          <li><strong>Az hiperparametre</strong> — n_estimators yüksek tut, genelde yeter</li>
        </ul>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>⚠ Görüntü ve dil için derin öğrenme daha iyi</li>
          <li style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>⚠ Gradient Boosting (XGBoost) genelde biraz daha iyi acc verir, ama daha hassas tuning gerektirir</li>
        </ul>

        <h2>Özet</h2>
        <ul>
          <li>Random Forest, bootstrap + feature randomness ile farklılaştırılmış ağaçların oylamasıdır</li>
          <li>Ağaç sayısı arttıkça karar sınırı yumuşar, varyans düşer</li>
          <li>OOB örnekleri ücretsiz validation sağlar</li>
          <li>Tabular veri için güçlü, yorumlanabilir ve güvenilir bir baseline</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Önceki: <a href="/yazilar/decision-tree" style={{ color: '#1D9E75', textDecoration: 'none' }}>Decision tree: ağacı sen büyüt →</a>
        </p>
      </article>
    </main>
  );
}
