export const metadata = {
  title: "Pandas'ta En Çok Yanlış Bilinen 7 Şey",
  description: 'inplace, apply, merge, category dtype — Python pandas kullanırken yapılan yaygın hatalar ve doğruları. Türkçe.',
  keywords: ['pandas türkçe', 'pandas hatalar', 'python veri analizi', 'dataframe türkçe'],
  openGraph: {
    title: "Pandas'ta Yanlış Bilinen 7 Şey — Sıfır Gecikme",
    description: 'inplace, apply, merge ve daha fazlası.',
  },
};

export default function Pandas7Sey() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Pandas&apos;ta en çok yanlış bilinen 7 şey
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          Yıllarca gördüğüm yaygın ama yanlış pattern&apos;ler · 15 dakika okuma
        </p>

        <p>
          Pandas öğrenmek kolay. Pandas&apos;ı <em>doğru</em> kullanmayı öğrenmek zor.
          Çünkü yanlış kullanan kod çalışır — sadece yavaş, güvensiz veya
          bakımı zor olur. Yıllarca kod review&apos;larında gördüğüm 7 yaygın
          hatayı derledim.
        </p>

        <h2>1. inplace=True aslında ne işe yarar?</h2>
        <p>
          Pek çok kişi <code>inplace=True</code>&apos;nun belleği daha verimli
          kullandığını zanneder. Yanılgı. Pandas arka planda yine de yeni bir
          kopya oluşturur, sadece döndürmez. Üstelik zincirleme işlemleri
          engeller ve hata ayıklamayı zorlaştırır.
        </p>

        <pre>{`# Kötü
df.drop(columns=['gereksiz'], inplace=True)
df.rename(columns={'eski': 'yeni'}, inplace=True)

# İyi — zincirleme, okunabilir, güvenli
df = (df
    .drop(columns=['gereksiz'])
    .rename(columns={'eski': 'yeni'})
)

# inplace=True'nun tek avantajı yok gibi.
# Pandas geliştiricileri de kaldırmayı tartışıyor.`}</pre>

        <h2>2. SettingWithCopyWarning seni uyarıyor, dinle</h2>
        <p>
          Bu uyarıyı görünce çoğu kişi ya görmezden gelir ya da
          <code>.copy()</code> ekleyerek susturur. Ama asıl mesaj şu:
          orijinal DataFrame&apos;i mi değiştiriyorsun, yoksa geçici bir
          kopyayı mı? Cevabı bilmiyorsan bug üretiyorsun demektir.
        </p>

        <pre>{`# Bu bir uyarı üretir ve belirsizdir:
filtre = df[df['sehir'] == 'İzmir']
filtre['yeni_sutun'] = 1  # SettingWithCopyWarning!

# Çözüm 1: Kopyayı açıkça al
filtre = df[df['sehir'] == 'İzmir'].copy()
filtre['yeni_sutun'] = 1  # Güvenli

# Çözüm 2: Orijinali değiştirmek istiyorsan loc kullan
df.loc[df['sehir'] == 'İzmir', 'yeni_sutun'] = 1  # Doğrudan`}</pre>

        <h2>3. apply() çoğu zaman yanlış araç</h2>
        <p>
          <code>apply()</code> güçlü ama yavaş. Python döngüsü kadar yavaş,
          çünkü zaten bir döngü. Pandas&apos;ın vektörize operasyonları
          10x-100x daha hızlı çalışır.
        </p>

        <pre>{`import pandas as pd
import numpy as np

df = pd.DataFrame({'fiyat': [100, 200, 300, 400, 500]})

# Kötü — apply ile satır satır
df['kdv'] = df['fiyat'].apply(lambda x: x * 0.18)

# İyi — vektörize, çok daha hızlı
df['kdv'] = df['fiyat'] * 0.18

# Kötü — string işleminde apply
df['isim'] = df['isim'].apply(lambda x: x.upper())

# İyi — str accessor kullan
df['isim'] = df['isim'].str.upper()

# apply() ne zaman kullanılır?
# Sadece vektörize edilemeyen karmaşık iş mantığında.
# Örnek: birden fazla sütuna bakan koşullu hesaplamalar.`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Kural: önce vektörize yöntemi ara. Yoksa numpy kullan.
            O da yoksa apply(). iterrows() ise neredeyse hiç kullanma.
          </p>
        </blockquote>

        <h2>4. merge, join ve concat karıştırılıyor</h2>
        <p>
          Üçü de birleştirme yapar ama farklı durumlarda kullanılır.
          Yanlış seçim hem yavaşlatır hem de beklenmedik sonuçlar üretir.
        </p>

        <pre>{`# merge — SQL JOIN gibi, ortak sütun üzerinden
sonuc = pd.merge(df1, df2, on='musteri_id', how='left')

# join — index üzerinden birleştirme
sonuc = df1.join(df2, on='musteri_id')

# concat — satır veya sütun ekleme (yığma)
sonuc = pd.concat([df1, df2], axis=0)        # satır ekle
sonuc = pd.concat([df1, df2], axis=1)        # sütun ekle

# Yaygın hata: concat ile merge karıştırmak
# concat index'e bakar, merge sütuna bakar
# İki DataFrame'in sütunları aynıysa concat doğru
# Farklı anahtarlar üzerinden birleştiriyorsan merge doğru`}</pre>

        <h2>5. Tarih sütunlarını string bırakmak</h2>
        <p>
          Tarih sütununu string olarak bırakırsan filtreleme yavaş,
          aritmetik imkansız, gruplama anlamsız olur. Her zaman
          datetime&apos;a dönüştür.
        </p>

        <pre>{`# Kötü — string olarak kaldı
df = pd.read_csv('veri.csv')
df['tarih']  # object dtype — yavaş ve kısıtlı

# İyi — okurken dönüştür
df = pd.read_csv('veri.csv', parse_dates=['tarih'])

# Ya da sonradan dönüştür
df['tarih'] = pd.to_datetime(df['tarih'])

# Artık bunları yapabilirsin:
df['ay'] = df['tarih'].dt.month
df['gun_adi'] = df['tarih'].dt.day_name()
df['hafta'] = df['tarih'].dt.isocalendar().week

# Tarihler arası fark
df['gun_fark'] = (df['bitis'] - df['baslangic']).dt.days

# Belirli dönem filtresi
filtre = df[df['tarih'].between('2024-01-01', '2024-06-30')]`}</pre>

        <h2>6. Bellek optimizasyonu: category dtype</h2>
        <p>
          Az sayıda tekrarlayan string değeri olan sütunlar (şehir, kategori,
          cinsiyet gibi) object olarak tutulursa bellekte çok yer kaplar.
          <code>category</code> dtype kullanmak bazen %90 bellek tasarrufu sağlar.
        </p>

        <pre>{`import sys

df['sehir'] = pd.Series(['İzmir', 'İstanbul', 'Ankara'] * 100_000)

# object dtype bellek kullanımı
print(df['sehir'].nbytes)  # ~24 MB

# category dtype'a dönüştür
df['sehir'] = df['sehir'].astype('category')
print(df['sehir'].nbytes)  # ~100 KB — 240x tasarruf!

# Tüm DataFrame'i optimize et
def optimize_df(df):
    for col in df.select_dtypes(include='object').columns:
        if df[col].nunique() / len(df) < 0.05:  # %5'ten az unique
            df[col] = df[col].astype('category')
    for col in df.select_dtypes(include='int64').columns:
        df[col] = pd.to_numeric(df[col], downcast='integer')
    for col in df.select_dtypes(include='float64').columns:
        df[col] = pd.to_numeric(df[col], downcast='float')
    return df`}</pre>

        <h2>7. groupby sonrası reset_index unutulmak</h2>
        <p>
          <code>groupby().agg()</code> sonucunda index&apos;ler gruplama
          sütunlarına dönüşür. Bunu fark etmeden devam edersen sonraki
          merge veya filtrelemede beklenmedik hatalar alırsın.
        </p>

        <pre>{`# groupby sonucu — sehir index'e düştü
ozet = df.groupby('sehir')['fiyat'].mean()
print(ozet.index)  # Index(['Ankara', 'İstanbul', 'İzmir'])

# Merge yapmak istersen sorun çıkar
# Çözüm 1: reset_index
ozet = df.groupby('sehir')['fiyat'].mean().reset_index()

# Çözüm 2: as_index=False (daha temiz)
ozet = df.groupby('sehir', as_index=False)['fiyat'].mean()

# Çözüm 3: named aggregation ile sütun adı ver
ozet = df.groupby('sehir', as_index=False).agg(
    ortalama_fiyat=('fiyat', 'mean'),
    ilan_sayisi=('fiyat', 'count'),
    medyan_fiyat=('fiyat', 'median')
)
# Temiz, okunabilir, merge'e hazır`}</pre>

        <h2>Bonus: iterrows() kullanma</h2>
        <p>
          Listeye eklemek istedim ama 7&apos;de bırakmak daha iyi görünüyordu.
          Yine de söylemeden geçemem: <code>iterrows()</code> pandas&apos;ın
          en yavaş yöntemi. 1 milyon satırlık DataFrame&apos;de dakikalarca
          sürebilir. Vektörize işlem, <code>apply()</code> veya en kötü
          ihtimalle <code>itertuples()</code> kullan.
        </p>

        <pre>{`# Asla bu şekilde kullanma:
for idx, row in df.iterrows():
    df.at[idx, 'yeni'] = row['a'] + row['b']

# Vektörize — binlerce kat hızlı:
df['yeni'] = df['a'] + df['b']`}</pre>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>zaman serisi analizi</strong>: TÜİK enflasyon
          verisiyle trend, mevsimsellik ve basit tahmin modeli.
        </p>
      </article>
    </main>
  );
}
