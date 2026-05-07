'use client';
import HeroCanvas from '../components/HeroCanvas';

function Icon({ type }) {
  const icons = {
    'linear-regression': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <circle cx="10" cy="22" r="2" fill="#1D9E75"/>
        <circle cx="15" cy="16" r="2" fill="#1D9E75"/>
        <circle cx="20" cy="12" r="2" fill="#1D9E75"/>
        <circle cx="24" cy="9" r="2" fill="#1D9E75"/>
        <line x1="8" y1="24" x2="26" y2="24" stroke="#0F6E56" strokeWidth="1.2"/>
        <line x1="8" y1="8" x2="8" y2="24" stroke="#0F6E56" strokeWidth="1.2"/>
        <line x1="9" y1="23" x2="25" y2="8" stroke="#1D9E75" strokeWidth="1.5"/>
      </svg>
    ),
    'izmir-kira': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <rect x="7" y="18" width="4" height="8" rx="1" fill="#e8a04a"/>
        <rect x="13" y="13" width="4" height="13" rx="1" fill="#e8a04a"/>
        <rect x="19" y="9" width="4" height="17" rx="1" fill="#BA7517"/>
        <line x1="7" y1="26.5" x2="24" y2="26.5" stroke="#854F0B" strokeWidth="1"/>
      </svg>
    ),
    'gradient-descent': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <path d="M7 9 Q16 26 25 9" stroke="#1D9E75" strokeWidth="2" fill="none"/>
        <circle cx="16" cy="23" r="3" fill="#7F77DD" stroke="#26215C" strokeWidth="1"/>
        <line x1="16" y1="8" x2="16" y2="20" stroke="#0F6E56" strokeWidth="1" strokeDasharray="2 2"/>
      </svg>
    ),
    'ab-test': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="7" y="11" width="8" height="14" rx="2" fill="#AFA9EC"/>
        <rect x="17" y="11" width="8" height="14" rx="2" fill="#7F77DD"/>
        <text x="11" y="21" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="600">A</text>
        <text x="21" y="21" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="600">B</text>
      </svg>
    ),
    'kmeans': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <circle cx="11" cy="13" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="21" cy="11" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="16" cy="21" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="11" cy="13" r="1.5" fill="#0F6E56"/>
        <circle cx="21" cy="11" r="1.5" fill="#0F6E56"/>
        <circle cx="16" cy="21" r="1.5" fill="#0F6E56"/>
        <line x1="11" y1="13" x2="21" y2="11" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
        <line x1="21" y1="11" x2="16" y2="21" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
        <line x1="16" y1="21" x2="11" y2="13" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
      </svg>
    ),
    'ilk-90-gun': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <circle cx="16" cy="12" r="4.5" fill="#e8a04a" opacity=".6"/>
        <circle cx="16" cy="12" r="2.5" fill="#BA7517"/>
        <path d="M9 26 C9 21 23 21 23 26" stroke="#e8a04a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    'confusion-matrix': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <rect x="8" y="9" width="7" height="7" rx="1" fill="#1D9E75" opacity=".9"/>
        <rect x="17" y="9" width="7" height="7" rx="1" fill="#9FE1CB"/>
        <rect x="8" y="18" width="7" height="7" rx="1" fill="#9FE1CB"/>
        <rect x="17" y="18" width="7" height="7" rx="1" fill="#1D9E75" opacity=".9"/>
        <text x="11.5" y="15" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="600">TP</text>
        <text x="20.5" y="15" fontSize="5.5" fill="#0F6E56" textAnchor="middle" fontWeight="600">FP</text>
        <text x="11.5" y="24" fontSize="5.5" fill="#0F6E56" textAnchor="middle" fontWeight="600">FN</text>
        <text x="20.5" y="24" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="600">TN</text>
      </svg>
    ),
    'pandas-7-sey': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="8" y="9" width="14" height="2" rx="1" fill="#AFA9EC"/>
        <rect x="8" y="14" width="10" height="2" rx="1" fill="#7F77DD"/>
        <rect x="8" y="19" width="12" height="2" rx="1" fill="#AFA9EC"/>
        <rect x="8" y="24" width="8" height="2" rx="1" fill="#7F77DD"/>
        <circle cx="24" cy="21" r="4" fill="none" stroke="#E24B4A" strokeWidth="1.5"/>
        <line x1="27" y1="24" x2="29" y2="26" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'bias-variance': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <path d="M7 22 Q11 8 16 16 Q21 24 25 10" stroke="#1D9E75" strokeWidth="2" fill="none"/>
        <line x1="7" y1="24" x2="26" y2="24" stroke="#0F6E56" strokeWidth="1"/>
        <line x1="7" y1="7" x2="7" y2="24" stroke="#0F6E56" strokeWidth="1"/>
        <circle cx="16" cy="16" r="2.5" fill="#7F77DD"/>
      </svg>
    ),
    'feature-engineering': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="7" y="20" width="5" height="7" rx="1" fill="#AFA9EC"/>
        <rect x="14" y="15" width="5" height="12" rx="1" fill="#7F77DD"/>
        <rect x="21" y="10" width="5" height="17" rx="1" fill="#534AB7"/>
        <path d="M9.5 20 L9.5 16 L16.5 16 L16.5 12 L23.5 12 L23.5 9" stroke="#534AB7" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <circle cx="23.5" cy="9" r="1.5" fill="#534AB7"/>
      </svg>
    ),
    'sql-temelleri': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#7F77DD"/>
        <path d="M8 10 C8 10 8 14 16 14 C24 14 24 10 24 10" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <path d="M8 14 C8 14 8 18 16 18 C24 18 24 14 24 14" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <path d="M8 18 C8 18 8 22 16 22 C24 22 24 18 24 18" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <ellipse cx="16" cy="22" rx="8" ry="3" fill="none" stroke="#534AB7" strokeWidth="1.2"/>
      </svg>
    ),
    'sample-size': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <rect x="7" y="22" width="4" height="5" rx="1" fill="#AFA9EC"/>
    <rect x="13" y="17" width="4" height="10" rx="1" fill="#7F77DD"/>
    <rect x="19" y="12" width="4" height="15" rx="1" fill="#534AB7"/>
    <line x1="7" y1="10" x2="25" y2="10" stroke="#534AB7" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="9" cy="10" r="2" fill="#E24B4A"/>
    <circle cx="15" cy="10" r="2" fill="#E24B4A"/>
    <circle cx="21" cy="10" r="2" fill="#1D9E75"/>
  </svg>
),
'sinir-agi': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="8" cy="16" r="2.5" fill="#5DCAA5"/>
    <circle cx="16" cy="10" r="2.5" fill="#7F77DD"/>
    <circle cx="16" cy="22" r="2.5" fill="#7F77DD"/>
    <circle cx="24" cy="16" r="2.5" fill="#e8a04a"/>
    <line x1="10" y1="15" x2="14" y2="11" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="10" y1="17" x2="14" y2="21" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="18" y1="11" x2="22" y2="15" stroke="#7F77DD" strokeWidth="1.2"/>
    <line x1="18" y1="21" x2="22" y2="17" stroke="#7F77DD" strokeWidth="1.2"/>
  </svg>
),
  };
  return icons[type] || null;
}

