import V3Navbar from './components/V3Navbar';
import V3Footer from './components/V3Footer';
import V3ThemeWrapper from './components/V3ThemeWrapper';
import GirisBanner from '../../components/GirisBanner';

export const metadata = {
  title: { default: 'Sıfır Gecikme', template: '%s — Sıfır Gecikme' },
  description: 'Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler.',
};

export default function V3Layout({ children }) {
  return (
    <>
      <style>{`
        /* ── Koyu tema (varsayılan) · Grafit + Zümrüt ── */
        .v3-root {
          min-height: 100vh;
          background: var(--v3-bg);
          color: var(--v3-text);
          font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: -0.005em;
          -webkit-font-smoothing: antialiased;
          color-scheme: dark;

          --v3-bg:           #0c0d0f;
          --v3-bg-rgb:       12,13,15;
          --v3-surface:      #141518;
          --v3-surface-rgb:  20,21,24;
          --v3-surface2:     #1b1c20;
          --v3-border:       rgba(255,255,255,0.08);
          --v3-border-bright:rgba(255,255,255,0.15);
          --v3-text:         #ededee;
          --v3-text-muted:   #a1a1aa;
          --v3-text-faint:   #73737d;

          /* Vurgu rengi — renk seçiciden gelen --acc-* değişkenleri yoksa zümrüt */
          --v3-accent:       var(--acc-d, #2fd3a7);
          --v3-accent-rgb:   var(--acc-d-rgb, 47,211,167);
          --v3-accent-text:  var(--acc-d-text, #5ee3be);
          --v3-on-accent:    var(--acc-d-on, #04140f);
          --v3-accent2:      #b8a4ff;
          --v3-teal:         #2dd4bf;
          --v3-coral:        #fb923c;
          --v3-green:        #34d399;

          --v3-radius:       16px;
          --v3-radius-md:    12px;
          --v3-radius-sm:    10px;
          --v3-shadow-card:  inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 28px rgba(0,0,0,0.45);
          --v3-shadow-hover: inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 36px rgba(0,0,0,0.5);
          --v3-nav-bg:       rgba(12,13,15,0.82);

          /* Eski site değişkenleri — koyu */
          --color-cream:       #141518;
          --color-bg:          #141518;
          --color-cream-rgb:   20,21,24;
          --color-cream-card:  #1b1c20;
          --color-cream-card2: #222328;
          --color-border:      rgba(255,255,255,0.09);
          --color-border-light:rgba(255,255,255,0.05);
          --color-text:        #e4e4e7;
          --color-text-soft:   #a1a1aa;
          --color-text-mute:   #8b8b94;
          --color-text-faint:  #73737d;
          --color-heading:     #f4f4f5;
          --color-accent:      var(--v3-accent);
          --color-accent-soft: rgba(var(--v3-accent-rgb),0.14);
          --color-accent-text: var(--v3-accent-text);
          --color-amber-bg:    rgba(251,191,36,0.1);
          --color-amber-text:  #fbbf24;
          --color-purple-bg:   rgba(184,164,255,0.1);
          --color-purple-text: #b8a4ff;
          --color-highlight:   rgba(251,191,36,0.08);
          --color-correct-bg:  rgba(52,211,153,0.1);
          --color-correct-border: rgba(52,211,153,0.28);
          --color-correct-text:   #4ade80;
          --color-correct-icon:   #4ade80;
          --color-wrong-bg:    rgba(248,113,113,0.1);
          --color-wrong-border:rgba(248,113,113,0.28);
          --color-wrong-text:  #f87171;
          --color-wrong-icon:  #f87171;
          --shadow-card:       var(--v3-shadow-card);
        }

        /* ── Açık tema ── */
        .v3-root.v3-light {
          color-scheme: light;
          --v3-bg:           #fafafa;
          --v3-bg-rgb:       250,250,250;
          --v3-surface:      #ffffff;
          --v3-surface-rgb:  255,255,255;
          --v3-surface2:     #f4f4f5;
          --v3-border:       #e4e4e7;
          --v3-border-bright:#d4d4d8;
          --v3-text:         #18181b;
          --v3-text-muted:   #52525b;
          --v3-text-faint:   #7e7e88;

          --v3-accent:       var(--acc-l, #047857);
          --v3-accent-rgb:   var(--acc-l-rgb, 4,120,87);
          --v3-accent-text:  var(--acc-l-text, #047857);
          --v3-on-accent:    var(--acc-l-on, #ffffff);
          --v3-accent2:      #6d28d9;
          --v3-teal:         #0d9488;
          --v3-coral:        #ea580c;
          --v3-green:        #059669;

          --v3-shadow-card:  0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05);
          --v3-shadow-hover: 0 1px 2px rgba(0,0,0,0.05), 0 12px 28px rgba(0,0,0,0.08);
          --v3-nav-bg:       rgba(255,255,255,0.85);

          /* Eski site değişkenleri — açık */
          --color-cream:       #ffffff;
          --color-bg:          #fafafa;
          --color-cream-rgb:   250,250,250;
          --color-cream-card:  #ffffff;
          --color-cream-card2: #f4f4f5;
          --color-border:      #e4e4e7;
          --color-border-light:#f4f4f5;
          --color-text:        #27272a;
          --color-text-soft:   #52525b;
          --color-text-mute:   #63636d;
          --color-text-faint:  #7e7e88;
          --color-heading:     #18181b;
          --color-amber-bg:    #fef3c7;
          --color-amber-text:  #92400e;
          --color-purple-bg:   #ede9fe;
          --color-purple-text: #5b21b6;
          --color-highlight:   #fef9c3;
          --color-correct-bg:  #f0fdf4;
          --color-correct-border: #86efac;
          --color-correct-text:   #15803d;
          --color-correct-icon:   #22c55e;
          --color-wrong-bg:    #fff1f2;
          --color-wrong-border:#fca5a5;
          --color-wrong-text:  #dc2626;
          --color-wrong-icon:  #ef4444;
        }

        /* Türetilen değişkenler: her iki temada da son değerlerden hesaplanır */
        .v3-root, .v3-root.v3-light {
          --v3-accent-soft:  rgba(var(--v3-accent-rgb),0.12);
          --v3-accent-line:  rgba(var(--v3-accent-rgb),0.28);
          --v3-gradient:     linear-gradient(90deg, var(--v3-accent), var(--v3-accent-text));
        }

        .v3-root ::selection { background: rgba(var(--v3-accent-rgb),0.28); }
        .v3-root :focus-visible { outline: 2px solid var(--v3-accent); outline-offset: 2px; border-radius: 4px; }
        .v3-root h1, .v3-root h2, .v3-root h3 { letter-spacing: -0.02em; text-wrap: balance; }

        /* ── Modern katman: tek köşe ölçeği, yumuşak gölge, sakin hover ── */
        .v3-root :is(.v3-card, .pg-card, .tool-card, .v3-cat-card, .v3-analiz-card, .yzo-promo-card, .feat-card, .og-card, .tc-card) {
          border-radius: var(--v3-radius);
          box-shadow: var(--v3-shadow-card);
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        }
        .v3-root :is(.v3-card, .pg-card, .tool-card, .v3-cat-card, .v3-analiz-card, .yzo-promo-card, .feat-card, .og-card, .tc-card):hover {
          transform: none;
          border-color: var(--v3-accent-line);
          box-shadow: var(--v3-shadow-hover);
        }
        .v3-root :is(.v3-btn-primary, .v3-btn-secondary, .v3-btn-kayit, .v3-btn-login, .yzo-promo-cta) {
          border-radius: var(--v3-radius-sm);
        }
        .v3-root .v3-btn-primary:hover { transform: none; opacity: 1; filter: brightness(1.08); }
        .v3-root .v3-btn-secondary { background: var(--v3-surface); }
        .v3-root .v3-btn-secondary:hover { background: var(--v3-surface2); border-color: var(--v3-accent-line); }
        .v3-root .v3-btn-kayit { background: var(--v3-accent); color: var(--v3-on-accent); box-shadow: none; }
        .v3-root .v3-stats-bar { background: var(--v3-surface); }
        @media (prefers-reduced-motion: reduce) {
          .v3-root *, .v3-root *::before, .v3-root *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }

        .v3-root * { box-sizing: border-box; }
        .v3-root a { color: inherit; text-decoration: none; }

        /* Tailwind utility sınıflarını koyu temaya override et */
        .v3-root:not(.v3-light) .bg-white      { background-color: #1b1c20 !important; }
        .v3-root:not(.v3-light) .bg-gray-50    { background-color: #222328 !important; }
        .v3-root:not(.v3-light) .bg-gray-100   { background-color: #27272a !important; }
        .v3-root:not(.v3-light) .bg-green-50   { background-color: rgba(16,185,129,0.1) !important; }
        .v3-root:not(.v3-light) .bg-red-50     { background-color: rgba(239,68,68,0.1) !important; }
        .v3-root:not(.v3-light) .border-gray-200 { border-color: rgba(255,255,255,0.09) !important; }
        .v3-root:not(.v3-light) .border-gray-300 { border-color: rgba(255,255,255,0.15) !important; }
        .v3-root:not(.v3-light) .text-gray-500 { color: #a1a1aa !important; }
        .v3-root:not(.v3-light) .text-gray-600 { color: #b4b4bb !important; }
        .v3-root:not(.v3-light) .text-gray-700 { color: #d4d4d8 !important; }
        .v3-root:not(.v3-light) .text-gray-900 { color: #f4f4f5 !important; }
        .v3-root:not(.v3-light) .text-green-800 { color: #34d399 !important; }
        .v3-root:not(.v3-light) .text-red-800  { color: #f87171 !important; }
        .v3-root:not(.v3-light) .hover\:bg-gray-50:hover { background-color: rgba(255,255,255,0.06) !important; }
        .v3-root:not(.v3-light) .hover\:bg-gray-100:hover { background-color: rgba(255,255,255,0.09) !important; }
      `}</style>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800;900&display=swap" precedence="default" />
      <V3ThemeWrapper>
        <GirisBanner />
        <V3Navbar />
        <main style={{ minHeight: 'calc(100vh - 68px - 80px)' }}>
          {children}
        </main>
        <V3Footer />
      </V3ThemeWrapper>
    </>
  );
}
