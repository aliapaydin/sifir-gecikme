'use client';
import { useState } from 'react';
import HeroCanvas from '../components/HeroCanvas';
import OgrenKarti from '../components/OgrenKarti';
import GununSorusu from '../components/GununSorusu';
import AboneOl from '../components/AboneOl';
import YolHaritasiKarti from '../components/YolHaritasiKarti';
import { yazilar } from '../lib/icerikler';
import IcerikIcon from '../components/IcerikIcon';

function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Tema değiştir"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ◐
    </button>
  );
}

function karistir(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function DahaFazlaBar({ ornekler, digerSayi }) {
  return (
    <div style={{ marginTop: '16px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-accent), var(--color-purple-text), var(--color-amber-text))' }} />
      <div style={{ padding: '28px 28px 24px', display: 'flex', gap: '28px', alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* Sol: sayı + açıklama + kategori linkleri */}
        <div style={{ flex: '0 0 auto', minWidth: '185px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '52px', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1, fontFamily: 'var(--font-mono)', letterSpacing: '-2px' }}>
              +{digerSayi}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', marginTop: '6px' }}>içerik daha var</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '6px', lineHeight: 1.6 }}>
              İnteraktif demolar, vaka çalışmaları,<br />rehberler ve araçlar seni bekliyor.
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { href: '/icerikler', label: '⚡ Demo',   cls: 'badge-interactive' },
              { href: '/kategori/rehber',     label: '📖 Rehber', cls: 'badge-guide' },
              { href: '/kategori/vaka',       label: '📊 Vaka',   cls: 'badge-case' },
            ].map(c => (
              <a key={c.href} href={c.href} className={`badge ${c.cls}`} style={{ textDecoration: 'none' }}>{c.label}</a>
            ))}
          </div>
        </div>

        {/* Dikey çizgi */}
        <div style={{ width: '1px', background: 'var(--color-border)', alignSelf: 'stretch', flexShrink: 0 }} />

        {/* Sağ: 3 önizleme kartı + CTA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '240px' }}>
          {ornekler.map(item => (
            <a key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '10px', flex: 1,
              background: 'var(--color-cream)',
              border: '1px solid var(--color-border)',
              borderLeft: `3px solid ${item.borderColor}`,
              textDecoration: 'none',
            }}>
              <div style={{ flexShrink: 0 }}><IcerikIcon type={item.icon} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.badge && (
                  <span className={`badge ${item.badgeClass}`} style={{ fontSize: '10px', marginBottom: '3px', display: 'inline-block' }}>{item.badge}</span>
                )}
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.35, fontFamily: 'var(--font-serif)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.baslik}
                </div>
              </div>
            </a>
          ))}
          <a href="/icerikler" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px', borderRadius: '10px', marginTop: '4px',
            background: 'var(--color-accent)', color: '#fff',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>
            Tüm içeriklere git →
          </a>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const interaktif = yazilar.filter(y => y.badge === 'interaktif').length;
  const arac = yazilar.filter(y => y.badge === 'araç').length;
  const rehber = yazilar.filter(y => ['rehber', 'kariyer', 'vaka çalışması'].includes(y.badge)).length;

  const [sira, setSira] = useState(() => karistir(yazilar));
  const gorunenler = sira.slice(0, 18);
  const bannerOrnekler = sira.slice(18, 21);
  const shuffle = () => setSira(karistir(yazilar));

  const [durumlar, setDurumlar] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sz_durum') || '{}'); } catch { return {}; }
  });

  const durumToggle = (href, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDurumlar(prev => {
      const simdiki = prev[href];
      const yeni = simdiki === 'anladi' ? 'tekrar' : simdiki === 'tekrar' ? null : 'anladi';
      const guncel = { ...prev };
      if (yeni) guncel[href] = yeni; else delete guncel[href];
      try { localStorage.setItem('sz_durum', JSON.stringify(guncel)); } catch {}
      return guncel;
    });
  };

  return (
    <main className="min-h-screen">

      <section className="max-w-5xl mx-auto px-6 py-14" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="badge badge-interactive">{yazilar.length} içerik</span>
              <span className="badge badge-interactive">{interaktif} interaktif demo</span>
              <span className="badge badge-case">Türkçe &amp; ücretsiz</span>
            </div>
            <h1 className="font-serif font-medium leading-tight mb-4" style={{ fontSize: '2.6rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Birlikte öğreniyoruz,<br />birlikte deniyoruz.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-soft)', maxWidth: '420px' }}>
              Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler. Her kavramı önce dener, sonra konuşuruz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexShrink: 0 }}>
            {[
              { sayi: yazilar.length, etiket: 'içerik', renk: 'var(--color-accent)' },
              { sayi: interaktif, etiket: 'demo', renk: '#7F77DD' },
              { sayi: arac, etiket: 'araç', renk: '#e8a04a' },
              { sayi: rehber, etiket: 'rehber', renk: '#E24B4A' },
            ].map(({ sayi, etiket, renk }) => (
              <div key={etiket} className="card text-center" style={{ padding: '16px 20px', minWidth: '90px' }}>
                <div className="text-2xl font-medium mb-1" style={{ color: renk }}>{sayi}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-mute)' }}>{etiket}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

<OgrenKarti />
<YolHaritasiKarti />

      <section className="max-w-5xl mx-auto px-6 py-10 pb-8">
        <HeroCanvas />

        <div style={{ marginBottom: '2.5rem' }}>
          <GununSorusu />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-mute)' }}>İçerikler</div>
          <button onClick={shuffle} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            border: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            color: 'var(--color-text-soft)',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="3.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            Karıştır
          </button>
        </div>
        <div className="icerik-grid">
          {gorunenler.map((y) => (
            <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div className="card" style={{ borderTop: `3px solid ${y.borderColor}`, padding: '18px 20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <IcerikIcon type={y.icon} />
                </div>
                {y.badge && <span className={`badge ${y.badgeClass} inline-block mb-3`}>{y.badge}</span>}
                <h3 className="font-serif font-medium mb-2" style={{ fontSize: '16px', color: 'var(--color-text)', lineHeight: '1.4', flex: 1 }}>{y.baslik}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-mute)' }}>{y.ozet}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{y.meta}</p>
                <button
                  onClick={(e) => durumToggle(y.href, e)}
                  style={{
                    marginTop: '10px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '0.5px solid var(--color-border)',
                    background: durumlar[y.href] === 'anladi' ? 'var(--color-correct-bg)'
                              : durumlar[y.href] === 'tekrar' ? 'var(--color-amber-bg)'
                              : 'transparent',
                    color: durumlar[y.href] === 'anladi' ? 'var(--color-correct-text)'
                         : durumlar[y.href] === 'tekrar' ? 'var(--color-amber-text)'
                         : 'var(--color-text-mute)',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    alignSelf: 'flex-start',
                  }}
                >
                  {durumlar[y.href] === 'anladi' ? '✓ Anladım'
                   : durumlar[y.href] === 'tekrar' ? '🔖 Tekrar bak'
                   : '○ İşaretle'}
                </button>
              </div>
            </a>
          ))}
        </div>

        <DahaFazlaBar ornekler={bannerOrnekler} digerSayi={yazilar.length - 18} />

      </section>
      <AboneOl />
    </main>
  );
}
