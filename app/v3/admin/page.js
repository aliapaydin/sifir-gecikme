'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HERO_ANIMATIONS } from '../components/HeroAnimations';

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--v3-surface)',
      border: '1px solid var(--v3-border)',
      borderRadius: '14px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{ fontSize: '13px', color: 'var(--v3-text-muted)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '36px', fontWeight: 800, color: color || 'var(--v3-text)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--v3-text-faint)' }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', animation: '1' });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroToast, setHeroToast] = useState(null);

  useEffect(() => {
    fetch('/api/v3/admin/stats')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setStats)
      .catch(e => setError(`Veriler alınamadı (${e})`))
      .finally(() => setLoading(false));

    fetch('/api/v3/settings/hero')
      .then(r => r.ok ? r.json() : null)
      .then(s => { if (s) { setHeroForm(s); setHeroLoaded(true); } })
      .catch(() => {});
  }, []);

  async function handleHeroSave(e) {
    e.preventDefault();
    setHeroSaving(true);
    try {
      const res = await fetch('/api/v3/settings/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm),
      });
      const data = await res.json();
      const msg = data.ok ? '✅ Hero ayarları kaydedildi.' : (data.error || 'Kayıt başarısız.');
      const type = data.ok ? 'success' : 'error';
      setHeroToast({ msg, type });
      setTimeout(() => setHeroToast(null), 3500);
    } catch {
      setHeroToast({ msg: 'Bağlantı hatası.', type: 'error' });
      setTimeout(() => setHeroToast(null), 3500);
    } finally {
      setHeroSaving(false);
    }
  }

  return (
    <>
      <style>{`
        .admin-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--v3-text);
          margin: 0;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #818cf8;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .admin-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }
        .admin-nav-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .admin-nav-card {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, transform 0.15s;
        }
        .admin-nav-card:hover {
          border-color: var(--v3-border-bright);
          transform: translateY(-2px);
        }
        .admin-nav-icon {
          font-size: 28px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        .admin-nav-label {
          font-size: 16px;
          font-weight: 700;
          color: var(--v3-text);
        }
        .admin-nav-desc {
          font-size: 13px;
          color: var(--v3-text-muted);
          line-height: 1.5;
        }
        .admin-section-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--v3-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin: 0 0 20px;
        }
        .admin-settings-card {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 16px;
          padding: 28px;
        }
        .admin-settings-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--v3-text-muted); margin-bottom: 8px;
          display: block;
        }
        .admin-settings-input {
          width: 100%; padding: 10px 12px; border-radius: 8px;
          background: var(--v3-bg); border: 1px solid var(--v3-border-bright);
          color: var(--v3-text); font-size: 14px; outline: none;
          font-family: inherit;
        }
        .admin-anim-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;
        }
        .admin-anim-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 6px; border-radius: 12px; cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .admin-toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 500;
          z-index: 9999; border: 1px solid; animation: admin-toast-in 0.2s ease;
          white-space: nowrap;
        }
        .admin-toast.success { background: rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.3); color: #2dd4bf; }
        .admin-toast.error   { background: rgba(239,68,68,0.12);  border-color: rgba(239,68,68,0.3);  color: #f87171; }
        @keyframes admin-toast-in { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @media (max-width: 600px) {
          .admin-page { padding: 32px 16px; }
          .admin-title { font-size: 22px; }
          .admin-anim-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {heroToast && <div className={`admin-toast ${heroToast.type}`}>{heroToast.msg}</div>}

      <div className="admin-page">
        <div className="admin-header">
          <div>
            <div className="admin-badge">⚙ Admin Panel</div>
            <h1 className="admin-title" style={{ marginTop: '10px' }}>Dashboard</h1>
          </div>
          <Link
            href="/v3"
            style={{
              fontSize: '14px',
              color: 'var(--v3-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Siteye dön
          </Link>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: '12px' }}>
          <div className="admin-section-title">Genel Bakış</div>
        </div>
        {loading ? (
          <div style={{ color: 'var(--v3-text-muted)', marginBottom: '48px' }}>Yükleniyor...</div>
        ) : error ? (
          <div style={{ color: '#f87171', marginBottom: '48px' }}>{error}</div>
        ) : (
          <div className="admin-stat-grid">
            <StatCard
              label="Toplam Üye"
              value={stats.users.total}
              color="#818cf8"
              sub={`Bu hafta +${stats.users.newThisWeek} yeni`}
            />
            <StatCard
              label="Aktif Oturum"
              value={stats.activeSessions}
              color="#34d399"
            />
            <StatCard
              label="Moderatör"
              value={stats.users.moderators}
              color="#a78bfa"
            />
            <StatCard
              label="Admin"
              value={stats.users.admins}
              color="#f97316"
            />
          </div>
        )}

        {/* Navigation cards */}
        <div style={{ marginBottom: '12px' }}>
          <div className="admin-section-title">Yönetim</div>
        </div>
        <div className="admin-nav-cards">
          <Link href="/v3/admin/kullanicilar" className="admin-nav-card">
            <div className="admin-nav-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
              👥
            </div>
            <div className="admin-nav-label">Kullanıcılar</div>
            <div className="admin-nav-desc">
              Tüm üyeleri gör, rol ata (admin / moderatör / kullanıcı), hesap sil.
            </div>
            <div style={{ fontSize: '13px', color: '#818cf8', fontWeight: 600 }}>
              Yönet →
            </div>
          </Link>

          <div
            className="admin-nav-card"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            <div className="admin-nav-icon" style={{ background: 'rgba(20,184,166,0.1)' }}>
              📝
            </div>
            <div className="admin-nav-label">İçerik CMS</div>
            <div className="admin-nav-desc">
              Yazı oluştur, düzenle ve yayınla. Moderatörlere görev ata.
            </div>
            <div style={{ fontSize: '12px', color: 'var(--v3-text-faint)', fontWeight: 500 }}>
              Yakında
            </div>
          </div>

          <Link href="/v3/admin/analitik" className="admin-nav-card">
            <div className="admin-nav-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>
              📊
            </div>
            <div className="admin-nav-label">Analitik</div>
            <div className="admin-nav-desc">
              Günlük kayıtlar, aktif oturumlar, rol dağılımı, son üyeler.
            </div>
            <div style={{ fontSize: '13px', color: '#fb923c', fontWeight: 600 }}>
              Görüntüle →
            </div>
          </Link>
        </div>

        {/* Site Ayarları */}
        <div style={{ marginTop: '48px', marginBottom: '12px' }}>
          <div className="admin-section-title">Site Ayarları</div>
        </div>
        {heroLoaded && (
          <form onSubmit={handleHeroSave}>
            <div className="admin-settings-card">
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--v3-text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🖼 Anasayfa Hero Bölümü
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="admin-settings-label">
                    Başlık <span style={{ opacity: 0.5, fontWeight: 400 }}>(\n ile satır kır)</span>
                  </label>
                  <input className="admin-settings-input" type="text"
                    value={heroForm.title}
                    onChange={e => setHeroForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="admin-settings-label">Alt Başlık</label>
                  <textarea className="admin-settings-input" rows={3}
                    value={heroForm.subtitle}
                    onChange={e => setHeroForm(f => ({ ...f, subtitle: e.target.value }))}
                    style={{ resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>
                <div>
                  <label className="admin-settings-label">Animasyon</label>
                  <div className="admin-anim-grid">
                    {Object.entries(HERO_ANIMATIONS).map(([id, { label, emoji }]) => {
                      const active = heroForm.animation === id;
                      return (
                        <button key={id} type="button" className="admin-anim-btn"
                          onClick={() => setHeroForm(f => ({ ...f, animation: id }))}
                          style={{
                            border: `2px solid ${active ? '#6366f1' : 'var(--v3-border)'}`,
                            background: active ? 'rgba(99,102,241,0.1)' : 'var(--v3-surface2)',
                          }}
                        >
                          <span style={{ fontSize: '24px' }}>{emoji}</span>
                          <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center', lineHeight: 1.3, color: active ? '#818cf8' : 'var(--v3-text-muted)' }}>
                            {label}
                          </span>
                          {active && (
                            <span style={{ fontSize: '9px', background: '#6366f1', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>Aktif</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <button type="submit" disabled={heroSaving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                    border: 'none', cursor: heroSaving ? 'not-allowed' : 'pointer',
                    opacity: heroSaving ? 0.6 : 1, transition: 'opacity 0.15s',
                  }}>
                    {heroSaving ? 'Kaydediliyor…' : '💾 Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
