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
  { emoji: '📈', label: 'İçerik Analizi',    href: '/v3/analiz' },
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
          background: rgba(6,9,16,0.92);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          position: sticky; top: 0; z-index: 100; height: 68px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.3s, border-color 0.3s;
          box-shadow: 0 1px 0 rgba(99,102,241,0.08);
        }
        .v3-light .v3-nav {
          background: rgba(248,250,252,0.95);
          border-bottom-color: #e2e8f0;
          box-shadow: 0 1px 0 rgba(99,102,241,0.06), 0 4px 12px rgba(0,0,0,0.04);
        }
        .v3-nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 28px; height: 100%;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .v3-nav-logo {
          font-size: 16px; font-weight: 800; letter-spacing: -0.4px;
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #2dd4bf 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          display: flex; align-items: center; gap: 9px; flex-shrink: 0; text-decoration: none;
        }
        .v3-nav-links { display: flex; align-items: center; gap: 1px; }
        .v3-nav-link {
          padding: 6px 12px; border-radius: 8px; font-size: 13.5px; font-weight: 500;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          text-decoration: none; cursor: pointer; background: none; border: none; font-family: inherit;
          position: relative;
        }
        .v3-nav-link:hover { color: var(--v3-text); background: rgba(255,255,255,0.05); }
        .v3-nav-link.active { color: var(--v3-text); background: rgba(99,102,241,0.12); color: #a5b4fc; }
        .v3-light .v3-nav-link:hover { background: rgba(0,0,0,0.05); }
        .v3-light .v3-nav-link.active { background: rgba(99,102,241,0.1); color: #4f46e5; }

        /* Dropdown wrapper */
        .v3-pg-wrap { position: relative; }
        .v3-pg-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px; font-size: 13.5px; font-weight: 500;
          color: var(--v3-text-muted); transition: color 0.15s, background 0.15s;
          cursor: pointer; background: none; border: none; font-family: inherit;
        }
        .v3-pg-btn:hover, .v3-pg-btn.open { color: var(--v3-text); background: rgba(255,255,255,0.05); }
        .v3-light .v3-pg-btn:hover, .v3-light .v3-pg-btn.open { background: rgba(0,0,0,0.05); }
        .v3-pg-arrow { font-size: 9px; transition: transform 0.2s; opacity: 0.5; }
        .v3-pg-btn.open .v3-pg-arrow { transform: rotate(180deg); }
        .v3-dropdown {
          position: absolute; top: calc(100% + 10px); left: 0;
          background: rgba(10,14,24,0.98); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 16px; padding: 6px; min-width: 230px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          animation: v3-fade-in 0.14s ease;
          z-index: 200;
          backdrop-filter: blur(20px);
        }
        .v3-light .v3-dropdown {
          background: rgba(255,255,255,0.98); border-color: #e2e8f0;
          box-shadow: 0 8px 40px rgba(0,0,0,0.14);
        }
        @keyframes v3-fade-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .v3-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px; font-size: 13.5px;
          color: var(--v3-text-muted); text-decoration: none;
          transition: background 0.1s, color 0.1s;
        }
        .v3-dd-item:hover { background: rgba(99,102,241,0.1); color: var(--v3-text); }
        .v3-light .v3-dd-item:hover { background: #f1f5f9; color: #0f172a; }
        .v3-dd-emoji { font-size: 15px; width: 22px; text-align: center; flex-shrink: 0; }

        /* Sağ taraf */
        .v3-nav-right { display: flex; align-items: center; gap: 6px; }
        .v3-dev-link {
          font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8; text-decoration: none; white-space: nowrap;
          transition: background 0.15s;
        }
        .v3-dev-link:hover { background: rgba(99,102,241,0.2); }
        .v3-theme-btn {
          width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center;
          justify-content: center; font-size: 15px; cursor: pointer;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          transition: background 0.15s, border-color 0.15s; flex-shrink: 0;
        }
        .v3-theme-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
        .v3-light .v3-theme-btn { background: rgba(0,0,0,0.04); border-color: #e2e8f0; }
        .v3-btn-login {
          padding: 7px 16px; border-radius: 9px; font-size: 13.5px; font-weight: 600;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc; cursor: pointer; transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .v3-btn-login:hover { background: rgba(99,102,241,0.22); border-color: rgba(99,102,241,0.4); }
        .v3-btn-kayit {
          padding: 7px 16px; border-radius: 9px; font-size: 13.5px; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; text-decoration: none; white-space: nowrap;
          transition: opacity 0.15s; box-shadow: 0 2px 10px rgba(99,102,241,0.3);
        }
        .v3-btn-kayit:hover { opacity: 0.88; }
        .v3-btn-destek {
          padding: 7px 15px; border-radius: 9px; font-size: 13px; font-weight: 700;
          background: linear-gradient(135deg, #f96854, #f43f5e);
          color: #fff; text-decoration: none; white-space: nowrap;
          transition: opacity 0.15s; display: flex; align-items: center; gap: 5px;
          box-shadow: 0 2px 10px rgba(249,104,84,0.3);
        }
        .v3-btn-destek:hover { opacity: 0.85; }
        .v3-btn-destek-text { display: inline; }
        @media (max-width: 860px) {
          .v3-btn-destek { padding: 7px 9px; }
          .v3-btn-destek-text { display: none; }
          .v3-btn-kayit { display: none; }
        }
        .v3-avatar {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; cursor: default;
          transition: box-shadow 0.2s;
        }
        .v3-avatar.supporter {
          box-shadow: 0 0 0 2px #fbbf24, 0 0 0 4px rgba(251,191,36,0.2), 0 0 14px rgba(251,191,36,0.2);
        }
        .v3-user-name { font-size: 13.5px; font-weight: 600; color: var(--v3-text); }
        .v3-btn-logout {
          padding: 5px 11px; border-radius: 7px; font-size: 13px;
          background: transparent; border: 1px solid var(--v3-border-bright);
          color: var(--v3-text-muted); cursor: pointer; transition: color 0.15s, border-color 0.15s;
        }
        .v3-btn-logout:hover { color: var(--v3-text); border-color: rgba(255,255,255,0.2); }
        .v3-admin-link {
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25);
          color: #fb923c; text-decoration: none;
        }
        .v3-hamburger {
          display: none; background: transparent;
          border: 1px solid var(--v3-border-bright); color: var(--v3-text-muted);
          border-radius: 8px; padding: 6px 10px; font-size: 18px; cursor: pointer;
        }
        .v3-mobile-menu {
          display: none; position: fixed; top: 68px; left: 0; right: 0; bottom: 0;
          background: rgba(6,9,16,0.98);
          backdrop-filter: blur(20px);
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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="sg-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="55%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#14b8a6"/>
                </linearGradient>
                <linearGradient id="sg-bar" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#14b8a6"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="9" fill="url(#sg-g)" opacity="0.14"/>
              <rect width="32" height="32" rx="9" stroke="url(#sg-g)" strokeWidth="1.2" fill="none" opacity="0.35"/>
              <rect x="5"  y="21" width="3.2" height="7" rx="1.4" fill="#6366f1" opacity="0.55"/>
              <rect x="9.8" y="15" width="3.2" height="13" rx="1.4" fill="#7c6cf1" opacity="0.75"/>
              <rect x="14.6" y="8" width="3.2" height="20" rx="1.4" fill="url(#sg-bar)"/>
              <rect x="19.4" y="12" width="3.2" height="16" rx="1.4" fill="#14b8a6" opacity="0.8"/>
              <rect x="24.2" y="18" width="2.8" height="10" rx="1.4" fill="#14b8a6" opacity="0.55"/>
              <polyline points="6.6,21 11.4,14 16.2,7.5 21,11.5 25.6,17.5"
                stroke="url(#sg-g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
              <circle cx="16.2" cy="7.5" r="2.4" fill="white" opacity="0.95"/>
              <circle cx="16.2" cy="7.5" r="1.2" fill="url(#sg-g)"/>
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
              <>
                <Link href="/v3/giris" className="v3-btn-login">Giriş</Link>
                <Link href="/v3/kayit" className="v3-btn-kayit">Kayıt Ol</Link>
              </>
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
