export default function Hakkimda() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <a href="/" className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</a>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/">Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>Hakkımda</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14">

        <div className="flex items-start gap-6 mb-12">
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 500, color: '#ffffff', flexShrink: 0 }} className="font-serif">A</div>
          <div>
            <h1 className="font-serif text-3xl font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Ali Apaydın</h1>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-soft)' }}>Veri Bilimi Yöneticisi · İzmir</p>
            <div className="flex gap-2 flex-wrap">
              <span className="badge badge-interactive">15+ yıl deneyim</span>
              <span className="badge badge-guide">Python · SQL · Azure</span>
              <span className="badge badge-case">Power BI · Tableau</span>
            </div>
          </div>
        </div>

        <div className="prose-article">
          <p>
            Merhaba. Ben Ali — İzmir'de yaşayan, 15 yılı aşkın süredir veri bilimi alanında çalışan biriyim. Bilgi teknolojileriyle başlayan bir yolculuk, zamanla veriyle kurduğum derin bir ilişkiye dönüştü.
          </p>

          <p>
            Şu an bir teknoloji şirketinde Veri Bilimi Yöneticisi olarak çalışıyorum. Python pipeline'ları, Databricks, Azure Data Factory, GCP, müşteri deneyimi analitiği ve dashboard geliştirme günlük hayatımın bir parçası. Sayıların arkasındaki hikayeyi bulmak, onu doğru insana doğru şekilde anlatmak benim için hâlâ en heyecan verici şey.
          </p>

          <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0', borderRadius: 0 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
              "Bu alanda öğrenmeye çalışırken Türkçe kaynak bulmak gerçekten zordu. Sıfır Gecikme'yi tam da bu yüzden kurdum."
            </p>
          </blockquote>

          <p>
            Burada bulacakların soyut değil, çalışan şeyler. İnteraktif simülasyonlar, gerçek Türkçe veriyle vaka çalışmaları, pratik araçlar. Ne ezberleme ne de copy-paste. Kavramı önce denersin, sonra konuşuruz.
          </p>

          <p>
            Hedefim tek: yeni başlayan, kariyer planlayan veya bu yolda gelişmek isteyen herkese — kendi zamanında ve kendi hızında öğrenebileceği, Türkçe, dürüst bir kaynak olmak. Bir zamanlar ben de o kaynağı arıyordum.
          </p>

          <p>
            İşin dışında bir fincan kahveyle kitap okurken ya da video oyunlarının dünyasında kaybolurken bulabilirsin beni. Müzik her zaman açık.
          </p>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid var(--color-border)' }}>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-mute)' }}>İletişim</div>
          <div className="flex gap-3 flex-wrap">
            <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer" className="card text-sm" style={{ padding: '8px 14px', color: 'var(--color-text)' }}>
              X · @sifirgecikme
            </a>
            <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer" className="card text-sm" style={{ padding: '8px 14px', color: 'var(--color-text)' }}>
              LinkedIn · aliapaydin35
            </a>
            <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer" className="card text-sm" style={{ padding: '8px 14px', color: 'var(--color-text)' }}>
              GitHub · aliapaydin
            </a>
            <a href="https://instagram.com/sifirgecikme" target="_blank" rel="noopener noreferrer" className="card text-sm" style={{ padding: '8px 14px', color: 'var(--color-text)' }}>
              Instagram · @sifirgecikme
            </a>
            <a href="mailto:sifirgecikme@gmail.com" className="card text-sm" style={{ padding: '8px 14px', color: 'var(--color-text)' }}>
              sifirgecikme@gmail.com
            </a>
          </div>
        </div>

      </article>

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
