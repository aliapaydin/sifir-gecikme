import Link from 'next/link';

export const metadata = {
  title: 'Yapay Zeka Ofisi — Sıfır Gecikme',
  description:
    'Raspberry Pi 5 üzerinde tamamen yerel modellerle çalışan, 7 ajanlı kişisel ofis asistanı. Bulut yok, abonelik yok, veri dışarı çıkmıyor.',
};

const ajanlar = [
  {
    isim: 'Postacı',
    emoji: '📬',
    gorev: 'Gelen kutusunu izler, önemlileri ayıklar, ofise bildirir',
    kisilik: 'Telaşlı, meraklı — mailleri herkesten önce görür',
    renk: '#6366f1',
  },
  {
    isim: 'Takvimci',
    emoji: '📅',
    gorev: 'Toplantıdan önce hatırlatır, sabah brifingine günü ekler',
    kisilik: 'Dakik, saat takıntılı, kuru espri yapar',
    renk: '#8b5cf6',
  },
  {
    isim: 'Sekreter',
    emoji: '📋',
    gorev: 'Görevleri tutar, 3 saatte bir ekip toplantısını yönetir, özet gönderir',
    kisilik: 'Sakin, toparlayıcı, hafif ironik',
    renk: '#14b8a6',
  },
  {
    isim: 'Haberci',
    emoji: '📰',
    gorev: 'RSS kaynaklarından sabah haber özeti hazırlar',
    kisilik: 'Enerjik, gündemi takip eder',
    renk: '#f97316',
  },
  {
    isim: 'Yazar',
    emoji: '✍️',
    gorev: 'Mail taslağı ve Türkçe ↔ İngilizce çeviri yazar. Asla kendisi göndermez.',
    kisilik: 'Titiz, kelime seçer',
    renk: '#ec4899',
  },
  {
    isim: 'Denetçi',
    emoji: '🔍',
    gorev: 'Rapor ve veri işlerindeki sorunları bulur, sahibine atar, kodla bildirir',
    kisilik: 'Detaycı, veri kalitesine takıntılı',
    renk: '#eab308',
  },
  {
    isim: 'Bekçi',
    emoji: '🛡️',
    gorev: 'Pi, PC ve servisleri izler; güncellemeyi, yedeği ve geri almayı yönetir',
    kisilik: 'Ağırbaşlı, güvenilir — sunucu odasında yaşar',
    renk: '#10b981',
  },
];

const teknolojiler = [
  { kat: 'Donanım', degerler: ['Raspberry Pi 5 (8 GB)', 'Ryzen 5 7600 + RX 7800 XT 16GB VRAM', 'microSD · Aktif soğutma'] },
  { kat: 'İşletim & Dil', degerler: ['Raspberry Pi OS Lite 64-bit', 'Python · Flask', 'systemd servisleri · SQLite'] },
  { kat: 'Yerel Modeller', degerler: ['Ollama · Gemma 3 12B (PC)', 'Gemma 3 4B (Pi)', 'faster-whisper · nomic-embed-text'] },
  { kat: 'Arayüz', degerler: ['Telegram Bot API', 'HTML Canvas pixel ofis', 'iPhone Kestirmeler · CarPlay'] },
  { kat: 'Ağ & Güvenlik', degerler: ['Tailscale (WireGuard)', 'İnternete açık port yok', 'Kodlu bildirimler (J29 vb.)'] },
  { kat: 'Maliyet', degerler: ['Aylık ek maliyet: 0 TL', 'Abonelik yok · Bulut LLM API yok', 'Yalnızca elektrik'] },
];

