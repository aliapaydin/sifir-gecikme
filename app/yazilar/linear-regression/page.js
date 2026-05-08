import Yorumlar from '../../../components/Yorumlar';

export const metadata = {
  title: 'Linear Regression: Çizgiyi Sen Çiz',
  description: 'Noktaları sürükle, regresyon çizgisi ve R² anlık değişsin. İnteraktif linear regression demo. Türkçe.',
  keywords: ['linear regression türkçe', 'doğrusal regresyon', 'r kare', 'makine öğrenmesi türkçe'],
  openGraph: {
    title: 'Linear Regression İnteraktif Demo — Sıfır Gecikme',
    description: 'Noktaları sürükle, regresyon çizgisi anlık değişsin.',
  },
};

import LinearRegressionDemo from '../../../components/LinearRegressionDemo';

export default function LinearRegressionPost() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Linear regression: çizgiyi sen çiz
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>29 Nisan 2026 · 8 dakika okuma</p>

        <p>Bir kahve dükkanı sahibisin. Hava sıcak olduğunda dondurma satışın artıyor, soğuk olduğunda düşüyor. Peki yarın 28 derece olacak, ne kadar dondurma hazırlamalısın?</p>

        <p>İşte <strong>linear regression</strong> tam olarak bu soruyu cevaplar. Geçmiş veriden bir kalıp çıkarır, gelecek için tahmin yapar. Tüm makine öğrenmesinin atası diyebiliriz.</p>

        <h2>Önce dene, sonra okuyalım</h2>
        <p>Aşağıdaki demoda noktaları sürükle, yenilerini ekle. Mavi çizginin nasıl tepki verdiğini izle. R² değerini nasıl etkiliyor?</p>

        <LinearRegressionDemo />

        <h2>Peki bu çizgi nasıl çiziliyor?</h2>
        <p>Demoyla oynarken fark etmiş olabilirsin: çizgi her zaman noktaların "ortasından" geçiyor. Daha doğrusu, her noktanın çizgiye olan dikey uzaklığını ölçüp, bu uzaklıkların karelerinin toplamını minimize ediyor. Buna <strong>en küçük kareler yöntemi</strong> deniyor.</p>

        <p>Niye karelerin toplamı? Çünkü pozitif ve negatif hatalar birbirini sıfırlamasın diye. Bir nokta çizginin 2 birim üstünde, diğeri 2 birim altında olsa toplamları sıfır olur, sanki hata yokmuş gibi görünür. Kareleri alınca her ikisi de pozitif olur, gerçek "uzaklık" ortaya çıkar.</p>

        <h2>R² ne anlatır?</h2>
        <p>R² (R-kare) modelin veriyi ne kadar iyi açıkladığının ölçüsü. 1'e yakınsa noktalar çizgiye sıkı sıkıya yapışmış, 0'a yakınsa çizgi neredeyse rastgele dağılmış noktaların ortalamasından farksız.</p>

        <p>Önemli: yüksek R² <em>doğru model</em> demek değil. Aşırı uydurmuş da olabilirsin (overfitting). Veriye bakmadan sadece R²'ye güvenmek tehlikeli.</p>

        <h2>Python ile uygulama</h2>
        <pre>{`from sklearn.linear_model import LinearRegression
import numpy as np

# Sıcaklık (x) ve dondurma satışı (y)
X = np.array([[18], [22], [25], [28], [32]])
y = np.array([120, 180, 220, 280, 350])

model = LinearRegression()
model.fit(X, y)

print(f"Eğim: {model.coef_[0]:.2f}")
print(f"Kesişim: {model.intercept_:.2f}")
print(f"R²: {model.score(X, y):.3f}")

# Yarın 28 derece, kaç dondurma?
print(f"Tahmin: {model.predict([[28]])[0]:.0f}")`}</pre>

        <h2>Ne zaman işe yaramaz?</h2>
        <ul>
          <li>İlişki doğrusal değilse (örnek: üstel büyüme)</li>
          <li>Aşırı aykırı değerler (outlier) varsa, çizgi bozulur</li>
          <li>Değişkenler arası güçlü çoklu doğrusallık varsa</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>Sıradaki yazıda <strong>multiple regression</strong>: bir değil, birden fazla bağımsız değişkenle tahmin yapma.</p>
      </article>
    </main>
  );
}
