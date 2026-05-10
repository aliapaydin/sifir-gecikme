'use client';

import Arama from './Arama';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const kategoriler = [
  { href: '/kategori/interaktif', label: 'İnteraktif', emoji: '⚡' },
  { href: '/kategori/rehber',     label: 'Rehber',     emoji: '📖' },
  { href: '/kategori/arac',       label: 'Araç',       emoji: '🛠' },
  { href: '/kategori/vaka',       label: 'Vaka',       emoji: '📊' },
  { href: '/kategori/kariyer',    label: 'Kariyer',    emoji: '💼' },
  { href: '/python',              label: 'PY Playground', emoji: '🐍' },
  { href: '/sql',                 label: 'SQL Playground',        emoji: '🗄️' },
  { href: '/ogren',               label: 'Öğren',      emoji: '📚' },
];

function ThemeToggleBtn() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

const toggle = () => {
  const scrollY = window.scrollY;  // ← scroll pozisyonunu kaydet
  const next = !dark;
  setDark(next);
  if (next) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  window.scrollTo(0, scrollY);  // ← scroll pozisyonunu geri yükle
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
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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

const [isDark, setIsDark] = useState(false);

useEffect(() => {
  setIsDark(document.documentElement.classList.contains('dark'));
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}, []);

  const navBg = scrolled
    ? isDark ? 'rgba(26,24,21,0.92)' : 'rgba(250,248,243,0.92)'
    : 'var(--color-cream)';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: navBg,
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
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: 700,
            fontFamily: 'var(--font-serif)', flexShrink: 0,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <a href="/" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              background: pathname === '/' ? 'var(--color-accent-soft)' : 'transparent',
              color: pathname === '/' ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: pathname === '/' ? 500 : 400,
            }}>Tümü</a>

            {kategoriler.map(({ href, label, emoji }) => (
              <a key={href} href={href} style={{
                padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
                background: isActive(href) ? 'var(--color-accent-soft)' : 'transparent',
                color: isActive(href) ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
                fontWeight: isActive(href) ? 500 : 400,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span style={{ fontSize: '12px' }}>{emoji}</span>
                {label}
              </a>
            ))}

            <div style={{ width: '1px', height: '18px', background: 'var(--color-border)', margin: '0 4px' }} />

            <a href="/hakkimda" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              background: isActive('/hakkimda') ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive('/hakkimda') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive('/hakkimda') ? 500 : 400,
            }}>Hakkımda</a>
            <Arama />
            <div style={{ width: '1px', height: '18px', background: 'var(--color-border)', margin: '0 4px' }} />
            <ThemeToggleBtn />
          </div>
        )}

        {/* Mobile */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Arama />
            <ThemeToggleBtn />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü" style={{
              width: '36px', height: '36px', borderRadius: '8px',
              border: '0.5px solid var(--color-border)',
              background: 'var(--color-cream-card)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px',
            }}>
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(0,5.5px)' : 'none' }} />
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ width: '18px', height: '1.5px', background: 'var(--color-text)', borderRadius: '999px', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(0,-5.5px)' : 'none' }} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ borderTop: '0.5px solid var(--color-border)', background: 'var(--color-cream)', padding: '8px 16px 16px' }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
            textDecoration: 'none', marginBottom: '2px',
            background: pathname === '/' ? 'var(--color-accent-soft)' : 'transparent',
            color: pathname === '/' ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
            fontWeight: pathname === '/' ? 500 : 400,
          }}>
            <span>🏠</span> Tüm İçerikler
          </a>

          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', padding: '10px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Kategoriler
          </div>

          {kategoriler.map(({ href, label, emoji }) => (
            <a key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
              textDecoration: 'none', marginBottom: '2px',
              background: isActive(href) ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive(href) ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive(href) ? 500 : 400,
            }}>
              <span>{emoji}</span> {label}
            </a>
          ))}

          <div style={{ height: '0.5px', background: 'var(--color-border)', margin: '8px 0' }} />

          <a href="/hakkimda" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
            textDecoration: 'none',
            background: isActive('/hakkimda') ? 'var(--color-accent-soft)' : 'transparent',
            color: isActive('/hakkimda') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
          }}>
            <span>👤</span> Hakkımda
          </a>
        </div>
      )}
    </header>
  );
}
