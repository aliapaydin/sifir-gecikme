'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PATREON_URL = 'https://www.patreon.com/sifirgecikme';

const AVANTAJLAR = [
  { emoji: '🚫', label: 'Reklamsız Deneyim',     detay: 'Hiçbir banner, pop-up veya izleme kodu olmadan içeriklere odaklan.' },
  { emoji: '🔒', label: 'Özel İçerikler',         detay: 'Destekçilere özel analizler, notebook\'lar ve ileri seviye vaka çalışmaları.' },
  { emoji: '⚡', label: 'Öncelikli Erişim',       detay: 'Yeni araçlara, modüllere ve içeriklere herkesten önce ulaş.' },
  { emoji: '💬', label: 'Doğrudan İletişim',      detay: 'Soru ve önerilerini doğrudan iletebilirsin, öncelikli yanıt alırsın.' },
  { emoji: '🤖', label: 'Sınırsız AI Tutor',      detay: 'AI sorgu limitlari artırılır, öncelikli model erişimi sağlanır.' },
  { emoji: '🏅', label: 'Destekçi Rozeti',        detay: 'Profilinde altın destekçi rozeti ve panelde özel statü.' },
];

const MASRAFLAR = [
  { emoji: '🌐', label: 'Domain & Hosting',       detay: 'sifirgecikme.com alan adı + Vercel Pro barındırma', yuzde: 25 },
  { emoji: '🤖', label: 'Yapay Zeka API',          detay: 'Gemini API — Kalori AI, AI Tutor, Promilmetre analizi', yuzde: 45 },
  { emoji: '🛠️', label: 'Geliştirme Araçları',    detay: 'IDE, tasarım araçları, test & monitoring servisleri', yuzde: 15 },
  { emoji: '📧', label: 'E-posta Servisi',         detay: 'Resend — doğrulama ve bildirim mailleri', yuzde: 5 },
  { emoji: '✍️', label: 'İçerik Üretimi',          detay: 'Araştırma, yazım ve interaktif demo geliştirme süresi', yuzde: 10 },
];

