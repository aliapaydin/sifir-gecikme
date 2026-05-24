import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Destekçi Paneli — Sıfır Gecikme',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCents(cents) {
  if (!cents) return '—';
  const usd = cents / 100;
  return `$${usd % 1 === 0 ? usd : usd.toFixed(2)}`;
}

const STATUS_LABELS = {
  active_patron: { label: 'Aktif Destekçi', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  declined_patron: { label: 'Ödeme Başarısız', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  former_patron: { label: 'Eski Destekçi', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

const AVANTAJLAR = [
  { emoji: '🚫', label: 'Reklamsız Deneyim' },
  { emoji: '🔒', label: 'Özel İçerikler' },
  { emoji: '📬', label: 'Öncelikli Erişim' },
  { emoji: '💬', label: 'Doğrudan İletişim' },
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/support');

  const status = STATUS_LABELS[session.patron_status] || {
    label: 'Bağlantılı', color: 'var(--color-text-mute)', bg: 'var(--color-cream-card)',
  };

  const chargeOk = session.last_charge_status === 'Paid';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)', padding: '48px 16px 96px' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>

        <Link href="/" style={{ fontSize: '12px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '28px' }}>
          ← Ana sayfa
        </Link>

        {/* Profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          {session.image_url ? (
            <img src={session.image_url} alt={session.name} width={56} height={56}
              style={{ borderRadius: '50%', border: '2px solid var(--color-border)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-cream-card)', border: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              👤
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              Merhaba, {session.name?.split(' ')[0]} 👋
            </h1>
            <span style={{ fontSize: '12px', color: status.color, background: status.bg, padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Abonelik Kartı */}
        <div style={{ borderRadius: '14px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
            Abonelik Detayları
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>Aylık Destek</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                {formatCents(session.pledge_cents)}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-mute)' }}>/ay</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>Toplam Katkı</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                {formatCents(session.lifetime_cents)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>Başlangıç Tarihi</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{formatDate(session.pledge_start)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>Son Ödeme</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>
                <span style={{ color: chargeOk ? '#22c55e' : '#f59e0b' }}>
                  {chargeOk ? '✓' : '⚠'} {session.last_charge_status || '—'}
                </span>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '1px' }}>{formatDate(session.last_charge_date)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Avantajlar */}
        <div style={{ borderRadius: '14px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
            Aktif Avantajlar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {AVANTAJLAR.map(a => (
              <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{a.emoji}</span>
                <span style={{ fontSize: '14px', color: session.is_supporter ? 'var(--color-text)' : 'var(--color-text-mute)', textDecoration: session.is_supporter ? 'none' : 'line-through' }}>
                  {a.label}
                </span>
                {session.is_supporter && (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>Aktif</span>
                )}
              </div>
            ))}
          </div>
          {!session.is_supporter && (
            <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '14px', padding: '10px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: '8px' }}>
              Avantajlarını etkinleştirmek için Patreon aboneliğini kontrol et.
            </p>
          )}
        </div>

        {/* Patreon'a git */}
        <style>{`.patreon-btn:hover { opacity: 0.88; } .logout-btn:hover { border-color: var(--color-text-mute) !important; color: var(--color-text) !important; }`}</style>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="https://www.patreon.com/sifirgecikme" target="_blank" rel="noopener noreferrer"
            className="patreon-btn"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '10px', background: '#FF424D', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.82 2.41C11.53 2.41 8.85 5.1 8.85 8.39c0 3.28 2.68 5.96 5.97 5.96 3.28 0 5.96-2.68 5.96-5.96 0-3.29-2.68-5.98-5.96-5.98zM2 21.6h3.5V2.41H2V21.6z"/>
            </svg>
            Patreon'da Yönet
          </a>
          <a href="/api/auth/logout"
            className="logout-btn"
            style={{ padding: '13px 18px', borderRadius: '10px', border: '0.5px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-mute)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}>
            Çıkış
          </a>
        </div>

      </div>
    </main>
  );
}