function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Tema değiştir"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ◐
    </button>
  );
}

export default function Home() {
  const yazilar = [
    {
      href: '/yazilar/linear-regression',
      icon: 'linear-regression',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Linear regression: çizgiyi sen çiz',
      ozet: 'Noktaları sürükle, regresyon çizgisi ve R² anlık değişsin.',
      meta: '8 dakika',
    },
    {
      href: '/yazilar/izmir-kira-analizi',
      icon: 'izmir-kira',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'İzmir kira piyasası: 5.841 ilan, bir analist gözüyle',
      ozet: 'Hangi ilçe gerçekten pahalı? m² fiyatı hikayeyi nasıl değiştiriyor?',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/gradient-descent',
      icon: 'gradient-descent',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Gradient descent: top yuvarlama oyunu',
      ozet: 'Öğrenme hızını ayarla, top minimuma insin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ab-test',
      icon: 'ab-test',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'A/B test anlamlılık hesaplayıcı',
      ozet: 'p-değeri, güven aralığı ve etki büyüklüğünü hesapla.',
      meta: 'interaktif araç',
    },
    {
      href: '/yazilar/kmeans',
      icon: 'kmeans',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'K-Means: müşterilerini kümele',
      ozet: "Centroid'lerin adım adım nasıl yer değiştirdiğini izle.",
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ilk-90-gun',
      icon: 'ilk-90-gun',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti olarak ilk 90 günüm',
      ozet: '15 yıl sonra geriye bakınca keşke bilseydim dediklerim.',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/confusion-matrix',
      icon: 'confusion-matrix',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Confusion matrix: eşik dansı',
      ozet: 'Eşiği kaydır, TP/FP/TN/FN ve ROC eğrisi canlı değişsin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/pandas-7-sey',
      icon: 'pandas-7-sey',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: "Pandas'ta en çok yanlış bilinen 7 şey",
      ozet: 'inplace, apply, merge, category dtype ve daha fazlası.',
      meta: '15 dakika',
    },
    {
      href: '/yazilar/bias-variance',
      icon: 'bias-variance',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Bias-variance trade-off: ezber mi, genelleme mi?',
      ozet: 'Polinom derecesini artır, underfitting ve overfitting arasındaki geçişi izle.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/feature-engineering',
      icon: 'feature-engineering',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Feature engineering: modelden önce gelen sanat',
      ozet: 'Encoding, ölçekleme, zaman özellikleri, etkileşim ve seçim.',
      meta: '15 dakika',
    },
    {
      href: '/yazilar/sql-temelleri',
      icon: 'sql-temelleri',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'SQL temelleri: veri analistinin en önemli becerisi',
      ozet: 'SELECT, JOIN, GROUP BY, window fonksiyonlar — sıfırdan ileri seviyeye.',
      meta: 'rehber · 20 dakika',
    },
    {
      href: '/yazilar/sample-size',
      icon: 'sample-size',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Sample size hesaplayıcı',
      ozet: 'A/B testi başlatmadan önce kaç kullanıcıya ihtiyacın var?',
      meta: 'interaktif araç',
    },
    {
      href: '/yazilar/sinir-agi',
      icon: 'sinir-agi',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Sinir ağı visualizer: veri nasıl akar?',
      ozet: 'Katmanları ayarla, sinyal gönder, nöronların nasıl ateşlendiğini izle.',
      meta: '12 dakika',
    },
  ];

  const interaktif = yazilar.filter(y => y.badge === 'interaktif').length;
  const arac = yazilar.filter(y => y.badge === 'araç').length;
  const rehber = yazilar.filter(y => ['rehber', 'kariyer', 'vaka çalışması'].includes(y.badge)).length;

  return (
    <main className="min-h-screen">
      <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <span className="font-serif text-lg font-medium">Sıfır Gecikme</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
            <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
            <a href="#">Demolar</a>
            <a href="#">Araçlar</a>
            <a href="/hakkimda">Hakkımda</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-14" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="badge badge-interactive">{yazilar.length} içerik</span>
              <span className="badge badge-interactive">{interaktif} interaktif demo</span>
              <span className="badge badge-case">Türkçe &amp; ücretsiz</span>
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
        <HeroCanvas />
        <div className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-mute)' }}>Tüm içerikler</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {yazilar.map((y) => (
            <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div className="card" style={{ borderTop: `3px solid ${y.borderColor}`, padding: '18px 20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Icon type={y.icon} />
                </div>
                <span className={`badge ${y.badgeClass} inline-block mb-3`}>{y.badge}</span>
                <h3 className="font-serif font-medium mb-2" style={{ fontSize: '16px', color: 'var(--color-text)', lineHeight: '1.4', flex: 1 }}>{y.baslik}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-mute)' }}>{y.ozet}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{y.meta}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10">
</div>
      </section>
    </main>
  );
}
