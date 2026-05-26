<div align="center">

<img src="https://img.shields.io/badge/Sıfır_Gecikme-v3.3.0-6366f1?style=for-the-badge&labelColor=0d1421" alt="Sıfır Gecikme v3.3.0"/>

# ◈ Sıfır Gecikme

### Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler.
### Her kavramı önce dener, sonra konuşuruz.

[![Site v3](https://img.shields.io/badge/🌐_v3_Siteyi_Ziyaret_Et-sifirgecikme.com/v3-6366f1?style=flat-square)](https://www.sifirgecikme.com/v3)
[![Site v2](https://img.shields.io/badge/🌐_v2-sifirgecikme.com-1D9E75?style=flat-square)](https://www.sifirgecikme.com)
[![X](https://img.shields.io/badge/𝕏_Twitter-@sifirgecikme-000000?style=flat-square&logo=x)](https://x.com/sifirgecikme)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ali_Apaydın-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/aliapaydin35)

</div>

---

## 🆕 Sıfır Gecikme v3 — Yeni Platform

> v3, v2'nin üstüne inşa edildi. v2 rotaları ve içerikleri **değişmeden çalışmaya devam ediyor.**

**Ne değişti?** Hesap sistemi, kişisel panel, Patreon entegrasyonu, v3 tasarım sistemi ve tüm modüllerin yeni arayüzü.

### v3.3.0 — Kullanıcı Paneli + Patreon Entegrasyonu

- **Kullanıcı paneli** (`/v3/panel`): avatar, rol rozeti, hesap bilgileri, öğrenme istatistikleri (Anladım / Tekrar / Ziyaret / XP)
- **Patreon OAuth2 bağlantısı**: kullanıcılar Patreon hesaplarını v3 hesabına bağlayabilir; destekçi rozeti otomatik atanır
- **Destekçi takibi**: patron_status, aylık destek miktarı, toplam katkı — veritabanında saklanıyor
- **Navbar kullanıcı adına tıklama** → panel yönlendirmesi
- DB migration güvenliği: `initDb()` her çalışmada Patreon kolonlarını `IF NOT EXISTS` ile ekliyor

### v3.2.0 — Hakkımda Sayfası CV'den Yeniden Tasarlandı

- Deneyim timeline'ı, yetenekler, sertifikalar, eğitim ve iletişim bölümleriyle tam CV sayfası

### v3.1.0 — Tüm Modüller v3'te

- Kalori AI, Mülakat, Milyon, Veri Setleri, Proje Lab, Bilgi Grafiği, Promilmetre, Tech Center — hepsi `/v3/*` altında
- Navbar'a **Modüller dropdown** menüsü eklendi

### v3.0.0 — Platform Temeli

- E-posta/şifre tabanlı hesap sistemi (kayıt, giriş, JWT cookie oturumu — 30 gün)
- **Neon PostgreSQL** altyapısı: `v3_users`, `v3_sessions` tabloları
- v3 tasarım sistemi: CSS custom properties (`--v3-bg`, `--v3-surface`, `--v3-text` vb.)
- AI Tutor bileşeni: her yazı sayfasına gömülebilir, streamed yanıt
- Python Playground v3 dark mode: matplotlib grafikleri v3 tema paletine uyum sağlıyor
- Anladım/Tekrar Bak butonları ve ZiyaretTakip v3 layout'unda

[📋 Tüm v3 sürüm notları →](https://www.sifirgecikme.com/v3/versiyon)

---

## 🖥️ Tech Center

> Tarayıcıda çalışan, kayıt gerektirmeyen tam bir **teknoloji mağazası simülasyon oyunu.**

**Bir IT mağazası işlet.** Müşteri mailleri gelir, siparişleri yönetirsin, fiyatlar değişir, kredi çekebilirsin.

<details>
<summary><strong>🎮 Oyun mekaniği detayları (genişlet)</strong></summary>

### Nasıl oynanır?

- **Mail kutusu**: Müşterilerden gelen talepleri gör. Siparişi hemen al ya da beklet (1-2 gün).
- **Pazar**: Tedarikçilerden ürün al. Yerel (+%5 pahalı, aynı gün) veya uzak (standart fiyat, ertesi gün).
- **Stok yönetimi**: Ürünler teslim edilene kadar bekleyen sipariş olarak görünür.
- **Müşteri memnuniyeti**: Gecikme ve iptal memnuniyeti düşürür. Hızlı teslimat yükseltir.
- **Gün döngüsü**: Her gün müşteriler gelir, siparişler teslim edilir, loan taksitleri ödenir.

### Ekonomi sistemi

| Sistem | Detay |
|--------|-------|
| 💰 Nakit | Başlangıç ₺15.000, her işlemde anlık güncellenir |
| 📦 Stok | 6 kategori: telefon, laptop, tablet, kulaklık, oyun, aksesuvar |
| 🏪 Tedarikçi | Yerel (anlık) vs uzak (ertesi gün, %5 ucuz) |
| 🎪 Etkinlikler | Rastgele fiyat etkileri — indirim veya zam |
| 💳 Kredi | ₺10K–100K arası seçenekler, %10 faiz, 5 günde ödeme |
| ⭐ XP & Seviye | Her başarılı sipariş XP kazandırır |

### Teknik mimari

```
lib/
├── tech-center-engine.js    # Pure fonksiyon oyun motoru (side-effect yok)
├── tech-center-state.js     # useReducer state yönetimi + tüm action'lar
└── tech-center-data.js      # Ürün kataloğu, kategoriler, etkinlik tablosu
```

</details>

[🎮 Oyna →](https://www.sifirgecikme.com/v3/tech-center)

---

## ⚡ İnteraktif Demolar

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

## 🛠️ Araçlar & Modüller

| Araç | Açıklama | Link |
|------|----------|------|
| 🐍 Python Playground | Tarayıcıda gerçek Python (Pyodide) — kurulum yok! | [→](https://www.sifirgecikme.com/v3/python) |
| 🗄️ SQL Playground | 3 farklı veritabanı, şema gezgini, sql.js motoru | [→](https://www.sifirgecikme.com/v3/sql) |
| 🤖 Kalori AI | Fotoğraftan kalori tahmini — Gemini Vision | [→](https://www.sifirgecikme.com/v3/kalori) |
| ✏️ Rakam Çiz | El yazısı rakam tanıma — TensorFlow.js CNN | [→](https://www.sifirgecikme.com/v3/ciz) |
| 🧪 NN Playground | Katman/nöron/aktivasyon deneyi, karar sınırı görselleştirme | [→](https://www.sifirgecikme.com/v3/nn) |
| 🔍 Regex Test | Türkçe açıklamalı regex playground | [→](https://www.sifirgecikme.com/v3/regex) |
| 💰 Milyon Soru | Kim milyoner tarzı veri bilimi soruları | [→](https://www.sifirgecikme.com/v3/milyon) |
| 💼 Mülakat Simülatörü | Gerçek mülakat soruları, zamanlı pratik | [→](https://www.sifirgecikme.com/v3/mulakat) |
| 🍺 Promilmetre | Widmark formülü ile kan alkol hesaplayıcı | [→](https://www.sifirgecikme.com/v3/promilmetre) |
| 🗺️ Bilgi Grafiği | İçerikler arası bağlantı haritası | [→](https://www.sifirgecikme.com/v3/grafik) |
| 🛠️ Proje Lab | Uctan uca veri projesi rehberi | [→](https://www.sifirgecikme.com/v3/proje) |
| 📊 Veri Setleri | Hazır CSV & veri seti arşivi | [→](https://www.sifirgecikme.com/v3/veri-setleri) |

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

**20 ders · 315 XP · Tamamen ücretsiz**

İlerleme kaydedilir: XP, tamamlanan dersler ve "Anladım / Tekrar Bak" durumları localStorage'da saklanır.

[📚 Öğrenmeye Başla →](https://www.sifirgecikme.com/v3/ogren)

---

## 📍 İlerleme Haritam

Ziyaret ettiğin içerikler, tamamladığın dersler — hepsi cihazında saklanır. v3 hesabı açarsan panelden takip edebilirsin.

- 📚 Ziyaret edilen içerikler
- 🗄️ SQL ve 🐍 Python sorgu sayacı
- 🎯 Uzmanlık alanı yüzdeleri (ML, SQL, Python, İstatistik, Kariyer)
- 🏅 24 başarım rozeti
- 🎓 Sertifika sınav ilerlemesi

[📍 Haritama Git →](https://www.sifirgecikme.com/v3/harita)

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![Pyodide](https://img.shields.io/badge/Pyodide-3776AB?style=flat-square&logo=python&logoColor=white)

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Stil | CSS Custom Properties (v3 tasarım sistemi) |
| Deploy | Vercel (otomatik CI/CD) |
| Veritabanı | Neon serverless PostgreSQL |
| Kimlik doğrulama | JWT (jose) + bcrypt + httpOnly cookie |
| Patreon | OAuth2 token exchange + API entegrasyonu |
| Python Playground | Pyodide (WebAssembly) |
| SQL Playground | sql.js (SQLite in-browser) |
| ML / AI | TensorFlow.js, Google Gemini |
| İnteraktif demolar | Vanilla JS + SVG + Canvas |
| Kullanıcı verisi | localStorage (v2) + Neon PostgreSQL (v3) |

---

## 📁 Proje Yapısı

```
sifir_gecikme/
├── app/
│   ├── v3/                        # 🆕 v3 platform
│   │   ├── layout.js              # v3 layout (V3Navbar + V3Footer)
│   │   ├── page.js                # v3 ana sayfa
│   │   ├── panel/                 # Kullanıcı paneli
│   │   ├── giris/                 # Giriş sayfası
│   │   ├── kayit/                 # Kayıt sayfası
│   │   ├── hakkimda/              # CV tabanlı hakkımda sayfası
│   │   ├── harita/                # İlerleme haritası
│   │   ├── icerikler/             # Tüm içerikler listesi
│   │   ├── versiyon/              # v3 sürüm geçmişi
│   │   ├── ogren/                 # Öğrenme modülü
│   │   ├── yazilar/               # Yazı sayfaları + layout
│   │   ├── python/                # Python Playground (v3 wrapper)
│   │   ├── sql/                   # SQL Playground (v3 wrapper)
│   │   ├── kalori/                # Kalori AI
│   │   ├── mulakat/               # Mülakat simülatörü
│   │   ├── milyon/                # Kim milyoner soruları
│   │   ├── veri-setleri/          # Veri seti arşivi
│   │   ├── proje/                 # Proje rehberi
│   │   ├── grafik/                # Bilgi grafiği
│   │   ├── promilmetre/           # Alkol promilmetre
│   │   ├── tech-center/           # Tech Center oyunu
│   │   ├── ciz/                   # Rakam çiz (CNN)
│   │   ├── nn/                    # NN Playground
│   │   ├── regex/                 # Regex playground
│   │   └── components/
│   │       ├── V3Navbar.js        # Sticky nav + dropdown + mobil menü
│   │       ├── V3Footer.js        # Footer + versiyon badge
│   │       └── V3EmbeddedTutor.js # AI Tutor (streamed)
│   ├── api/
│   │   ├── v3/auth/               # v3 auth API routes
│   │   │   ├── login/             # POST — JWT oturumu oluştur
│   │   │   ├── register/          # POST — yeni kullanıcı
│   │   │   ├── logout/            # POST — oturumu sil
│   │   │   ├── me/                # GET — mevcut kullanıcı
│   │   │   ├── init/              # POST — DB tablolarını oluştur
│   │   │   └── patreon/
│   │   │       ├── route.js       # GET — OAuth başlat
│   │   │       ├── callback/      # GET — token exchange + DB güncelle
│   │   │       └── refresh/       # POST — Patreon durumunu yenile
│   │   ├── kalori-ai/             # Gemini Vision API (rate limited)
│   │   └── tutor/                 # AI Tutor streaming API
│   ├── layout.js                  # Global layout (v2)
│   ├── page.js                    # v2 ana sayfa
│   ├── harita/                    # v2 ilerleme haritası
│   ├── versiyon/                  # v2 sürüm geçmişi
│   ├── tech-center/               # v2 Tech Center
│   └── yazilar/                   # v2 içerik sayfaları (25+)
├── components/                    # v2 paylaşımlı bileşenler
│   ├── AnladimButonlar.js         # Anladım/Tekrar Bak (v2+v3 uyumlu)
│   ├── ZiyaretTakip.js            # localStorage ziyaret kaydı
│   └── tech-center/               # Tech Center oyun bileşenleri
└── lib/
    ├── v3/
    │   ├── db.js                  # Neon SQL bağlantısı + initDb()
    │   └── auth.js                # JWT session yönetimi
    ├── patreon.js                 # Patreon API yardımcıları
    ├── icerikler.js               # Merkezi içerik listesi
    ├── dersler.js                 # Öğrenme modülü ders verisi
    ├── tech-center-engine.js      # Pure fonksiyon oyun motoru
    ├── tech-center-state.js       # useReducer + action'lar
    └── tech-center-data.js        # Ürün kataloğu, etkinlik tablosu
```

---

## 📋 Sürüm Geçmişi

| Versiyon | Öne Çıkanlar |
|----------|--------------|
| **v3.3.0** | Kullanıcı paneli, Patreon OAuth2 entegrasyonu, destekçi rozeti |
| **v3.2.0** | Hakkımda sayfası CV'den yeniden tasarlandı |
| **v3.1.0** | Tüm modüller v3'te, Modüller dropdown menüsü |
| **v3.0.0** | v3 platform lansmanı — hesap sistemi, JWT, Neon PostgreSQL, v3 tasarım sistemi |
| v2.3.0 | Patreon destekçi sistemi (v2) |
| v2.2.0 | Alkol Promilmetre modülü |
| v2.1.0 | Kalori AI sunucu tarafına taşındı, model fallback zinciri |
| v2.0.0 | Tech Center 2.0 — kredi sistemi, sipariş iptali, alışveriş listesi |
| v1.8.0 | Tüm İçerikler sayfası, Z-Skor aracı, Anladım/Tekrar Bak |
| v1.7.0 | Gece teması, Data bars logosu |
| v1.0.0 | İlk yayın |

[📋 v3 sürüm notları →](https://www.sifirgecikme.com/v3/versiyon) · [📋 v2 sürüm notları →](https://www.sifirgecikme.com/versiyon)

---

## 🚀 Local Kurulum

```bash
git clone https://github.com/aliapaydin/sifir-gecikme.git
cd sifir-gecikme
npm install
npm run dev
```

`.env.local` dosyası gerekli değişkenler:

```
DATABASE_URL=          # Neon PostgreSQL bağlantı URL'si
SESSION_SECRET=        # JWT imzalama anahtarı (min. 32 karakter)
PATREON_CLIENT_ID=     # Patreon OAuth2 Client ID
PATREON_CLIENT_SECRET= # Patreon OAuth2 Client Secret
PATREON_CREATOR_ID=    # Patreon kampanya sahibi kullanıcı ID'si
GEMINI_API_KEY=        # Google Gemini API anahtarı
```

`http://localhost:3000/v3` aç, başla.

---

<div align="center">

**Bilgi paylaştıkça çoğalır. 🙏**

*Tüm içerikler Türkçe ve ücretsiz.*

[![Site](https://img.shields.io/badge/www.sifirgecikme.com/v3-6366f1?style=for-the-badge)](https://www.sifirgecikme.com/v3)

</div>
