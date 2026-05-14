'use client';

import Arama from './Arama';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const kategoriler = [
  { href: '/kategori/interaktif', label: 'İnteraktif', emoji: '⚡' },
  { href: '/kategori/rehber',     label: 'Rehber',     emoji: '📖' },
  { href: '/kategori/arac',       label: 'Araç',       emoji: '🛠' },
  { href: '/kategori/vaka',       label: 'Vaka',       emoji: '📊' },
  { href: '/kategori/kariyer',    label: 'Kariyer',    emoji: '💼' },
  { href: '/python',              label: 'PY Playground', emoji: '🐍' },
  { href: '/sql',                 label: 'SQL Playground',        emoji: '🗄️' },
  { href: '/regex',              label: 'Regex',                 emoji: '🔍' },
  { href: '/ogren',               label: 'Öğren',      emoji: '📚' },
  { href: '/proje',               label: 'Proje',      emoji: '🚀' },
];

function readTemaFromDOM() {
  const el = document.documentElement;
  if (el.classList.contains('lacivert')) return 'lacivert';
  if (el.classList.contains('dark')) return 'dark';
  return 'light';
}

function ThemeToggleBtn() {
  const [tema, setTema] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTema(readTemaFromDOM());
  }, []);

  const toggle = () => {
    const scrollY = window.scrollY;
    const sira = { light: 'dark', dark: 'lacivert', lacivert: 'light' };
    const next = sira[tema];
    const el = document.documentElement;
    el.classList.remove('dark', 'lacivert');
    if (next !== 'light') el.classList.add(next);
    localStorage.setItem('theme', next);
    setTema(next);
    window.scrollTo(0, scrollY);
  };

  if (!mounted) return <div style={{ width: '32px', height: '32px' }} />;

  const ikonlar = { light: '☀️', dark: '🌙', lacivert: '🌊' };

  return (
    <button onClick={toggle} aria-label="Tema değiştir" title={{ light: 'Koyu temaya geç', dark: 'Lacivert temaya geç', lacivert: 'Açık temaya geç' }[tema]} style={{
      width: '32px', height: '32px', borderRadius: '8px',
      border: '0.5px solid var(--color-border)',
      background: 'var(--color-cream-card)',
      cursor: 'pointer', fontSize: '15px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-soft)', flexShrink: 0,
    }}>
      {ikonlar[tema]}
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

  const pillRef = useRef(null);
  const [pillScroll, setPillScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const update = () => {
      setPillScroll({
        left: el.scrollLeft > 8,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
      });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

const [tema, setTema] = useState('light');

useEffect(() => {
  setTema(readTemaFromDOM());
  const observer = new MutationObserver(() => setTema(readTemaFromDOM()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}, []);

const isDark = tema !== 'light';

const navBgMap = {
  light: 'rgba(250,248,243,0.92)',
  dark: 'rgba(26,24,21,0.92)',
  lacivert: 'rgba(13,17,23,0.92)',
};
const fadeMap = {
  light: 'rgba(243,240,233,0.95)',
  dark: 'rgba(26,24,21,0.95)',
  lacivert: 'rgba(13,17,23,0.95)',
};
const pillBgMap = {
  light: 'rgba(0,0,0,0.035)',
  dark: 'rgba(0,0,0,0.18)',
  lacivert: 'rgba(0,0,0,0.28)',
};

  const navBg = scrolled ? navBgMap[tema] : 'var(--color-cream)';

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
            <a href="/hakkimda" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              background: isActive('/hakkimda') ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive('/hakkimda') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive('/hakkimda') ? 500 : 400,
            }}>Hakkımda</a>
            <a href="/harita" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '4px',
              background: isActive('/harita') ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive('/harita') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive('/harita') ? 500 : 400,
            }}><span style={{ fontSize: '12px' }}>🗺️</span> Haritam</a>
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

      {/* Pill bar — her ekranda görünür */}
      <div style={{ position: 'relative', borderTop: '0.5px solid var(--color-border)' }}>
        {/* Sol fade */}
        {pillScroll.left && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '48px', zIndex: 2,
            pointerEvents: 'none',
            background: `linear-gradient(to right, ${fadeMap[tema]}, transparent)`,
          }} />
        )}
        {/* Sağ fade */}
        {pillScroll.right && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '48px', zIndex: 2,
            pointerEvents: 'none',
            background: `linear-gradient(to left, ${fadeMap[tema]}, transparent)`,
          }} />
        )}
        <div ref={pillRef} style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          background: pillBgMap[tema],
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 1.5rem',
          width: 'max-content',
          minWidth: '100%',
        }}>
          <a href="/" style={{
            padding: '4px 12px', borderRadius: '999px', fontSize: '12.5px',
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            border: '0.5px solid',
            borderColor: pathname === '/' ? 'var(--color-accent)' : 'var(--color-border)',
            background: pathname === '/' ? 'var(--color-accent-soft)' : 'transparent',
            color: pathname === '/' ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
            fontWeight: pathname === '/' ? 500 : 400,
          }}>Tümü</a>

          <div style={{ width: '0.5px', height: '14px', background: 'var(--color-border)', flexShrink: 0, margin: '0 2px' }} />

          {kategoriler.map(({ href, label, emoji }) => (
            <a key={href} href={href} style={{
              padding: '4px 12px', borderRadius: '999px', fontSize: '12.5px',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '5px',
              border: '0.5px solid',
              borderColor: isActive(href) ? 'var(--color-accent)' : 'var(--color-border)',
              background: isActive(href) ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive(href) ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
              fontWeight: isActive(href) ? 500 : 400,
            }}>
              <span style={{ fontSize: '11px' }}>{emoji}</span>
              {label}
            </a>
          ))}
        </div>
        </div>
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
          <a href="/harita" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
            textDecoration: 'none',
            background: isActive('/harita') ? 'var(--color-accent-soft)' : 'transparent',
            color: isActive('/harita') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
          }}>
            <span>🗺️</span> Haritam
          </a>
        </div>
      )}
    </header>
  );
}
