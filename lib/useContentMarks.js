'use client';

import { useState, useEffect, useCallback } from 'react';

// { [href]: 'anladi' | 'tekrar' }
function readLocalMarks() {
  try {
    const durumlar = JSON.parse(localStorage.getItem('sz_durum') || '{}');
    const anladi   = JSON.parse(localStorage.getItem('sz_anladi') || '[]');
    const tekrar   = JSON.parse(localStorage.getItem('sz_tekrar') || '[]');
    const merged   = { ...durumlar };
    for (const h of anladi) if (!merged[h]) merged[h] = 'anladi';
    for (const h of tekrar)  if (!merged[h]) merged[h] = 'tekrar';
    return merged;
  } catch {
    return {};
  }
}

function writeLocalMarks(marks) {
  try {
    localStorage.setItem('sz_durum', JSON.stringify(marks));
    localStorage.setItem('sz_anladi', JSON.stringify(
      Object.entries(marks).filter(([,v]) => v === 'anladi').map(([k]) => k)
    ));
    localStorage.setItem('sz_tekrar', JSON.stringify(
      Object.entries(marks).filter(([,v]) => v === 'tekrar').map(([k]) => k)
    ));
  } catch {}
}

export function useContentMarks() {
  const [marks, setMarks] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    async function init() {
      const localMarks = readLocalMarks();
      setMarks(localMarks);

      try {
        const res = await fetch('/api/v3/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setIsLoggedIn(true);
            const dbRes = await fetch('/api/v3/marks');
            if (dbRes.ok) {
              const { marks: dbMarks } = await dbRes.json();
              // DB + local merge (DB daha yetkili, ama local'de varsa ekle)
              const merged = { ...localMarks, ...dbMarks };
              setMarks(merged);
              writeLocalMarks(merged);

              // localStorage'da olup DB'de olmayan varsa DB'ye gönder
              const localOnly = Object.entries(localMarks).filter(([k]) => !dbMarks[k]);
              if (localOnly.length > 0) {
                const toSync = Object.fromEntries(localOnly);
                fetch('/api/v3/marks', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ marks: toSync }),
                }).catch(() => {});
              }
            }
          }
        }
      } catch {}
      setSynced(true);
    }
    init();
  }, []);

  const setMark = useCallback(async (href, mark) => {
    setMarks(prev => {
      const next = { ...prev };
      if (mark) next[href] = mark; else delete next[href];
      writeLocalMarks(next);
      return next;
    });

    if (isLoggedIn) {
      try {
        await fetch('/api/v3/marks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ href, mark: mark || null }),
        });
      } catch {}
    }
  }, [isLoggedIn]);

  return { marks, setMark, synced };
}
