'use client';

import { useEffect, useRef } from 'react';

/* ── Animation 1: Neural Network ── */
function NeuralNetAnim() {
  return (
    <>
      <style>{`
        @keyframes ha-pulse { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:1;transform:scale(1.18)} }
        @keyframes ha-flow { 0%{stroke-dashoffset:120} 100%{stroke-dashoffset:0} }
        @keyframes ha-glow { 0%,100%{filter:drop-shadow(0 0 6px #6366f188)} 50%{filter:drop-shadow(0 0 14px #6366f1cc)} }
        .ha-nn-wrap { width:100%;height:100%;display:flex;align-items:center;justify-content:center; }
        .ha-nn-wrap svg { animation: ha-glow 3s ease-in-out infinite; }
      `}</style>
      <div className="ha-nn-wrap">
        <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
          {/* Layer 1 — 3 nodes */}
          {[40,100,160].map((y, i) => (
            <circle key={`l1-${i}`} cx="50" cy={y} r="14"
              fill="#6366f1" opacity="0.9"
              style={{ animation: `ha-pulse ${1.4 + i * 0.3}s ease-in-out infinite` }} />
          ))}
          {/* Layer 2 — 4 nodes */}
          {[30,80,130,170].map((y, i) => (
            <circle key={`l2-${i}`} cx="130" cy={y} r="14"
              fill="#8b5cf6" opacity="0.85"
              style={{ animation: `ha-pulse ${1.2 + i * 0.25}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
          ))}
          {/* Layer 3 — 2 nodes */}
          {[70, 130].map((y, i) => (
            <circle key={`l3-${i}`} cx="210" cy={y} r="14"
              fill="#14b8a6" opacity="0.9"
              style={{ animation: `ha-pulse ${1.6 + i * 0.35}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
          ))}
          {/* Edges L1→L2 */}
          {[40,100,160].flatMap((y1, i) =>
            [30,80,130,170].map((y2, j) => (
              <line key={`e1-${i}-${j}`} x1="64" y1={y1} x2="116" y2={y2}
                stroke="#6366f1" strokeWidth="1.2" opacity="0.28"
                strokeDasharray="8 4"
                style={{ animation: `ha-flow ${1.8 + (i + j) * 0.2}s linear infinite`, animationDelay: `${(i * 4 + j) * 0.08}s` }} />
            ))
          )}
          {/* Edges L2→L3 */}
          {[30,80,130,170].flatMap((y1, i) =>
            [70,130].map((y2, j) => (
              <line key={`e2-${i}-${j}`} x1="144" y1={y1} x2="196" y2={y2}
                stroke="#8b5cf6" strokeWidth="1.2" opacity="0.28"
                strokeDasharray="8 4"
                style={{ animation: `ha-flow ${1.6 + (i + j) * 0.22}s linear infinite`, animationDelay: `${(i * 2 + j) * 0.1}s` }} />
            ))
          )}
          {/* Labels */}
          <text x="50" y="190" textAnchor="middle" fontSize="9" fill="#6366f188">Girdi</text>
          <text x="130" y="190" textAnchor="middle" fontSize="9" fill="#8b5cf688">Gizli</text>
          <text x="210" y="160" textAnchor="middle" fontSize="9" fill="#14b8a688">Çıktı</text>
        </svg>
      </div>
    </>
  );
}

/* ── Animation 2: Animated Bar Chart ── */
function BarChartAnim() {
  const bars = [
    { h: 55,  color: '#14b8a6', label: 'Oca', delay: '0s'    },
    { h: 80,  color: '#6366f1', label: 'Şub', delay: '0.1s'  },
    { h: 60,  color: '#8b5cf6', label: 'Mar', delay: '0.2s'  },
    { h: 110, color: '#14b8a6', label: 'Nis', delay: '0.3s'  },
    { h: 75,  color: '#6366f1', label: 'May', delay: '0.4s'  },
    { h: 130, color: '#fb923c', label: 'Haz', delay: '0.5s'  },
    { h: 90,  color: '#8b5cf6', label: 'Tem', delay: '0.6s'  },
  ];
  return (
    <>
      <style>{`
        @keyframes ha-bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes ha-bar-shine { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .ha-bar-item { transform-origin: bottom; animation: ha-bar-grow 1s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '20px 16px 32px', gap: '10px', position: 'relative' }}>
        {/* Y-axis lines */}
        {[0.25,0.5,0.75,1].map(f => (
          <div key={f} style={{
            position: 'absolute', left: '16px', right: '16px',
            bottom: `${32 + f * 130}px`,
            borderTop: '1px dashed rgba(255,255,255,0.07)',
          }} />
        ))}
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flex: 1 }}>
            <div className="ha-bar-item" style={{
              width: '100%', height: `${b.h}px`, borderRadius: '6px 6px 3px 3px',
              background: `linear-gradient(180deg, ${b.color}dd, ${b.color}66)`,
              boxShadow: `0 0 12px ${b.color}44`,
              animationDelay: b.delay,
              animation: `ha-bar-grow 0.9s cubic-bezier(.34,1.56,.64,1) ${b.delay} both, ha-bar-shine 2.5s ease-in-out ${b.delay} infinite`,
            }} />
            <span style={{ fontSize: '9px', color: 'var(--v3-text-faint)', whiteSpace: 'nowrap' }}>{b.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Animation 3: Scatter Plot / K-Means Clustering ── */
function ScatterAnim() {
  const clusters = [
    { cx: 70,  cy: 70,  color: '#6366f1', dots: [[60,60],[80,55],[65,80],[85,75],[55,75]] },
    { cx: 185, cy: 70,  color: '#14b8a6', dots: [[175,60],[195,65],[180,80],[200,75],[170,75]] },
    { cx: 130, cy: 150, color: '#fb923c', dots: [[120,145],[140,140],[125,160],[145,155],[115,155]] },
  ];
  return (
    <>
      <style>{`
        @keyframes ha-dot-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(var(--dx),var(--dy))} }
        @keyframes ha-centroid { 0%,100%{r:7} 50%{r:10} }
      `}</style>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
          {/* Axis */}
          <line x1="24" y1="176" x2="240" y2="176" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="24" y1="176" x2="24"  y2="16"  stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {clusters.map((cl, ci) =>
            cl.dots.map((d, di) => {
              const dx = (Math.random() * 8 - 4).toFixed(1);
              const dy = (Math.random() * 8 - 4).toFixed(1);
              return (
                <circle key={`${ci}-${di}`} cx={d[0]} cy={d[1]} r="5"
                  fill={cl.color} opacity="0.7"
                  style={{
                    '--dx': `${dx}px`, '--dy': `${dy}px`,
                    animation: `ha-dot-float ${2 + di * 0.3}s ease-in-out infinite`,
                    animationDelay: `${ci * 0.4 + di * 0.15}s`,
                  }} />
              );
            })
          )}
          {/* Centroids */}
          {clusters.map((cl, ci) => (
            <circle key={`c-${ci}`} cx={cl.cx} cy={cl.cy} r="7"
              fill="none" stroke={cl.color} strokeWidth="2.5"
              style={{ animation: `ha-centroid ${1.5 + ci * 0.3}s ease-in-out infinite`, animationDelay: `${ci * 0.2}s` }} />
          ))}
          <text x="130" y="195" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">K-Means Kümeleme</text>
        </svg>
      </div>
    </>
  );
}

/* ── Animation 4: Floating Data / Code Stream ── */
function DataStreamAnim() {
  const lines = [
    { text: 'import pandas as pd',       delay: '0s',    speed: '8s',  opacity: 0.8 },
    { text: 'df = pd.read_csv("data.csv")', delay: '1s',  speed: '9s',  opacity: 0.65 },
    { text: 'df.head()',                  delay: '2s',   speed: '7s',  opacity: 0.5  },
    { text: 'X_train, X_test = split()', delay: '0.5s', speed: '10s', opacity: 0.7  },
    { text: 'model.fit(X_train, y_train)', delay: '1.5s', speed: '8.5s',opacity: 0.6 },
    { text: 'accuracy = 0.9423',          delay: '3s',   speed: '7.5s',opacity: 0.8  },
    { text: 'plt.plot(history)',           delay: '2.5s', speed: '9.5s',opacity: 0.55 },
    { text: 'from sklearn import KMeans', delay: '0.8s', speed: '8s',  opacity: 0.6  },
  ];
  return (
    <>
      <style>{`
        @keyframes ha-stream { from { transform: translateY(220px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { transform: translateY(-60px); opacity: 0; } }
        .ha-stream-wrap { width:100%;height:100%;overflow:hidden;position:relative;mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent); }
        .ha-stream-line { position:absolute; left:0; right:0; white-space:nowrap; font-family:monospace; font-size:11.5px; padding: 0 16px; }
      `}</style>
      <div className="ha-stream-wrap">
        {lines.map((l, i) => (
          <div key={i} className="ha-stream-line"
            style={{
              top: 0,
              color: i % 3 === 0 ? '#a5b4fc' : i % 3 === 1 ? '#5eead4' : '#fca5a5',
              opacity: l.opacity,
              animation: `ha-stream ${l.speed} linear ${l.delay} infinite`,
            }}>
            {l.text}
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Animation 5: Sine / Signal Wave ── */
function SineWaveAnim() {
  const W = 260, H = 160, cx = W / 2, cy = H / 2 + 5;
  const amp = 44, freq = 0.038;

  function buildPath(phaseOffset) {
    const pts = [];
    for (let x = 0; x <= W; x += 2) {
      const y = cy + amp * Math.sin(freq * x * Math.PI + phaseOffset);
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  }

  return (
    <>
      <style>{`
        @keyframes ha-wave1 { from { stroke-dashoffset: 520; } to { stroke-dashoffset: 0; } }
        @keyframes ha-wave2 { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
        @keyframes ha-wave3 { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
        @keyframes ha-dot-blink { 0%,100%{opacity:1;r:4} 50%{opacity:0.4;r:2.5} }
      `}</style>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={W} height={H + 40} viewBox={`0 0 ${W} ${H + 40}`} fill="none">
          {/* Grid */}
          {[0.25,0.5,0.75].map(f => (
            <line key={f} x1="0" y1={cy + amp * (f * 2 - 1)} x2={W} y2={cy + amp * (f * 2 - 1)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <line x1="0" y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Wave 3 — background */}
          <path d={buildPath(1.2)} stroke="#6366f1" strokeWidth="1.5" opacity="0.3"
            strokeDasharray="600" style={{ animation: 'ha-wave3 3.2s linear infinite' }} />
          {/* Wave 2 */}
          <path d={buildPath(0.6)} stroke="#8b5cf6" strokeWidth="2" opacity="0.55"
            strokeDasharray="420" style={{ animation: 'ha-wave2 2.6s linear infinite' }} />
          {/* Wave 1 — main */}
          <path d={buildPath(0)} stroke="#14b8a6" strokeWidth="2.5" opacity="0.9"
            strokeDasharray="520" style={{ animation: 'ha-wave1 2s linear infinite' }} />

          {/* Sampling dots */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const x = t * W;
            const y = cy + amp * Math.sin(freq * x * Math.PI);
            return (
              <circle key={i} cx={x} cy={y} r="4" fill="#14b8a6"
                style={{ animation: `ha-dot-blink 1.8s ease-in-out ${i * 0.3}s infinite` }} />
            );
          })}

          <text x={W / 2} y={H + 32} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
            Veri Sinyali
          </text>
        </svg>
      </div>
    </>
  );
}

/* ── Public map: id → component + meta ── */
export const HERO_ANIMATIONS = {
  '1': { component: NeuralNetAnim,  label: 'Sinir Ağı',    emoji: '🧠' },
  '2': { component: BarChartAnim,   label: 'Bar Chart',    emoji: '📊' },
  '3': { component: ScatterAnim,    label: 'K-Means',      emoji: '🔵' },
  '4': { component: DataStreamAnim, label: 'Kod Akışı',    emoji: '💻' },
  '5': { component: SineWaveAnim,   label: 'Sinyal Dalgası', emoji: '〰️' },
};

export default function HeroAnimation({ id = '1' }) {
  const entry = HERO_ANIMATIONS[id] || HERO_ANIMATIONS['1'];
  const Comp = entry.component;
  return <Comp />;
}
