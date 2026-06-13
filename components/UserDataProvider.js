'use client';

import { useEffect, useRef } from 'react';
import {
  isSyncedKey, snapshotLocal, applySnapshot, mergeSnapshot,
  isEmptySnapshot, SYNC_READY_EVENT,
} from '../lib/userSync';

// Giriş yapılmışsa localStorage'taki tüm site istatistiklerini Neon ile senkronlar.
//
// KRİTİK DÜZELTME: Hydrasyon artık kör overwrite değil — mergeSnapshot ile
// ders ilerlemesi, sayaçlar ve diziler akıllıca birleştiriliyor.
// beforeunload da bekleyen push'u zorla gönderiyor.
export default function UserDataProvider({ children }) {
  const loggedInRef  = useRef(false);
  const pushTimerRef = useRef(null);
  const pushNowRef   = useRef(null); // beforeunload için

  useEffect(() => {
    let cancelled = false;

    // ── Write-through: localStorage.setItem'ı sarmala ──
    const origSetItem = localStorage.setItem.bind(localStorage);

    function schedulePush() {
      if (!loggedInRef.current) return;
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      // 400ms: sayfa geçişi öncesi yakalamak için 1000ms'den kısa
      pushTimerRef.current = setTimeout(pushNow, 400);
    }

    localStorage.setItem = function (key, value) {
      origSetItem(key, value);
      if (isSyncedKey(key)) schedulePush();
    };

    async function pushNow() {
      if (!loggedInRef.current) return;
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current);
        pushTimerRef.current = null;
      }
      try {
        await fetch('/api/v3/userdata', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: snapshotLocal() }),
        });
      } catch { /* sessizce geç */ }
    }

    // ref aracılığıyla beforeunload'dan erişebilmek için
    pushNowRef.current = pushNow;

    // ── beforeunload: sayfa kapatılmadan/değişmeden önce zorla gönder ──
    function onBeforeUnload() {
      if (!loggedInRef.current) return;
      // sendBeacon: unload sonrası bile tamamlanır
      const payload = JSON.stringify({ data: snapshotLocal() });
      navigator.sendBeacon?.('/api/v3/userdata', new Blob([payload], { type: 'application/json' }));
    }
    window.addEventListener('beforeunload', onBeforeUnload);

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
        return;
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
          // Akıllı merge: yerel daha güncel/zenginse koru, sunucu daha fazlasına sahipse al
          const local = snapshotLocal();
          const merged = mergeSnapshot(serverData, local);

          // Merge sonucunu hem localStorage'a hem sunucuya yaz
          applySnapshot(merged);

          // Sunucuda eksik olan yerel verileri push et
          const hasLocalExtras = Object.entries(local).some(([k, v]) => !serverData[k] || serverData[k] !== merged[k]);
          if (hasLocalExtras) await pushNow();

          window.dispatchEvent(new Event(SYNC_READY_EVENT));
        }
      } catch { /* sessizce geç */ }
    }

    hydrate();

    return () => {
      cancelled = true;
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      window.removeEventListener('beforeunload', onBeforeUnload);
      localStorage.setItem = origSetItem;
    };
  }, []);

  return children;
}
