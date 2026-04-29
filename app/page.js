export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-4">Sıfır Gecikme</h1>
      <p className="text-xl text-gray-600 mb-12">
        Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler.
      </p>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Burada neler var?</h2>
        <ul className="space-y-3 text-lg">
          <li>Kavramları oynayarak öğrenebileceğin interaktif simülasyonlar</li>
          <li>Türkçe veriyle gerçek vaka çalışmaları</li>
          <li>A/B test, örneklem büyüklüğü gibi pratik araçlar</li>
          <li>Veri kariyeri ve raporlama üzerine yazılar</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Yazılar</h2>
        <a href="/yazilar/linear-regression" className="block p-6 border border-gray-200 rounded-lg hover:border-gray-400 transition">
          <h3 className="text-xl font-medium mb-2">Linear Regression: Çizgiyi Sen Çiz</h3>
          <p className="text-gray-600">Doğrusal regresyonu interaktif olarak keşfet. Noktaları sürükle, R² nasıl değişiyor gör.</p>
        </a>
      </section>
      <footer className="mt-20 pt-8 border-t border-gray-200 text-sm text-gray-500">
        Ali Apaydın
      </footer>
    </main>
  );
}