const adimlar = [
  { no: '01', baslik: 'Fikir ve plan', aciklama: 'Kaç ajan, hangi yetki, ne maliyet? Karar: tek kod tabanı, tek DB. Önce sentetik veriyle çalıştır.' },
  { no: '02', baslik: 'Donanım & ağ', aciklama: 'Raspberry Pi 5 kurulumu, Tailscale ile özel ağ. Ek uzaktan erişim kapıları kapalı bırakıldı.' },
  { no: '03', baslik: 'Yerel model', aciklama: 'Ollama Pi\'ye ve PC\'ye kuruldu. Türkçe testler yapıldı; PC\'de Gemma 3 12B, Pi\'de Gemma 3 4B seçildi.' },
  { no: '04', baslik: 'İlk ajanlar & Telegram', aciklama: 'Postacı, Takvimci, Sekreter sentetik veriyle ayağa kalktı. Telegram botu: ücretsiz, dakikalar içinde hazır.' },
  { no: '05', baslik: 'Pixel ofis', aciklama: 'Flask + HTML Canvas ile ofis ekranı. Ajanlar masalarında, toplantı odasında, sunucu odasında.' },
  { no: '06', baslik: 'Ekip ritmi & doğal dil', aciklama: '3 saatte bir ekip toplantısı, kararlar Telegram\'a. /komut ile doğal dilde görev ve kalıcı talimat.' },
  { no: '07', baslik: 'Yeni yetenekler', aciklama: 'Ses kayıttan not çıkarma, anlamsal hafıza arama, Haberci, Yazar, Siri & CarPlay entegrasyonu.' },
  { no: '08', baslik: 'Güvenlik & işletim', aciklama: 'Kodlu bildirim, varsayılan kapalı entegrasyonlar, Telegram\'dan tek tıkla güncelleme & otomatik rollback.' },
];

const gunAkisi = [
  { saat: '09:00', olay: 'Günaydın brifingi', detay: 'Takvim, bekleyen görevler, hava, haber özeti' },
  { saat: 'Gün boyu', olay: 'Mail akışı', detay: 'Postacı → toplantı masası tartışması → görev & taslak' },
  { saat: '15 dk önce', olay: 'Toplantı hatırlatması', detay: 'Takvimci bildirimi' },
  { saat: 'Her 3 saatte', olay: 'Ekip toplantısı', detay: 'Sekreter kararları ve aksiyonları Telegram\'a yollar' },
  { saat: 'Sonrasında', olay: 'Ses notu → özet', detay: 'Kayıt Pi\'de metne çevrilir, aksiyonlar butonlarla gelir' },
  { saat: 'Sürekli', olay: 'Bekçi izleme', detay: 'Pi, PC ve servisler; düşen servis hemen haber verir' },
  { saat: 'Cuma 17:00', olay: 'Haftalık kapanış', detay: 'Haftanın özeti ve kapanış briefi' },
];

