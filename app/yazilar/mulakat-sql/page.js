export const metadata = {
  title: 'Veri Analisti Mülakatında Sorulan 10 SQL Sorusu',
  description: 'Gerçek mülakat sorularını senaryo, çözüm ve sık yapılan hatalarla incele. Türkçe SQL mülakat rehberi.',
  keywords: ['sql mülakat soruları', 'data analyst mülakat', 'veri analisti sql', 'sql interview questions türkçe'],
  openGraph: {
    title: 'Veri Analisti Mülakatında Sorulan 10 SQL Sorusu — Sıfır Gecikme',
    description: 'Senaryo, çözüm ve sık yapılan hatalarla 10 gerçek mülakat sorusu.',
  },
};

function CodeBlock({ children }) {
  return (
    <pre style={{
      background: 'var(--color-cream-card)',
      border: '0.5px solid var(--color-border)',
      borderRadius: '8px',
      padding: '1rem 1.25rem',
      overflowX: 'auto',
      fontSize: '0.85rem',
      lineHeight: '1.6',
      margin: '1rem 0 1.5rem',
      color: 'var(--color-text)',
    }}>
      <code>{children}</code>
    </pre>
  );
}

function Soru({ no, baslik, children }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-accent)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Soru {no}
        </span>
      </div>
      <h2 style={{ marginTop: 0 }}>{baslik}</h2>
      {children}
    </div>
  );
}

