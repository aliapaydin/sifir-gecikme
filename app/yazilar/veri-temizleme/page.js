export const metadata = {
  title: 'Veri Temizleme: Pandas ile Kirli Veriden Temiz Veriye',
  description: 'Eksik değerler, aykırı değerler, tekrar eden satırlar, tip dönüşümleri — pandas ile veri temizlemenin tam rehberi. Türkçe, ücretsiz.',
  keywords: ['veri temizleme türkçe', 'pandas veri temizleme', 'data cleaning pandas', 'eksik değer pandas', 'aykırı değer tespiti'],
};

export default function VeriTemizleme() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri temizleme: kirli veriden temiz veriye
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · pandas · 20 dakika okuma
        </p>

        <p>
          Veri bilimciler zamanlarının %80'ini veri temizlemekle geçirir. Geriye kalan
          %20'de model kurar, analiz yapar. Bu oranı ilk duyduğumda inanamamıştım.
          15 yıl sonra söyleyebilirim ki bu rakam düşük bile.
        </p>
        <p>
          Temiz veri olmadan en iyi model bile işe yaramaz. Bu rehberde gerçek hayatta
          karşılaşacağın her türlü kirli veri sorununu ve pandas ile çözümünü ele alacağız.
        </p>

        <h2>1. Veriyi tanı — önce bak</h2>
        <p>
          Temizlemeden önce ne ile karşı karşıya olduğunu anlamalısın. Her proje şu
          üç komutla başlar:
        </p>

        <pre>{`import pandas as pd
import numpy as np

df = pd.read_csv('veri.csv')

# Temel bilgiler
print(df.shape)          # (satır, sütun)
print(df.dtypes)         # her sütunun tipi
print(df.isnull().sum()) # eksik değer sayısı

# İstatistiksel özet
print(df.describe())

# İlk 5 satır
print(df.head())

# Benzersiz değer sayıları
print(df.nunique())

# Eksik değer yüzdesi
eksik_yuzde = (df.isnull().sum() / len(df)) * 100
print(eksik_yuzde[eksik_yuzde > 0].sort_values(ascending=False))`}</pre>

        <h2>2. Eksik değerler</h2>
        <p>
          Eksik değer her veri setinin baş belası. Ama hepsine aynı çözümü uygulamak
          hata. Önce neden eksik olduğunu anla.
        </p>

        <pre>{`# Eksik değerlerin dağılımı
print(df.isnull().sum())
print(df.isnull().mean() * 100)  # yüzde olarak

# ── Strateji 1: Sil ──────────────────────────────────
# %50'den fazla eksik olan sütunları sil
esik = 0.5
df = df.loc[:, df.isnull().mean() < esik]

# Herhangi bir sütunda eksik olan satırları sil
df = df.dropna()

# Belirli sütunlarda eksik olan satırları sil
df = df.dropna(subset=['yas', 'maas'])

# ── Strateji 2: Doldur ───────────────────────────────
# Sayısal: ortalama veya medyan ile doldur
df['yas'].fillna(df['yas'].median(), inplace=True)
df['maas'].fillna(df['maas'].mean(), inplace=True)

# Kategorik: mod (en sık değer) ile doldur
df['sehir'].fillna(df['sehir'].mode()[0], inplace=True)

# İleri doldurma (zaman serisi için)
df['satis'].fillna(method='ffill', inplace=True)

# Geri doldurma
df['satis'].fillna(method='bfill', inplace=True)

# ── Strateji 3: Tahmin et ────────────────────────────
from sklearn.impute import SimpleImputer, KNNImputer

# Ortalama ile doldur
imputer = SimpleImputer(strategy='median')
df[['yas', 'maas']] = imputer.fit_transform(df[['yas', 'maas']])

# KNN ile doldur (daha akıllı)
knn_imputer = KNNImputer(n_neighbors=5)
df[sayisal_sutunlar] = knn_imputer.fit_transform(df[sayisal_sutunlar])`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Altın kural: Eksik değeri silmeden önce neden eksik olduğunu anla.
            Rastgele eksikse ortalama ile doldur. Sistematik eksikse (örn. kadınların
            geliri eksik) bu bir bilgi taşıyor, dikkatli ol.
          </p>
        </blockquote>

        <h2>3. Tekrar eden satırlar</h2>
        <p>
          Veri birleştirme, sistem hataları veya manuel giriş hatalarından kaynaklanır.
          Tespit etmek ve silmek genellikle kolaydır.
        </p>

        <pre>{`# Kaç tane tekrar var?
print(f"Toplam satır: {len(df)}")
print(f"Tekrar eden: {df.duplicated().sum()}")
print(f"Benzersiz: {df.duplicated().sum()} tekrar sonrası {len(df) - df.duplicated().sum()}")

# Tekrar eden satırları gör
print(df[df.duplicated(keep=False)])

# Tüm sütunlarda aynı olan satırları sil
df = df.drop_duplicates()

# Belirli sütunlara göre tekrar kontrol
df = df.drop_duplicates(subset=['musteri_id', 'siparis_tarihi'])

# Hangi tekrarı tut?
df = df.drop_duplicates(subset=['musteri_id'], keep='last')  # son kaydı tut
df = df.drop_duplicates(subset=['musteri_id'], keep='first') # ilk kaydı tut`}</pre>

        <h2>4. Veri tipi sorunları</h2>
        <p>
          CSV'den okunan veri çoğu zaman yanlış tipte gelir. Tarihler string,
          sayılar object olabilir. Bu hem performansı hem analizin doğruluğunu etkiler.
        </p>

        <pre>{`# Tipleri kontrol et
print(df.dtypes)

# ── String → Sayı ────────────────────────────────────
# "1.234,56" → 1234.56 formatı
df['maas'] = df['maas'].str.replace('.', '').str.replace(',', '.').astype(float)

# Hatalı değerleri NaN'a çevir
df['yas'] = pd.to_numeric(df['yas'], errors='coerce')

# ── String → Tarih ───────────────────────────────────
df['tarih'] = pd.to_datetime(df['tarih'])
df['tarih'] = pd.to_datetime(df['tarih'], format='%d/%m/%Y')

# Tarihten özellik çıkar
df['yil'] = df['tarih'].dt.year
df['ay'] = df['tarih'].dt.month
df['gun'] = df['tarih'].dt.day
df['hafta_gunu'] = df['tarih'].dt.dayofweek  # 0=Pazartesi

# ── Kategorik tip ────────────────────────────────────
# Bellek tasarrufu ve hız için
df['sehir'] = df['sehir'].astype('category')
df['cinsiyet'] = df['cinsiyet'].astype('category')

# Bellek kullanımı karşılaştırması
print(df.memory_usage(deep=True))`}</pre>

        <h2>5. String temizleme</h2>
        <p>
          Metin verisinde tutarsızlık çok yaygın. Boşluklar, büyük/küçük harf
          farkı, özel karakterler...
        </p>

        <pre>{`# Boşlukları temizle
df['isim'] = df['isim'].str.strip()

# Büyük/küçük harf standardize et
df['sehir'] = df['sehir'].str.lower()
df['isim'] = df['isim'].str.title()  # Her kelimenin baş harfi büyük

# Özel karakterleri kaldır
import re
df['telefon'] = df['telefon'].str.replace(r'[^0-9]', '', regex=True)

# Boş string → NaN
df['not'] = df['not'].replace('', np.nan)
df['not'] = df['not'].replace(['N/A', 'NA', 'null', 'NULL', '-'], np.nan)

# Tutarsız değerleri standardize et
sehir_map = {
    'istanbul': 'İstanbul',
    'İSTANBUL': 'İstanbul',
    'istanbul ': 'İstanbul',
    'izmir': 'İzmir',
    'İZMİR': 'İzmir',
}
df['sehir'] = df['sehir'].str.strip().map(sehir_map).fillna(df['sehir'])`}</pre>

        <h2>6. Aykırı değerler</h2>
        <p>
          Aykırı değer her zaman hata değildir. Bazen gerçek, bazen veri girişi hatası,
          bazen dolandırıcılık sinyali. Silmeden önce anla.
        </p>

        <pre>{`# ── IQR Yöntemi ─────────────────────────────────────
Q1 = df['maas'].quantile(0.25)
Q3 = df['maas'].quantile(0.75)
IQR = Q3 - Q1

alt_sinir = Q1 - 1.5 * IQR
ust_sinir = Q3 + 1.5 * IQR

# Aykırı değerleri gör
aykiri = df[(df['maas'] < alt_sinir) | (df['maas'] > ust_sinir)]
print(f"Aykırı değer sayısı: {len(aykiri)}")

# Seçenek 1: Sil
df = df[(df['maas'] >= alt_sinir) & (df['maas'] <= ust_sinir)]

# Seçenek 2: Sınırla (winsorize)
df['maas'] = df['maas'].clip(lower=alt_sinir, upper=ust_sinir)

# Seçenek 3: NaN yap, sonra doldur
df.loc[df['maas'] > ust_sinir, 'maas'] = np.nan
df['maas'].fillna(df['maas'].median(), inplace=True)

# ── Z-Score Yöntemi ──────────────────────────────────
from scipy import stats
z_scores = np.abs(stats.zscore(df['maas']))
df = df[z_scores < 3]  # 3 standart sapmadan uzak olanları sil`}</pre>

        <h2>7. Tam temizleme pipeline'ı</h2>
        <p>
          Tüm adımları tek bir fonksiyona toplamak yeniden kullanılabilirlik sağlar.
        </p>

        <pre>{`def temizle(df):
    """Standart veri temizleme pipeline'ı."""
    df = df.copy()
    
    # 1. Sütun adlarını standardize et
    df.columns = (df.columns
                  .str.strip()
                  .str.lower()
                  .str.replace(' ', '_')
                  .str.replace('ı', 'i')
                  .str.replace('ş', 's')
                  .str.replace('ğ', 'g')
                  .str.replace('ü', 'u')
                  .str.replace('ö', 'o')
                  .str.replace('ç', 'c'))
    
    # 2. Tekrar eden satırları sil
    df = df.drop_duplicates()
    
    # 3. Tipleri düzelt
    for col in df.select_dtypes('object').columns:
        # Sayıya çevrilebiliyorsa çevir
        converted = pd.to_numeric(df[col], errors='coerce')
        if converted.notna().sum() > len(df) * 0.8:
            df[col] = converted
    
    # 4. String sütunları temizle
    for col in df.select_dtypes('object').columns:
        df[col] = df[col].str.strip()
        df[col] = df[col].replace(['', 'N/A', 'NA', 'null', '-'], np.nan)
    
    # 5. %50+ eksik sütunları sil
    df = df.loc[:, df.isnull().mean() < 0.5]
    
    # 6. Sayısal eksikleri medyan ile doldur
    for col in df.select_dtypes('number').columns:
        df[col].fillna(df[col].median(), inplace=True)
    
    # 7. Kategorik eksikleri mod ile doldur
    for col in df.select_dtypes('object').columns:
        if df[col].notna().any():
            df[col].fillna(df[col].mode()[0], inplace=True)
    
    return df

# Kullan
df_temiz = temizle(df_ham)
print(f"Ham: {df_ham.shape} → Temiz: {df_temiz.shape}")`}</pre>

        <h2>Altın kurallar</h2>
        <ul>
          <li><strong>Orijinal veriyi asla değiştirme.</strong> Her zaman kopyayla çalış: <code>df = df.copy()</code></li>
          <li><strong>Her adımı kaydet.</strong> Neyi neden temizlediğini not al. 3 ay sonra tekrar açtığında anlarsın.</li>
          <li><strong>Temizleme öncesi ve sonrasını karşılaştır.</strong> <code>shape</code>, <code>describe()</code> ve <code>isnull().sum()</code> ile kontrol et.</li>
          <li><strong>Domain bilgisi şart.</strong> Maaş sütununda 0 değeri hata mı, gerçek mi? Bunu ancak iş bağlamını bilerek anlarsın.</li>
          <li><strong>Pipeline yaz.</strong> Temizleme adımlarını fonksiyona topla, yeniden kullanılabilir olsun.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki rehberde <strong>ETL ve data transformation</strong>: ham veriyi
          analiz için hazır hale getirmenin sistematik yolu.
        </p>
      </article>
    </main>
  );
}
