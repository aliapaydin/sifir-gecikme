import { PipelineDiyagram, PipelineOlusturucu } from './PipelineDemo';

export const metadata = {
  title: 'Scikit-learn Pipeline\'ları — Sıfır Gecikme',
  description: 'Scikit-learn Pipeline ile temiz, tekrar kullanılabilir ML kodu. ColumnTransformer, GridSearchCV entegrasyonu ve custom transformer adım adım.',
  keywords: ['scikit-learn pipeline', 'sklearn pipeline', 'columntransformer', 'machine learning pipeline', 'python ml'],
  openGraph: {
    title: 'Scikit-learn Pipeline\'ları — Sıfır Gecikme',
    description: 'Pipeline ile veri sızıntısını önle, GridSearchCV ile entegre et, production\'a taşı.',
  },
};

export default function SklearnPipeline() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Scikit-learn Pipeline&apos;ları
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2025 · 20 dakika okuma · scikit-learn 1.4+
        </p>

        <p>
          Çoğu ML kodu şöyle başlar: veriyi yükle, eksik değerleri doldur,
          ölçeklendir, encode et, modeli eğit. Çalışır. Ama tekrar kullanılamaz,
          test verisine yanlışlıkla uygulanır ve GridSearchCV&apos;ye giremiyor.
        </p>
        <p>
          <strong>Pipeline</strong>, bu adımları tek bir nesne altında birleştirir.
          Bir <code>fit</code> çağrısıyla hepsi sırayla çalışır. Veri sızıntısını
          önler, kodu temizler, production&apos;a taşımayı kolaylaştırır.
        </p>

        {/* Temel Diyagram */}
        <div style={{
          border: '0.5px solid var(--color-border)', borderRadius: '14px',
          padding: '20px', background: 'var(--color-cream-card)', margin: '2rem 0',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', margin: '0 0 14px', fontWeight: 600 }}>
            Tipik bir pipeline akışı:
          </p>
          <PipelineDiyagram adimlar={['imputer', 'scaler', 'encoder', 'model']} />
        </div>

        <h2>Pipeline olmadan ne olur?</h2>
        <p>
          Klasik hata: StandardScaler&apos;ı tüm veri üzerinde fit edip sonra
          train/test split yapmak. Test verisindeki istatistikler modele sızdı —
          sonuçlar gerçekten iyi görünür, production&apos;da berbat çalışır.
        </p>

        <pre>{`# ❌ Yanlış — veri sızıntısı var
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)          # test verisi de burada!

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)

model = LogisticRegression()
model.fit(X_train, y_train)
# Test istatistikleri scale işlemine karıştı → iyimser sonuç

# ✅ Doğru — Pipeline ile
from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model',  LogisticRegression()),
])

X_train, X_test, y_train, y_test = train_test_split(X, y)
pipeline.fit(X_train, y_train)   # scaler sadece X_train'e fit olur
pipeline.score(X_test, y_test)   # X_test transform edilir, hiç fit olmaz`}</pre>

        <h2>Temel yapı</h2>
        <p>
          Pipeline bir <strong>adımlar listesi</strong> alır. Her adım bir
          <code>(isim, transformer)</code> demetidir. Son adım model (estimator),
          öncekiler transformer olmak zorundadır.
        </p>

        <pre>{`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Her adım: ('isim', nesne)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model',  LogisticRegression(max_iter=1000)),
])

# Tüm sklearn API'si geçerli
pipeline.fit(X_train, y_train)
y_pred  = pipeline.predict(X_test)
y_prob  = pipeline.predict_proba(X_test)
score   = pipeline.score(X_test, y_test)

# Ara adıma erişim
fitted_scaler = pipeline.named_steps['scaler']
print(fitted_scaler.mean_)            # fit sonrası öğrenilen mean`}</pre>

        <h2>make_pipeline — kısa yol</h2>
        <p>
          İsim vermek istemiyorsan <code>make_pipeline</code> class adını
          küçük harfe çevirerek otomatik atar.
        </p>

        <pre>{`from sklearn.pipeline import make_pipeline

# Uzun hali
Pipeline([('standardscaler', StandardScaler()), ('logisticregression', LogisticRegression())])

# make_pipeline kısa yolu — aynı sonuç
pipe = make_pipeline(StandardScaler(), LogisticRegression())

# Adım isimlerine erişim
pipe.named_steps.keys()
# dict_keys(['standardscaler', 'logisticregression'])`}</pre>

        <h2>ColumnTransformer — karışık veri tipleri</h2>
        <p>
          Gerçek veriler karışık gelir: bazı sütunlar numerik, bazıları kategorik.
          <strong>ColumnTransformer</strong>, farklı sütun gruplarına farklı
          transformer uygulamanı sağlar.
        </p>

        <pre>{`from sklearn.compose    import ColumnTransformer
from sklearn.pipeline   import Pipeline
from sklearn.impute     import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Sütun grupları
numerik    = ['yas', 'gelir', 'toplam_siparis']
kategorik  = ['sehir', 'meslek', 'urun_kategorisi']

# Numerik pipeline
num_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler',  StandardScaler()),
])

# Kategorik pipeline
cat_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
])

# ColumnTransformer ile birleştir
preprocessor = ColumnTransformer([
    ('numerik',    num_pipe, numerik),
    ('kategorik',  cat_pipe, kategorik),
])

# Tam pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model',        LogisticRegression(max_iter=1000)),
])`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            <code>handle_unknown=&apos;ignore&apos;</code> olmadan, test verisinde eğitimde
            görmediğin bir kategori değeri gelirse OneHotEncoder hata fırlatır.
            Production&apos;da bu mutlaka olur — parametreyi unutma.
          </p>
        </blockquote>

        <h2>Pipeline oluşturucu</h2>
        <p>
          Hangi adımları kullanacağını seç, kod otomatik oluşsun.
          Kopyalayıp projena yapıştırabilirsin.
        </p>

        <PipelineOlusturucu />

        <h2>GridSearchCV entegrasyonu</h2>
        <p>
          Pipeline&apos;ın en büyük gücü burada. Hyperparameter search&apos;te
          hem model hem de ön-işlem adımlarının parametrelerini aynı anda arayabilirsin.
          Parametre isimleri <code>adim__parametre</code> şeklinde belirtilir.
        </p>

        <pre>{`from sklearn.model_selection import GridSearchCV

pipeline = Pipeline([
    ('imputer', SimpleImputer()),
    ('scaler',  StandardScaler()),
    ('model',   RandomForestClassifier()),
])

# 'adim__parametre' formatı
param_grid = {
    'imputer__strategy':          ['mean', 'median'],
    'model__n_estimators':        [50, 100, 200],
    'model__max_depth':           [None, 5, 10],
    'model__min_samples_split':   [2, 5],
}

grid = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
)

grid.fit(X_train, y_train)

print(grid.best_params_)
print(f"En iyi CV skoru: {grid.best_score_:.4f}")
print(f"Test skoru: {grid.score(X_test, y_test):.4f}")`}</pre>

        <h2>Custom Transformer yazmak</h2>
        <p>
          Sklearn&apos;in sunmadığı bir dönüşüme ihtiyacın varsa —
          log transform, domain-specific feature engineering, özel imputation —
          kendi transformer&apos;ını yazabilirsin. İki şartı sağlarsan
          Pipeline&apos;a doğrudan girebilir.
        </p>

        <pre>{`from sklearn.base import BaseEstimator, TransformerMixin
import numpy as np

class LogTransformer(BaseEstimator, TransformerMixin):
    """Pozitif sayısal sütunlara log1p uygular (0 değerlerine güvenli)."""

    def __init__(self, epsilon=1e-8):
        self.epsilon = epsilon

    def fit(self, X, y=None):
        return self          # öğrenecek bir şey yok

    def transform(self, X):
        return np.log1p(np.maximum(X, self.epsilon))

    def inverse_transform(self, X):
        return np.expm1(X)


# Pipeline'a tak
pipe = Pipeline([
    ('log',    LogTransformer()),
    ('scaler', StandardScaler()),
    ('model',  Ridge()),
])
pipe.fit(X_train, y_train)`}</pre>

        <pre>{`# Daha karmaşık örnek: özel feature engineering
class GelirYasOran(BaseEstimator, TransformerMixin):
    """Gelir/Yaş oranı özelliği ekler."""

    def __init__(self, gelir_col=0, yas_col=1):
        self.gelir_col = gelir_col
        self.yas_col   = yas_col

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        oran = X[:, self.gelir_col] / (X[:, self.yas_col] + 1)
        return np.hstack([X, oran.reshape(-1, 1)])

    def get_feature_names_out(self, input_features=None):
        base = list(input_features or [f'x{i}' for i in range(self.n_features_in_)])
        return base + ['gelir_yas_orani']`}</pre>

        <h2>Pipeline&apos;ı kaydetmek ve yüklemek</h2>
        <p>
          Fit edilmiş pipeline tek bir dosyaya kaydedilebilir — scaler&apos;ın
          öğrendiği istatistikler, encoder&apos;ın kategorileri, modelin ağırlıkları
          hepsi birlikte.
        </p>

        <pre>{`import joblib

# Kaydet
joblib.dump(pipeline, 'model_pipeline.pkl')

# Yükle ve tahmin et — tek satır
pipeline = joblib.load('model_pipeline.pkl')
y_pred = pipeline.predict(yeni_veri)   # scaler/encoder otomatik uygulanır

# Versiyon notı: joblib.load, modeli eğittiğin sklearn
# sürümüyle aynı veya uyumlu sürümde çalışmalı.
# Production'da sklearn versiyonunu requirements.txt'e yaz.`}</pre>

        <h2>set_output API — DataFrame çıktısı</h2>
        <p>
          Sklearn 1.2&apos;den itibaren Pipeline çıktısını otomatik
          DataFrame&apos;e dönüştürebilirsin. Debug ve feature importance için
          çok kullanışlı.
        </p>

        <pre>{`from sklearn import set_config

set_config(transform_output='pandas')  # global ayar

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model',        RandomForestClassifier()),
])

# Sadece transform adımlarının çıktısı
X_transformed = pipeline[:-1].transform(X_train)
print(type(X_transformed))       # <class 'pandas.core.frame.DataFrame'>
print(X_transformed.columns)     # sütun isimli çıktı

# Feature importance ile birleştir
importances = pipeline['model'].feature_importances_
feat_imp = pd.Series(importances, index=X_transformed.columns)
feat_imp.sort_values(ascending=False).head(10)`}</pre>

        <h2>Sık yapılan hatalar</h2>
        <ul>
          <li>
            <strong>Pipeline dışında fit etmek.</strong> Encoder&apos;ı veya scaler&apos;ı
            Pipeline&apos;dan önce ayrıca fit edip pipeline&apos;a fitted nesne
            vermek veri sızıntısını önlemez — fit her zaman pipeline.fit() ile olmalı.
          </li>
          <li>
            <strong>Test verisinde transform çağırmak.</strong> <code>pipeline.transform(X_test)</code>
            değil, <code>pipeline.predict(X_test)</code> çağır. predict zaten içinde
            transform çalıştırır.
          </li>
          <li>
            <strong>Sütun sırasına dikkat.</strong> ColumnTransformer sütunları
            eğitimde gördüğü sırayla bekler. Inference&apos;ta DataFrame sütunları
            farklı sıradaysa hata alırsın. <code>X[numerik + kategorik]</code> ile
            sıralamayı sabit tut.
          </li>
          <li>
            <strong>sparse_output.</strong> sklearn 1.2&apos;den itibaren
            OneHotEncoder&apos;da varsayılan <code>sparse_output=True</code>.
            StandardScaler sonrası gelen OHE için <code>sparse_output=False</code>
            veya <code>set_output=&quot;pandas&quot;</code> kullan.
          </li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Pipeline, prototipten production&apos;a en temiz geçişi sağlar.
          Bir sonraki adım: Pipeline&apos;ı{' '}
          <strong>MLflow veya BentoML</strong> ile deploy etmek —
          aynı Pipeline nesnesi REST endpoint&apos;e dönüşür.
        </p>
      </article>
    </main>
  );
}
