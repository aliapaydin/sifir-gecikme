'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Yazı sayfaları için ince banner (Anladım butonlarının altında)
export default function V3SupportBanner() {
  const [supporter, setSupporter] = useState(null); // null = yükleniyor

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setSupporter(d?.user?.isSupporter ?? false))
      .catch(() => setSupporter(false));
  }, []);

  if (supporter === null || supporter === true) return null;

  return (
    <>
      <style>{`
        .v3-sbanner {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 20px; border-radius: 14px; margin-top: 20px;
          background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(244,63,94,0.06));
          border: 1px solid rgba(249,115,22,0.2);
          text-decoration: none; transition: border-color 0.15s, background 0.15s;
        }
        .v3-sbanner:hover { border-color: rgba(249,115,22,0.4); background: linear-gradient(135deg, rgba(249,115,22,0.12), rgba(244,63,94,0.09)); }
        .v3-sbanner-emoji { font-size: 24px; flex-shrink: 0; }
        .v3-sbanner-text { flex: 1; }
        .v3-sbanner-title { font-size: 13px; font-weight: 700; color: #fb923c; margin-bottom: 2px; }
        .v3-sbanner-desc { font-size: 12px; color: var(--v3-text-muted); line-height: 1.5; }
        .v3-sbanner-cta {
          flex-shrink: 0; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
          background: linear-gradient(135deg,#f96854,#f43f5e); color: #fff; white-space: nowrap;
        }
        @media (max-width: 480px) { .v3-sbanner-cta { display: none; } }
      `}</style>
      <Link href="/destek" className="v3-sbanner">
        <span className="v3-sbanner-emoji">☕</span>
        <div className="v3-sbanner-text">
          <div className="v3-sbanner-title">Sıfır Gecikme'yi destekle</div>
          <div className="v3-sbanner-desc">Reklamsız deneyim, özel içerikler ve AI Tutor önceliği — aylık küçük bir destekle.</div>
        </div>
        <span className="v3-sbanner-cta">Destek Ol →</span>
      </Link>
    </>
  );
}
