export const metadata = {
  title: 'dbt Nedir? Analytics Engineering Rehberi',
  description: 'dbt (data build tool) ile SQL tabanlı veri modelleme, transform katmanı ve analytics engineering. Türkçe dbt rehberi.',
  keywords: ['dbt nedir', 'analytics engineering türkçe', 'dbt tutorial türkçe', 'data build tool', 'veri modelleme türkçe'],
};

export default function DBTRehberi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          dbt nedir? Analytics engineering rehberi
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · analytics engineering · 20 dakika okuma
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          Veri mühendisleri veriyi taşır. Veri analistleri veriyi analiz eder.
          Peki ikisi arasında kim veriyi analiz için hazırlar?
          İşte bu boşluğu dolduran rol: <strong>analytics engineer</strong>.
          Ve bu rolün en önemli aracı: <strong>dbt</strong>.
        </p>

        <h2>dbt nedir?</h2>
        <p>
          dbt (data build tool) veri ambarı içindeki transform katmanını yönetir.
          SQL biliyorsan dbt öğrenebilirsin — ek bir programlama dili gerekmez.
        </p>
        <p>
          Temel fikir şu: ham veriyi veri ambarına yükle (EL adımı), dönüşümü
          dbt ile SQL yazarak veri ambarı içinde yap (T adımı). Bu yaklaşıma
          ELT denir.
        </p>

        <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '20px', margin: '1.5rem 0' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '2', color: 'var(--color-text)' }}>
            <div><span style={{ color: '#1D9E75' }}>Kaynak DB</span> → <span style={{ color: '#7F77DD' }}>Fivetran/Airbyte</span> → <span style={{ color: '#e8a04a' }}>Veri Ambarı (ham)</span></div>
            <div style={{ paddingLeft: '24px', color: 'var(--color-text-mute)' }}>↓ dbt transform</div>
            <div><span style={{ color: '#1D9E75' }}>Staging</span> → <span style={{ color: '#1D9E75' }}>Intermediate</span> → <span style={{ color: '#1D9E75' }}>Mart (analiz hazır)</span></div>
            <div style={{ paddingLeft: '24px', color: 'var(--color-text-mute)' }}>↓ BI araçları</div>
            <div><span style={{ color: '#e8a04a' }}>Power BI / Tableau / Looker</span></div>
          </div>
        </div>

        <h2>Neden dbt?</h2>
        <p>dbt olmadan transform katmanı nasıl yönetilir? Genellikle şöyle:</p>
        <ul>
          <li>Karmaşık SQL sorguları Excel'e kopyalanır</li>
          <li>Kimse hangi sorgunun güncel olduğunu bilmez</li>
          <li>"Gelir" metriği farklı departmanlarda farklı hesaplanır</li>
          <li>Bir şeyi değiştirince başka şey bozulur, kimse fark etmez</li>
        </ul>
        <p>dbt ile:</p>
        <ul>
          <li>Tüm transform SQL dosyalarında, Git'te versiyon kontrolünde</li>
          <li>Modeller birbirine bağlı, bağımlılıklar otomatik yönetilir</li>
          <li>Test yazılır — veri kalitesi otomatik kontrol edilir</li>
          <li>Dokümantasyon otomatik oluşur</li>
        </ul>

        <h2>Kurulum ve ilk proje</h2>
        <pre>{`# dbt Core kurulumu (SQLite için)
pip install dbt-core dbt-sqlite

# Yeni proje oluştur
dbt init sifir_gecikme_analytics

# Proje yapısı
sifir_gecikme_analytics/
├── models/          # SQL modellerin burada
│   ├── staging/     # Ham veriden ilk temizleme
│   ├── intermediate/# Ara hesaplamalar
│   └── marts/       # Son analiz tabloları
├── tests/           # Veri kalite testleri
├── seeds/           # Küçük CSV dosyaları
├── macros/          # Tekrar kullanılabilir SQL
└── dbt_project.yml  # Proje konfigürasyonu`}</pre>

        <h2>İlk model — Staging</h2>
        <p>
          Staging modelleri ham veriyi temizler ve standardize eder.
          Her kaynak tablo için bir staging modeli yazılır.
        </p>

        <pre>{`-- models/staging/stg_orders.sql
-- Ham sipariş verisini temizle ve standardize et

WITH source AS (
    -- Ham tablodan veriyi al
    SELECT * FROM {{ source('raw', 'orders') }}
),

renamed AS (
    SELECT
        -- Sütun adlarını standardize et
        id          AS order_id,
        customer_id,
        created_at  AS order_date,
        status      AS order_status,
        total_price AS order_total,

        -- Tip dönüşümleri
        CAST(total_price AS DECIMAL(10,2)) AS order_total_clean,
        DATE(created_at) AS order_date_only,

        -- Hesaplamalar
        CASE
            WHEN status = 'completed' THEN TRUE
            WHEN status = 'cancelled' THEN FALSE
            ELSE NULL
        END AS is_completed,

        -- Metadata
        CURRENT_TIMESTAMP AS dbt_updated_at

    FROM source
    WHERE id IS NOT NULL  -- NULL primary key'leri çıkar
)

SELECT * FROM renamed`}</pre>

        <h2>Intermediate modeller</h2>
        <p>
          Ara hesaplamalar için kullanılır. Birden fazla staging modelini birleştirir,
          iş mantığını uygular.
        </p>

        <pre>{`-- models/intermediate/int_orders_with_customers.sql
-- Siparişleri müşteri bilgileriyle birleştir

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),

customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
),

order_items AS (
    SELECT * FROM {{ ref('stg_order_items') }}
),

-- Sipariş başına toplam hesapla
order_totals AS (
    SELECT
        order_id,
        COUNT(*)              AS item_count,
        SUM(quantity)         AS total_quantity,
        SUM(quantity * price) AS calculated_total
    FROM order_items
    GROUP BY order_id
),

final AS (
    SELECT
        o.order_id,
        o.order_date,
        o.order_status,

        -- Müşteri bilgileri
        c.customer_id,
        c.customer_name,
        c.customer_city,
        c.customer_segment,

        -- Sipariş detayları
        ot.item_count,
        ot.total_quantity,
        ot.calculated_total,

        -- Türetilmiş metrikler
        DATEDIFF('day', c.first_order_date, o.order_date) AS customer_age_at_order

    FROM orders o
    LEFT JOIN customers c USING (customer_id)
    LEFT JOIN order_totals ot USING (order_id)
)

SELECT * FROM final`}</pre>

        <h2>Mart modeller — Son analiz tabloları</h2>
        <p>
          BI araçlarının doğrudan bağlandığı tablolar. Kullanıcıya göre organize edilir:
          finans mart, pazarlama mart, müşteri mart gibi.
        </p>

        <pre>{`-- models/marts/fct_monthly_revenue.sql
-- Aylık gelir gerçekler tablosu

WITH orders AS (
    SELECT * FROM {{ ref('int_orders_with_customers') }}
    WHERE order_status = 'completed'
),

monthly_agg AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        customer_segment,
        customer_city,

        -- Metrikler
        COUNT(DISTINCT order_id)      AS order_count,
        COUNT(DISTINCT customer_id)   AS unique_customers,
        SUM(calculated_total)         AS total_revenue,
        AVG(calculated_total)         AS avg_order_value,
        SUM(item_count)               AS total_items_sold,

        -- Büyüme (window fonksiyon)
        SUM(calculated_total) / LAG(SUM(calculated_total)) OVER (
            PARTITION BY customer_segment
            ORDER BY DATE_TRUNC('month', order_date)
        ) - 1 AS mom_growth_rate

    FROM orders
    GROUP BY 1, 2, 3
)

SELECT * FROM monthly_agg
ORDER BY month DESC, total_revenue DESC`}</pre>

        <h2>dbt testleri</h2>
        <p>
          Veri kalitesini otomatik test etmek dbt'nin en güçlü özelliklerinden biri.
          İki tür test var: genel (built-in) ve özel.
        </p>

        <pre>{`# models/staging/schema.yml
# YAML dosyasında test tanımları

version: 2

models:
  - name: stg_orders
    description: "Temizlenmiş sipariş veritabanı"
    columns:
      - name: order_id
        description: "Benzersiz sipariş ID"
        tests:
          - unique          # Tekrar yok mu?
          - not_null        # NULL var mı?

      - name: order_status
        tests:
          - accepted_values:
              values: ['pending', 'completed', 'cancelled', 'refunded']

      - name: customer_id
        tests:
          - not_null
          - relationships:  # Foreign key kontrolü
              to: ref('stg_customers')
              field: customer_id

      - name: order_total
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000`}</pre>

        <pre>{`# Testleri çalıştır
dbt test

# Sadece bir modeli test et
dbt test --select stg_orders

# Çıktı örneği:
# 12:34:56 | 1 of 4 START test not_null_stg_orders_order_id [RUN]
# 12:34:56 | 1 of 4 PASS not_null_stg_orders_order_id [PASS in 0.12s]
# 12:34:56 | 2 of 4 START test unique_stg_orders_order_id [RUN]
# 12:34:56 | 2 of 4 PASS unique_stg_orders_order_id [PASS in 0.09s]`}</pre>

        <h2>Makrolar — Tekrar kullanılabilir SQL</h2>
        <p>
          Jinja şablonlama ile SQL içinde fonksiyon yazabilirsin.
          Tekrar eden kod bloklarını makro olarak tanımla.
        </p>

        <pre>{`-- macros/cents_to_tl.sql
-- Kuruşu TL'ye çeviren makro

{% macro cents_to_tl(column_name) %}
    ({{ column_name }} / 100.0)
{% endmacro %}

-- macros/is_weekend.sql
{% macro is_weekend(date_column) %}
    CASE
        WHEN DAYOFWEEK({{ date_column }}) IN (1, 7) THEN TRUE
        ELSE FALSE
    END
{% endmacro %}

-- Kullanım:
-- SELECT {{ cents_to_tl('total_price') }} AS total_tl
-- SELECT {{ is_weekend('order_date') }} AS is_weekend`}</pre>

        <h2>dbt ile çalışma akışı</h2>
        <pre>{`# Modelleri çalıştır
dbt run

# Sadece bir modeli çalıştır
dbt run --select fct_monthly_revenue

# Model ve bağımlılarını çalıştır
dbt run --select +fct_monthly_revenue

# Testleri çalıştır
dbt test

# Dokümantasyon oluştur ve aç
dbt docs generate
dbt docs serve

# Seed dosyalarını yükle (küçük CSV'ler)
dbt seed

# Hepsini sırayla çalıştır
dbt build`}</pre>

        <h2>Proje klasör yapısı — Gerçek dünya</h2>
        <pre>{`analytics/
├── models/
│   ├── staging/              # 1. katman — ham veri temizleme
│   │   ├── _sources.yml      # Kaynak tanımları
│   │   ├── stg_orders.sql
│   │   ├── stg_customers.sql
│   │   └── stg_products.sql
│   │
│   ├── intermediate/         # 2. katman — iş mantığı
│   │   ├── int_orders_enriched.sql
│   │   └── int_customer_lifetime.sql
│   │
│   └── marts/               # 3. katman — son tablolar
│       ├── finance/
│       │   ├── fct_revenue.sql
│       │   └── fct_refunds.sql
│       ├── marketing/
│       │   ├── fct_campaigns.sql
│       │   └── dim_customers.sql
│       └── product/
│           └── fct_feature_usage.sql
│
├── macros/                   # Tekrar kullanılabilir SQL
├── seeds/                    # Statik referans verileri
├── tests/                    # Özel testler
├── analyses/                 # Ad-hoc analizler (deploy edilmez)
└── dbt_project.yml`}</pre>

        <h2>dbt Cloud vs dbt Core</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          {[
            {
              baslik: 'dbt Core',
              renk: '#1D9E75', bg: '#E1F5EE',
              maddeler: ['Açık kaynak, ücretsiz', 'Terminal ile çalışır', 'Kendi ortamını kur', 'CI/CD kendin kur'],
            },
            {
              baslik: 'dbt Cloud',
              renk: '#7F77DD', bg: '#EEEDFE',
              maddeler: ['Yönetilen platform', 'Web arayüzü var', 'Zamanlanmış çalıştırma', 'IDE + loglama dahil', 'Ücretsiz plan mevcut'],
            },
          ].map(({ baslik, renk, bg, maddeler }) => (
            <div key={baslik} style={{ background: bg, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 600, color: renk, marginBottom: '10px', fontSize: '16px' }}>{baslik}</div>
              {maddeler.map(m => (
                <div key={m} style={{ fontSize: '13px', color: 'var(--color-text-soft)', marginBottom: '4px', display: 'flex', gap: '6px' }}>
                  <span style={{ color: renk, flexShrink: 0 }}>✓</span> {m}
                </div>
              ))}
            </div>
          ))}
        </div>

        <blockquote style={{ borderLeft: '3px solid #1D9E75', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.7' }}>
            Başlangıç için dbt Cloud'un ücretsiz planını öneririm.
            Kurulum yok, tarayıcıdan çalışır, hemen başlarsın.
            getdbt.com/signup → 5 dakikada hazır.
          </p>
        </blockquote>

        <h2>Özet</h2>
        <ul>
          <li><strong>dbt</strong> veri ambarı içinde SQL ile transform yapar</li>
          <li><strong>Modeller</strong> staging → intermediate → marts hiyerarşisinde organize edilir</li>
          <li><strong>Testler</strong> veri kalitesini otomatik kontrol eder</li>
          <li><strong>ref()</strong> modeller arası bağımlılıkları yönetir</li>
          <li><strong>Git entegrasyonu</strong> ile tüm değişiklikler versiyonlanır</li>
          <li>Başlamak için <strong>dbt Cloud ücretsiz plan</strong> yeterli</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Önceki yazı: <a href="/yazilar/etl-nedir" style={{ color: '#1D9E75', textDecoration: 'none' }}>ETL nedir? Veriyi taşımanın sistematik yolu</a>
        </p>
      </article>
    </main>
  );
}