export default function YapayZekaOfisiPage() {
  return (
    <>
      <style>{`
        .yzo-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }

        /* Hero */
        .yzo-hero {
          position: relative; padding: 64px 24px 52px; overflow: hidden;
          border-bottom: 1px solid var(--v3-border);
        }
        .yzo-hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.2) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 30%, rgba(20,184,166,0.12) 0%, transparent 55%);
          pointer-events: none;
        }
        .yzo-hero-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; gap: 48px;
        }
        .yzo-hero-text { flex: 1; }
        .yzo-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
          font-size: 12px; font-weight: 700; color: #818cf8;
          letter-spacing: 0.04em; margin-bottom: 20px;
        }
        .yzo-hero-title {
          font-size: clamp(32px, 5vw, 56px); font-weight: 800;
          line-height: 1.1; letter-spacing: -1.5px; margin: 0 0 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 45%, #5eead4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-light .yzo-hero-title {
          background: linear-gradient(135deg, #1e293b 0%, #4f46e5 45%, #0d9488 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .yzo-hero-sub {
          font-size: clamp(15px, 2vw, 18px); color: var(--v3-text-muted);
          line-height: 1.65; margin: 0 0 32px; max-width: 560px;
        }
        .yzo-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .yzo-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }
        .yzo-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .yzo-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
          background: rgba(255,255,255,0.05); color: var(--v3-text);
          border: 1px solid var(--v3-border); text-decoration: none;
          transition: background 0.15s; backdrop-filter: blur(8px);
        }
        .yzo-btn-secondary:hover { background: rgba(255,255,255,0.09); }
        .yzo-hero-visual {
          flex-shrink: 0; width: 340px;
          background: rgba(13,20,33,0.72);
          border: 1px solid rgba(99,102,241,0.2); border-radius: 20px;
          padding: 20px; backdrop-filter: blur(24px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45);
        }
        .v3-light .yzo-hero-visual {
          background: rgba(255,255,255,0.85); border-color: rgba(99,102,241,0.15);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        }
        .yzo-visual-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
          font-size: 12px; font-weight: 700; color: var(--v3-text-muted);
          letter-spacing: 0.05em;
        }
        .yzo-visual-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 6px #10b981;
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .yzo-tg-msg {
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.18);
          border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; font-size: 12px;
          color: var(--v3-text-muted); line-height: 1.5;
        }
        .yzo-tg-sender { font-weight: 700; color: #818cf8; font-size: 11px; margin-bottom: 3px; }
        .yzo-tg-time { font-size: 10px; color: var(--v3-text-faint); text-align: right; margin-top: 4px; }

        /* Sections */
        .yzo-section { padding: 64px 0 0; }
        .yzo-section-head { margin-bottom: 32px; }
        .yzo-section-title {
          font-size: 22px; font-weight: 800; color: var(--v3-text);
          margin: 0 0 6px; letter-spacing: -0.4px;
        }
        .yzo-section-sub { font-size: 14px; color: var(--v3-text-muted); margin: 0; line-height: 1.6; }

        /* Güvenlik kutusu */
        .yzo-security-box {
          background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2);
          border-radius: 16px; padding: 20px 24px; margin-bottom: 40px;
          display: flex; gap: 14px; align-items: flex-start;
        }
        .yzo-security-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
        .yzo-security-title { font-size: 14px; font-weight: 700; color: #10b981; margin: 0 0 6px; }
        .yzo-security-text { font-size: 13px; color: var(--v3-text-muted); line-height: 1.65; margin: 0; }

        /* Ajan grid */
        .yzo-ajan-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
        .yzo-ajan-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 20px 22px;
          transition: border-color 0.2s, transform 0.2s;
          display: flex; flex-direction: column; gap: 10px;
        }
        .yzo-ajan-card:hover { border-color: var(--v3-border-bright); transform: translateY(-2px); }
        .yzo-ajan-top { display: flex; align-items: center; gap: 12px; }
        .yzo-ajan-emoji {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          flex-shrink: 0;
        }
        .yzo-ajan-isim { font-size: 16px; font-weight: 700; color: var(--v3-text); }
        .yzo-ajan-gorev { font-size: 13px; color: var(--v3-text-muted); line-height: 1.55; }
        .yzo-ajan-kisilik {
          font-size: 12px; color: var(--v3-text-faint); font-style: italic;
          padding-top: 6px; border-top: 1px solid var(--v3-border);
        }

        /* Mimari */
        .yzo-arch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .yzo-arch-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 14px; padding: 20px;
        }
        .yzo-arch-icon { font-size: 24px; margin-bottom: 10px; }
        .yzo-arch-title { font-size: 14px; font-weight: 700; color: var(--v3-text); margin: 0 0 6px; }
        .yzo-arch-desc { font-size: 13px; color: var(--v3-text-muted); line-height: 1.6; margin: 0; }
        .yzo-arch-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .yzo-arch-tag {
          padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
          background: rgba(99,102,241,0.1); color: #818cf8;
        }

        /* Hibrit model */
        .yzo-model-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;
        }
        .yzo-model-card {
          border: 1px solid var(--v3-border); border-radius: 14px; padding: 18px 20px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .yzo-model-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; }
        .yzo-model-name { font-size: 17px; font-weight: 800; color: var(--v3-text); }
        .yzo-model-detail { font-size: 12px; color: var(--v3-text-muted); line-height: 1.5; }

        /* Teknoloji yığını */
        .yzo-tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .yzo-tech-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 12px; padding: 16px 18px;
        }
        .yzo-tech-kat { font-size: 11px; font-weight: 700; color: #818cf8; letter-spacing: 0.06em; margin: 0 0 8px; }
        .yzo-tech-item {
          font-size: 13px; color: var(--v3-text-muted); padding: 3px 0;
          border-bottom: 1px solid var(--v3-border); line-height: 1.5;
        }
        .yzo-tech-item:last-child { border-bottom: none; }

        /* Adımlar */
        .yzo-step-list { display: flex; flex-direction: column; gap: 0; }
        .yzo-step {
          display: flex; gap: 20px; align-items: flex-start; padding: 20px 0;
          border-bottom: 1px solid var(--v3-border);
        }
        .yzo-step:last-child { border-bottom: none; }
        .yzo-step-no {
          font-size: 28px; font-weight: 900; color: rgba(99,102,241,0.2);
          font-family: monospace; flex-shrink: 0; line-height: 1; padding-top: 2px;
          min-width: 44px;
        }
        .yzo-step-baslik { font-size: 15px; font-weight: 700; color: var(--v3-text); margin: 0 0 4px; }
        .yzo-step-aciklama { font-size: 13px; color: var(--v3-text-muted); line-height: 1.6; margin: 0; }

        /* Gün akışı */
        .yzo-gun-list { display: flex; flex-direction: column; gap: 0; }
        .yzo-gun-row {
          display: grid; grid-template-columns: 120px 160px 1fr; gap: 16px;
          align-items: center; padding: 14px 0; border-bottom: 1px solid var(--v3-border);
        }
        .yzo-gun-row:last-child { border-bottom: none; }
        .yzo-gun-saat {
          font-size: 12px; font-weight: 700; color: #818cf8; font-family: monospace;
        }
        .yzo-gun-olay { font-size: 14px; font-weight: 600; color: var(--v3-text); }
        .yzo-gun-detay { font-size: 13px; color: var(--v3-text-muted); }

        /* Öğrendiklerimiz */
        .yzo-ogr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .yzo-ogr-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 12px; padding: 16px 18px; font-size: 13px;
          color: var(--v3-text-muted); line-height: 1.65;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .yzo-ogr-icon { font-size: 16px; flex-shrink: 0; margin-top: 2px; }

        /* CTA bottom */
        .yzo-cta-box {
          margin-top: 64px; border: 1px solid rgba(99,102,241,0.25);
          border-radius: 20px; padding: 40px;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(20,184,166,0.05));
          text-align: center;
        }
        .yzo-cta-title { font-size: 24px; font-weight: 800; color: var(--v3-text); margin: 0 0 10px; }
        .yzo-cta-sub { font-size: 15px; color: var(--v3-text-muted); margin: 0 0 28px; line-height: 1.6; }
        .yzo-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 860px) {
          .yzo-hero-inner { flex-direction: column; }
          .yzo-hero-visual { width: 100%; }
          .yzo-arch-grid { grid-template-columns: 1fr; }
          .yzo-model-row { grid-template-columns: 1fr; }
          .yzo-gun-row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
        }
        @media (max-width: 600px) {
          .yzo-hero { padding: 40px 20px 36px; }
          .yzo-ajan-grid { grid-template-columns: 1fr; }
          .yzo-cta-box { padding: 24px 20px; }
        }
      `}</style>

      {/* Hero */}
      <section className="yzo-hero">
        <div className="yzo-hero-bg" />
        <div className="yzo-hero-inner">
          <div className="yzo-hero-text">
            <div className="yzo-hero-badge">
              <span>🤖</span> Kişisel AI Projesi
            </div>
            <h1 className="yzo-hero-title">Yapay Zeka Ofisi</h1>
            <p className="yzo-hero-sub">
              Raspberry Pi 5 üzerinde tamamen yerel modellerle çalışan, 7 ajanlı kişisel ofis
              asistanı. Bulut yok, abonelik yok, veri dışarı çıkmıyor. Aylık ek maliyet: 0 TL.
            </p>
            <div className="yzo-hero-ctas">
              <a
                href="https://github.com/aliapaydin/yapay-zeka-ofisi"
                target="_blank"
                rel="noopener noreferrer"
                className="yzo-btn-primary"
              >
                GitHub&apos;da İncele →
              </a>
              <Link href="/" className="yzo-btn-secondary">
                ← Anasayfaya Dön
              </Link>
            </div>
          </div>

          {/* Telegram simülasyonu */}
          <div className="yzo-hero-visual">
            <div className="yzo-visual-header">
              <div className="yzo-visual-dot" />
              Yapay Zeka Ofisi · Telegram
            </div>
            <div className="yzo-tg-msg">
              <div className="yzo-tg-sender">Sekreter</div>
              ☀️ Günaydın! Bugün 3 toplantın var. 09:30 planlaması en önemli — Postacı bunu işaretledi.
              <div className="yzo-tg-time">09:00</div>
            </div>
            <div className="yzo-tg-msg">
              <div className="yzo-tg-sender">Postacı</div>
              📬 J29 numaralı konuda yeni mail. Dış kanal — kodu şirket kanalında çözebilirsin.
              <div className="yzo-tg-time">09:04</div>
            </div>
            <div className="yzo-tg-msg">
              <div className="yzo-tg-sender">Takvimci</div>
              ⏰ Haftalık planlama toplantısı 15 dakika sonra başlıyor.
              <div className="yzo-tg-time">09:15</div>
            </div>
          </div>
        </div>
      </section>

      <div className="yzo-wrap">

        {/* Güvenlik uyarısı */}
        <div className="yzo-section" style={{ paddingTop: '40px' }}>
          <div className="yzo-security-box">
            <span className="yzo-security-icon">🔒</span>
            <div>
              <p className="yzo-security-title">Kaynak güvenliği bu projenin merkezinde</p>
              <p className="yzo-security-text">
                Geliştirme ve testlerin tamamı kişisel test hesabı ve sentetik verilerle yapıldı.
                Dış kanallara (Telegram gibi) gerçek ad yerine <strong>J29</strong> gibi kodlar gider;
                ayrıntı yalnızca şirket kaynaklarından bakıldığında görünür.
                Tüm AI modelleri tamamen yerel çalışır — bulut LLM API&#39;si kullanılmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Ajanlar */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">👥 Yedi Ajan</h2>
            <p className="yzo-section-sub">
              Her ajan ayrı süreç değil — tek kod tabanında, farklı görev ve kişilik tanımıyla çalışıyor.
              Hiçbiri benim adıma mail göndermez, toplantı kabul etmez, dosya silmez. Son karar hep bende.
            </p>
          </div>
          <div className="yzo-ajan-grid">
            {ajanlar.map(ajan => (
              <div key={ajan.isim} className="yzo-ajan-card"
                style={{ borderColor: `${ajan.renk}30` }}>
                <div className="yzo-ajan-top">
                  <div className="yzo-ajan-emoji"
                    style={{ background: `${ajan.renk}15` }}>
                    {ajan.emoji}
                  </div>
                  <div>
                    <div className="yzo-ajan-isim">{ajan.isim}</div>
                  </div>
                </div>
                <div className="yzo-ajan-gorev">{ajan.gorev}</div>
                <div className="yzo-ajan-kisilik">💬 {ajan.kisilik}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mimari */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">🏗️ Mimari</h2>
            <p className="yzo-section-sub">Her şey kendi cihazlarında çalışıyor — internete açık port yok.</p>
          </div>
          <div className="yzo-arch-grid">
            <div className="yzo-arch-card">
              <div className="yzo-arch-icon">🍓</div>
              <div className="yzo-arch-title">Raspberry Pi 5 (8 GB) — Orkestratör</div>
              <div className="yzo-arch-desc">
                Tüm ajanları yönetir. Raspberry Pi OS Lite, Python servisleri systemd ile 7/24 açık.
                Veritabanı SQLite. Küçük model (Gemma 3 4B) Pi&#39;de çalışır.
              </div>
              <div className="yzo-arch-tags">
                <span className="yzo-arch-tag">Gemma 3 4B</span>
                <span className="yzo-arch-tag">faster-whisper</span>
                <span className="yzo-arch-tag">SQLite</span>
              </div>
            </div>
            <div className="yzo-arch-card">
              <div className="yzo-arch-icon">💻</div>
              <div className="yzo-arch-title">Ev PC — Büyük Model</div>
              <div className="yzo-arch-desc">
                Ryzen 5 7600 + RX 7800 XT 16GB VRAM. Açıksa Gemma 3 12B GPU üzerinde çalışır;
                kapalıysa Pi devralır — ofis durmaz.
              </div>
              <div className="yzo-arch-tags">
                <span className="yzo-arch-tag">Gemma 3 12B</span>
                <span className="yzo-arch-tag">Ollama</span>
                <span className="yzo-arch-tag">RX 7800 XT</span>
              </div>
            </div>
            <div className="yzo-arch-card">
              <div className="yzo-arch-icon">🔐</div>
              <div className="yzo-arch-title">Özel Ağ — Tailscale</div>
              <div className="yzo-arch-desc">
                Cihazlar Tailscale (WireGuard) ile birbirine bağlı. Ofis ekranı yalnızca bu
                özel ağdan açılır. İnternete açık port yok.
              </div>
              <div className="yzo-arch-tags">
                <span className="yzo-arch-tag">Tailscale</span>
                <span className="yzo-arch-tag">WireGuard</span>
                <span className="yzo-arch-tag">Zero port</span>
              </div>
            </div>
            <div className="yzo-arch-card">
              <div className="yzo-arch-icon">📱</div>
              <div className="yzo-arch-title">Arayüzler</div>
              <div className="yzo-arch-desc">
                Telegram botu: kısa, kodlu bildirimler. HTML Canvas pixel ofis ekranı.
                Siri & CarPlay entegrasyonu — sesli soru, sesli cevap.
              </div>
              <div className="yzo-arch-tags">
                <span className="yzo-arch-tag">Telegram</span>
                <span className="yzo-arch-tag">Pixel Ofis</span>
                <span className="yzo-arch-tag">Siri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hibrit Model */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">🧠 Hibrit Yerel Model</h2>
            <p className="yzo-section-sub">
              Ofis her istekte önce PC&#39;ye sorar. PC açıksa büyük model, kapalıysa Pi&#39;deki küçük model devralır.
            </p>
          </div>
          <div className="yzo-model-row">
            <div className="yzo-model-card" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
              <div className="yzo-model-label" style={{ color: '#818cf8' }}>PC AÇIKSA</div>
              <div className="yzo-model-name">Gemma 3 12B</div>
              <div className="yzo-model-detail">
                Ollama ile GPU üzerinde. Türkçe doğruluk testinde Qwen2.5 14B ile karşılaştırılarak seçildi.
                Hızlı, kaliteli — oyun oynarken bile çalışır.
              </div>
            </div>
            <div className="yzo-model-card" style={{ border: '1px solid rgba(20,184,166,0.3)', background: 'rgba(20,184,166,0.05)' }}>
              <div className="yzo-model-label" style={{ color: '#2dd4bf' }}>PC KAPALIYSA</div>
              <div className="yzo-model-name">Gemma 3 4B</div>
              <div className="yzo-model-detail">
                Pi üzerinde 7/24 çalışır. Toplantılar ve sohbet yavaşlar ama durmaz.
                Küçük model + iyi kurallar büyük modelden iyidir.
              </div>
            </div>
          </div>
          <div className="yzo-tech-card" style={{ marginTop: 0 }}>
            <div className="yzo-tech-kat">DİĞER YEREL MODELLER</div>
            <div className="yzo-tech-item">🎙️ faster-whisper — Toplantı ses kayıtları Pi üzerinde metne dönüşür</div>
            <div className="yzo-tech-item">🔍 nomic-embed-text — &quot;Anlamına göre ara&quot; hafızası için embedding modeli</div>
          </div>
        </div>

        {/* Teknoloji Yığını */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">🛠️ Teknoloji Yığını & Maliyet</h2>
            <p className="yzo-section-sub">Elde olan donanım dışında aylık ek maliyet sıfır.</p>
          </div>
          <div className="yzo-tech-grid">
            {teknolojiler.map(t => (
              <div key={t.kat} className="yzo-tech-card">
                <div className="yzo-tech-kat">{t.kat}</div>
                {t.degerler.map(d => (
                  <div key={d} className="yzo-tech-item">{d}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Adım adım yolculuk */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">🗺️ Adım Adım Yolculuk</h2>
            <p className="yzo-section-sub">Fikirden çalışan sisteme sekiz adım.</p>
          </div>
          <div className="yzo-step-list">
            {adimlar.map(a => (
              <div key={a.no} className="yzo-step">
                <div className="yzo-step-no">{a.no}</div>
                <div>
                  <p className="yzo-step-baslik">{a.baslik}</p>
                  <p className="yzo-step-aciklama">{a.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bir günün akışı */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">⏱️ Bir Günün Akışı</h2>
            <p className="yzo-section-sub">Ajanlar ne zaman ne yapar?</p>
          </div>
          <div className="yzo-gun-list">
            {gunAkisi.map((g, i) => (
              <div key={i} className="yzo-gun-row">
                <div className="yzo-gun-saat">{g.saat}</div>
                <div className="yzo-gun-olay">{g.olay}</div>
                <div className="yzo-gun-detay">{g.detay}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ekran Görüntüleri */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">🖥️ Ekran Görüntüleri</h2>
            <p className="yzo-section-sub">Sistemin gerçek görünümü — demo modunda çalışırken.</p>
          </div>
          <style>{`
            .yzo-screenshots { display: flex; flex-direction: column; gap: 32px; }
            .yzo-shot {
              border-radius: 18px; overflow: hidden;
              border: 1px solid var(--v3-border);
              background: var(--v3-surface);
              transition: box-shadow 0.2s;
            }
            .yzo-shot:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.3); }
            .yzo-shot img {
              width: 100%; display: block;
              border-bottom: 1px solid var(--v3-border);
            }
            .yzo-shot-cap {
              padding: 16px 20px;
              display: flex; align-items: center; gap: 10px;
            }
            .yzo-shot-cap-icon { font-size: 20px; flex-shrink: 0; }
            .yzo-shot-cap-text { font-size: 14px; color: var(--v3-text-muted); line-height: 1.5; }
            .yzo-shot-cap-title { font-size: 15px; font-weight: 700; color: var(--v3-text); margin-bottom: 3px; }
          `}</style>
          <div className="yzo-screenshots">
            <div className="yzo-shot">
              <img src="/yzo/ekran-ofis.png" alt="Pixel ofis ana ekranı — 7 ajan masalarında" loading="lazy" />
              <div className="yzo-shot-cap">
                <span className="yzo-shot-cap-icon">🏢</span>
                <div>
                  <div className="yzo-shot-cap-title">Piksel Ofis — Ana Ekran</div>
                  <div className="yzo-shot-cap-text">HTML Canvas ile oluşturulan ofis g&#246;r&#252;n&#252;m&#252;. Her ajan kendi masas&#305;nda; toplant&#305; odas&#305; ve sunucu odas&#305; ayr&#305; ayr&#305; g&#246;r&#252;l&#252;yor.</div>
                </div>
              </div>
            </div>
            <div className="yzo-shot">
              <img src="/yzo/ekran-ekip.png" alt="Ekip toplantısı — ajanlar karar tartışıyor" loading="lazy" />
              <div className="yzo-shot-cap">
                <span className="yzo-shot-cap-icon">💬</span>
                <div>
                  <div className="yzo-shot-cap-title">Ekip Toplant&#305;s&#305;</div>
                  <div className="yzo-shot-cap-text">3 saatte bir otomatik ekip toplant&#305;s&#305;. Sekreter kararlar&#305; ve aksiyonlar&#305; Telegram&#39;a &#246;zet olarak g&#246;nderir.</div>
                </div>
              </div>
            </div>
            <div className="yzo-shot">
              <img src="/yzo/ekran-telefon.png" alt="Telegram arayüzü — Yapay Zeka Ofisi bildirimleri" loading="lazy" />
              <div className="yzo-shot-cap">
                <span className="yzo-shot-cap-icon">📱</span>
                <div>
                  <div className="yzo-shot-cap-title">Telegram Aray&#252;z&#252;</div>
                  <div className="yzo-shot-cap-text">T&#252;m bildirimler, kararlar ve etkile&#351;imler Telegram &#252;zerinden. Tek tukla g&#246;rev onayla, &#246;neri iste ya da haber al.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Öğrendiklerimiz */}
        <div className="yzo-section">
          <div className="yzo-section-head">
            <h2 className="yzo-section-title">💡 Neler Öğrendik?</h2>
          </div>
          <div className="yzo-ogr-grid">
            <div className="yzo-ogr-card">
              <span className="yzo-ogr-icon">🎯</span>
              <span>Küçük model + iyi kurallar, büyük modelden iyidir. Bülten ve otomatik bildirimleri modele hiç sokmamak Pi&#39;yi rahatlattı.</span>
            </div>
            <div className="yzo-ogr-card">
              <span className="yzo-ogr-icon">🧪</span>
              <span>Önce sentetik veri. Gerçek kurumsal veriye dokunmadan her şeyi uçtan uca çalıştırmak hem güvenli hem hızlı oldu.</span>
            </div>
            <div className="yzo-ogr-card">
              <span className="yzo-ogr-icon">🔒</span>
              <span>Gizlilik bir ayar değil, varsayılan olmalı. Kodlu bildirim ve kapalı entegrasyonlar sonradan eklenmedi, tasarımın kendisi oldu.</span>
            </div>
            <div className="yzo-ogr-card">
              <span className="yzo-ogr-icon">😄</span>
              <span>Kişilik işe yarıyor. Konuşan, şakalaşan ajanlar sıradan bir bildirim akışından çok daha okunur.</span>
            </div>
            <div className="yzo-ogr-card">
              <span className="yzo-ogr-icon">⚙️</span>
              <span>İşletim de ürünün parçası. Tek tıkla güncelleme, otomatik yedek ve geri alma olmadan 7/24 çalışan sistem sürdürülemiyor.</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="yzo-cta-box">
          <h2 className="yzo-cta-title">Kendi ofisini kurmak ister misin?</h2>
          <p className="yzo-cta-sub">
            Yol haritası ve güvenlik ilkeleri GitHub deposunda. Fikir, soru ve önerilere açığız.
          </p>
          <div className="yzo-cta-btns">
            <a
              href="https://github.com/aliapaydin/yapay-zeka-ofisi"
              target="_blank"
              rel="noopener noreferrer"
              className="yzo-btn-primary"
            >
              GitHub Deposuna Git →
            </a>
            <Link href="/" className="yzo-btn-secondary">
              Anasayfaya Dön
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
