'use client';

export default function Hakkimda() {
  const beceriler = [
    { kategori: 'Veri Bilimi', liste: ['Python', 'scikit-learn', 'XGBoost', 'TensorFlow'] },
    { kategori: 'Görselleştirme', liste: ['Matplotlib', 'Seaborn', 'Power BI', 'Tableau'] },
    { kategori: 'Veri Analizi', liste: ['pandas', 'NumPy', 'SQL', 'Excel'] },
    { kategori: 'Migrasyon', liste: ['ETL', 'Spark', 'dbt', 'Airflow'] },
  ];

  const deneyimler = [
    {
      sirket: 'Concentrix',
      rol: 'Data Engineer',
      sure: '2021 — Günümüz',
      renk: '#1D9E75',
    },
    {
      sirket: 'Önceki Deneyimler',
      rol: 'Veri Analisti & Yönetici',
      sure: '2010 — 2022',
      renk: '#7F77DD',
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Hero bölümü */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap' }}>

          {/* Fotoğraf */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: '140px', height: '140px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '3px solid var(--color-accent)',
              boxShadow: '0 0 0 6px var(--color-accent-soft)',
              position: 'relative',
            }}>
              <img
                src="/ali.png"
                alt="Ali Apaydın"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Sosyal linkler fotoğraf altında */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
              {[
                { href: 'https://linkedin.com/in/aliapaydin35', label: 'in', title: 'LinkedIn' },
                { href: 'https://github.com/aliapaydin', label: 'gh', title: 'GitHub' },
                { href: 'https://x.com/sifirgecikme', label: '𝕏', title: 'X' },
              ].map(({ href, label, title }) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" title={title}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    border: '0.5px solid var(--color-border)',
                    background: 'var(--color-cream-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600,
                    color: 'var(--color-text-soft)', textDecoration: 'none',
                  }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Başlık */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', background: 'var(--color-accent-soft)', color: 'var(--color-accent-text)', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>
                Concentrix
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>15 yıllık deneyim</span>
            </div>
            <h1 className="font-serif" style={{ fontSize: '36px', fontWeight: 500, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '8px' }}>
              Ali Apaydın
            </h1>
            <div style={{ fontSize: '16px', color: 'var(--color-accent-text)', fontWeight: 500, marginBottom: '12px' }}>
              Data Engineer
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-text-soft)', marginBottom: '16px' }}>
              Veri bilimi, görselleştirme, analiz ve migrasyon alanlarında 15 yıldır
              çalışıyorum. Atatürk Üniversitesi Bilgi Yönetimi mezunuyum.
            </p>
            <a href="mailto:sifirgecikme@gmail.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500,
              color: 'var(--color-accent-text)', textDecoration: 'none',
              border: '0.5px solid var(--color-accent)',
              padding: '7px 14px', borderRadius: '8px',
            }}>
              ✉ İletişime geç
            </a>
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '40px' }} />

        {/* Neden Sıfır Gecikme */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Neden Sıfır Gecikme?
          </h2>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.8', color: 'var(--color-text)' }}>
            <p style={{ marginBottom: '1rem' }}>
              Veri bilimine ilk adım attığımda kaliteli Türkçe kaynak bulmak gerçekten
              zordu. Saatlerce İngilizce döküman okur, kavramları anlamaya çalışır,
              bazen de yarım anlamış şekilde ilerlemek zorunda kalırdım.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              15 yıl boyunca bu eksikliği hem kendim hissettim hem de ekiplerimi
              yetiştirirken fark ettim. Türkiye'de veri okuryazarlığının önündeki
              en büyük engellerden biri nitelikli, erişilebilir Türkçe içerik yokluğu.
            </p>
            <p>
              Sıfır Gecikme bu boşluğu doldurmak için kuruldu. Her kavramı önce
              interaktif demolarla hissettirip, sonra derinlemesine anlatmayı
              hedefliyorum. Tamamen ücretsiz, tamamen Türkçe.
            </p>
          </div>
        </section>

        <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '40px' }} />

        {/* Deneyim */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
            Deneyim
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deneyimler.map((d) => (
              <div key={d.sirket} className="card" style={{ borderLeft: `4px solid ${d.renk}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div className="font-serif" style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '3px' }}>{d.sirket}</div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-soft)' }}>{d.rol}</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>{d.sure}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '40px' }} />

        {/* Beceriler */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
            Uzmanlık Alanları
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {beceriler.map(({ kategori, liste }) => (
              <div key={kategori} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-accent-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  {kategori}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {liste.map(b => (
                    <div key={b} style={{ fontSize: '14px', color: 'var(--color-text-soft)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '40px' }} />

        {/* Eğitim */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
            Eğitim
          </h2>
          <div className="card" style={{ borderLeft: '4px solid #e8a04a', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div className="font-serif" style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '3px' }}>Atatürk Üniversitesi</div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-soft)' }}>Bilgi Yönetimi</div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>Lisans</div>
          </div>
        </section>

        <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '40px' }} />

        {/* İletişim */}
        <section style={{ marginBottom: '24px' }}>
          <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            İletişim
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: 'mailto:sifirgecikme@gmail.com', label: '✉ sifirgecikme@gmail.com', renk: '#1D9E75' },
              { href: 'https://linkedin.com/in/aliapaydin35', label: 'LinkedIn', renk: '#0077B5' },
              { href: 'https://x.com/sifirgecikme', label: '𝕏 @sifirgecikme', renk: '#000' },
              { href: 'https://github.com/aliapaydin', label: 'GitHub', renk: '#333' },
              { href: 'https://instagram.com/sifirgecikme', label: 'Instagram', renk: '#E4405F' },
            ].map(({ href, label, renk }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  border: '0.5px solid var(--color-border)',
                  background: 'var(--color-cream-card)',
                  color: 'var(--color-text-soft)',
                  fontSize: '13px', textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = renk}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >{label}</a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
