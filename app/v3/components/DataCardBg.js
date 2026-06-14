'use client';

// Hafif, bulanık data temalı SVG arkaplanlar.
// Opacity wrapper span'da tutulur; içerik okunabilirliğini engellemez.

const PATTERNS = [
  // Bar chart — yükselen
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: '-5%', width: '48%', height: '62%' }}>
      <rect x="10" y="55" width="12" height="25" rx="2" fill="currentColor"/>
      <rect x="28" y="42" width="12" height="38" rx="2" fill="currentColor"/>
      <rect x="46" y="28" width="12" height="52" rx="2" fill="currentColor"/>
      <rect x="64" y="15" width="12" height="65" rx="2" fill="currentColor"/>
      <rect x="82" y="35" width="12" height="45" rx="2" fill="currentColor"/>
      <rect x="100" y="20" width="12" height="60" rx="2" fill="currentColor"/>
    </svg>
  ),
  // Scatter plot
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '65%' }}>
      <circle cx="15" cy="60" r="4" fill="currentColor"/>
      <circle cx="35" cy="45" r="5" fill="currentColor"/>
      <circle cx="52" cy="55" r="3" fill="currentColor"/>
      <circle cx="68" cy="28" r="6" fill="currentColor"/>
      <circle cx="80" cy="38" r="4" fill="currentColor"/>
      <circle cx="95" cy="20" r="5" fill="currentColor"/>
      <circle cx="108" cy="32" r="3" fill="currentColor"/>
      <circle cx="25" cy="68" r="3" fill="currentColor"/>
      <circle cx="60" cy="65" r="4" fill="currentColor"/>
      <line x1="10" y1="70" x2="115" y2="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
    </svg>
  ),
  // Area chart
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', height: '55%' }}>
      <path d="M0 65 L20 50 L40 55 L60 30 L80 20 L100 35 L120 15 L120 80 L0 80 Z" fill="currentColor" opacity="0.4"/>
      <path d="M0 65 L20 50 L40 55 L60 30 L80 20 L100 35 L120 15" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <circle cx="60" cy="30" r="4" fill="currentColor"/>
      <circle cx="80" cy="20" r="4" fill="currentColor"/>
    </svg>
  ),
  // Donut
  () => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '38%', height: '38%' }}>
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray="80 120"/>
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray="50 150" strokeDashoffset="-80" opacity="0.6"/>
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray="70 130" strokeDashoffset="-130" opacity="0.35"/>
    </svg>
  ),
  // Line chart + grid
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '60%' }}>
      <line x1="0" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4"/>
      <line x1="0" y1="40" x2="120" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4"/>
      <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4"/>
      <polyline points="10,65 30,45 50,50 70,25 90,35 110,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="70" cy="25" r="4" fill="currentColor"/>
      <circle cx="110" cy="18" r="4" fill="currentColor"/>
    </svg>
  ),
  // Histogram
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '58%' }}>
      <rect x="5"  y="60" width="14" height="20" fill="currentColor" opacity="0.5"/>
      <rect x="20" y="42" width="14" height="38" fill="currentColor" opacity="0.65"/>
      <rect x="35" y="22" width="14" height="58" fill="currentColor" opacity="0.85"/>
      <rect x="50" y="15" width="14" height="65" fill="currentColor"/>
      <rect x="65" y="25" width="14" height="55" fill="currentColor" opacity="0.85"/>
      <rect x="80" y="45" width="14" height="35" fill="currentColor" opacity="0.65"/>
      <rect x="95" y="62" width="14" height="18" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  // Network / nodes
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '62%' }}>
      <line x1="30" y1="40" x2="60" y2="20" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="30" y1="40" x2="55" y2="60" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="60" y1="20" x2="90" y2="30" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="55" y1="60" x2="90" y2="55" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="90" y1="30" x2="90" y2="55" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="60" y1="20" x2="55" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3"/>
      <circle cx="30" cy="40" r="6" fill="currentColor"/>
      <circle cx="60" cy="20" r="5" fill="currentColor"/>
      <circle cx="55" cy="60" r="5" fill="currentColor"/>
      <circle cx="90" cy="30" r="7" fill="currentColor"/>
      <circle cx="90" cy="55" r="4" fill="currentColor"/>
    </svg>
  ),
  // Stacked bars
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, width: '46%', height: '58%' }}>
      <rect x="10" y="50" width="18" height="30" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="10" y="35" width="18" height="15" rx="2" fill="currentColor" opacity="0.55"/>
      <rect x="10" y="22" width="18" height="13" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="38" y="42" width="18" height="38" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="38" y="28" width="18" height="14" rx="2" fill="currentColor" opacity="0.55"/>
      <rect x="66" y="48" width="18" height="32" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="66" y="30" width="18" height="18" rx="2" fill="currentColor" opacity="0.55"/>
      <rect x="66" y="18" width="18" height="12" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="94" y="38" width="18" height="42" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="94" y="20" width="18" height="18" rx="2" fill="currentColor" opacity="0.55"/>
    </svg>
  ),
  // EKG sinyali
  () => (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: '10%', right: 0, width: '55%', height: '50%' }}>
      <polyline points="0,40 15,40 20,15 25,65 30,40 50,40 55,20 60,60 65,40 85,40 90,10 95,70 100,40 120,40"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  // Heatmap (deterministik)
  () => {
    const ops = [0.9,0.4,0.7,0.2,0.6, 0.3,0.8,0.5,0.9,0.3, 0.7,0.2,0.8,0.4,0.6, 0.5,0.9,0.3,0.7,0.2];
    let i = 0;
    return (
      <svg viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: 0, right: 0, width: '42%', height: '52%' }}>
        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
          <rect key={`${col}-${row}`} x={col*18+2} y={row*17+2} width="15" height="14" rx="2"
            fill="currentColor" opacity={ops[i++] || 0.5}/>
        )))}
      </svg>
    );
  },
];

function patternIndex(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % PATTERNS.length;
}

export default function DataCardBg({ href, opacity = 0.18, color = 'currentColor' }) {
  const idx = patternIndex(href || '');
  const Pattern = PATTERNS[idx];
  return (
    <span style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      borderRadius: 'inherit', pointerEvents: 'none',
      color, opacity, filter: 'blur(0.8px)',
    }}>
      <Pattern />
    </span>
  );
}
