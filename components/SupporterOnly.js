import { getSession } from '@/lib/session';
import Link from 'next/link';

export default async function SupporterOnly({ children, title = 'Bu içerik destekçilere özel' }) {
  const session = await getSession();

  if (session?.is_supporter) return children;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '14px',
      border: '0.5px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.4 }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(var(--color-cream-rgb, 252,248,240), 0.85)',
        backdropFilter: 'blur(2px)',
        padding: '24px',
        textAlign: 'center',
        gap: '12px',
      }}>
        <span style={{ fontSize: '28px' }}>🔒</span>
        <div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 6px' }}>
            {title}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: 0, lineHeight: 1.5 }}>
            Bu içeriğe erişmek için Patreon destekçisi olman gerekiyor.
          </p>
        </div>
        <Link href="/support"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '9px', background: '#FF424D', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.82 2.41C11.53 2.41 8.85 5.1 8.85 8.39c0 3.28 2.68 5.96 5.97 5.96 3.28 0 5.96-2.68 5.96-5.96 0-3.29-2.68-5.98-5.96-5.98zM2 21.6h3.5V2.41H2V21.6z"/>
          </svg>
          Destekçi Ol
        </Link>
      </div>
    </div>
  );
}
