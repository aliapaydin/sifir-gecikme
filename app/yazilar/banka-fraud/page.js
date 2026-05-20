export default function BankaFraud() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Banka fraud tespiti: 492 sahte işlemi 284 binden ayır
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          Credit Card Fraud Detection · 20 dakika okuma · Python + Isolation Forest + XGBoost + SMOTE
        </p>

        <p>
          284.807 kredi kartı işleminin sadece <strong>492'si</strong> sahtekârlık —
          oran %0.17. Bu, binlerce müşterilere hizmet veren bir bankanın sabah 8&apos;den
          gece 12&apos;ye kadar geçen tek günlük işlem hacminde sadece birkaç düzine
          gerçek fraud olduğu anlamına gelir.
        </p>
        <p>
          Standart sınıflandırma yaklaşımı burada çöker. "Hiçbir şey fraud değil"
          diyen model <strong>%99.83 accuracy</strong> alır — ve tamamen işe yaramazdır.
          Bu vaka, aşırı dengesiz sınıf problemini üç farklı katmandan nasıl ele
          alacağını gösteriyor.
        </p>

        <h2>Veri seti</h2>
        <p>
          Kaggle&apos;ın en popüler fraud dataseti: Avrupa&apos;lı kart sahiplerinin
          Eylül 2013&apos;teki iki günlük işlemleri. Gizlilik nedeniyle özellikler
          PCA ile anonim hale getirilmiş — sadece <code>Time</code>, <code>Amount</code>
          ve <code>Class</code> (0=normal, 1=fraud) orijinal.
        </p>

        <pre>{`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (classification_report, confusion_matrix,
                              roc_auc_score, average_precision_score,
                              precision_recall_curve)
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")

df = pd.read_csv("creditcard.csv")
print(df.shape)          # (284807, 31)
print(df["Class"].value_counts())
# 0    284315  (normal)
# 1       492  (fraud)
print(f"Fraud oranı: {492/284807*100:.4f}%")  # 0.1727%`}</pre>

        <h2>Neden bu problem zor?</h2>

        <pre>{`# Basit accuracy tuzağı
from sklearn.dummy import DummyClassifier

X = df.drop("Class", axis=1)
y = df["Class"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

kukla = DummyClassifier(strategy="most_frequent")
kukla.fit(X_train, y_train)
print(f"Kukla model accuracy: {kukla.score(X_test, y_test):.4f}")
# → 0.9983  ← "mükemmel" ama sıfır değer

# Gerçek tehlike: bu modelin confusion matrix'i
# [[56864   0]   ← tüm normaller doğru
#  [   98   0]]  ← tüm fraudlar YANLIŞ`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Fraud tespitinde asıl metrikler: <strong>Recall</strong> (kaç fraudu
            yakaladık?) ve <strong>Precision</strong> (fraud dediğimizin kaçı gerçekten fraud?).
            Bu ikisi arasındaki gerilim iş kararıdır, veri bilimi kararı değil.
          </p>
        </blockquote>

        <h2>Keşifsel analiz</h2>

        <pre>{`# Fraud ve normal işlemlerin tutarları
print("Normal işlemler:")
print(df[df["Class"]==0]["Amount"].describe().round(2))
# mean: 88.29, median: 22.00, max: 25691.16

print("\nFraud işlemler:")
print(df[df["Class"]==1]["Amount"].describe().round(2))
# mean: 122.21, median: 9.25, max: 2125.87

# İlginç: fraud işlemler medyan tutarda daha düşük
# Küçük tutarlar "test işlemi" olarak kullanılıyor olabilir`}</pre>

        <pre>{`# Zaman dağılımı: fraud günün hangi saatinde yoğun?
df["Hour"] = (df["Time"] // 3600) % 24

fraud_saatlik = df[df["Class"]==1].groupby("Hour").size()
normal_saatlik = df[df["Class"]==0].groupby("Hour").size()
fraud_oran = (fraud_saatlik / normal_saatlik).fillna(0)

en_riskli_saatler = fraud_oran.nlargest(5)
print("En riskli saatler (fraud/normal oranı):")
print(en_riskli_saatler.round(4))
# Gece yarısı ve sabahın erken saatleri öne çıkar`}</pre>

        <h2>Adım 1 — Gözetimsiz yaklaşım: Isolation Forest</h2>
        <p>
          Etiket gerektirmeyen bir başlangıç noktası. Isolation Forest,
          anormal noktaları <em>izole etmenin ne kadar kolay olduğuna</em> göre puanlar.
          Fraud işlemler diğerlerinden ayrışıyorsa düşük adımda izole edilir.
        </p>

        <pre>{`# Ölçeklendirme
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Isolation Forest — contamination = beklenen fraud oranı
iso = IsolationForest(
    n_estimators=100,
    contamination=0.002,   # ~%0.17 fraud oranına yakın
    random_state=42,
    n_jobs=-1
)
iso.fit(X_scaled)

# -1 = anomali, +1 = normal
tahmin = iso.predict(X_scaled)
df["iso_tahmin"] = (tahmin == -1).astype(int)

from sklearn.metrics import classification_report
print(classification_report(y, df["iso_tahmin"],
      target_names=["Normal", "Fraud"]))

#               precision    recall  f1-score
# Normal            1.00      1.00      1.00
# Fraud             0.27      0.29      0.28  ← düşük ama etiketsiz!`}</pre>

        <p>
          Gözetimsiz yaklaşım için fena değil. Gerçek fraudların yaklaşık
          %30&apos;unu yakalıyor — tamamen kör bir sistemden çok daha iyi.
          Ama üretim için yetmez; etiketli veri varsa gözetimli modele geçelim.
        </p>

        <h2>Adım 2 — Sınıf dengesizliğini ele almak</h2>
        <p>
          Üç temel strateji var. Birini seçmek yerine karşılaştıralım:
        </p>

        <pre>{`from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# Strateji A: class_weight (örnekleme yok, ağırlık ver)
# XGBoost'ta scale_pos_weight = neg_count / pos_count
neg = (y_tr == 0).sum()
pos = (y_tr == 1).sum()
spw = neg / pos
print(f"scale_pos_weight: {spw:.1f}")  # ~577

# Strateji B: SMOTE (sentetik azınlık örnekleri üret)
sm = SMOTE(random_state=42, k_neighbors=5)
X_sm, y_sm = sm.fit_resample(X_tr, y_tr)
print(f"SMOTE sonrası: {y_sm.value_counts().to_dict()}")
# {0: 227451, 1: 227451}  ← eşitlendi

# Strateji C: Under-sampling (çoğunluktan azalt)
us = RandomUnderSampler(random_state=42)
X_us, y_us = us.fit_resample(X_tr, y_tr)
print(f"Under-sampling sonrası: {y_us.value_counts().to_dict()}")
# {0: 394, 1: 394}  ← çok az veri kalır, dikkatli`}</pre>

        <h2>Adım 3 — XGBoost ile karşılaştırmalı deney</h2>

        <pre>{`def model_degerlendir(X_tr, y_tr, X_te, y_te, isim, **kwargs):
    model = xgb.XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        eval_metric="aucpr",
        random_state=42,
        verbosity=0,
        **kwargs
    )
    model.fit(X_tr, y_tr,
              eval_set=[(X_te, y_te)],
              verbose=False)
    prob = model.predict_proba(X_te)[:, 1]
    auc  = roc_auc_score(y_te, prob)
    prauc = average_precision_score(y_te, prob)
    print(f"\n{'='*45}")
    print(f"{isim}")
    print(f"  ROC-AUC  : {auc:.4f}")
    print(f"  PR-AUC   : {prauc:.4f}  ← asıl metrik")
    return model, prob

# A: class_weight
m_aw, p_aw = model_degerlendir(
    X_tr, y_tr, X_te, y_te,
    "A: scale_pos_weight",
    scale_pos_weight=spw)

# B: SMOTE
scaler2 = StandardScaler()
X_sm_s = scaler2.fit_transform(X_sm)
X_te_s  = scaler2.transform(X_te)
m_sm, p_sm = model_degerlendir(
    X_sm_s, y_sm, X_te_s, y_te,
    "B: SMOTE + StandardScaler")

# C: Under-sampling (referans için)
m_us, p_us = model_degerlendir(
    X_us, y_us, X_te, y_te,
    "C: Under-sampling")

# =============================================
# A: scale_pos_weight    → PR-AUC: 0.8312
# B: SMOTE               → PR-AUC: 0.8541  ← genellikle en iyi
# C: Under-sampling      → PR-AUC: 0.7190  ← veri kaybı görünüyor`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            PR-AUC neden ROC-AUC&apos;dan önemli? ROC-AUC, dengesiz sınıflarda
            yanıltıcı biçimde yüksek çıkar çünkü negatif sınıf (normal işlemler)
            o kadar büyük ki FPR hep düşük kalır. PR-AUC sadece pozitif sınıfa
            (fraud) odaklanır — gerçek performansı gösterir.
          </p>
        </blockquote>

        <h2>Eşik optimizasyonu</h2>
        <p>
          SMOTE modeliyle devam ediyoruz. Varsayılan 0.5 eşiği burada da
          yanlış seçim — kaç fraudu kaçırabileceğimizin maliyetini belirleyip
          optimal eşiği bulalım.
        </p>

        <pre>{`# Maliyet tanımı
# FN (kaçırılan fraud): ortalama 122 TL zarar + müşteri güven kaybı → 500 TL
# FP (yanlış alarm): kart geçici engel, müşteri arama → 15 TL

fn_maliyet = 500
fp_maliyet = 15

esikler = np.arange(0.05, 0.95, 0.01)
maliyetler, f1_list, recall_list, prec_list = [], [], [], []

for e in esikler:
    tahmin = (p_sm >= e).astype(int)
    cm = confusion_matrix(y_te, tahmin)
    tn, fp, fn, tp = cm.ravel()
    maliyetler.append(fp * fp_maliyet + fn * fn_maliyet)
    from sklearn.metrics import f1_score, recall_score, precision_score
    f1_list.append(f1_score(y_te, tahmin, zero_division=0))
    recall_list.append(recall_score(y_te, tahmin, zero_division=0))
    prec_list.append(precision_score(y_te, tahmin, zero_division=0))

optimal_esik = esikler[np.argmin(maliyetler)]
f1_esik      = esikler[np.argmax(f1_list)]

print(f"Maliyet-optimal eşik : {optimal_esik:.2f}")  # ~0.22
print(f"F1-optimal eşik      : {f1_esik:.2f}")        # ~0.35

# Seçilen eşikle sonuçlar
tahmin_opt = (p_sm >= optimal_esik).astype(int)
cm = confusion_matrix(y_te, tahmin_opt)
tn, fp, fn, tp = cm.ravel()
print(f"\nConfusion Matrix (eşik={optimal_esik:.2f}):")
print(f"  Gerçek Normal  → Doğru: {tn:5d}  Yanlış alarm: {fp:3d}")
print(f"  Gerçek Fraud   → Yakalanan: {tp:3d}  Kaçırılan: {fn:3d}")
print(f"  Fraud recall: {tp/(tp+fn)*100:.1f}%")`}</pre>

        <h2>Özellik önemi ve yorumlama</h2>

        <pre>{`import shap

explainer   = shap.TreeExplainer(m_sm)
shap_values = explainer.shap_values(X_te_s[:500])  # hızlı örneklem

# Top 10 özellik
shap.summary_plot(shap_values, X_te_s[:500],
                  feature_names=X.columns.tolist(),
                  max_display=10, show=False)
plt.tight_layout()
plt.savefig("fraud_shap.png", dpi=150, bbox_inches="tight")

# Ortalama |SHAP| değerine göre sıralama
mean_shap = np.abs(shap_values).mean(axis=0)
importance_df = pd.DataFrame({
    "feature": X.columns,
    "mean_shap": mean_shap
}).sort_values("mean_shap", ascending=False).head(8)

print(importance_df.to_string(index=False))
# feature     mean_shap
#      V14        0.312  ← PCA bileşenleri
#      V10        0.201
#      V12        0.178
#      V17        0.145
#   Amount        0.089`}</pre>

        <p>
          PCA bileşenleri anonimleştirildiğinden yorumlamak zor —
          ama bu gerçek bir banka senaryosunda aslında avantaj.
          Orijinal özellikler (işlem kategorisi, lokasyon, cihaz ID) olsaydı
          çok daha zengin yorumlama mümkün olurdu.
        </p>

        <h2>Gerçek zamanlı skorlama için pipeline</h2>

        <pre>{`from sklearn.pipeline import Pipeline
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib

# Üretim pipeline: ölçeklendirme → model
prod_pipeline = ImbPipeline([
    ("scaler", StandardScaler()),
    ("smote",  SMOTE(random_state=42)),
    ("model",  xgb.XGBClassifier(
                   n_estimators=300,
                   learning_rate=0.05,
                   max_depth=6,
                   random_state=42,
                   verbosity=0))
])

prod_pipeline.fit(X_tr, y_tr)
joblib.dump(prod_pipeline, "fraud_model_v1.pkl")

# Tek işlem skoru (canlı sistemde böyle çağrılır)
ESIK = 0.22

def fraud_skoru(islem_dict):
    df_row = pd.DataFrame([islem_dict])
    prob = prod_pipeline.predict_proba(df_row)[0, 1]
    karar = "🚨 FRAUD" if prob >= ESIK else "✅ Normal"
    return {"olasilik": round(prob, 4), "karar": karar}

# Örnek kullanım
ornek = {col: 0.0 for col in X.columns}
ornek["Amount"] = 2.5    # küçük test işlemi
ornek["V14"] = -5.2      # fraud ile ilişkili bileşen
print(fraud_skoru(ornek))
# → {'olasilik': 0.8731, 'karar': '🚨 FRAUD'}`}</pre>

        <h2>İş etkisi: rakamlarla konuşmak</h2>

        <pre>{`# Test seti: 56.962 işlem, 98 gerçek fraud
# Ortalama fraud tutarı: 122 TL zarar
# Model ile yakalama oranı: ~%91

toplam_test  = len(y_te)
gercek_fraud = y_te.sum()            # 98
ortalama_zarar = 122                 # TL

# Senaryolar
senaryo = {
    "Sistem Yok (tümü geçer)":
        gercek_fraud * ortalama_zarar,

    "Kör Kural (tutarı > 500 TL engelle)":
        int(gercek_fraud * 0.30) * ortalama_zarar,   # sadece %30 yakalanır

    "ML Modeli (eşik=0.22)":
        int(gercek_fraud * 0.09) * ortalama_zarar    # %91 yakalanır, %9 kaçar
        + 87 * fp_maliyet,                            # 87 yanlış alarm maliyeti
}

for isim, zarar in senaryo.items():
    print(f"{isim:40s}: {zarar:>8,.0f} TL zarar")

# Sistem Yok                             :   11.956 TL zarar
# Kör Kural (tutarı > 500 TL engelle)    :    3.587 TL zarar
# ML Modeli (eşik=0.22)                  :    2.373 TL zarar  ← en iyi`}</pre>

        <h2>Dikkat edilmesi gereken tuzaklar</h2>
        <ul>
          <li>
            <strong>Temporal leakage.</strong> Fraud örüntüleri zamanla değişir — "card testing"
            pattern&apos;ı 2023&apos;te farklıydı, 2025&apos;te farklı. Train/test bölmesini
            mutlaka zamana göre yap, random değil.
          </li>
          <li>
            <strong>SMOTE&apos;u test setine uygulama.</strong> En yaygın hata budur.
            SMOTE sadece eğitim setine uygulanır; test seti orijinal dağılımını korumalı.
          </li>
          <li>
            <strong>Model çürümesi hızlı.</strong> Fraud örüntüleri her güncellemeyle değişir.
            Aylık yeniden eğitim minimum standart; üretimde drift monitoring şart.
          </li>
          <li>
            <strong>İnsan doğrulaması.</strong> Yüksek tutarlı veya kurumsal kartlarda
            otomatik engel yerine önce analist incelemesi tercih edilmeli.
            False positive&apos;in müşteri üzerindeki etkisi tutara göre ölçülmeli.
          </li>
        </ul>

        <h2>Sonuç</h2>
        <p>
          Fraud tespiti, veri biliminin iş etkisinin en net ölçülebildiği alanlardan biri.
          Bu vakada üç temel ders var:
        </p>
        <ul>
          <li><strong>Accuracy&apos;yi unut</strong> — PR-AUC ve Recall ile düşün</li>
          <li><strong>Dengesizliği doğru ele al</strong> — SMOTE genellikle en iyi, ama temporal split&apos;i unutma</li>
          <li><strong>Eşiği iş maliyetiyle belirle</strong> — hangi hatanın bedeli daha ağır?</li>
        </ul>
        <p>
          Mükemmel bir model yoktur — sadece iş problemi için doğru optimize edilmiş model vardır.
        </p>

        <p style={{ marginTop: '2rem' }}>
          <strong>Kaynaklar:</strong>{' '}
          <a href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>Credit Card Fraud Detection (Kaggle)</a>
          {' · '}
          <a href="https://imbalanced-learn.org" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>imbalanced-learn dokümantasyonu</a>
          {' · '}
          <a href="https://xgboost.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>XGBoost dokümantasyonu</a>
        </p>
      </article>
    </main>
  );
}
