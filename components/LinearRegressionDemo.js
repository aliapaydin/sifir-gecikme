'use client';

import { useState, useEffect, useRef } from 'react';

export default function LinearRegressionDemo() {
  const [points, setPoints] = useState([]);
  const [showResid, setShowResid] = useState(false);
  const svgRef = useRef(null);
  const dragIdx = useRef(-1);

  const VB_W = 600, VB_H = 400;
  const PAD_L = 40, PAD_R = 20, PAD_T = 20, PAD_B = 40;

  const pxToData = (px, py) => ({
    x: ((px - PAD_L) / (VB_W - PAD_L - PAD_R)) * 10,
    y: ((VB_H - PAD_B - py) / (VB_H - PAD_T - PAD_B)) * 10,
  });

  const dataToPx = (x, y) => ({
    px: PAD_L + (x / 10) * (VB_W - PAD_L - PAD_R),
    py: VB_H - PAD_B - (y / 10) * (VB_H - PAD_T - PAD_B),
  });

  const fit = () => {
    if (points.length < 2) return null;
    const n = points.length;
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (const p of points) { sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; }
    const mx = sx / n, my = sy / n;
    const denom = sxx - n * mx * mx;
    if (Math.abs(denom) < 1e-9) return null;
    const m = (sxy - n * mx * my) / denom;
    const b = my - m * mx;
    let ssTot = 0, ssRes = 0;
    for (const p of points) { ssTot += (p.y - my) ** 2; ssRes += (p.y - (m * p.x + b)) ** 2; }
    const r2 = ssTot < 1e-9 ? 1 : 1 - ssRes / ssTot;
    return { m, b, r2 };
  };

  const svgCoords = (evt) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    const t = evt.touches ? evt.touches[0] : evt;
    pt.x = t.clientX; pt.y = t.clientY;
    const ctm = svg.getScreenCTM().inverse();
    const p = pt.matrixTransform(ctm);
    return { x: p.x, y: p.y };
  };

  const handleMouseDown = (evt) => {
    const target = evt.target;
    if (target.tagName === 'circle' && target.dataset.idx !== undefined) {
      dragIdx.current = parseInt(target.dataset.idx);
      evt.preventDefault();
    } else {
      const { x: sx, y: sy } = svgCoords(evt);
      if (sx < PAD_L || sx > VB_W - PAD_R || sy < PAD_T || sy > VB_H - PAD_B) return;
      const d = pxToData(sx, sy);
      setPoints([...points, d]);
    }
  };

  const handleMouseMove = (evt) => {
    if (dragIdx.current < 0) return;
    evt.preventDefault();
    const { x: sx, y: sy } = svgCoords(evt);
    const cx = Math.max(PAD_L, Math.min(VB_W - PAD_R, sx));
    const cy = Math.max(PAD_T, Math.min(VB_H - PAD_B, sy));
    const newPoints = [...points];
    newPoints[dragIdx.current] = pxToData(cx, cy);
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    dragIdx.current = -1;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const loadSample = () => {
    const newPts = [];
    for (let i = 0; i < 12; i++) {
      const x = 0.5 + i * 0.8;
      const y = 1.2 + 0.7 * x + (Math.random() - 0.5) * 0.6;
      newPts.push({ x, y: Math.max(0.2, Math.min(9.8, y)) });
    }
    setPoints(newPts);
  };

  const loadNoisy = () => {
    const newPts = [];
    for (let i = 0; i < 15; i++) {
      newPts.push({ x: Math.random() * 9.5 + 0.25, y: Math.random() * 9.5 + 0.25 });
    }
    setPoints(newPts);
  };

  useEffect(() => { loadSample(); }, []);

  const f = fit();
  let lineCoords = null;
  if (f) {
    const { px: x1, py: y1 } = dataToPx(0, f.b);
    const { px: x2, py: y2 } = dataToPx(10, f.m * 10 + f.b);
    lineCoords = {
      x1: Math.max(PAD_L, Math.min(VB_W - PAD_R, x1)),
      y1: Math.max(PAD_T, Math.min(VB_H - PAD_B, y1)),
      x2: Math.max(PAD_L, Math.min(VB_W - PAD_R, x2)),
      y2: Math.max(PAD_T, Math.min(VB_H - PAD_B, y2)),
    };
  }

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Denklem</div>
          <div className="text-sm font-mono font-medium">
            {f ? `y = ${f.m.toFixed(2)}x + ${f.b.toFixed(2)}` : '2+ nokta gerekli'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">R²</div>
          <div className="text-2xl font-medium">{f ? f.r2.toFixed(3) : '0.00'}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Nokta</div>
          <div className="text-2xl font-medium">{points.length}</div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-auto block cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
        >
          <defs>
            <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={VB_W} height={VB_H} fill="url(#grid)" />
          <line x1={PAD_L} y1={VB_H - PAD_B} x2={VB_W - PAD_R} y2={VB_H - PAD_B} stroke="#9ca3af" strokeWidth="1" />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={VB_H - PAD_B} stroke="#9ca3af" strokeWidth="1" />
          {lineCoords && (
            <line x1={lineCoords.x1} y1={lineCoords.y1} x2={lineCoords.x2} y2={lineCoords.y2} stroke="#3b82f6" strokeWidth="2.5" />
          )}
          {showResid && f && points.map((p, i) => {
            const pred = f.m * p.x + f.b;
            const a = dataToPx(p.x, p.y);
            const b = dataToPx(p.x, pred);
            return <line key={`r${i}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />;
          })}
          {points.map((p, i) => {
            const { px, py } = dataToPx(p.x, p.y);
            return (
              <circle key={i} cx={px} cy={py} r="7" fill="#7c3aed" stroke="#1e1b4b" strokeWidth="1.5" data-idx={i} style={{ cursor: 'grab' }} />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={loadSample} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Örnek veri</button>
        <button onClick={loadNoisy} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Gürültülü veri</button>
        <button onClick={() => setPoints([])} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Temizle</button>
        <button onClick={() => setShowResid(!showResid)} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {showResid ? 'Hataları gizle' : 'Hataları göster'}
        </button>
      </div>
      <p className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed">
        <strong className="text-gray-900">Nasıl çalışır:</strong> Mavi çizgi, tüm noktalara olan dikey uzaklıkların karelerinin toplamını minimize eder (en küçük kareler). R² 1'e yakınsa model veriyi iyi açıklıyor, 0'a yakınsa zayıf bir uyum vardır.
      </p>
    </div>
  );
}
