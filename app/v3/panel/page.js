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
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwOpen, setPwOpen] = useState(false);


  // localStorage stats
  const [stats, setStats] = useState({ anladi: 0, tekrar: 0, xp: 0, ziyaret: 0 });

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.user) { router.push('/v3/giris?from=/v3/panel'); return; }
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

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError('');
    if (pwForm.next !== pwForm.confirm) { setPwError('Yeni şifreler eşleşmiyor.'); return; }
    if (pwForm.next.length < 8) { setPwError('Yeni şifre en az 8 karakter olmalıdır.'); return; }
    setPwLoading(true);
    try {
      const res = await fetch('/api/v3/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error || 'Bir hata oluştu.'); return; }
      showToast('✅ Şifren başarıyla güncellendi.');
      setPwForm({ current: '', next: '', confirm: '' });
      setPwOpen(false);
    } catch {
      setPwError('Bağlantı hatası.');
    } finally {
      setPwLoading(false);
    }
  }

  useEffect(() => {
    const p = searchParams.get('patreon');
    const e = searchParams.get('error');
    const v = searchParams.get('verified');
    if (p === 'linked') showToast('✅ Patreon başarıyla bağlandı!', 'success');
    if (e) showToast(`Patreon bağlantısı başarısız: ${e}`, 'error');
    if (v === '1') showToast('✅ E-posta adresin doğrulandı, hoş geldin!', 'success');
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

        {/* ── Banner: destekçiyse teşekkür, değilse destek ol ── */}
        {user.isSupporter ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '22px 28px', borderRadius: '20px', marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.06))',
            border: '1px solid rgba(251,191,36,0.3)',
          }}>
            <div style={{ fontSize: '44px', flexShrink: 0, lineHeight: 1 }}>✨</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24', marginBottom: '5px' }}>
                Desteğinle büyüyoruz!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--v3-text-muted)', lineHeight: 1.6 }}>
                Sıfır Gecikme'yi desteklediğin için çok teşekkürler. Reklamsız, ücretsiz ve
                Türkçe kalabilmesi senin gibi destekçiler sayesinde mümkün. İyi ki varsın 🙏
              </div>
            </div>
            <div style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: '8px',
              background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
              color: '#fbbf24', fontSize: '12px', fontWeight: 700,
            }}>
              ✦ Destekçi
            </div>
          </div>
        ) : (
          <Link href="/v3/destek" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              padding: '22px 28px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(244,63,94,0.07))',
              border: '1px solid rgba(249,115,22,0.25)',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '44px', flexShrink: 0, lineHeight: 1 }}>☕</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fb923c', marginBottom: '5px' }}>
                  Sıfır Gecikme'yi Destekle
                </div>
                <div style={{ fontSize: '13px', color: 'var(--v3-text-muted)', lineHeight: 1.55 }}>
                  Reklamsız deneyim, özel içerikler, AI Tutor önceliği ve daha fazlası.
                  Aylık küçük bir destekle platformun büyümesine katkı sağla.
                </div>
              </div>
              <div style={{
                flexShrink: 0, padding: '9px 18px', borderRadius: '10px',
                background: 'linear-gradient(135deg,#f96854,#f43f5e)',
                color: '#fff', fontSize: '13px', fontWeight: 700,
              }}>
                Destek Ol →
              </div>
            </div>
          </Link>
        )}

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

        {/* ── Şifre Değiştir ── */}
        <div className="pnl-card">
          <button
            onClick={() => { setPwOpen(v => !v); setPwError(''); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <span className="pnl-section-title" style={{ margin: 0, flex: 1 }}>Şifre Değiştir</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--v3-text-faint)', flexShrink: 0, marginLeft: '8px', transform: pwOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {pwOpen && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
              {[
                { key: 'current', label: 'Mevcut Şifre', placeholder: 'Mevcut şifren' },
                { key: 'next',    label: 'Yeni Şifre',    placeholder: 'En az 8 karakter' },
                { key: 'confirm', label: 'Yeni Şifre Tekrar', placeholder: 'Yeni şifreni tekrar gir' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--v3-text-muted)' }}>{label}</label>
                  <input
                    type="password" placeholder={placeholder}
                    value={pwForm[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    required autoComplete="new-password"
                    style={{
                      padding: '10px 12px', borderRadius: '8px', background: 'var(--v3-bg)',
                      border: '1px solid var(--v3-border-bright)', color: 'var(--v3-text)',
                      fontSize: '14px', outline: 'none', width: '100%',
                    }}
                  />
                </div>
              ))}
              {pwError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>
                  {pwError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="pnl-btn" disabled={pwLoading}
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
                  {pwLoading ? 'Kaydediliyor…' : '🔒 Şifremi Güncelle'}
                </button>
                <button type="button" className="pnl-btn" onClick={() => { setPwOpen(false); setPwError(''); setPwForm({ current: '', next: '', confirm: '' }); }}
                  style={{ background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)', color: 'var(--v3-text-muted)' }}>
                  İptal
                </button>
              </div>
            </form>
          )}
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

        {/* ── Admin Paneli Butonu ── */}
        {user.role === 'admin' && (
          <Link href="/v3/admin" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              padding: '22px 28px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
              border: '1px solid rgba(99,102,241,0.3)',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}>⚙</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#818cf8', marginBottom: '4px' }}>
                  Admin Paneli
                </div>
                <div style={{ fontSize: '13px', color: 'var(--v3-text-muted)', lineHeight: 1.5 }}>
                  Kullanıcılar, analitik, site ayarları ve içerik yönetimi.
                </div>
              </div>
              <div style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: '10px',
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8', fontSize: '13px', fontWeight: 700,
              }}>
                Yönet →
              </div>
            </div>
          </Link>
        )}

        {/* ── Hızlı Linkler ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/v3/icerikler" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>← İçerikler</Link>
          <span style={{ color: 'var(--v3-border-bright)' }}>·</span>
          <Link href="/v3/harita" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>Haritam</Link>
          <span style={{ color: 'var(--v3-border-bright)' }}>·</span>
          <Link href="/v3/ogren" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none' }}>Öğren</Link>
        </div>

      </div>
    </>
  );
}
