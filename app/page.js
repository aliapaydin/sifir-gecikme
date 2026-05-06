export default function Home() {
  const yazilar = [
    {
      href: '/yazilar/linear-regression',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Linear regression: çizgiyi sen çiz',
      ozet: 'Noktaları sürükle, regresyon çizgisi ve R² anlık değişsin.',
      meta: '8 dakika',
    },
    {
      href: '/yazilar/izmir-kira-analizi',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'İzmir kira piyasası: 5.841 ilan, bir analist gözüyle',
      ozet: 'Hangi ilçe gerçekten pahalı? m² fiyatı hikayeyi nasıl değiştiriyor?',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/gradient-descent',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Gradient descent: top yuvarlama oyunu',
      ozet: 'Öğrenme hızını ayarla, top minimuma insin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ab-test',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'A/B test anlamlılık hesaplayıcı',
      ozet: 'p-değeri, güven aralığı ve etki büyüklüğünü hesapla.',
      meta: 'interaktif araç',
    },
    {
      href: '/yazilar/kmeans',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'K-Means: müşterilerini kümele',
      ozet: "Centroid'lerin adım adım nasıl yer değiştirdiğini izle.",
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ilk-90-gun',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti olarak ilk 90 günüm',
      ozet: '15 yıl sonra geriye bakınca keşke bilseydim dediklerim.',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/confusion-matrix',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Confusion matrix: eşik dansı',
      ozet: 'Eşiği kaydır, TP/FP/TN/FN ve ROC eğrisi canlı değişsin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/pandas-7-sey',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: "Pandas'ta en çok yanlış bilinen 7 şey",
      ozet: 'inplace, apply, merge, category dtype ve daha fazlası.',
      meta: '15 dakika',
    },
    {
      href: '/yazilar/bias-variance',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Bias-variance trade-off: ezber mi, genelleme mi?',
      ozet: 'Polinom derecesini artır, underfitting ve overfitting arasındaki geçişi izle.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/feature-engineering',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Feature engineering: modelden önce gelen sanat',
      ozet: 'Encoding, ölçekleme, zaman özellikleri, etkileşim ve seçim.',
      meta: '15 dakika',
    },
  ];

  const interaktif = yazilar.filter(y => y.badge === 'interaktif').length;
  const arac = yazilar.filter(y => y.badge === 'araç').length;
  const rehber = yazilar.filter(y => y.badge === 'rehber' || y.badge === 'kariyer' || y.badge === 'vaka çalışması').length;

  return (
    <main className="min-h-screen">
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <span className="font-serif text-lg font-medium">Sıfır Gecikme</span>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-14" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div style={{ flex: '1', minWidth: '280px' }}>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="badge badge-interactive">{yazilar.length} içerik</span>
              <span className="badge badge-interactive">{interaktif} interaktif demo</span>
              <span className="badge badge-case">Türkçe & ücretsiz</span>
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

      <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
        <div className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-mute)' }}>Tüm içerikler</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {yazilar.map((y) => (
            <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div className="card h-full" style={{ borderTop: `3px solid ${y.borderColor}`, padding: '18px 20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <span className={`badge ${y.badgeClass} inline-block mb-3`}>{y.badge}</span>
                <h3 className="font-serif font-medium mb-2" style={{ fontSize: '17px', color: 'var(--color-text)', lineHeight: '1.4', flex: 1 }}>{y.baslik}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-mute)' }}>{y.ozet}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{y.meta}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://instagram.com/sifirgecikme" target="_blank" rel="noopener noreferrer">Instagram</a>
        </span>
      </footer>
    </main>
  );
}
