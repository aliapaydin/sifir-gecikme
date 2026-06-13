'use client';

const logos = [
  {
    id: 1,
    name: 'Pulse',
    desc: 'EKG nabız çizgisi — "sıfır gecikme" yi doğrudan anlatıyor',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#14b8a6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g1)" opacity="0.15"/>
          <polyline points="3,14 7,14 10,7 13,21 16,11 19,14 25,14"
            stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
  {
    id: 2,
    name: 'Neural Node',
    desc: 'Bağlı veri noktaları — data science temasına uygun',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g2)" opacity="0.15"/>
          <line x1="7" y1="21" x2="14" y2="8" stroke="url(#g2)" strokeWidth="1.5" opacity="0.6"/>
          <line x1="7" y1="21" x2="21" y2="18" stroke="url(#g2)" strokeWidth="1.5" opacity="0.6"/>
          <line x1="14" y1="8" x2="21" y2="18" stroke="url(#g2)" strokeWidth="1.5" opacity="0.6"/>
          <line x1="14" y1="8" x2="14" y2="18" stroke="url(#g2)" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="7" cy="21" r="3" fill="url(#g2)"/>
          <circle cx="14" cy="8" r="3.5" fill="url(#g2)"/>
          <circle cx="21" cy="18" r="3" fill="url(#g2)"/>
          <circle cx="14" cy="18" r="2" fill="url(#g2)" opacity="0.7"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
  {
    id: 3,
    name: 'Zero Bolt',
    desc: 'Sıfır içinde şimşek — hız ve "sıfır gecikme" bir arada',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#14b8a6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g3)" opacity="0.15"/>
          <ellipse cx="14" cy="14" rx="8" ry="9" stroke="url(#g3)" strokeWidth="2" fill="none"/>
          <polyline points="16,5 11,14 15,14 12,23" stroke="url(#g3)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
  {
    id: 4,
    name: 'Data Stack',
    desc: 'Üç katmanlı veri yığını — clean ve kurumsal',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g4)" opacity="0.15"/>
          <ellipse cx="14" cy="9" rx="8" ry="3" fill="url(#g4)"/>
          <path d="M6 9 Q6 14 14 14 Q22 14 22 9" stroke="url(#g4)" strokeWidth="1.8" fill="none"/>
          <ellipse cx="14" cy="14" rx="8" ry="3" fill="url(#g4)" opacity="0.65"/>
          <path d="M6 14 Q6 19 14 19 Q22 19 22 14" stroke="url(#g4)" strokeWidth="1.8" fill="none"/>
          <ellipse cx="14" cy="19" rx="8" ry="3" fill="url(#g4)" opacity="0.35"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
  {
    id: 5,
    name: 'Sigma',
    desc: 'İstatistik sembolü sigma (Σ) — veri bilimi klasiği',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#14b8a6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g5)" opacity="0.15"/>
          <path d="M20 6 H10 L16 14 L10 22 H20" stroke="url(#g5)" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
  {
    id: 6,
    name: 'Scatter Plot',
    desc: 'Scatter plot noktaları — en saf data science sembolü',
    render: () => (
      <a href="#" style={navStyle}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="g6x" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#14b8a6"/>
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="7" fill="url(#g6x)" opacity="0.12"/>
          <line x1="5" y1="23" x2="5" y2="5" stroke="url(#g6x)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="5" y1="23" x2="23" y2="23" stroke="url(#g6x)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9"  cy="19" r="2"   fill="#6366f1"/>
          <circle cx="12" cy="15" r="2.2" fill="#7c3aed"/>
          <circle cx="15" cy="11" r="1.8" fill="#8b5cf6"/>
          <circle cx="18" cy="13" r="2"   fill="#0d9488"/>
          <circle cx="20" cy="8"  r="2.4" fill="#14b8a6"/>
        </svg>
        <span style={textStyle}>Sıfır Gecikme</span>
      </a>
    ),
  },
];

const navStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '9px',
  textDecoration: 'none', padding: '10px 18px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
};

const textStyle = {
  fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function LogoSecimPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--v3-text)', marginBottom: '8px' }}>
        Logo Seçimi
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--v3-text-muted)', marginBottom: '40px' }}>
        Hangisini beğendiğini söyle, navbar'a ekleyelim.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {logos.map(logo => (
          <div key={logo.id} style={{
            background: 'var(--v3-surface)', border: '1px solid var(--v3-border)',
            borderRadius: '16px', padding: '28px 32px',
            display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap',
          }}>
            <div style={{ flexShrink: 0 }}>
              {logo.render()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--v3-text)', marginBottom: '4px' }}>
                #{logo.id} — {logo.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--v3-text-muted)' }}>
                {logo.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--v3-text-faint)', textAlign: 'center' }}>
        Numarasını söyle, hemen navbar'a ekleyelim.
      </p>
    </div>
  );
}
