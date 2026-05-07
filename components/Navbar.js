'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Yazılar', emoji: '📝' },
  { href: '/hakkimda', label: 'Hakkımda', emoji: '👤' },
];

function ThemeToggleBtn() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return <div style={{ width: '32px', height: '32px' }} />;

  return (
    <button onClick={toggle} aria-label="Tema değiştir" style={{
      width: '32px', height: '32px', borderRadius: '8px',
      border: '0.5px solid var(--color-border)',
      background: 'var(--color-cream-card)',
      cursor: 'pointer', fontSize: '15px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-soft)', flexShrink: 0,
    }}>
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled
  ? document.documentElement.classList.contains('dark')
    ? 'rgba(26,24,21,0.92)'
    : 'rgba(250,248,243,0.92)'
  : 'var(--color-cream)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '0.5px solid var(--color-border)',
      transition: 'background 0.2s',
    }}>
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '56px',
      }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0,
            fontFamily: 'var(--font-serif)',
          }}>Sz</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.15, fontFamily: 'var(--font-serif)' }}>
              Sıfır Gecikme
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', letterSpacing: '0.03em' }}>
              veri bilimi · türkçe
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '7px 13px', borderRadius: '8px', fontSize: '13px',
                textDecoration: 'none', transition: 'background 0.15s',
                background: isActive(href) ? 'var(--color-accent-soft)' : 'transparent',
                color: isActive(href) ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
                fontWeight: isActive(href) ? 500 : 400,
              }}>{label}</a>
            ))}
            <div style={{ width: '1px', height: '18px', background: 'var(--color-border)', margin: '0 6px' }} />
            <ThemeToggleBtn />
          </div>
        )}

        {/* Mobile sağ taraf */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggleBtn />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px',
              }}
            >
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(0px, 5.5px)' : 'none' }} />
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(0px, -5.5px)' : 'none' }} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          borderTop: '0.5px solid var(--color-border)',
          background: 'var(--color-cream)',
          padding: '8px 16px 16px',
        }}>
          {navLinks.map(({ href, label, emoji }) => (
            <a key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', borderRadius: '8px', fontSize: '14px',
              textDecoration: 'none', marginBottom: '2px',
              background: isActive(href) ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive(href) ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive(href) ? 500 : 400,
            }}>
              <span>{emoji}</span> {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
