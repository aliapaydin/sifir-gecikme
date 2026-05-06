'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const SKY = [
  { t: 0,   top: '#0a0a1a', bot: '#1a1a3a', name: 'Gece yarısı',   sub: 'yıldızlar sayılıyor' },
  { t: 15,  top: '#1a0a2a', bot: '#3a1a4a', name: 'Gece sonu',     sub: 'son analizler bitmek üzere' },
  { t: 25,  top: '#4a2040', bot: '#8a4060', name: 'Şafak',         sub: 'veri yüklemeleri başlıyor' },
  { t: 35,  top: '#e8804a', bot: '#f0b070', name: 'Gün doğumu',    sub: 'dashboard\'lar canlanıyor' },
  { t: 50,  top: '#5ba8d8', bot: '#a8d4f0', name: 'Gün ortası',    sub: 'raporlar hazırlanıyor' },
  { t: 65,  top: '#4a90c8', bot: '#90c8e8', name: 'Öğleden sonra', sub: 'modeller çalışıyor' },
  { t: 75,  top: '#e8904a', bot: '#f0c070', name: 'Gün batımı',    sub: 'sonuçlar yorumlanıyor' },
  { t: 88,  top: '#3a2050', bot: '#6a3070', name: 'Akşam',         sub: 'notebook kapatılıyor' },
  { t: 100, top: '#0a0a1a', bot: '#1a1a3a', name: 'Gece',          sub: 'veriler uyuyor' },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function hexToRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function lerpColor(c1, c2, t) {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  return `rgb(${Math.round(lerp(a[0],b[0],t))},${Math.round(lerp(a[1],b[1],t))},${Math.round(lerp(a[2],b[2],t))})`;
}
function getSkyAt(v) {
  for (let i = 0; i < SKY.length - 1; i++) {
    const s = SKY[i], e = SKY[i+1];
    if (v >= s.t && v <= e.t) {
      const t = (v - s.t) / (e.t - s.t);
      return { top: lerpColor(s.top,e.top,t), bot: lerpColor(s.bot,e.bot,t), name: t<0.5?s.name:e.name, sub: t<0.5?s.sub:e.sub };
    }
  }
  return SKY[SKY.length-1];
}

const STARS = [[0.1,0.1],[0.3,0.05],[0.5,0.08],[0.7,0.12],[0.85,0.06],[0.2,0.2],[0.6,0.15],[0.9,0.2],[0.15,0.3],[0.45,0.25],[0.75,0.22],[0.95,0.1]];
const BUILDINGS = [0,1,2,3,4,5,6,7].map(i => ({
  x: 0.05 + i * 0.13,
  h: 0.2 + Math.sin(i * 2.3) * 0.08,
  w: 0.06 + Math.cos(i * 1.7) * 0.02,
}));
const TREES = [0.02, 0.12, 0.22, 0.78, 0.88, 0.96];

