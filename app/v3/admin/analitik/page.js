'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function formatFull(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const ROLE_COLORS = {
  admin:     '#f97316',
  moderator: '#8b5cf6',
  user:      '#6366f1',
};

function BarChart({ data }) {
  if (!data?.length) return <div style={{ color: 'var(--v3-text-muted)', fontSize: 14 }}>Veri yok</div>;

  const max = Math.max(...data.map(d => Number(d.count)), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
      {data.map((d, i) => {
        const pct = (Number(d.count) / max) * 100;
        return (
          <div
            key={i}
            title={`${d.day}: ${d.count} kayıt`}
            style={{
              flex: 1,
              height: `${Math.max(pct, 4)}%`,
              background: `rgba(99,102,241,${0.4 + pct / 200})`,
              borderRadius: '3px 3px 0 0',
              minWidth: '4px',
              cursor: 'default',
              transition: 'background 0.2s',
            }}
          />
        );
      })}
    </div>
  );
}

export default function AnalitikPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch('/api/v3/admin/analitik')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(e => setError(`Veriler alınamadı (${e})`))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .an-page { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
        .an-header { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
        .an-back { font-size: 14px; color: var(--v3-text-muted); }
        .an-title { font-size: 24px; font-weight: 800; letter-spacing: -0.4px; color: var(--v3-text); margin: 0; flex: 1; }
        .an-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .an-card {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 16px; padding: 24px;
        }
        .an-card-title {
          font-size: 12px; font-weight: 700; color: var(--v3-text-muted);
          text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 20px;
        }
        .an-stat-big { font-size: 42px; font-weight: 800; color: var(--v3-text); line-height: 1; }
        .an-stat-sub { font-size: 13px; color: var(--v3-text-muted); margin-top: 6px; }
        .an-role-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .an-role-bar-wrap { flex: 1; background: rgba(255,255,255,0.05); border-radius: 4px; height: 8px; overflow: hidden; }
        .an-role-bar { height: 100%; border-radius: 4px; }
        .an-role-label { font-size: 13px; color: var(--v3-text-muted); width: 90px; flex-shrink: 0; }
        .an-role-val { font-size: 13px; font-weight: 700; color: var(--v3-text); width: 32px; text-align: right; flex-shrink: 0; }
        .an-user-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .an-user-row:last-child { border-bottom: none; }
        .an-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .an-user-name { font-size: 14px; font-weight: 500; color: var(--v3-text); }
        .an-user-date { font-size: 11px; color: var(--v3-text-faint); }
        .an-role-badge {
          font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px;
          background: rgba(99,102,241,0.12); color: #818cf8; margin-left: auto; flex-shrink: 0;
        }
        @media (max-width: 600px) { .an-page { padding: 32px 16px; } }
      `}</style>

      <div className="an-page">
        <div className="an-header">
          <Link href="/admin" className="an-back">← Admin</Link>
          <h1 className="an-title">Analitik</h1>
        </div>

        {loading && <div style={{ color: 'var(--v3-text-muted)' }}>Yükleniyor...</div>}
        {error   && <div style={{ color: '#f87171' }}>{error}</div>}

        {data && (
          <div className="an-grid">
            {/* Oturum */}
            <div className="an-card">
              <div className="an-card-title">Bugünkü Aktif Oturumlar</div>
              <div className="an-stat-big" style={{ color: '#34d399' }}>{data.activeToday}</div>
              <div className="an-stat-sub">Son 24 saatte açılan oturum sayısı</div>
            </div>

            {/* Toplam üye */}
            <div className="an-card">
              <div className="an-card-title">Toplam Üye</div>
              <div className="an-stat-big" style={{ color: '#818cf8' }}>
                {data.roleDistribution.reduce((s, r) => s + Number(r.count), 0)}
              </div>
              <div className="an-stat-sub">
                +{data.dailySignups.slice(-7).reduce((s, d) => s + Number(d.count), 0)} son 7 günde
              </div>
            </div>

            {/* Kayıt grafiği */}
            <div className="an-card" style={{ gridColumn: 'span 2' }}>
              <div className="an-card-title">Son 30 Günde Kayıtlar</div>
              <BarChart data={data.dailySignups} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--v3-text-faint)' }}>
                  {data.dailySignups[0]?.day && formatDate(data.dailySignups[0].day)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--v3-text-faint)' }}>Bugün</span>
              </div>
            </div>

            {/* Rol dağılımı */}
            <div className="an-card">
              <div className="an-card-title">Rol Dağılımı</div>
              {data.roleDistribution.map(r => {
                const total = data.roleDistribution.reduce((s, x) => s + Number(x.count), 0);
                const pct   = total ? (Number(r.count) / total) * 100 : 0;
                const color = ROLE_COLORS[r.role] || '#6366f1';
                return (
                  <div key={r.role} className="an-role-row">
                    <span className="an-role-label" style={{ color }}>{r.role}</span>
                    <div className="an-role-bar-wrap">
                      <div className="an-role-bar" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="an-role-val">{r.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Son kayıt olanlar */}
            <div className="an-card">
              <div className="an-card-title">Son Kayıt Olanlar</div>
              {data.recentUsers.map(u => (
                <div key={u.id} className="an-user-row">
                  <div className="an-avatar" style={{ background: u.avatar_color || '#6366f1' }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="an-user-name">{u.name}</div>
                    <div className="an-user-date">{formatFull(u.created_at)}</div>
                  </div>
                  {u.role !== 'user' && (
                    <span
                      className="an-role-badge"
                      style={{ background: `${ROLE_COLORS[u.role]}20`, color: ROLE_COLORS[u.role] }}
                    >
                      {u.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
