'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dersler } from '../../../lib/dersler';

export default function OgrenCard() {
  const [ilerleme, setIlerleme] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sz_ilerleme_v1');
      setIlerleme(raw ? JSON.parse(raw) : {});
    } catch {
      setIlerleme({});
    }
  }, []);

  if (!ilerleme) return null;

  const tamamlananlar = ilerleme.tamamlananDersler || {};
  const tamamlananSayi = Object.keys(tamamlananlar).length;
  const toplamXP = ilerleme.toplamXP || 0;
  const toplamDers = dersler.length;
  const yuzde = Math.round((tamamlananSayi / toplamDers) * 100);
  const devamEden = ilerleme.devamEdenDers;
  const devamDers = devamEden ? dersler.find(d => d.id === devamEden.dersId) : null;
  const sonrakiDers = dersler.find(d => !tamamlananlar[d.id]);
  const hedefDers = devamDers || sonrakiDers || dersler[0];

  return (
    <div style={{
      borderRadius: '20px', border: '1px solid rgba(20,184,166,0.25)',
      background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(99,102,241,0.06) 100%)',
      padding: '28px 32px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: '220px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>📚</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--v3-text)' }}>İnteraktif Öğrenme</div>
            <div style={{ fontSize: '12px', color: 'var(--v3-text-muted)' }}>Adım adım veri bilimi dersleri</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#2dd4bf' }}>{tamamlananSayi}</div>
            <div style={{ fontSize: '11px', color: 'var(--v3-text-muted)' }}>/ {toplamDers} ders</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#818cf8' }}>{toplamXP}</div>
            <div style={{ fontSize: '11px', color: 'var(--v3-text-muted)' }}>XP kazanıldı</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--v3-text)' }}>{yuzde}%</div>
            <div style={{ fontSize: '11px', color: 'var(--v3-text-muted)' }}>tamamlandı</div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '6px', marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${yuzde}%`, borderRadius: '8px',
            background: 'linear-gradient(90deg, #14b8a6, #6366f1)',
            transition: 'width 0.6s ease',
          }} />
        </div>

        <Link href="/ogren" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          background: 'linear-gradient(135deg, #14b8a6, #6366f1)', color: '#fff',
          textDecoration: 'none', transition: 'opacity 0.15s',
        }}>
          {tamamlananSayi === 0 ? 'Öğrenmeye Başla →' : devamEden ? 'Devam Et →' : 'İlerle →'}
        </Link>
      </div>

      {hedefDers && (
        <div style={{
          flexShrink: 0, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)', padding: '16px 20px', minWidth: '160px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--v3-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {devamEden ? 'Devam Eden' : 'Sıradaki Ders'}
          </div>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>{hedefDers.emoji}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--v3-text)', marginBottom: '4px' }}>{hedefDers.baslik}</div>
          <div style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#2dd4bf', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}>
            +{hedefDers.xp} XP
          </div>
        </div>
      )}
    </div>
  );
}
