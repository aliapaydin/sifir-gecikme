'use client';

import { usePathname } from 'next/navigation';
import { icerikler } from '../lib/icerikler';

const kategoriRenk = {
  interaktif: { badge: 'badge-interactive', border: '#1D9E75' },
  rehber:     { badge: 'badge-guide',       border: '#7F77DD' },
  arac:       { badge: 'badge-guide',       border: '#7F77DD' },
  vaka:       { badge: 'badge-case',        border: '#e8a04a' },
  kariyer:    { badge: 'badge-case',        border: '#e8a04a' },
};

export default function IlgiliIcerikler() {
  const pathname = usePathname();

  const simdiki = icerikler.find(i => i.href === pathname);
  if (!simdiki) return null;

  // Aynı kategoriden, mevcut sayfa hariç, en fazla 3 içerik
  const ayniKategori = icerikler.filter(
    i => i.kategori === simdiki.kategori && i.href !== pathname
  );

  // Farklı kategoriden tamamla (toplam 3'e ulaşmak için)
  const farklıKategori = icerikler.filter(
    i => i.kategori !== simdiki.kategori && i.href !== pathname
  );

  const ilgili = [...ayniKategori, ...farklıKategori].slice(0, 3);

  if (!ilgili.length) return null;

  return (
    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '0.5px solid var(--color-border)' }}>
      <p style={{
        fontSize: '12px', color: 'var(--color-text-mute)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px',
      }}>
        Bunları da beğenebilirsin
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {ilgili.map(icerik => {
          const stil = kategoriRenk[icerik.kategori] || kategoriRenk.rehber;
          return (
            <a key={icerik.href} href={icerik.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="card" style={{
                borderTop: `3px solid ${icerik.borderColor || stil.border}`,
                padding: '14px 16px',
                height: '100%', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: '6px',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span className={`badge ${stil.badge}`} style={{ width: 'fit-content', fontSize: '10px' }}>
                  {icerik.kategori}
                </span>
                <p className="font-serif font-medium" style={{
                  fontSize: '14px', lineHeight: '1.4',
                  color: 'var(--color-text)', margin: 0, flex: 1,
                }}>
                  {icerik.baslik}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-faint)', margin: 0 }}>
                  {icerik.meta}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
