import Link from 'next/link';

export default function SupporterCard() {
  return (
    <div style={{
      margin: '40px 0 8px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(255,66,77,0.06) 0%, rgba(255,66,77,0.02) 100%)',
      border: '0.5px solid rgba(255,66,77,0.2)',
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <span style={{ fontSize: '28px', lineHeight: 1 }}>☕</span>
        <div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px', lineHeight: 1.3 }}>
            Destekleriniz sayesinde büyüyoruz
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: 0, lineHeight: 1.5 }}>
            Bu içerik reklamsız ve ücretsiz — iyi ki varsınız 🙏
          </p>
        </div>
      </div>
      <Link href="/support"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '9px 16px', borderRadius: '9px',
          background: '#FF424D', color: '#fff',
          fontSize: '13px', fontWeight: 700, textDecoration: 'none',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.82 2.41C11.53 2.41 8.85 5.1 8.85 8.39c0 3.28 2.68 5.96 5.97 5.96 3.28 0 5.96-2.68 5.96-5.96 0-3.29-2.68-5.98-5.96-5.98zM2 21.6h3.5V2.41H2V21.6z"/>
        </svg>
        Destek Ol
      </Link>
    </div>
  );
}