function drawFrame(canvas, v) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const sky = getSkyAt(v);

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, sky.top);
  grad.addColorStop(1, sky.bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const nightness = v < 25 ? (25 - v) / 25 : v > 75 ? (v - 75) / 25 : 0;
  if (nightness > 0.1) {
    STARS.forEach(([sx, sy]) => {
      ctx.save();
      ctx.globalAlpha = nightness * 0.8;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(sx * W, sy * H * 0.6, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  const sunAngle = (v / 100) * Math.PI;
  const sunX = W * 0.5 + Math.cos(Math.PI - sunAngle) * W * 0.45;
  const sunY = H * 0.55 - Math.sin(sunAngle) * H * 0.65;

  if (v > 25 && v < 75 && sunY < H - 30) {
    const brightness = 1 - Math.abs(v - 50) / 30;
    ctx.save();
    ctx.globalAlpha = Math.max(0, brightness) * 0.3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(sunX, sunY, 36, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = Math.max(0, brightness);
    ctx.fillStyle = '#FFF176';
    ctx.beginPath(); ctx.arc(sunX, sunY, 18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  if ((v <= 25 || v >= 75) && sunY < H - 30) {
    ctx.save();
    ctx.fillStyle = '#E8E8CC'; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(sunX, sunY, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = sky.top;
    ctx.beginPath(); ctx.arc(sunX - 5, sunY - 3, 11, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  const groundY = H * 0.68;
  ctx.fillStyle = '#1a2a1a';
  ctx.fillRect(0, groundY, W, H - groundY);

  BUILDINGS.forEach(({ x, h, w }) => {
    const bx = x * W, bh = h * H, bw = w * W;
    ctx.fillStyle = '#0d1a0d';
    ctx.fillRect(bx, groundY - bh, bw, bh);
    const wx = bw * 0.25, wh = H * 0.04, wg = bw * 0.25;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const isLit = nightness > 0.3 && Math.random() > 0.5;
        ctx.fillStyle = isLit ? '#FFD700' : '#0a140a';
        ctx.fillRect(bx + c*(wx+wg) + wg*0.5, groundY - bh + H*0.04 + r*(wh+H*0.015), wx, wh);
      }
    }
  });

  TREES.forEach(tx => {
    const th = H * 0.22 + Math.sin(tx * 10) * H * 0.06;
    const cx = tx * W;
    ctx.fillStyle = '#0a160a';
    ctx.beginPath(); ctx.moveTo(cx, groundY-th); ctx.lineTo(cx-W*0.025, groundY); ctx.lineTo(cx+W*0.025, groundY); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, groundY-th*1.3); ctx.lineTo(cx-W*0.018, groundY-th*0.5); ctx.lineTo(cx+W*0.018, groundY-th*0.5); ctx.closePath(); ctx.fill();
  });

  const ambient = v > 25 && v < 75 ? 0.15 : 0.05;
  ctx.fillStyle = `rgba(100,180,120,${ambient})`;
  ctx.fillRect(0, groundY, W, H - groundY);

  return sky;
}

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const valRef = useRef(50);
  const dirRef = useRef(1);
  const animRef = useRef(null);
  const idleTimerRef = useRef(null);
  const [val, setVal] = useState(50);
  const [sky, setSky] = useState(getSkyAt(50));
  const [isAuto, setIsAuto] = useState(false);

  const redraw = useCallback((v) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = drawFrame(canvas, v);
    setSky(s);
  }, []);

  const startAuto = useCallback(() => {
    if (animRef.current) return;
    setIsAuto(true);
    let last = null;
    const step = (ts) => {
      if (!last) last = ts;
      const delta = ts - last;
      last = ts;
      valRef.current += dirRef.current * delta * 0.012;
      if (valRef.current >= 100) { valRef.current = 100; dirRef.current = -1; }
      if (valRef.current <= 0)   { valRef.current = 0;   dirRef.current = 1;  }
      setVal(Math.round(valRef.current));
      redraw(valRef.current);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, [redraw]);

  const stopAuto = useCallback(() => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    setIsAuto(false);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      startAuto();
    }, 2000);
  }, [startAuto]);

  const handleChange = useCallback((e) => {
    stopAuto();
    const v = parseInt(e.target.value);
    valRef.current = v;
    setVal(v);
    redraw(v);
    resetIdleTimer();
  }, [stopAuto, redraw, resetIdleTimer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      redraw(valRef.current);
    };
    resize();
    window.addEventListener('resize', resize);

    idleTimerRef.current = setTimeout(() => startAuto(), 2000);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [redraw, startAuto]);

  return (
    <div style={{ marginBottom: '0' }}>
      <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', borderBottom: '0.5px solid var(--color-border)' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '8px 14px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
            {isAuto ? '▶ otomatik' : '◎ manuel'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>{sky.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{sky.sub}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px 0', background: 'var(--color-cream)' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>🌙</span>
        <input
          type="range" min="0" max="100"
          value={val}
          onChange={handleChange}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>🌙</span>
      </div>
    </div>
  );
}
