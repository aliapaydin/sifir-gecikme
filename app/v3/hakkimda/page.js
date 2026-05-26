'use client';

const skills = [
  {
    kategori: 'Programlama & Veri',
    renk: '#14b8a6',
    liste: ['Python', 'SQL', 'C#', 'Pandas', 'Machine Learning'],
  },
  {
    kategori: 'BI & Görselleştirme',
    renk: '#6366f1',
    liste: ['Power BI', 'Tableau', 'Domo', 'QlikView'],
  },
  {
    kategori: 'Veri Mühendisliği',
    renk: '#8b5cf6',
    liste: ['Azure Data Factory', 'Dremio', 'Databricks', 'DWH'],
  },
  {
    kategori: 'Otomasyon',
    renk: '#f97316',
    liste: ['PowerApps', 'Power Automate'],
  },
];

const deneyimler = [
  {
    rol: 'Business Intelligence Manager',
    sirket: 'Concentrix',
    konum: 'İstanbul, Türkiye',
    sure: 'Mart 2021 — Günümüz',
    renk: '#14b8a6',
    guncel: true,
    maddeler: [
      'Şirket genelinde yönetim raporlarının veri modellemesi ve tasarımı.',
      'Veri Ambarı (DWH) altyapısının kurulumunda aktif rol.',
      'Power BI uygulamaları ve DWH veri setleri ile entegrasyon.',
      'Finansal raporların oluşturulması ve süreçlerin otomasyonu.',
      'Global Data Lake Proje Yönetimi ve Azure Data Factory dağıtımı.',
    ],
  },
  {
    rol: 'Global Business Intelligence Analyst',
    sirket: 'Webhelp',
    konum: 'İzmir, Türkiye',
    sure: 'Eylül 2019 — Mart 2021',
    renk: '#6366f1',
    guncel: false,
    maddeler: [
      '12 ülke genelinde küresel BI raporlama operasyonlarının yönetimi.',
      'Fonksiyonlar arası ekiplerle iş birliği ile veri stratejisinin geliştirilmesi.',
      'Üst yönetim için stratejik dashboard tasarımı ve sürdürülmesi.',
    ],
  },
  {
    rol: 'Scheduling & Real Time Management Specialist',
    sirket: 'Webhelp',
    konum: 'İzmir, Türkiye',
    sure: 'Ağustos 2018 — Eylül 2019',
    renk: '#8b5cf6',
    guncel: false,
    maddeler: [
      'Operasyonel planlama ve gerçek zamanlı performans izleme.',
    ],
  },
  {
    rol: 'Müşteri Hizmetleri Temsilcisi',
    sirket: 'AssisTT · Türk Hava Yolları Projesi',
    konum: 'İzmir, Türkiye',
    sure: 'Aralık 2016 — Mayıs 2018',
    renk: '#64748b',
    guncel: false,
    maddeler: [
      'Türk Hava Yolları projesi kapsamında müşteri hizmetleri ve operasyonel destek.',
    ],
  },
];

const sertifikalar = [
  { label: 'Microsoft Power BI Data Analyst Associate', renk: '#f59e0b' },
  { label: 'Azure Data Factory for Data Engineers',     renk: '#0ea5e9' },
  { label: 'B223 Data Science',                         renk: '#14b8a6' },
  { label: 'B223 Data Analysis',                        renk: '#14b8a6' },
  { label: 'C# Programming',                            renk: '#6366f1' },
  { label: 'AI Literacy & Technologies',                renk: '#8b5cf6' },
];

const egitim = [
  { derece: 'Ön Lisans — Bilgi Yönetimi',        okul: 'Atatürk Üniversitesi',   tarih: '2019 — 2020', renk: '#14b8a6' },
  { derece: 'Lisans — İngilizce Öğretmenliği',   okul: 'Anadolu Üniversitesi',   tarih: '2009 — 2014', renk: '#6366f1' },
  { derece: 'Ön Lisans — Turist Rehberliği',     okul: 'Bülent Ecevit Üniversitesi', tarih: '2005 — 2007', renk: '#8b5cf6' },
];

