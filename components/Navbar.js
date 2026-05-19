'use client';

import Arama from './Arama';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const GRUPLAR = [
  {
    key: 'kategoriler',
    label: 'Kategoriler',
    emoji: '📂',
    items: [
      { href: '/kategori/interaktif', label: 'İnteraktif', emoji: '⚡' },
      { href: '/kategori/rehber',     label: 'Rehber',     emoji: '📖' },
      { href: '/kategori/arac',       label: 'Araç',       emoji: '🛠' },
      { href: '/kategori/vaka',       label: 'Vaka',       emoji: '📊' },
      { href: '/kategori/kariyer',    label: 'Kariyer',    emoji: '💼' },
    ],
  },
  {
    key: 'playground',
    label: 'Playground',
    emoji: '⚙️',
    items: [
      { href: '/python', label: 'PY Playground', emoji: '🐍' },
      { href: '/sql',    label: 'SQL Playground', emoji: '🗄️' },
      { href: '/regex',  label: 'Regex',          emoji: '🔍' },
      { href: '/ciz',    label: 'Rakam Çiz',       emoji: '✏️' },
      { href: '/nn',     label: 'Sinir Ağı',        emoji: '🧠' },
    ],
  },
  {
    key: 'moduller',
    label: 'Modüller',
    emoji: '🧩',
    items: [
      { href: '/ogren',        label: 'Öğren',        emoji: '📚' },
      { href: '/proje',        label: 'Proje',        emoji: '🚀' },
      { href: '/grafik',       label: 'Bilgi Grafiği', emoji: '🕸️' },
      { href: '/kalori',       label: 'Kalori',       emoji: '🥗' },
      { href: '/veri-setleri', label: 'Veri Setleri', emoji: '🗂️' },
      { href: '/milyon',       label: 'Milyon',       emoji: '💰' },
      { href: '/mulakat',      label: 'Mülakat',      emoji: '🎤' },
    ],
  },
];

