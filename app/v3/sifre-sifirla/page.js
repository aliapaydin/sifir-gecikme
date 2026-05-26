'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SifreSifirlaInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
        <p style={{ fontSize: '15px', color: 'var(--v3-text-muted)', marginBottom: '20px' }}>
          Geçersiz şifre sıfırlama linki.
        </p>
        <Link href="/v3/sifremi-unuttum" style={{
          display: 'inline-block', padding: '11px 24px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
          fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        }}>
          Yeni Link İste
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Şifreler eşleşmiyor.'); return; }
    if (form.password.length < 8) { setError('Şifre en az 8 karakter olmalıdır.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/v3/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Bir hata oluştu.'); return; }
      setDone(true);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--v3-text)', margin: '0 0 10px' }}>
          Şifren güncellendi!
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--v3-text-muted)', marginBottom: '24px' }}>
          Yeni şifrenle giriş yapabilirsin.
        </p>
        <Link href="/v3/giris" style={{
          display: 'inline-block', padding: '12px 28px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
          fontSize: '15px', fontWeight: 600, textDecoration: 'none',
        }}>
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
        ◈ Sıfır Gecikme v3
      </div>
      <p style={{ textAlign: 'center', fontSize: '16px', color: 'var(--v3-text-muted)', margin: '0 0 28px' }}>
        Yeni şifreni belirle
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--v3-text-muted)' }}>Yeni Şifre</label>
          <input type="password" style={{ padding: '11px 14px', borderRadius: '8px', background: 'var(--v3-bg)', border: '1px solid var(--v3-border-bright)', color: 'var(--v3-text)', fontSize: '15px', outline: 'none', width: '100%' }}
            placeholder="En az 8 karakter" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required autoComplete="new-password"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--v3-text-muted)' }}>Şifre Tekrar</label>
          <input type="password" style={{ padding: '11px 14px', borderRadius: '8px', background: 'var(--v3-bg)', border: '1px solid var(--v3-border-bright)', color: 'var(--v3-text)', fontSize: '15px', outline: 'none', width: '100%' }}
            placeholder="Şifreni tekrar gir" value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required autoComplete="new-password"
          />
        </div>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} style={{
          padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          color: '#fff', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer',
          opacity: loading ? 0.6 : 1, marginTop: '4px',
        }}>
          {loading ? 'Kaydediliyor…' : 'Şifremi Güncelle'}
        </button>
      </form>
    </>
  );
}

export default function SifreSifirlaPage() {
  return (
    <>
      <style>{`
        .v3-auth-page { min-height: calc(100vh - 144px); display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .v3-auth-card { width: 100%; max-width: 420px; background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 20px; padding: 40px; }
      `}</style>
      <div className="v3-auth-page">
        <div className="v3-auth-card">
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--v3-text-muted)' }}>Yükleniyor…</div>}>
            <SifreSifirlaInner />
          </Suspense>
        </div>
      </div>
    </>
  );
}