export default function V3Hakkimda() {
  return (
    <>
      <style>{`
        .hk-wrap { max-width: 860px; margin: 0 auto; padding: 56px 24px 80px; }
        .hk-section { margin-bottom: 64px; }
        .hk-section-title {
          font-size: 13px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: var(--v3-text-muted);
          margin: 0 0 24px; display: flex; align-items: center; gap: 10px;
        }
        .hk-section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--v3-border);
        }
        .hk-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 20px 24px;
        }

        /* Hero */
        .hk-hero {
          display: flex; gap: 36px; align-items: flex-start;
          margin-bottom: 64px; flex-wrap: wrap;
        }
        .hk-avatar {
          width: 120px; height: 120px; border-radius: 20px;
          overflow: hidden; flex-shrink: 0;
          border: 2px solid rgba(99,102,241,0.4);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .hk-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .hk-hero-info { flex: 1; min-width: 220px; }
        .hk-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px; font-size: 11px;
          font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
          color: #818cf8; margin-bottom: 14px;
        }
        .hk-name {
          font-size: clamp(32px, 5vw, 44px); font-weight: 800;
          line-height: 1.1; letter-spacing: -1px; margin: 0 0 6px;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 60%, #a5f3fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .v3-light .hk-name {
          background: linear-gradient(135deg, #0f172a 0%, #4f46e5 60%, #0d9488 100%);
          -webkit-background-clip: text; background-clip: text;
        }
        .hk-title {
          font-size: 16px; font-weight: 500; color: var(--v3-text-muted);
          margin-bottom: 16px;
        }
        .hk-meta {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
        }
        .hk-meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: var(--v3-text-muted);
        }
        .hk-links { display: flex; gap: 8px; flex-wrap: wrap; }
        .hk-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
          border: 1px solid var(--v3-border); color: var(--v3-text-muted);
          text-decoration: none; transition: border-color 0.15s, color 0.15s;
          background: var(--v3-surface);
        }
        .hk-link:hover { border-color: var(--v3-border-bright); color: var(--v3-text); }

        /* Profil */
        .hk-profil-text {
          font-size: 15px; line-height: 1.8; color: var(--v3-text-muted);
        }
        .hk-profil-text p { margin: 0 0 14px; }
        .hk-profil-text p:last-child { margin: 0; }

        /* Stats */
        .hk-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-top: 24px;
        }
        .hk-stat {
          background: var(--v3-surface2); border: 1px solid var(--v3-border);
          border-radius: 12px; padding: 16px; text-align: center;
        }
        .hk-stat-val { font-size: 24px; font-weight: 800; color: var(--v3-text); }
        .hk-stat-lbl { font-size: 11px; color: var(--v3-text-muted); margin-top: 3px; }

        /* Deneyim */
        .hk-timeline { display: flex; flex-direction: column; gap: 0; }
        .hk-tl-item { display: flex; gap: 0; }
        .hk-tl-left {
          display: flex; flex-direction: column; align-items: center;
          width: 32px; flex-shrink: 0; margin-right: 20px;
        }
        .hk-tl-dot {
          width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid; margin-top: 5px;
        }
        .hk-tl-line { flex: 1; width: 1px; background: var(--v3-border); margin: 6px 0; }
        .hk-tl-item:last-child .hk-tl-line { display: none; }
        .hk-tl-body { flex: 1; padding-bottom: 32px; }
        .hk-tl-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
        .hk-tl-rol { font-size: 16px; font-weight: 700; color: var(--v3-text); }
        .hk-tl-sirket { font-size: 13px; color: var(--v3-text-muted); margin-bottom: 8px; }
        .hk-tl-sure {
          font-size: 12px; font-weight: 600; padding: 3px 10px;
          border-radius: 6px; background: var(--v3-surface2);
          border: 1px solid var(--v3-border); color: var(--v3-text-muted);
          white-space: nowrap; flex-shrink: 0;
        }
        .hk-tl-guncel {
          background: rgba(20,184,166,0.1); border-color: rgba(20,184,166,0.25);
          color: #2dd4bf;
        }
        .hk-tl-maddeler { display: flex; flex-direction: column; gap: 5px; }
        .hk-tl-madde {
          font-size: 13px; color: var(--v3-text-muted); line-height: 1.55;
          display: flex; gap: 8px;
        }
        .hk-tl-madde::before {
          content: '›'; color: var(--v3-accent); font-weight: 700;
          flex-shrink: 0; margin-top: 1px;
        }

        /* Skills */
        .hk-skill-group { margin-bottom: 20px; }
        .hk-skill-group:last-child { margin-bottom: 0; }
        .hk-skill-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .hk-skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .hk-tag {
          padding: 5px 12px; border-radius: 8px; font-size: 13px; font-weight: 500;
          border: 1px solid; transition: opacity 0.15s;
        }

        /* Sertifika */
        .hk-cert-grid { display: flex; flex-direction: column; gap: 10px; }
        .hk-cert {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 10px;
          background: var(--v3-surface2); border: 1px solid var(--v3-border);
        }
        .hk-cert-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .hk-cert-label { font-size: 14px; color: var(--v3-text); }

        /* Eğitim */
        .hk-edu-list { display: flex; flex-direction: column; gap: 12px; }
        .hk-edu {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; flex-wrap: wrap;
          padding: 16px 20px; border-radius: 12px;
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-left-width: 3px;
        }
        .hk-edu-derece { font-size: 14px; font-weight: 600; color: var(--v3-text); margin-bottom: 3px; }
        .hk-edu-okul { font-size: 13px; color: var(--v3-text-muted); }
        .hk-edu-tarih { font-size: 12px; color: var(--v3-text-muted); white-space: nowrap; flex-shrink: 0; }

        /* Diller & Ek */
        .hk-dil-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .hk-dil {
          padding: 16px 20px; border-radius: 12px;
          background: var(--v3-surface); border: 1px solid var(--v3-border);
        }
        .hk-dil-ad { font-size: 15px; font-weight: 700; color: var(--v3-text); margin-bottom: 3px; }
        .hk-dil-seviye { font-size: 12px; color: var(--v3-text-muted); }

        /* Contact */
        .hk-contact-grid { display: flex; flex-wrap: wrap; gap: 10px; }

        @media (max-width: 600px) {
          .hk-hero { gap: 24px; }
          .hk-avatar { width: 88px; height: 88px; border-radius: 16px; }
          .hk-stats { grid-template-columns: 1fr 1fr; }
          .hk-dil-grid { grid-template-columns: 1fr; }
          .hk-tl-left { width: 20px; margin-right: 12px; }
        }
      `}</style>

      <div className="hk-wrap">

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="hk-hero">
          <div className="hk-avatar">
            <img src="/ali.png" alt="Ali Apaydın" />
          </div>
          <div className="hk-hero-info">
            <div className="hk-badge">◈ Sıfır Gecikme Kurucusu</div>
            <h1 className="hk-name">Ali Apaydın</h1>
            <div className="hk-title">Data Scientist & BI Manager</div>
            <div className="hk-meta">
              <span className="hk-meta-item">📍 İzmir, Türkiye</span>
              <span className="hk-meta-item">·</span>
              <span className="hk-meta-item">🌍 Yeşil Pasaport</span>
              <span className="hk-meta-item">·</span>
              <span className="hk-meta-item">🇬🇧 Full Professional English</span>
            </div>
            <div className="hk-links">
              {[
                { href: 'mailto:apaydin.a@gmail.com',         label: '✉ E-posta' },
                { href: 'https://linkedin.com/in/aliapaydin35', label: 'in LinkedIn' },
                { href: 'https://github.com/aliapaydin',       label: 'gh GitHub' },
                { href: 'https://x.com/sifirgecikme',          label: '𝕏 Twitter' },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="hk-link">{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Profil ───────────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">Profil</div>
          <div className="hk-card">
            <div className="hk-profil-text">
              <p>
                Küresel iş zekâsı rollerinde hızlı yükselişiyle dikkat çeken bir Veri Analitiği Yöneticisiyim.
                Karmaşık verileri stratejik iş içgörülerine dönüştürmede uzmanlaşmış; 12 ülkede
                raporlama operasyonlarını yöneterek fonksiyonlar arası küresel iş birliği ve büyük
                ölçekli veri stratejisi konularında derin deneyim edindim.
              </p>
              <p>
                Şu anda Concentrix'te bir veri analitiği ekibine liderlik ederek DWH altyapıları,
                karmaşık veri pipeline'ları ve otomasyon araçları üzerinde çalışıyorum.
                Python, Power BI ve Domo ile üst düzey yönetim panoları tasarlayarak
                organizasyon genelinde veriye dayalı karar alma kültürünü destekliyorum.
              </p>
              <p>
                Sıfır Gecikme'yi; Türkiye'deki veri okuryazarlığı açığını kapatmak,
                kaliteli ve erişilebilir Türkçe içerik üretmek için kurdum.
                Her kavramı interaktif demolarla hissettirip derinlemesine anlatmayı hedefliyorum.
              </p>
            </div>
            <div className="hk-stats">
              <div className="hk-stat">
                <div className="hk-stat-val" style={{ color: '#2dd4bf' }}>8+</div>
                <div className="hk-stat-lbl">Yıl Deneyim</div>
              </div>
              <div className="hk-stat">
                <div className="hk-stat-val" style={{ color: '#818cf8' }}>12</div>
                <div className="hk-stat-lbl">Ülke Kapsamı</div>
              </div>
              <div className="hk-stat">
                <div className="hk-stat-val" style={{ color: '#fb923c' }}>6</div>
                <div className="hk-stat-lbl">Sertifika</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Deneyim ──────────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">İş Deneyimi</div>
          <div className="hk-timeline">
            {deneyimler.map((d) => (
              <div key={d.sirket + d.rol} className="hk-tl-item">
                <div className="hk-tl-left">
                  <div className="hk-tl-dot" style={{ borderColor: d.renk, background: d.guncel ? d.renk : 'transparent' }} />
                  <div className="hk-tl-line" />
                </div>
                <div className="hk-tl-body">
                  <div className="hk-tl-header">
                    <div className="hk-tl-rol" style={{ color: d.guncel ? d.renk : 'var(--v3-text)' }}>{d.rol}</div>
                    <span className={`hk-tl-sure${d.guncel ? ' hk-tl-guncel' : ''}`}>{d.sure}</span>
                  </div>
                  <div className="hk-tl-sirket">{d.sirket} · {d.konum}</div>
                  <div className="hk-tl-maddeler">
                    {d.maddeler.map((m, i) => (
                      <div key={i} className="hk-tl-madde">{m}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Yetenekler ───────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">Yetenekler</div>
          <div className="hk-card">
            {skills.map(({ kategori, renk, liste }) => (
              <div key={kategori} className="hk-skill-group">
                <div className="hk-skill-label" style={{ color: renk }}>{kategori}</div>
                <div className="hk-skill-tags">
                  {liste.map(s => (
                    <span key={s} className="hk-tag" style={{
                      background: `${renk}12`,
                      borderColor: `${renk}30`,
                      color: renk,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sertifikalar ─────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">Sertifikalar</div>
          <div className="hk-cert-grid">
            {sertifikalar.map(({ label, renk }) => (
              <div key={label} className="hk-cert">
                <div className="hk-cert-dot" style={{ background: renk }} />
                <div className="hk-cert-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Eğitim ───────────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">Eğitim</div>
          <div className="hk-edu-list">
            {egitim.map(({ derece, okul, tarih, renk }) => (
              <div key={okul} className="hk-edu" style={{ borderLeftColor: renk }}>
                <div>
                  <div className="hk-edu-derece">{derece}</div>
                  <div className="hk-edu-okul">{okul}</div>
                </div>
                <div className="hk-edu-tarih">{tarih}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Diller ───────────────────────────────────── */}
        <div className="hk-section">
          <div className="hk-section-title">Diller & Mobilite</div>
          <div className="hk-dil-grid">
            <div className="hk-dil">
              <div className="hk-dil-ad">🇹🇷 Türkçe</div>
              <div className="hk-dil-seviye">Anadil</div>
            </div>
            <div className="hk-dil">
              <div className="hk-dil-ad">🇬🇧 İngilizce</div>
              <div className="hk-dil-seviye">İleri Düzey (Full Professional)</div>
            </div>
            <div className="hk-dil" style={{ gridColumn: '1 / -1' }}>
              <div className="hk-dil-ad">🌍 Yeşil Pasaport Sahibi</div>
              <div className="hk-dil-seviye">Schengen Bölgesi & 160+ ülkeye vizesiz seyahat</div>
            </div>
          </div>
        </div>

        {/* ── İletişim ─────────────────────────────────── */}
        <div className="hk-section" style={{ marginBottom: 0 }}>
          <div className="hk-section-title">İletişim</div>
          <div className="hk-contact-grid">
            {[
              { href: 'mailto:apaydin.a@gmail.com',              label: '✉ apaydin.a@gmail.com',        renk: '#14b8a6' },
              { href: 'tel:+905536053500',                        label: '📱 +90 553 605 35 00',          renk: '#6366f1' },
              { href: 'https://linkedin.com/in/aliapaydin35',    label: 'LinkedIn',                     renk: '#0077B5' },
              { href: 'https://github.com/aliapaydin',           label: 'GitHub',                       renk: '#8b5cf6' },
              { href: 'https://x.com/sifirgecikme',              label: '𝕏 @sifirgecikme',              renk: '#f1f5f9' },
              { href: 'https://instagram.com/sifirgecikme',      label: 'Instagram',                    renk: '#E4405F' },
            ].map(({ href, label, renk }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="hk-link"
                onMouseEnter={e => { e.currentTarget.style.borderColor = renk; e.currentTarget.style.color = renk; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
              >{label}</a>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
