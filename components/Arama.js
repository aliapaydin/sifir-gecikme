'use client';

import { useState, useEffect, useRef } from 'react';
import { icerikler, kategoriler } from '../lib/icerikler';

export default function Arama() {
  const [acik, setAcik] = useState(false);
  const [sorgu, setSorgu] = useState('');
  const inputRef = useRef(null);

  const sonuclar = sorgu.trim().length < 2 ? [] : icerikler.filter(i =>
    i.baslik.toLowerCase().includes(sorgu.toLowerCase()) ||
    i.ozet.toLowerCase().includes(sorgu.toLowerCase()) ||
    i.kategori.toLowerCase().includes(sorgu.toLowerCase())
  );

  const kat = (slug) => kategoriler.find(k => k.slug === slug);

  useEffect(() => {
    if (acik) setTimeout(() => inputRef.current?.focus(), 50);
  }, [acik]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setAcik(a => !a);
      }
      if (e.key === 'Escape') setAcik(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Arama butonu */}
      <button
        onClick={() => setAcik(true)}
        aria-label="Ara"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '8px',
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-cream-card)',
          color: 'var(--color-text-mute)',
          cursor: 'pointer', fontSize: '13px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ display: 'none' }} className="sm-show">Ara</span>
        <kbd style={{ fontSize: '11px', background: 'var(--color-cream)', padding: '1px 5px', borderRadius: '4px', border: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>⌘K</kbd>
      </button>

      {/* Modal overlay */}
      {acik && (
        <div
          onClick={(e) => e.target === e.currentTarget && setAcik(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: '80px 16px 16px',
          }}
        >
          <div style={{
            width: '100%', maxWidth: '560px',
            background: 'var(--color-cream-card)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '0.5px solid var(--color-border)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-mute)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={sorgu}
                onChange={e => setSorgu(e.target.value)}
                placeholder="İçeriklerde ara..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  background: 'transparent',
                  fontSize: '16px', color: 'var(--color-text)',
                }}
              />
              {sorgu && (
                <button onClick={() => setSorgu('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '18px', lineHeight: 1 }}>×</button>
              )}
              <kbd onClick={() => setAcik(false)} style={{ fontSize: '11px', background: 'var(--color-cream)', padding: '2px 6px', borderRadius: '4px', border: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)', cursor: 'pointer' }}>ESC</kbd>
            </div>

            {/* Sonuçlar */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {sorgu.trim().length < 2 ? (
                <div style={{ padding: '24px 16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    Tüm kategoriler
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {kategoriler.map(k => (
                      <a key={k.slug} href={`/kategori/${k.slug}`} onClick={() => setAcik(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '0.5px solid var(--color-border)', background: k.bg, color: k.text, fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                        {k.emoji} {k.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : sonuclar.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '14px' }}>
                  "{sorgu}" için sonuç bulunamadı
                </div>
              ) : (
                <div>
                  <div style={{ padding: '10px 16px 4px', fontSize: '11px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {sonuclar.length} sonuç
                  </div>
                  {sonuclar.map((icerik, idx) => {
                    const k = kat(icerik.kategori);
                    return (
                      <a key={icerik.href} href={icerik.href} onClick={() => setAcik(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 16px', textDecoration: 'none',
                          borderTop: idx > 0 ? '0.5px solid var(--color-border)' : 'none',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: k?.bg || 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                          {k?.emoji || '📄'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {icerik.baslik}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {icerik.ozet}
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', background: k?.bg, color: k?.text, padding: '2px 8px', borderRadius: '999px', fontWeight: 500, flexShrink: 0 }}>
                          {k?.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
