'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const ROLE_LABELS = { admin: 'Admin', moderator: 'Moderatör', user: 'Kullanıcı' };
const ROLE_COLORS = {
  admin:     { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  moderator: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
  user:      { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'rgba(255,255,255,0.1)' },
};

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.user;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.3px',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function KullanicilarPage() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [changing, setChanging]   = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole] = useState('');

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/v3/admin/users')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setUsers(d.users))
      .catch(e => setError(`Kullanıcılar alınamadı (${e})`))
      .finally(() => setLoading(false));
  }, []);

  async function changeRole(id, newRole) {
    setChanging(id);
    try {
      const r = await fetch(`/api/v3/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await r.json();
      if (!r.ok) { showToast(data.error || 'Hata', false); return; }
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: data.user.role } : u));
      showToast(`${data.user.name} → ${ROLE_LABELS[newRole]}`);
    } catch {
      showToast('Bağlantı hatası', false);
    } finally {
      setChanging(null);
    }
  }

  async function deleteUser(id, name) {
    if (!confirm(`"${name}" kullanıcısını silmek istediğinden emin misin?`)) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/v3/admin/users/${id}`, { method: 'DELETE' });
      const data = await r.json();
      if (!r.ok) { showToast(data.error || 'Hata', false); return; }
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast(`${name} silindi`);
    } catch {
      showToast('Bağlantı hatası', false);
    } finally {
      setDeleting(null);
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <>
      <style>{`
        .ku-page { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
        .ku-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
        .ku-back { font-size: 14px; color: var(--v3-text-muted); display: flex; align-items: center; gap: 6px; }
        .ku-title { font-size: 24px; font-weight: 800; letter-spacing: -0.4px; color: var(--v3-text); margin: 0; flex: 1; }
        .ku-toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .ku-search {
          flex: 1; min-width: 200px;
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 10px;
          padding: 10px 16px;
          color: var(--v3-text);
          font-size: 14px;
          outline: none;
        }
        .ku-search:focus { border-color: var(--v3-border-bright); }
        .ku-filter {
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 10px;
          padding: 10px 16px;
          color: var(--v3-text);
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }
        .ku-table-wrap { overflow-x: auto; }
        .ku-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .ku-table th {
          text-align: left;
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 700;
          color: var(--v3-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--v3-border);
        }
        .ku-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: var(--v3-text);
          vertical-align: middle;
        }
        .ku-table tr:hover td { background: rgba(255,255,255,0.02); }
        .ku-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .ku-role-select {
          background: transparent;
          border: 1px solid var(--v3-border);
          border-radius: 6px;
          padding: 4px 8px;
          color: var(--v3-text);
          font-size: 13px;
          cursor: pointer;
          outline: none;
        }
        .ku-role-select:focus { border-color: var(--v3-border-bright); }
        .ku-btn-delete {
          background: transparent;
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 6px;
          padding: 5px 12px;
          color: #f87171;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ku-btn-delete:hover { background: rgba(248,113,113,0.1); }
        .ku-btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }
        .ku-empty { text-align: center; padding: 48px 0; color: var(--v3-text-muted); font-size: 14px; }
        .ku-toast {
          position: fixed;
          bottom: 32px;
          right: 24px;
          z-index: 999;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          animation: ku-slide-in 0.2s ease;
        }
        @keyframes ku-slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) { .ku-page { padding: 32px 16px; } }
      `}</style>

      {toast && (
        <div
          className="ku-toast"
          style={{ background: toast.ok ? '#10b981' : '#ef4444' }}
        >
          {toast.msg}
        </div>
      )}

      <div className="ku-page">
        <div className="ku-header">
          <Link href="/admin" className="ku-back">← Admin</Link>
          <h1 className="ku-title">Kullanıcılar</h1>
          <span style={{ fontSize: '13px', color: 'var(--v3-text-muted)' }}>
            {users.length} üye
          </span>
        </div>

        <div className="ku-toolbar">
          <input
            className="ku-search"
            placeholder="İsim veya e-posta ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="ku-filter"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="">Tüm roller</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderatör</option>
            <option value="user">Kullanıcı</option>
          </select>
        </div>

        {loading ? (
          <div style={{ color: 'var(--v3-text-muted)', padding: '32px 0' }}>Yükleniyor...</div>
        ) : error ? (
          <div style={{ color: '#f87171', padding: '32px 0' }}>{error}</div>
        ) : (
          <div className="ku-table-wrap">
            <table className="ku-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Kayıt</th>
                  <th>Son Giriş</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ku-empty">Sonuç bulunamadı</td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          className="ku-avatar"
                          style={{ background: u.avatar_color || '#6366f1' }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--v3-text-muted)' }}>{u.email}</td>
                    <td>
                      <select
                        className="ku-role-select"
                        value={u.role}
                        disabled={changing === u.id}
                        onChange={e => changeRole(u.id, e.target.value)}
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="moderator">Moderatör</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ color: 'var(--v3-text-muted)' }}>{formatDate(u.created_at)}</td>
                    <td style={{ color: 'var(--v3-text-muted)' }}>{formatDate(u.last_login)}</td>
                    <td>
                      <button
                        className="ku-btn-delete"
                        disabled={deleting === u.id}
                        onClick={() => deleteUser(u.id, u.name)}
                      >
                        {deleting === u.id ? '...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
