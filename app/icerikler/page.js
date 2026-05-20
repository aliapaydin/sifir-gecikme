'use client';
import { useState, useEffect } from 'react';
import { yazilar, getKategori } from '../../lib/icerikler';
import IcerikIcon from '../../components/IcerikIcon';

const TABS = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'interaktif', label: 'Demo' },
  { id: 'rehber', label: 'Rehber' },
  { id: 'kariyer', label: 'Kariyer' },
  { id: 'vaka', label: 'Vaka' },
  { id: 'arac', label: 'Araç' },
];

export default function IceriklerPage() {
  const [aktifTab, setAktifTab] = useState('tumu');
  const [ziyaretler, setZiyaretler] = useState([]);
  const [anladilar, setAnladilar] = useState([]);
  const [tekrarlar, setTekrarlar] = useState([]);

  useEffect(() => {
    try {
      const z = JSON.parse(localStorage.getItem('sz_ziyaretler') || '[]');
      setZiyaretler(Array.isArray(z) ? z : []);
    } catch {}
    try {
      const durumlar = JSON.parse(localStorage.getItem('sz_durum') || '{}');
      const newAnladi = JSON.parse(localStorage.getItem('sz_anladi') || '[]');
      const newTekrar = JSON.parse(localStorage.getItem('sz_tekrar') || '[]');
      const aSet = new Set(newAnladi);
      const tSet = new Set(newTekrar);
      Object.entries(durumlar).forEach(([href, durum]) => {
        if (durum === 'anladi') aSet.add(href);
        else if (durum === 'tekrar') tSet.add(href);
      });
      setAnladilar([...aSet]);
      setTekrarlar([...tSet]);
    } catch {}
  }, []);

  const filtreli = aktifTab === 'tumu'
    ? yazilar
    : yazilar.filter(y => getKategori(y) === aktifTab);

  const tabSayisi = (tabId) => {
    if (tabId === 'tumu') return yazilar.length;
    return yazilar.filter(y => getKategori(y) === tabId).length;
  };

  const interaktifSayi = yazilar.filter(y => getKategori(y) === 'interaktif').length;
  const rehberSayi = yazilar.filter(y => getKategori(y) === 'rehber').length;
  const vakaSayi = yazilar.filter(y => getKategori(y) === 'vaka').length;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section style={{ maxWidth: '1024px', margin: '0 auto', padding: '40px 24px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-mute)', textDecoration: 'none', marginBottom: '20px' }}>
          ← Ana Sayfa
        </a>
        <h1 className="font-serif font-medium" style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
          Tüm İçerikler
        </h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-interactive">{yazilar.length} içerik</span>
          <span className="badge badge-interactive">{interaktifSayi} interaktif demo</span>
          <span className="badge badge-guide">{rehberSayi} rehber</span>
          <span className="badge badge-case">{vakaSayi} vaka</span>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {TABS.map(tab => {
            const aktif = aktifTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAktifTab(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: aktif ? 'none' : '1px solid var(--color-border)',
                  background: aktif ? 'var(--color-accent)' : 'transparent',
                  color: aktif ? '#fff' : 'var(--color-text-soft)',
                  fontSize: '13px',
                  fontWeight: aktif ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tab.label} ({tabSayisi(tab.id)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div className="icerik-grid">
          {filtreli.map((y) => {
            const ziyaret = ziyaretler.includes(y.href);
            const anladi = anladilar.includes(y.href);
            const tekrar = tekrarlar.includes(y.href);

            let statusBadge = null;
            if (anladi) {
              statusBadge = (
                <span style={{ background: 'var(--color-correct-bg)', color: 'var(--color-correct-text)', border: '1px solid var(--color-correct-border)', fontSize: '10px', padding: '2px 7px', borderRadius: '999px' }}>
                  ✓ Anladım
                </span>
              );
            } else if (tekrar) {
              statusBadge = (
                <span style={{ background: 'var(--color-amber-bg)', color: 'var(--color-amber-text)', border: '1px solid var(--color-amber-text)', fontSize: '10px', padding: '2px 7px', borderRadius: '999px' }}>
                  ↩ Tekrar
                </span>
              );
            } else if (ziyaret) {
              statusBadge = (
                <span style={{ background: 'var(--color-correct-bg)', color: 'var(--color-correct-text)', border: '1px solid var(--color-correct-border)', fontSize: '10px', padding: '2px 7px', borderRadius: '999px' }}>
                  ✓ Okundu
                </span>
              );
            }

            return (
              <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                <div
                  className="card"
                  style={{
                    borderTop: `3px solid ${y.borderColor}`,
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 18px',
                  }}
                >
                  {/* Status badge row */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '20px', marginBottom: '8px' }}>
                    {statusBadge}
                  </div>

                  {/* Icon + badge row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ flexShrink: 0 }}>
                      <IcerikIcon type={y.icon} />
                    </div>
                    {y.badge && (
                      <span className={`badge ${y.badgeClass || 'badge-guide'}`} style={{ fontSize: '10px' }}>
                        {y.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    className="font-serif"
                    style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4, flex: 1, marginBottom: '8px' }}
                  >
                    {y.baslik}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-mute)',
                      lineHeight: 1.5,
                      marginBottom: '8px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {y.ozet}
                  </p>

                  {/* Meta */}
                  <p style={{ fontSize: '11px', color: 'var(--color-text-faint)' }}>
                    {y.meta}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
