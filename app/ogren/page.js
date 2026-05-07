import { dersler } from '../../lib/dersler';

export default function OgrenSayfasi() {
  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <h1 className="font-serif text-4xl font-medium mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Python ile Veri Bilimi
        </h1>
        <p className="text-lg mb-10" style={{ color: 'var(--color-text-soft)' }}>
          Her ders önce öğretir, sonra sınar. Adım adım, Türkçe.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dersler.map((ders, idx) => (
            <a key={ders.id} href={'/ogren/' + ders.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid ' + ders.renk, padding: '16px 20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: ders.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{ders.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>Ders {idx + 1}</div>
                  <div className="font-serif font-medium" style={{ fontSize: '17px', color: 'var(--color-text)', marginBottom: '6px' }}>{ders.baslik}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ders.konular.map(k => (
                      <span key={k} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: ders.bg, color: ders.renk, fontWeight: 500 }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: ders.renk }}>+{ders.xp} XP</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{ders.adimlar.filter(a => a.tip !== 'ogret').length} soru</div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="card mt-8 text-center" style={{ padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
          <div className="font-serif font-medium mb-2" style={{ fontSize: '18px', color: 'var(--color-text)' }}>
            Toplam {dersler.reduce((s,d) => s+d.xp, 0)} XP kazanabilirsin
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-mute)' }}>Tüm dersleri tamamla, Python temellerini sağlam at.</div>
        </div>
      </section>
    </main>
  );
}
