'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const DISMISS_KEY = 'sg_banner_dismissed';

// Giriş yapılmamışsa en üstte ince hatırlatma şeridi.
// Kapatılınca o oturum boyunca gizli kalır; giriş yapınca hiç görünmez.
export default function GirisBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {}

    fetch('/api/v3/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (cancelled) return;
        if (!data?.user) setShow(true); // sadece giriş yoksa göster
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  function dismiss() {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      padding: '8px 16px', fontSize: '13px', lineHeight: 1.4,
      background: 'linear-gradient(135deg, rgba(var(--v3-accent-rgb),0.16), rgba(20,184,166,0.12))',
      borderBottom: '1px solid var(--v3-border-bright)',
      color: 'var(--v3-text)', position: 'relative', flexWrap: 'wrap', textAlign: 'center',
    }}>
      <span>
        💾 <strong>Giriş yap</strong> — ilerlemen ve istatistiklerin saklansın, her cihazdan kaldığın yerden devam et.
      </span>
      <Link href="/giris" style={{
        flexShrink: 0, padding: '4px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 700,
        background: 'var(--v3-accent)', color: 'var(--v3-on-accent)', textDecoration: 'none',
      }}>
        Giriş Yap
      </Link>
      <button onClick={dismiss} aria-label="Kapat" style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px',
        color: 'var(--v3-text-muted)', lineHeight: 1, padding: '4px',
      }}>
        ✕
      </button>
    </div>
  );
}
