'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = ['#1D9E75','#7F77DD','#E24B4A','#e8a04a','#5DCAA5','#c05c5c'];
const LIGHT   = ['#e1f5ee','#eeedfe','#fdecea','#faeeda','#e8f9f4','#fdecea'];
const W = 600, H = 380, PAD = 30, STEP = 12;

function dist(a, b) { return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2); }

function KMeansDemo() {
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [iter, setIter] = useState(0);
  const [k, setK] = useState(3);
  const [running, setRunning] = useState(false);
  const [converged, setConverged] = useState(false);
  const [status, setStatus] = useState('Nokta ekle veya örnek veri yükle');
  const svgRef = useRef(null);
  const timerRef = useRef(null);
  const stateRef = useRef({ points:[], centroids:[], assignments:[], iter:0, converged:false, k:3 });

  const svgCoords = (e) => {
    const pt = svgRef.current.createSVGPoint();
    const t = e.touches ? e.touches[0] : e;
    pt.x = t.clientX; pt.y = t.clientY;
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  const initCentroids = (pts, kk) => {
    const indices = [];
    while (indices.length < kk) {
      const i = Math.floor(Math.random() * pts.length);
      if (!indices.includes(i)) indices.push(i);
    }
    return indices.map(i => ({ x: pts[i].x, y: pts[i].y }));
  };

  const assignPoints = (pts, cents) =>
    pts.map(p => {
      let minD = Infinity, best = 0;
      cents.forEach((c, ci) => { const d = dist(p, c); if (d < minD) { minD = d; best = ci; } });
      return best;
    });

  const moveCentroids = (pts, asgn, cents, kk) =>
    cents.map((_, ci) => {
      const cluster = pts.filter((_, i) => asgn[i] === ci);
      if (cluster.length === 0) return cents[ci];
      return { x: cluster.reduce((s,p) => s+p.x, 0)/cluster.length, y: cluster.reduce((s,p) => s+p.y, 0)/cluster.length };
    });

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (s.points.length < s.k || s.converged) { setRunning(false); return; }
    if (s.centroids.length !== s.k) {
      const c = initCentroids(s.points, s.k);
      s.centroids = c; setCentroids(c);
    }
    const newAsgn = assignPoints(s.points, s.centroids);
    const changed = newAsgn.some((a, i) => a !== s.assignments[i]);
    if (!changed) {
      s.converged = true; setConverged(true); setRunning(false);
      setStatus("Yakınsadı! Centroid'ler artık hareket etmiyor."); return;
    }
    const newCents = moveCentroids(s.points, newAsgn, s.centroids, s.k);
    const newIter = s.iter + 1;
    s.assignments = newAsgn; s.centroids = newCents; s.iter = newIter;
    setAssignments([...newAsgn]); setCentroids([...newCents]); setIter(newIter);
    setStatus(`İterasyon ${newIter}: centroid'ler güncellendi.`);
  }, []);

  useEffect(() => {
    stateRef.current.k = k;
    if (stateRef.current.points.length >= k) {
      const c = initCentroids(stateRef.current.points, k);
      stateRef.current.centroids = c; stateRef.current.assignments = []; stateRef.current.iter = 0; stateRef.current.converged = false;
      setCentroids(c); setAssignments([]); setIter(0); setConverged(false);
    }
  }, [k]);

  useEffect(() => {
    if (running) { timerRef.current = setInterval(doStep, 600); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [running, doStep]);

  const handleClick = (e) => {
    const p = svgCoords(e);
    if (p.x < PAD || p.x > W-PAD || p.y < PAD || p.y > H-PAD) return;
    const newPts = [...stateRef.current.points, { x: p.x, y: p.y }];
    stateRef.current.points = newPts; setPoints(newPts);
    if (stateRef.current.centroids.length === k) {
      const a = assignPoints(newPts, stateRef.current.centroids);
      stateRef.current.assignments = a; setAssignments(a);
    }
  };

  const loadSample = () => {
    const clusters = [[150,120],[330,280],[470,130],[190,290],[420,200]];
    const pts = [];
    for (let ci = 0; ci < k; ci++) {
      const [cx, cy] = clusters[ci % clusters.length];
      for (let i = 0; i < 18; i++) pts.push({ x: cx+(Math.random()-.5)*90, y: cy+(Math.random()-.5)*90 });
    }
    const c = initCentroids(pts, k);
    stateRef.current = { points: pts, centroids: c, assignments: [], iter: 0, converged: false, k };
    setPoints(pts); setCentroids(c); setAssignments([]); setIter(0); setConverged(false); setRunning(false);
    setStatus('Örnek veri yüklendi. "Bir adım" veya "Otomatik" bas.');
  };

  const reset = () => {
    clearInterval(timerRef.current);
    stateRef.current = { points:[], centroids:[], assignments:[], iter:0, converged:false, k };
    setPoints([]); setCentroids([]); setAssignments([]); setIter(0); setConverged(false); setRunning(false);
    setStatus('Nokta ekle veya örnek veri yükle');
  };

  const voronoiCells = [];
  if (centroids.length === k && points.length >= k) {
    for (let px = 0; px < W; px += STEP) {
      for (let py = 0; py < H; py += STEP) {
        let minD = Infinity, best = 0;
        centroids.forEach((c, ci) => { const d = dist({x:px,y:py}, c); if (d < minD) { minD = d; best = ci; } });
        voronoiCells.push({ x: px, y: py, ci: best });
      }
    }
  }

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">İterasyon</div>
          <div className="text-2xl font-medium">{iter}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Nokta sayısı</div>
          <div className="text-2xl font-medium">{points.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Durum</div>
          <div className="text-xs font-medium mt-1 leading-tight">{status}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>Küme sayısı (k)</label>
        <input type="range" min="2" max="6" value={k} className="flex-1"
          onChange={e => setK(parseInt(e.target.value))} />
        <span className="text-lg font-medium w-6 text-right">{k}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block cursor-crosshair touch-none"
          onClick={handleClick}>
          <rect width={W} height={H} fill="transparent"/>
          {voronoiCells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={STEP+1} height={STEP+1}
              fill={LIGHT[c.ci % LIGHT.length]} opacity="0.5"/>
          ))}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="5"
              fill={centroids.length === k ? COLORS[assignments[i] % COLORS.length] : '#888'}
              stroke="#fff" strokeWidth="1"/>
          ))}
          {centroids.map((c, ci) => (
            <polygon key={ci}
              points={`${c.x},${c.y-12} ${c.x+12},${c.y} ${c.x},${c.y+12} ${c.x-12},${c.y}`}
              fill={COLORS[ci % COLORS.length]} stroke="#1a1a1a" strokeWidth="1.5"/>
          ))}
          {points.length === 0 && (
            <text x="300" y="195" fontSize="14" fill="#aaa" textAnchor="middle">
              Tıklayarak nokta ekle veya &quot;Örnek veri&quot; yükle
            </text>
          )}
        </svg>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <button onClick={loadSample} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Örnek veri</button>
        <button onClick={doStep} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Bir adım</button>
        <button onClick={() => setRunning(!running)} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {running ? 'Durdur' : 'Otomatik'}
        </button>
        <button onClick={reset} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sıfırla</button>
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        <strong style={{ color: 'var(--color-text)' }}>Nasıl çalışır:</strong> Her adımda iki şey olur: (1) Her nokta en yakın centroid&apos;e atanır. (2) Her centroid kümesinin ortalamasına taşınır. Centroid&apos;ler hareket etmeyi bırakınca yakınsadı demektir.
      </p>
    </div>
  );
}

