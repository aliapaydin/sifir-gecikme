import Yorumlar from '../../../components/Yorumlar';
import LojistikRegressionDemo from '../../../components/LojistikRegressionDemo';

export const metadata = {
  title: 'Lojistik Regresyon: Olasılık Sınıflandırıcı',
  description: 'Sigmoid eğrisini sürükle, karar sınırını izle. Threshold\'u kaydır, precision-recall dengesi değişsin. Türkçe lojistik regresyon rehberi.',
  keywords: ['lojistik regresyon türkçe', 'logistic regression', 'sigmoid fonksiyon', 'karar sınırı', 'makine öğrenmesi türkçe', 'sınıflandırma'],
  openGraph: {
    title: 'Lojistik Regresyon İnteraktif Demo — Sıfır Gecikme',
    description: 'Sigmoid eğrisini sürükle, karar sınırını izle. Threshold\'u kaydır, precision-recall dengesi değişsin.',
  },
};

export default function LojistikRegressionPost() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Lojistik regresyon: olasılık sınıflandırıcı
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>26 Mayıs 2026 · 12 dakika okuma</p>

        <p>E-posta kutuna gelen her mesajı tek tek okuyup "spam mı, değil mi?" diye ayrıştıran bir müdür hayal et. Her gün 500 e-posta, her e-postayı 2 saniyede değerlendirse bile günde 17 dakika harcar. Buna bir de tatil günleri, hasta günleri ekle — sistem çöker.</p>

        <p>1990'ların sonunda Gmail'in atası olan Hotmail'in mühendisleri bu sorunu çözmek için <strong>lojistik regresyon</strong>a başvurdu. Model, bir e-postanın spam olup olmadığını olasılıkla ifade etti: "Bu mesaj %94 ihtimalle spam." Ve bu ihtimal eşiği aşarsa — örneğin %50'nin üstündeyse — otomatik olarak çöpe gitti.</p>

        <p>İşte tam bu yüzden lojistik regresyon, makine öğrenmesinin en temel sınıflandırma araçlarından biri. Adında "regresyon" yazan ama aslında sınıflandırma yapan bu algoritma, sigmoid fonksiyonu sayesinde herhangi bir sayıyı 0 ile 1 arasına sıkıştırır — ve bunu bir olasılık olarak yorumlar.</p>

        <h2>Sigmoid: her şeyi olasılığa çeviren eğri</h2>
        <p>Linear regression'dan hatırlarsın: bir denklem <code>w₀ + w₁x₁ + w₂x₂ + ...</code> biçiminde herhangi bir sayı üretir. Ama biz 0–1 arasında bir olasılık istiyoruz. İşte sigmoid fonksiyonu tam burada devreye girer:</p>

        <pre>{`σ(z) = 1 / (1 + e^(-z))`}</pre>

        <p>z sıfır olduğunda σ(0) = 0.5 — tam belirsizlik. z büyüdükçe 1'e, küçüldükçe 0'a yaklaşır. Aşağıda dene:</p>

        <LojistikRegressionDemo bölüm="sigmoid" />

        <p>Gördüğün gibi z değerini sürüklediğinde olasılık anlık değişiyor. z = +3 civarında neredeyse kesin pozitif (%95), z = −3'te neredeyse kesin negatif (%5). Bu S şekilli eğri, lojistik regresyonun kalbinde yer alır.</p>

        <h2>Karar sınırı nedir?</h2>
        <p>İki özelliği olan bir veri setini düşün — örneğin "e-posta uzunluğu" ve "büyük harf oranı". Her e-posta bu iki özellik uzayında bir nokta. Lojistik regresyon, bu uzayda bir <strong>karar sınırı</strong> çizer: sınırın bir tarafındaki noktalar sınıf 1 (spam), diğer tarafındakiler sınıf 0 (spam değil).</p>

        <p>Bu sınır, modelin öğrendiği ağırlıklarla (<em>w₀, w₁, w₂</em>) belirlenir. Gradient descent ile bu ağırlıklar iteratif olarak güncellenir — her adımda hata azalır, sınır iki kümeyi daha iyi ayırır.</p>

        <LojistikRegressionDemo bölüm="karar" />

        <h2>Threshold: hassasiyet dengesi</h2>
        <p>Yukarıdaki demoda fark etmişsindir: <strong>threshold slider</strong>'ı kaydırdıkça karar sınırı kayıyor ve metrikler değişiyor.</p>

        <p>Threshold'u yükseltirsen — diyelim %80 — model çok daha az noktayı "sınıf 1" olarak sınıflandırır. Bu kesinliği artırır: sınıf 1 dediğinde gerçekten 1'dir. Ama bir sürü gerçek sınıf 1 noktasını kaçırırsın — duyarlılık düşer.</p>

        <p>Threshold'u düşürürsen — diyelim %30 — model çok daha cömert olur, neredeyse her şeyi sınıf 1 sayar. Duyarlılık yükselir, ama kesinlik düşer: yanlış alarmlar çoğalır.</p>

        <p>Bu denge <strong>precision-recall trade-off</strong> olarak bilinir. Spam filtresinde yanlış alarm (gerçek e-postanın spam sayılması) çok kötüdür — o zaman threshold'u yüksek tut. Kanser teşhisinde ise gerçek vakayı kaçırmak (düşük recall) daha tehlikeli — threshold'u düşür.</p>

        <h2>Python ile uygulama</h2>
        <pre>{`from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import numpy as np

# Özellikler: e-posta uzunluğu, büyük harf oranı
X = np.array([
    [120, 0.05],   # normal
    [45,  0.02],   # normal
    [310, 0.42],   # spam
    [280, 0.38],   # spam
    [90,  0.08],   # normal
    [400, 0.55],   # spam
])
y = [0, 0, 1, 1, 0, 1]

model = LogisticRegression()
model.fit(X, y)

# Olasılıklar
probs = model.predict_proba(X)[:, 1]
print("Spam olasılıkları:", probs.round(2))

# Farklı threshold dene
threshold = 0.4
preds = (probs >= threshold).astype(int)
print(classification_report(y, preds, target_names=['Normal', 'Spam']))

# Karar sınırı eğimi
# w0*x0 + w1*x1 + b = 0  →  x1 = -(w0*x0 + b) / w1
w = model.coef_[0]
b = model.intercept_[0]
print(f"Ağırlıklar: {w.round(3)}, bias: {b:.3f}")`}</pre>

        <h2>Doğrusal olmayan durumlar</h2>
        <p>Lojistik regresyon yalnızca <em>doğrusal</em> karar sınırı çizebilir — düz bir çizgi (veya 3D'de düzlem). Verinin iki kümesi iç içe geçmişse ya da halka biçimindeyse bu yetmez. O zaman feature engineering (özellik dönüşümü), kernel yöntemleri veya derin öğrenme devreye girer. Ama pek çok gerçek dünya probleminde veriler yeterince ayrışıktır ve lojistik regresyon hızlı, yorumlanabilir ve güvenilir bir baseline sunar.</p>

        <h2>Özet</h2>
        <ul>
          <li>Lojistik regresyon, sigmoid fonksiyonu ile herhangi bir sayıyı 0–1 arası olasılığa çevirir</li>
          <li>Öğrenilen ağırlıklar, özellik uzayında doğrusal bir karar sınırı tanımlar</li>
          <li>Threshold seçimi, kesinlik ve duyarlılık arasındaki dengeyi belirler — iş problemine göre optimize edilmeli</li>
          <li>Basit, hızlı ve yorumlanabilir: yeni bir sınıflandırma probleminde her zaman ilk denenen model olmalı</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>Sıradaki yazıda <strong>SVM (Destek Vektör Makineleri)</strong>: margin'i maksimize eden karar sınırı ve kernel hilesi.</p>

        <Yorumlar />
      </article>
    </main>
  );
}
