'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner({ slot, format = 'auto', fullWidth = true }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return;
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      pushed.current = true;
    } catch {}
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ margin: '24px 0', padding: '16px', background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 16px)', border: '1px dashed var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Reklam Alanı</p>
        <p style={{ fontSize: '11px', color: 'var(--color-text-mute)', margin: 0, fontFamily: 'var(--font-mono)' }}>slot: {slot}</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      <p style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Reklam
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
}
