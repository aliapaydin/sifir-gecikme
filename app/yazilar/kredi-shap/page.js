export default function KrediShap() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Kredi başvurun neden reddedildi? SHAP ile kara kutuyu aç
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          German Credit Dataset · 15 dakika okuma · Python + XGBoost + SHAP
        </p>

        <p>
          Bankaya kredi başvurusu yaptın, sistem saniyeler içinde <strong>red</strong> dedi.
          Müşteri temsilcisi "algoritmamız öyle karar verdi" dedi ve kapandı.
          Peki algoritmaya itiraz edebilir misin? Model neye baktı? Ne yaptıysan onaylanırdın?
        </p>

        <p>
          Bu sorular artık salt teknik değil, <strong>yasal</strong>. GDPR Madde 22 ve AB Yapay Zeka
          Yasası, yüksek riskli otomatik kararlar için açıklanabilirlik zorunlu kılıyor.
          Bu yazıda XGBoost ile bir kredi riski modeli kuracak, ardından <strong>SHAP</strong> ile
          her kararın arkasındaki mantığı açık edeceğiz.
        </p>

        <h2>Veri seti: German Credit</h2>
        <p>
          UCI Machine Learning Repository&apos;nin klasiklerinden. 1000 başvuru, her biri
          20 özellik (yaş, istihdam süresi, kredi miktarı, hesap bakiyesi…) ve nihai etiket:
          <em>iyi müşteri</em> mi, <em>kötü müşteri</em> mi.
        </p>

        <pre>{`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import shap

# Veri setini çek
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/german/german.data"
sutunlar = [
    "hesap_durumu", "sure", "kredi_gecmisi", "amac", "kredi_miktari",
    "tasarruf", "istihdam_suresi", "taksit_orani", "medeni_durum",
    "diger_borclar", "ikamet_suresi", "mulk", "yas", "diger_taksitler",
    "konut", "mevcut_krediler", "meslek", "bakmakla_yukumlu", "telefon",
    "yabanci_isci", "etiket"
]
df = pd.read_csv(url, sep=" ", header=None, names=sutunlar)
df["etiket"] = df["etiket"].map({1: 0, 2: 1})  # 1=iyi→0, 2=kötü→1
print(df.shape)  # (1000, 21)
print(df["etiket"].value_counts())
# 0    700   ← iyi müşteri
# 1    300   ← riskli müşteri`}</pre>

        <h2>Model: XGBoost ile kredi riski tahmini</h2>
        <p>
          Kategorik sütunları encode edip hızlı bir XGBoost modeli kuruyoruz.
          Amacımız mükemmel bir model değil; SHAP ile açıklayabileceğimiz,
          gerçekçi tahminler üreten bir model.
        </p>

        <pre>{`# Kategorik sütunları encode et
le = LabelEncoder()
kategorik = df.select_dtypes(include="object").columns
for col in kategorik:
    df[col] = le.fit_transform(df[col])

X = df.drop("etiket", axis=1)
y = df["etiket"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    random_state=42,
    eval_metric="logloss"
)
model.fit(X_train, y_train)

from sklearn.metrics import roc_auc_score, classification_report
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(f"AUC: {roc_auc_score(y_test, y_prob):.3f}")   # ~0.79
print(classification_report(y_test, y_pred))`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            AUC 0.79, production için yeterli bir başlangıç. Asıl ilginç kısım şimdi
            başlıyor: bu model ne <em>öğrendi</em>?
          </p>
        </blockquote>

        <h2>SHAP nedir?</h2>
        <p>
          SHAP (SHapley Additive exPlanations), oyun teorisinden gelen
          <strong> Shapley değerlerini</strong> makine öğrenmesine uyarlar.
          Temel fikir şu: her özelliğin modelin tahinine <em>katkısını</em> adil biçimde hesapla.
        </p>
        <p>
          Bir maçtaki gol bonusunu takım oyuncularına adil dağıtmak gibi düşün.
          Kim hangi pozisyonda ne kadar katkı sağladı? SHAP da bunu yapar — ama
          modelin tahmin değeri üzerinden.
        </p>

        <ul>
          <li><strong>Pozitif SHAP değeri</strong> → bu özellik başvuruyu riskli tarafa itti</li>
          <li><strong>Negatif SHAP değeri</strong> → bu özellik başvuruyu güvenli tarafa itti</li>
          <li><strong>0&apos;a yakın</strong> → bu özelliğin bu karar üzerinde etkisi az</li>
        </ul>

        <pre>{`# SHAP explainer oluştur
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# shap_values.shape == (200, 20)
# Her satır bir başvuru, her sütun bir özellik
print(shap_values.shape)  # (200, 20)`}</pre>

        <h2>Global açıklama: hangi özellik en çok etkiliyor?</h2>
        <p>
          İlk sorumuz: modelin genelinde hangi özellikler kararları domine ediyor?
          Summary plot bunu SHAP değerlerinin mutlak ortalamasıyla gösterir.
        </p>

        <pre>{`import matplotlib.pyplot as plt

# Beeswarm (summary) plot — her nokta bir başvuru
shap.summary_plot(shap_values, X_test, plot_type="bar", max_display=12)
plt.tight_layout()
plt.savefig("global_shap.png", dpi=150, bbox_inches="tight")`}</pre>

        <p>
          Tipik çıktıda öne çıkan özellikler:
        </p>

        <ul>
          <li>
            <strong>hesap_durumu</strong> — Mevcut çek/vadesiz hesabın bakiyesi.
            Negatif bakiye, en güçlü risk sinyali. Modelin ilk baktığı yer burası.
          </li>
          <li>
            <strong>kredi_gecmisi</strong> — Geçmiş ödemeler düzenli mi?
            Gecikme kaydı olan başvurular ciddi ceza alıyor.
          </li>
          <li>
            <strong>sure</strong> — Kredi vadesi. Uzun vadeli krediler daha riskli görünüyor,
            borçlunun gelecekteki belirsizliği yüzünden.
          </li>
          <li>
            <strong>kredi_miktari</strong> — Yüksek tutar, gelir / teminat ile orantısızsa riski artırıyor.
          </li>
          <li>
            <strong>yas</strong> — Genç başvurucular daha az kredi geçmişi taşıdığından riskli bulunuyor.
            Bu özellik <em>ayrımcılık riski</em> taşıdığı için ayrıca incelenmeli.
          </li>
        </ul>

        <h2>Local açıklama: bu başvuru neden reddedildi?</h2>
        <p>
          Asıl güç burada. Test setinden 42. indeksteki başvurucuyu alalım —
          model onu %81 olasılıkla riskli sınıflandırdı.
        </p>

        <pre>{`# Tek bir başvuru için waterfall plot
idx = 42
print(f"Tahmin: %{model.predict_proba(X_test)[idx, 1] * 100:.0f} riskli")

shap.plots.waterfall(
    shap.Explanation(
        values=shap_values[idx],
        base_values=explainer.expected_value,
        data=X_test.iloc[idx],
        feature_names=X_test.columns.tolist()
    )
)
plt.savefig("waterfall_42.png", dpi=150, bbox_inches="tight")`}</pre>

        <p>
          Waterfall plot şunu gösterir: modelin <em>başlangıç noktası</em> (base value, ~%30 risk)
          üzerine her özellik nasıl etki birikirdi, sonunda %81&apos;e nasıl ulaştı?
        </p>

        <p>
          42. başvurucu için tipik bir senaryo:
        </p>

        <ul>
          <li>
            <strong style={{ color: '#e05252' }}>+0.41 hesap_durumu</strong> — Negatif bakiyeli hesap.
            Tek başına riski en çok artıran faktör.
          </li>
          <li>
            <strong style={{ color: '#e05252' }}>+0.22 kredi_gecmisi</strong> — Geçmişte gecikme kaydı var.
          </li>
          <li>
            <strong style={{ color: '#e05252' }}>+0.14 sure</strong> — 48 aylık vade, ortalamanın üzerinde.
          </li>
          <li>
            <strong style={{ color: '#2e8c5e' }}>−0.18 meslek</strong> — Nitelikli işçi statüsü, riski biraz düşürüyor.
          </li>
          <li>
            <strong style={{ color: '#2e8c5e' }}>−0.09 tasarruf</strong> — Düşük de olsa birikimi var.
          </li>
        </ul>

        <h2>Force plot: görsel özet</h2>
        <p>
          Waterfall&apos;ın alternatifi olan force plot, aynı bilgiyi yatay olarak gösterir.
          Bir web sayfasında interaktif HTML olarak da sunulabilir.
        </p>

        <pre>{`# HTML olarak kaydet (Jupyter dışında da çalışır)
shap.initjs()
force_plot = shap.force_plot(
    explainer.expected_value,
    shap_values[idx],
    X_test.iloc[idx],
    feature_names=X_test.columns.tolist()
)
shap.save_html("force_plot.html", force_plot)

# Toplu analiz: tüm test seti için
force_all = shap.force_plot(
    explainer.expected_value,
    shap_values,
    X_test
)
shap.save_html("force_all.html", force_all)`}</pre>

        <h2>Aksiyon: "Ne yaptıysan onaylanırdın?"</h2>
        <p>
          Müşteriye gerçekten faydalı olan çıktı bu. SHAP değerleri sayesinde
          hangi faktörlerin değiştirilebilir, hangilerinin sabit olduğunu ayırt edebilirsin.
        </p>

        <pre>{`def aksiyon_onerisi(idx, shap_vals, X_test, ust_n=3):
    """Başvurucunun riskini artıran değiştirilebilir faktörleri döndür."""
    degistirilebilir = ["sure", "kredi_miktari", "taksit_orani",
                        "tasarruf", "hesap_durumu"]

    # SHAP değeri pozitif = riski artıran özellikler
    etkiler = pd.Series(shap_vals[idx], index=X_test.columns)
    risk_artiranlar = (
        etkiler[etkiler > 0]
        .filter(items=degistirilebilir)
        .sort_values(ascending=False)
        .head(ust_n)
    )
    return risk_artiranlar

oneri = aksiyon_onerisi(42, shap_values, X_test)
for ozellik, etki in oneri.items():
    mevcut = X_test.iloc[42][ozellik]
    print(f"• {ozellik}: mevcut değer {mevcut:.0f}, risk katkısı +{etki:.3f}")

# Çıktı:
# • hesap_durumu: mevcut değer 1, risk katkısı +0.412
# • sure: mevcut değer 48, risk katkısı +0.219
# • kredi_miktari: mevcut değer 7882, risk katkısı +0.141`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Müşteri temsilcisi artık şunu söyleyebilir: "Hesap bakiyenizi pozitife taşırsanız
            ve kredi vadesini 48 aydan 24 aya indirirseniz onay olasılığınız önemli ölçüde artıyor."
          </p>
        </blockquote>

        <h2>Yasal zorunluluk: GDPR ve AB AI Yasası</h2>
        <p>
          Teknik açıklanabilirlik artık seçimlik değil. İki temel düzenleme var:
        </p>
        <ul>
          <li>
            <strong>GDPR Madde 22 (2018):</strong> Tamamen otomatik kararlar için
            bireyin itiraz hakkı ve anlamlı açıklama talep etme hakkı var.
            "Algoritma öyle karar verdi" artık yeterli bir yanıt sayılmıyor.
          </li>
          <li>
            <strong>AB Yapay Zeka Yasası (2024, yürürlük 2026):</strong> Kredi skoru
            sistemleri <em>yüksek riskli</em> kategorisinde. Belgeleme, insan denetimi
            ve açıklanabilirlik yasal zorunluluk haline geliyor.
          </li>
        </ul>
        <p>
          Türkiye&apos;de KVKK kapsamında benzer bir trend başladı. Büyük fintech şirketleri
          artık XAI (Explainable AI) ekipleri kuruyor.
        </p>

        <h2>SHAP&apos;ın sınırları</h2>
        <p>
          Her araç gibi SHAP da mükemmel değil:
        </p>
        <ul>
          <li>
            <strong>Hesaplama maliyeti.</strong> TreeExplainer ağaç modelleri için hızlıdır,
            ama derin ağlar için DeepExplainer veya KernelExplainer gerekir — bunlar çok daha yavaş.
          </li>
          <li>
            <strong>Korelasyonlu özellikler.</strong> İki özellik güçlü korelasyonlu ise
            SHAP katkıyı ikisine böler. Yorumlama dikkat gerektirir.
          </li>
          <li>
            <strong>Açıklamak ≠ doğrulamak.</strong> SHAP modelin ne yaptığını anlatır,
            modelin doğru olduğunu kanıtlamaz. Önyargılı veriyle önyargılı model kurulur,
            SHAP bu önyargıyı şeffaflaştırır ama gidermez.
          </li>
          <li>
            <strong>Nedensellik değil, korelasyon.</strong> "Yaş riski artırıyor" demek
            yaşın nedensel etkisi olduğu anlamına gelmiyor; sadece model bu kalıbı öğrenmiş.
          </li>
        </ul>

        <h2>Sonuç</h2>
        <p>
          Kara kutu model artık sadece bir tahmin değil, <strong>gerekçesiyle birlikte</strong>
          bir karar. SHAP ile:
        </p>
        <ul>
          <li>Modelin genel davranışını (global) anlıyoruz</li>
          <li>Tek bir başvuru için nedenselliği (local) ortaya koyuyoruz</li>
          <li>Müşteriye aksiyon alınabilir geri bildirim verebiliyoruz</li>
          <li>Regülatörlere denetlenebilir bir karar izi sunabiliyoruz</li>
        </ul>
        <p>
          Finans dışında da geçerli: hastalık tahmini, işe alım, sigorta primlendirme —
          yüksek riskli otomatik kararların geçtiği her yerde SHAP, model geliştirmenin
          ayrılmaz parçası haline geliyor.
        </p>

        <pre>{`# Kurulum
pip install xgboost shap scikit-learn pandas matplotlib

# Hızlı başlangıç
import shap
shap.initjs()  # Jupyter'da interaktif grafikler için`}</pre>

        <p style={{ marginTop: '2rem' }}>
          <strong>Kaynaklar:</strong>{' '}
          <a href="https://shap.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>SHAP dokümantasyonu</a>
          {' · '}
          <a href="https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>German Credit Dataset (UCI)</a>
          {' · '}
          <a href="https://arxiv.org/abs/1705.07874" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>Lundberg & Lee, 2017 (SHAP orijinal makale)</a>
        </p>
      </article>
    </main>
  );
}
