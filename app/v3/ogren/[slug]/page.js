import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [
    'python-temelleri',
    'donguler-fonksiyonlar',
    'numpy',
    'pandas',
    'istatistik-ml',
  ].map(slug => ({ slug }));
}

export default async function V3OgrenPage({ params }) {
  const { slug } = await params;

  let PageComponent;
  try {
    const mod = await import('../../../ogren/[slug]/page');
    PageComponent = mod.default;
  } catch {
    notFound();
  }

  return (
    <div style={{
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      minHeight: 'calc(100vh - 144px)',
    }}>
      <PageComponent />
    </div>
  );
}
