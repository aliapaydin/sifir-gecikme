import V3Navbar from './components/V3Navbar';
import V3Footer from './components/V3Footer';
import V3ThemeWrapper from './components/V3ThemeWrapper';
import GirisBanner from '../../components/GirisBanner';

export const metadata = {
  title: { default: 'Sıfır Gecikme v3', template: '%s — Sıfır Gecikme v3' },
  description: 'Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler.',
};

export default function V3Layout({ children }) {
  return (
    <>
      <style>{`
        /* ── Koyu tema (varsayılan) ── */
        .v3-root {
          min-height: 100vh;
          background: var(--v3-bg);
          color: var(--v3-text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --v3-bg:           #080c14;
          --v3-surface:      #0d1421;
          --v3-surface2:     #111827;
          --v3-border:       rgba(255,255,255,0.06);
          --v3-border-bright:rgba(255,255,255,0.12);
          --v3-text:         #f1f5f9;
          --v3-text-muted:   #64748b;
          --v3-text-faint:   #334155;
          --v3-accent:       #6366f1;
          --v3-accent2:      #8b5cf6;
          --v3-teal:         #14b8a6;
          --v3-coral:        #f97316;
          --v3-green:        #10b981;
          --v3-gradient:     linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);

          /* Eski site değişkenleri — koyu */
          --color-cream:       #0d1421;
          --color-bg:          #0d1421;
          --color-cream-rgb:   13,20,33;
          --color-cream-card:  #111827;
          --color-cream-card2: #1a2332;
          --color-border:      rgba(255,255,255,0.08);
          --color-border-light:rgba(255,255,255,0.05);
          --color-text:        #e2e8f0;
          --color-text-soft:   #94a3b8;
          --color-text-mute:   #64748b;
          --color-text-faint:  rgba(100,116,139,0.5);
          --color-heading:     #f1f5f9;
          --color-accent-soft: rgba(29,158,117,0.15);
          --color-amber-bg:    rgba(251,191,36,0.1);
          --color-amber-text:  #fbbf24;
          --color-purple-bg:   rgba(139,92,246,0.1);
          --color-purple-text: #a78bfa;
          --color-highlight:   rgba(251,191,36,0.08);
          --color-correct-bg:  rgba(16,185,129,0.1);
          --color-correct-border: rgba(16,185,129,0.25);
          --color-correct-text:   #34d399;
          --color-correct-icon:   #34d399;
          --color-wrong-bg:    rgba(239,68,68,0.1);
          --color-wrong-border:rgba(239,68,68,0.25);
          --color-wrong-text:  #f87171;
          --color-wrong-icon:  #f87171;
          --shadow-card:       0 2px 16px rgba(0,0,0,0.4);
        }

        /* ── Açık tema ── */
        .v3-root.v3-light {
          --v3-bg:           #f0f4f8;
          --v3-surface:      #ffffff;
          --v3-surface2:     #f8fafc;
          --v3-border:       #e2e8f0;
          --v3-border-bright:#cbd5e1;
          --v3-text:         #0f172a;
          --v3-text-muted:   #475569;
          --v3-text-faint:   #94a3b8;
          --v3-accent:       #4f46e5;
          --v3-accent2:      #7c3aed;
          --v3-teal:         #0d9488;
          --v3-coral:        #ea580c;
          --v3-green:        #059669;
          --v3-gradient:     linear-gradient(135deg, #4f46e5, #7c3aed, #0d9488);

          /* Eski site değişkenleri — açık */
          --color-cream:       #f8fafc;
          --color-bg:          #f0f4f8;
          --color-cream-rgb:   240,244,248;
          --color-cream-card:  #ffffff;
          --color-cream-card2: #f1f5f9;
          --color-border:      #e2e8f0;
          --color-border-light:#f1f5f9;
          --color-text:        #1e293b;
          --color-text-soft:   #475569;
          --color-text-mute:   #64748b;
          --color-text-faint:  #94a3b8;
          --color-heading:     #0f172a;
          --color-accent:      #4f46e5;
          --color-accent-soft: rgba(79,70,229,0.08);
          --color-accent-text: #4f46e5;
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
          --shadow-card:       0 2px 12px rgba(0,0,0,0.08);
        }

        .v3-root * { box-sizing: border-box; }
        .v3-root a { color: inherit; text-decoration: none; }

        /* Tailwind utility sınıflarını koyu temaya override et */
        .v3-root:not(.v3-light) .bg-white      { background-color: #111827 !important; }
        .v3-root:not(.v3-light) .bg-gray-50    { background-color: #1a2332 !important; }
        .v3-root:not(.v3-light) .bg-gray-100   { background-color: #1e293b !important; }
        .v3-root:not(.v3-light) .bg-green-50   { background-color: rgba(16,185,129,0.1) !important; }
        .v3-root:not(.v3-light) .bg-red-50     { background-color: rgba(239,68,68,0.1) !important; }
        .v3-root:not(.v3-light) .border-gray-200 { border-color: rgba(255,255,255,0.08) !important; }
        .v3-root:not(.v3-light) .border-gray-300 { border-color: rgba(255,255,255,0.12) !important; }
        .v3-root:not(.v3-light) .text-gray-500 { color: #64748b !important; }
        .v3-root:not(.v3-light) .text-gray-600 { color: #94a3b8 !important; }
        .v3-root:not(.v3-light) .text-gray-700 { color: #cbd5e1 !important; }
        .v3-root:not(.v3-light) .text-gray-900 { color: #f1f5f9 !important; }
        .v3-root:not(.v3-light) .text-green-800 { color: #34d399 !important; }
        .v3-root:not(.v3-light) .text-red-800  { color: #f87171 !important; }
        .v3-root:not(.v3-light) .hover\:bg-gray-50:hover { background-color: rgba(255,255,255,0.06) !important; }
        .v3-root:not(.v3-light) .hover\:bg-gray-100:hover { background-color: rgba(255,255,255,0.08) !important; }
      `}</style>
      <V3ThemeWrapper>
        <GirisBanner />
        <V3Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px - 80px)' }}>
          {children}
        </main>
        <V3Footer />
      </V3ThemeWrapper>
    </>
  );
}
