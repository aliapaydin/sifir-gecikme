export default function YolHaritasiKarti() {
  const adimlar = [
    { no: 1, label: 'Python', renk: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
    { no: 2, label: 'Pandas', renk: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
    { no: 3, label: 'SQL', renk: '#7F77DD', bg: '#EEEDFE', text: '#534AB7' },
    { no: 4, label: 'Görsel', renk: '#e8a04a', bg: '#FAEEDA', text: '#854F0B' },
    { no: 5, label: 'İstatistik', renk: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
    { no: 6, label: 'BI Araçları', renk: '#7F77DD', bg: '#EEEDFE', text: '#534AB7' },
    { no: 7, label: 'Proje', renk: '#e8a04a', bg: '#FAEEDA', text: '#854F0B' },
    { no: 8, label: 'ML', renk: '#E24B4A', bg: '#FCEBEB', text: '#A32D2D' },
    { no: 9, label: 'Veri Müh.', renk: '#7F77DD', bg: '#EEEDFE', text: '#534AB7' },
    { no: 10, label: 'Kariyer', renk: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-4">
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
      }}>
        {/* Üst — başlık ve buton */}
        <div style={{
          padding: '20px 24px',
          background: 'var(--color-cream)',
          borderBottom: '0.5px solid var(--color-border)',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', background: '#E1F5EE', color: '#0F6E56', padding: '2px 8px', borderRadius: '999px', fontWeight: 500 }}>
                Kariyer rehberi
              </span>
            </div>
            <div className="font-serif" style={{ fontSize: '19px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
              Veri Analisti Olma<br />Yol Haritası
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.6', marginBottom: '14px' }}>
              Sıfırdan veri analistine. 10 adım, hangi sırayla, ne kadar sürede, hangi araçlarla.
            </p>
            <a href="/yazilar/yol-haritasi" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500, padding: '8px 16px',
              borderRadius: '8px', background: 'var(--color-accent)',
              color: '#fff', textDecoration: 'none',
            }}>
              Yol haritasını gör →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
            {[
              { val: '10', label: 'adım', renk: '#1D9E75' },
              { val: '6-12', label: 'ay', renk: '#7F77DD' },
              { val: '🆓', label: 'ücretsiz', renk: 'var(--color-text-soft)' },
            ].map(({ val, label, renk }) => (
              <div key={label} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '10px 14px', textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500, color: renk }}>{val}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alt — adım göstergesi */}
        <div style={{ padding: '16px 24px 20px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '0', minWidth: '560px' }}>
            {adimlar.map((adim, idx) => (
              <div key={adim.no} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                {/* Bağlantı çizgisi */}
                {idx < adimlar.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '16px',
                    left: '50%', right: '-50%',
                    height: '2px', background: adim.bg, zIndex: 0,
                  }} />
                )}
                {/* Numara dairesi */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: adim.bg, color: adim.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 500,
                  margin: '0 auto 6px', position: 'relative', zIndex: 1,
                }}>
                  {adim.no}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.3 }}>
                  {adim.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
