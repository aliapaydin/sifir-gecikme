<div align="center">

<img src="https://img.shields.io/badge/Sıfır_Gecikme-v2.0.0-1D9E75?style=for-the-badge&labelColor=1a1815" alt="Sıfır Gecikme v2.0.0"/>

# 🟢 Sıfır Gecikme

### Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler.
### Her kavramı önce dener, sonra konuşuruz.

[![Site](https://img.shields.io/badge/🌐_Siteyi_Ziyaret_Et-sifirgecikme.com-1D9E75?style=flat-square)](https://www.sifirgecikme.com)
[![X](https://img.shields.io/badge/𝕏_Twitter-@sifirgecikme-000000?style=flat-square&logo=x)](https://x.com/sifirgecikme)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ali_Apaydın-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/aliapaydin35)
[![Instagram](https://img.shields.io/badge/Instagram-@sifirgecikme-E4405F?style=flat-square&logo=instagram)](https://instagram.com/sifirgecikme)

</div>

---

## 🖥️ Tech Center — v2.0.0 ile Tanışın

> Sıfır Gecikme'nin en büyük özelliği: tarayıcıda çalışan, kayıt gerektirmeyen, tam bir **teknoloji mağazası simülasyon oyunu.**

**Bir IT mağazası işlet.** Müşteri mailleri gelir, siparişleri yönetirsin, fiyatlar değişir, kredi çekebilirsin — hepsi gerçek zamanlı, hepsi localStorage'da.

<details>
<summary><strong>🎮 Oyun mekaniği detayları (genişlet)</strong></summary>

### Nasıl oynanır?

- **Mail kutusu**: Müşterilerden gelen talepleri gör. Siparişi hemen al ya da beklet (1-2 gün). Alışveriş listesine ekleyerek Pazar'da takip et.
- **Pazar**: Tedarikçilerden ürün al. Yerel (+%5 pahalı, aynı gün) veya uzak (standart fiyat, ertesi gün). Aktif etkinlikler fiyatları etkiler.
- **Stok yönetimi**: Ürünler teslim edilene kadar bekleyen sipariş olarak görünür, teslimatta stoka geçer.
- **Müşteri memnuniyeti**: Gecikme, iptal ve düşük stok memnuniyeti düşürür. Hızlı teslimat ve doğru ürün yükseltir.
- **Gün döngüsü**: Her gün müşteriler gelir, siparişler teslim edilir, masraflar düşülür, loan taksitleri ödenir.

### Ekonomi sistemi

| Sistem | Detay |
|--------|-------|
| 💰 Nakit | Başlangıç ₺15.000, her işlemde anlık güncellenir |
| 📦 Stok | 6 kategori: telefon, laptop, tablet, kulaklık, oyun, aksesuvar |
| 🏪 Tedarikçi | Yerel (anlık) vs uzak (ertesi gün, %5 ucuz) |
| 🎪 Etkinlikler | Rastgele fiyat etkileri — indirim veya zam |
| 💳 Kredi | ₺10K-100K arası seçenekler, %10 faiz, 5 günde ödeme |
| ⭐ XP & Seviye | Her başarılı sipariş XP kazandırır |

### Teknik mimari

```
lib/
├── tech-center-engine.js    # Pure fonksiyon oyun motoru (side-effect yok)
├── tech-center-state.js     # useReducer state yönetimi + tüm action'lar
└── tech-center-data.js      # Ürün kataloğu, kategoriler, etkinlik tablosu

components/tech-center/
├── GameApp.js               # Kök bileşen — state + dispatch bağlayıcı
├── Desktop.js               # Tab router (Mail/Pazar/Stok/Yönetim)
├── TopBar.js                # Nakit/XP/memnuniyet badge'leri + kredi modal
├── MailApp.js               # Müşteri mailbox + detay paneli
├── PazarTab.js              # Tedarikçi sipariş ekranı + alışveriş listesi
├── StokTab.js               # Anlık stok tablosu
├── YonetimTab.js            # Kredi takibi + firma değeri + tehlike bölgesi
└── ...diğer bileşenler
```

**Önemli tasarım kararları:**
- Tüm oyun mantığı `tech-center-engine.js`'de saf fonksiyonlar — test edilebilir, yan etkisiz
- Kayıt gerektirmez — state `localStorage`'da `tc_game_v2` anahtarında
- Save game uyumluluğu — `processDayStart` her gün yeni unlock'ları mevcut state'e reconcile eder
- Aktif etkinlik fiyatları her işlemde `getEffectiveBuyPrice` ile hesaplanır

</details>

[🎮 Oyna →](https://www.sifirgecikme.com/tech-center)

---

## ⚡ İnteraktif Demolar

> Sürükle, kaydır, izle — kavramları oynarken öğren.

| Demo | Açıklama | Link |
|------|----------|------|
| 📈 Linear Regression | Noktaları sürükle, R² anlık değişsin | [→](https://www.sifirgecikme.com/yazilar/linear-regression) |
| ⛰️ Gradient Descent | Top yuvarlama oyunu, öğrenme hızını ayarla | [→](https://www.sifirgecikme.com/yazilar/gradient-descent) |
| 🔵 K-Means | Centroid'lerin adım adım hareketi | [→](https://www.sifirgecikme.com/yazilar/kmeans) |
| 🎯 Confusion Matrix | Eşiği kaydır, TP/FP/TN/FN canlı değişsin | [→](https://www.sifirgecikme.com/yazilar/confusion-matrix) |
| 📉 Bias-Variance | Polinom derecesiyle underfitting/overfitting | [→](https://www.sifirgecikme.com/yazilar/bias-variance) |
| 🧠 Sinir Ağı | Katmanları ayarla, sinyalin akışını izle | [→](https://www.sifirgecikme.com/yazilar/sinir-agi) |
| 🌳 Decision Tree | Eşik çiz, Gini hesapla, doğruluğu gör | [→](https://www.sifirgecikme.com/yazilar/decision-tree) |
| 🎨 Bezier Eğrisi | Kontrol noktalarını sürükle, De Casteljau adımlarını gör | [→](https://www.sifirgecikme.com/yazilar/bezier) |
| 📊 Z-Skor | Standart sapma ve normalleştirme interaktif gösterimi | [→](https://www.sifirgecikme.com/yazilar/z-skor) |

---

## 🛠️ Interaktif Araçlar

| Araç | Açıklama | Link |
|------|----------|------|
| 🧪 A/B Test Hesaplayıcı | p-değeri, güven aralığı, etki büyüklüğü | [→](https://www.sifirgecikme.com/yazilar/ab-test) |
| 📐 Sample Size Aracı | Test başlatmadan önce kaç kullanıcı lazım? | [→](https://www.sifirgecikme.com/yazilar/sample-size) |
| 🐍 Python Playground | Tarayıcıda gerçek Python (Pyodide) — kurulum yok! | [→](https://www.sifirgecikme.com/python) |
| 🗄️ SQL Playground | 3 farklı veritabanı, şema gezgini, sql.js motoru | [→](https://www.sifirgecikme.com/sql) |
| 🤖 Kalori AI | Fotoğraftan kalori tahmini — Gemini Vision | [→](https://www.sifirgecikme.com/kalori) |
| ✏️ Rakam Çiz | El yazısı rakam tanıma — TensorFlow.js CNN | [→](https://www.sifirgecikme.com/yazilar/sinir-agi) |
| 🧪 NN Playground | Katman/nöron/aktivasyon deneyi | [→](https://www.sifirgecikme.com/yazilar/sinir-agi) |
| 🔍 Regex Test | Türkçe açıklamalı regex playground | [→](https://www.sifirgecikme.com/yazilar/regex) |
| 💰 Milyon Soru | Kim milyoner tarzı veri bilimi soruları | [→](https://www.sifirgecikme.com/milyon) |
| 💼 Mülakat Simülatörü | Gerçek mülakat soruları, zamanlı pratik | [→](https://www.sifirgecikme.com/mulakat) |

---

## 📖 Rehberler

| Rehber | Açıklama | Link |
|--------|----------|------|
| 🗄️ SQL Temelleri | SELECT → JOIN → GROUP BY → Window fonksiyonlar | [→](https://www.sifirgecikme.com/yazilar/sql-temelleri) |
| 🔧 ETL Nedir? | Extract, Transform, Load — veri mühendisliğinin temeli | [→](https://www.sifirgecikme.com/yazilar/etl-nedir) |
| 📦 dbt Nedir? | Analytics engineering, model katmanları, Jinja | [→](https://www.sifirgecikme.com/yazilar/dbt-nedir) |
| ☁️ Cloud Platformları | AWS vs GCP vs Azure — veri bilimcinin perspektifi | [→](https://www.sifirgecikme.com/yazilar/cloud) |
| 🧱 Databricks | Lakehouse mimarisi, Spark, Unity Catalog | [→](https://www.sifirgecikme.com/yazilar/databricks) |
| 🐼 Pandas'ta 7 Hata | inplace, apply, merge ve daha fazlası | [→](https://www.sifirgecikme.com/yazilar/pandas-7-sey) |
| 🧹 Veri Temizleme | Eksik değer, aykırı değer, tip dönüşümü | [→](https://www.sifirgecikme.com/yazilar/veri-temizleme) |
| 🔧 Feature Engineering | Encoding, ölçekleme, etkileşim özellikleri | [→](https://www.sifirgecikme.com/yazilar/feature-engineering) |
| 🌲 Random Forest | Bagging, önem skoru, hiperparametre ayarı | [→](https://www.sifirgecikme.com/yazilar/random-forest) |
| 🔁 sklearn Pipeline | Preprocessing + model zinciri, CV entegrasyonu | [→](https://www.sifirgecikme.com/yazilar/sklearn-pipeline) |

---

## 📊 Vaka Çalışmaları

| Vaka | Açıklama | Link |
|------|----------|------|
| 🏠 İzmir Kira Analizi | 5.841 ilan, ilçe bazında m² fiyatı | [→](https://www.sifirgecikme.com/yazilar/izmir-kira-analizi) |
| ⚽ Süper Lig xG | Gol mu şans mı? Expected Goals analizi | [→](https://www.sifirgecikme.com/yazilar/superlig-xg) |
| 📊 BI Karşılaştırma | Tableau vs Power BI vs Looker — hangisi ne zaman? | [→](https://www.sifirgecikme.com/yazilar/bi-karsilastirma) |
| 🛒 Sepet Terki Analizi | E-ticaret funnel, kohort ve RFM | [→](https://www.sifirgecikme.com/yazilar/sepet-terki) |
| 💳 Kredi Riski SHAP | XGBoost + SHAP ile model yorumlanabilirliği | [→](https://www.sifirgecikme.com/yazilar/kredi-shap) |

---

## 💼 Kariyer

| Yazı | Açıklama | Link |
|------|----------|------|
| 🗓️ İlk 90 Gün | 15 yıl sonra keşke bilseydim dediklerim | [→](https://www.sifirgecikme.com/yazilar/ilk-90-gun) |
| 🤔 Roller Arası Fark | Veri analisti vs data scientist vs ML engineer | [→](https://www.sifirgecikme.com/yazilar/rol-farklari) |
| 🗺️ Yol Haritası | Veri bilimi öğrenme rotası, adım adım | [→](https://www.sifirgecikme.com/yazilar/yol-haritasi) |
| 📁 Portfolyo Rehberi | GitHub, Kaggle, proje fikirleri — ne, nasıl, neden | [→](https://www.sifirgecikme.com/yazilar/portfolyo) |
| 💬 Mülakat SQL Soruları | En çok sorulan 10 SQL sorusu, çözümüyle | [→](https://www.sifirgecikme.com/yazilar/mulakat-sql) |
| 🔗 LinkedIn Profili | İşe alınanların profilinden fark yaratan detaylar | [→](https://www.sifirgecikme.com/yazilar/linkedin-profili) |

---

## 🎓 Öğrenme Modülü

> Duolingo tarzı Türkçe Python kursu. Önce öğretir, sonra sınar.

```
🐍 Python Temelleri  →  🔄 Döngüler & Fonksiyonlar  →  🔢 NumPy
         ↓
🐼 Pandas  →  📊 İstatistik & ML  →  📈 Matplotlib  →  🎨 Seaborn
         ↓
🔍 Hangi Grafik?  →  💡 Görsel İpuçları  →  🌍 Gerçek Veri
```

**10 ders · 315 XP · Tamamen ücretsiz**

Tüm dersleri tamamlayınca **Site İçerik Uzmanlığı** sertifika sınavına girebilirsin.

[📚 Öğrenmeye Başla →](https://www.sifirgecikme.com/ogren)

---

## 🚀 Uctan Uca Proje

> Veri bulma → temizleme → analiz → görselleştirme → sunum. Tek sayfada, 6 adım.

[🛠️ Projeye Başla →](https://www.sifirgecikme.com/proje)

---

## 📅 Bugünün Sorusu

Her gün yeni bir veri bilimi sorusu. Doğru cevapla, ilerleni haritanda gör.

[🧠 Cevapla →](https://www.sifirgecikme.com)

---

## 📍 İlerleme Haritam

Hesap açmana gerek yok. Ziyaret ettiğin içerikler, çalıştırdığın sorgular, tamamladığın dersler — hepsi cihazında saklanır.

- 📚 Ziyaret edilen içerikler
- 🗄️ SQL ve 🐍 Python sorgu sayacı
- 🎯 Uzmanlık alanı yüzdeleri (ML, SQL, Python, İstatistik, Kariyer)
- 🏅 13 başarım rozeti
- 🎓 Sertifika sınav ilerlemesi

[📍 Haritama Git →](https://www.sifirgecikme.com/harita)

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![Pyodide](https://img.shields.io/badge/Pyodide-3776AB?style=flat-square&logo=python&logoColor=white)
![sql.js](https://img.shields.io/badge/sql.js-003B57?style=flat-square&logo=sqlite&logoColor=white)

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Stil | CSS Variables + inline styles |
| Deploy | Vercel (otomatik CI/CD) |
| Python Playground | Pyodide (WebAssembly) |
| SQL Playground | sql.js (SQLite in-browser) |
| ML / AI | TensorFlow.js, Google Gemini |
| İnteraktif demolar | Vanilla JS + SVG + Canvas |
| Kullanıcı verisi | localStorage (hesap gerekmez) |

---

## 📁 Proje Yapısı

```
sifir_gecikme/
├── app/
│   ├── layout.js              # Global layout (LayoutShell wrapper)
│   ├── page.js                # Ana sayfa + hero canvas + günün sorusu
│   ├── harita/                # İlerleme Haritası sayfası
│   ├── hakkimda/              # Hakkımda sayfası
│   ├── kalori/                # Kalori AI (Gemini Vision)
│   ├── kategori/[slug]/       # Dinamik kategori sayfaları
│   ├── milyon/                # Kim milyoner tarzı soru oyunu
│   ├── mulakat/               # Mülakat simülatörü
│   ├── ogren/                 # Öğrenme modülü listesi
│   │   └── [slug]/            # Dinamik ders sayfaları
│   ├── proje/                 # Uctan uca proje rehberi
│   ├── python/                # Python Playground (Pyodide)
│   ├── sinav/                 # Sertifika sınavı
│   ├── sql/                   # SQL Playground (sql.js)
│   ├── tech-center/           # 🖥️ Tech Center oyunu
│   ├── versiyon/              # Sürüm geçmişi (changelog)
│   │   ├── page.js            # Server component (metadata)
│   │   └── VersiyonIcerik.js  # Client component (accordion)
│   └── yazilar/               # Tüm içerik sayfaları (25+)
│       └── layout.js          # İlgili içerikler + sosyal paylaşım
├── components/
│   ├── LayoutShell.js         # Client wrapper (tema/scroll/analytics)
│   ├── Navbar.js              # Sticky nav + pill bar + dark mode
│   ├── Footer.js              # 3 kolonlu footer
│   ├── HeroCanvas.js          # Gece/gündüz canvas animasyonu
│   ├── GununSorusu.js         # Günlük soru widget'ı
│   ├── IlgiliIcerikler.js     # Makale altı ilgili içerik önerileri
│   ├── SosyalPaylasim.js      # X, LinkedIn, link kopyalama butonları
│   ├── ZiyaretTakip.js        # localStorage ziyaret kaydı
│   ├── Arama.js               # Site içi arama
│   └── tech-center/           # 🖥️ Oyun bileşenleri
│       ├── GameApp.js         # Kök bileşen — state + dispatch
│       ├── Desktop.js         # Tab router
│       ├── TopBar.js          # Badge'ler + kredi modal
│       ├── MailApp.js         # Müşteri mailbox
│       ├── PazarTab.js        # Tedarikçi sipariş + alışveriş listesi
│       ├── StokTab.js         # Anlık stok
│       ├── YonetimTab.js      # Kredi takibi + firma değeri
│       ├── MusteriApp.js      # Müşteri karşılama
│       ├── StokUyariApp.js    # Stok uyarı sistemi
│       ├── TaskbarApp.js      # Görev çubuğu
│       ├── StartMenu.js       # Başlat menüsü
│       ├── Window.js          # Pencere bileşeni
│       └── icons/             # Oyun içi ikonlar
└── lib/
    ├── icerikler.js           # Merkezi içerik listesi (tüm makaleler)
    ├── dersler.js             # Öğrenme modülü ders verisi
    ├── ilerleme.js            # localStorage ilerleme yönetimi
    ├── gunun-sorusu.js        # 30 soruluk günlük soru havuzu
    ├── takip.js               # Ziyaret + sorgu takip yardımcıları
    ├── sinav.js               # Sertifika sınavı soru havuzu
    ├── sqlVeritabanlari.js    # SQL Playground örnek veritabanları
    ├── versiyon.js            # Mevcut versiyon sabiti (CURRENT_VERSION)
    ├── tech-center-engine.js  # Pure fonksiyon oyun motoru
    ├── tech-center-state.js   # useReducer + tüm action'lar
    └── tech-center-data.js    # Ürün kataloğu, etkinlik tablosu
```

---

## 📋 Sürüm Geçmişi

| Versiyon | Öne Çıkanlar |
|----------|--------------|
| **v2.0.0** | Tech Center büyük güncelleme — kredi sistemi, sipariş iptali, alışveriş listesi, tooltip badge'ler |
| v1.8.0 | Tech Center oyunu — stok, mail, pazar, müşteri sistemi |
| v1.7.0 | Kalori AI modülü (Gemini Vision) |
| v1.6.0 | Yeni laciver tema, tema sistemi yeniden yazıldı |
| v1.5.0 | LayoutShell refactor, layout temizlendi |
| v1.4.0 | Versiyon geçmişi sayfası eklendi |
| v1.3.0 | Milyon & Mülakat modülleri |
| v1.2.0 | Rakam Çiz (TensorFlow.js CNN) |
| v1.1.0 | Python & SQL Playground |
| v1.0.0 | İlk yayın |

[📋 Tüm sürüm notları →](https://www.sifirgecikme.com/versiyon)

---

## 🚀 Local Kurulum

```bash
git clone https://github.com/aliapaydin/sifir-gecikme.git
cd sifir-gecikme
npm install
npm run dev
```

`http://localhost:3000` aç, başla.

---

<div align="center">

**Bilgi paylaştıkça çoğalır. 🙏**

*Tüm içerikler Türkçe ve ücretsiz.*

[![Site](https://img.shields.io/badge/www.sifirgecikme.com-1D9E75?style=for-the-badge)](https://www.sifirgecikme.com)

</div>
