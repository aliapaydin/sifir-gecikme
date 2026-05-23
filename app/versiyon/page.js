import { CURRENT_VERSION } from '../../lib/versiyon';
import VersiyonIcerik from './VersiyonIcerik';

export const metadata = {
  title: 'Versiyon Geçmişi',
  description: 'Sıfır Gecikme sitesinin tüm sürüm notları ve özellik güncellemeleri.',
};

const versiyonlar = [
  {
    versiyon: 'v2.0.0',
    tarih: '23 Mayıs 2026',
    baslik: 'Tech Center 2.0 + Mimari Güncellemeler',
    tip: 'feature',
    ozellikler: [
      // Genel site değişiklikleri — normal liste
      { tip: 'yeni', metin: 'LayoutShell bileşeni eklendi: /tech-center rotasında global Navbar ve Footer otomatik gizleniyor, diğer sayfalarda değişiklik yok' },
      { tip: 'yeni', metin: 'Türkiye Sosyal Medya Davranışı vaka çalışması (/yazilar/sosyal-medya-turkiye): platform tercihleri, 24 saatlik aktivite profili, yaş grubu × platform ısı haritası ve içerik türü analizi — 6 interaktif grafik' },
      { tip: 'yeni', metin: 'Pandas Hızlı Referans aracı (/yazilar/pandas-referans): 35 fonksiyon, Türkçe açıklama, kopyalanabilir kod, arama kutusu ve kategori filtreleri — 9 kategori (okuma, inceleme, seçim, temizlik, gruplama, birleştirme, şekillendirme, string, zaman serisi)' },
      { tip: 'yeni', metin: 'Alkol Promilmetre (/promilmetre): Türkiye\'de satılan 40+ içecek (Efes, Bomonti, Yeni Rakı, Tekirdağ, Kavaklidere, Jack Daniel\'s vb.) içeren veritabanı, Widmark formülü ile kan alkol hesabı, mide durumu ve alkolsüz içecek etki katsayıları, animasyonlu SVG gösterge, trafik uyarısı (0.50‰ Türkiye sınırı), AI analizi ve localStorage kişisel profil' },
      { tip: 'iyileştirme', metin: 'app/layout.js mimarisi: Navbar ve Footer doğrudan layout\'a gömülü yerine LayoutShell bileşeni üzerinden koşullu render ediliyor' },
      { tip: 'iyileştirme', metin: 'Versiyon geçmişi sayfası: gruplu değişiklikler için açılır-kapanır accordion bileşeni eklendi' },

      // Tech Center grubu — accordion
      {
        tip: 'grup',
        icon: '🖥️',
        label: 'Tech Center — Sanal Masaüstü & Oyun Sistemi',
        items: [
          // Masaüstü & pencere
          { tip: 'yeni', metin: 'Sanal masaüstü arayüzü: macOS tarzı pencere yönetimi (kırmızı/sarı/yeşil trafik ışığı), görev çubuğu, masaüstü ikonları ve çoklu pencere desteği' },
          { tip: 'yeni', metin: 'Mail Uygulaması: gelen müşteri talepleri e-posta görünümünde; müşteri tipine göre farklı mesaj dili (öğrenci, gamer, kurumsal, profesyonel)' },
          // Oyun mekanikleri
          { tip: 'yeni', metin: 'Müşteri memnuniyeti sistemi: satış +3, servis +2, müşteri kaçırma −5, geciktirme reddedilince −4; TopBar\'da emoji + yüzde göstergesi' },
          { tip: 'yeni', metin: 'Geciktirme mekaniği: "1 Gün Beklet ~%70" ve "2 Gün Beklet ~%50"; kabul edilen müşteriler sonraki gün listeye geri döner' },
          // PC Toplama
          { tip: 'yeni', metin: 'PC Toplama uygulaması: elimizdeki bileşenlerden uyumlu sistem derleme; soket, RAM tipi, PSU wattage ve form faktör uyumluluk kontrolü' },
          { tip: 'yeni', metin: 'Kasa kategorisi: CSS ile render edilen kasa görselleri; toplanan PC\'ler "Hazır PC\'ler" sekmesinde satışa sunulur' },
          // Ürün sistemi
          { tip: 'yeni', metin: 'Ürün tier sistemi: tüm kategoriler gün 1\'den açık, ürünler unlockDay ile kademeli açılır (RTX 2060 gün 1 → RTX 3060 gün 6 → RTX 4060 gün 12…)' },
          { tip: 'yeni', metin: 'Stok odaklı müşteri üretimi: %70 ihtimalle stokta olan ürünlerden istek gelir, %30 ihtimalle stokta olmayan ürünler' },
          { tip: 'yeni', metin: 'Ürünler Listesi uygulaması: kilitli ve açık tüm ürünler kategoriye göre listelenir; arama ve filtre desteği' },
          // Alışveriş & Sipariş
          { tip: 'yeni', metin: 'Alışveriş listesi: mail\'de "Alışveriş listesine ekle" ile bekletilen müşteri için pazar sayfasında kalıcı liste; sipariş verilince öğe yeşile döner' },
          { tip: 'yeni', metin: 'Sipariş iptali: × butonuyla bekleyen sipariş iptal edilir; para iade edilir, o ürünü bekleyen geciktirilmiş müşterilere memnuniyet cezası uygulanır ve bildirim gösterilir' },
          // Kredi
          { tip: 'yeni', metin: 'Kredi sistemi: TopBar\'daki bakiye butonundan ₺10K/25K/50K/100K kredi; %10 faiz, 5 günlük eşit taksit, gün sonunda otomatik ödeme' },
          { tip: 'yeni', metin: 'Yönetim ekranı Krediler bölümü: her kredinin 5\'li taksit ilerleme çubuğu, kalan borç ve sonraki ödeme günü takibi' },
          // Araçlar
          { tip: 'yeni', metin: 'Hesap Makinesi: iOS tarzı tam işlevli hesap makinesi, operatör geçmişi gösterimi' },
          { tip: 'yeni', metin: 'Çizim uygulaması: HTML5 canvas tabanlı, 15 renk, fırça/silgi, boyut ayarı, dokunmatik ekran desteği' },
          // UX
          { tip: 'iyileştirme', metin: 'Pazar: bekleyen siparişlerde birim fiyat × adet = toplam detayı ve iptal butonu; en üstte mevcut nakit göstergesi (2K altında kırmızıya döner)' },
          { tip: 'iyileştirme', metin: 'TopBar badge\'leri: 💰 nakit (tıklanınca kredi modalı), ⭐ XP, 😊 memnuniyet, 🏆 firma değeri, 📋 toplam borç; tümünde hover açıklaması' },
          { tip: 'iyileştirme', metin: 'Analiz grafikleri yeniden yazıldı: 500px viewBox, Y-ekseni tik ve etiket, gelir/gider karşılaştırma grafiği, tam genişlik düzen' },
          { tip: 'iyileştirme', metin: 'Masaüstü viewport\'a duyarlı hale getirildi; pencere sistemi flex düzeniyle tüm ekran boyutlarına uyum sağlıyor' },
          // Düzeltmeler
          { tip: 'düzeltme', metin: 'Yetersiz nakit hatası: sipariş fiyatı artık aktif event indirim/zamlarını doğru yansıtıyor (getEffectiveBuyPrice)' },
          { tip: 'düzeltme', metin: 'Stok gösterimi: kısmi stok "⚠️ Yetersiz (3/5)" olarak gösteriliyordu, "Stokta yok" yerine doğru değer görünür' },
          { tip: 'düzeltme', metin: 'Save game uyumluluk: UNLOCK_CATEGORIES değiştiğinde eski kayıtlarda eksik kategoriler gün başında otomatik reconcile ediliyor' },
        ],
      },
    ],
  },
  {
    versiyon: 'v1.8.0',
    tarih: '20 Mayıs 2026',
    baslik: 'Tüm İçerikler + Z-Skor Aracı + Tek Kaynak Mimarisi',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Tüm İçerikler sayfası (/icerikler): sekmeli görünüm (Demo, Rehber, Kariyer, Vaka, Araç), ziyaret/anladım/tekrar durumları kartlarda gösteriliyor' },
      { tip: 'yeni', metin: 'Z-Skor & Normal Dağılım Hesaplayıcı (/yazilar/z-skor): μ, σ ve x sliderlarıyla dört mod, SVG çan eğrisi ve 68-95-99.7 kartları' },
      { tip: 'yeni', metin: 'Anladım / Tekrar Bak butonları tüm yazı sayfalarına eklendi — karşılıklı dışlayan, localStorage ile kalıcı' },
      { tip: 'iyileştirme', metin: 'Haritam (/harita) ve Bilgi Grafiği (/grafik) artık lib/icerikler.js\'deki yazilar dizisinden besleniyor; yeni içerik ekleyince otomatik görünür' },
      { tip: 'iyileştirme', metin: 'Bilgi Grafiği: koordinatı olmayan yeni içerikler alt satıra otomatik yerleştirilir, MANUAL_META ile hassas konumlandırma korunuyor' },
      { tip: 'iyileştirme', metin: 'Navbar pill bar: "Tümü" → "Anasayfa", "Tüm İçerikler" butonu /icerikler sayfasına eklendi' },
      { tip: 'düzeltme', metin: 'Gece teması navigasyon sırasında beyaza dönme hatası giderildi (ThemeSync bileşenine gece sınıfı eklendi)' },
      { tip: 'düzeltme', metin: 'İçerik grid düzeni Tailwind v4 uyumsuzluğu nedeniyle tek sütuna düşüyordu — @layer utilities ile giderildi' },
    ],
  },
  {
    versiyon: 'v1.7.0',
    tarih: '19 Mayıs 2026',
    baslik: 'Gece Teması + Logo + Tema Uyumlu Grafikler',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Gece teması (4. tema): koyu indigo/violet palet, ✨ ikonu ile tema döngüsüne eklendi' },
      { tip: 'yeni', metin: 'Data bars SVG logosu — "Sz" yazısı yerine yükselen üç sütun, tüm temalarda uyumlu' },
      { tip: 'yeni', metin: 'Harita sayfasına ProfilHero kartı: sitede geçirilen süre, gün serisi, etkileşim ve başarım istatistikleri' },
      { tip: 'yeni', metin: 'Databricks kullanım rehberi (/yazilar/databricks-rehberi): Lakehouse\'dan MLflow\'a interaktif rehber' },
      { tip: 'düzeltme', metin: 'Proje modülü ve Python Playground: matplotlib grafikleri her çalıştırmada aktif temaya göre arka plan ve renk uyumuyla oluşturuluyor' },
      { tip: 'düzeltme', metin: 'Gece modunda Giscus yorum bileşeni koyu temada görüntülenmiyor sorunu giderildi' },
      { tip: 'düzeltme', metin: 'İnteraktif bileşenlerde (Databricks Demo, sklearn Pipeline, Cohort Analizi) sabit hex renkler tema değişkenlerine ve rgba\'ya taşındı' },
    ],
  },
  {
    versiyon: 'v1.6.0',
    tarih: '18 Mayıs 2026',
    baslik: 'Sinir Ağı Playground + İlerleme Haritası 2.0',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Sinir Ağı Playground (/nn): XOR/çember/spiral veri setleriyle gerçek zamanlı karar sınırı görselleştirme' },
      { tip: 'yeni', metin: 'Harita sayfasına Modüller bölümü: 7 modülün kullanım istatistikleri (Kalori, Mülakat, Milyon, Çiz, NN, Regex, Veri Setleri)' },
      { tip: 'yeni', metin: 'Başarımlar 13\'ten 24\'e yükseltildi — mülakat, milyon yarışması ve playground başarımları eklendi' },
      { tip: 'yeni', metin: 'Tüm modüllere localStorage takibi: milyon kazanımı, mülakat soruları, tahmin ve eğitim sayıları' },
      { tip: 'düzeltme', metin: 'Günün Sorusu dark/lacivert temada parlak yeşil/kırmızı arka plan sorunu — CSS değişkenlerine taşındı' },
      { tip: 'düzeltme', metin: 'ZiyaretTakip ana layout\'a taşındı; /veri-setleri ve /mulakat artık haritaya kaydediliyor' },
    ],
  },
  {
    versiyon: 'v1.5.0',
    tarih: '17 Mayıs 2026',
    baslik: 'Rakam Çiz + Versiyon Geçmişi',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Rakam Çiz (/ciz): Tarayıcıda CNN modeli sıfırdan eğiten interaktif araç — TensorFlow.js, MNIST, WebGL' },
      { tip: 'yeni', metin: '65.000 el yazısı rakamla tarayıcıda gerçek zamanlı model eğitimi, IndexedDB önbellekleme' },
      { tip: 'yeni', metin: 'Bounding box normalization: çizilen rakam MNIST formatına otomatik hizalanıyor' },
      { tip: 'yeni', metin: 'Versiyon geçmişi sayfası (/versiyon) ve footer\'da sürüm numarası badge eklendi' },
      { tip: 'düzeltme', metin: 'Dark/lacivert tema navigasyon sırasında beyaza dönme hatası giderildi (ThemeSync bileşeni)' },
      { tip: 'düzeltme', metin: 'Mülakat sayfası sticky bar konum düzeltmesi ve stil hataları giderildi' },
    ],
  },
  {
    versiyon: 'v1.4.0',
    tarih: '14 Mayıs 2026',
    baslik: 'Kalori AI + Mülakat + Milyoner',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Kalori AI (/kalori): Fotoğraftan kalori tahmini yapan yapay zeka aracı' },
      { tip: 'yeni', metin: 'Mülakat Hazırlık (/mulakat): Veri bilimi mülakat soruları ve ipuçları' },
      { tip: 'yeni', metin: 'Kim Milyoner Olmak İster (/milyon): Veri bilimi temalı bilgi yarışması' },
      { tip: 'iyileştirme', metin: 'Kalori AI: 429 quota hatalarında otomatik model geçişi, session boyunca başarısız modelleri atlama' },
    ],
  },
  {
    versiyon: 'v1.3.0',
    tarih: '10 Mayıs 2026',
    baslik: 'Lacivert Tema + Öğren Genişletme',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Lacivert tema eklendi — üç tema döngüsü: açık / koyu / lacivert' },
      { tip: 'yeni', metin: 'Yol haritası (/harita): Veri bilimine giriş öğrenme yolu takip sistemi' },
      { tip: 'yeni', metin: 'Günün sorusu bileşeni ana sayfaya eklendi' },
      { tip: 'iyileştirme', metin: 'Öğren modülü 20 derse yükseltildi, karma sınav sistemi' },
      { tip: 'yeni', metin: 'Regex Playground, Merkezi Limit Teoremi, Veri Dedektifi araçları' },
    ],
  },
  {
    versiyon: 'v1.2.0',
    tarih: '7 Mayıs 2026',
    baslik: 'Pill Bar Navbar + Yeni İçerikler',
    tip: 'feature',
    ozellikler: [
      { tip: 'iyileştirme', metin: 'Navbar pill bar tasarımına geçiş — kategori ve araç linkleri gruplanmış hâlde' },
      { tip: 'yeni', metin: 'SQL Temelleri, Pandas Hataları, Feature Engineering yazıları' },
      { tip: 'yeni', metin: 'Kariyer yazıları: İlk 90 Gün, Rol Farkları' },
      { tip: 'yeni', metin: 'Sosyal paylaşım ve ilgili içerikler bileşenleri' },
      { tip: 'yeni', metin: 'CSV görüntüleyici ve Renk Paleti araçları' },
    ],
  },
  {
    versiyon: 'v1.1.0',
    tarih: '1 Mayıs 2026',
    baslik: 'İnteraktif Demolar',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Linear Regression, Gradient Descent, K-Means interaktif demoları' },
      { tip: 'yeni', metin: 'Confusion Matrix, Bias-Variance, Sinir Ağı Visualizer' },
      { tip: 'yeni', metin: 'A/B Test hesaplayıcı ve Sample Size aracı' },
      { tip: 'yeni', metin: 'Bezier eğrileri ve vaka çalışmaları (churn, kredi SHAP, İzmir kira, Süperlig xG)' },
    ],
  },
  {
    versiyon: 'v1.0.0',
    tarih: '29 Nisan 2026',
    baslik: 'İlk Yayın',
    tip: 'launch',
    ozellikler: [
      { tip: 'yeni', metin: 'Türkçe veri bilimi platformu — sıfırdan yayına' },
      { tip: 'yeni', metin: 'Yazılar, Öğren modülü (Python temelleri, NumPy, Pandas, istatistik)' },
      { tip: 'yeni', metin: 'Veri setleri sayfası' },
      { tip: 'yeni', metin: 'Dark mode, PWA desteği, SEO altyapısı' },
    ],
  },
];

export default function VersiyonPage() {
  return <VersiyonIcerik versiyonlar={versiyonlar} currentVersion={CURRENT_VERSION} />;
}
