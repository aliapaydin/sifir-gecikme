import LinearRegressionDemo from '../../../components/LinearRegressionDemo';

export default function LinearRegressionPost() {
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
        </div>
      </nav>

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

      <footer className="max-w-3xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
        </span>
      </footer>
    </main>
  );
}
