import LinearRegressionDemo from '../../../components/LinearRegressionDemo';

export default function LinearRegressionPost() {
  return (
    <article className="min-h-screen bg-white text-gray-900 px-6 py-16 max-w-3xl mx-auto">
      <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Ana sayfa</a>
      <h1 className="text-4xl font-bold mt-6 mb-4">Linear Regression: Çizgiyi Sen Çiz</h1>
      <p className="text-gray-500 mb-12">29 Nisan 2026 · 8 dakika okuma</p>
      <p className="text-lg leading-relaxed mb-6">
        Bir kahve dükkanı sahibisin. Hava sıcak olduğunda dondurma satışın artıyor, soğuk olduğunda düşüyor. Peki yarın 28 derece olacak, ne kadar dondurma hazırlamalısın?
      </p>
      <p className="text-lg leading-relaxed mb-6">
        İşte <strong>linear regression</strong> tam olarak bu soruyu cevaplar. Geçmiş veriden bir kalıp çıkarır, gelecek için tahmin yapar. Tüm makine öğrenmesinin atası diyebiliriz.
      </p>
      <h2 className="text-2xl font-semibold mt-12 mb-4">Önce dene, sonra okuyalım</h2>
      <p className="text-lg leading-relaxed mb-6">
        Aşağıdaki demoda noktaları sürükle, yenilerini ekle. Mavi çizginin nasıl tepki verdiğini izle. R² değerini nasıl etkiliyor?
      </p>
      <LinearRegressionDemo />
      <h2 className="text-2xl font-semibold mt-12 mb-4">Peki bu çizgi nasıl çiziliyor?</h2>
      <p className="text-lg leading-relaxed mb-6">
        Demoyla oynarken fark etmiş olabilirsin: çizgi her zaman noktaların "ortasından" geçiyor. Daha doğrusu, her noktanın çizgiye olan dikey uzaklığını ölçüp, bu uzaklıkların karelerinin toplamını minimize ediyor. Buna <strong>en küçük kareler yöntemi</strong> deniyor.
      </p>
      <p className="text-lg leading-relaxed mb-6">
        Niye karelerin toplamı? Çünkü pozitif ve negatif hatalar birbirini sıfırlamasın diye. Bir nokta çizginin 2 birim üstünde, diğeri 2 birim altında olsa toplamları sıfır olur, sanki hata yokmuş gibi görünür. Kareleri alınca her ikisi de pozitif olur, gerçek "uzaklık" ortaya çıkar.
      </p>
      <h2 className="text-2xl font-semibold mt-12 mb-4">R² ne anlatır?</h2>
      <p className="text-lg leading-relaxed mb-6">
        R² (R-kare) modelin veriyi ne kadar iyi açıkladığının ölçüsü. 1'e yakınsa noktalar çizgiye sıkı sıkıya yapışmış, 0'a yakınsa çizgi neredeyse rastgele dağılmış noktaların ortalamasından farksız.
      </p>
      <p className="text-lg leading-relaxed mb-6">
        Önemli: yüksek R² <em>doğru model</em> demek değil. Aşırı uydurmuş da olabilirsin (overfitting). Veriye bakmadan sadece R²'ye güvenmek tehlikeli.
      </p>
      <h2 className="text-2xl font-semibold mt-12 mb-4">Python ile uygulama</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`from sklearn.linear_model import LinearRegression
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
print(f"Tahmin: {model.predict([[28]])[0]:.0f}")`}
      </pre>
      <h2 className="text-2xl font-semibold mt-12 mb-4">Ne zaman işe yaramaz?</h2>
      <ul className="text-lg leading-relaxed list-disc ml-6 space-y-2">
        <li>İlişki doğrusal değilse (örnek: üstel büyüme)</li>
        <li>Aşırı aykırı değerler (outlier) varsa, çizgi bozulur</li>
        <li>Değişkenler arası güçlü çoklu doğrusallık varsa</li>
      </ul>
      <p className="text-lg leading-relaxed mt-12 text-gray-600">
        Sıradaki yazıda <strong>multiple regression</strong>: bir değil, birden fazla bağımsız değişkenle tahmin yapma.
      </p>
    </article>
  );
}
