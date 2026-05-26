'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ROLE_LABELS = {
  admin:     { label: 'Admin',      bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  moderator: { label: 'Moderatör',  bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  user:      { label: 'Üye',        bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.25)' },
};

const PATRON_LABELS = {
  active_patron:   { label: '✦ Aktif Destekçi',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  declined_patron: { label: '⚠ Ödeme Başarısız',  color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)' },
  former_patron:   { label: '◦ Eski Destekçi',    color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtCents(cents) {
  if (!cents) return '—';
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function V3PanelPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 144px)', fontSize: '14px', color: 'var(--v3-text-muted)' }}>Yükleniyor…</div>}>
      <PanelInner />
    </Suspense>
  );
}

function PanelInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // localStorage stats
  const [stats, setStats] = useState({ anladi: 0, tekrar: 0, xp: 0, ziyaret: 0 });

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.user) { router.push('/v3/giris'); return; }
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => { router.push('/v3/giris'); });
  }, [router]);

  useEffect(() => {
    try {
      const anladi   = JSON.parse(localStorage.getItem('sz_anladi') || '[]').length;
      const tekrar   = JSON.parse(localStorage.getItem('sz_tekrar') || '[]').length;
      const ziyaret  = JSON.parse(localStorage.getItem('sz_ziyaretler') || '[]').length;
      const xp       = JSON.parse(localStorage.getItem('sz_ilerleme_v1') || '{}').toplamXP || 0;
      setStats({ anladi, tekrar, xp, ziyaret });
    } catch {}
  }, []);

  useEffect(() => {
    const p = searchParams.get('patreon');
    const e = searchParams.get('error');
    if (p === 'linked') showToast('✅ Patreon başarıyla bağlandı!', 'success');
    if (e) showToast(`Patreon bağlantısı başarısız: ${e}`, 'error');
  }, [searchParams]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/v3/auth/patreon/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showToast('✅ Patreon durumu güncellendi.');
        // Re-fetch user
        const me = await fetch('/api/v3/auth/me').then(r => r.json());
        if (me?.user) setUser(me.user);
      } else {
        showToast(data.error || 'Güncelleme başarısız.', 'error');
      }
    } catch {
      showToast('Bağlantı hatası.', 'error');
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) return null;

  const roleInfo   = ROLE_LABELS[user.role] || ROLE_LABELS.user;
  const patronInfo = PATRON_LABELS[user.patronStatus];
  const initials   = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        .pnl-wrap { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
        .pnl-card {
          background: var(--v3-surface); border: 1px solid var(--v3-border);
          border-radius: 20px; padding: 28px 32px; margin-bottom: 16px;
        }
        .pnl-section-title {
          font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: var(--v3-text-muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .pnl-section-title::after { content: ''; flex: 1; height: 1px; background: var(--v3-border); }
        .pnl-badge {
          display: inline-flex; align-items: center; padding: 3px 10px;
          border-radius: 6px; font-size: 12px; font-weight: 600;
          border: 1px solid;
        }
        .pnl-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .pnl-label { font-size: 13px; color: var(--v3-text-muted); }
        .pnl-value { font-size: 14px; font-weight: 500; color: var(--v3-text); }
        .pnl-divider { height: 1px; background: var(--v3-border); margin: 14px 0; }
        .pnl-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; border: none; transition: opacity 0.15s; text-decoration: none;
        }
        .pnl-btn:hover { opacity: 0.85; }
        .pnl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pnl-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .pnl-stat {
          background: var(--v3-surface2); border: 1px solid var(--v3-border);
          border-radius: 12px; padding: 14px; text-align: center;
        }
        .pnl-stat-val { font-size: 22px; font-weight: 800; }
        .pnl-stat-lbl { font-size: 11px; color: var(--v3-text-muted); margin-top: 3px; }
        .toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 500;
          z-index: 9999; animation: toast-in 0.2s ease;
          border: 1px solid;
        }
        .toast.success { background: rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.3); color: #2dd4bf; }
        .toast.error   { background: rgba(239,68,68,0.12);  border-color: rgba(239,68,68,0.3);  color: #f87171; }
        @keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (max-width: 560px) {
          .pnl-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .pnl-card { padding: 20px 20px; }
        }
      `}</style>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="pnl-wrap">

        {/* ── Profil Hero ── */}
        <div className="pnl-card" style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
            background: `linear-gradient(135deg, ${user.avatarColor || '#6366f1'}, ${user.avatarColor || '#8b5cf6'}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: '#fff',
            border: `2px solid ${user.avatarColor || '#6366f1'}40`,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--v3-text)' }}>{user.name}</span>
              <span className="pnl-badge" style={{ background: roleInfo.bg, color: roleInfo.color, borderColor: roleInfo.border }}>
                {roleInfo.label}
              </span>
              {user.isSupporter && (
                <span className="pnl-badge" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.25)' }}>
                  ✦ Destekçi
                </span>
              )}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--v3-text-muted)' }}>{user.email}</div>
          </div>
        </div>

        {/* ── Hesap Bilgileri ── */}
        <div className="pnl-card">
          <div className="pnl-section-title">Hesap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="pnl-row">
              <span className="pnl-label">Kullanıcı adı</span>
              <span className="pnl-value">{user.name}</span>
            </div>
            <div className="pnl-divider" />
            <div className="pnl-row">
              <span className="pnl-label">E-posta</span>
              <span className="pnl-value">{user.email}</span>
            </div>
            <div className="pnl-divider" />
            <div className="pnl-row">
              <span className="pnl-label">Rol</span>
              <span className="pnl-badge" style={{ background: roleInfo.bg, color: roleInfo.color, borderColor: roleInfo.border }}>
                {roleInfo.label}
              </span>
            </div>
            <div className="pnl-divider" />
            <div className="pnl-row">
              <span className="pnl-label">Üyelik tarihi</span>
              <span className="pnl-value">{formatDate(user.createdAt)}</span>
            </div>
            {user.lastLogin && <>
              <div className="pnl-divider" />
              <div className="pnl-row">
                <span className="pnl-label">Son giriş</span>
                <span className="pnl-value">{formatDate(user.lastLogin)}</span>
              </div>
            </>}
          </div>
        </div>

        {/* ── İstatistikler ── */}
        <div className="pnl-card">
          <div className="pnl-section-title">İlerleme (Bu Cihaz)</div>
          <div className="pnl-stat-grid">
            <div className="pnl-stat">
              <div className="pnl-stat-val" style={{ color: '#2dd4bf' }}>{stats.anladi}</div>
              <div className="pnl-stat-lbl">Anladım</div>
            </div>
            <div className="pnl-stat">
              <div className="pnl-stat-val" style={{ color: '#f97316' }}>{stats.tekrar}</div>
              <div className="pnl-stat-lbl">Tekrar Bak</div>
            </div>
            <div className="pnl-stat">
              <div className="pnl-stat-val" style={{ color: '#818cf8' }}>{stats.ziyaret}</div>
              <div className="pnl-stat-lbl">Ziyaret</div>
            </div>
            <div className="pnl-stat">
              <div className="pnl-stat-val" style={{ color: '#fbbf24' }}>{stats.xp}</div>
              <div className="pnl-stat-lbl">XP</div>
            </div>
          </div>
        </div>

        {/* ── Patreon ── */}
        <div className="pnl-card">
          <div className="pnl-section-title">Patreon Destekçi</div>

          {user.patreonLinkedAt ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div className="pnl-row">
                  <span className="pnl-label">Patreon hesabı</span>
                  <span className="pnl-value">{user.patreonName || '—'}</span>
                </div>
                <div className="pnl-divider" />
                <div className="pnl-row">
                  <span className="pnl-label">Durum</span>
                  {patronInfo ? (
                    <span className="pnl-badge" style={{ background: patronInfo.bg, color: patronInfo.color, borderColor: patronInfo.border }}>
                      {patronInfo.label}
                    </span>
                  ) : (
                    <span className="pnl-value" style={{ color: 'var(--v3-text-muted)' }}>Bilinmiyor</span>
                  )}
                </div>
                {user.pledgeCents > 0 && <>
                  <div className="pnl-divider" />
                  <div className="pnl-row">
                    <span className="pnl-label">Aylık destek</span>
                    <span className="pnl-value" style={{ color: '#fbbf24' }}>{fmtCents(user.pledgeCents)}</span>
                  </div>
                </>}
                {user.lifetimeCents > 0 && <>
                  <div className="pnl-divider" />
                  <div className="pnl-row">
                    <span className="pnl-label">Toplam destek</span>
                    <span className="pnl-value">{fmtCents(user.lifetimeCents)}</span>
                  </div>
                </>}
                <div className="pnl-divider" />
                <div className="pnl-row">
                  <span className="pnl-label">Bağlandı</span>
                  <span className="pnl-value">{formatDate(user.patreonLinkedAt)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="pnl-btn" onClick={handleRefresh} disabled={refreshing}
                  style={{ background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)', color: 'var(--v3-text)' }}>
                  {refreshing ? '⏳ Güncelleniyor…' : '↻ Durumu Yenile'}
                </button>
                <a href="/api/v3/auth/patreon" className="pnl-btn"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#fb923c' }}>
                  ↺ Yeniden Bağla
                </a>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '14px', color: 'var(--v3-text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                Patreon hesabını bağlayarak destekçi avantajlarından yararlanabilirsin.
                Reklamsız deneyim, özel içerikler ve öncelikli erişim seni bekliyor.
              </p>
              <a href="/api/v3/auth/patreon" className="pnl-btn"
                style={{ background: 'linear-gradient(135deg, #f96854, #f43f5e)', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="15.5" cy="9.5" r="5.5"/>
                  <rect x="0.5" y="2" width="5" height="20"/>
                </svg>
                Patreon ile Bağla
              </a>
            </>
          )}
        </div>

        {/* ── Hızlı Linkler ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/v3/icerikler" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>← İçerikler</Link>
          <span style={{ color: 'var(--v3-border-bright)' }}>·</span>
          <Link href="/v3/harita" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>Haritam</Link>
          <span style={{ color: 'var(--v3-border-bright)' }}>·</span>
          <Link href="/v3/ogren" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>Öğren</Link>
          {user.role === 'admin' && <>
            <span style={{ color: 'var(--v3-border-bright)' }}>·</span>
            <Link href="/v3/admin" style={{ fontSize: '13px', color: '#fb923c', textDecoration: 'none' }}>⚙ Admin</Link>
          </>}
        </div>

      </div>
    </>
  );
}
