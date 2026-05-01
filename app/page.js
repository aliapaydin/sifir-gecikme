export default function IzmirKira() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <a href="/" className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</a>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          İzmir kira piyasası: 5.841 ilan, bir analist gözüyle
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2024 · 12 dakika okuma · Python + pandas + sklearn</p>

        <p>
          İzmir&apos;de ev aramak artık farklı bir spor. Bir ilan açıyorsun, iki gün sonra fiyat değişmiş.
          Üç ay önce uygun olan ilçe bütçenin dışına çıkmış. &quot;Çeşme pahalıdır&quot; diyorsun,
          Urla&apos;ya bakıyorsun, orası da öyle. Peki hangi ilçe gerçekten değerli, hangisi sadece büyük?
        </p>

        <p>
          Veriyi açalım ve bakalım. Kaggle&apos;daki <strong>İzmir Konut Fiyatları 2024</strong> datasetinden
          5.841 ilan, 4.211 temizlenmiş daire kaydıyla çalıştık.
        </p>

        <h2>Veriyi Tanıyalım</h2>
        <p>
          Dataset şu sütunları içeriyor: gayrimenkul tipi, fiyat, oda sayısı, salon, alan (m²), bina yaşı,
          il ve ilçe. Eksik değer yok, veri oldukça temiz gelmiş. Aykırı değerleri temizlemek için fiyatın
          1. ve 99. yüzdelik dilimini kestik — yani 1.3M TL altı ve 16.5M TL üstü ilanlar dışarıda.
        </p>

        <pre>{`import pandas as pd

df = pd.read_csv('data_cleaned.csv')
df['district'] = df['district'].str.strip()

# Sadece daire tipi
daire = df[df['left'] == 'Daire'].copy()

# Aykırı değer temizleme
q1 = daire['price'].quantile(0.01)
q99 = daire['price'].quantile(0.99)
daire = daire[(daire['price'] >= q1) & (daire['price'] <= q99)]

print(f"Temiz kayıt sayısı: {len(daire)}")  # 4211`}</pre>

        <h2>Hangi İlçe Ne Kadar?</h2>
        <p>
          Ham fiyat sıralamalarına bakınca Güzelbahçe, Çeşme ve Narlıdere üst sıralarda. Ama bu sıralama
          biraz yanıltıcı çünkü büyük daireler her zaman pahalıdır. Daha adil karşılaştırma için{' '}
          <strong>m² başına fiyata</strong> bakmak gerekiyor.
        </p>

        <img
          src="/izmir-kira/01_ilce_medyan_fiyat.png"
          alt="İzmir ilçe medyan fiyatları"
          style={{ width: '100%', borderRadius: '8px', margin: '1.5rem 0', border: '0.5px solid var(--color-border)' }}
        />

        <h2>Asıl Soru: m² Başına Fiyat</h2>
        <p>
          İşte ilginç olan burada. m² bazında baktığımızda tablo değişiyor:{' '}
          <strong>Çeşme 68.750 TL/m²</strong> ile açık ara birinci. Urla (60.968), Güzelbahçe (56.071)
          ve Narlıdere (47.318) takip ediyor. Karşıyaka ise medyan fiyatta yüksek görünse de m² bazında
          orta pakette kalıyor — çünkü Karşıyaka daireleri genellikle büyük.
        </p>

        <img
          src="/izmir-kira/02_m2_fiyati.png"
          alt="İzmir ilçe m² fiyatları"
          style={{ width: '100%', borderRadius: '8px', margin: '1.5rem 0', border: '0.5px solid var(--color-border)' }}
        />

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            En uygun m² fiyatı Tire (22.222 TL) ve Ödemiş&apos;te (19.346 TL).
            Merkez ilçelerin üçte biri. Şehir merkezine uzaklığın bedeli net görünüyor.
          </p>
        </blockquote>

        <h2>Oda Sayısı Fiyatı Ne Kadar Etkiliyor?</h2>
        <p>
          Beklediğimiz gibi oda sayısı arttıkça fiyat artıyor. Ama dikkat çekici olan şey kutu
          grafiğindeki geniş aralıklar: aynı oda sayısına sahip daireler arasında 2-3 kat fiyat farkı
          olabiliyor. Demek ki &quot;3+1&quot; demek tek başına pek bir şey söylemiyor.
        </p>

        <img
          src="/izmir-kira/03_oda_fiyat.png"
          alt="Oda sayısı fiyat dağılımı"
          style={{ width: '100%', borderRadius: '8px', margin: '1.5rem 0', border: '0.5px solid var(--color-border)' }}
        />

        <h2>Alan mı, Oda mı, Yaş mı — Fiyatı Ne Belirliyor?</h2>
        <p>
          Korelasyon analizine bakınca alanın fiyatla ilişkisi (0.49) oda sayısından (0.31) çok daha güçlü.
          Bina yaşı ise şaşırtıcı şekilde zayıf bir etki gösteriyor (-0.08). Yani &quot;kaç odalı&quot; değil{' '}
          <strong>&quot;kaç m²&quot;</strong> sorusu fiyatı asıl belirleyen faktör.
        </p>

        <img
          src="/izmir-kira/04_alan_fiyat_scatter.png"
          alt="Alan fiyat ilişkisi scatter plot"
          style={{ width: '100%', borderRadius: '8px', margin: '1.5rem 0', border: '0.5px solid var(--color-border)' }}
        />

        <h2>Yeni Bina Farkı Gerçek mi?</h2>
        <p>
          Evet, gerçek. 0-5 yaş binalarda m² fiyatı en yüksek, sonra belirgin bir düşüş var. Ama ilginç
          olan şu: 6-10 ile 11-15 yıl arası binalarda m² fiyatı neredeyse aynı. Yani biraz eski bina almak
          mantıklı olabilir, çok eski bina ise fiyatı önemli ölçüde düşürüyor.
        </p>

        <img
          src="/izmir-kira/05_yas_m2.png"
          alt="Bina yaşı m² fiyat ilişkisi"
          style={{ width: '100%', borderRadius: '8px', margin: '1.5rem 0', border: '0.5px solid var(--color-border)' }}
        />

        <h2>Basit Bir Model: Fiyat Tahmin Edebilir miyiz?</h2>
        <p>
          Alan, oda sayısı ve bina yaşını kullanarak linear regression modeli kurduk.
          Sonuç: <strong>R² = 0.27.</strong> Yani bu üç değişken fiyat değişiminin yalnızca
          %27&apos;sini açıklayabiliyor.
        </p>

        <pre>{`from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

X = daire[['area', 'room', 'age']]
y = daire['price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

print(f"R²: {r2_score(y_test, model.predict(X_test)):.3f}")  # 0.273
# 100m², 3+1, 10 yaş daire tahmini: ~3.63 milyon TL`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Geri kalan %73 nerede? İlçe, kat, manzara, ulaşım, sosyal donatı, pazarlık payı...
            Sayıların söylemediği her şey orada. İyi bir modelin sınırını bilmek,
            modeli körce kullanmaktan değerlidir.
          </p>
        </blockquote>

        <h2>3 Ana Bulgu</h2>
        <ul>
          <li><strong>Çeşme ve Urla m² bazında tartışmasız en pahalı.</strong> Ham fiyata değil, m² fiyatına bakın.</li>
          <li><strong>Alanı büyük olan daire her zaman pahalıdır, ama m²&apos;si pahalı olmayabilir.</strong> Karşıyaka bunun en güzel örneği.</li>
          <li><strong>Alan, oda ve yaşla fiyatı tahmin etmek mümkün ama yetersiz.</strong> R²=0.27, konum ve sosyal donatı verisi olmadan model gerçek hayatı yakalamıyor.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda bu modeli geliştireceğiz: ilçe bilgisini de ekleyip R²&apos;yi ne kadar
          yukarı çekebileceğimize bakacağız. Spoiler: fark büyük.
        </p>
      </article>

      <footer className="max-w-3xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </span>
      </footer>
    </main>
  );
}