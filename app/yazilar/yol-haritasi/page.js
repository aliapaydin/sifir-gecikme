'use client';

import { useState } from 'react';

const ADIMLAR = [
  {
    no: 1, seviye: 'baslangic', renk: '#1D9E75', bg: '#E1F5EE', renk_text: '#0F6E56',
    baslik: 'Python temelleri',
    sure: '1-2 ay',
    aciklama: 'Her şeyin başlangıcı. Veri tiplerini, döngüleri ve fonksiyonları öğrenmek yeterli. Mükemmel olmana gerek yok.',
    konular: [
      { ad: 'Değişkenler & listeler', detay: '1-2 hafta' },
      { ad: 'Döngüler & fonksiyonlar', detay: '1-2 hafta' },
      { ad: 'Sözlükler & dosya okuma', detay: '1 hafta' },
    ],
    ipucu: 'İlk hafta her gün 30 dakika yeterli. Mükemmel olmaya çalışma, ilerle.',
    kaynaklar: ['sifirgecikme.com/ogren', 'cs50p.harvard.edu (ücretsiz)'],
    site_link: '/ogren/python-temelleri',
  },
  {
    no: 2, seviye: 'baslangic', renk: '#1D9E75', bg: '#E1F5EE', renk_text: '#0F6E56',
    baslik: 'NumPy & Pandas',
    sure: '2-3 hafta',
    aciklama: 'Veri analizinin iki temel kütüphanesi. Tablo okumak, filtrelemek, gruplamak — günlük işlerin %80\'i bunlar.',
    konular: [
      { ad: 'NumPy array işlemleri', detay: '1 hafta' },
      { ad: 'DataFrame & filtreleme', detay: '1 hafta' },
      { ad: 'groupby & pivot', detay: '1 hafta' },
    ],
    ipucu: 'Gerçek bir CSV dosyası bul ve onunla çalış. Yapay veriyle öğrenmek daha az etkili.',
    kaynaklar: ['sifirgecikme.com/ogren/pandas', 'sifirgecikme.com/yazilar/pandas-7-sey'],
    site_link: '/ogren/pandas',
  },
  {
    no: 3, seviye: 'baslangic', renk: '#7F77DD', bg: '#EEEDFE', renk_text: '#534AB7',
    baslik: 'SQL öğren',
    sure: '3-4 hafta',
    aciklama: 'İş ilanlarında en çok aranan beceri. SELECT, JOIN, GROUP BY, window fonksiyonlar — bunları bilmek seni çok öne geçirir.',
    konular: [
      { ad: 'SELECT & WHERE', detay: '1 hafta' },
      { ad: 'JOIN türleri', detay: '1 hafta' },
      { ad: 'GROUP BY & aggregation', detay: '1 hafta' },
      { ad: 'Window fonksiyonlar', detay: '1 hafta' },
    ],
    ipucu: 'SQLiteOnline.com ile kurulum yapmadan başlayabilirsin. Gerçek veriyle sorgu yaz.',
    kaynaklar: ['sifirgecikme.com/yazilar/sql-temelleri', 'mode.com/sql-tutorial'],
    site_link: '/yazilar/sql-temelleri',
  },
  {
    no: 4, seviye: 'baslangic', renk: '#e8a04a', bg: '#FAEEDA', renk_text: '#854F0B',
    baslik: 'Görselleştirme',
    sure: '2-3 hafta',
    aciklama: 'Veriyi görmek anlamakla eşdeğerdir. Matplotlib ve Seaborn ile başla, sonra BI araçlarına geç.',
    konular: [
      { ad: 'Matplotlib temelleri', detay: '1 hafta' },
      { ad: 'Seaborn ile istatistik grafikleri', detay: '1 hafta' },
      { ad: 'Hangi grafik ne zaman?', detay: '3-4 gün' },
    ],
    ipucu: 'Her grafik tipi için "bu veriyi neden bu grafikle gösteriyorum?" sorusunu sor.',
    kaynaklar: ['sifirgecikme.com/ogren/matplotlib-temelleri', 'sifirgecikme.com/python'],
    site_link: '/ogren/matplotlib-temelleri',
  },
  {
    no: 5, seviye: 'orta', renk: '#1D9E75', bg: '#E1F5EE', renk_text: '#0F6E56',
    baslik: 'İstatistik temelleri',
    sure: '3-4 hafta',
    aciklama: 'Veri analistinin istatistik olmadan işi yarım kalır. Hipotez testleri, güven aralıkları ve A/B testler.',
    konular: [
      { ad: 'Olasılık & dağılımlar', detay: '1 hafta' },
      { ad: 'Hipotez testi (t-test, chi-sq)', detay: '1 hafta' },
      { ad: 'A/B test tasarımı', detay: '2 hafta' },
    ],
    ipucu: 'p-değeri ezberlemek yerine ne anlama geldiğini anlamaya çalış. Sezgi formülden önce gelir.',
    kaynaklar: ['sifirgecikme.com/yazilar/ab-test', 'sifirgecikme.com/yazilar/bias-variance'],
    site_link: '/yazilar/ab-test',
  },
  {
    no: 6, seviye: 'orta', renk: '#7F77DD', bg: '#EEEDFE', renk_text: '#534AB7',
    baslik: 'BI araçları',
    sure: '1-2 ay',
    aciklama: 'Power BI veya Tableau\'yu iyice öğren. Türkiye\'deki iş ilanlarının %70\'i Power BI istiyor.',
    konular: [
      { ad: 'Power BI: veri modelleme', detay: '2-3 hafta' },
      { ad: 'DAX formülleri', detay: '2 hafta' },
      { ad: 'Dashboard tasarımı', detay: '2 hafta' },
    ],
    ipucu: 'Microsoft Learn\'deki resmi Power BI kursunu bitir — sertifikası da var, ücretsiz.',
    kaynaklar: ['sifirgecikme.com/yazilar/bi-karsilastirma', 'learn.microsoft.com/power-bi'],
    site_link: '/yazilar/bi-karsilastirma',
  },
  {
    no: 7, seviye: 'orta', renk: '#e8a04a', bg: '#FAEEDA', renk_text: '#854F0B',
    baslik: 'İlk proje & portföy',
    sure: '1-2 ay',
    aciklama: 'Öğrendiklerini gerçek veriye uygula. Kaggle, açık veri kaynakları veya kendi şehrinle ilgili bir analiz yap.',
    konular: [
      { ad: 'Kaggle\'da veri bul', detay: '1 hafta' },
      { ad: 'EDA & temizleme', detay: '2 hafta' },
      { ad: 'GitHub\'a yükle', detay: '1 hafta' },
      { ad: 'LinkedIn\'de paylaş', detay: 'Birkaç gün' },
    ],
    ipucu: 'Kendi şehrini veya tuttuğun takımı konu al. Kişisel ilgi projeyi tamamlamana yardım eder.',
    kaynaklar: ['kaggle.com', 'sifirgecikme.com/yazilar/veri-temizleme'],
    site_link: '/yazilar/veri-temizleme',
  },
  {
    no: 8, seviye: 'ileri', renk: '#E24B4A', bg: '#FCEBEB', renk_text: '#A32D2D',
    baslik: 'ML temelleri',
    sure: '2-3 ay',
    aciklama: 'Makine öğrenmesi artık her analistten bekleniyor. Regression, classification ve clustering başlangıç için yeterli.',
    konular: [
      { ad: 'Linear & logistic regression', detay: '2 hafta' },
      { ad: 'Decision tree & Random Forest', detay: '2 hafta' },
      { ad: 'K-Means clustering', detay: '1 hafta' },
      { ad: 'Model değerlendirme metrikleri', detay: '1 hafta' },
    ],
    ipucu: 'sklearn kütüphanesini 3 satırla model kurabilirsin. Önce nasıl çalıştığını anla, sonra kodu yaz.',
    kaynaklar: ['sifirgecikme.com/yazilar/linear-regression', 'sifirgecikme.com/yazilar/kmeans'],
    site_link: '/yazilar/linear-regression',
  },
  {
    no: 9, seviye: 'ileri', renk: '#7F77DD', bg: '#EEEDFE', renk_text: '#534AB7',
    baslik: 'Veri mühendisliği giriş',
    sure: '1-2 ay',
    aciklama: 'Veri nereye gidiyor? ETL pipeline\'lar, veri ambarları ve dbt. Büyük şirketlerde çok aranan beceri.',
    konular: [
      { ad: 'ETL kavramları', detay: '1 hafta' },
      { ad: 'SQL veri ambarı tasarımı', detay: '2 hafta' },
      { ad: 'dbt temelleri', detay: '2-3 hafta' },
    ],
    ipucu: 'dbt\'yi ücretsiz dbt Cloud ile dene. 1 saatte canlı bir pipeline kurabilirsin.',
    kaynaklar: ['getdbt.com/learn', 'sifirgecikme.com/yazilar/veri-temizleme'],
    site_link: '/yazilar/veri-temizleme',
  },
  {
    no: 10, seviye: 'ileri', renk: '#1D9E75', bg: '#E1F5EE', renk_text: '#0F6E56',
    baslik: 'İş başvurusu & kariyer',
    sure: 'Süregelen',
    aciklama: 'Portföyünü hazırla, LinkedIn\'ini güçlendir, networkini oluştur. İlk iş en zoruyken sonrası gelir.',
    konular: [
      { ad: 'CV & LinkedIn optimizasyonu', detay: '1 hafta' },
      { ad: 'Teknik mülakat hazırlığı', detay: 'Süregelen' },
      { ad: 'Network oluşturma', detay: 'Süregelen' },
    ],
    ipucu: 'LinkedIn\'de "veri analisti" pozisyonuna başvurmadan önce 3 proje paylaş. İşe alımcılar profile bakıyor.',
    kaynaklar: ['sifirgecikme.com/yazilar/rol-farklari', 'sifirgecikme.com/yazilar/ilk-90-gun'],
    site_link: '/yazilar/rol-farklari',
  },
];

