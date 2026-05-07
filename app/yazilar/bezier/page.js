'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const W = 600, H = 380;
const COLORS = {
  ctrl: '#7F77DD',
  curve: '#1D9E75',
  skeleton: '#e8e2d5',
  decast: ['#E24B4A','#e8a04a','#5DCAA5','#7F77DD','#1D9E75'],
  tpoint: '#FFD700',
  tangent: '#E24B4A',
};

function lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

function deCasteljau(points, t) {
  const levels = [points.map(p => ({ ...p }))];
  while (levels[levels.length - 1].length > 1) {
    const prev = levels[levels.length - 1];
    const next = [];
    for (let i = 0; i < prev.length - 1; i++) next.push(lerp(prev[i], prev[i + 1], t));
    levels.push(next);
  }
  return levels;
}

function bezierPoint(points, t) {
  return deCasteljau(points, t).at(-1)[0];
}

const DEFAULT_PTS = [
  { x: 80,  y: 300 },
  { x: 160, y: 80  },
  { x: 440, y: 80  },
  { x: 520, y: 300 },
];

function BezierDemo() {
  const svgRef = useRef(null);
  const [pts, setPts] = useState(DEFAULT_PTS.map(p => ({ ...p })));
  const [tVal, setTVal] = useState(0.5);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showDecast, setShowDecast] = useState(true);
  const [showTangent, setShowTangent] = useState(false);
  const [isAnim, setIsAnim] = useState(false);
  const [info, setInfo] = useState('');
  const dragIdx = useRef(-1);
  const animRef = useRef(null);
  const animDir = useRef(1);
  const tRef = useRef(0.5);
  const ptsRef = useRef(pts);

  useEffect(() => { ptsRef.current = pts; }, [pts]);
  useEffect(() => { tRef.current = tVal; }, [tVal]);

  const svgCoords = (e) => {
    const pt = svgRef.current.createSVGPoint();
    const ev = e.touches ? e.touches[0] : e;
    pt.x = ev.clientX; pt.y = ev.clientY;
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  const buildInfo = useCallback((pArr, t) => {
    const p = bezierPoint(pArr, t);
    const n = pArr.length;
    const formula = n === 2 ? 'B(t) = (1−t)P₀ + tP₁'
      : n === 3 ? 'B(t) = (1−t)²P₀ + 2(1−t)tP₁ + t²P₂'
      : n === 4 ? 'B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃'
      : `Derece ${n - 1} Bezier`;
    setInfo(`t = ${t.toFixed(2)} → (${p.x.toFixed(0)}, ${p.y.toFixed(0)}) · ${formula}`);
  }, []);

  useEffect(() => { buildInfo(pts, tVal); }, [pts, tVal, buildInfo]);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = ptsRef.current;
    const t = tRef.current;

    svg.innerHTML = '';

    // Defs — ok işareti
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 Z" fill="${COLORS.tangent}"/></marker>`;
    svg.appendChild(defs);

    // İskelet
    if (showSkeleton) {
      for (let i = 0; i < p.length - 1; i++) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', p[i].x); l.setAttribute('y1', p[i].y);
        l.setAttribute('x2', p[i+1].x); l.setAttribute('y2', p[i+1].y);
        l.setAttribute('stroke', COLORS.skeleton); l.setAttribute('stroke-width', '1.5'); l.setAttribute('stroke-dasharray', '4 3');
        svg.appendChild(l);
      }
    }

    // Eğri
    const steps = 120;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const bp = bezierPoint(p, i / steps);
      d += (i === 0 ? 'M' : 'L') + bp.x.toFixed(1) + ',' + bp.y.toFixed(1) + ' ';
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', COLORS.curve); path.setAttribute('stroke-width', '2.5'); path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);

    // De Casteljau
    if (showDecast) {
      const levels = deCasteljau(p, t);
      levels.slice(1).forEach((level, li) => {
        const color = COLORS.decast[li % COLORS.decast.length];
        for (let i = 0; i < level.length - 1; i++) {
          const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          l.setAttribute('x1', level[i].x); l.setAttribute('y1', level[i].y);
          l.setAttribute('x2', level[i+1].x); l.setAttribute('y2', level[i+1].y);
          l.setAttribute('stroke', color); l.setAttribute('stroke-width', '1.2'); l.setAttribute('opacity', '0.7');
          svg.appendChild(l);
        }
        level.forEach(lp => {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('cx', lp.x); c.setAttribute('cy', lp.y); c.setAttribute('r', '4');
          c.setAttribute('fill', color); c.setAttribute('opacity', '0.85');
          svg.appendChild(c);
        });
      });
    }

    // t noktası
    const tp = bezierPoint(p, t);
    const tc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    tc.setAttribute('cx', tp.x); tc.setAttribute('cy', tp.y); tc.setAttribute('r', '8');
    tc.setAttribute('fill', COLORS.tpoint); tc.setAttribute('stroke', '#2a2620'); tc.setAttribute('stroke-width', '2');
    svg.appendChild(tc);

    // Teğet
    if (showTangent && t > 0.01 && t < 0.99) {
      const tp2 = bezierPoint(p, Math.min(t + 0.02, 1));
      const dx = tp2.x - tp.x, dy = tp2.y - tp.y;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      const ex = tp.x + (dx/len)*60, ey = tp.y + (dy/len)*60;
      const tl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tl.setAttribute('x1', tp.x); tl.setAttribute('y1', tp.y);
      tl.setAttribute('x2', ex); tl.setAttribute('y2', ey);
      tl.setAttribute('stroke', COLORS.tangent); tl.setAttribute('stroke-width', '2'); tl.setAttribute('marker-end', 'url(#arr)');
      svg.appendChild(tl);
    }

    // Kontrol noktaları
    p.forEach((pt, i) => {
      const isEnd = i === 0 || i === p.length - 1;
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', '10');
      c.setAttribute('fill', isEnd ? COLORS.curve : COLORS.ctrl);
      c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '2'); c.setAttribute('style', 'cursor:grab');
      c.dataset.idx = i;
      svg.appendChild(c);

      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', pt.x); lbl.setAttribute('y', pt.y - 16);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('font-size', '11');
      lbl.setAttribute('fill', COLORS.ctrl); lbl.setAttribute('font-weight', '600');
      lbl.textContent = `P${i}`;
      svg.appendChild(lbl);
    });
  }, [showSkeleton, showDecast, showTangent]);

  useEffect(() => { draw(); }, [pts, tVal, showSkeleton, showDecast, showTangent, draw]);

  const handleMouseDown = (e) => {
    const target = e.target;
    if (target.dataset.idx !== undefined) { dragIdx.current = parseInt(target.dataset.idx); e.preventDefault(); }
  };
  const handleMouseMove = (e) => {
    if (dragIdx.current < 0) return;
    e.preventDefault();
    const p = svgCoords(e);
    setPts(prev => { const next = [...prev]; next[dragIdx.current] = { x: Math.max(10, Math.min(W-10, p.x)), y: Math.max(10, Math.min(H-10, p.y)) }; return next; });
  };
  const handleMouseUp = () => { dragIdx.current = -1; };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => { window.removeEventListener('mouseup', handleMouseUp); window.removeEventListener('touchend', handleMouseUp); };
  }, []);

  const toggleAnim = () => {
    if (animRef.current) { clearInterval(animRef.current); animRef.current = null; setIsAnim(false); return; }
    setIsAnim(true);
    animRef.current = setInterval(() => {
      tRef.current += animDir.current * 0.008;
      if (tRef.current >= 1) { tRef.current = 1; animDir.current = -1; }
      if (tRef.current <= 0) { tRef.current = 0; animDir.current = 1; }
      setTVal(parseFloat(tRef.current.toFixed(3)));
    }, 30);
  };

  const addPoint = () => {
    if (pts.length >= 8) return;
    const last = pts[pts.length - 1], prev = pts[pts.length - 2];
    setPts([...pts, { x: Math.max(20, Math.min(W-20, last.x + (last.x - prev.x) * 0.5 + Math.random() * 60 - 30)), y: Math.max(40, Math.min(H-40, last.y + (Math.random()-0.5)*120)) }]);
  };

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Derece</div>
          <div className="text-2xl font-medium">{pts.length - 1}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>{pts.length === 4 ? 'Kübik' : pts.length === 3 ? 'Quadratik' : pts.length === 2 ? 'Lineer' : `${pts.length - 1}. derece`}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>t parametresi</div>
          <div className="text-2xl font-medium">{tVal.toFixed(2)}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>0 → 1</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Kontrol noktası</div>
          <div className="text-2xl font-medium">{pts.length}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>sürüklenebilir</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>t =</label>
        <input type="range" min="0" max="100" value={Math.round(tVal * 100)} className="flex-1"
          onChange={e => { tRef.current = parseInt(e.target.value)/100; setTVal(tRef.current); }} />
        <span className="text-sm font-medium w-10 text-right">{tVal.toFixed(2)}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2 mb-4">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block"
          style={{ cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
          onTouchStart={e => { const t2 = e.target; if (t2.dataset.idx !== undefined) { dragIdx.current = parseInt(t2.dataset.idx); e.preventDefault(); } }}
          onTouchMove={e => { if (dragIdx.current < 0) return; e.preventDefault(); const p = svgCoords(e); setPts(prev => { const next=[...prev]; next[dragIdx.current]={x:Math.max(10,Math.min(W-10,p.x)),y:Math.max(10,Math.min(H-10,p.y))}; return next; }); }}
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <button onClick={addPoint} disabled={pts.length >= 8} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">+ Nokta ekle</button>
        <button onClick={() => { if (pts.length > 2) setPts(pts.slice(0,-1)); }} disabled={pts.length <= 2} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">− Nokta çıkar</button>
        <button onClick={toggleAnim} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">{isAnim ? '⏹ Durdur' : '▶ Animasyon'}</button>
        <button onClick={() => { setPts(DEFAULT_PTS.map(p=>({...p}))); setTVal(0.5); tRef.current=0.5; }} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sıfırla</button>
      </div>

      <div className="flex gap-4 flex-wrap mb-4 text-sm">
        {[
          { label: 'Kontrol iskelet', val: showSkeleton, set: setShowSkeleton },
          { label: 'De Casteljau adımları', val: showDecast, set: setShowDecast },
          { label: 'Teğet vektör', val: showTangent, set: setShowTangent },
        ].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--color-text-soft)' }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed font-mono" style={{ color: 'var(--color-text-soft)' }}>
        {info}
      </p>
    </div>
  );
}

