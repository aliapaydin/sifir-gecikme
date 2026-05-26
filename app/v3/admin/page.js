'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    fetch('/api/v3/admin/stats')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setStats)
      .catch(e => setError(`Veriler alınamadı (${e})`))
      .finally(() => setLoading(false));
  }, []);

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
        @media (max-width: 600px) {
          .admin-page { padding: 32px 16px; }
          .admin-title { font-size: 22px; }
        }
      `}</style>

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

          <div
            className="admin-nav-card"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            <div className="admin-nav-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>
              📊
            </div>
            <div className="admin-nav-label">Analitik</div>
            <div className="admin-nav-desc">
              Sayfa görüntülenmeleri, aktif kullanıcılar, içerik performansı.
            </div>
            <div style={{ fontSize: '12px', color: 'var(--v3-text-faint)', fontWeight: 500 }}>
              Yakında
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
