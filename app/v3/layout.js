import V3Navbar from './components/V3Navbar';
import V3Footer from './components/V3Footer';

export const metadata = {
  title: {
    default: 'Sıfır Gecikme v3',
    template: '%s — Sıfır Gecikme v3',
  },
  description: 'Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler.',
};

export default function V3Layout({ children }) {
  return (
    <>
      <style>{`
        :root {
          --v3-bg: #080c14;
          --v3-surface: #0d1421;
          --v3-surface2: #111827;
          --v3-border: rgba(255,255,255,0.06);
          --v3-border-bright: rgba(255,255,255,0.12);
          --v3-text: #f1f5f9;
          --v3-text-muted: #64748b;
          --v3-text-faint: #334155;
          --v3-accent: #6366f1;
          --v3-accent2: #8b5cf6;
          --v3-teal: #14b8a6;
          --v3-coral: #f97316;
          --v3-green: #10b981;
          --v3-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
        }

        .v3-root {
          min-height: 100vh;
          background: var(--v3-bg);
          color: var(--v3-text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

          /* Eski site CSS değişkenlerini v3 koyu tema için geçersiz kıl */
          --color-cream: #0d1421;
          --color-bg: #0d1421;
          --color-cream-rgb: 13,20,33;
          --color-cream-card: #111827;
          --color-cream-card2: #1a2332;
          --color-border: rgba(255,255,255,0.08);
          --color-border-light: rgba(255,255,255,0.05);
          --color-text: #e2e8f0;
          --color-text-soft: #94a3b8;
          --color-text-mute: #64748b;
          --color-text-faint: rgba(100,116,139,0.5);
          --color-heading: #f1f5f9;
          --color-accent-soft: rgba(29,158,117,0.15);
          --color-amber-bg: rgba(251,191,36,0.1);
          --color-amber-text: #fbbf24;
          --color-purple-bg: rgba(139,92,246,0.1);
          --color-purple-text: #a78bfa;
          --color-highlight: rgba(251,191,36,0.08);
          --color-correct-bg: rgba(16,185,129,0.1);
          --color-correct-border: rgba(16,185,129,0.25);
          --color-correct-text: #34d399;
          --color-correct-icon: #34d399;
          --color-wrong-bg: rgba(239,68,68,0.1);
          --color-wrong-border: rgba(239,68,68,0.25);
          --color-wrong-text: #f87171;
          --color-wrong-icon: #f87171;
          --shadow-card: 0 2px 16px rgba(0,0,0,0.4);
        }

        .v3-root * {
          box-sizing: border-box;
        }

        .v3-root a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>
      <div className="v3-root">
        <V3Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px - 80px)' }}>
          {children}
        </main>
        <V3Footer />
      </div>
    </>
  );
}
