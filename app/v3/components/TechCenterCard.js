'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function fmtMoney(n) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₺${(n / 1_000).toFixed(0)}K`;
  return `₺${n}`;
}

export default function TechCenterCard() {
  const [save, setSave] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tc_game_v2');
      if (raw) setSave(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const hasSave = loaded && save && save.currentDay > 1;

  return (
    <>
      <style>{`
        .tc-card {
          position: relative; overflow: hidden; border-radius: 24px; padding: 40px;
          border: 1px solid rgba(139,92,246,0.3);
          background: linear-gradient(135deg, rgba(17,7,40,0.95) 0%, rgba(13,20,65,0.95) 50%, rgba(7,30,50,0.95) 100%);
        }
        .v3-light .tc-card {
          background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 50%, #dbeafe 100%);
          border-color: rgba(139,92,246,0.25);
        }
        .tc-grid-overlay {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image: linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .v3-light .tc-grid-overlay {
          background-image: linear-gradient(rgba(0,0,0,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.07) 1px, transparent 1px);
          opacity: 1;
        }
        .tc-title {
          font-size: clamp(26px, 4vw, 38px); font-weight: 900; margin: 0 0 12px;
          letter-spacing: -0.8px; line-height: 1.1;
          background: linear-gradient(135deg, #f1f5f9 0%, #c7d2fe 60%, #a5b4fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .v3-light .tc-title {
          background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #6366f1 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .tc-desc { font-size: 15px; color: rgba(203,213,225,0.8); margin: 0 0 24px; line-height: 1.6; max-width: 440px; }
        .v3-light .tc-desc { color: rgba(30,27,75,0.7); }
        .tc-stat-chip {
          padding: 8px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
        }
        .v3-light .tc-stat-chip { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.18); }
        .tc-stat-label { font-size: 10px; color: rgba(203,213,225,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .v3-light .tc-stat-label { color: rgba(30,27,75,0.45); }
      `}</style>
      <div className="tc-card">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.12) 0%, transparent 50%)',
        }} />
        <div className="tc-grid-overlay" />

        <div style={{ position: 'relative', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 12px', borderRadius: '20px', marginBottom: '18px',
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              fontSize: '11px', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.8px', textTransform: 'uppercase',
            }}>
              🕹️ Simülasyon Oyunu
            </div>

            <h2 className="tc-title">Tech Center</h2>

            <p className="tc-desc">
              Kendi bilgisayar mağazanı kur, personel işe al, pazar stratejisi belirle ve şirket değerini <strong style={{ color: '#a78bfa' }}>₺1 milyara</strong> ulaştır.
            </p>

            {hasSave && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Gün', val: save.currentDay, color: '#a78bfa' },
                  { label: 'Kasa', val: fmtMoney(save.cash), color: '#34d399' },
                  { label: 'Şirket', val: save.companyName, color: '#93c5fd' },
                ].map(item => (
                  <div key={item.label} className="tc-stat-chip">
                    <div className="tc-stat-label">{item.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: item.color }}>{item.val}</div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/tech-center"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '15px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
            >
              {hasSave ? '▶ Devam Et' : '▶ Oyna'}
            </Link>
          </div>

          <div style={{
            fontSize: '96px', lineHeight: 1, userSelect: 'none', opacity: 0.85,
            filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.4))',
            flexShrink: 0,
          }}>
            🏪
          </div>
        </div>
      </div>
    </>
  );
}
