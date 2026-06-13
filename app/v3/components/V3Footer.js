'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function V3Footer() {
  const pathname = usePathname();
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  if (pathname === '/v3/tech-center') return null;

  return (
    <>
      <style>{`
        .v3-footer {
          border-top: 1px solid var(--v3-border);
          background: var(--v3-bg);
          padding: 28px 24px;
        }
        .v3-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .v3-footer-brand {
          font-size: 15px;
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .v3-footer-copy {
          font-size: 13px;
          color: var(--v3-text-faint);
        }
        .v3-footer-links {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        .v3-footer-link {
          font-size: 13px;
          color: var(--v3-text-muted);
          transition: color 0.15s;
          text-decoration: none;
        }
        .v3-footer-link:hover {
          color: var(--v3-text);
        }
        .v3-footer-destek {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #f96854, #f43f5e);
          color: #fff; text-decoration: none; transition: opacity 0.15s;
        }
        .v3-footer-destek:hover { opacity: 0.85; }
        .v3-footer-developer {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 600;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.22);
          color: #818cf8; text-decoration: none; transition: background 0.15s, border-color 0.15s;
        }
        .v3-footer-developer:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.38); }
        .v3-footer-version {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 999px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          font-size: 11px;
          font-weight: 700;
          font-family: monospace;
          color: #818cf8;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        .v3-footer-version:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.35);
        }
      `}</style>
      <footer className="v3-footer">
        <div className="v3-footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="v3-footer-brand">Sıfır Gecikme</span>
              <Link href="/v3/versiyon" className="v3-footer-version">v4.0.0</Link>
            </div>
            <div className="v3-footer-copy">© 2026 Ali Apaydın. Tüm hakları saklıdır.</div>
          </div>
          <div className="v3-footer-links">
            <a href="/v3" className="v3-footer-link" onClick={e => { if (window.location.pathname === '/v3') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>Anasayfa</a>
            {user === null && (
              <>
                <Link href="/v3/giris" className="v3-footer-link">Giriş Yap</Link>
                <Link href="/v3/kayit" className="v3-footer-link">Kayıt Ol</Link>
              </>
            )}
            {!user?.isSupporter && (
              <Link href="/v3/destek" className="v3-footer-destek">☕ Destek Ol</Link>
            )}
            <Link href="/v3/hakkimda" className="v3-footer-developer">👨‍💻 Developer</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
