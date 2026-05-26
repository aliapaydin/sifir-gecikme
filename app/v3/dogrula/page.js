'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ERROR_MESSAGES = {
  missing_token: 'Doğrulama linki eksik.',
  invalid_token: 'Doğrulama linki geçersiz veya süresi dolmuş.',
  server:        'Sunucu hatası oluştu. Lütfen tekrar dene.',
};

function DogrulaInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (error) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>❌</div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--v3-text)', margin: '0 0 12px' }}>
          Doğrulama başarısız
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--v3-text-muted)', margin: '0 0 28px', lineHeight: 1.6 }}>
          {ERROR_MESSAGES[error] || 'Bilinmeyen bir hata oluştu.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/v3/giris" style={{
            padding: '11px 22px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
            fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            Giriş Yap
          </Link>
          <Link href="/v3/kayit" style={{
            padding: '11px 22px', borderRadius: '10px',
            background: 'var(--v3-surface2)', border: '1px solid var(--v3-border)',
            color: 'var(--v3-text)', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            Yeni Hesap Oluştur
          </Link>
        </div>
      </div>
    );
  }

  // No error, no redirect yet — loading state (verify API redirects automatically)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>⏳</div>
      <p style={{ fontSize: '15px', color: 'var(--v3-text-muted)' }}>Doğrulanıyor…</p>
    </div>
  );
}

export default function DogrulaPage() {
  return (
    <>
      <style>{`
        .v3-auth-page { min-height: calc(100vh - 144px); display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .v3-auth-card { width: 100%; max-width: 440px; background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 20px; padding: 48px 40px; }
      `}</style>
      <div className="v3-auth-page">
        <div className="v3-auth-card">
          <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--v3-text-muted)' }}>Yükleniyor…</div>}>
            <DogrulaInner />
          </Suspense>
        </div>
      </div>
    </>
  );
}
