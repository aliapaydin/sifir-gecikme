'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdSquare() {
  const pushed = useRef(false);
  const [isSupporter, setIsSupporter] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setIsSupporter(d?.is_supporter ?? false)).catch(() => setIsSupporter(false));
  }, []);

  useEffect(() => {
    if (isSupporter !== false) return;
    if (pushed.current) return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, [isSupporter]);

  if (isSupporter === null || isSupporter === true) return null;

  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ width: '300px', height: '250px', flexShrink: 0, border: '1px dashed var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.02) 8px, rgba(0,0,0,0.02) 16px)' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reklam Alanı</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>300 × 250</span>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <div style={{ flexShrink: 0 }}>
      <p style={{ fontSize: '9px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px', textAlign: 'center' }}>Reklam</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT}
        data-ad-format="rectangle"
        data-full-width-responsive="false"
      />
    </div>
  );
}
