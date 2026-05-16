'use client';

import { useState, useEffect } from 'react';
import { bugunuSorusu, bugunKey } from '../lib/gunun-sorusu';

const kategoriRenk = {
  'SQL':        { bg: 'var(--color-accent-soft)', text: 'var(--color-accent-text)', border: 'var(--color-accent)' },
  'Python':     { bg: 'var(--color-accent-soft)', text: 'var(--color-accent-text)', border: 'var(--color-accent)' },
  'İstatistik': { bg: 'var(--color-purple-bg)',   text: 'var(--color-purple-text)', border: 'var(--color-purple-text)' },
  'ML':         { bg: 'var(--color-amber-bg)',     text: 'var(--color-amber-text)',  border: 'var(--color-amber-text)' },
};

function SaatSayaci() {
  const [kalan, setKalan] = useState('');

  useEffect(() => {
    const hesapla = () => {
      const simdi = new Date();
      const yarin = new Date();
      yarin.setHours(24, 0, 0, 0);
      const fark = yarin - simdi;
      const s = String(Math.floor(fark / 3600000)).padStart(2, '0');
      const d = String(Math.floor((fark % 3600000) / 60000)).padStart(2, '0');
      const sn = String(Math.floor((fark % 60000) / 1000)).padStart(2, '0');
      setKalan(`${s}:${d}:${sn}`);
    };
    hesapla();
    const timer = setInterval(hesapla, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace', fontSize: '0.8rem' }}>
      {kalan}
    </span>
  );
}

export default function GununSorusu() {
  const [soru, setSoru] = useState(null);
  const [secilen, setSecilen] = useState(null);
  const [gosterAciklama, setGosterAciklama] = useState(false);

  useEffect(() => {
    const s = bugunuSorusu();
    setSoru(s);
    const key = bugunKey();
    const kayitli = localStorage.getItem(key);
    if (kayitli !== null) {
      setSecilen(Number(kayitli));
      setGosterAciklama(true);
    }
  }, []);

  const cevapla = (idx) => {
    if (secilen !== null) return;
    setSecilen(idx);
    setGosterAciklama(true);
    localStorage.setItem(bugunKey(), String(idx));
    if (idx === soru.dogru) {
      try {
        const prev = Number(localStorage.getItem('sz_gsq_dogru') || 0);
        localStorage.setItem('sz_gsq_dogru', String(prev + 1));
      } catch {}
    }
  };

  if (!soru) return null;

  const renk = kategoriRenk[soru.kategori] || kategoriRenk['SQL'];
  const cevaplandi = secilen !== null;
  const dogru = cevaplandi && secilen === soru.dogru;

  return (
    <div style={{
      border: '0.5px solid var(--color-border)',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'var(--color-cream-card)',
    }}>
      {/* Başlık şeridi */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '0.5px solid var(--color-border)',
        background: 'var(--color-cream)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>🧠</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
            Bugünün Sorusu
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            padding: '2px 8px', borderRadius: '999px',
            background: renk.bg, color: renk.text,
            border: `0.5px solid ${renk.border}`,
          }}>
            {soru.kategori}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-mute)', fontSize: '12px' }}>
          <span>Yeni soru</span>
          <SaatSayaci />
        </div>
      </div>

      {/* Soru */}
      <div style={{ padding: '20px 20px 16px' }}>
        <p style={{
          fontSize: '15px', lineHeight: '1.6',
          color: 'var(--color-text)', margin: 0, fontWeight: 450,
        }}>
          {soru.soru}
        </p>
      </div>

      {/* Seçenekler */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {soru.secenekler.map((secenek, idx) => {
          let bg = 'var(--color-cream)';
          let borderColor = 'var(--color-border)';
          let textColor = 'var(--color-text-soft)';
          let icon = null;

          if (cevaplandi) {
            if (idx === soru.dogru) {
              bg = 'var(--color-correct-bg)'; borderColor = 'var(--color-correct-border)'; textColor = 'var(--color-correct-text)';
              icon = '✓';
            } else if (idx === secilen) {
              bg = 'var(--color-wrong-bg)'; borderColor = 'var(--color-wrong-border)'; textColor = 'var(--color-wrong-text)';
              icon = '✗';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => cevapla(idx)}
              disabled={cevaplandi}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 14px', borderRadius: '10px',
                border: `0.5px solid ${borderColor}`,
                background: bg, color: textColor,
                fontSize: '13.5px', lineHeight: '1.5', textAlign: 'left',
                cursor: cevaplandi ? 'default' : 'pointer',
                transition: 'all 0.15s',
                width: '100%',
              }}
              onMouseEnter={e => { if (!cevaplandi) e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { if (!cevaplandi) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <span style={{
                flexShrink: 0, width: '20px', height: '20px',
                borderRadius: '50%',
                border: `0.5px solid ${borderColor}`,
                background: icon ? (idx === soru.dogru ? 'var(--color-correct-icon)' : 'var(--color-wrong-icon)') : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: textColor,
                marginTop: '1px',
              }}>
                {icon || String.fromCharCode(65 + idx)}
              </span>
              {secenek}
            </button>
          );
        })}
      </div>

      {/* Açıklama */}
      {gosterAciklama && (
        <div style={{
          margin: '16px 20px 20px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: dogru ? 'var(--color-correct-bg)' : 'var(--color-wrong-bg)',
          border: `0.5px solid ${dogru ? 'var(--color-correct-border)' : 'var(--color-wrong-border)'}`,
        }}>
          <div style={{
            fontSize: '12px', fontWeight: 700, marginBottom: '4px',
            color: dogru ? 'var(--color-correct-text)' : 'var(--color-wrong-text)',
          }}>
            {dogru ? '✓ Doğru!' : `✗ Yanlış — Doğru cevap: ${String.fromCharCode(65 + soru.dogru)}`}
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--color-text-soft)', margin: 0 }}>
            {soru.aciklama}
          </p>
        </div>
      )}
    </div>
  );
}
