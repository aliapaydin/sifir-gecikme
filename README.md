<div align="center">

<img src="https://img.shields.io/badge/Sıfır_Gecikme-v4.0.0-6366f1?style=for-the-badge&labelColor=0d1421" alt="Sıfır Gecikme v4.0.0"/>

# ◈ Sıfır Gecikme

### Türkçe veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif içerikler.
### Her kavramı önce dener, sonra konuşuruz.

[![Site](https://img.shields.io/badge/🌐_Siteyi_Ziyaret_Et-sifirgecikme.com-6366f1?style=flat-square)](https://www.sifirgecikme.com)
[![X](https://img.shields.io/badge/𝕏_Twitter-@sifirgecikme-000000?style=flat-square&logo=x)](https://x.com/sifirgecikme)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ali_Apaydın-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/aliapaydin35)

</div>

---

## 🆕 v4.0.0 — Bulut Senkronizasyonu & İçerik Analizi

> **v4**, v3 altyapısını koruyarak kullanıcı verilerini buluta taşır ve içerik analitiği ekler.

### Bulut Senkronizasyonu

- **Tech Center oyun ilerlemesi** artık Neon DB'ye senkronize — farklı cihazlarda oynamaya devam edebilirsin
- **AI Tutor konuşma geçmişi** kullanıcı bazlı SQL'de saklanıyor; tarayıcı geçmişi silinse bile konuşmalar korunuyor
- **"Anladım" / "Tekrar Bak" işaretlemeleri** veritabanına kaydediliyor — giriş yapılan tüm cihazlarda senkron
- Mülakat, Kim Milyoner, Kalori istatistikleri DB'ye senkronize ediliyor

### İçerik Analizi (`/v3/analiz`)

- **Bu hafta trend** — son 7 gündeki görüntülenme sayısına göre sıralama
- **Tüm zamanlar en çok okunan** — toplam görüntülenme
- **En çok "Anladım"** ve **en çok "Tekrar Bak"** işaretlenen içerikler
- 🥇🥈🥉 madalyalı leaderboard + progress bar görselleştirme
- **Hero'ya canlı analiz kartı** — bu haftanın trendy içerikleri anasayfada görünür
- Görüntülenme takibi: session başına bir kez, anonim

### UI Güncellemeleri

- **Yeni logo** — data chart SVG, indigo→teal gradient
- **Navbar** genişletildi: 68px, "Kayıt Ol" butonu, geliştirilmiş dropdown
- **Data arkaplan kartları** — her içerik kartına özgü transparan SVG pattern (bar chart, scatter, area chart, heatmap vb.)
- **Haritam accordion** — Anladım/Tekrar listeleri açılıp kapanabilir
- `sifirgecikme.com` artık `/v3` URL'ine yönlendirmiyor, doğrudan v3 gösteriyor

### Yeni Neon DB Tabloları

| Tablo | Amaç |
|-------|------|
| `v3_tech_center_saves` | Oyun state'i (JSONB) |
| `v3_content_marks` | Anladım / Tekrar Bak işaretlemeleri |
| `v3_tutor_messages` | AI Tutor konuşma geçmişi |
| `v3_user_stats` | Uygulama istatistikleri (key-value) |
| `v3_content_views` | Günlük görüntülenme sayıları |

[📋 Tüm sürüm notları →](https://www.sifirgecikme.com/v3/versiyon)

---

## 🖥️ Tech Center

> Tarayıcıda çalışan, kayıt gerektirmeyen tam bir **teknoloji mağazası simülasyon oyunu.**
> v4'te oyun ilerlemesi buluta kaydediliyor — farklı cihazlarda devam edebilirsin.

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
├── tech-center-state.js     # useTechCenterState hook + DB sync (v4)
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
| 📈 İçerik Analizi | Trend, en çok okunan, Anladım/Tekrar istatistikleri | [→](https://www.sifirgecikme.com/v3/analiz) |
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

İlerleme kaydedilir: XP, tamamlanan dersler, "Anladım / Tekrar Bak" durumları — v4'te giriş yapınca buluta senkronize.

[📚 Öğrenmeye Başla →](https://www.sifirgecikme.com/v3/ogren)

---

## 📍 İlerleme Haritam

Ziyaret ettiğin içerikler, "Anladım" ve "Tekrar Bak" işaretlemelerin, tamamladığın dersler — v4'te hesabına bağlı tüm cihazlarda senkron.

- 📚 Ziyaret edilen içerikler (+ bulut sync)
- ✅ Anladım / ↩ Tekrar Bak işaretlemeleri (DB'de kalıcı)
- 🗄️ SQL ve 🐍 Python sorgu sayacı
- 🎯 Uzmanlık alanı yüzdeleri (ML, SQL, Python, İstatistik, Kariyer)
- 🏅 24 başarım rozeti
- 🎓 Sertifika sınav ilerlemesi

[📍 Haritama Git →](https://www.sifirgecikme.com/v3/harita)

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![Pyodide](https://img.shields.io/badge/Pyodide-3776AB?style=flat-square&logo=python&logoColor=white)

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 App Router (Turbopack) |
| Stil | CSS Custom Properties (v3/v4 tasarım sistemi) |
| Deploy | Vercel (otomatik CI/CD) |
| Veritabanı | Neon serverless PostgreSQL (7 tablo) |
| Kimlik doğrulama | JWT (jose) + bcrypt + httpOnly cookie |
| Patreon | OAuth2 token exchange + API entegrasyonu |
| Python Playground | Pyodide (WebAssembly) |
| SQL Playground | sql.js (SQLite in-browser) |
| ML / AI | TensorFlow.js, Google Gemini |
| İnteraktif demolar | Vanilla JS + SVG + Canvas |
| Kullanıcı verisi | Neon PostgreSQL (v4 bulut sync) + localStorage (fallback) |

---

## 📁 Proje Yapısı

```
sifir_gecikme/
├── app/
│   ├── v3/                        # v4 platform (URL: /)
│   │   ├── layout.js              # v3 layout (V3Navbar + V3Footer)
│   │   ├── page.js                # Anasayfa + canlı analiz kartı
│   │   ├── analiz/                # 📈 İçerik analizi sayfası (YENİ)
│   │   ├── panel/                 # Kullanıcı paneli
│   │   ├── giris/ kayit/          # Auth sayfaları
│   │   ├── harita/                # İlerleme haritası (accordion v4)
│   │   ├── icerikler/             # Tüm içerikler (DataCardBg + marks)
│   │   ├── versiyon/              # Sürüm geçmişi (v4.0.0)
│   │   ├── yazilar/               # Yazı sayfaları (view tracking v4)
│   │   ├── tech-center/           # Tech Center (DB sync v4)
│   │   └── components/
│   │       ├── V3Navbar.js        # Logo + dropdown + mobil menü
│   │       ├── V3Footer.js        # Footer v4.0.0
│   │       ├── V3EmbeddedTutor.js # AI Tutor (DB sync v4)
│   │       ├── V3FeaturedSection.js # Öne çıkan (DataCardBg + marks)
│   │       └── DataCardBg.js      # SVG data arkaplan (YENİ)
│   ├── api/v3/
│   │   ├── auth/                  # Login, register, logout, me, patreon
│   │   ├── tc/                    # Tech Center save/load (YENİ)
│   │   ├── marks/                 # Content marks CRUD (YENİ)
│   │   ├── tutor/                 # AI Tutor history (YENİ)
│   │   ├── stats/                 # User stats sync (YENİ)
│   │   ├── views/                 # View tracking (YENİ)
│   │   └── analytics/             # Analytics queries (YENİ)
│   └── page.js                    # Rewrite → /v3 (URL değişmez)
├── lib/
│   ├── v3/db.js                   # Neon SQL + initDb() (7 tablo)
│   ├── v3/auth.js                 # JWT session yönetimi
│   ├── useContentMarks.js         # Marks hook (DB sync) (YENİ)
│   ├── useTrackView.js            # View tracking hook (YENİ)
│   ├── syncStats.js               # Stats sync utility (YENİ)
│   ├── tech-center-state.js       # Game state + DB sync (v4)
│   └── icerikler.js               # Merkezi içerik listesi
├── components/
│   ├── AnladimButonlar.js         # Anladım/Tekrar (DB sync v4)
│   └── LayoutShell.js             # V2 kabuğu (/ → v3 aware)
└── next.config.mjs                # beforeFiles rewrite / → /v3
```

---

## 📋 Sürüm Geçmişi

| Versiyon | Öne Çıkanlar |
|----------|--------------|
| **v4.0.0** | Bulut sync, içerik analizi, yeni logo/navbar, DataCardBg, view tracking |
| v3.5.0 | Mobil PC Topla yenilendi, anasayfa güncellemeleri |
| v3.4.0 | Hero yeniden tasarım, navbar & footer iyileştirmeleri |
| v3.3.0 | Kullanıcı paneli, Patreon OAuth2, destekçi rozeti |
| v3.2.0 | Hakkımda sayfası CV'den yeniden tasarlandı |
| v3.1.0 | Tüm modüller v3'te, Modüller dropdown menüsü |
| v3.0.0 | v3 platform lansmanı — hesap sistemi, JWT, Neon PostgreSQL |
| v2.3.0 | Patreon destekçi sistemi |
| v2.2.0 | Alkol Promilmetre modülü |
| v2.0.0 | Tech Center 2.0 |
| v1.0.0 | İlk yayın |

[📋 Tüm sürüm notları →](https://www.sifirgecikme.com/v3/versiyon)

---

## 🚀 Local Kurulum

```bash
git clone https://github.com/aliapaydin/sifir-gecikme.git
cd sifir-gecikme
npm install
npm run dev
```

`.env.local` gerekli değişkenler:

```
DATABASE_URL=          # Neon PostgreSQL bağlantı URL'si
SESSION_SECRET=        # JWT imzalama anahtarı (min. 32 karakter)
PATREON_CLIENT_ID=     # Patreon OAuth2 Client ID
PATREON_CLIENT_SECRET= # Patreon OAuth2 Client Secret
PATREON_CREATOR_ID=    # Patreon kampanya sahibi kullanıcı ID'si
GEMINI_API_KEY=        # Google Gemini API anahtarı
```

`http://localhost:3000` aç — doğrudan v4 anasayfasına gider.

---

<div align="center">

**Bilgi paylaştıkça çoğalır. 🙏**

*Tüm içerikler Türkçe ve ücretsiz.*

[![Site](https://img.shields.io/badge/www.sifirgecikme.com-6366f1?style=for-the-badge)](https://www.sifirgecikme.com)

</div>
