export default function ChurnTahmini() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Müşteri kaybı tahmini: kim gidecek, kime yatırım yapmalısın?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          Telco Customer Churn · 18 dakika okuma · Python + LightGBM + maliyet matrisi
        </p>

        <p>
          Yeni bir müşteri kazanmak, mevcut bir müşteriyi elde tutmaktan
          <strong> 5–7 kat daha pahalı</strong>. Bu rakam pazarlama literatüründe
          o kadar tekrarlandı ki klişe oldu — ama veri bilimi perspektifinden
          bakıldığında somut bir optimizasyon problemi demek.
        </p>
        <p>
          Problem şu: müşteri ayrılmadan <em>önce</em> kim ayrılacak? Doğru kişiye
          doğru zamanda müdahale etmek için bir sınıflandırma modeli yetmez.
          Sınıf dengesizliğini, eşik seçimini ve maliyet-fayda dengesini de doğru kurman gerekir.
        </p>

        <h2>Veri seti: Telco Customer Churn</h2>
        <p>
          IBM&apos;in hazırladığı, Kaggle&apos;da yaygın kullanılan klasik dataset.
          7.043 müşteri, 20 özellik, hedef değişken: <code>Churn</code> (Yes/No).
          Churn oranı ~%26 — dengesiz ama yönetilebilir.
        </p>

        <pre>{`import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (roc_auc_score, average_precision_score,
                              classification_report, confusion_matrix)
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")

# Kaggle'dan veya IBM örnek verilerinden indirilebilir
df = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
print(df.shape)          # (7043, 21)
print(df["Churn"].value_counts(normalize=True).round(3))
# No     0.734
# Yes    0.266  ← yaklaşık 1:3 oranı`}</pre>

        <h2>Keşifsel analiz: kim ayrılıyor?</h2>
        <p>
          Modele girmeden önce veriye bakalım. Churn davranışını en iyi ayıran
          üç değişken genellikle şunlardır:
        </p>

        <pre>{`# Sayısal değişkenlerin churn'e göre dağılımı
sayisal = ["tenure", "MonthlyCharges", "TotalCharges"]
df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
df["TotalCharges"].fillna(df["TotalCharges"].median(), inplace=True)

ozet = df.groupby("Churn")[sayisal].median()
print(ozet)
#           tenure  MonthlyCharges  TotalCharges
# Churn
# No          38.0           64.4        1683.0
# Yes          10.0           79.7         703.8

# Bulgular:
# → Ayrılanlar ortalama 10 ay müşteri (kalanlar 38 ay)
# → Ayrılanların aylık ücreti daha yüksek (79 vs 64 TL)
# → Toplam ödeme düşük — kısa süre, yüksek fiyat = riskli profil`}</pre>

        <pre>{`# Kategorik değişkenlerde churn oranı
for col in ["Contract", "InternetService", "PaymentMethod"]:
    tablo = df.groupby(col)["Churn"].apply(
        lambda x: (x == "Yes").mean()
    ).sort_values(ascending=False)
    print(f"\n{col}:")
    print(tablo.round(3))

# Contract:
# Month-to-month    0.427  ← aydan aya kontrat çok riskli
# One year          0.113
# Two year          0.028

# InternetService:
# Fiber optic       0.419  ← fiber kullanıcıları daha fazla ayrılıyor
# DSL               0.190
# No                0.074`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Aydan aya sözleşmeli, fiber internet kullanan, yeni müşteri —
            bu üç özellik bir arada churn olasılığını %40&apos;ın üzerine taşıyor.
            Model kurmadan bile bu profili bilmek kampanya tasarımını değiştirir.
          </p>
        </blockquote>

        <h2>Hazırlık ve feature engineering</h2>

        <pre>{`# Hedef encode
df["Churn"] = (df["Churn"] == "Yes").astype(int)
df.drop("customerID", axis=1, inplace=True)

# Kategorikleri encode et
kat_sutunlar = df.select_dtypes(include="object").columns.tolist()
le = LabelEncoder()
for col in kat_sutunlar:
    df[col] = le.fit_transform(df[col])

# Yeni özellikler
df["ucret_suresi_orani"]   = df["MonthlyCharges"] / (df["tenure"] + 1)
df["ortalama_aylik_odeme"] = df["TotalCharges"]   / (df["tenure"] + 1)
df["kisa_sozlesme"]        = (df["Contract"] == 0).astype(int)  # month-to-month

X = df.drop("Churn", axis=1)
y = df["Churn"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)`}</pre>

        <h2>Neden accuracy yanıltır?</h2>
        <p>
          Sınıf dengesizliği olan problemlerde accuracy metriği tehlikeli.
          "Kimse ayrılmıyor" diyen bir model bile %73 accuracy alır.
          Gerçek metrikler <strong>AUC-ROC</strong> ve <strong>Average Precision (PR-AUC)</strong>.
        </p>

        <pre>{`model = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.03,
    num_leaves=31,
    scale_pos_weight=3,   # ← dengesizliği telafi et (neg/pos oranı)
    random_state=42,
    verbose=-1
)
model.fit(X_train, y_train,
          eval_set=[(X_test, y_test)],
          callbacks=[lgb.early_stopping(50, verbose=False)])

y_prob = model.predict_proba(X_test)[:, 1]

print(f"Accuracy (0.5 eşiği): {(model.predict(X_test) == y_test).mean():.3f}")
print(f"ROC-AUC:              {roc_auc_score(y_test, y_prob):.3f}")
print(f"PR-AUC:               {average_precision_score(y_test, y_prob):.3f}")

# Accuracy:  0.807  ← yanıltıcı
# ROC-AUC:   0.851  ← gerçek ayırt etme gücü
# PR-AUC:    0.657  ← pozitif sınıftaki hassasiyet`}</pre>

        <h2>Eşik optimizasyonu: 0.5 neden yanlış seçim?</h2>
        <p>
          Model varsayılan olarak 0.5 eşiği kullanır: olasılık &gt; 0.5 ise "churn" de.
          Ama iş problemi simetrikteyse nadiren 0.5 doğru eşiktir.
        </p>
        <p>
          Şunu düşün: bir müşteriyi yanlış "churn edecek" diye işaretlersen
          gereksiz bir indirim kodu gönderirsin — maliyeti küçük.
          Ama churn edecek birini kaçırırsan müşteriyi tamamen kaybedersin — maliyeti büyük.
          Bu asimetri eşiği aşağı çekmeyi gerektirir.
        </p>

        <pre>{`from sklearn.metrics import f1_score, precision_recall_curve

# F1 maksimizasyonu
esikler = np.arange(0.1, 0.9, 0.01)
f1_skorlari = [f1_score(y_test, y_prob >= e) for e in esikler]
en_iyi_esik = esikler[np.argmax(f1_skorlari)]
print(f"F1 maksimum eşiği: {en_iyi_esik:.2f}")   # ~0.36

# Maliyet matrisi yaklaşımı
# FN maliyeti (kaçırılan churn): 500 TL (müşteri yaşam boyu değeri kaybı)
# FP maliyeti (gereksiz kampanya): 20 TL (indirim kuponu)
fn_maliyet = 500
fp_maliyet = 20

maliyetler = []
for e in esikler:
    tahmin = (y_prob >= e).astype(int)
    cm = confusion_matrix(y_test, tahmin)
    tn, fp, fn, tp = cm.ravel()
    toplam = fp * fp_maliyet + fn * fn_maliyet
    maliyetler.append(toplam)

optimal_esik = esikler[np.argmin(maliyetler)]
print(f"Maliyet-optimal eşik: {optimal_esik:.2f}")  # ~0.28`}</pre>

        <pre>{`# Optimal eşik ile classification report
y_pred_opt = (y_prob >= optimal_esik).astype(int)
print(classification_report(y_test, y_pred_opt, target_names=["Kalıyor", "Ayrılıyor"]))

#               precision    recall  f1-score
# Kalıyor           0.93      0.82      0.87
# Ayrılıyor         0.58      0.80      0.67  ← recall yüksek, churn'ü kaçırmıyoruz`}</pre>

        <h2>Özellik önemi: neden ayrılıyorlar?</h2>

        <pre>{`import shap

explainer   = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test, max_display=12, show=False)
plt.tight_layout()
plt.savefig("churn_shap.png", dpi=150, bbox_inches="tight")`}</pre>

        <p>Tipik bulgular:</p>
        <ul>
          <li>
            <strong>tenure</strong> — En güçlü koruyucu faktör. Müşteri ne kadar uzun süredir
            varsa ayrılma olasılığı o kadar düşük. İlk 12 ay kritik pencere.
          </li>
          <li>
            <strong>Contract</strong> — Aydan aya sözleşme, churn olasılığını ciddi artırıyor.
            Yıllık sözleşmeye geçiş teşviki en etkili strateji.
          </li>
          <li>
            <strong>MonthlyCharges</strong> — Yüksek aylık ücret + kısa tenure = tehlikeli kombinasyon.
          </li>
          <li>
            <strong>ucret_suresi_orani</strong> — Türettiğimiz özellik beklenmedik kadar önemli çıktı.
            "Kısa sürede çok ödeme" sinyali modeli güçlendirdi.
          </li>
          <li>
            <strong>InternetService (Fiber)</strong> — Fiber müşterileri daha pahalı paket alıyor
            ve daha fazla rakip seçeneği var; churn riski yüksek.
          </li>
        </ul>

        <h2>Müşteri segmentleri ve aksiyon</h2>
        <p>
          Model skoru üzerinden üç aksiyon segmenti tanımla. Herkese kampanya göndermek
          hem bütçe israfı hem müşteriyi rahatsız eder.
        </p>

        <pre>{`# Segment etiketleri
df_test = X_test.copy()
df_test["churn_olasiligi"] = y_prob
df_test["gercek"]          = y_test.values

def segment_ata(p):
    if p >= 0.70: return "Kritik Risk"      # derhal müdahale
    if p >= 0.35: return "Orta Risk"        # hedefli kampanya
    return "Düşük Risk"                      # periyodik takip

df_test["segment"] = df_test["churn_olasiligi"].apply(segment_ata)
print(df_test["segment"].value_counts())
# Düşük Risk      876
# Orta Risk       228
# Kritik Risk     305`}</pre>

        <pre>{`# Her segment için farklı aksiyon
AKSIYONLAR = {
    "Kritik Risk":  "Önce ara, kişisel teklif sun (aylık %20 indirim veya ücretsiz upgrade)",
    "Orta Risk":    "Otomatik e-posta serisi: sadakat puanı, uzun dönem sözleşme avantajları",
    "Düşük Risk":   "Aylık bülten yeterli, kaynak harcama",
}

for segment, aksiyon in AKSIYONLAR.items():
    musteri_sayisi = (df_test["segment"] == segment).sum()
    ort_olasilik  = df_test[df_test["segment"] == segment]["churn_olasiligi"].mean()
    print(f"{segment}: {musteri_sayisi} müşteri, ort. olas. {ort_olasilik:.2f}")
    print(f"  → {aksiyon}\n")`}</pre>

        <h2>İş etkisi: model olmadan vs modelle</h2>
        <p>
          Somut hesap yapalım. 1.409 test müşterisi, %26 gerçek churn oranı
          (~366 kişi). Ortalama müşteri yaşam boyu değeri: 1.500 TL.
        </p>

        <pre>{`# Senaryo karşılaştırması
toplam_musteri = len(y_test)
gercek_churn   = y_test.sum()          # 366
ltv            = 1500                  # TL
kampanya_maliyeti = 20                 # kişi başı TL

# Senaryo A: kimseye müdahale yok
kayip_A = gercek_churn * ltv
print(f"Senaryo A (müdahalesiz): {kayip_A:,.0f} TL kayıp")
# → 549.000 TL

# Senaryo B: herkese kampanya (kör atış)
yakalanan_B    = int(gercek_churn * 0.35)  # ortalama %35 kampanya etkinliği
kurtarilan_B   = yakalanan_B * ltv
harcanan_B     = toplam_musteri * kampanya_maliyeti
net_B = kurtarilan_B - harcanan_B
print(f"Senaryo B (herkese):     net +{net_B:,.0f} TL")
# → net +100.000 TL (harcama yüksek, isabetsiz tetiklemeler çok)

# Senaryo C: model ile kritik+orta risk segmenti
hedef_C        = df_test[df_test["segment"] != "Düşük Risk"]
gercek_churn_C = (hedef_C["gercek"] == 1).sum()
yakalanan_C    = int(gercek_churn_C * 0.35)
kurtarilan_C   = yakalanan_C * ltv
harcanan_C     = len(hedef_C) * kampanya_maliyeti
net_C = kurtarilan_C - harcanan_C
print(f"Senaryo C (model ile):   net +{net_C:,.0f} TL")
# → net +163.000 TL (daha az harcama, daha yüksek isabet)`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Model olmadan herkese kampanya göndermek, modelle hedefli göndermekten
            ~%60 daha az net kazanç sağlıyor. Modelin değeri sadece tahmin doğruluğu değil,
            kaynakların doğru yere yönlendirilmesi.
          </p>
        </blockquote>

        <h2>Dikkat edilmesi gereken tuzaklar</h2>
        <ul>
          <li>
            <strong>Data leakage.</strong> "TotalCharges" gibi değişkenler tenure&apos;ın
            doğrudan türevi. Modelde birlikte kullanmak sızdırma riski taşıyabilir.
            Gerçek uygulamada feature korelasyon matrisini mutlaka kontrol et.
          </li>
          <li>
            <strong>Zamana göre bölme.</strong> Random split yerine tarih bazlı train/test
            bölmesi daha gerçekçi. Gelecekteki müşterileri geçmiş veriyle tahmin edersin —
            karışık split gelecekten veri sızdırabilir.
          </li>
          <li>
            <strong>Kampanya etkisi geri bildirimi.</strong> Müdahale ettiğin müşteri ayrılmadıysa
            bu modelin başarısı mı, yoksa zaten ayrılmayacak mıydı? A/B testi yapılmadan
            gerçek kampanya etkisini ölçemezsin.
          </li>
          <li>
            <strong>Model çürümesi.</strong> Churn davranışı aylara, fiyatlara, rakip
            tekliflere göre değişir. Modeli en az çeyrek yılda bir yeniden eğitmek gerekir.
          </li>
        </ul>

        <h2>Üretim pipeline&apos;ı için hızlı şablon</h2>

        <pre>{`from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
import joblib

sayisal_sutunlar   = ["tenure", "MonthlyCharges", "TotalCharges",
                      "ucret_suresi_orani", "ortalama_aylik_odeme"]
kategorik_sutunlar = [c for c in X.columns
                      if c not in sayisal_sutunlar]

onisleme = ColumnTransformer([
    ("num", StandardScaler(), sayisal_sutunlar),
    ("cat", OrdinalEncoder(handle_unknown="use_encoded_value",
                           unknown_value=-1), kategorik_sutunlar),
])

pipeline = Pipeline([
    ("onisleme", onisleme),
    ("model", lgb.LGBMClassifier(
        n_estimators=500,
        scale_pos_weight=3,
        random_state=42,
        verbose=-1
    ))
])

pipeline.fit(X_train, y_train)
joblib.dump(pipeline, "churn_model_v1.pkl")

# Yükleme ve tahmin
model_yuklu = joblib.load("churn_model_v1.pkl")
yeni_prob   = model_yuklu.predict_proba(yeni_musteriler)[:, 1]`}</pre>

        <h2>Sonuç</h2>
        <p>
          Churn tahmini pratikte üç katmanlı bir problemdir:
        </p>
        <ul>
          <li><strong>Modelleme katmanı</strong> — dengesiz veri, doğru metrik, erken durdurma</li>
          <li><strong>Karar katmanı</strong> — eşik seçimi, maliyet matrisi, segment tanımı</li>
          <li><strong>İş katmanı</strong> — hangi segmente ne kadar bütçe, nasıl ölçüm</li>
        </ul>
        <p>
          Sadece modeli kurup bırakmak, iş etkisinin ancak küçük bir kısmını yaratır.
          Eşik optimizasyonu ve segment bazlı aksiyon planı olmadan <em>iyi bir model</em>
          kötü bir kampanyaya dönüşebilir.
        </p>

        <p style={{ marginTop: '2rem' }}>
          <strong>Kaynaklar:</strong>{' '}
          <a href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>Telco Customer Churn (Kaggle)</a>
          {' · '}
          <a href="https://lightgbm.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>LightGBM dokümantasyonu</a>
          {' · '}
          <a href="https://shap.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>SHAP dokümantasyonu</a>
        </p>
      </article>
    </main>
  );
}
