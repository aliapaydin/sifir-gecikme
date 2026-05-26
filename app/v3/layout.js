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
