export const metadata = {
  title: 'SQL Temelleri: Veri Analistinin En Önemli Becerisi',
  description: 'SELECT, JOIN, GROUP BY, window fonksiyonlar — sıfırdan ileri seviyeye SQL rehberi. Türkçe, ücretsiz.',
  keywords: ['sql türkçe', 'sql öğren', 'sql temelleri', 'veri analizi sql'],
  openGraph: {
    title: 'SQL Temelleri — Sıfır Gecikme',
    description: 'SELECT, JOIN, GROUP BY, window fonksiyonlar. Türkçe SQL rehberi.',
  },
};

export default function SQLTemelleri() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          SQL temelleri: veri analistinin en önemli becerisi
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · 20 dakika okuma · PostgreSQL / MySQL / BigQuery uyumlu
        </p>

        <p>
          Python öğrenmeden önce, makine öğrenmesine girmeden önce, dashboard kurmadan önce:
          SQL. Her veri analistinin ilk öğrenmesi gereken, son bırakacağı beceri.
          15 yıldır her gün kullanıyorum. Hâlâ vazgeçilmez.
        </p>

        <p>
          Bu rehberde sıfırdan başlıyoruz. Ama sadece sözdizimi değil —
          <em>neden böyle çalıştığını</em> da anlatıyorum. Çünkü SQL&apos;i anlayan
          analist, sadece bilen analistten çok daha hızlı büyür.
        </p>

        <h2>SQL nedir, neden önemli?</h2>
        <p>
          SQL (Structured Query Language) ilişkisel veritabanlarıyla konuşmanın dili.
          Şirketlerin %90&apos;ından fazlası verilerini bir veritabanında tutuyor.
          O veriye ulaşmak için SQL bilmek zorundasın.
        </p>

        <p>
          Python her şeyi yapabilir, ama milyonlarca satırı bellekte işlemek yerine
          veritabanında sorgulamak hem hızlı hem de doğru yaklaşım. İyi bir SQL sorgusu,
          saatler sürecek Python kodunun işini saniyede bitirir.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            SQL bilmek iş ilanlarında en çok aranan beceri. Veri analisti, data scientist,
            backend geliştirici, product manager — hepsinde SQL isteniyor.
          </p>
        </blockquote>

        <h2>1. Temel SELECT: veri çekmek</h2>
        <p>
          Her şey SELECT ile başlar. Tablodan veri çekmek için kullanılır.
        </p>

        <pre>{`-- Tüm sütunları çek
SELECT * FROM musteriler;

-- Sadece belirli sütunları çek
SELECT ad, soyad, email FROM musteriler;

-- Sütuna alias (takma ad) ver
SELECT
  ad AS isim,
  soyad AS soyisim,
  email AS eposta
FROM musteriler;

-- Hesaplama yap
SELECT
  urun_adi,
  fiyat,
  fiyat * 1.18 AS kdvli_fiyat
FROM urunler;`}</pre>

        <h2>2. WHERE: filtreleme</h2>
        <p>
          WHERE ile hangi satırları istediğini belirtirsin. SQL&apos;in en sık kullandığın parçası.
        </p>

        <pre>{`-- Basit eşitlik
SELECT * FROM musteriler WHERE sehir = 'İzmir';

-- Sayısal karşılaştırma
SELECT * FROM siparisler WHERE toplam > 500;

-- Birden fazla koşul
SELECT * FROM musteriler
WHERE sehir = 'İzmir' AND yas > 25;

-- OR kullanımı
SELECT * FROM musteriler
WHERE sehir = 'İzmir' OR sehir = 'İstanbul';

-- IN ile çoklu değer
SELECT * FROM musteriler
WHERE sehir IN ('İzmir', 'İstanbul', 'Ankara');

-- BETWEEN ile aralık
SELECT * FROM siparisler
WHERE siparis_tarihi BETWEEN '2024-01-01' AND '2024-12-31';

-- LIKE ile metin arama
SELECT * FROM musteriler WHERE email LIKE '%@gmail.com';
SELECT * FROM urunler WHERE urun_adi LIKE 'iPhone%';

-- NULL kontrolü
SELECT * FROM musteriler WHERE telefon IS NULL;
SELECT * FROM musteriler WHERE telefon IS NOT NULL;`}</pre>

        <h2>3. ORDER BY ve LIMIT: sıralama ve kısıtlama</h2>

        <pre>{`-- Büyükten küçüğe sırala
SELECT * FROM siparisler
ORDER BY toplam DESC;

-- Küçükten büyüğe
SELECT * FROM urunler
ORDER BY fiyat ASC;

-- Birden fazla sütuna göre sırala
SELECT * FROM musteriler
ORDER BY sehir ASC, soyad ASC;

-- İlk 10 satırı getir
SELECT * FROM siparisler
ORDER BY siparis_tarihi DESC
LIMIT 10;

-- En pahalı 5 ürün
SELECT urun_adi, fiyat
FROM urunler
ORDER BY fiyat DESC
LIMIT 5;`}</pre>

        <h2>4. GROUP BY ve aggregate fonksiyonlar</h2>
        <p>
          Veri analistinin günlük ekmeği. Gruplama ve özet hesaplama olmadan
          anlamlı analiz yapılamaz.
        </p>

        <pre>{`-- Temel aggregate fonksiyonlar
SELECT
  COUNT(*)           AS toplam_musteri,
  COUNT(telefon)     AS telefonlu_musteri,  -- NULL'ları saymaz
  AVG(yas)           AS ortalama_yas,
  MIN(yas)           AS en_genc,
  MAX(yas)           AS en_yasli,
  SUM(toplam)        AS toplam_ciro
FROM musteriler;

-- Şehre göre grupla
SELECT
  sehir,
  COUNT(*)      AS musteri_sayisi,
  AVG(yas)      AS ort_yas
FROM musteriler
GROUP BY sehir
ORDER BY musteri_sayisi DESC;

-- Ürün kategorisine göre özet
SELECT
  kategori,
  COUNT(*)          AS urun_sayisi,
  AVG(fiyat)        AS ort_fiyat,
  SUM(stok_adedi)   AS toplam_stok
FROM urunler
GROUP BY kategori
ORDER BY ort_fiyat DESC;`}</pre>

        <h2>5. HAVING: gruplama sonrası filtreleme</h2>
        <p>
          WHERE satırları filtreler, HAVING ise GROUP BY sonrası grupları filtreler.
          Karıştırmak çok yaygın bir hata.
        </p>

        <pre>{`-- En az 10 müşterisi olan şehirler
SELECT
  sehir,
  COUNT(*) AS musteri_sayisi
FROM musteriler
GROUP BY sehir
HAVING COUNT(*) >= 10
ORDER BY musteri_sayisi DESC;

-- Ortalama sipariş tutarı 200 TL'den yüksek müşteriler
SELECT
  musteri_id,
  COUNT(*)      AS siparis_sayisi,
  AVG(toplam)   AS ort_siparis
FROM siparisler
GROUP BY musteri_id
HAVING AVG(toplam) > 200
ORDER BY ort_siparis DESC;

-- WHERE ve HAVING birlikte
SELECT
  sehir,
  COUNT(*) AS musteri_sayisi
FROM musteriler
WHERE yas > 18          -- önce satırları filtrele
GROUP BY sehir
HAVING COUNT(*) >= 5    -- sonra grupları filtrele
ORDER BY musteri_sayisi DESC;`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            SQL çalışma sırası: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
            Bu sırayı bilmek hataları önler. SELECT&apos;te tanımladığın alias&apos;ı WHERE&apos;de kullanamazsın
            çünkü WHERE, SELECT&apos;ten önce çalışır.
          </p>
        </blockquote>

        <h2>6. JOIN: tabloları birleştirme</h2>
        <p>
          İlişkisel veritabanlarının özü. Gerçek dünya verisi her zaman birden
          fazla tabloya dağılmıştır.
        </p>

        <pre>{`-- INNER JOIN: her iki tabloda da eşleşen kayıtlar
SELECT
  m.ad,
  m.soyad,
  s.siparis_tarihi,
  s.toplam
FROM musteriler m
INNER JOIN siparisler s ON m.id = s.musteri_id;

-- LEFT JOIN: sol tablonun tüm kayıtları + eşleşenler
-- Hiç sipariş vermemiş müşterileri de gösterir
SELECT
  m.ad,
  m.soyad,
  COUNT(s.id) AS siparis_sayisi
FROM musteriler m
LEFT JOIN siparisler s ON m.id = s.musteri_id
GROUP BY m.id, m.ad, m.soyad
ORDER BY siparis_sayisi DESC;

-- Üç tabloyu birleştirme
SELECT
  m.ad AS musteri,
  u.urun_adi,
  sd.adet,
  sd.birim_fiyat
FROM musteriler m
INNER JOIN siparisler s   ON m.id = s.musteri_id
INNER JOIN siparis_detay sd ON s.id = sd.siparis_id
INNER JOIN urunler u      ON sd.urun_id = u.id
WHERE s.siparis_tarihi >= '2024-01-01';`}</pre>

        <h2>7. Subquery ve CTE: karmaşık sorgular</h2>
        <p>
          Gerçek analizlerde tek sorguda iş bitmez. Subquery ve CTE (Common Table Expression)
          ile sorguları parçalara böleriz.
        </p>

        <pre>{`-- Subquery: ortalama üzerindeki siparişler
SELECT *
FROM siparisler
WHERE toplam > (SELECT AVG(toplam) FROM siparisler);

-- CTE ile okunabilir sorgu (WITH ifadesi)
WITH aylik_ciro AS (
  SELECT
    DATE_TRUNC('month', siparis_tarihi) AS ay,
    SUM(toplam)                          AS ciro
  FROM siparisler
  WHERE siparis_tarihi >= '2024-01-01'
  GROUP BY DATE_TRUNC('month', siparis_tarihi)
),
buyume AS (
  SELECT
    ay,
    ciro,
    LAG(ciro) OVER (ORDER BY ay) AS onceki_ay_ciro
  FROM aylik_ciro
)
SELECT
  ay,
  ciro,
  onceki_ay_ciro,
  ROUND((ciro - onceki_ay_ciro) / onceki_ay_ciro * 100, 1) AS buyume_orani
FROM buyume
ORDER BY ay;`}</pre>

        <h2>8. Window fonksiyonlar: analistin süper gücü</h2>
        <p>
          Window fonksiyonlar GROUP BY gibi değil — satırları gruplamaz, her satıra
          gruba ait bir hesaplama ekler. Sıralama, hareketli ortalama, büyüme oranı
          gibi analizler için vazgeçilmez.
        </p>

        <pre>{`-- ROW_NUMBER: sıra numarası
SELECT
  urun_adi,
  fiyat,
  ROW_NUMBER() OVER (ORDER BY fiyat DESC) AS sira
FROM urunler;

-- RANK: aynı değere aynı sıra (atlama var)
-- DENSE_RANK: aynı değere aynı sıra (atlama yok)

-- Her kategoride en pahalı ürün
SELECT *
FROM (
  SELECT
    urun_adi,
    kategori,
    fiyat,
    ROW_NUMBER() OVER (PARTITION BY kategori ORDER BY fiyat DESC) AS sira
  FROM urunler
) ranked
WHERE sira = 1;

-- Hareketli ortalama (7 günlük)
SELECT
  tarih,
  gunluk_ciro,
  AVG(gunluk_ciro) OVER (
    ORDER BY tarih
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS hareketli_7gun_ort
FROM gunluk_satis;

-- Kümülatif toplam
SELECT
  tarih,
  gunluk_ciro,
  SUM(gunluk_ciro) OVER (ORDER BY tarih) AS kumulatif_ciro
FROM gunluk_satis;

-- Bir önceki aya göre değişim
SELECT
  ay,
  ciro,
  LAG(ciro, 1) OVER (ORDER BY ay) AS onceki_ay,
  ciro - LAG(ciro, 1) OVER (ORDER BY ay) AS fark
FROM aylik_ciro;`}</pre>

        <h2>Pratik ipuçları</h2>
        <ul>
          <li>
            <strong>Önce küçük veri ile test et.</strong> LIMIT 100 ekle, sorgu doğru mu kontrol et,
            sonra kaldır. Yanlış sorgu milyonlarca satırda çalışırsa hem yavaş hem tehlikeli.
          </li>
          <li>
            <strong>SELECT * kullanma.</strong> Sadece ihtiyacın olan sütunları çek. Hem hızlı
            hem okunabilir olur. Veri ambarlarında maliyet de düşer.
          </li>
          <li>
            <strong>Yorumları ihmal etme.</strong> SQL&apos;de yorum satırı: <code>-- bu bir yorum</code>.
            Karmaşık sorgularda ne yaptığını yaz. 3 ay sonra tekrar açtığında anlarsın.
          </li>
          <li>
            <strong>JOIN öncesi COUNT ile kontrol et.</strong> JOIN beklediğinden fazla satır
            üretebilir (çarpım etkisi). Her iki tablonun satır sayısını önceden bil.
          </li>
          <li>
            <strong>NULL&apos;a dikkat et.</strong> NULL = NULL yazmaz, her zaman IS NULL kullan.
            AVG, SUM gibi fonksiyonlar NULL&apos;ları otomatik atlar — bu bazen hata yaratır.
          </li>
          <li>
            <strong>Index&apos;leri anla.</strong> WHERE ve JOIN&apos;de kullandığın sütunlarda index
            varsa sorgu çok daha hızlı çalışır. Yavaş sorgu gördüğünde önce EXPLAIN ANALYZE
            çalıştır.
          </li>
        </ul>

        <h2>Hangi veritabanını öğreneyim?</h2>
        <p>
          SQL standart bir dil ama her veritabanının küçük farkları var. Başlangıç için önerim:
        </p>
        <ul>
          <li><strong>PostgreSQL:</strong> Açık kaynak, güçlü, modern. Öğrenmek için ideal, production&apos;da da yaygın.</li>
          <li><strong>MySQL/MariaDB:</strong> Web uygulamalarında en yaygın. Öğrenmesi kolay.</li>
          <li><strong>SQLite:</strong> Dosya tabanlı, kurulum yok. Python ile gelen SQLite modülüyle hemen başlayabilirsin.</li>
          <li><strong>BigQuery / Snowflake:</strong> Büyük veri için bulut çözümleri. Standart SQL konuşuyorlar.</li>
          <li><strong>DuckDB:</strong> Analitik sorgular için yeni nesil, Python ile entegrasyonu mükemmel.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>SQL ile veri temizleme</strong>: gerçek hayat verisindeki
          tutarsızlıkları, tekrarları ve NULL&apos;ları SQL ile nasıl temizlersin?
        </p>
      </article>
    </main>
  );
}
