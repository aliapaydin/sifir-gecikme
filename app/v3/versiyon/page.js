'use client';

import { useState } from 'react';
import Link from 'next/link';

const CURRENT_VERSION = 'v4.0.0';

const tipRenk = {
  yeni:        { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', label: 'YENİ' },
  düzeltme:    { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', label: 'DÜZELTMESİ' },
  iyileştirme: { bg: 'rgba(20,184,166,0.12)',  text: '#2dd4bf', label: 'İYİLEŞTİRME' },
};

function OzellikItem({ o }) {
  const tc = tipRenk[o.tip];
  if (!tc) return null;
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span style={{
        padding: '2px 7px', borderRadius: '4px',
        background: tc.bg, color: tc.text,
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
        flexShrink: 0, marginTop: '2px', whiteSpace: 'nowrap',
      }}>
        {tc.label}
      </span>
      <span style={{ fontSize: '14px', color: 'var(--v3-text-muted)', lineHeight: 1.65 }}>{o.metin}</span>
    </div>
  );
}

function GrupItem({ o }) {
  const [acik, setAcik] = useState(false);
  return (
    <div style={{ borderRadius: '10px', border: '1px solid var(--v3-border)', overflow: 'hidden' }}>
      <button
        onClick={() => setAcik(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px',
          background: acik ? 'rgba(99,102,241,0.08)' : 'var(--v3-surface)',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{o.icon}</span>
        <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: acik ? '#818cf8' : 'var(--v3-text)' }}>
          {o.label}
        </span>
        <span style={{
          padding: '1px 8px', borderRadius: '999px',
          background: 'var(--v3-bg)', border: '1px solid var(--v3-border)',
          fontSize: '11px', color: 'var(--v3-text-faint)', fontFamily: 'monospace',
        }}>
          {o.items.length} değişiklik
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--v3-text-faint)', flexShrink: 0,
            transform: acik ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {acik && (
        <div style={{
          padding: '12px 14px', borderTop: '1px solid var(--v3-border)',
          background: 'var(--v3-bg)', display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {o.items.map((item, i) => <OzellikItem key={i} o={item} />)}
        </div>
      )}
    </div>
  );
}

const versiyonlar = [
  {
    versiyon: 'v4.0.0',
    tarih: '13 Haziran 2026',
    baslik: 'Bulut Senkronizasyonu & v4 Güncellemesi',
    ozellikler: [
      { tip: 'yeni', metin: 'Tech Center oyun ilerlemesi artık Neon DB\'ye senkronize — farklı cihazlarda oynamaya devam et, ilerleme kaybolmaz' },
      { tip: 'yeni', metin: 'AI Tutor konuşma geçmişi kullanıcı bazlı SQL\'de saklanıyor; tarayıcı geçmişi silinse bile konuşmalar korunuyor' },
      { tip: 'yeni', metin: '"Anladım" ve "Tekrar Bak" içerik işaretlemeleri veritabanına kaydediliyor — tüm cihazlarda senkron' },
      { tip: 'yeni', metin: 'Haritam sayfasında "Anladım" ve "Tekrar Bak" listeleri açılıp kapanabilir (accordion) olarak gösteriliyor' },
      { tip: 'yeni', metin: 'İçerik kartlarına (haritam, içerikler, anasayfa) işaret durumu badge\'leri eklendi; "tekrar bak" olanlar öne çıkıyor' },
      { tip: 'yeni', metin: 'Kalori, Mülakat, Kim Milyoner istatistikleri veritabanına senkronize ediliyor' },
      { tip: 'yeni', metin: 'Anasayfa araç/playground/içerik kartlarına her birine özgü, hafif transparan data temalı SVG arkaplanlar eklendi (bar chart, scatter, area chart, heatmap, sinyal dalgası vb.)' },
      { tip: 'iyileştirme', metin: 'AI Tutor UI tamamen yenilendi: yeni avatar, sohbet balonları, typing animasyonu ve "☁ Senkron" göstergesi' },
      { tip: 'iyileştirme', metin: 'Navbar: yeni data chart SVG logosu, 68px yükseklik, geliştirilmiş dropdown stilleri, "Kayıt Ol" butonu eklendi' },
      { tip: 'yeni', metin: 'İçerik analizi sayfası (/v3/analiz): bu hafta trend, tüm zamanlar en çok okunan, en çok Anladım/Tekrar Bak işaretlenen — 🥇🥈🥉 sıralamalı leaderboard + 6 özet istatistik' },
      { tip: 'yeni', metin: 'Görüntülenme takibi: her yazı açıldığında session başına bir kez DB\'ye anonim view kaydediliyor (v3_content_views tablosu, günlük granülarite)' },
      { tip: 'yeni', metin: 'Hero\'ya analiz önizleme kartı eklendi — bu hafta görüntülenme sayısı, Anladım/Tekrar sayıları ve top 3 trend içerik canlı gösteriliyor' },
      { tip: 'iyileştirme', metin: 'www.sifirgecikme.com artık /v3 URL\'sine redirect yapmıyor, doğrudan v3 anasayfası gösteriliyor (beforeFiles rewrite)' },
      { tip: 'iyileştirme', metin: 'İçerikler ve haritam sayfası kartlarına data temalı transparan SVG arka planlar eklendi (bar chart, scatter, area chart, network vb.)' },
    ],
  },
  {
    versiyon: 'v3.5.0',
    tarih: '27 Mayıs 2026',
    baslik: 'Mobil PC Topla Yenilendi + Anasayfa Güncellemeleri',
    ozellikler: [
      { tip: 'yeni', metin: 'PC Topla mobil: slot tıklandığında ürünler hemen o slotun altında accordion olarak açılır — ayrı bir alana kaymaz' },
      { tip: 'yeni', metin: 'PC Topla mobil: Özet paneli sağdan kayan overlay olarak gelir (desktop ile aynı davranış); backdrop tıklayınca kapanır' },
      { tip: 'iyileştirme', metin: 'Pazar: kategori filtre butonları sayfayla birlikte kayar; sadece nakit+arama satırı ekranın üstünde sabit kalır' },
      { tip: 'iyileştirme', metin: 'Anasayfa hero animasyonu 300×220px kutu yerine tüm hero bölümünün arkaplanını kaplıyor (opacity: 0.3, sürekli hareketli)' },
      { tip: 'iyileştirme', metin: 'Mobil stats bar: 3 rastgele istat nowrap tek satırda gösterilir' },
      { tip: 'iyileştirme', metin: "Öne çıkan içerikler: 6'dan 12'ye çıkarıldı, Karıştır butonu eklendi" },
      { tip: 'düzeltme', metin: 'Alan adı yönlendirmesi: sifirgecikme.com artık doğrudan v3 anasayfasına yönlendirilir' },
    ],
  },
  {
    versiyon: 'v3.4.0',
    tarih: '26 Mayıs 2026',
    baslik: 'Hero Yeniden Tasarım + Navbar & Footer İyileştirmeleri',
    ozellikler: [
      { tip: 'yeni', metin: 'Hero bölümü yeniden tasarlandı: 2 sütunlu layout, 5 SVG animasyon seçeneği (Sinir Ağı, Bar Chart, Scatter, Data Stream, Sine Wave)' },
      { tip: 'yeni', metin: 'Hero içeriği admin panelinden yönetilebilir: başlık (\\n ile satır kırma), alt başlık ve animasyon seçimi; v3_settings tablosuna kaydediliyor' },
      { tip: 'yeni', metin: 'İstatistik barı 4\'ten 7 maddeye genişletildi: içerik, konu, araç, modül, oyun, kullanıcı ve XP sayaçları' },
      { tip: 'yeni', metin: 'Mobil hamburger menüsü: Playground ve Modüller accordion (aşağı açılır) olarak güncellendi; tam ekran overlay, body scroll kilidi' },
      { tip: 'yeni', metin: 'Footer\'a "👨‍💻 Developer" butonu eklendi (→ /v3/hakkimda); "Anasayfa" butonuna basınca sayfa en üste kaydırılıyor' },
      { tip: 'yeni', metin: 'Navbar\'da "Haritam" linki Playground ve Modüller dropdown\'larından sonraya taşındı' },
      { tip: 'iyileştirme', metin: 'Anasayfa sunucu bileşenine (async server component) dönüştürüldü: hero ayarları DB\'den SSR ile çekiliyor, sayfa yüklenirken flaş yaşanmıyor' },
      { tip: 'iyileştirme', metin: 'Kullanıcı panelinde Admin Paneli bağlantısı görsel kart olarak yeniden tasarlandı' },
      { tip: 'iyileştirme', metin: 'Bilgi Grafiği: Lojistik Regresyon içeriği grafikte konumlandırıldı ve bağlantıları (Doğrusal Regresyon → Confusion Matrix, Bias-Variance) eklendi' },
      { tip: 'düzeltme', metin: 'Mobil menü: backdrop-filter\'ın oluşturduğu containing block nedeniyle fixed konumlandırma bozuluyordu; menü nav dışına taşınarak çözüldü' },
      { tip: 'düzeltme', metin: 'Footer\'dan İçerikler ve Sıfır Gecikme v2 linkleri kaldırıldı; navbar\'dan Geliştirici linki ve ⚙ admin butonu kaldırıldı' },
    ],
  },
  {
    versiyon: 'v3.3.0',
    tarih: '26 Mayıs 2026',
    baslik: 'Kullanıcı Paneli + Patreon Entegrasyonu',
    ozellikler: [
      { tip: 'yeni', metin: 'Kullanıcı paneli (/v3/panel): avatar, isim, rol rozeti, hesap bilgileri, öğrenme istatistikleri (Anladım, Tekrar, Ziyaret, XP)' },
      { tip: 'yeni', metin: 'Patreon OAuth2 bağlantısı: kullanıcılar Patreon hesaplarını v3 hesabına bağlayabilir; destekçi rozeti otomatik atanır' },
      { tip: 'yeni', metin: 'Patreon durumu takibi: patron_status, aylık destek miktarı (pledge_cents), toplam katkı (lifetime_cents) veritabanında saklanıyor' },
      { tip: 'yeni', metin: 'Manuel Patreon yenileme: paneldeki "Yenile" butonu mevcut access token ile Patreon API\'den güncel durumu çekiyor' },
      { tip: 'yeni', metin: 'Navbar kullanıcı adına tıklayınca /v3/panel\'e yönlendirme' },
      { tip: 'iyileştirme', metin: 'DB migration güvenliği: initDb() her callback çağrısında Patreon kolonlarını IF NOT EXISTS ile ekliyor' },
      { tip: 'düzeltme', metin: 'Giriş sonrası navbar güncellenmiyordu: router.push yerine window.location.href ile hard reload' },
      { tip: 'düzeltme', metin: 'Panel "giriş gerekmez" sorunu: getSession base sorgusu Patreon kolonlarına bağımlıydı — bağımsız try-catch ile çözüldü' },
    ],
  },
  {
    versiyon: 'v3.2.0',
    tarih: '25 Mayıs 2026',
    baslik: 'Hakkımda Sayfası — CV\'den Yeniden Tasarım',
    ozellikler: [
      { tip: 'yeni', metin: 'Hakkımda sayfası (/v3/hakkimda) gerçek CV\'den yeniden yazıldı: Hero bölümü, istatistik kartları (8+ yıl, 12 ülke, 6 sertifika)' },
      { tip: 'yeni', metin: 'Deneyim timeline\'ı: Concentrix BI Manager, Webhelp Global BI Analyst, Webhelp RTM Specialist, AssisTT — her biri detaylı başarımlarla' },
      { tip: 'yeni', metin: 'Yetenekler bölümü: 4 kategori (Veri & BI, Programlama & ML, Bulut & DevOps, Yazılım & Araçlar) badge sistemi' },
      { tip: 'yeni', metin: 'Sertifikalar bölümü: 6 aktif sertifika kartları (Google, Microsoft, Databricks, Scrum.org)' },
      { tip: 'yeni', metin: 'Eğitim, Diller & Mobilite ve İletişim bölümleri' },
    ],
  },
  {
    versiyon: 'v3.1.0',
    tarih: '25 Mayıs 2026',
    baslik: 'Tüm Modüller v3\'te + Modüller Menüsü',
    ozellikler: [
      { tip: 'yeni', metin: 'Modüller navbar dropdown menüsü: Playground\'un yanına eklendi; 8 modül listeleniyor' },
      { tip: 'yeni', metin: 'Kalori Takip (/v3/kalori): fotoğraftan kalori tahmini yapay zeka aracı — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Mülakat Hazırlık (/v3/mulakat): veri bilimi mülakat soruları — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Kim Milyoner Olmak İster (/v3/milyon): veri bilimi bilgi yarışması — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Veri Setleri (/v3/veri-setleri): hazır CSV & veri seti arşivi — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Proje Lab (/v3/proje): Python proje önerileri ve şablonları — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Bilgi Grafiği (/v3/grafik): içerikler arası bağlantı haritası — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Promilmetre (/v3/promilmetre): Widmark formülü ile kan alkol hesaplayıcı — v3\'e taşındı' },
      { tip: 'yeni', metin: 'Tech Center (/v3/tech-center): sanal bilgisayar dükkanı oyunu — v3\'e taşındı' },
      { tip: 'iyileştirme', metin: 'Haritam sayfası: v3 modül sayfaları artık harita ilerleme takibine dahil (path normalization)' },
      { tip: 'düzeltme', metin: 'Kalori AI: 503 ve quota hatalarında session boyunca başarısız modelleri atlayarak sıradaki modele geçiş' },
    ],
  },
  {
    versiyon: 'v3.0.0',
    tarih: '24 Mayıs 2026',
    baslik: 'Sıfır Gecikme — Yeniden Başlangıç',
    ozellikler: [
      { tip: 'yeni', metin: 'Tamamen yeni mimari: Next.js 15 App Router, v3 tasarım sistemi (CSS custom properties: --v3-bg, --v3-surface, --v3-text vb.)' },
      { tip: 'yeni', metin: 'E-posta/şifre tabanlı hesap sistemi: kayıt, giriş, oturum yönetimi (JWT, 30 günlük cookie)' },
      { tip: 'yeni', metin: 'Neon PostgreSQL: v3_users ve v3_sessions tabloları — tam kullanıcı veritabanı altyapısı' },
      { tip: 'yeni', metin: 'V3Navbar: linkleme, dropdown menüler, giriş/çıkış, mobil hamburger menüsü' },
      { tip: 'yeni', metin: 'V3 içerik sayfaları: Anladım/Tekrar Bak butonları ve ZiyaretTakip v3 layout\'una entegre' },
      { tip: 'yeni', metin: 'Öğrenme ilerleme kartı: ana sayfada XP, tamamlama yüzdesi ve sıradaki ders gösterimi' },
      { tip: 'yeni', metin: 'AI Tutor (V3EmbeddedTutor): her yazı sayfasına yerleştirilebilir, streamed yanıt desteği' },
      { tip: 'yeni', metin: 'Python Playground v3 dark mode desteği: matplotlib grafikleri v3 tema renk paletine uyum sağlıyor' },
      { tip: 'yeni', metin: 'v3 Haritam sayfası: tüm öğrenme yolu ilerleme takibi, v3 yol adreslerini normalize ederek v2 verisiyle uyumlu' },
      { tip: 'iyileştirme', metin: 'v2 adresleri korunuyor: /v3/* altında tüm içerikler ayrı route\'lar olarak eklendi, v2 bozulmadı' },
    ],
  },
];

export default function V3VersiyonPage() {
  return (
    <>
      <style>{`
        .v3-ver-page {
          min-height: calc(100vh - 144px);
          padding: 48px 24px 80px;
        }
        .v3-ver-inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .v3-ver-hero {
          margin-bottom: 48px;
        }
        .v3-ver-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .v3-ver-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--v3-text);
          margin: 0;
        }
        .v3-ver-badge-current {
          padding: 4px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: monospace;
        }
        .v3-ver-desc {
          color: var(--v3-text-muted);
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 20px;
        }
        .v3-ver-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .v3-ver-stat {
          padding: 4px 10px;
          border-radius: 6px;
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          font-size: 12px;
          font-weight: 600;
        }
        .v3-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .v3-timeline-item {
          display: flex;
          gap: 0;
          position: relative;
        }
        .v3-timeline-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
          padding-top: 6px;
        }
        .v3-timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          z-index: 1;
        }
        .v3-timeline-line {
          width: 2px;
          flex: 1;
          margin-top: 4px;
          min-height: 40px;
          background: var(--v3-border);
        }
        .v3-timeline-content {
          flex: 1;
          padding-bottom: 40px;
          padding-left: 16px;
        }
        .v3-ver-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .v3-ver-number {
          font-family: monospace;
          font-weight: 700;
          font-size: 15px;
          color: var(--v3-text);
        }
        .v3-ver-badge-latest {
          padding: 2px 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .v3-ver-badge-launch {
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(20,184,166,0.15);
          color: #2dd4bf;
          border: 1px solid rgba(20,184,166,0.3);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .v3-ver-date {
          font-size: 12px;
          color: var(--v3-text-faint);
        }
        .v3-ver-heading {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--v3-text);
          margin: 2px 0 14px;
        }
        .v3-ver-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .v3-ver-footer {
          margin-top: 8px;
          padding: 20px;
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 12px;
          text-align: center;
        }
        .v3-ver-footer p {
          font-size: 13px;
          color: var(--v3-text-faint);
          margin-bottom: 12px;
        }
        .v3-ver-gh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 8px;
          background: var(--v3-text);
          color: var(--v3-bg);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .v3-ver-gh-btn:hover { opacity: 0.8; }
        .v3-ver-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--v3-text-muted);
          text-decoration: none;
          margin-bottom: 32px;
          transition: color 0.15s;
        }
        .v3-ver-back:hover { color: var(--v3-text); }
      `}</style>

      <div className="v3-ver-page">
        <div className="v3-ver-inner">

          <Link href="/v3" className="v3-ver-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Anasayfaya dön
          </Link>

          <div className="v3-ver-hero">
            <div className="v3-ver-title-row">
              <h1 className="v3-ver-title">Versiyon Geçmişi</h1>
              <span className="v3-ver-badge-current">{CURRENT_VERSION}</span>
            </div>
            <p className="v3-ver-desc">
              Sıfır Gecikme'nin tüm sürüm notları. Her güncellemeyle ne eklendi, ne düzeltildi.
            </p>
            <div className="v3-ver-stats">
              {[
                { label: `${versiyonlar.length} sürüm`, color: '#818cf8' },
                { label: 'v2 geçmişi korunuyor', color: 'var(--v3-text-muted)' },
                { label: 'Türkçe & ücretsiz', color: 'var(--v3-text-muted)' },
              ].map(b => (
                <span key={b.label} className="v3-ver-stat" style={{ color: b.color }}>{b.label}</span>
              ))}
            </div>
          </div>

          <div className="v3-timeline">
            {versiyonlar.map((v, idx) => (
              <div key={v.versiyon} className="v3-timeline-item">
                <div className="v3-timeline-rail">
                  <div className="v3-timeline-dot" style={{
                    background: idx === 0 ? '#6366f1' : 'var(--v3-border)',
                    border: `2px solid ${idx === 0 ? '#6366f1' : 'var(--v3-border)'}`,
                  }} />
                  {idx < versiyonlar.length - 1 && <div className="v3-timeline-line" />}
                </div>

                <div className="v3-timeline-content">
                  <div className="v3-ver-meta">
                    <span className="v3-ver-number">{v.versiyon}</span>
                    {idx === 0 && <span className="v3-ver-badge-latest">GÜNCEL</span>}
                    {v.versiyon === 'v3.0.0' && <span className="v3-ver-badge-launch">LANSMAN</span>}
                    <span className="v3-ver-date">{v.tarih}</span>
                  </div>
                  <h2 className="v3-ver-heading">{v.baslik}</h2>
                  <div className="v3-ver-items">
                    {v.ozellikler.map((o, i) =>
                      o.tip === 'grup'
                        ? <GrupItem key={i} o={o} />
                        : <OzellikItem key={i} o={o} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="v3-ver-footer">
            <p>Kaynak kodu GitHub'da açık. Hata bildirimi veya öneri için:</p>
            <a
              href="https://github.com/aliapaydin"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-ver-gh-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub'da görüntüle
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
