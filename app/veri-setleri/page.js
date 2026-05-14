'use client';

import { useState, useMemo } from 'react';
import { veriKategorileri, veriSetleri } from '@/lib/veri-setleri';

const formatRenk = {
  'CSV':        { bg: '#E1F5EE', color: '#0F6E56' },
  'XLSX':       { bg: '#EEF2FF', color: '#3730A3' },
  'JSON':       { bg: '#FEF3C7', color: '#92400E' },
  'API':        { bg: '#FCE7F3', color: '#9D174D' },
  'GeoJSON':    { bg: '#E0F2FE', color: '#0369A1' },
  'PDF':        { bg: '#FEE2E2', color: '#991B1B' },
  'Python API': { bg: '#F3E8FF', color: '#6B21A8' },
  'Web Scraping':{ bg: '#FFF7ED', color: '#9A3412' },
  'TXT':        { bg: '#F1F5F9', color: '#475569' },
  default:      { bg: '#F1F5F9', color: '#475569' },
};

function FormatBadge({ fmt }) {
  const stil = formatRenk[fmt] || formatRenk.default;
  return (
    <span style={{
      fontSize: '11px', fontWeight: 500, padding: '2px 7px', borderRadius: '5px',
      background: stil.bg, color: stil.color,
    }}>{fmt}</span>
  );
}

function VeriKarti({ veri }) {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>
            {veri.kaynak}
          </div>
          <h3 className="font-serif" style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', lineHeight: '1.35', margin: 0 }}>
            {veri.baslik}
          </h3>
        </div>
        {veri.oneCikan && (
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#FEF3C7', color: '#92400E', whiteSpace: 'nowrap', flexShrink: 0 }}>
            ★ Öne çıkan
          </span>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.65', margin: 0, flex: 1 }}>
        {veri.aciklama}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {veri.format.map(f => <FormatBadge key={f} fmt={f} />)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '0.5px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
          🔄 {veri.guncelleme}
        </span>
        <a
          href={veri.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '7px',
            background: 'var(--color-cream)', border: '0.5px solid var(--color-border)',
            color: 'var(--color-text-soft)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            transition: 'all .15s',
          }}
        >
          Veri kaynağına git ↗
        </a>
      </div>
    </div>
  );
}

export default function VeriSetleriArşivi() {
  const [aktifKategori, setAktifKategori] = useState('tumu');
  const [arama, setArama] = useState('');

  const filtrelenmis = useMemo(() => {
    let sonuc = veriSetleri;
    if (aktifKategori !== 'tumu') {
      sonuc = sonuc.filter(v => v.kategori === aktifKategori);
    }
    if (arama.trim()) {
      const q = arama.toLowerCase();
      sonuc = sonuc.filter(v =>
        v.baslik.toLowerCase().includes(q) ||
        v.aciklama.toLowerCase().includes(q) ||
        v.kaynak.toLowerCase().includes(q)
      );
    }
    return sonuc;
  }, [aktifKategori, arama]);

  const oneCikanlar = filtrelenmis.filter(v => v.oneCikan);
  const digerler   = filtrelenmis.filter(v => !v.oneCikan);

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>
          Ana sayfa
        </a>

        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-guide inline-block mb-3">araç</span>
          <h1 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 500, color: 'var(--color-text)', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
            Türkiye Veri Seti Arşivi
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-soft)', lineHeight: '1.7', maxWidth: '620px', margin: 0 }}>
            Türkiye'ye ait açık veri kaynaklarının küratöryal listesi. Ekonomi, deprem, hava, finans, spor ve daha fazlası — hepsini bir arada bul.
          </p>
        </div>

        {/* İstatistikler */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { val: veriSetleri.length,                              label: 'veri seti' },
            { val: veriSetleri.filter(v => v.oneCikan).length,      label: 'öne çıkan' },
            { val: veriKategorileri.length - 1,                     label: 'kategori' },
          ].map(({ val, label }) => (
            <div key={label} className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text)' }}>{val}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Arama */}
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Veri seti ara... (örn. deprem, TCMB, CSV)"
            value={arama}
            onChange={e => setArama(e.target.value)}
            style={{
              width: '100%', maxWidth: '480px', padding: '10px 14px',
              borderRadius: '10px', border: '1px solid var(--color-border)',
              background: 'var(--color-cream-card)', color: 'var(--color-text)',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Kategori filtreleri */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {veriKategorileri.map(kat => (
            <button
              key={kat.slug}
              onClick={() => setAktifKategori(kat.slug)}
              style={{
                padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                border: `1.5px solid ${aktifKategori === kat.slug ? '#1D9E75' : 'var(--color-border)'}`,
                background: aktifKategori === kat.slug ? '#E1F5EE' : 'var(--color-cream-card)',
                color: aktifKategori === kat.slug ? '#0F6E56' : 'var(--color-text-soft)',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {kat.emoji} {kat.label}
            </button>
          ))}
        </div>

        {filtrelenmis.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-mute)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p>"{arama}" için sonuç bulunamadı.</p>
          </div>
        ) : (
          <>
            {oneCikanlar.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '1rem' }}>
                  ★ Öne Çıkanlar
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                  {oneCikanlar.map(v => <VeriKarti key={v.id} veri={v} />)}
                </div>
              </section>
            )}

            {digerler.length > 0 && (
              <section>
                {oneCikanlar.length > 0 && (
                  <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '1rem' }}>
                    Diğerleri
                  </h2>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                  {digerler.map(v => <VeriKarti key={v.id} veri={v} />)}
                </div>
              </section>
            )}
          </>
        )}

        <div className="card" style={{ marginTop: '3rem', padding: '20px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '22px' }}>💡</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px' }}>
              Eksik bir kaynak var mı?
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.65', margin: 0 }}>
              Bildiğin değerli bir Türkiye veri kaynağı bu listede yoksa, önerebilirsin. Liste periyodik olarak güncelleniyor.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
