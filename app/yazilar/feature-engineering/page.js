export default function FeatureEngineering() {
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
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Feature engineering: modelden önce gelen sanat
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · 15 dakika okuma · Python + pandas + sklearn
        </p>

        <p>
          İki veri bilimci aynı algoritmayı kullanıyor. Biri %72, diğeri %89
          doğruluk alıyor. Fark nerede? Büyük ihtimalle feature engineering&apos;de.
        </p>
        <p>
          Daha iyi algoritma aramadan önce elindeki veriyi daha iyi temsil etmeyi
          öğren. Çoğu zaman bu, algoritmayı değiştirmekten çok daha etkili.
        </p>

        <h2>1. Sayısal özellikler: dönüşümler</h2>
        <p>
          Ham sayılar her zaman modele hazır değildir. Çarpık dağılımlar,
          farklı ölçekler, aykırı değerler — bunlar modelin işini zorlaştırır.
        </p>

        <pre>{`import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Log dönüşümü — çarpık dağılımları normalize eder
# Gelir, fiyat, nüfus gibi sağa çarpık veriler için
df['log_gelir'] = np.log1p(df['gelir'])  # log1p: 0 için güvenli

# Kare kök — daha yumuşak dönüşüm
df['sqrt_alan'] = np.sqrt(df['alan'])

# Standardizasyon — ortalama 0, std 1
# SVM, KNN, logistic regression için şart
scaler = StandardScaler()
df['gelir_scaled'] = scaler.fit_transform(df[['gelir']])

# Min-Max normalizasyon — [0,1] aralığına çek
# Sinir ağları ve görüntü işleme için yaygın
minmax = MinMaxScaler()
df['fiyat_norm'] = minmax.fit_transform(df[['fiyat']])

# Binning — sayıyı kategoriye çevir
df['yas_grubu'] = pd.cut(df['yas'],
    bins=[0, 18, 35, 55, 100],
    labels=['genc', 'yetiskin', 'orta_yas', 'yasli']
)`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Tree-based modeller (Random Forest, XGBoost) ölçeklemeye ihtiyaç duymaz.
            Ama doğrusal modeller ve uzaklık bazlı modeller (KNN, SVM) için
            standardizasyon neredeyse zorunlu.
          </p>
        </blockquote>

        <h2>2. Kategorik özellikler: encoding</h2>
        <p>
          Modeller sayı anlar, metin anlamaz. Kategorik değişkenleri
          sayıya çevirmek için birden fazla yol var — hangisini seçeceğin
          veriye ve modele bağlı.
        </p>

        <pre>{`from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
import pandas as pd

df = pd.DataFrame({'sehir': ['İzmir', 'İstanbul', 'Ankara', 'İzmir'],
                   'egitim': ['lise', 'lisans', 'yuksek_lisans', 'doktora']})

# One-Hot Encoding — sırasız kategoriler için
# Dezavantaj: çok kategori varsa boyut patlar
sehir_dummies = pd.get_dummies(df['sehir'], prefix='sehir')
# sehir_Ankara, sehir_İstanbul, sehir_İzmir

# Ordinal Encoding — sıralı kategoriler için
oe = OrdinalEncoder(categories=[['lise', 'lisans', 'yuksek_lisans', 'doktora']])
df['egitim_encoded'] = oe.fit_transform(df[['egitim']])
# lise=0, lisans=1, yuksek_lisans=2, doktora=3

# Target Encoding — yüksek kardinalite için (şehir, posta kodu)
# Her kategoriyi hedef değişkenin ortalamasıyla değiştir
target_mean = df.groupby('sehir')['fiyat'].mean()
df['sehir_target'] = df['sehir'].map(target_mean)
# Dikkat: data leakage riskine karşı cross-val içinde kullan`}</pre>

        <h2>3. Tarih/zaman özellikleri</h2>
        <p>
          Tarih sütunu tek başına anlamsız. Ama ondan çıkarılacak
          özellikler altın değerinde: hafta sonu mu, tatil mi, ayın
          kaçıncı günü, geçen olaydan kaç gün geçmiş?
        </p>

        <pre>{`df['tarih'] = pd.to_datetime(df['tarih'])

# Temel zaman özellikleri
df['yil']      = df['tarih'].dt.year
df['ay']       = df['tarih'].dt.month
df['gun']      = df['tarih'].dt.day
df['haftanin_gunu'] = df['tarih'].dt.dayofweek  # 0=Pzt, 6=Paz
df['hafta_ici'] = df['haftanin_gunu'].lt(5).astype(int)
df['ceyrek']   = df['tarih'].dt.quarter

# Zaman farklılıkları
bugun = pd.Timestamp('today')
df['kac_gun_once'] = (bugun - df['tarih']).dt.days

# Döngüsel encoding — ay ve gün için
# Aralık (12) ile Ocak (1) aslında birbirine yakın
# Ama sayısal olarak 11 birim uzak — yanlış!
import numpy as np
df['ay_sin'] = np.sin(2 * np.pi * df['ay'] / 12)
df['ay_cos'] = np.cos(2 * np.pi * df['ay'] / 12)
# Artık Aralık ve Ocak geometrik olarak yakın`}</pre>

        <h2>4. Etkileşim özellikleri (interaction features)</h2>
        <p>
          İki özelliğin kombinasyonu bazen tek başlarından çok daha
          güçlü bir sinyal taşır. Özellikle doğrusal modellerde bu
          özellikler büyük fark yaratır.
        </p>

        <pre>{`# Basit çarpım etkileşimi
df['alan_x_oda'] = df['alan'] * df['oda_sayisi']
df['fiyat_per_m2'] = df['fiyat'] / df['alan']

# Oran özellikleri
df['bos_oda_orani'] = df['bos_oda'] / df['toplam_oda']
df['gelir_borclanma_orani'] = df['borc'] / df['gelir']

# Polinom özellikler — sklearn ile otomatik
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X[['alan', 'oda_sayisi', 'yas']])
# alan², oda², alan×oda, alan×yas, oda×yas, yas²
print(f"Orijinal: 3 özellik → Polinom: {X_poly.shape[1]} özellik")`}</pre>

        <h2>5. Eksik veri: silmek değil, öğrenmek</h2>
        <p>
          Eksik veri bazen bir sinyal taşır. &quot;Bu alan neden boş?&quot;
          sorusu bazen en değerli özelliği yaratır.
        </p>

        <pre>{`# Eksik veriyi göster
print(df.isnull().sum())
print(df.isnull().mean().sort_values(ascending=False))

# Strateji 1: Eksikliği özellik olarak kullan
df['gelir_eksik'] = df['gelir'].isnull().astype(int)

# Strateji 2: Basit doldurma
df['yas'].fillna(df['yas'].median(), inplace=False)

# Strateji 3: Grup ortalamasıyla doldur
df['fiyat'] = df.groupby('sehir')['fiyat'].transform(
    lambda x: x.fillna(x.median())
)

# Strateji 4: Model ile doldur (KNN Imputer)
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(
    imputer.fit_transform(df),
    columns=df.columns
)`}</pre>

        <h2>6. Özellik seçimi: az ama öz</h2>
        <p>
          100 özellik ürettin, hepsi işe yaramıyor. Gereksiz özellikler
          modeli yavaşlatır, overfitting&apos;e iter. Seçim şart.
        </p>

        <pre>{`from sklearn.feature_selection import SelectKBest, f_classif, mutual_info_regression
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

# Korelasyon bazlı — basit ama hızlı
corr = df.corr()['hedef'].abs().sort_values(ascending=False)
print(corr.head(10))

# İstatistiksel test (ANOVA F-test)
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X, y)

# Model bazlı önem skoru (en güvenilir)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

importance = pd.Series(rf.feature_importances_, index=X.columns)
print(importance.sort_values(ascending=False).head(10))

# Recursive Feature Elimination
from sklearn.feature_selection import RFE
rfe = RFE(estimator=rf, n_features_to_select=15)
X_rfe = rfe.fit_transform(X, y)`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Feature engineering bir sanat. Veri setini ve iş problemini
            gerçekten anlamadan iyi özellik üretemezsin. En değerli özellikler
            genellikle domain knowledge&apos;den gelir, otomatik araçlardan değil.
          </p>
        </blockquote>

        <h2>Hepsini bir pipeline&apos;a topla</h2>
        <p>
          Feature engineering adımlarını pipeline&apos;a koymak data leakage&apos;i
          önler, kodu temiz tutar ve production&apos;a taşımayı kolaylaştırır.
        </p>

        <pre>{`from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier

# Sayısal ve kategorik sütunları ayır
numeric_cols = ['alan', 'yas', 'gelir']
categoric_cols = ['sehir', 'tip']

# Her tip için işlem zinciri
numeric_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categoric_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

# Birleştir
preprocessor = ColumnTransformer([
    ('num', numeric_pipeline, numeric_cols),
    ('cat', categoric_pipeline, categoric_cols)
])

# Modelle birleştir
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', GradientBoostingClassifier())
])

full_pipeline.fit(X_train, y_train)
print(f"Test skoru: {full_pipeline.score(X_test, y_test):.3f}")`}</pre>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>veri görselleştirme rehberi</strong>:
          hangi grafik ne zaman kullanılır, hangi araç hangi durumda?
        </p>
      </article>
    </main>
  );
}