export default function MulakatSQL() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-case inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti mülakatında sorulan 10 SQL sorusu
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>senaryo · çözüm · sık yapılan hatalar · 20 dakika okuma</p>

        <p>
          Veri analisti mülakatlarının büyük çoğunluğunda SQL testi var. Bazen beyaz tahta, bazen online editor,
          bazen sadece &quot;şunu nasıl yazarsın?&quot; sorusu olarak geliyor. Ama sorulan konular tahmin edilebilir.
        </p>

        <p>
          Bu yazıdaki 10 soru, gerçek mülakatlarda en sık karşılaşılan yapıları kapsıyor.
          Her soru için senaryo, çözüm ve &quot;burada takılıyorlar&quot; notunu ekledim.
        </p>

        <p style={{ color: 'var(--color-text-mute)', fontSize: '0.9rem', borderLeft: '3px solid var(--color-border)', paddingLeft: '1rem' }}>
          Sorularla pratik yapmak için{' '}
          <a href="/sql" style={{ color: 'var(--color-accent)' }}>SQL Playground</a>&apos;ı
          kullanabilirsin — tarayıcıda gerçek SQL motoru.
        </p>

        <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2.5rem 0' }} />

        <Soru no={1} baslik="Her departmandaki çalışan sayısını bul">
          <p>
            <strong>Senaryo:</strong> İnsan kaynakları veritabanında <code>employees</code> tablosu var.
            Her departmanda kaç çalışan olduğunu öğrenmek istiyorlar.
          </p>
          <CodeBlock>{`SELECT
  department,
  COUNT(*) AS calisан_sayisi
FROM employees
GROUP BY department
ORDER BY calisаn_sayisi DESC;`}</CodeBlock>
          <p>
            <strong>Sık yapılan hata:</strong> <code>SELECT</code>&apos;te hem <code>department</code> hem de
            <code>salary</code> yazıp <code>GROUP BY</code>&apos;a sadece <code>department</code> koymak.
            <code>GROUP BY</code>&apos;da olmayan her sütun ya aggregate fonksiyona girmeli ya da dışarıda kalmalı.
          </p>
        </Soru>

        <Soru no={2} baslik="Ortalamanın üzerinde maaş alan çalışanları listele">
          <p>
            <strong>Senaryo:</strong> Maaşı şirket ortalamasının üzerinde olan çalışanların adını ve maaşını getir.
            Bu soru subquery kullanımını test ediyor.
          </p>
          <CodeBlock>{`SELECT
  name,
  salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`}</CodeBlock>
          <p>
            <strong>Sık yapılan hata:</strong> <code>WHERE salary {'>'} AVG(salary)</code> yazmak — bu çalışmaz.
            <code>WHERE</code> içinde aggregate fonksiyon kullanılamaz, subquery gerekir.
            Alternatif olarak CTE&apos;yi de kabul ediyorlar:
          </p>
          <CodeBlock>{`WITH ortalama AS (
  SELECT AVG(salary) AS avg_salary FROM employees
)
SELECT name, salary
FROM employees, ortalama
WHERE salary > avg_salary;`}</CodeBlock>
        </Soru>

        <Soru no={3} baslik="Her müşterinin son siparişini getir">
          <p>
            <strong>Senaryo:</strong> E-ticaret veritabanında <code>orders</code> tablosu var.
            Her müşterinin en son verdiği siparişin tarihini ve tutarını bul.
            Bu soru <code>ROW_NUMBER()</code> window fonksiyonu ya da subquery ile çözülüyor.
          </p>
          <CodeBlock>{`-- Window function ile (tercih edilen yol):
SELECT customer_id, order_date, amount
FROM (
  SELECT
    customer_id,
    order_date,
    amount,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id
      ORDER BY order_date DESC
    ) AS rn
  FROM orders
) ranked
WHERE rn = 1;`}</CodeBlock>
          <p>
            <strong>Sık yapılan hata:</strong> <code>MAX(order_date)</code> ile tarihi doğru getirip
            tutarı yanlış eşleştirmek. <code>GROUP BY customer_id</code> yapınca <code>amount</code>
            belirsizleşir — hangi siparişin tutarı? Window function bu sorunu çözer.
          </p>
        </Soru>

        <Soru no={4} baslik="Birden fazla tablodaki veriyi birleştir — JOIN">
          <p>
            <strong>Senaryo:</strong> Çalışanların adı <code>employees</code> tablosunda,
            departman adı ayrı bir <code>departments</code> tablosunda. Her çalışanın adını ve
            departman adını yan yana getir.
          </p>
          <CodeBlock>{`SELECT
  e.name,
  d.department_name,
  e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY d.department_name, e.name;`}</CodeBlock>
          <p>
            <strong>Mülakatta sorabilirler:</strong> &quot;INNER JOIN ile LEFT JOIN farkı nedir?&quot;
            Net cevap: <code>INNER JOIN</code> her iki tabloda eşleşen kayıtları getirir.
            <code>LEFT JOIN</code> sol tablonun tüm kayıtlarını getirir, sağda eşleşme yoksa <code>NULL</code>.
            Departmanı olmayan çalışanları da görmek istiyorsan <code>LEFT JOIN</code>.
          </p>
        </Soru>

        <Soru no={5} baslik="Müşteri başına toplam harcamayı hesapla, 1000 TL altını filtrele">
          <p>
            <strong>Senaryo:</strong> Sipariş tablosundan müşteri bazında toplam harcamayı bul,
            ama sadece toplamı 1000 TL&apos;nin üzerindeki müşterileri göster.
            Bu soru <code>HAVING</code> kullanımını test ediyor.
          </p>
          <CodeBlock>{`SELECT
  customer_id,
  SUM(amount) AS toplam_harcama
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000
ORDER BY toplam_harcama DESC;`}</CodeBlock>
          <p>
            <strong>Sık yapılan hata:</strong> <code>WHERE SUM(amount) {'>'} 1000</code> yazmak.
            <code>WHERE</code> satırları filtreler, <code>HAVING</code> grupları filtreler.
            Aggregate işlemi sonrası filtreleme her zaman <code>HAVING</code>.
          </p>
        </Soru>

        <Soru no={6} baslik="Ay bazında satış trendini çıkar">
          <p>
            <strong>Senaryo:</strong> Hangi ayda ne kadar satış yapıldı? Tarih sütunundan ay bilgisini çıkar,
            aylık toplamları hesapla. Zaman serisi ve tarih fonksiyonlarını test ediyor.
          </p>
          <CodeBlock>{`-- PostgreSQL / Standart SQL:
SELECT
  DATE_TRUNC('month', order_date) AS ay,
  COUNT(*) AS siparis_sayisi,
  SUM(amount) AS toplam_satis
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY ay;

-- SQLite (SQL Playground'da çalışır):
SELECT
  STRFTIME('%Y-%m', order_date) AS ay,
  COUNT(*) AS siparis_sayisi,
  SUM(amount) AS toplam_satis
FROM orders
GROUP BY STRFTIME('%Y-%m', order_date)
ORDER BY ay;`}</CodeBlock>
          <p>
            <strong>İpucu:</strong> Tarih fonksiyonları veritabanına göre değişiyor.
            Mülakatta hangi veritabanını kullandıklarını sor — <code>DATE_TRUNC</code>,
            <code>STRFTIME</code>, <code>FORMAT</code> hepsi farklı syntax.
          </p>
        </Soru>

        <Soru no={7} baslik="Çalışanları maaşa göre sıralayıp sıra numarası ver">
          <p>
            <strong>Senaryo:</strong> Her çalışana maaş sıralamasına göre bir numara ver.
            Window fonksiyonlarının temel sorusu — neredeyse her mülakatta çıkıyor.
          </p>
          <CodeBlock>{`SELECT
  name,
  department,
  salary,
  RANK() OVER (ORDER BY salary DESC) AS sirа,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS yogun_sira,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS satir_no
FROM employees;`}</CodeBlock>
          <p>
            <strong>Mülakatta sorabilirler:</strong> &quot;<code>RANK</code>, <code>DENSE_RANK</code>,
            <code>ROW_NUMBER</code> farkı nedir?&quot;
          </p>
          <ul>
            <li><code>ROW_NUMBER</code>: Eşit değerlere bile farklı numara verir (1, 2, 3, 4)</li>
            <li><code>RANK</code>: Eşit değerler aynı sıra, sonraki atlıyor (1, 1, 3, 4)</li>
            <li><code>DENSE_RANK</code>: Eşit değerler aynı sıra, sonraki atlamıyor (1, 1, 2, 3)</li>
          </ul>
        </Soru>

        <Soru no={8} baslik="Hiç sipariş vermemiş müşterileri bul">
          <p>
            <strong>Senaryo:</strong> <code>customers</code> ve <code>orders</code> tablosu var.
            Hiç sipariş vermemiş müşterilerin listesini getir. Üç farklı yol var — hangisini seçtiğin önemli.
          </p>
          <CodeBlock>{`-- Yol 1: LEFT JOIN + NULL kontrolü (yaygın ve okunabilir):
SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.customer_id IS NULL;

-- Yol 2: NOT EXISTS (büyük tablolarda genellikle daha hızlı):
SELECT customer_id, name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
);

-- Yol 3: NOT IN (dikkatli kullan — NULL varsa sorun çıkar):
SELECT customer_id, name
FROM customers
WHERE customer_id NOT IN (
  SELECT DISTINCT customer_id FROM orders
  WHERE customer_id IS NOT NULL  -- NULL varsa sonuç boş döner!
);`}</CodeBlock>
          <p>
            <strong>İpucu:</strong> Mülakatta üç yolu da bildiğini göster, tercihini ve nedenini açıkla.
            <code>NOT IN</code>&apos;deki NULL tuzağını bilmek seni ayırt eder.
          </p>
        </Soru>

        <Soru no={9} baslik="Running total — kümülatif toplam hesapla">
          <p>
            <strong>Senaryo:</strong> Günlük satışların üzerine kümülatif toplamı ekle.
            Her gün o güne kadar yapılan toplam satışı göster.
          </p>
          <CodeBlock>{`SELECT
  order_date,
  daily_sales,
  SUM(daily_sales) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS kumulatif_satis
FROM (
  SELECT
    order_date,
    SUM(amount) AS daily_sales
  FROM orders
  GROUP BY order_date
) gunluk
ORDER BY order_date;`}</CodeBlock>
          <p>
            <strong>Neden önemli:</strong> Running total, retention analizi, LTV hesabı gibi
            gerçek iş sorularında çok kullanılıyor. Window frame (<code>ROWS BETWEEN...</code>)
            syntax&apos;ını bilmek ileri seviye SQL bilen olduğunu gösterir.
          </p>
        </Soru>

        <Soru no={10} baslik="Self join: yöneticiyi çalışanla eşleştir">
          <p>
            <strong>Senaryo:</strong> Tek bir <code>employees</code> tablosunda hem çalışanlar hem
            yöneticiler var. Her çalışanın yanına yöneticisinin adını getir. Tablo kendisiyle join ediliyor.
          </p>
          <CodeBlock>{`SELECT
  e.name AS calisan,
  m.name AS yonetici,
  e.department,
  e.salary
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY e.department, e.name;`}</CodeBlock>
          <p>
            <strong>Sık yapılan hata:</strong> <code>INNER JOIN</code> kullanmak — o zaman yöneticisi
            olmayan (tepedeki yönetici) kayıt siliniyor. <code>LEFT JOIN</code> ile yöneticisi olmayan
            çalışan da listede kalır, yönetici sütunu <code>NULL</code> döner.
          </p>
        </Soru>

        <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '2.5rem 0' }} />

        <h2>Mülakat öncesi pratik planı</h2>

        <p>Mülakat 1 hafta sonraysa:</p>

        <ul>
          <li><strong>1-2. gün:</strong> Bu 10 soruyu elle yaz, çalıştır, hatalarını gör</li>
          <li><strong>3-4. gün:</strong> Kaggle&apos;da SQL yarışmalarına gir (8 Week SQL Challenge öneririm)</li>
          <li><strong>5. gün:</strong> Şirketin ürününü araştır, veritabanında ne tür tablolar olduğunu tahmin et</li>
          <li><strong>6. gün:</strong> Window function sorularına odaklan — en çok bu konu ayırıyor</li>
          <li><strong>7. gün:</strong> Dinlen, kafan temiz olsun</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Mülakatı geçen SQL kodunu değil, düşünce sürecini satar. Yüksek sesle konuş:
            &quot;Önce şunu anladım, şunu deneyeceğim, burada şu sorunu görüyorum.&quot;
            Sessiz kalmak seni saydamlaştırır.
          </p>
        </blockquote>

        <p>
          Soru takıldığın, anlamadığın veya farklı çözüm yolu bulduysan{' '}
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X&apos;ten</a>{' '}
          yazabilirsin.
        </p>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sorularla pratik yapmak için:{' '}
          <a href="/sql" style={{ color: 'var(--color-accent)' }}>SQL Playground</a> —
          e-ticaret, İK ve spor verisiyle gerçek SQL motoru.
        </p>
      </article>
    </main>
  );
}