export default function DestekPage() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d?.user || null))
      .catch(() => setUser(null));
  }, []);

  const loggedIn = !!user;

  return (
    <>
      <style>{`
        .dst-page { min-height: calc(100vh - 144px); padding: 56px 24px 96px; }
        .dst-inner { max-width: 620px; margin: 0 auto; }

        .dst-hero { text-align: center; margin-bottom: 56px; }
        .dst-hero-emoji { font-size: 52px; margin-bottom: 16px; }
        .dst-hero-title { font-size: 2rem; font-weight: 800; color: var(--v3-text); margin: 0 0 14px; letter-spacing: -0.5px; }
        .dst-hero-desc { font-size: 16px; color: var(--v3-text-muted); line-height: 1.75; margin: 0; max-width: 480px; margin: 0 auto; }

        .dst-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--v3-text-faint); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .dst-section-label::after { content: ''; flex: 1; height: 1px; background: var(--v3-border); }

        .dst-avantaj-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 48px; }
        .dst-avantaj-card {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 16px 18px; border-radius: 14px;
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          transition: border-color 0.15s;
        }
        .dst-avantaj-card:hover { border-color: rgba(99,102,241,0.3); }
        .dst-avantaj-emoji { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
        .dst-avantaj-label { font-size: 14px; font-weight: 700; color: var(--v3-text); margin-bottom: 3px; }
        .dst-avantaj-detay { font-size: 13px; color: var(--v3-text-muted); line-height: 1.55; }

        .dst-steps { margin-bottom: 48px; display: flex; flex-direction: column; gap: 14px; }
        .dst-step {
          display: flex; gap: 18px; align-items: flex-start;
          padding: 20px 22px; border-radius: 16px;
          background: var(--v3-surface); border: 1px solid var(--v3-border);
        }
        .dst-step-num {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800;
        }
        .dst-step-num.done { background: rgba(20,184,166,0.15); color: #2dd4bf; border: 1px solid rgba(20,184,166,0.3); }
        .dst-step-num.active { background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; }
        .dst-step-num.pending { background: var(--v3-surface2); color: var(--v3-text-faint); border: 1px solid var(--v3-border); }
        .dst-step-body { flex: 1; }
        .dst-step-title { font-size: 15px; font-weight: 700; color: var(--v3-text); margin-bottom: 4px; }
        .dst-step-desc { font-size: 13px; color: var(--v3-text-muted); line-height: 1.55; margin-bottom: 12px; }
        .dst-step-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: opacity 0.15s; cursor: pointer; border: none;
        }
        .dst-step-btn:hover { opacity: 0.85; }
        .dst-step-done-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #2dd4bf;
        }

        .dst-masraf-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 48px; }
        .dst-masraf-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 12px;
          background: var(--v3-surface); border: 1px solid var(--v3-border);
        }
        .dst-masraf-emoji { font-size: 20px; flex-shrink: 0; }
        .dst-masraf-body { flex: 1; }
        .dst-masraf-label { font-size: 14px; font-weight: 600; color: var(--v3-text); }
        .dst-masraf-detay { font-size: 12px; color: var(--v3-text-muted); margin-top: 1px; }
        .dst-masraf-bar-wrap { margin-top: 6px; height: 4px; background: var(--v3-border); border-radius: 2px; overflow: hidden; }
        .dst-masraf-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#6366f1,#8b5cf6); }

        .dst-thanks {
          text-align: center; padding: 28px; border-radius: 16px;
          background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15);
        }
        .dst-thanks p { font-size: 14px; color: var(--v3-text-muted); line-height: 1.7; margin: 0; }

        @media (max-width: 480px) {
          .dst-hero-title { font-size: 1.6rem; }
          .dst-step { flex-direction: column; gap: 12px; }
        }
      `}</style>

      <div className="dst-page">
        <div className="dst-inner">

          <Link href="/v3" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '32px' }}>
            ← Anasayfa
          </Link>

          {/* Hero */}
          <div className="dst-hero">
            <div className="dst-hero-emoji">☕</div>
            <h1 className="dst-hero-title">Sıfır Gecikme'yi Destekle</h1>
            <p className="dst-hero-desc">
              Türkçe veri bilimi içerikleri üretmeye devam edebilmek için desteğin çok değerli.
              Reklamsız, ücretsiz ve açık kalabilmek ancak destekçiler sayesinde mümkün.
            </p>
          </div>

          {/* Avantajlar */}
          <div className="dst-section-label">Destekçi Avantajları</div>
          <div className="dst-avantaj-grid">
            {AVANTAJLAR.map(a => (
              <div key={a.label} className="dst-avantaj-card">
                <span className="dst-avantaj-emoji">{a.emoji}</span>
                <div>
                  <div className="dst-avantaj-label">{a.label}</div>
                  <div className="dst-avantaj-detay">{a.detay}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Adımlar */}
          <div className="dst-section-label">Nasıl Desteklersin</div>
          <div className="dst-steps">

            {/* Adım 1 */}
            <div className="dst-step">
              <div className={`dst-step-num ${loggedIn ? 'done' : 'active'}`}>
                {loggedIn ? '✓' : '1'}
              </div>
              <div className="dst-step-body">
                <div className="dst-step-title">Siteye Üye Ol</div>
                <div className="dst-step-desc">
                  Ücretsiz bir hesap oluştur. İlerleme takibi, AI Tutor ve kişisel panel seni bekliyor.
                </div>
                {loggedIn ? (
                  <div className="dst-step-done-tag">
                    ✓ {user.name} olarak giriş yapıldı
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link href="/v3/kayit" className="dst-step-btn"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
                      Ücretsiz Kayıt Ol
                    </Link>
                    <Link href="/v3/giris" className="dst-step-btn"
                      style={{ background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)', color: 'var(--v3-text-muted)' }}>
                      Zaten üyeyim
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Adım 2 */}
            <div className="dst-step" style={{ borderColor: 'rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.03)' }}>
              <div className={`dst-step-num ${loggedIn ? 'active' : 'pending'}`}
                style={loggedIn ? { background: 'linear-gradient(135deg,#f96854,#f43f5e)' } : {}}>
                2
              </div>
              <div className="dst-step-body">
                <div className="dst-step-title">Patreon'da Destek Ol</div>
                <div className="dst-step-desc">
                  Patreon üzerinden aylık destek vererek tüm avantajlardan hemen yararlanmaya başla.
                  Dilediğin zaman iptal edebilirsin.
                </div>
                <a href={PATREON_URL} target="_blank" rel="noopener noreferrer"
                  className="dst-step-btn"
                  style={{ background: 'linear-gradient(135deg,#f96854,#f43f5e)', color: '#fff' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="15.5" cy="9.5" r="5.5"/>
                    <rect x="0.5" y="2" width="5" height="20"/>
                  </svg>
                  Patreon'da Destekle
                </a>
                {loggedIn && user?.patreonLinkedAt && (
                  <div style={{ marginTop: '10px' }}>
                    <Link href="/v3/panel" style={{ fontSize: '13px', color: '#2dd4bf', textDecoration: 'none' }}>
                      ✓ Patreon bağlı — Panelde görüntüle →
                    </Link>
                  </div>
                )}
                {loggedIn && !user?.patreonLinkedAt && (
                  <div style={{ marginTop: '10px' }}>
                    <a href="/api/v3/auth/patreon" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none' }}>
                      Zaten destekçiyim → Patreon hesabını bağla
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Masraflar */}
          <div className="dst-section-label">Bağışlar Neye Gidiyor</div>
          <div className="dst-masraf-list">
            {MASRAFLAR.map(m => (
              <div key={m.label} className="dst-masraf-card">
                <span className="dst-masraf-emoji">{m.emoji}</span>
                <div className="dst-masraf-body">
                  <div className="dst-masraf-label">{m.label}</div>
                  <div className="dst-masraf-detay">{m.detay}</div>
                  <div className="dst-masraf-bar-wrap">
                    <div className="dst-masraf-bar" style={{ width: `${m.yuzde}%` }} />
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--v3-text-muted)', flexShrink: 0 }}>
                  %{m.yuzde}
                </div>
              </div>
            ))}
          </div>

          {/* Teşekkür */}
          <div className="dst-thanks">
            <p>
              Destekçiler sayesinde site reklamsız ve ücretsiz kalıyor.<br/>
              Her destek, yeni içerik ve özellik anlamına geliyor. İyi ki varsınız. 🙏
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