export default function KMeansPost() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <a href="/" className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</a>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          K-Means: müşterilerini kümele
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · 10 dakika okuma</p>

        <p>
          Elinde 10.000 müşteri var. Hepsine aynı e-postayı mı göndereceksin? Ya da
          hepsine aynı indirimi mi sunacaksın? Hayır. Çünkü bazıları sık alışveriş yapıyor,
          bazıları sadece indirimde geliyor, bazıları yıllardır sessiz.
        </p>
        <p>
          <strong>K-Means</strong> bu müşterileri benzer davranışlarına göre otomatik olarak
          gruplar. Etiket yok, kural yok — sadece veri ve mesafe.
        </p>

        <h2>Önce dene</h2>
        <p>
          Aşağıdaki demoda elmas şekiller centroid&apos;leri (küme merkezlerini) temsil ediyor.
          Noktalar her adımda en yakın centroid&apos;e atanıyor, centroid&apos;ler de kümelerinin
          ortalamasına taşınıyor.
        </p>

        <KMeansDemo />

        <h2>Algoritma adım adım</h2>
        <p>K-Means&apos;in tüm sırrı iki basit adımın tekrarında:</p>

        <pre>{`import numpy as np

def kmeans(X, k, max_iter=100):
    # 1. Rastgele k merkez seç
    idx = np.random.choice(len(X), k, replace=False)
    centroids = X[idx].copy()

    for _ in range(max_iter):
        # 2. Her noktayı en yakın merkeze ata
        distances = np.array([[np.linalg.norm(x - c) for c in centroids] for x in X])
        assignments = np.argmin(distances, axis=1)

        # 3. Merkezleri güncelle
        new_centroids = np.array([X[assignments == k].mean(axis=0) for k in range(len(centroids))])

        # 4. Değişim yoksa dur
        if np.allclose(centroids, new_centroids):
            break
        centroids = new_centroids

    return assignments, centroids`}</pre>

        <h2>k sayısını nasıl seçerim?</h2>
        <p>
          K-Means&apos;in en zor sorusu bu. Elbow (dirsek) yöntemi en yaygın yaklaşım:
          farklı k değerleri için inertia&apos;yı (noktaların kendi centroid&apos;lerine
          olan uzaklık karelerinin toplamı) hesapla, grafikte &quot;dirsek&quot; nerede
          kırılıyorsa o k iyi bir seçim.
        </p>

        <pre>{`from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

inertias = []
K_range = range(2, 11)

for k in K_range:
    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    model.fit(X)
    inertias.append(model.inertia_)

plt.plot(K_range, inertias, 'o-')
plt.xlabel('k (küme sayısı)')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            K-Means küresel kümeler varsayar. Verinin şekli çok farklıysa
            (yay, halka, iç içe) DBSCAN veya Gaussian Mixture daha iyi sonuç verir.
          </p>
        </blockquote>

        <h2>Gerçek kullanım: müşteri segmentasyonu</h2>
        <p>
          E-ticarette RFM (Recency, Frequency, Monetary) analizi K-Means ile harika çalışır:
        </p>

        <pre>{`import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# RFM feature'ları oluştur
rfm = df.groupby('customer_id').agg({
    'order_date': lambda x: (today - x.max()).days,  # Recency
    'order_id': 'count',                              # Frequency
    'revenue': 'sum'                                  # Monetary
}).rename(columns={'order_date':'R','order_id':'F','revenue':'M'})

# Ölçekle (K-Means mesafeye duyarlı!)
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm)

# K-Means uygula
model = KMeans(n_clusters=4, random_state=42, n_init=10)
rfm['segment'] = model.fit_predict(rfm_scaled)

print(rfm.groupby('segment')[['R','F','M']].mean())`}</pre>

        <h2>K-Means&apos;in sınırları</h2>
        <ul>
          <li>Küre şeklinde olmayan kümelerle zayıf performans gösterir</li>
          <li>Aykırı değerlere (outlier) duyarlıdır — centroid kayar</li>
          <li>k&apos;yı önceden belirlemek gerekir, her zaman bilinmez</li>
          <li>Başlangıç centroid&apos;lerine bağlı — farklı çalıştırmalarda farklı sonuç</li>
          <li>Ölçekleme şart: büyük aralıklı değişkenler domine eder</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>Confusion Matrix</strong>: sınıflandırma modellerini
          nasıl değerlendirirsin, eşiği kaydırınca ne olur?
        </p>
      </article>

      <footer className="max-w-3xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </span>
      </footer>
    </main>
  );
}
