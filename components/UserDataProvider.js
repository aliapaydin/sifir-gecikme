'use client';

import { useEffect, useRef } from 'react';
import {
  isSyncedKey, snapshotLocal, applySnapshot, isEmptySnapshot, SYNC_READY_EVENT,
} from '../lib/userSync';

// Giriş yapılmışsa localStorage'taki tüm site istatistiklerini Neon ile senkronlar:
//  - mount'ta sunucudan çeker (veya ilk girişte cihaz verisini sunucuya yükler)
//  - sonraki her senkron-anahtar yazımını debounce ile sunucuya gönderir (write-through)
export default function UserDataProvider({ children }) {
  const loggedInRef = useRef(false);
  const pushTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    // ── Write-through: localStorage.setItem'ı sarmala ──
    const origSetItem = localStorage.setItem.bind(localStorage);
    function schedulePush() {
      if (!loggedInRef.current) return;
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(pushNow, 1000);
    }
    localStorage.setItem = function (key, value) {
      origSetItem(key, value);
      if (isSyncedKey(key)) schedulePush();
    };

    async function pushNow() {
      if (!loggedInRef.current) return;
      try {
        await fetch('/api/v3/userdata', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: snapshotLocal() }),
        });
      } catch { /* sessizce geç; bir sonraki yazımda tekrar denenir */ }
    }

    // ── Hidrasyon ──
    async function hydrate() {
      let user = null;
      try {
        const me = await fetch('/api/v3/auth/me').then(r => (r.ok ? r.json() : null));
        user = me?.user || null;
      } catch { user = null; }
      if (cancelled) return;

      if (!user) {
        loggedInRef.current = false;
        return; // anonim: yalnızca lokal, senkron yok
      }
      loggedInRef.current = true;

      try {
        const res = await fetch('/api/v3/userdata').then(r => (r.ok ? r.json() : null));
        if (cancelled) return;
        const serverData = res?.data;

        if (isEmptySnapshot(serverData)) {
          // İlk giriş: sunucu boş → cihazdaki mevcut veriyi yukarı taşı
          const local = snapshotLocal();
          if (!isEmptySnapshot(local)) await pushNow();
        } else {
          // Sunucu esas: lokale uygula ve okuyan bileşenleri tazele
          applySnapshot(serverData);
          window.dispatchEvent(new Event(SYNC_READY_EVENT));
        }
      } catch { /* sessizce geç */ }
    }

    hydrate();

    return () => {
      cancelled = true;
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      localStorage.setItem = origSetItem;
    };
  }, []);

  return children;
}
