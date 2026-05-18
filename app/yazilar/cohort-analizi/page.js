import CohortMatrix from './CohortMatrix';

export const metadata = {
  title: 'SQL ile Cohort Analizi — Sıfır Gecikme',
  description: 'Retention analizi, cohort matrisi, window fonksiyonlar. SQL ile kullanıcı tutundurma analizi adım adım.',
  keywords: ['cohort analizi', 'sql cohort', 'retention analizi', 'sql window functions', 'veri analizi'],
  openGraph: {
    title: 'SQL ile Cohort Analizi — Sıfır Gecikme',
    description: 'Retention matrisi nasıl kurulur? CTE, window fonksiyonlar ve pivot. Adım adım SQL.',
  },
};

export default function CohortAnalizi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          SQL ile cohort analizi
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2025 · 15 dakika okuma · PostgreSQL / BigQuery uyumlu
        </p>

        <p>
          Ürünün büyüyor — kayıt sayıları her ay artıyor. Ama <em>aynı kullanıcılar</em> geri
          geliyor mu? Retention mı artıyor, yoksa sürekli yeni kullanıcı kazanıp eskiyi
          kaybediyor musun? Bu soruya cevap vermeden büyüme yanıltıcıdır.
        </p>

        <p>
          Cohort analizi tam bu soruyu yanıtlar. Kullanıcıları belirli bir özelliğe göre
          (çoğunlukla <em>kayıt tarihi</em>) gruplara ayırır ve o grupların zaman içindeki
          davranışını takip eder. Ürün kararlarının en kritik girdisi.
        </p>

        <h2>Cohort nedir?</h2>
        <p>
          Cohort, ortak bir deneyimi aynı zaman diliminde yaşayan kullanıcı grubudur.
          En yaygın kullanım: <strong>kayıt ayı cohortu.</strong>
        </p>

        <ul>
          <li>Ocak 2024&apos;te kayıt olan 412 kullanıcı → Ocak cohortu</li>
          <li>Şubat 2024&apos;te kayıt olan 389 kullanıcı → Şubat cohortu</li>
          <li>Her cohort için: 1. ayda kaçı aktif? 2. ayda? 3. ayda?</li>
        </ul>

        <p>
          Bu analizi bir matris olarak gördüğünde — satırlar cohortlar, sütunlar aylar,
          hücreler retention oranları — güçlü bir hikâye ortaya çıkar.
        </p>

        <CohortMatrix />

        <p>
          Yukarıdaki tabloya bak. Ocak cohortunun Ay 1 retention&apos;ı %42 iken
          Mayıs cohortunda bu oran %48&apos;e çıkmış — ürün 5 ayda daha iyi tutunmaya başlamış.
          Bu trendi toplu metriklerden okumak imkânsızdır.
        </p>

        <h2>Senaryo: e-ticaret şirketi</h2>
        <p>
          İki tablo üzerinden gideceğiz. Gerçek dünyada bunlar CRM, analitik veya
          uygulama veritabanında bulunur.
        </p>

        <pre>{`-- Kullanıcı tablosu
CREATE TABLE kullanicilar (
  id           BIGINT PRIMARY KEY,
  kayit_tarihi DATE NOT NULL
);

-- Sipariş tablosu
CREATE TABLE siparisler (
  id              BIGINT PRIMARY KEY,
  kullanici_id    BIGINT REFERENCES kullanicilar(id),
  siparis_tarihi  DATE NOT NULL,
  tutar           DECIMAL(10,2)
);`}</pre>

        <h2>Adım 1: Her kullanıcının cohort ayını bul</h2>
        <p>
          Cohort ayı = kullanıcının ilk sipariş tarihi (veya kayıt tarihi).
          İlk sipariş tarihini kullanmak genellikle daha anlamlıdır — kayıt edip
          hiç alışveriş yapmayan kullanıcıları cohorta dahil etmez.
        </p>

        <pre>{`WITH ilk_sip AS (
  SELECT
    kullanici_id,
    MIN(siparis_tarihi)                        AS ilk_siparis,
    DATE_TRUNC('month', MIN(siparis_tarihi))   AS cohort_ayi
  FROM siparisler
  GROUP BY kullanici_id
)
SELECT * FROM ilk_sip LIMIT 5;

-- Sonuç:
-- kullanici_id | ilk_siparis | cohort_ayi
-- 1001         | 2024-01-05  | 2024-01-01
-- 1002         | 2024-01-12  | 2024-01-01
-- 1003         | 2024-02-03  | 2024-02-01`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            <code>DATE_TRUNC(&apos;month&apos;, tarih)</code> tarihi o ayın ilk gününe yuvarlar.
            2024-01-15 → 2024-01-01. Bu sayede tüm Ocak kullanıcıları aynı cohort değerini alır.
            BigQuery&apos;de <code>DATE_TRUNC(tarih, MONTH)</code> sözdizimi kullanılır.
          </p>
        </blockquote>

        <h2>Adım 2: Her sipariş için period numarasını hesapla</h2>
        <p>
          Period = siparişin gerçekleştiği ay ile cohort ayı arasındaki fark (ay cinsinden).
          0. period = ilk sipariş ayı, 1. period = bir sonraki ay, vb.
        </p>

        <pre>{`WITH ilk_sip AS (
  SELECT
    kullanici_id,
    DATE_TRUNC('month', MIN(siparis_tarihi)) AS cohort_ayi
  FROM siparisler
  GROUP BY kullanici_id
),
siparis_cohort AS (
  SELECT
    s.kullanici_id,
    i.cohort_ayi,
    DATE_TRUNC('month', s.siparis_tarihi)   AS siparis_ayi,
    -- Ay farkı = period numarası
    (
      EXTRACT(YEAR  FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi)) * 12 +
      EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi))
    )::INT AS period
  FROM siparisler s
  JOIN ilk_sip i ON s.kullanici_id = i.kullanici_id
)
SELECT * FROM siparis_cohort LIMIT 5;

-- Sonuç:
-- kullanici_id | cohort_ayi | siparis_ayi | period
-- 1001         | 2024-01-01 | 2024-01-01  | 0
-- 1001         | 2024-01-01 | 2024-02-01  | 1
-- 1001         | 2024-01-01 | 2024-04-01  | 3`}</pre>

        <h2>Adım 3: Cohort boyutunu hesapla</h2>
        <p>
          Her cohorttaki benzersiz kullanıcı sayısı — retention oranlarının paydası.
        </p>

        <pre>{`WITH ilk_sip AS (
  SELECT
    kullanici_id,
    DATE_TRUNC('month', MIN(siparis_tarihi)) AS cohort_ayi
  FROM siparisler
  GROUP BY kullanici_id
)
SELECT
  cohort_ayi,
  COUNT(DISTINCT kullanici_id) AS boyut
FROM ilk_sip
GROUP BY cohort_ayi
ORDER BY cohort_ayi;

-- Sonuç:
-- cohort_ayi  | boyut
-- 2024-01-01  | 412
-- 2024-02-01  | 389
-- 2024-03-01  | 451`}</pre>

        <h2>Adım 4: Retention matrisi</h2>
        <p>
          Her cohort × period kombinasyonunda kaç benzersiz kullanıcı sipariş vermiş?
          Cohort boyutuyla bölerek oran elde ediyoruz.
        </p>

        <pre>{`WITH ilk_sip AS (
  SELECT
    kullanici_id,
    DATE_TRUNC('month', MIN(siparis_tarihi)) AS cohort_ayi
  FROM siparisler
  GROUP BY kullanici_id
),
siparis_periodlar AS (
  SELECT
    s.kullanici_id,
    i.cohort_ayi,
    (
      EXTRACT(YEAR  FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi)) * 12 +
      EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi))
    )::INT AS period
  FROM siparisler s
  JOIN ilk_sip i ON s.kullanici_id = i.kullanici_id
),
cohort_boyutlari AS (
  SELECT cohort_ayi, COUNT(DISTINCT kullanici_id) AS boyut
  FROM ilk_sip
  GROUP BY cohort_ayi
),
periyodik_aktif AS (
  SELECT cohort_ayi, period, COUNT(DISTINCT kullanici_id) AS aktif
  FROM siparis_periodlar
  GROUP BY cohort_ayi, period
)
SELECT
  pa.cohort_ayi,
  cb.boyut,
  pa.period,
  pa.aktif,
  ROUND(pa.aktif * 100.0 / cb.boyut, 1) AS retention_yuzde
FROM periyodik_aktif pa
JOIN cohort_boyutlari cb ON pa.cohort_ayi = cb.cohort_ayi
ORDER BY pa.cohort_ayi, pa.period;

-- Sonuç:
-- cohort_ayi  | boyut | period | aktif | retention_yuzde
-- 2024-01-01  | 412   | 0      | 412   | 100.0
-- 2024-01-01  | 412   | 1      | 173   | 42.0
-- 2024-01-01  | 412   | 2      | 128   | 31.1`}</pre>

        <h2>Adım 5: Pivot — matris görünümü</h2>
        <p>
          Uzun formattaki veriyi satırlar = cohort, sütunlar = period olan
          matrise çevirmek. Analiz araçlarında (Metabase, Looker) pivot table ile
          yapılır; SQL&apos;de CASE WHEN ile elle yazılır.
        </p>

        <pre>{`-- Önceki CTE'ler aynı, son SELECT değişiyor:
SELECT
  cohort_ayi,
  boyut,
  MAX(CASE WHEN period = 0 THEN retention_yuzde END) AS ay_0,
  MAX(CASE WHEN period = 1 THEN retention_yuzde END) AS ay_1,
  MAX(CASE WHEN period = 2 THEN retention_yuzde END) AS ay_2,
  MAX(CASE WHEN period = 3 THEN retention_yuzde END) AS ay_3,
  MAX(CASE WHEN period = 4 THEN retention_yuzde END) AS ay_4,
  MAX(CASE WHEN period = 5 THEN retention_yuzde END) AS ay_5,
  MAX(CASE WHEN period = 6 THEN retention_yuzde END) AS ay_6
FROM retention_sonuc   -- önceki CTE adı
GROUP BY cohort_ayi, boyut
ORDER BY cohort_ayi;`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            BigQuery&apos;de <code>PIVOT</code> operatörü bu işi otomatik yapar.
            Snowflake&apos;de de benzer sözdizimi var. Ama CASE WHEN her motorda çalışır.
          </p>
        </blockquote>

        <h2>Bonus: Revenue cohort</h2>
        <p>
          Kullanıcı sayısı yerine <em>gelir</em> üzerinden cohort — hangi cohort
          daha değerli müşteri getirmiş?
        </p>

        <pre>{`WITH ilk_sip AS (
  SELECT
    kullanici_id,
    DATE_TRUNC('month', MIN(siparis_tarihi)) AS cohort_ayi
  FROM siparisler
  GROUP BY kullanici_id
)
SELECT
  i.cohort_ayi,
  (
    EXTRACT(YEAR  FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi)) * 12 +
    EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', s.siparis_tarihi), i.cohort_ayi))
  )::INT                                           AS period,
  COUNT(DISTINCT s.kullanici_id)                   AS aktif_kullanici,
  ROUND(SUM(s.tutar), 0)                           AS toplam_gelir,
  ROUND(SUM(s.tutar) / COUNT(DISTINCT s.kullanici_id), 2) AS kullanici_basi_gelir
FROM siparisler s
JOIN ilk_sip i ON s.kullanici_id = i.kullanici_id
GROUP BY i.cohort_ayi, period
ORDER BY i.cohort_ayi, period;`}</pre>

        <h2>Sonuçları nasıl yorumlarsın?</h2>
        <ul>
          <li>
            <strong>Diagonal pattern:</strong> Matrisin köşegeni boyunca aşağı indiğinde
            oranlar artıyorsa ürün zamanla daha iyi tutunuyor. Azalıyorsa sorun var.
          </li>
          <li>
            <strong>Ay 1 retention:</strong> En kritik metrik. %20&apos;nin altındaysa
            onboarding deneyiminde ciddi bir sorun vardır.
          </li>
          <li>
            <strong>Plateau:</strong> Retention belirli bir aydan sonra dengeleniyorsa
            (örn. %15&apos;te stabilize) bu senin &quot;gerçek&quot; kullanıcı tabanın.
            Bu oranı artırmak ürünün öncelik #1&apos;i olmalı.
          </li>
          <li>
            <strong>Cohortlar arası karşılaştırma:</strong> Bir özellik Mart&apos;ta
            yayınlandıysa Mart cohortunun Ay 1 retention&apos;ı Şubat&apos;tan yüksek mi?
            A/B test olmaksızın impact ölçmenin en hızlı yöntemi.
          </li>
        </ul>

        <h2>Pratik notlar</h2>
        <ul>
          <li>
            <strong>Cohort tanımını ürüne göre seç.</strong> SaaS&apos;ta trial başlangıcı,
            mobil uygulamada ilk açılış, e-ticarette ilk sipariş — hangisi daha anlamlı?
          </li>
          <li>
            <strong>Period birimi değişebilir.</strong> Günlük aktif uygulama için
            haftalık period, e-ticaret için aylık period daha okunabilir olur.
          </li>
          <li>
            <strong>Cohort boyutu küçükse dikkat.</strong> 20 kişilik cohorttaki
            %50 retention 10 kişi demek — istatistiksel olarak güvenilmez.
          </li>
          <li>
            <strong>Rolling window vs. takvim ayı.</strong> Kayıt tarihinden itibaren
            30/60/90 gün mü, takvim ayı mı? Rolling window daha adil ama
            hesaplaması daha karmaşık.
          </li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Cohort analizi veri analistinin temel araçlarından biri.
          SQL&apos;e hâkimsen aynı mantığı Pandas&apos;ta da uygulayabilirsin —
          <strong> <code>groupby + transform(min)</code></strong> kombinasyonu
          aynı sonucu verir.
        </p>
      </article>
    </main>
  );
}
