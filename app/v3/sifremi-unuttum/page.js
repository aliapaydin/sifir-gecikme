'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/v3/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  return (
    <>
      <style>{`
        .v3-auth-page { min-height: calc(100vh - 144px); display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .v3-auth-card { width: 100%; max-width: 420px; background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 20px; padding: 40px; }
        .v3-auth-logo { text-align: center; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg,#6366f1,#8b5cf6,#14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
        .v3-auth-title { text-align: center; font-size: 16px; color: var(--v3-text-muted); margin: 0 0 28px; }
        .v3-field { display: flex; flex-direction: column; gap: 6px; }
        .v3-label { font-size: 13px; font-weight: 500; color: var(--v3-text-muted); }
        .v3-input { padding: 11px 14px; border-radius: 8px; background: var(--v3-bg); border: 1px solid var(--v3-border-bright); color: var(--v3-text); font-size: 15px; outline: none; transition: border-color 0.15s; width: 100%; }
        .v3-input:focus { border-color: rgba(99,102,241,0.5); }
        .v3-error { padding: 10px 14px; border-radius: 8px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; font-size: 13px; }
        .v3-auth-submit { padding: 13px; border-radius: 10px; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.15s; width: 100%; margin-top: 8px; }
        .v3-auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .v3-auth-footer { text-align: center; font-size: 14px; color: var(--v3-text-muted); margin-top: 20px; }
        .v3-auth-footer a { color: #818cf8; font-weight: 500; }
      `}</style>
      <div className="v3-auth-page">
        <div className="v3-auth-card">
          <div className="v3-auth-logo">◈ Sıfır Gecikme v3</div>

          {done ? (
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✉️</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--v3-text)', margin: '0 0 10px' }}>
                E-posta gönderildi
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--v3-text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
                Eğer bu e-posta bir hesaba kayıtlıysa, şifre sıfırlama linki gönderildi.
                Spam klasörünü de kontrol et.
              </p>
              <Link href="/giris" style={{
                display: 'inline-block', padding: '11px 28px', borderRadius: '10px',
                background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)',
                color: 'var(--v3-text)', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              }}>
                Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <>
              <p className="v3-auth-title">Şifreni sıfırla</p>
              <p style={{ fontSize: '13px', color: 'var(--v3-text-muted)', marginBottom: '20px', lineHeight: 1.6, textAlign: 'center' }}>
                E-posta adresini gir, şifre sıfırlama linkini gönderelim.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="v3-field">
                  <label className="v3-label" htmlFor="email">E-posta</label>
                  <input
                    id="email" type="email" className="v3-input"
                    placeholder="ornek@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="email"
                  />
                </div>
                {error && <div className="v3-error">{error}</div>}
                <button type="submit" className="v3-auth-submit" disabled={loading}>
                  {loading ? 'Gönderiliyor…' : 'Sıfırlama Linki Gönder'}
                </button>
              </form>
              <div className="v3-auth-footer">
                <Link href="/giris">← Giriş sayfasına dön</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
