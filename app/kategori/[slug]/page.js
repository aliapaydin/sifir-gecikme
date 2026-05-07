import { icerikler, kategoriler } from '../../../lib/icerikler';

export function generateStaticParams() {
  return kategoriler.map(k => ({ slug: k.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const kat = kategoriler.find(k => k.slug === slug);
  return {
    title: `${kat?.label ?? 'Kategori'} — Sıfır Gecikme`,
    description: kat?.aciklama,
  };
}

export default async function KategoriSayfasi({ params }) {
  const { slug } = await params;
  const kat = kategoriler.find(k => k.slug === slug);
  const liste = icerikler.filter(i => i.kategori === slug);

  if (!kat) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-mute)' }}>
      Kategori bulunamadı.
    </div>
  );

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: kat.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', flexShrink: 0,
          }}>{kat.emoji}</div>
          <div>
            <h1 className="font-serif text-3xl font-medium" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              {kat.label}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-mute)' }}>
              {kat.aciklama} · {liste.length} içerik
            </p>
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'var(--color-border)', margin: '24px 0' }} />

        {liste.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--color-text-mute)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
            <p>Bu kategoride henüz içerik yok. Yakında gelecek!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {liste.map(y => (
              <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{
                  borderTop: `3px solid ${y.borderColor}`,
                  padding: '18px 20px', height: '100%',
                  boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                }}>
                  <span className={`badge ${kat.badgeClass} inline-block mb-3`}>{kat.label}</span>
                  <h3 className="font-serif font-medium mb-2" style={{
                    fontSize: '16px', color: 'var(--color-text)',
                    lineHeight: '1.4', flex: 1,
                  }}>
                    {y.baslik}
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-mute)' }}>
                    {y.ozet}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{y.meta}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