function readTemaFromDOM() {
  const el = document.documentElement;
  if (el.classList.contains('gece'))    return 'gece';
  if (el.classList.contains('lacivert')) return 'lacivert';
  if (el.classList.contains('dark'))    return 'dark';
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
    const sira = { light: 'dark', dark: 'lacivert', lacivert: 'gece', gece: 'light' };
    const next = sira[tema];
    const el = document.documentElement;
    el.classList.add('tema-gecis');
    el.classList.remove('dark', 'lacivert', 'gece');
    if (next !== 'light') el.classList.add(next);
    localStorage.setItem('theme', next);
    setTema(next);
    setTimeout(() => el.classList.remove('tema-gecis'), 300);
    window.scrollTo(0, scrollY);
  };

  if (!mounted) return <div style={{ width: '32px', height: '32px' }} />;

  const ikonlar = { light: '☀️', dark: '🌙', lacivert: '🌊', gece: '✨' };

  return (
    <button onClick={toggle} aria-label="Tema değiştir"
      title={{ light: 'Koyu temaya geç', dark: 'Lacivert temaya geç', lacivert: 'Gece temaya geç', gece: 'Açık temaya geç' }[tema]}
      style={{
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
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [acikGrup,    setAcikGrup]    = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  // Mobil hamburger menüde hangi grup açık
  const [acikMobGrup, setAcikMobGrup] = useState(null);

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

  // Dropdown açıkken dışarı tıklayınca kapat
  // setTimeout(0): mevcut click event'i geçtikten sonra listener kayıt et
  useEffect(() => {
    if (!acikGrup) return;
    const close = () => setAcikGrup(null);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('click', close);
    };
  }, [acikGrup]);

  // Route değişince her şeyi kapat
  useEffect(() => {
    setMenuOpen(false);
    setAcikGrup(null);
    setAcikMobGrup(null);
  }, [pathname]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const grupAktifMi = (grup) => grup.items.some(item => isActive(item.href));

  const handleGrupClick = (e, grupKey) => {
    if (acikGrup === grupKey) { setAcikGrup(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - 190);
    setDropdownPos({ left, top: rect.bottom + 4 });
    setAcikGrup(grupKey);
  };

  const pillRef = useRef(null);
  const [pillScroll, setPillScroll] = useState({ left: false, right: false });

  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const update = () => {
      setPillScroll({
        left:  el.scrollLeft > 8,
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

  const navBgMap = {
    light:    'rgba(250,248,243,0.92)',
    dark:     'rgba(26,24,21,0.92)',
    lacivert: 'rgba(13,17,23,0.92)',
    gece:     'rgba(7,8,14,0.90)',
  };
  const fadeMap = {
    light:    'rgba(243,240,233,0.95)',
    dark:     'rgba(26,24,21,0.95)',
    lacivert: 'rgba(13,17,23,0.95)',
    gece:     'rgba(7,8,14,0.95)',
  };
  const pillBgMap = {
    light:    'rgba(0,0,0,0.035)',
    dark:     'rgba(0,0,0,0.18)',
    lacivert: 'rgba(0,0,0,0.28)',
    gece:     'rgba(99,102,241,0.06)',
  };
  const dropdownBgMap = {
    light:    'var(--color-cream-card)',
    dark:     '#1e1c18',
    lacivert: '#0d1117',
    gece:     '#0E1017',
  };

  const navBg = scrolled ? navBgMap[tema] : 'var(--color-cream)';

  // Açık dropdown için veri
  const acikGrupData = GRUPLAR.find(g => g.key === acikGrup);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: navBg,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '0.5px solid var(--color-border)',
      transition: 'background 0.2s',
    }}>
      {/* Ana bar */}
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '56px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <svg viewBox="0 0 32 32" width="28" height="28" style={{ flexShrink: 0, display: 'block' }}>
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1D9E75" />
                <stop offset="100%" stopColor="#0D6B50" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
            <rect x="7"  y="20" width="4" height="6"  rx="1.5" fill="rgba(255,255,255,0.90)" />
            <rect x="14" y="15" width="4" height="11" rx="1.5" fill="rgba(255,255,255,0.90)" />
            <rect x="21" y="9"  width="4" height="17" rx="1.5" fill="rgba(255,255,255,0.90)" />
          </svg>
          <div>
            <div className="navbar-logo-title" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.15, fontFamily: 'var(--font-serif)' }}>
              Sıfır Gecikme
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', letterSpacing: '0.03em' }}>
              veri bilimi · türkçe
            </div>
          </div>
        </Link>

        {/* Desktop sağ */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <Link href="/hakkimda" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              background: isActive('/hakkimda') ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive('/hakkimda') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive('/hakkimda') ? 500 : 400,
            }}>Hakkımda</Link>
            <Link href="/harita" style={{
              padding: '7px 11px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '4px',
              background: isActive('/harita') ? 'var(--color-accent-soft)' : 'transparent',
              color: isActive('/harita') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              fontWeight: isActive('/harita') ? 500 : 400,
            }}><span style={{ fontSize: '12px' }}>🗺️</span> Haritam</Link>
            <Arama />
            <div style={{ width: '1px', height: '18px', background: 'var(--color-border)', margin: '0 4px' }} />
            <ThemeToggleBtn />
          </div>
        )}

        {/* Mobil sağ */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Arama />
            <ThemeToggleBtn />
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menü" style={{
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

      {/* Pill bar — gruplu; mobilde hamburger açıkken gizle */}
      {!(isMobile && menuOpen) && <div style={{ position: 'relative', borderTop: '0.5px solid var(--color-border)' }}>
        {pillScroll.left && (
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', zIndex: 2, pointerEvents: 'none', background: `linear-gradient(to right, ${fadeMap[tema]}, transparent)` }} />
        )}
        {pillScroll.right && (
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px', zIndex: 2, pointerEvents: 'none', background: `linear-gradient(to left, ${fadeMap[tema]}, transparent)` }} />
        )}
        <div ref={pillRef} style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', background: pillBgMap[tema] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 1.5rem', width: 'max-content', minWidth: '100%' }}>

            {/* Tümü */}
            <Link href="/" style={{
              padding: '4px 12px', borderRadius: '999px', fontSize: '12.5px',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              border: '0.5px solid',
              borderColor: pathname === '/' ? 'var(--color-accent)' : 'var(--color-border)',
              background: pathname === '/' ? 'var(--color-accent-soft)' : 'transparent',
              color: pathname === '/' ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
              fontWeight: pathname === '/' ? 500 : 400,
            }}>Tümü</Link>

            <div style={{ width: '0.5px', height: '14px', background: 'var(--color-border)', flexShrink: 0, margin: '0 4px' }} />

            {/* Grup butonları */}
            {GRUPLAR.map((grup) => {
              const aktif = grupAktifMi(grup);
              const acik  = acikGrup === grup.key;
              return (
                <button
                  key={grup.key}
                  onClick={(e) => handleGrupClick(e, grup.key)}
                  style={{
                    padding: '4px 11px', borderRadius: '999px', fontSize: '12.5px',
                    whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    border: '0.5px solid',
                    borderColor: aktif || acik ? 'var(--color-accent)' : 'var(--color-border)',
                    background: aktif || acik ? 'var(--color-accent-soft)' : 'transparent',
                    color: aktif || acik ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                    fontWeight: aktif || acik ? 500 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '11px' }}>{grup.emoji}</span>
                  {grup.label}
                  <span style={{ fontSize: '8px', opacity: 0.55, marginLeft: '1px', lineHeight: 1 }}>
                    {acik ? '▲' : '▼'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>}

      {/* Dropdown — position:fixed, tema'ya göre arka plan */}
      {acikGrupData && (
        <div
          style={{
            position: 'fixed',
            left: dropdownPos.left,
            top: dropdownPos.top,
            zIndex: 200,
            background: dropdownBgMap[tema],
            border: '0.5px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: tema === 'light'
              ? '0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)'
              : '0 8px 32px rgba(0,0,0,0.4)',
            padding: '5px',
            minWidth: '176px',
          }}
        >
          {acikGrupData.items.map(item => {
            const aktif = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '8px 12px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', whiteSpace: 'nowrap',
                background: aktif ? 'var(--color-accent-soft)' : 'transparent',
                color: aktif ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
                fontWeight: aktif ? 500 : 400,
                transition: 'background 0.1s',
              }}>
                <span style={{ fontSize: '13px', width: '18px', textAlign: 'center' }}>{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Mobil hamburger menü — gruplu */}
      {isMobile && menuOpen && (
        <div style={{ borderTop: '0.5px solid var(--color-border)', background: 'var(--color-cream)', padding: '8px 12px 16px' }}>
          {/* Sabit linkler */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none',
            background: pathname === '/' ? 'var(--color-accent-soft)' : 'transparent',
            color: pathname === '/' ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
            fontWeight: pathname === '/' ? 500 : 400,
          }}>
            <span>🏠</span> Tüm İçerikler
          </Link>
          <Link href="/hakkimda" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none',
            background: isActive('/hakkimda') ? 'var(--color-accent-soft)' : 'transparent',
            color: isActive('/hakkimda') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
          }}>
            <span>👤</span> Hakkımda
          </Link>
          <Link href="/harita" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none',
            background: isActive('/harita') ? 'var(--color-accent-soft)' : 'transparent',
            color: isActive('/harita') ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
          }}>
            <span>🗺️</span> Haritam
          </Link>

          {/* Gruplar */}
          {GRUPLAR.map(grup => {
            const acik = acikMobGrup === grup.key;
            const aktif = grupAktifMi(grup);
            return (
              <div key={grup.key}>
                <div style={{ height: '0.5px', background: 'var(--color-border)', margin: '6px 0' }} />
                {/* Grup başlığı — tıklanabilir */}
                <button
                  onClick={() => setAcikMobGrup(acik ? null : grup.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px', fontSize: '13px',
                    background: aktif ? 'var(--color-accent-soft)' : 'transparent',
                    color: aktif ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                    fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span>{grup.emoji}</span>
                  <span style={{ flex: 1 }}>{grup.label.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', opacity: 0.5 }}>{acik ? '▲' : '▼'}</span>
                </button>

                {acik && grup.items.map(item => {
                  const akt = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 12px 8px 32px', borderRadius: '8px', fontSize: '14px',
                      textDecoration: 'none',
                      background: akt ? 'var(--color-accent-soft)' : 'transparent',
                      color: akt ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
                      fontWeight: akt ? 500 : 400,
                    }}>
                      <span style={{ fontSize: '13px' }}>{item.emoji}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}
