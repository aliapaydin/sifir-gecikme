'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdStickyBanner() {
  const pushed = useRef(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (pushed.current || closed) return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return;
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      pushed.current = true;
    } catch {}
  }, [closed]);

  if (closed || !process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'var(--color-cream)', borderTop: '1px dashed var(--color-border)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sticky Reklam Alanı</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>slot: {process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY}</span>
        <button onClick={() => setClosed(true)} style={{ marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', cursor: 'pointer', fontSize: '12px', color: 'var(--color-text-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: 'var(--color-cream)',
      borderTop: '0.5px solid var(--color-border)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      padding: '4px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      maxHeight: '70px', overflow: 'hidden',
    }}>
      <span style={{ fontSize: '9px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
        Reklam
      </span>
      <div style={{ flex: 1, maxWidth: '728px', height: '50px', overflow: 'hidden' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', height: '50px' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
      <button
        onClick={() => setClosed(true)}
        aria-label="Reklamı kapat"
        style={{
          flexShrink: 0, width: '24px', height: '24px',
          borderRadius: '6px', border: '0.5px solid var(--color-border)',
          background: 'var(--color-cream-card)', cursor: 'pointer',
          fontSize: '12px', color: 'var(--color-text-mute)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        ✕
      </button>
    </div>
  );
}
