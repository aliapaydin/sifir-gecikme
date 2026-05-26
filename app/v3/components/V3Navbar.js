'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '/v3/icerikler',               label: 'İçerikler' },
  { href: '/v3/icerikler?tip=interaktif', label: 'Playground' },
  { href: '/v3/icerikler?tip=arac',       label: 'Araçlar' },
  { href: '/v3/hakkimda',                 label: 'Hakkımda' },
  { href: '/v3/yazilar/yol-haritasi',     label: 'Harita' },
];

export default function V3Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/v3/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/v3');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <style>{`
        .v3-nav {
          background: rgba(8,12,20,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .v3-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .v3-nav-logo {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .v3-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .v3-nav-link {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--v3-text-muted);
          transition: color 0.15s, background 0.15s;
        }
        .v3-nav-link:hover {
          color: var(--v3-text);
          background: rgba(255,255,255,0.06);
        }
        .v3-nav-link.active {
          color: var(--v3-text);
          background: rgba(99,102,241,0.12);
        }
        .v3-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .v3-btn-login {
          padding: 7px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .v3-btn-login:hover {
          background: rgba(99,102,241,0.25);
          border-color: rgba(99,102,241,0.5);
        }
        .v3-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .v3-user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--v3-text);
        }
        .v3-btn-logout {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 13px;
          background: transparent;
          border: 1px solid var(--v3-border-bright);
          color: var(--v3-text-muted);
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .v3-btn-logout:hover {
          color: var(--v3-text);
          border-color: rgba(255,255,255,0.2);
        }
        .v3-hamburger {
          display: none;
          background: transparent;
          border: 1px solid var(--v3-border-bright);
          color: var(--v3-text-muted);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 18px;
          cursor: pointer;
        }
        .v3-mobile-menu {
          display: none;
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: #0d1421;
          border-bottom: 1px solid var(--v3-border);
          padding: 12px 24px;
          flex-direction: column;
          gap: 4px;
          z-index: 99;
        }
        .v3-mobile-menu.open {
          display: flex;
        }
        .v3-mobile-link {
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: var(--v3-text-muted);
          transition: color 0.15s, background 0.15s;
        }
        .v3-mobile-link:hover, .v3-mobile-link.active {
          color: var(--v3-text);
          background: rgba(255,255,255,0.05);
        }
        @media (max-width: 768px) {
          .v3-nav-links { display: none; }
          .v3-hamburger { display: flex; align-items: center; }
          .v3-user-name { display: none; }
        }
      `}</style>
      <nav className="v3-nav">
        <div className="v3-nav-inner">
          <Link href="/v3" className="v3-nav-logo">
            ◈ Sıfır Gecikme v3
          </Link>

          <div className="v3-nav-links">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`v3-nav-link${pathname === link.href || pathname.startsWith(link.href + '/') ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="v3-nav-right">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/v3/admin"
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: 'rgba(249,115,22,0.1)',
                      border: '1px solid rgba(249,115,22,0.25)',
                      color: '#fb923c',
                    }}
                  >
                    ⚙ Admin
                  </Link>
                )}
                <div
                  className="v3-avatar"
                  style={{ background: user.avatarColor || '#6366f1' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="v3-user-name">{user.name}</span>
                <button className="v3-btn-logout" onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? '...' : 'Çıkış'}
                </button>
              </>
            ) : (
              <Link href="/v3/giris" className="v3-btn-login">
                Giriş Yap
              </Link>
            )}
            <button
              className="v3-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menü"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div className={`v3-mobile-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`v3-mobile-link${pathname === link.href || pathname.startsWith(link.href + '/') ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/v3/giris"
              className="v3-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Giriş Yap
            </Link>
          )}
          {!user && (
            <Link
              href="/v3/kayit"
              className="v3-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Kayıt Ol
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
