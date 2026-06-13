'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SYNC_READY_EVENT } from '../lib/userSync';

function toggle(key, href) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  const idx = arr.indexOf(href);
  if (idx === -1) arr.push(href);
  else arr.splice(idx, 1);
  localStorage.setItem(key, JSON.stringify(arr));
  return idx === -1;
}

async function syncMarkToDB(href, mark) {
  try {
    await fetch('/api/v3/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ href, mark: mark || null }),
    });
  } catch {}
}

export default function AnladimButonlar() {
  const rawPathname = usePathname();
  const pathname = rawPathname?.startsWith('/v3/') ? rawPathname.slice(3) : rawPathname;
  const [anladi, setAnladi] = useState(false);
  const [tekrar, setTekrar] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const anladiArr = JSON.parse(localStorage.getItem('sz_anladi') || '[]');
    const tekrarArr = JSON.parse(localStorage.getItem('sz_tekrar') || '[]');
    setAnladi(anladiArr.includes(pathname));
    setTekrar(tekrarArr.includes(pathname));
    // Giriş durumunu kontrol et
    fetch('/api/v3/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setLoggedIn(true);
    }).catch(() => {});

  }, [pathname]);

  function handleAnladi() {
    const next = toggle('sz_anladi', pathname);
    setAnladi(next);
    if (next && tekrar) {
      toggle('sz_tekrar', pathname);
      setTekrar(false);
    }
    // sz_durum da güncelle
    try {
      const durum = JSON.parse(localStorage.getItem('sz_durum') || '{}');
      if (next) { durum[pathname] = 'anladi'; delete durum[pathname.replace('anladi','tekrar')]; }
      else delete durum[pathname];
      localStorage.setItem('sz_durum', JSON.stringify(durum));
    } catch {}
    if (loggedIn) syncMarkToDB(pathname, next ? 'anladi' : null);
  }

  function handleTekrar() {
    const next = toggle('sz_tekrar', pathname);
    setTekrar(next);
    if (next && anladi) {
      toggle('sz_anladi', pathname);
      setAnladi(false);
    }
    try {
      const durum = JSON.parse(localStorage.getItem('sz_durum') || '{}');
      if (next) durum[pathname] = 'tekrar';
      else delete durum[pathname];
      localStorage.setItem('sz_durum', JSON.stringify(durum));
    } catch {}
    if (loggedIn) syncMarkToDB(pathname, next ? 'tekrar' : null);
  }

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      margin: '32px 0 8px',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginRight: '4px' }}>Bu içerik:</span>
      <button
        onClick={handleAnladi}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '8px',
          border: anladi ? '1px solid var(--color-correct-border)' : '1px solid var(--color-border)',
          background: anladi ? 'var(--color-correct-bg)' : 'var(--color-cream-card)',
          color: anladi ? 'var(--color-correct-text)' : 'var(--color-text-soft)',
          fontSize: '13px',
          fontWeight: anladi ? '600' : '400',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12 13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Anladım
      </button>
      <button
        onClick={handleTekrar}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '8px',
          border: tekrar ? '1px solid var(--color-amber-text)' : '1px solid var(--color-border)',
          background: tekrar ? 'var(--color-amber-bg)' : 'var(--color-cream-card)',
          color: tekrar ? 'var(--color-amber-text)' : 'var(--color-text-soft)',
          fontSize: '13px',
          fontWeight: tekrar ? '600' : '400',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 8a6 6 0 1 0 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tekrar bak
      </button>
    </div>
  );
}
