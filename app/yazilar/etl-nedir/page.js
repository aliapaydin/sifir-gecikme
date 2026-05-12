export const metadata = {
  title: 'ETL Nedir? Veriyi Taşımanın Sistematik Yolu',
  description: 'Extract, Transform, Load — ETL pipeline nedir, nasıl kurulur? Python ve pandas ile gerçek ETL örnekleri. Türkçe data engineering rehberi.',
  keywords: ['etl nedir', 'data transformation türkçe', 'etl pipeline python', 'veri taşıma türkçe', 'data engineering türkçe'],
};

export default function ETLRehberi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          ETL nedir? Veriyi taşımanın sistematik yolu
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · data engineering · 18 dakika okuma
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          Veri nerede üretilir? Genellikle üretim veritabanlarında, API'lerde, dosyalarda, log sistemlerinde.
          Analiz nerede yapılır? Veri ambarında, BI araçlarında, Jupyter notebook'ta.
          Bu iki nokta arasındaki köprü ETL.
        </p>

        <h2>ETL nedir?</h2>
        <p>
          ETL üç adımın kısaltması: <strong>Extract</strong> (Çıkar), <strong>Transform</strong> (Dönüştür), <strong>Load</strong> (Yükle).
          Ham veriyi kaynak sistemden alıp, analiz için hazır hale getirip, hedef sisteme yüklemek.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '1.5rem 0' }}>
          {[
            { harf: 'E', baslik: 'Extract', renk: '#1D9E75', bg: 'rgba(29,158,117,0.12)', aciklama: 'Kaynak sistemden veriyi çek. Veritabanı, API, CSV, Excel, log dosyası...' },
            { harf: 'T', baslik: 'Transform', renk: '#7F77DD', bg: 'rgba(127,119,221,0.12)', aciklama: 'Veriyi temizle, birleştir, hesapla. İş kurallarını uygula.' },
            { harf: 'L', baslik: 'Load', renk: '#e8a04a', bg: 'rgba(232,160,74,0.12)', aciklama: 'Hazır veriyi hedefe yükle. Veri ambarı, BI aracı, dashboard.' },
          ].map(({ harf, baslik, renk, bg, aciklama }) => (
            <div key={harf} style={{ background: bg, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: renk, marginBottom: '6px' }}>{harf}</div>
              <div style={{ fontWeight: 600, color: renk, marginBottom: '6px', fontSize: '15px' }}>{baslik}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.5' }}>{aciklama}</div>
            </div>
          ))}
        </div>

        <h2>Neden ETL gerekli?</h2>
        <p>
          Çoğu şirkette veri farklı sistemlerde dağınık halde bulunur. Satış verisi CRM'de,
          ürün verisi ERP'de, web trafiği Google Analytics'te, müşteri yorumları ayrı bir platformda.
          Bunları birleştirmeden anlamlı analiz yapamazsın.
        </p>
        <p>
          Üstelik üretim veritabanları analiz için optimize edilmemiştir. Sorgu çalıştırınca
          canlı sistemi yavaşlatırsın. ETL ile veriyi ayrı bir analiz ortamına taşırsın.
        </p>

        <h2>1. Extract — Veriyi çekme</h2>
        <p>Kaynak sistemden veriyi almak. En yaygın senaryolar:</p>

        <pre>{`import pandas as pd
import sqlite3
import requests

# ── Veritabanından çekme ──────────────────────────────
conn = sqlite3.connect('uretim.db')
df_siparisler = pd.read_sql("""
    SELECT s.id, s.tarih, s.musteri_id, s.toplam
    FROM siparisler s
    WHERE s.tarih >= '2024-01-01'
""", conn)
conn.close()

# ── CSV / Excel'den çekme ─────────────────────────────
df_urunler = pd.read_csv('urunler.csv')
df_butce   = pd.read_excel('butce_2024.xlsx', sheet_name='Q1')

# ── API'den çekme ─────────────────────────────────────
response = requests.get(
    'https://api.orneksite.com/musteriler',
    headers={'Authorization': 'Bearer TOKEN'},
    params={'limit': 1000, 'offset': 0}
)
df_musteriler = pd.DataFrame(response.json()['data'])

print(f"Siparişler: {df_siparisler.shape}")
print(f"Ürünler:    {df_urunler.shape}")
print(f"Müşteriler: {df_musteriler.shape}")`}</pre>

        <h2>2. Transform — Dönüştürme</h2>
        <p>
          ETL'nin kalbi burada. Ham veriyi analiz için hazır hale getirmek:
          temizleme, birleştirme, hesaplama, standardize etme.
        </p>

        <pre>{`import pandas as pd
import numpy as np

# ── Temel temizleme ───────────────────────────────────
def temizle(df):
    df = df.copy()

    # Sütun adlarını standardize et
    df.columns = (df.columns
        .str.strip()
        .str.lower()
        .str.replace(' ', '_'))

    # Tekrar eden satırları sil
    df = df.drop_duplicates()

    # Tarih sütunlarını dönüştür
    for col in df.columns:
        if 'tarih' in col or 'date' in col:
            df[col] = pd.to_datetime(df[col], errors='coerce')

    return df

# ── İş kuralları uygula ───────────────────────────────
def is_kurallari_uygula(df_siparisler, df_urunler):
    # Birleştir
    df = df_siparisler.merge(
        df_urunler[['id', 'kategori', 'maliyet']],
        left_on='urun_id',
        right_on='id',
        how='left'
    )

    # Hesaplamalar
    df['kar'] = df['satis_fiyati'] - df['maliyet']
    df['kar_marji'] = (df['kar'] / df['satis_fiyati'] * 100).round(2)
    df['ay'] = df['siparis_tarihi'].dt.to_period('M')
    df['yil'] = df['siparis_tarihi'].dt.year

    # Kategorik dönüşüm
    df['segment'] = pd.cut(
        df['toplam'],
        bins=[0, 500, 2000, 10000, float('inf')],
        labels=['Küçük', 'Orta', 'Büyük', 'Kurumsal']
    )

    return df

# ── Aggregation (özetleme) ────────────────────────────
def aylik_ozet_olustur(df):
    return df.groupby(['ay', 'kategori']).agg(
        siparis_sayisi=('id', 'count'),
        toplam_ciro=('toplam', 'sum'),
        ort_siparis=('toplam', 'mean'),
        toplam_kar=('kar', 'sum'),
        ort_kar_marji=('kar_marji', 'mean'),
    ).round(2).reset_index()`}</pre>

        <h2>3. Load — Hedefe yükleme</h2>
        <p>
          Dönüştürülmüş veriyi analiz ortamına yükle. Hedef bir SQL veritabanı,
          Parquet dosyası, Google BigQuery veya BI aracı olabilir.
        </p>

        <pre>{`import pandas as pd
import sqlite3

# ── SQLite'a yükle (geliştirme/test) ─────────────────
def sqlite_yukle(df, tablo_adi, db_yolu='analiz.db'):
    conn = sqlite3.connect(db_yolu)
    df.to_sql(
        tablo_adi,
        conn,
        if_exists='replace',   # 'replace', 'append', 'fail'
        index=False,
        chunksize=1000         # büyük veri için toplu yükleme
    )
    conn.close()
    print(f"✓ {len(df):,} satır → {tablo_adi}")

# ── Parquet'a yükle (hızlı, sıkıştırılmış) ───────────
def parquet_yukle(df, dosya_yolu):
    df.to_parquet(
        dosya_yolu,
        engine='pyarrow',
        compression='snappy',
        index=False
    )
    print(f"✓ Kaydedildi: {dosya_yolu}")

# ── CSV olarak arşivle ────────────────────────────────
def arsivle(df, klasor='arsiv'):
    import os
    from datetime import datetime
    os.makedirs(klasor, exist_ok=True)
    tarih = datetime.now().strftime('%Y%m%d_%H%M')
    yol = f"{klasor}/veri_{tarih}.csv"
    df.to_csv(yol, index=False)
    print(f"✓ Arşivlendi: {yol}")`}</pre>

        <h2>Tam ETL pipeline</h2>
        <p>
          Gerçek dünyada tüm adımları birleştiren, hata yönetimine sahip,
          loglama yapan bir pipeline şöyle görünür:
        </p>

        <pre>{`import pandas as pd
import sqlite3
import logging
from datetime import datetime

# Loglama ayarla
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
log = logging.getLogger(__name__)

def etl_calistir():
    baslangic = datetime.now()
    log.info("ETL pipeline başladı")

    try:
        # ── EXTRACT ──────────────────────────────────
        log.info("Veri çekiliyor...")
        conn = sqlite3.connect('uretim.db')
        df = pd.read_sql(
            "SELECT * FROM siparisler WHERE tarih >= date('now', '-30 days')",
            conn
        )
        conn.close()
        log.info(f"  ✓ {len(df):,} satır çekildi")

        # ── TRANSFORM ────────────────────────────────
        log.info("Dönüştürme başlıyor...")

        # Temizle
        df = df.drop_duplicates()
        df['tarih'] = pd.to_datetime(df['tarih'])
        df['toplam'] = pd.to_numeric(df['toplam'], errors='coerce')
        df = df.dropna(subset=['toplam', 'tarih'])

        # Hesapla
        df['ay'] = df['tarih'].dt.to_period('M').astype(str)
        df['hafta'] = df['tarih'].dt.isocalendar().week

        # Özetle
        ozet = df.groupby('ay').agg(
            siparis_sayisi=('id', 'count'),
            toplam_ciro=('toplam', 'sum'),
        ).reset_index()

        log.info(f"  ✓ {len(df):,} satır dönüştürüldü")

        # ── LOAD ──────────────────────────────────────
        log.info("Yükleniyor...")
        analiz_conn = sqlite3.connect('analiz.db')
        df.to_sql('siparisler_temiz', analiz_conn,
                  if_exists='replace', index=False)
        ozet.to_sql('aylik_ozet', analiz_conn,
                    if_exists='replace', index=False)
        analiz_conn.close()
        log.info("  ✓ Yükleme tamamlandı")

        # Özet rapor
        sure = (datetime.now() - baslangic).seconds
        log.info(f"ETL tamamlandı — {sure}s | {len(df):,} satır")
        return True

    except Exception as e:
        log.error(f"ETL HATASI: {e}")
        raise

if __name__ == '__main__':
    etl_calistir()`}</pre>

        <h2>ETL vs ELT</h2>
        <p>
          Modern veri ambarları (BigQuery, Snowflake, Redshift) çok güçlü.
          Bu yüzden son yıllarda <strong>ELT</strong> (Extract, Load, Transform) yaygınlaştı —
          önce ham veriyi yükle, dönüşümü ambar içinde yap.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          {[
            {
              baslik: 'ETL',
              renk: '#1D9E75', bg: 'rgba(29,158,117,0.12)',
              maddeler: ['Dönüşüm pipeline dışında yapılır', 'On-premise sistemlerde yaygın', 'Hassas veri için güvenli', 'Python / Spark ile'],
            },
            {
              baslik: 'ELT',
              renk: '#7F77DD', bg: 'rgba(127,119,221,0.12)',
              maddeler: ['Dönüşüm ambar içinde yapılır', 'Cloud sistemlerde yaygın', 'dbt ile transform yazılır', 'BigQuery / Snowflake ile'],
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

        <h2>Popüler ETL araçları</h2>
        <ul>
          <li><strong>Apache Airflow</strong> — Python tabanlı workflow orkestrasyon. Büyük şirketlerin tercihi.</li>
          <li><strong>dbt</strong> — Transform katmanı için. SQL ile modelleme, versiyon kontrolü.</li>
          <li><strong>Prefect</strong> — Airflow'dan daha modern, Python odaklı.</li>
          <li><strong>Luigi</strong> — Spotify'ın açık kaynak pipeline aracı. Daha basit kurulum.</li>
          <li><strong>Pandas</strong> — Küçük-orta ölçekli ETL için yeterli. Öğrenmesi en kolay.</li>
        </ul>

        <h2>Altın kurallar</h2>
        <ul>
          <li><strong>Ham veriyi koru.</strong> Dönüşüm öncesi her zaman bir kopyası olsun. Bir hata yapınca geri dönebilmek için.</li>
          <li><strong>Her adımı logla.</strong> Kaç satır çekildi, kaç satır düştü, ne kadar sürdü. Sorun çıkınca neyin nerede bozulduğunu bilmek için.</li>
          <li><strong>Küçük başla.</strong> 1 milyon satırda test etme. Önce 1000 satırla doğrula.</li>
          <li><strong>Idempotent yap.</strong> Pipeline'ı iki kez çalıştırsan aynı sonucu vermeli. Veriyi iki kez yüklememeli.</li>
          <li><strong>Hata yönetimini unutma.</strong> Kaynak sistem düşebilir, API cevap vermeyebilir. Her adım için try/except yaz.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>dbt ile analytics engineering</strong>: SQL ile transform katmanı nasıl yazılır,
          veri modelleri nasıl oluşturulur.
        </p>
      </article>
    </main>
  );
}
