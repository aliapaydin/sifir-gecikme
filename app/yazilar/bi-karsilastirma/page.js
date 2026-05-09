export const metadata = {
  title: 'Power BI vs Tableau vs Looker: Hangisi Sana Uygun?',
  description: 'Power BI, Tableau ve Looker arasındaki farklar, güçlü ve zayıf yönler, fiyatlar ve hangi şirkete ne uyar. Türkçe karşılaştırma rehberi.',
  keywords: ['power bi vs tableau', 'looker nedir', 'bi araçları karşılaştırma', 'tableau türkçe', 'power bi türkçe', 'veri görselleştirme araçları'],
};

export default function BIKarsilastirma() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Power BI vs Tableau vs Looker: hangisi sana uygun?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · BI araçları · 15 dakika okuma
        </p>

        <p>
          Yeni bir BI aracı seçmek zorunda kaldığında kafan karışır. Her biri
          "en iyi" olduğunu iddia eder. Pazarlama materyallerine değil, gerçek
          kullanım deneyimine bak.
        </p>
        <p>
          15 yıldır farklı şirketlerde bu üç aracın hepsini kullandım. Hangisinin
          ne zaman doğru seçim olduğunu sana anlatayım.
        </p>

        <h2>Özet tablo</h2>

        <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500 }}></th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#1D9E75', fontWeight: 600 }}>Power BI</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#7F77DD', fontWeight: 600 }}>Tableau</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#e8a04a', fontWeight: 600 }}>Looker</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Fiyat', pbi: '$10/kullanıcı/ay', tab: '$70+/kullanıcı/ay', lok: 'Kurumsal (pahalı)' },
                { label: 'Öğrenme eğrisi', pbi: 'Düşük', tab: 'Orta', lok: 'Yüksek' },
                { label: 'Görsel kalite', pbi: 'İyi', tab: 'Mükemmel', lok: 'Orta' },
                { label: 'SQL bilgisi', pbi: 'Gerekmez', tab: 'Gerekmez', lok: 'Zorunlu' },
                { label: 'Veri kapasitesi', pbi: 'Orta', tab: 'Yüksek', lok: 'Çok yüksek' },
                { label: 'Ekosistem', pbi: 'Microsoft', tab: 'Salesforce', lok: 'Google Cloud' },
                { label: 'Embedded BI', pbi: 'Evet', tab: 'Evet', lok: 'Güçlü' },
                { label: 'Mobil', pbi: 'İyi', tab: 'Orta', lok: 'Zayıf' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '0.5px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-cream-card)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--color-text-mute)', fontSize: '13px' }}>{row.label}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)', fontSize: '13px' }}>{row.pbi}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)', fontSize: '13px' }}>{row.tab}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)', fontSize: '13px' }}>{row.lok}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Power BI — Microsoft'un silahı</h2>
        <p>
          Microsoft ekosistemindeysen Power BI neredeyse otomatik seçim.
          Excel'den geçiş çok kolay, Office 365 aboneliğiyle birlikte geliyor,
          Azure ve Teams entegrasyonu mükemmel.
        </p>

        <p><strong>Güçlü yanları:</strong></p>
        <ul>
          <li><strong>Fiyat:</strong> Pro lisans $10/kullanıcı/ay. Rakiplerine göre çok ucuz.</li>
          <li><strong>DAX ve Power Query:</strong> Karmaşık hesaplamalar için güçlü. Excel'e benzediği için öğrenmesi kolay.</li>
          <li><strong>Microsoft entegrasyonu:</strong> Excel, SharePoint, Teams, Azure — hepsiyle sorunsuz.</li>
          <li><strong>Türkiye'de yaygın:</strong> Türk şirketlerin büyük çoğunluğu Power BI kullanıyor. İş ilanlarında en çok aranan.</li>
          <li><strong>Copilot:</strong> AI destekli analiz özelliği hızla gelişiyor.</li>
        </ul>

        <p><strong>Zayıf yanları:</strong></p>
        <ul>
          <li>Görsel özelleştirme Tableau kadar esnek değil.</li>
          <li>Büyük veri setlerinde (100M+ satır) yavaşlayabilir.</li>
          <li>Web versiyonu masaüstü kadar güçlü değil.</li>
          <li>Microsoft ekosistemi dışında entegrasyon bazen zorlaşır.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid #1D9E75', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Power BI için ne zaman seç: Microsoft şirketi, bütçe kısıtı var,
            Excel kullanan iş analistlerin raporları kendileri güncellemesi gerekiyor.
          </p>
        </blockquote>

        <h2>Tableau — görselleştirmenin altın standardı</h2>
        <p>
          Görsel analitik denince akla gelen ilk isim. Drag-and-drop arayüzü,
          olağanüstü görsel kalitesi ve sezgisel kullanımıyla hâlâ endüstri standardı.
          2019'da Salesforce tarafından satın alındı.
        </p>

        <p><strong>Güçlü yanları:</strong></p>
        <ul>
          <li><strong>Görsel kalite:</strong> Ürettiği grafikler diğerlerinden bir adım önde. Sunum materyali olarak mükemmel.</li>
          <li><strong>VizQL:</strong> Kendi sorgu dili sayesinde büyük veriyi hızlı işler.</li>
          <li><strong>Keşif analitiği:</strong> Veriyi görsel olarak keşfetmek için en iyi araç.</li>
          <li><strong>Topluluk:</strong> En büyük BI topluluğu. Tableau Public'te binlerce örnek var.</li>
          <li><strong>Çoklu veri kaynağı:</strong> 80+ veri kaynağına native bağlantı.</li>
        </ul>

        <p><strong>Zayıf yanları:</strong></p>
        <ul>
          <li><strong>Fiyat:</strong> Creator lisans $70+/ay. Küçük şirketler için pahalı.</li>
          <li><strong>Salesforce entegrasyonu zorlaşıyor:</strong> Salesforce ekosistemi dışında bazen garip davranışlar.</li>
          <li><strong>Hesaplama sınırlılıkları:</strong> Karmaşık istatistiksel hesaplamalar için R veya Python entegrasyonu gerekiyor.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid #7F77DD', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Tableau için ne zaman seç: Görsel kalite kritik, veri keşfi ön planda,
            bütçe var, analistler teknik ama SQL bilmeyenler de kullanacak.
          </p>
        </blockquote>

        <h2>Looker — verinin tek gerçeği</h2>
        <p>
          Looker diğerlerinden temelden farklı. Bir dashboard aracı değil,
          <strong> veri modelleme platformu.</strong> LookML adlı kendi diliyle
          iş metriklerini merkezi olarak tanımlarsın. 2019'da Google tarafından satın alındı.
        </p>

        <p><strong>Güçlü yanları:</strong></p>
        <ul>
          <li><strong>Single source of truth:</strong> "Gelir" ne demek? Tüm ekip aynı tanımı kullanır. Metrik tutarsızlığı biter.</li>
          <li><strong>LookML:</strong> SQL tabanlı modelleme dili. Tekrar kullanılabilir, versiyon kontrolü yapılabilir metrikler.</li>
          <li><strong>Embedded analytics:</strong> Dashboard'ları ürününüze gömmek için en iyi araç.</li>
          <li><strong>BigQuery entegrasyonu:</strong> Google Cloud kullananlar için mükemmel.</li>
          <li><strong>Governance:</strong> Kimin neyi göreceğini merkezi yönet.</li>
        </ul>

        <p><strong>Zayıf yanları:</strong></p>
        <ul>
          <li><strong>SQL zorunlu:</strong> LookML öğrenmek ve SQL bilmek şart. Self-serve kullanım zor.</li>
          <li><strong>Fiyat:</strong> Kurumsal fiyatlandırma, KOBİ'ler için uygun değil.</li>
          <li><strong>Görsel esneklik:</strong> Tableau kadar esnek değil.</li>
          <li><strong>Öğrenme eğrisi:</strong> LookML öğrenmek zaman alıyor.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid #e8a04a', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Looker için ne zaman seç: Büyük şirket, güçlü data engineering ekibi var,
            metrik tutarsızlığı sorun yaratıyor, Google Cloud kullanıyorsunuz
            veya embedded analytics gerekiyor.
          </p>
        </blockquote>

        <h2>Türkiye iş piyasasında durum</h2>
        <p>
          Türkiye'deki iş ilanlarını analiz ettiğimde tablo net:
        </p>
        <ul>
          <li><strong>Power BI:</strong> İlanların ~%70'i. Bankacılık, perakende, üretim sektörü yoğun.</li>
          <li><strong>Tableau:</strong> ~%20. Teknoloji şirketleri ve danışmanlık firmaları.</li>
          <li><strong>Looker:</strong> ~%10. Büyük tech şirketleri ve startuplar.</li>
        </ul>
        <p>
          Kariyer başlangıcında <strong>Power BI öğren</strong> — iş bulma şansın en yüksek.
          Sonra Tableau ekle — CV'ni güçlendirir. Looker ise senior seviyede, data engineering
          pozisyonlarında öne çıkıyor.
        </p>

        <h2>Hangi durumda hangisi?</h2>
        <ul>
          <li><strong>Küçük/orta ölçekli Türk şirketi:</strong> Power BI — ucuz, yaygın, destek bulmak kolay.</li>
          <li><strong>Görsel ağırlıklı sunum:</strong> Tableau — kalite fark yaratır.</li>
          <li><strong>SaaS ürününe dashboard gömmek:</strong> Looker veya Metabase.</li>
          <li><strong>Google Cloud ekosistemi:</strong> Looker — native entegrasyon.</li>
          <li><strong>Microsoft ekosistemi:</strong> Power BI — başka alternatif düşünme.</li>
          <li><strong>Sınırlı bütçe, açık kaynak:</strong> Metabase veya Apache Superset.</li>
        </ul>

        <h2>Ücretsiz alternatifler</h2>
        <p>
          Bütçe kısıtı varsa güçlü açık kaynak seçenekler var:
        </p>
        <ul>
          <li><strong>Metabase:</strong> Kurulumu 5 dakika, SQL bilmeden dashboard yapılabilir. Küçük ekipler için ideal.</li>
          <li><strong>Apache Superset:</strong> Airbnb açık kaynağa çevirdi. Güçlü ama kurulumu karmaşık.</li>
          <li><strong>Grafana:</strong> Özellikle time-series ve DevOps metrikleri için.</li>
          <li><strong>Redash:</strong> SQL odaklı, basit dashboard'lar için.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>ETL ve data transformation</strong>: ham veriyi
          analiz için hazır hale getirmenin sistematik yolu.
        </p>
      </article>
    </main>
  );
}