const SEVIYE_LABELS = { baslangic: 'Başlangıç', orta: 'Orta', ileri: 'İleri' };
const PROG_LABELS = ['Python öğreniyorsun', 'Pandas & NumPy zamanı', 'SQL sırası geldi', 'Görselleştirme aşaması', 'İstatistik temelleri', 'BI araçlarına geçiş', 'İlk proje yapıyorsun', 'ML dünyasına adım', 'Veri mühendisliği', 'Kariyer hazırlığı'];

const ISTATISTIKLER = [
  { val: '₺45-120K', label: 'Yıllık maaş aralığı', renk: '#1D9E75', aciklama: 'Junior-Senior arası Türkiye ortalaması' },
  { val: '%340', label: 'İş ilanı artışı', renk: '#7F77DD', aciklama: 'Son 5 yılda veri pozisyonlarındaki büyüme' },
  { val: '6-12 ay', label: 'Öğrenme süresi', renk: '#e8a04a', aciklama: 'Günde 1-2 saat çalışmayla ilk işe hazır süre' },
  { val: '#4', label: 'LinkedIn sıralaması', renk: '#E24B4A', aciklama: 'En çok aranan iş pozisyonları arasında' },
];

const TUYO_LISTESI = [
  { baslik: 'Sertifika değil portföy', ikon: '💼', aciklama: 'İşe alımcılar sertifika sormaz, "ne yaptın?" sorar. GitHub\'daki 3 proje her sertifikadan değerlidir.' },
  { baslik: 'Excel\'i küçümseme', ikon: '📊', aciklama: 'Türkiye\'deki şirketlerin %60\'ı hâlâ Excel kullanıyor. Excel\'i iyi bilen analist her ortamda değer yaratır.' },
  { baslik: 'SQL her şeyden önce', ikon: '🗄️', aciklama: 'Python bilmesen de SQL bilen analist iş bulur. SQL\'i atlamak en büyük hatalardan biri.' },
  { baslik: 'Alan bilgisi kazandırır', ikon: '🎯', aciklama: 'Finans, e-ticaret, sağlık — bir sektörü derinlemesine anlamak teknik becerilerini katlar.' },
];

