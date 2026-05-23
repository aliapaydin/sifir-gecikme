'use client';

import { useState } from 'react';

const tipRenk = {
  yeni:        { bg: 'var(--color-correct-bg)',  text: 'var(--color-correct-text)',  label: 'Yeni' },
  düzeltme:    { bg: 'var(--color-amber-bg)',    text: 'var(--color-amber-text)',    label: 'Düzeltme' },
  iyileştirme: { bg: 'var(--color-purple-bg)',   text: 'var(--color-purple-text)',   label: 'İyileştirme' },
};

const versiyonTipRenk = {
  feature: { bg: 'var(--color-accent-soft)',  border: 'var(--color-accent)',      text: 'var(--color-accent)' },
  launch:  { bg: 'var(--color-purple-bg)',    border: 'var(--color-purple-text)', text: 'var(--color-purple-text)' },
};

function OzellikItem({ o }) {
  const tc = tipRenk[o.tip];
  if (!tc) return null;
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span style={{
        padding: '2px 8px', borderRadius: '4px',
        background: tc.bg, color: tc.text,
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
        flexShrink: 0, marginTop: '2px',
      }}>
        {tc.label.toUpperCase()}
      </span>
      <span style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.6 }}>{o.metin}</span>
    </div>
  );
}

function GrupItem({ o }) {
  const [acik, setAcik] = useState(false);
  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      {/* Başlık — tıklanabilir */}
      <button
        onClick={() => setAcik(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px',
          background: acik ? 'var(--color-accent-soft)' : 'var(--color-cream)',
          border: 'none', cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{o.icon}</span>
        <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: acik ? 'var(--color-accent)' : 'var(--color-text)' }}>
          {o.label}
        </span>
        <span style={{
          padding: '1px 8px', borderRadius: '999px',
          background: 'var(--color-cream-card)', border: '1px solid var(--color-border)',
          fontSize: '11px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)',
        }}>
          {o.items.length} değişiklik
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--color-text-mute)', flexShrink: 0,
            transform: acik ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* İçerik */}
      {acik && (
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-cream-card)',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {o.items.map((item, i) => (
            <OzellikItem key={i} o={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function VersiyonIcerik({ versiyonlar, currentVersion }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Başlık */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Versiyon Geçmişi
            </h1>
            <span style={{
              padding: '4px 12px', borderRadius: '999px',
              background: 'var(--color-accent)', color: '#fff',
              fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)',
            }}>
              {currentVersion}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
            Sıfır Gecikme'nin tüm sürüm notları. Her güncellemeyle ne eklendi, ne düzeltildi.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: `${versiyonlar.length} sürüm`, color: 'var(--color-accent)' },
              { label: 'Açık kaynak', color: 'var(--color-text-mute)' },
              { label: 'Türkçe & ücretsiz', color: 'var(--color-text-mute)' },
            ].map(b => (
              <span key={b.label} style={{
                padding: '4px 10px', borderRadius: '6px',
                background: 'var(--color-cream-card)', border: '1px solid var(--color-border)',
                fontSize: '12px', color: b.color, fontWeight: 600,
              }}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {versiyonlar.map((v, idx) => (
            <div key={v.versiyon} style={{ display: 'flex', gap: 0, position: 'relative' }}>
              {/* Sol — çizgi + nokta */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0, paddingTop: '6px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: idx === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                  border: `2px solid ${idx === 0 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  flexShrink: 0, zIndex: 1,
                }} />
                {idx < versiyonlar.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', marginTop: '4px', minHeight: '40px' }} />
                )}
              </div>

              {/* Sağ — içerik */}
              <div style={{ flex: 1, paddingBottom: '40px', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>
                    {v.versiyon}
                  </span>
                  {idx === 0 && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '999px',
                      background: 'var(--color-accent)', color: '#fff',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                    }}>GÜNCEL</span>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{v.tarih}</span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px', marginTop: '2px' }}>
                  {v.baslik}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {v.ozellikler.map((o, i) =>
                    o.tip === 'grup'
                      ? <GrupItem key={i} o={o} />
                      : <OzellikItem key={i} o={o} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alt kısım */}
        <div style={{ marginTop: '8px', padding: '20px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '12px' }}>
            Kaynak kodu GitHub'da açık. Hata bildirimi veya öneri için:
          </p>
          <a
            href="https://github.com/aliapaydin"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', background: 'var(--color-text)', color: 'var(--color-cream)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub'da görüntüle
          </a>
        </div>

      </div>
    </div>
  );
}
