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
      `}</style>
      <footer className="v3-footer">
        <div className="v3-footer-inner">
          <div>
            <div className="v3-footer-brand">Sıfır Gecikme v3</div>
            <div className="v3-footer-copy">© 2026 Ali Apaydın. Tüm hakları saklıdır.</div>
          </div>
          <div className="v3-footer-links">
            <Link href="/v3" className="v3-footer-link">Anasayfa</Link>
            <Link href="/v3/icerikler" className="v3-footer-link">İçerikler</Link>
            {user === null && (
              <>
                <Link href="/v3/giris" className="v3-footer-link">Giriş Yap</Link>
                <Link href="/v3/kayit" className="v3-footer-link">Kayıt Ol</Link>
              </>
            )}
            <Link href="/" className="v3-footer-link">Sıfır Gecikme v2</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
