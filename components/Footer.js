'use client'
import { CURRENT_VERSION } from '../lib/versiyon';

export default function Footer() {
  const icerikler = [
    { href: '/yazilar/linear-regression', label: 'Linear Regression' },
    { href: '/yazilar/gradient-descent', label: 'Gradient Descent' },
    { href: '/yazilar/kmeans', label: 'K-Means Kümeleme' },
    { href: '/yazilar/confusion-matrix', label: 'Confusion Matrix' },
    { href: '/yazilar/bias-variance', label: 'Bias-Variance' },
    { href: '/yazilar/sinir-agi', label: 'Sinir Ağı Visualizer' },
  ];

  const araclar = [
    { href: '/yazilar/ab-test', label: 'A/B Test Hesaplayıcı' },
    { href: '/yazilar/sample-size', label: 'Sample Size Aracı' },
    { href: '/yazilar/izmir-kira-analizi', label: 'İzmir Kira Analizi' },
    { href: '/yazilar/sql-temelleri', label: 'SQL Temelleri' },
    { href: '/yazilar/pandas-7-sey', label: "Pandas'ta 7 Hata" },
    { href: '/yazilar/ilk-90-gun', label: 'Veri Analisti İlk 90 Gün' },
  ];

  const sosyal = [
    { href: 'https://x.com/sifirgecikme', label: 'X', icon: '𝕏' },
    { href: 'https://github.com/aliapaydin', label: 'GitHub', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    )},
    { href: 'https://linkedin.com/in/aliapaydin35', label: 'LinkedIn', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )},
    { href: 'https://instagram.com/sifirgecikme', label: 'Instagram', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )},
  ];

  return (
    <footer style={{ borderTop: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }}></div>
              <span className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-soft)', maxWidth: '260px' }}>
              Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler.
              Her kavramı önce dener, sonra konuşuruz.
            </p>
            <div className="flex gap-2">
              {sosyal.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    border: '0.5px solid var(--color-border)',
                    background: 'var(--color-cream-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-soft)', fontSize: '14px',
                    transition: 'border-color 0.15s, color 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>Demolar</div>
            <div className="flex flex-col gap-2.5">
              {icerikler.map(({ href, label }) => (
                <a key={href} href={href} className="text-sm" style={{ color: 'var(--color-text-soft)', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-soft)'}
                >{label}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>Araçlar & Rehberler</div>
            <div className="flex flex-col gap-2.5">
              {araclar.map(({ href, label }) => (
                <a key={href} href={href} className="text-sm" style={{ color: 'var(--color-text-soft)', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-soft)'}
                >{label}</a>
              ))}
            </div>
          </div>

        </div>

        <div style={{ paddingTop: '20px', borderTop: '0.5px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="text-xs" style={{ color: 'var(--color-text-mute)' }}>
              © {new Date().getFullYear()} Ali Apaydın · Sıfır Gecikme · İzmir
            </span>
            <a href="/versiyon" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-mute)', textDecoration: 'none', padding: '2px 7px', borderRadius: '5px', border: '1px solid var(--color-border)', background: 'var(--color-cream-card)', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-mute)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >{CURRENT_VERSION}</a>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-interactive">14 içerik</span>
            <span className="badge badge-interactive">8 demo</span>
            <span className="badge badge-case">Türkçe & ücretsiz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