export default function BezierPage() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Bezier eğrisi: kontrol noktalarının dansı
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · geometri · 10 dakika okuma</p>

        <p>
          Photoshop&apos;ta kalem aracı, CSS animasyonlarındaki <code>cubic-bezier</code>, 
          fonttaki harflerin pürüzsüz köşeleri, arabaların gövde tasarımı — 
          hepsinin arkasında aynı matematik var: Bezier eğrileri.
        </p>
        <p>
          Pierre Bézier&apos;nin 1960&apos;larda Renault&apos;da araba gövdesi tasarımı için 
          geliştirdiği bu yöntem, bugün dijital tasarımın temel taşı. 
          Önce oyna, sonra anlat.
        </p>

        <h2>Önce dene</h2>
        <p>
          Yeşil noktalar başlangıç/bitiş, mor noktalar kontrol noktaları.
          Sürükle, t kaydır, animasyonu izle.
        </p>

        <BezierDemo />

        <h2>t parametresi ne anlama geliyor?</h2>
        <p>
          Bezier eğrisinde <strong>t</strong>, 0&apos;dan 1&apos;e giden bir parametredir.
          t=0 başlangıç noktası, t=1 bitiş noktası, t=0.5 eğrinin tam ortası.
          Ama dikkat: t=0.5, eğrinin geometrik olarak tam ortası değildir — 
          parametre uzayının ortasıdır.
        </p>

        <h2>De Casteljau algoritması</h2>
        <p>
          Demodan da görebileceğin gibi, renkli çizgiler eğri üzerindeki noktayı
          adım adım hesaplıyor. Algoritma şu: her adımda komşu noktalar arasında
          t oranında lineer interpolasyon yap. Tek nokta kalana kadar devam et.
        </p>

        <pre>{`def de_casteljau(points, t):
    """Bezier eğrisinde t parametresindeki noktayı bul."""
    pts = list(points)
    while len(pts) > 1:
        pts = [
            lerp(pts[i], pts[i+1], t)
            for i in range(len(pts)-1)
        ]
    return pts[0]

def lerp(a, b, t):
    """İki nokta arasında t oranında interpolasyon."""
    return (
        a[0] + (b[0]-a[0])*t,
        a[1] + (b[1]-a[1])*t
    )

# Kübik Bezier — 4 kontrol noktası
P = [(80,300), (160,80), (440,80), (520,300)]

# t=0.5'teki nokta
x, y = de_casteljau(P, 0.5)
print(f"t=0.5 → ({x:.1f}, {y:.1f})")`}</pre>

        <h2>Kapalı form formülü</h2>
        <p>
          De Casteljau özyinelemeli ama kapalı form da var. 
          Bernstein polinomları ile yazılır:
        </p>

        <pre>{`import numpy as np
from math import comb

def bezier(points, t):
    """Bernstein polinomu ile Bezier eğrisi."""
    n = len(points) - 1
    result = np.zeros(2)
    for i, p in enumerate(points):
        # Bernstein baz fonksiyonu
        B = comb(n, i) * (t**i) * ((1-t)**(n-i))
        result += B * np.array(p)
    return result

# Kübik Bezier formülü:
# B(t) = (1-t)³P₀ + 3(1-t)²t·P₁ + 3(1-t)t²·P₂ + t³P₃

# Tüm eğriyi çiz
ts = np.linspace(0, 1, 200)
curve = [bezier(P, t) for t in ts]`}</pre>

        <h2>CSS'de Bezier</h2>
        <p>
          CSS animasyonlarında kullandığın <code>ease</code>, <code>ease-in</code>, 
          <code>ease-out</code> hepsi birer kübik Bezier eğrisi:
        </p>

        <pre>{`/* CSS cubic-bezier(x1, y1, x2, y2) */
/* P0=(0,0) ve P3=(1,1) sabit, P1 ve P2 sen seçersin */

.element {
  /* ease: yavaş başla, hızlan, yavaşla */
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  
  /* ease-in: yavaş başla, hızla bitir */
  transition: all 0.3s cubic-bezier(0.42, 0, 1.0, 1.0);
  
  /* ease-out: hızlı başla, yavaşla */
  transition: all 0.3s cubic-bezier(0, 0, 0.58, 1.0);
  
  /* linear: sabit hız */
  transition: all 0.3s cubic-bezier(0, 0, 1, 1);
}`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Bezier eğrileri bilgisayar grafiğinin ortak dili. Illustrator, Figma, 
            After Effects, Three.js — hepsinde aynı matematik çalışıyor. 
            Bir kez anlayan, her yerde tanır.
          </p>
        </blockquote>

        <h2>Nererde kullanılır?</h2>
        <ul>
          <li><strong>Font tasarımı:</strong> TrueType ve PostScript fontlarda her harf Bezier eğrilerinden oluşur.</li>
          <li><strong>Vektör grafikler:</strong> SVG&apos;deki <code>C</code> ve <code>Q</code> komutları kübik ve quadratik Bezier&apos;dir.</li>
          <li><strong>Animasyon:</strong> CSS <code>cubic-bezier</code>, CSS Motion Path, GSAP hepsi Bezier kullanır.</li>
          <li><strong>Oyun geliştirme:</strong> Karakter hareketi, kamera yolları, mermi yörüngeleri.</li>
          <li><strong>CAD/CAM:</strong> Araba, uçak, endüstriyel tasarım — NURBS eğrilerinin temeli Bezier.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki geometri içeriği: <strong>Fourier Dönüşümü</strong> — 
          dönen çemberlerle herhangi bir şekli çizmek mümkün mü?
        </p>
      </article>
    </main>
  );
}
