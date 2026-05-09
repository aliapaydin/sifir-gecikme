export default function AboneOl({ compact = false }) {
  if (compact) {
    return (
      <div style={{
        padding: '20px 24px',
        borderTop: '0.5px solid var(--color-border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <div className="font-serif" style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '3px' }}>
            📬 Yeni içeriklerden haberdar ol
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
            Haftada bir, spam yok.
          </div>
        </div>
        <a href="https://sifirgecikme.substack.com" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '8px',
            background: 'var(--color-accent)', color: '#fff',
            fontSize: '13px', fontWeight: 500, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
          Abone ol →
        </a>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div style={{
        borderRadius: '16px',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '32px 36px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📬</div>
            <h2 className="font-serif" style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              Yeni içeriklerden haberdar ol
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: '1.65', marginBottom: '0' }}>
              Yeni demo, vaka çalışması veya rehber yayınlandığında sana haber verelim.
              Haftada bir, sadece içerik, hiç spam yok.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <iframe
              src="https://sifirgecikme.substack.com/embed"
              title="Sıfır Gecikme bültenine abone ol"
              width="360"
              height="120"
              style={{
                border: 'none',
                borderRadius: '10px',
                background: 'transparent',
              }}
              frameBorder="0"
              scrolling="no"
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { val: '0 spam', icon: '🚫' },
                { val: 'İstediğin zaman çık', icon: '✌️' },
                { val: 'Ücretsiz', icon: '🆓' },
              ].map(({ val, icon }) => (
                <div key={val} style={{ fontSize: '12px', color: 'var(--color-text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{icon}</span> {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
