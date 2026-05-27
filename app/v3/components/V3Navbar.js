'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const playgroundItems = [
  { emoji: '🐍', label: 'Python Playground', href: '/v3/python' },
  { emoji: '🗄️', label: 'SQL Playground',    href: '/v3/sql' },
  { emoji: '🔍', label: 'Regex Tester',       href: '/v3/regex' },
  { emoji: '✏️', label: 'Rakam Çiz',          href: '/v3/ciz' },
  { emoji: '🧠', label: 'Sinir Ağı',          href: '/v3/nn' },
];

const modulItems = [
  { emoji: '🥗', label: 'Kalori Takip',      href: '/v3/kalori' },
  { emoji: '🗂️', label: 'Veri Setleri',      href: '/v3/veri-setleri' },
  { emoji: '🎤', label: 'Mülakat',           href: '/v3/mulakat' },
  { emoji: '💰', label: 'Kim Milyoner?',     href: '/v3/milyon' },
  { emoji: '🧪', label: 'Proje Lab',         href: '/v3/proje' },
  { emoji: '📊', label: 'Bilgi Grafiği',     href: '/v3/grafik' },
  { emoji: '🍺', label: 'Promilmetre',       href: '/v3/promilmetre' },
  { emoji: '🖥️', label: 'Tech Center',       href: '/v3/tech-center' },
];

const navLinks = [
  { href: '/v3/icerikler', label: 'İçerikler' },
];

