'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/v3/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Kayıt olunamadı.');
      } else {
        router.push('/v3');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .v3-auth-page {
          min-height: calc(100vh - 144px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .v3-auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--v3-surface);
          border: 1px solid var(--v3-border);
          border-radius: 20px;
          padding: 40px;
        }
        .v3-auth-logo {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .v3-auth-title {
          text-align: center;
          font-size: 16px;
          color: var(--v3-text-muted);
          margin: 0 0 32px;
        }
        .v3-auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .v3-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .v3-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--v3-text-muted);
        }
        .v3-input {
          padding: 11px 14px;
          border-radius: 8px;
          background: var(--v3-bg);
          border: 1px solid var(--v3-border-bright);
          color: var(--v3-text);
          font-size: 15px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .v3-input:focus {
          border-color: rgba(99,102,241,0.5);
        }
        .v3-input::placeholder {
          color: var(--v3-text-faint);
        }
        .v3-error {
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          font-size: 13px;
        }
        .v3-auth-submit {
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s;
          margin-top: 4px;
        }
        .v3-auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .v3-auth-footer {
          text-align: center;
          font-size: 14px;
          color: var(--v3-text-muted);
          margin-top: 20px;
        }
        .v3-auth-footer a {
          color: #818cf8;
          font-weight: 500;
        }
        .v3-auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
      <div className="v3-auth-page">
        <div className="v3-auth-card">
          <div className="v3-auth-logo">◈ Sıfır Gecikme v3</div>
          <p className="v3-auth-title">Ücretsiz hesap oluştur</p>

          <form className="v3-auth-form" onSubmit={handleSubmit}>
            <div className="v3-field">
              <label className="v3-label" htmlFor="name">İsim</label>
              <input
                id="name"
                name="name"
                type="text"
                className="v3-input"
                placeholder="Adın Soyadın"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="v3-field">
              <label className="v3-label" htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                className="v3-input"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="v3-field">
              <label className="v3-label" htmlFor="password">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                className="v3-input"
                placeholder="En az 8 karakter"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            {error && <div className="v3-error">{error}</div>}

            <button type="submit" className="v3-auth-submit" disabled={loading}>
              {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="v3-auth-footer">
            Zaten hesabın var mı?{' '}
            <Link href="/v3/giris">Giriş yap</Link>
          </div>
        </div>
      </div>
    </>
  );
}
