export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <span className="font-serif text-lg font-medium">Sıfır Gecikme</span>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <h1 className="font-serif text-5xl font-medium leading-tight mb-4" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Birlikte öğreniyoruz,<br/>birlikte deniyoruz.
        </h1>
        <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'var(--color-text-soft)' }}>
          Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler. Her kavramı önce dener, sonra konuşuruz.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>Son yazılar</div>

        <a href="/yazilar/linear-regression" className="block card mb-3" style={{ color: 'inherit' }}>
          <span className="badge badge-interactive mb-2.5 inline-block">interaktif</span>
          <h3 className="font-serif text-xl font-medium mt-2 mb-1.5" style={{ color: 'var(--color-text)' }}>Linear regression: çizgiyi sen çiz</h3>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text-mute)' }}>Noktaları sürükle, regresyon çizgisi ve R² anlık değişsin.</p>
          <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>29 Nisan 2026 · 8 dakika</p>
        </a>

        <a href="/yazilar/izmir-kira-analizi" className="block card mb-3" style={{ color: 'inherit' }}>
          <span className="badge badge-case mb-2.5 inline-block">vaka çalışması</span>
          <h3 className="font-serif text-xl font-medium mt-2 mb-1.5" style={{ color: 'var(--color-text)' }}>İzmir kira piyasası: 5.841 ilan, bir analist gözüyle</h3>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text-mute)' }}>Hangi ilçe gerçekten pahalı? m² fiyatı hikayeyi nasıl değiştiriyor?</p>
          <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>2024 verisi · 12 dakika</p>
        </a>
      </section>

      <footer className="max-w-3xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://instagram.com/sifirgecikme" target="_blank" rel="noopener noreferrer">Instagram</a>
        </span>
      </footer>
    </main>
  );
}
