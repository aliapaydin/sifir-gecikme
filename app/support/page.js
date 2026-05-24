import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Destek Ol — Sıfır Gecikme',
  description: 'Sıfır Gecikme\'yi destekle, reklamsız deneyim ve özel içeriklere kavuş.',
};

const PATREON_URL = 'https://patreon.com/sifirgecikme';

const AVANTAJLAR = [
  {
    emoji: '🚫',
    label: 'Reklamsız Deneyim',
    detay: 'Hiçbir banner, pop-up veya izleme kodu olmadan öğren.',
  },
  {
    emoji: '🔒',
    label: 'Özel İçerikler',
    detay: 'Destekçilere özel yazılar, notebook\'lar ve vaka analizleri.',
  },
  {
    emoji: '📬',
    label: 'Öncelikli Erişim',
    detay: 'Yeni içerikler ve araçlara herkesten önce ulaş.',
  },
  {
    emoji: '💬',
    label: 'Doğrudan İletişim',
    detay: 'Soru ve önerilerini doğrudan iletebilirsin.',
  },
];

const MASRAFLAR = [
  { emoji: '🌐', label: 'Domain', detay: 'Yıllık alan adı ücreti' },
  { emoji: '☁️', label: 'Hosting', detay: 'Vercel Pro plan' },
  { emoji: '🤖', label: 'AI API', detay: 'Gemini API kullanım ücreti' },
];

export default async function SupportPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  if (session) redirect('/support/dashboard');

  const error = params?.error;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)', padding: '48px 16px 96px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <Link href="/" style={{ fontSize: '12px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '28px' }}>
          ← Ana sayfa
        </Link>

        {error && (
          <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444' }}>
            Giriş sırasında bir hata oluştu. Tekrar deneyin.
          </div>
        )}

        {/* Başlık */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 12px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Destek ol ☕
          </h1>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            Sıfır Gecikme reklamsız, ücretsiz ve tamamen açık bir proje. Veri bilimi öğrenmek isteyen herkese Türkçe içerik üretmeye devam edebilmek için desteğin çok değerli.
          </p>
        </div>

        {/* Destekçi Avantajları */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Destekçi avantajları
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AVANTAJLAR.map(a => (
              <div key={a.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 16px', borderRadius: '10px',
                background: 'var(--color-cream-card)',
                border: '0.5px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1.4, flexShrink: 0 }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>{a.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>{a.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patreon CTA */}
        <style>{`.patreon-btn:hover { opacity: 0.88; } .login-btn:hover { border-color: var(--color-accent) !important; color: var(--color-accent) !important; }`}</style>
        <a href={PATREON_URL} target="_blank" rel="noopener noreferrer" className="patreon-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '12px', background: '#FF424D', color: '#fff', fontSize: '17px', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s', boxSizing: 'border-box' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.82 2.41C11.53 2.41 8.85 5.1 8.85 8.39c0 3.28 2.68 5.96 5.97 5.96 3.28 0 5.96-2.68 5.96-5.96 0-3.29-2.68-5.98-5.96-5.98zM2 21.6h3.5V2.41H2V21.6z"/>
          </svg>
          Patreon'da Destekle
        </a>

        <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', textAlign: 'center', marginTop: '12px', marginBottom: '20px', lineHeight: 1.6 }}>
          Patreon üzerinden aylık veya tek seferlik destek olabilirsin.
        </p>

        {/* Zaten destekçiyim */}
        <div style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', border: '0.5px dashed var(--color-border)' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '0 0 10px' }}>
            Zaten Patreon destekçisi misin?
          </p>
          <a href="/api/auth/patreon" className="login-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '9px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', color: 'var(--color-text)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF424D' }}>
              <path d="M14.82 2.41C11.53 2.41 8.85 5.1 8.85 8.39c0 3.28 2.68 5.96 5.97 5.96 3.28 0 5.96-2.68 5.96-5.96 0-3.29-2.68-5.98-5.96-5.98zM2 21.6h3.5V2.41H2V21.6z"/>
            </svg>
            Patreon ile Giriş Yap
          </a>
        </div>

        {/* Masraflar */}
        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '0.5px solid var(--color-border)' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Bağışlar neye gidiyor?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MASRAFLAR.map(m => (
              <div key={m.label} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', borderRadius: '10px',
                background: 'var(--color-cream-card)',
                border: '0.5px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '22px' }}>{m.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{m.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
