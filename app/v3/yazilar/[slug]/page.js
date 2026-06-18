import { notFound } from 'next/navigation';

// Tüm yazılar önceden oluşturulur
export function generateStaticParams() {
  return [
    'bootstrap-ornekleme', 'doviz-altin-tahmini', 'sql-join-gorsellestirici',
    'ab-test', 'anscombe', 'banka-fraud', 'bezier', 'bi-karsilastirma',
    'bias-variance', 'churn-tahmini', 'cloud-rehberi', 'cohort-analizi',
    'confusion-matrix', 'databricks-rehberi', 'dbt-nedir', 'decision-tree',
    'deprem-analizi', 'etl-nedir', 'feature-engineering', 'gradient-descent',
    'ilk-90-gun', 'izmir-kira-analizi', 'kmeans', 'kredi-shap',
    'linear-regression', 'linkedin-profili', 'lojistik-regresyon',
    'merkezi-limit-teoremi', 'mulakat-sql', 'naive-bayes', 'pandas-7-sey',
    'pandas-referans', 'portfolyo', 'random-forest', 'rol-farklari',
    'sample-size', 'sepet-terki', 'sinir-agi', 'sklearn-pipeline',
    'sosyal-medya-turkiye', 'spotify-turkiye', 'sql-temelleri', 'superlig-xg',
    'veri-dedektifi', 'veri-temizleme', 'yol-haritasi', 'z-skor', 'zaman-serisi',
  ].map(slug => ({ slug }));
}

export default async function V3YaziPage({ params }) {
  const { slug } = await params;

  let PageComponent;
  try {
    const mod = await import(`../../../yazilar/${slug}/page`);
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
