export const metadata = {
  title: 'Veri Analisti LinkedIn Profili Nasıl Olmalı?',
  description: 'Headline, about bölümü, deneyim yazımı ve featured section. İşe alımcıların dikkat ettiği şeyler. Türkçe LinkedIn rehberi.',
  keywords: ['linkedin veri analisti', 'data analyst linkedin profil', 'linkedin headline', 'linkedin about bölümü türkçe'],
  openGraph: {
    title: 'Veri Analisti LinkedIn Profili Nasıl Olmalı? — Sıfır Gecikme',
    description: 'Headline, about, deneyim yazımı ve işe alımcıların dikkat ettiği şeyler.',
  },
};

function Karsilastirma({ yanlis, dogru }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.25rem 0 1.75rem' }}>
      <div style={{
        background: '#fff5f5',
        border: '0.5px solid #fca5a5',
        borderRadius: '8px',
        padding: '0.9rem 1rem',
        fontSize: '0.88rem',
        lineHeight: '1.5',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>YANLIŞ</div>
        {yanlis}
      </div>
      <div style={{
        background: '#f0fdf4',
        border: '0.5px solid #86efac',
        borderRadius: '8px',
        padding: '0.9rem 1rem',
        fontSize: '0.88rem',
        lineHeight: '1.5',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>İYİ</div>
        {dogru}
      </div>
    </div>
  );
}

export default function LinkedinProfili() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-case inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti LinkedIn profili nasıl olmalı?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>headline · about · deneyim · featured · 12 dakika okuma</p>

        <p>
          İşe alımcı sana ulaşmadan önce LinkedIn profilini görüyor. Arama sonuçlarında çıkıp çıkmaman,
          mesaj açılıp açılmaman, özgeçmiş incelenip incelenmemen — hepsi profilin kalitesiyle başlıyor.
        </p>

        <p>
          Veri analisti profilleri özelinde en sık gördüğüm sorun şu: teknik araçlar listesi var,
          ama ne yaptığı ve ne değer yarattığı yok. Bu yazı o boşluğu kapatmak için.
        </p>

        <h2>Profil fotoğrafı ve banner</h2>

        <p>
          Fotoğraf: yüz açık, arka plan sade, güncel. Ağ bağlantısı kurulmamış profil gibi görünen fotoğraf
          (karanlık, bulanık, grup fotoğrafından kırpılmış) tıklanma oranını düşürüyor.
        </p>

        <p>
          Banner: çoğu kişi varsayılan mavide bırakıyor. Canva&apos;da 10 dakikada &quot;Veri · Analiz · Türkçe&quot;
          yazılı sade bir banner — seni ayırt eder. Portföy siteni veya GitHub adresini bannera ekle.
        </p>

        <h2>Headline: en kritik alan</h2>

        <p>
          Headline arama sonuçlarında görünen tek şey. İşe alımcı LinkedIn&apos;de &quot;data analyst istanbul&quot;
          aradığında headline&apos;ın ne dediği önemli.
        </p>

        <p>Kötü headline formülleri:</p>

        <Karsilastirma
          yanlis="Veri Analisti @ Şirket Adı"
          dogru="Veri Analisti | SQL · Python · Tableau | E-ticaret & finans verisi"
        />

        <Karsilastirma
          yanlis="Data Enthusiast | Open to work"
          dogru="Junior Veri Analisti | Pandas · Power BI | İstanbul — iş arayışındayım"
        />

        <p>
          İyi headline formülü: <strong>unvan + araçlar/uzmanlık + sektör veya konum</strong>.
          220 karakter hakkın var — boş bırakma.
        </p>

        <p>
          Türkçe ve İngilizce anahtar kelimeleri ikisini de kullan. İşe alımcılar hem &quot;veri analisti&quot;
          hem &quot;data analyst&quot; arıyor.
        </p>

        <h2>About bölümü: hikâye anlat</h2>

        <p>
          About çoğunlukla ya tamamen boş ya da özgeçmişin kopyası. İkisi de yanlış.
          About bölümü senin sesini duyurduğun yerdir — kısa, kişisel, odaklı.
        </p>

        <p>İşe yarayan yapı (3 paragraf):</p>

        <ol>
          <li><strong>Kim olduğun ve ne yapıyorsun</strong> — 2-3 cümle, sektör ve uzmanlık dahil</li>
          <li><strong>Ne tür problemleri çözüyorsun</strong> — araçları değil, yarattığın değeri anlat</li>
          <li><strong>Şu an ne arıyorsun</strong> — açıkça yaz, iş arıyorsan söyle</li>
        </ol>

        <Karsilastirma
          yanlis={"Veri bilimine tutkulu bir profesyonelim. SQL, Python, Tableau, Power BI, Excel konularında deneyimliyim. Takım çalışmasına yatkın, öğrenmeye açık biriyim."}
          dogru={"E-ticaret ve perakende sektöründe 3 yıldır veri analistiyim. Müşteri davranışı, sepet analizi ve cohort raporlarıyla çalışıyorum — SQL ve Python ağırlıklı.\n\nSon projemde haftalık raporlama sürecini otomatize ederek ekibin 6 saatini kurtardık. Veriyi anlamlandırmak kadar net aktarmayı da önemsiyorum.\n\nİstanbul merkezli, tam zamanlı veri analisti pozisyonlarına açığım."}
        />

        <h2>Deneyim bölümü: sayıyla konuş</h2>

        <p>
          Deneyim bölümünde en yaygın hata görev listesi yazmak. &quot;Veri analizi yaptım,
          rapor hazırladım, dashboard oluşturdum&quot; — bunlar hiçbir şey söylemiyor.
        </p>

        <p>İşe alımcı şunu görmek istiyor: <strong>ne yaptın + sonucu ne oldu.</strong></p>

        <Karsilastirma
          yanlis={"• Satış verilerini analiz ettim\n• Haftalık raporlar hazırladım\n• Dashboard oluşturdum"}
          dogru={"• Haftalık satış raporlamasını Python ile otomatize ettim — hazırlık süresi 6 saatten 20 dakikaya düştü\n• Müşteri churn modeliyle risk altındaki 2.400 hesap tespit edildi, hedefli kampanyayla %18 kayıp azaldı\n• Yönetim için 3 bölümlük Power BI dashboard kurdum, her hafta 12 yönetici aktif kullanıyor"}
        />

        <p>Sayın yoksa tahmini bile olsa ekle ve yanına &quot;tahmini&quot; yaz. Sıfır sayıdan iyidir.</p>

        <p>Her iş deneyiminin altına araçları da ekle: <em>Python · pandas · SQL · Power BI</em>.
          LinkedIn Skills bölümünde çıkması için deneyim altında da geçmeli.
        </p>

        <h2>Skills bölümü</h2>

        <p>
          En fazla 10-15 skill ekle, hepsini ekleme. İşe alımcı &quot;Microsoft Office&quot; görünce
          aklında bir şey canlanmıyor. Spesifik ol:
        </p>

        <ul>
          <li><strong>Ekle:</strong> SQL, Python, pandas, NumPy, Power BI, Tableau, dbt, Airflow, A/B Testing, Data Visualization</li>
          <li><strong>Ekleme:</strong> Microsoft Office, Takım Çalışması, Problem Solving, Communication</li>
        </ul>

        <p>
          Endorsement iste — eski iş arkadaşlarına veya proje yaptığın kişilere &quot;şu skill&apos;i onaylayabilir misin?&quot; de.
          Endorse sayısı profil görünürlüğünü etkiliyor.
        </p>

        <h2>Featured bölümü: portföyü öne çıkar</h2>

        <p>
          Featured bölümü LinkedIn&apos;in en az kullanılan ve en değerli alanı.
          Profil açıldığında doğrudan göze çarpan kısım.
        </p>

        <p>Featured&apos;a ne eklemeli:</p>

        <ul>
          <li><strong>GitHub profil linki</strong> — en önemli proje reposuna direkt link</li>
          <li><strong>Kaggle profil linki</strong> — notebook&apos;ların varsa</li>
          <li><strong>Portföy sitesi</strong> — varsa</li>
          <li><strong>En iyi LinkedIn postu</strong> — bir analiz veya bulgu paylaştıysan sabitle</li>
          <li><strong>Tableau Public / Power BI dashboard linki</strong></li>
        </ul>

        <p>
          Featured boşsa işe alımcı devam edecek şey bulamıyor. Profilin en çok trafik alan
          kısmı burası — boş bırakma.
        </p>

        <h2>Eğitim ve sertifikalar</h2>

        <p>
          Üniversite diploması elbette ekle. Sertifikalar için kural şu:
          sadece tanınan ve alandaki değeri kanıtlanmış olanları ekle.
        </p>

        <p>Değerli sertifikalar:</p>
        <ul>
          <li>Google Data Analytics Certificate (Coursera)</li>
          <li>Microsoft Power BI Data Analyst (PL-300)</li>
          <li>Databricks Data Engineer / Analyst</li>
          <li>dbt Fundamentals (dbt Labs)</li>
          <li>Kaggle certificates (spesifik kurslar)</li>
        </ul>

        <p>
          Bitirme tarihi yakın olan sertifikalara dikkat — &quot;2019&apos;da aldım&quot; diyen
          sertifika artık yük. Güncelle ya da çıkar.
        </p>

        <h2>İçerik paylaşımı: en hızlı büyüme yolu</h2>

        <p>
          LinkedIn&apos;de içerik paylaşmak profil görünürlüğünü haftalar içinde katlıyor.
          Ama ne paylaşılacağını bilmemek başlamayı engelliyor.
        </p>

        <p>Veri analistleri için iyi içerik formülleri:</p>

        <ul>
          <li><strong>Proje paylaşımı:</strong> Yaptığın analizi özetle, en iyi grafiği ekle, GitHub linkini ver</li>
          <li><strong>Bugün öğrendim:</strong> Bir SQL trick, bir pandas yöntemi — kısa ve teknik</li>
          <li><strong>Sektör verisi yorumu:</strong> TÜİK, EVDS veya sektör raporu çıktı — 3 satır yorumun ne?</li>
          <li><strong>Kariyer gözlemi:</strong> Mülakatında gördüğün, iş yerinde öğrendiğin şey</li>
        </ul>

        <p>
          Haftada 1-2 post yeterli. Her gün olmak zorunda değil.
          Tutarlılık büyüklükten önemli — 6 ay boyunca haftada 1 post, viral bir post&apos;tan daha çok iş yaratır.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            İşe alımcılar aktif paylaşım yapan profillere mesaj atmaya daha eğilimli.
            &quot;Bu kişi ne düşünüyor, nasıl çalışıyor?&quot; sorusuna içerikle cevap vermiş oluyorsun.
          </p>
        </blockquote>

        <h2>Open to Work ayarı</h2>

        <p>
          İş arayışındaysan &quot;Open to Work&quot; çerçevesini aç — ama ayarlarını doğru yap.
          &quot;Herkese göster&quot; yerine &quot;İşe alımcılara göster&quot; seçeneği var.
          Mevcut işverenin görmesini istemiyorsan ikinci seçenek.
        </p>

        <p>
          Open to Work ayarında iş türünü de belirt: tam zamanlı, yarı zamanlı, uzaktan, hibrit.
          Şehir ekle. Belirsiz profil daha az mesaj alır.
        </p>

        <h2>Profil güçlendirme kontrol listesi</h2>

        <ul>
          <li>Profil fotoğrafı güncel ve yüz açık</li>
          <li>Headline 150+ karakter, araçlar ve sektör dahil</li>
          <li>About 3 paragraf, sayı veya somut sonuç var</li>
          <li>Her deneyimde en az 1 sayısal sonuç</li>
          <li>Skills 10-15 arası, spesifik</li>
          <li>Featured&apos;da GitHub veya portföy linki var</li>
          <li>Son 30 günde en az 1 paylaşım</li>
          <li>Open to Work açıksa ayarlar doğru</li>
        </ul>

        <p>
          Profil hakkında fikir almak istersen veya headline/about yazmakta yardım lazımsa{' '}
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X&apos;ten</a>{' '}
          yazabilirsin.
        </p>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazı: <strong>Portföy projesi nasıl hazırlanır?</strong> —{' '}
          <a href="/yazilar/portfolyo" style={{ color: 'var(--color-accent)' }}>GitHub, Kaggle ve işe alımcıların baktığı şeyler.</a>
        </p>
      </article>
    </main>
  );
}
