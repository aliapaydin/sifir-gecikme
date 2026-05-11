export const metadata = {
  title: 'Veri Analisti Portföyü Nasıl Hazırlanır?',
  description: 'GitHub, Kaggle, proje seçimi, README yazımı ve işe alımcıların gerçekten baktığı şeyler. Türkçe veri analisti portföy rehberi.',
  keywords: ['veri analisti portföy', 'data analyst portfolio', 'github portföy', 'kaggle proje', 'veri bilimi portföy türkçe'],
  openGraph: {
    title: 'Veri Analisti Portföyü Nasıl Hazırlanır? — Sıfır Gecikme',
    description: 'GitHub, Kaggle, proje seçimi ve işe alımcıların gerçekten baktığı şeyler.',
  },
};

export default function Portfolyo() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-case inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti portföyü nasıl hazırlanır?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>GitHub · Kaggle · proje seçimi · 15 dakika okuma</p>

        <p>
          İşe alımcı özgeçmişine bakıyor. &quot;Python biliyorum, SQL biliyorum&quot; yazıyor. Her başvuran aynı şeyi yazıyor.
          Portföy burada devreye giriyor — teknik bilgiyi kanıtlayan, sözü gerçeğe dönüştüren yer.
        </p>

        <p>
          Ama çoğu portföy yanlış yapılıyor. Ya çok teknik, ya çok boş, ya da tamamen yanlış sorulara cevap veriyor.
          Bu yazı o hataları atlaman için.
        </p>

        <h2>İşe alımcı portföyde ne arıyor?</h2>

        <p>
          Önce bunu netleştirmek lazım çünkü çoğu kişi portföyü &quot;ne kadar çok şey biliyorum&quot; vitriniymiş gibi yapıyor.
          Değil. İşe alımcı şunu sormak istiyor:
        </p>

        <ul>
          <li><strong>Gerçek bir problemi anlayabiliyor mu?</strong> Rastgele veriyi oynamamış, bir soruya cevap aramış mı?</li>
          <li><strong>Bulguları net aktarabiliyor mu?</strong> Grafik var ama anlatmak istiyor mu bir şey?</li>
          <li><strong>Kodu başkası okuyabilir mi?</strong> Değişken isimleri anlamlı mı, yapı takip edilebilir mi?</li>
          <li><strong>Sonuca ne diyor?</strong> &quot;Şu çıktı&quot; değil, &quot;şu kararı almanızı öneririm&quot; diyebiliyor mu?</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            10 proje yapıp 10 grafik çizmek yerine 2 proje yapıp ikisini de düzgün anlatmak çok daha güçlü bir portföy yaratır.
          </p>
        </blockquote>

        <h2>Kaç proje yeterli?</h2>

        <p>
          Üç proje yeterli. Gerçekten. Koşul: üçü de tamamlanmış, temiz, açıklamalı olsun.
        </p>

        <p>
          Mantığı şu: işe alımcının bir portföye ayırdığı süre ortalama 3-5 dakika.
          On yarım bırakılmış projeyi 5 dakikada gezemezsin. Üç iyi projeyi gezersin.
        </p>

        <p>
          İdeal kombinasyon:
        </p>

        <ul>
          <li><strong>1 vaka analizi:</strong> Gerçek veri, gerçek soru, net bulgu. Hikâye anlatan proje.</li>
          <li><strong>1 teknik proje:</strong> Model kurmuş, pipeline yazmış, bir şeyi otomatize etmiş olduğun yer.</li>
          <li><strong>1 görselleştirme / dashboard:</strong> Veriyi görsel olarak anlatabileceğini gösteren proje.</li>
        </ul>

        <h2>Proje konusu nasıl seçilir?</h2>

        <p>
          Merak ettiğin bir şeyi seç. Spor verisi, müzik, şehir ulaşımı, ekonomi — ne olursa.
          Gerçek merak projeyi bitirir; &quot;portföy için yapalım&quot; motivasyonu bitirmez.
        </p>

        <p>
          Konu seçerken iki filtre işe yarıyor:
        </p>

        <ul>
          <li>
            <strong>Veriye ulaşabilir misin?</strong> Kaggle, TÜİK, data.gov, açık API&apos;lar.
            Veri yoksa proje başlamadan biter.
          </li>
          <li>
            <strong>Soru tanımlı mı?</strong> &quot;İstanbul trafiğini analiz ettim&quot; değil,
            &quot;Hangi ilçelerde sabah zirvesi en uzun sürüyor?&quot; sorusu olan proje daha güçlü.
          </li>
        </ul>

        <p>
          Başlangıç için iyi veri kaynakları: Kaggle datasets, TÜİK açık veri, Türkiye Cumhuriyet Merkez Bankası EVDS,
          Avrupa Birliği açık veri portalı, GitHub&apos;daki awesome-public-datasets listesi.
        </p>

        <h2>GitHub nasıl kullanılır?</h2>

        <p>
          GitHub portföyün evi. Ama çoğu kişi GitHub&apos;ı yanlış kullanıyor — ya hiç commit atmıyor ya da
          &quot;son güncelleme 2 yıl önce&quot; uyarısıyla dolu repo.
        </p>

        <p>
          Her projenin kendi reposu olsun. İsimlendirme önemli: <code>istanbul-trafik-analizi</code> okunur,
          <code>proje1</code> okunmaz.
        </p>

        <p>
          Bir repo&apos;nun olmazsa olmazları:
        </p>

        <ul>
          <li><strong>README.md</strong> — En kritik dosya. Aşağıda ayrıca anlattım.</li>
          <li><strong>Düzenli klasör yapısı</strong> — <code>data/</code>, <code>notebooks/</code>, <code>src/</code>, <code>reports/</code></li>
          <li><strong>requirements.txt</strong> — Hangi kütüphaneler kullanıldı?</li>
          <li><strong>.gitignore</strong> — Büyük veri dosyaları, API anahtarları repoya girmesin.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Ham veri dosyası repoya yükleme. Büyükse Google Drive bağlantısı ver, küçükse sample_data klasörüne koy.
            Şirket verisi kesinlikle yükleme.
          </p>
        </blockquote>

        <h2>İyi bir README nasıl yazılır?</h2>

        <p>
          README, projenin kapı zili. İşe alımcı repoya girdiğinde ilk bunu okur.
          İyi bir README şu soruları cevaplamalı:
        </p>

        <ul>
          <li><strong>Problem neydi?</strong> — 2-3 cümle, teknik değil iş dili.</li>
          <li><strong>Veri nereden?</strong> — Kaynak, boyut, dönem.</li>
          <li><strong>Ne yaptın?</strong> — Yöntem, araçlar, adımlar kısaca.</li>
          <li><strong>Ne buldun?</strong> — Ana bulgular, sayıyla.</li>
          <li><strong>Nasıl çalıştırılır?</strong> — Adım adım kurulum ve çalıştırma.</li>
        </ul>

        <p>
          Görsel ekle: en iyi grafiğini README&apos;ye göm. İlk bakışta bir şey görülsün.
          Uzun notebook&apos;u açmadan bile projenin özü anlaşılsın.
        </p>

        <h2>Jupyter Notebook temizliği</h2>

        <p>
          Analizini Jupyter&apos;da yapıyorsan şunu bil: ham notebook portföy değil, çalışma defteri.
          Portföye giren notebook temizlenmiş olmalı.
        </p>

        <p>Kontrol listesi:</p>

        <ul>
          <li>Her hücrenin bir amacı var ve sırayla akıyor</li>
          <li>Markdown hücrelerle bölümler ayrılmış ve açıklanmış</li>
          <li>Hata veren, yarım kalan hücreler temizlenmiş</li>
          <li>Çıktılar mantıklı — 500 satır veri yazdırmak yerine <code>.head()</code></li>
          <li>Sonuç hücresi var: &quot;Bu analizden öğrendiklerim şunlardır...&quot;</li>
        </ul>

        <h2>Kaggle ve diğer platformlar</h2>

        <p>
          Kaggle portföyü GitHub ile tamamlar. Notebook&apos;larını Kaggle&apos;da da yayınla — burada
          topluluk görünürlüğü ve &quot;votes&quot; sistemi var. Başkaları notebook&apos;una oy verirse
          profil güçlenir.
        </p>

        <p>
          Kaggle&apos;ın competitions bölümü ayrı bir fırsat. Kazanmak şart değil — bir yarışmaya girip
          ilk submission&apos;ı atmak bile özgeçmişe yazılabilir bir deneyim. &quot;Kaggle Housing Prices
          yarışmasında top %30&apos;a girdim&quot; somut bir referans.
        </p>

        <p>
          Tableau Public ve Power BI Community de görselleştirme odaklı portföy için iyi yerler.
          Dashboard&apos;larını bu platformlarda paylaş, LinkedIn&apos;e link ekle.
        </p>

        <h2>LinkedIn&apos;e nasıl taşınır?</h2>

        <p>
          Projeyi bitirince LinkedIn&apos;de bir post yaz. Şablonu şu:
        </p>

        <ul>
          <li>Hangi soruyu sordum? (1 cümle)</li>
          <li>Ne buldum? (2-3 önemli bulgu, sayıyla)</li>
          <li>En etkileyici grafiği görsele ekle</li>
          <li>GitHub linkini ekle</li>
          <li>Hashtag: #verianalizi #datascience #python</li>
        </ul>

        <p>
          Ayrıca LinkedIn profilindeki &quot;Öne Çıkan&quot; bölümüne GitHub linkini sabit olarak ekle.
          İşe alımcı profili açtığında ilk göreceği şey olsun.
        </p>

        <h2>Yaygın hatalar</h2>

        <ul>
          <li>
            <strong>Sadece Titanic ve Iris projesi.</strong> Herkes yapıyor. İşe alımcı sıkılmış.
            Özgün veri bul.
          </li>
          <li>
            <strong>Sonuç yok.</strong> Grafikler var ama &quot;şunu öneririm&quot; yok.
            Analiz karar destekler — bunu göster.
          </li>
          <li>
            <strong>Kod temiz değil.</strong> Değişken isimleri <code>df2</code>, <code>x1</code>, <code>temp</code>.
            İsimlendirme temiz olsun.
          </li>
          <li>
            <strong>README yok.</strong> Boş repo. Proje ne hakkında? Kimse açıp bakmaz.
          </li>
          <li>
            <strong>Yıllar önce yapılmış, güncellenmemiş.</strong> GitHub&apos;da son commit tarihi görünüyor.
            Aktif görün — eski projeleri zaman zaman güncelle.
          </li>
        </ul>

        <h2>Başlamak için minimum gerekli plan</h2>

        <p>
          Portföy yoksa bu haftadan başla. Adımlar:
        </p>

        <ol>
          <li>Kaggle&apos;dan ilgini çeken bir veri seti seç</li>
          <li>Bir soru tanımla — &quot;Bu veride neyi merak ediyorum?&quot;</li>
          <li>Analizi yap, en az 2 görsel çiz</li>
          <li>Notebook&apos;u temizle, README yaz</li>
          <li>GitHub&apos;a yükle, LinkedIn&apos;de paylaş</li>
        </ol>

        <p>
          İlk proje mükemmel olmaz. Olması da gerekmiyor. Var olması gerekiyor.
          İkinci proje birinciden iyi olur, üçüncü ikinciden. Başlamanın tek yolu başlamak.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Portföy statik bir belge değil, süregelen bir çalışma. Her ay bir şey ekle —
            küçük olsun, ama ekle.
          </p>
        </blockquote>

        <p>
          Portföyünü hazırladıysan veya hazırlarken takıldığın bir yer varsa{' '}
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X&apos;ten</a>{' '}
          yazabilirsin. Bakarım.
        </p>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazı: <strong>Veri analisti mülakat soruları</strong> —
          teknik ve davranışsal sorulara nasıl hazırlanılır.
        </p>
      </article>
    </main>
  );
}