export default function V3Navbar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const [user, setUser]               = useState(null);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [pgOpen, setPgOpen]             = useState(false);
  const [pgMobileOpen, setPgMobileOpen] = useState(false);
  const [modOpen, setModOpen]           = useState(false);
  const [modMobileOpen, setModMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut]   = useState(false);
  const [isLight, setIsLight]         = useState(false);
  const pgRef  = useRef(null);
  const modRef = useRef(null);

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('v3_theme');
    setIsLight(saved === 'light');
  }, []);

  // Dışarı tıklayınca dropdown kapat
  useEffect(() => {
    function onOutside(e) {
      if (pgRef.current && !pgRef.current.contains(e.target)) setPgOpen(false);
      if (modRef.current && !modRef.current.contains(e.target)) setModOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // Menü kapanınca accordion sıfırla + body scroll kilidi
  useEffect(() => {
    if (!menuOpen) {
      setPgMobileOpen(false);
      setModMobileOpen(false);
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function toggleTheme() {
    const root = document.getElementById('v3-root');
    const next = !isLight;
    if (root) {
      root.classList.toggle('v3-light', next);
    }
    localStorage.setItem('v3_theme', next ? 'light' : 'dark');
    setIsLight(next);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/v3/auth/logout', { method: 'POST' });
      window.location.href = '/v3';
    } finally {
      setLoggingOut(false);
    }
  }

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');

  if (pathname === '/v3/tech-center') return null;

  return (
    <>
      <style>{`
        .v3-nav {
          background: rgba(8,12,20,0.88);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 100; height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.3s, border-color 0.3s;
        }
        .v3-light .v3-nav {
          background: rgba(248,250,252,0.92);
          border-bottom-color: #e2e8f0;
        }
        .v3-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 100%;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
        }
        .v3-nav-logo {
          font-size: 17px; font-weight: 700; letter-spacing: -0.3px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          display: flex; align-items: center; gap: 7px; flex-shrink: 0; text-decoration: none;
        }
        .v3-nav-links { display: flex; align-items: center; gap: 2px; }
        .v3-nav-link {
          padding: 6px 13px; border-radius: 8px; font-size: 14px; font-weight: 500;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          text-decoration: none; cursor: pointer; background: none; border: none; font-family: inherit;
        }
        .v3-nav-link:hover { color: var(--v3-text); background: rgba(255,255,255,0.06); }
        .v3-nav-link.active { color: var(--v3-text); background: rgba(99,102,241,0.12); }
        .v3-light .v3-nav-link:hover { background: rgba(0,0,0,0.05); }
        .v3-light .v3-nav-link.active { background: rgba(99,102,241,0.1); }

        /* Playground dropdown */
        .v3-pg-wrap { position: relative; }
        .v3-pg-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 13px; border-radius: 8px; font-size: 14px; font-weight: 500;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          cursor: pointer; background: none; border: none; font-family: inherit;
        }
        .v3-pg-btn:hover, .v3-pg-btn.open { color: var(--v3-text); background: rgba(255,255,255,0.06); }
        .v3-light .v3-pg-btn:hover, .v3-light .v3-pg-btn.open { background: rgba(0,0,0,0.05); }
        .v3-pg-arrow { font-size: 10px; transition: transform 0.2s; opacity: 0.6; }
        .v3-pg-btn.open .v3-pg-arrow { transform: rotate(180deg); }
        .v3-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0;
          background: #0d1421; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 8px; min-width: 220px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          animation: v3-fade-in 0.15s ease;
          z-index: 200;
        }
        .v3-light .v3-dropdown {
          background: #ffffff; border-color: #e2e8f0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        @keyframes v3-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .v3-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 9px; font-size: 14px;
          color: var(--v3-text-muted); text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .v3-dd-item:hover { background: rgba(255,255,255,0.07); color: var(--v3-text); }
        .v3-light .v3-dd-item:hover { background: #f1f5f9; color: #0f172a; }
        .v3-dd-emoji { font-size: 16px; width: 24px; text-align: center; flex-shrink: 0; }

        /* Sağ taraf */
        .v3-nav-right { display: flex; align-items: center; gap: 8px; }
        .v3-dev-link {
          font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8; text-decoration: none; white-space: nowrap;
          transition: background 0.15s;
        }
        .v3-dev-link:hover { background: rgba(99,102,241,0.2); }
        .v3-theme-btn {
          width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-size: 15px; cursor: pointer;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.15s; flex-shrink: 0;
        }
        .v3-theme-btn:hover { background: rgba(255,255,255,0.1); }
        .v3-light .v3-theme-btn { background: rgba(0,0,0,0.05); border-color: #e2e8f0; }
        .v3-btn-login {
          padding: 7px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8; cursor: pointer; transition: background 0.15s; text-decoration: none;
        }
        .v3-btn-login:hover { background: rgba(99,102,241,0.25); }
        .v3-btn-destek {
          padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #f96854, #f43f5e);
          color: #fff; text-decoration: none; white-space: nowrap;
          transition: opacity 0.15s; display: flex; align-items: center; gap: 5px;
        }
        .v3-btn-destek:hover { opacity: 0.85; }
        .v3-btn-destek-text { display: inline; }
        @media (max-width: 768px) {
          .v3-btn-destek { padding: 7px 9px; }
          .v3-btn-destek-text { display: none; }
        }
        .v3-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; cursor: default;
          transition: box-shadow 0.2s;
        }
        .v3-avatar.supporter {
          box-shadow: 0 0 0 2px #fbbf24, 0 0 0 4px rgba(251,191,36,0.25), 0 0 12px rgba(251,191,36,0.2);
        }
        .v3-user-name { font-size: 14px; font-weight: 500; color: var(--v3-text); }
        .v3-btn-logout {
          padding: 5px 12px; border-radius: 6px; font-size: 13px;
          background: transparent; border: 1px solid var(--v3-border-bright);
          color: var(--v3-text-muted); cursor: pointer; transition: color 0.15s;
        }
        .v3-btn-logout:hover { color: var(--v3-text); }
        .v3-admin-link {
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25);
          color: #fb923c; text-decoration: none;
        }
        .v3-hamburger {
          display: none; background: transparent;
          border: 1px solid var(--v3-border-bright); color: var(--v3-text-muted);
          border-radius: 6px; padding: 6px 10px; font-size: 18px; cursor: pointer;
        }
        .v3-mobile-menu {
          display: none; position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          background: #0d1421;
          padding: 12px 20px 32px;
          z-index: 101; overflow-y: scroll; -webkit-overflow-scrolling: touch;
        }
        .v3-light .v3-mobile-menu { background: #ffffff; }
        .v3-mobile-menu.open { display: block; }
        .v3-mobile-link {
          padding: 10px 12px; border-radius: 8px; font-size: 15px; font-weight: 500;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          text-decoration: none; display: block;
        }
        .v3-mobile-link:hover, .v3-mobile-link.active {
          color: var(--v3-text); background: rgba(255,255,255,0.05);
        }
        .v3-light .v3-mobile-link:hover, .v3-light .v3-mobile-link.active {
          background: #f1f5f9; color: #0f172a;
        }
        .v3-mobile-section-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: 8px; font-size: 15px; font-weight: 600;
          color: var(--v3-text-muted); background: none; border: none;
          cursor: pointer; font-family: inherit; transition: color 0.15s, background 0.15s;
        }
        .v3-mobile-section-btn:hover { color: var(--v3-text); background: rgba(255,255,255,0.05); }
        .v3-light .v3-mobile-section-btn:hover { background: #f1f5f9; color: #0f172a; }
        .v3-mobile-section-btn.open { color: var(--v3-text); }
        .v3-mobile-section-arrow { font-size: 10px; opacity: 0.5; transition: transform 0.2s; }
        .v3-mobile-section-btn.open .v3-mobile-section-arrow { transform: rotate(180deg); }
        .v3-mobile-section-items {
          padding-left: 8px;
          overflow: hidden;
        }
        .v3-mobile-sub-link {
          padding: 8px 12px; border-radius: 8px; font-size: 14px; font-weight: 400;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          text-decoration: none; display: flex; align-items: center; gap: 8px;
        }
        .v3-mobile-sub-link:hover { color: var(--v3-text); background: rgba(255,255,255,0.05); }
        .v3-light .v3-mobile-sub-link:hover { background: #f1f5f9; color: #0f172a; }
        .v3-mobile-divider {
          height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0;
        }
        .v3-light .v3-mobile-divider { background: #e2e8f0; }
        @media (max-width: 768px) {
          .v3-nav-links { display: none; }
          .v3-hamburger { display: flex; align-items: center; }
          .v3-user-name { display: none; }
          .v3-dev-link { display: none; }
        }
      `}</style>

      <nav className="v3-nav">
        <div className="v3-nav-inner">
          <Link href="/v3" className="v3-nav-logo">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <defs>
                <linearGradient id="logo-neural" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <rect width="28" height="28" rx="7" fill="url(#logo-neural)" opacity="0.15"/>
              <line x1="7" y1="21" x2="14" y2="8" stroke="url(#logo-neural)" strokeWidth="1.5" opacity="0.6"/>
              <line x1="7" y1="21" x2="21" y2="18" stroke="url(#logo-neural)" strokeWidth="1.5" opacity="0.6"/>
              <line x1="14" y1="8" x2="21" y2="18" stroke="url(#logo-neural)" strokeWidth="1.5" opacity="0.6"/>
              <line x1="14" y1="8" x2="14" y2="18" stroke="url(#logo-neural)" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="7" cy="21" r="3" fill="url(#logo-neural)"/>
              <circle cx="14" cy="8" r="3.5" fill="url(#logo-neural)"/>
              <circle cx="21" cy="18" r="3" fill="url(#logo-neural)"/>
              <circle cx="14" cy="18" r="2" fill="url(#logo-neural)" opacity="0.7"/>
            </svg>
            Sıfır Gecikme
          </Link>

          <div className="v3-nav-links">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`v3-nav-link${isActive(link.href) ? ' active' : ''}`}>
                {link.label}
              </Link>
            ))}

            {/* Playground dropdown */}
            <div className="v3-pg-wrap" ref={pgRef}>
              <button
                className={`v3-pg-btn${pgOpen ? ' open' : ''}`}
                onClick={() => setPgOpen(o => !o)}
              >
                Playground <span className="v3-pg-arrow">▼</span>
              </button>
              {pgOpen && (
                <div className="v3-dropdown">
                  {playgroundItems.map(item => (
                    <Link key={item.href} href={item.href} className="v3-dd-item"
                      onClick={() => setPgOpen(false)}>
                      <span className="v3-dd-emoji">{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Modüller dropdown */}
            <div className="v3-pg-wrap" ref={modRef}>
              <button
                className={`v3-pg-btn${modOpen ? ' open' : ''}`}
                onClick={() => setModOpen(o => !o)}
              >
                Modüller <span className="v3-pg-arrow">▼</span>
              </button>
              {modOpen && (
                <div className="v3-dropdown">
                  {modulItems.map(item => (
                    <Link key={item.href} href={item.href} className="v3-dd-item"
                      onClick={() => setModOpen(false)}>
                      <span className="v3-dd-emoji">{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/v3/harita"
              className={`v3-nav-link${isActive('/v3/harita') ? ' active' : ''}`}>
              Haritam
            </Link>
          </div>

          <div className="v3-nav-right">
            {/* Tema toggle */}
            <button className="v3-theme-btn" onClick={toggleTheme} title={isLight ? 'Koyu tema' : 'Açık tema'}>
              {isLight ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <Link href="/v3/panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <div className={`v3-avatar${user.isSupporter ? ' supporter' : ''}`} style={{ background: user.avatarColor || '#6366f1' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="v3-user-name">{user.name}</span>
                </Link>
                <button className="v3-btn-logout" onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? '...' : 'Çıkış'}
                </button>
              </>
            ) : (
              <Link href="/v3/giris" className="v3-btn-login">Giriş</Link>
            )}
            {!user?.isSupporter && (
              <Link href="/v3/destek" className="v3-btn-destek">
                ☕{!user && <span className="v3-btn-destek-text"> Destek Ol</span>}
              </Link>
            )}

            <button className="v3-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile menu — nav dışında, backdrop-filter containment'ından kaçınmak için */}
      <div className={`v3-mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href}
            className={`v3-mobile-link${isActive(link.href) ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}

        <div className="v3-mobile-divider" />

        {/* Playground accordion */}
        <button
          className={`v3-mobile-section-btn${pgMobileOpen ? ' open' : ''}`}
          onClick={() => setPgMobileOpen(o => !o)}
        >
          <span>🧪 Playground</span>
          <span className="v3-mobile-section-arrow">▼</span>
        </button>
        {pgMobileOpen && (
          <div className="v3-mobile-section-items">
            {playgroundItems.map(item => (
              <Link key={item.href} href={item.href} className="v3-mobile-sub-link"
                onClick={() => { setMenuOpen(false); setPgMobileOpen(false); }}>
                <span style={{ width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="v3-mobile-divider" />

        {/* Modüller accordion */}
        <button
          className={`v3-mobile-section-btn${modMobileOpen ? ' open' : ''}`}
          onClick={() => setModMobileOpen(o => !o)}
        >
          <span>🗂️ Modüller</span>
          <span className="v3-mobile-section-arrow">▼</span>
        </button>
        {modMobileOpen && (
          <div className="v3-mobile-section-items">
            {modulItems.map(item => (
              <Link key={item.href} href={item.href} className="v3-mobile-sub-link"
                onClick={() => { setMenuOpen(false); setModMobileOpen(false); }}>
                <span style={{ width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="v3-mobile-divider" />

        <Link href="/v3/harita"
          className={`v3-mobile-link${isActive('/v3/harita') ? ' active' : ''}`}
          onClick={() => setMenuOpen(false)}>
          🗺️ Haritam
        </Link>

        <div className="v3-mobile-divider" />

        {!user?.isSupporter && (
          <Link href="/v3/destek" className="v3-mobile-link" onClick={() => setMenuOpen(false)}
            style={{ color: '#fb923c', fontWeight: 600 }}>
            ☕ Destek Ol
          </Link>
        )}
        {!user && (
          <>
            <Link href="/v3/giris" className="v3-mobile-link" onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
            <Link href="/v3/kayit" className="v3-mobile-link" onClick={() => setMenuOpen(false)}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </>
  );
}
