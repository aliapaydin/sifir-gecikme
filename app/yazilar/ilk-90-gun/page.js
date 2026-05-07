export default function Ilk90Gun() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-case inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti olarak ilk 90 günüm
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>15 yıl sonra geriye bakınca · 12 dakika okuma</p>

        <p>
          İlk günüm aklımda. Bilgisayarın başına geçtim, ekrana baktım. Kimse bana
          &quot;şunu yap&quot; demedi. Veri neredeydi? Hangi sisteme bakacaktım?
          Nereden başlayacaktım?
        </p>

        <p>
          O his — boş ekran önünde ne yapacağını bilememek — veri kariyerinin ilk
          gerçeğidir. Kimse sana bunu söylemez. Kurslar söylemez, bootcamp&apos;lar
          söylemez. Ben söyleyeyim.
        </p>

        <h2>İlk 30 gün: anlamaya çalış, üretmeye değil</h2>

        <p>
          İlk ayın tek görevi şu: <strong>ortamı anlamak.</strong> Hangi veri nerede
          duruyor? Şirketin hangi soruları var? Ekip nasıl çalışıyor? Hangi araçlar
          kullanılıyor?
        </p>

        <p>
          Ben bu dönemde çok şey üretmeye çalıştım. Hata. İlk hafta yazdığım analiz
          raporunu kimse okumadı çünkü o soruyu kimse sormamıştı. Veri analistinin
          işi veri üretmek değil, <em>doğru soruya doğru cevabı bulmak.</em>
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            İlk 30 günde en değerli şey yaptığın analiz değil, kurduğun ilişkiler.
            Hangi müdür hangi metriğe takıntılı? Hangi ekip veriyle en çok çalışıyor?
            Bunları öğren.
          </p>
        </blockquote>

        <p>
          Pratik öneri: ilk haftada 10 farklı kişiyle 30&apos;ar dakikalık bire bir
          görüşme ayarla. &quot;En çok hangi soruların cevabını merak ediyorsun?&quot;
          diye sor. Not al. Bu notlar ileriki 6 ayın içerik planı olacak.
        </p>

        <h2>31-60. günler: bir şeyi sahiplen</h2>

        <p>
          İkinci ayda bir &quot;sahiplenme&quot; alanı bulman lazım. Küçük olsun,
          ama senin olsun. Haftalık satış raporu, müşteri kayıp analizi, operasyonel
          bir dashboard — ne olursa. Düzenli ürettiğin, insanların beklediği bir şey.
        </p>

        <p>
          Bu çok önemli çünkü &quot;Ali ne yapıyor?&quot; sorusuna net bir cevap oluyor.
          Görünmez olmak veri kariyerinin en büyük tehlikelerinden biri. Kod yazıyorsun,
          analiz yapıyorsun, ama kimse bilmiyor. Sahiplendiğin bir çıktı seni görünür kılar.
        </p>

        <p>
          Ben bu dönemde ilk büyük hatamı da yaptım: yöneticime &quot;SQL ile şu tabloyu
          çektim, sonuç şu&quot; dedim. Yanlış. Yönetici SQL&apos;i umursamıyor.
          Yönetici şunu duymak istiyor: &quot;Müşteri kaybımız geçen aya göre %12 arttı,
          sebebi muhtemelen şu, önerim bu.&quot;
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Teknik detayı arka plana göm. Öne çıkan şey her zaman iş etkisi olmalı.
            &quot;Pandas ile merge yaptım&quot; değil, &quot;Şu fırsatı bulduk.&quot;
          </p>
        </blockquote>

        <h2>61-90. günler: derinleş ve sistem kur</h2>

        <p>
          Üçüncü ayda artık temel işleyişi anlamışsındır. Şimdi soru şu: bu işi
          sürdürülebilir nasıl yaparsın?
        </p>

        <p>
          Çoğu analist bu dönemde &quot;firefighting&quot; tuzağına düşer — sürekli
          acil istekler, ad-hoc analizler, hiç bitmez. Bunu kırmak için sistematik
          olmak gerekiyor. Tekrarlayan soruları otomatize et. Sık sorulan sorular için
          self-servis dashboard yap, &quot;bana şunu çeker misin?&quot; sorusunu ortadan kaldır.
        </p>

        <p>
          Bu dönemde öğrendiğim en değerli şey: <strong>hayır diyebilmek.</strong>
          Her analiz isteğini kabul etmek seni meşgul eder ama etkisiz bırakır.
          &quot;Bu soruyu cevaplamak ne kadar değer yaratır?&quot; diye sormayı öğren.
          Önceliklendir.
        </p>

        <h2>Keşke bilseydim listesi</h2>

        <p>15 yıl sonra geriye bakınca, ilk 90 günde keşke bilseydim dediğim şeyler:</p>

        <ul>
          <li>
            <strong>Excel ölmedi.</strong> Python öğrenirken Excel&apos;i küçümsedim.
            Hataydı. Yöneticinin açıp bakabileceği bir Excel, kimsenin çalıştıramadığı
            Python script&apos;inden değerlidir.
          </li>
          <li>
            <strong>Veriyi temizlemek analizin yarısı.</strong> Kurslar bunu söyler
            ama gerçekliğini kavramak zaman alır. İlk gerçek projenin %60&apos;ını
            veri temizlemeye harcayacaksın.
          </li>
          <li>
            <strong>Yanlış olmaktan korkma.</strong> &quot;Emin olmadan söylemeyeyim&quot;
            tuzağı. Emin olmak mümkün değil. Varsayımlarını açıkça belirt, tahminde bulun,
            güncelle.
          </li>
          <li>
            <strong>Sunum yapmayı öğren.</strong> En iyi analiz kötü sunulursa kaybolur.
            Storytelling, veri analistinin en az veri kadar önemli becerisi.
          </li>
          <li>
            <strong>Mentor bul.</strong> Sektörde 2-3 yıl önünde birini bul, düzenli
            konuş. Yıllarca kendin keşfedeceğin şeyleri 30 dakikada öğretir.
          </li>
          <li>
            <strong>Dokümantasyon yaz.</strong> &quot;Bunu nasıl yaptığımı biliyorum&quot;
            diyorsun. 6 ay sonra bilmiyorsun. Her şeyi yaz.
          </li>
          <li>
            <strong>İş bağlamını anlamadan veri anlamsız.</strong> Şirketin nasıl para
            kazandığını, hangi KPI&apos;ların önemli olduğunu, rakiplerin kim olduğunu
            bilmeden doğru analiz yapılamaz.
          </li>
        </ul>

        <h2>Araçlar hakkında gerçekler</h2>

        <p>
          İlk işe başlarken &quot;hangi aracı öğreneyim?&quot; sorusu herkeste var.
          Dürüst cevap:
        </p>

        <ul>
          <li><strong>SQL:</strong> Zorunlu. Pazarlık yok. Hangi şirkete gidersen git, SQL bilmek şart.</li>
          <li><strong>Python:</strong> Güçlü ama önce iş problemi anla, sonra öğren. Araç amaç değil.</li>
          <li><strong>Power BI / Tableau:</strong> Şirketin ne kullandığını öğren, onu öğren. İkisi de 2 haftada temel seviye öğrenilir.</li>
          <li><strong>Excel:</strong> Hâlâ en yaygın, küçümseme.</li>
          <li><strong>İstatistik:</strong> Araçtan önemli. Araç değişir, istatistik bilgisi değişmez.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            15 yılda öğrendim: en iyi veri analistleri en iyi Python yazanlar değil.
            En iyi soru soranlar, en net anlatanlar ve en hızlı öğrenenler.
          </p>
        </blockquote>

        <h2>Son söz</h2>

        <p>
          Veri kariyeri sabır isteyen bir yolculuk. İlk 90 günde her şeyi bilmek
          zorunda değilsin. Merak et, sor, hata yap, öğren. Veriyle çalışmak bir
          beceri değil, bir düşünce biçimi — ve bu biçimi edinmek zaman alır.
        </p>

        <p>
          Eğer şu an bu yolun başındaysan ve aklında sorular varsa, bana{' '}
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X&apos;ten</a>{' '}
          veya <a href="mailto:sifirgecikme@gmail.com">mail ile</a> ulaşabilirsin.
          Cevaplarım.
        </p>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazı: <strong>Pandas&apos;ta en çok yanlış bilinen 7 şey</strong> —
          yıllarca yaygın ama yanlış kullanılan pattern&apos;ler.
        </p>
      </article>
    </main>
  );
}