export default function YolHaritasi() {
  const [aktifAdim, setAktifAdim] = useState(null);
  const [filtre, setFiltre] = useState('hepsi');

  const liste = filtre === 'hepsi' ? ADIMLAR : ADIMLAR.filter(a => a.seviye === filtre);
  const progYuzde = aktifAdim ? Math.round((aktifAdim / ADIMLAR.length) * 100) : 0;

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti olma yol haritası
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.75', color: 'var(--color-text-soft)', marginBottom: '2.5rem' }}>
          15 yıllık deneyimden derlendi. Hangi araçları, hangi sırayla, ne kadar sürede öğreneceğini adım adım anlattım.
        </p>

        {/* İstatistikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '3rem' }}>
          {ISTATISTIKLER.map(({ val, label, renk, aciklama }) => (
            <div key={label} title={aciklama} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px', cursor: 'help' }}>
              <div style={{ fontSize: '20px', fontWeight: 500, color: renk, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              {aktifAdim ? PROG_LABELS[aktifAdim - 1] : 'Adıma tıkla, detayları gör'}
            </span>
            {progYuzde > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>%{progYuzde}</span>
            )}
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progYuzde}%`, background: '#1D9E75', borderRadius: '999px', transition: 'width .4s' }} />
          </div>
        </div>

        {/* Filtre */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {[['hepsi', 'Tüm yol'], ['baslangic', 'Başlangıç (1-4)'], ['orta', 'Orta (5-7)'], ['ileri', 'İleri (8-10)']].map(([key, label]) => (
            <button key={key} onClick={() => setFiltre(key)} style={{
              fontSize: '12px', padding: '4px 14px', borderRadius: '999px',
              border: '0.5px solid var(--color-border)',
              background: filtre === key ? 'var(--color-text)' : 'var(--color-cream-card)',
              color: filtre === key ? 'var(--color-cream-card)' : 'var(--color-text-soft)',
              cursor: 'pointer', transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Adımlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '3rem' }}>
          {liste.map(adim => {
            const acik = aktifAdim === adim.no;
            return (
              <div key={adim.no} onClick={() => setAktifAdim(acik ? null : adim.no)} style={{
                border: `0.5px solid ${acik ? adim.renk : 'var(--color-border)'}`,
                borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
                background: acik ? adim.bg + '22' : 'var(--color-cream-card)',
                transition: 'all .15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: adim.bg, color: adim.renk_text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500, flexShrink: 0 }}>
                    {adim.no}
                  </div>
                  <div style={{ flex: 1, fontWeight: 500, fontSize: '15px', color: 'var(--color-text)' }}>{adim.baslik}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: adim.bg, color: adim.renk_text }}>
                      {SEVIYE_LABELS[adim.seviye]}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{adim.sure}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{acik ? '▲' : '▼'}</span>
                  </div>
                </div>

                {acik && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '0.5px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: '1.65', marginBottom: '12px' }}>
                      {adim.aciklama}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px', marginBottom: '12px' }}>
                      {adim.konular.map(k => (
                        <div key={k.ad} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '2px' }}>{k.ad}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{k.detay}</div>
                        </div>
                      ))}
                    </div>

                    {/* İpucu */}
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: adim.bg, marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>💡</span>
                      <span style={{ fontSize: '13px', color: adim.renk_text, lineHeight: 1.55 }}>{adim.ipucu}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Kaynaklar:</span>
                        {adim.kaynaklar.map(k => (
                          <span key={k} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>{k}</span>
                        ))}
                      </div>
                      <a href={adim.site_link} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500, color: adim.renk_text, textDecoration: 'none' }}>
                        Sıfır Gecikme&apos;de öğren →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tüyolar */}
        <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          15 yılın tüyoları
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '3rem' }}>
          {TUYO_LISTESI.map(({ baslik, ikon, aciklama }) => (
            <div key={baslik} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{ikon}</div>
              <div className="font-serif" style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '6px' }}>{baslik}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.6' }}>{aciklama}</div>
            </div>
          ))}
        </div>

        {/* Kariyer adımları */}
        <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          Türkiye&apos;de veri kariyeri
        </h2>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            2024 itibarıyla Türkiye&apos;de veri analisti maaşları Junior için aylık 25-45K TL,
            Senior için 60-100K TL bandında seyrediyor. Yabancı şirketlerde uzaktan çalışıyorsan bu rakamlar 2-3 kat artıyor.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            En çok talep gören sektörler: e-ticaret, fintech, bankacılık ve telekomünikasyon.
            Bu sektörlerin birinde domain bilgisi edinmek maaşını ciddi etkiliyor.
          </p>
          <p>
            Kariyer yolları hakkında daha fazlası için{' '}
            <a href="/yazilar/rol-farklari" style={{ color: '#1D9E75', textDecoration: 'none' }}>veri rollerinin farkları</a>{' '}
            ve{' '}
            <a href="/yazilar/ilk-90-gun" style={{ color: '#1D9E75', textDecoration: 'none' }}>ilk 90 gün rehberini</a>{' '}
            oku.
          </p>
        </div>

        {/* CTA */}
        <div className="card" style={{ padding: '24px', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
          <div className="font-serif" style={{ fontSize: '20px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
            Hemen başla
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
            Sıfır Gecikme&apos;deki öğrenme modülü tam da bu yol haritasını takip ediyor.
          </p>
          <a href="/ogren" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 24px', borderRadius: '10px', border: 'none',
            background: '#1D9E75', color: '#fff',
            fontSize: '14px', fontWeight: 500, textDecoration: 'none',
          }}>
            Öğrenme modülüne git →
          </a>
        </div>
      </article>
    </main>
  );
}
