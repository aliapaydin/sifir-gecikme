'use client';

import Link from 'next/link';

export default function KayitTamamPage() {
  return (
    <>
      <style>{`
        .v3-auth-page { min-height: calc(100vh - 144px); display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .v3-auth-card { width: 100%; max-width: 460px; background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 20px; padding: 48px 40px; text-align: center; }
      `}</style>
      <div className="v3-auth-page">
        <div className="v3-auth-card">
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>✉️</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--v3-text)', margin: '0 0 12px' }}>
            E-postanı doğrula
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--v3-text-muted)', lineHeight: 1.7, margin: '0 0 28px' }}>
            Hesabını oluşturmak için e-posta adresine bir doğrulama linki gönderdik.
            Lütfen gelen kutunu kontrol et.
          </p>
          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px', padding: '14px 20px',
            fontSize: '13px', color: '#818cf8', lineHeight: 1.6, marginBottom: '28px',
          }}>
            📌 Spam / Junk klasörünü de kontrol etmeyi unutma.
          </div>
          <Link href="/v3/giris" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', borderRadius: '10px',
            background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)',
            color: 'var(--v3-text)', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </>
  );
}
