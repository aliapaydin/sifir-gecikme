'use client';

import { useState } from 'react';
import { CITIES, LOGOS } from '@/lib/tech-center-data';

export default function SetupScreen({ onStart }) {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [logoId, setLogoId] = useState('chip');

  const cityList = Object.values(CITIES);
  const selectedLogo = LOGOS.find(l => l.id === logoId) || LOGOS[0];

  const canNext1 = !!city;
  const canNext2 = companyName.trim().length >= 2;

  const handleStart = () => {
    if (!city || !companyName.trim()) return;
    onStart({ city, companyName: companyName.trim(), logoId });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Başlık */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖥️</div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          fontFamily: 'var(--font-serif)',
          color: 'var(--color-text)',
          margin: 0,
        }}>Tech Center</h1>
        <p style={{ color: 'var(--color-text-mute)', marginTop: '0.5rem', fontSize: '1rem' }}>
          Kendi bilgisayar mağazanı kur, ₺1.000.000.000'a ulaş!
        </p>
      </div>

      {/* Step indicator */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        alignItems: 'center',
      }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: s <= step ? 'var(--color-accent)' : 'var(--color-border)',
              color: s <= step ? '#fff' : 'var(--color-text-mute)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}>{s}</div>
            {s < 3 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: s < step ? 'var(--color-accent)' : 'var(--color-border)',
                borderRadius: '999px',
                transition: 'all 0.2s',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Kart */}
      <div style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Step 1: Şehir */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              📍 Şehir Seç
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cityList.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCity(c.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `2px solid ${city === c.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: city === c.id ? 'var(--color-accent-soft)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>{c.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>{c.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', marginTop: '2px', display: 'flex', gap: '1rem' }}>
                      <span>🏠 Kira: ₺{c.rent.toLocaleString('tr-TR')}/ay</span>
                      <span>👥 Trafik: ×{c.trafficMult}</span>
                    </div>
                  </div>
                  {city === c.id && (
                    <span style={{ color: 'var(--color-accent)', fontSize: '1.2rem' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => canNext1 && setStep(2)}
              disabled={!canNext1}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.875rem',
                borderRadius: '12px',
                border: 'none',
                background: canNext1 ? 'var(--color-accent)' : 'var(--color-border)',
                color: canNext1 ? '#fff' : 'var(--color-text-mute)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: canNext1 ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Devam →
            </button>
          </div>
        )}

        {/* Step 2: Firma adı & Logo */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              🏷️ Firma Adı & Logo
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Firma Adı
              </label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Firma adını gir..."
                maxLength={30}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-cream)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Logo Seç
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {LOGOS.map(logo => (
                  <button
                    key={logo.id}
                    onClick={() => setLogoId(logo.id)}
                    title={logo.label}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: `2px solid ${logoId === logo.id ? logo.bg : 'var(--color-border)'}`,
                      background: logoId === logo.id ? logo.bg + '22' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: logo.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      {logo.emoji}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{logo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-mute)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                ← Geri
              </button>
              <button
                onClick={() => canNext2 && setStep(3)}
                disabled={!canNext2}
                style={{
                  flex: 2,
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: canNext2 ? 'var(--color-accent)' : 'var(--color-border)',
                  color: canNext2 ? '#fff' : 'var(--color-text-mute)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: canNext2 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                Devam →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Özet & Başla */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem', textAlign: 'center' }}>
              🚀 Hazır mısın?
            </h2>

            {/* Preview */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: 'var(--color-cream)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                background: selectedLogo.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}>
                {selectedLogo.emoji}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                  {companyName}
                </div>
                <div style={{ color: 'var(--color-text-mute)', fontSize: '0.9rem', marginTop: '2px' }}>
                  {cityList.find(c => c.id === city)?.emoji} {cityList.find(c => c.id === city)?.label}
                </div>
              </div>
            </div>

            {/* Özet tablo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                { label:'Başlangıç Sermayesi', value:'₺50.000' },
                { label:'Aylık Kira', value:`₺${cityList.find(c=>c.id===city)?.rent.toLocaleString('tr-TR')}` },
                { label:'Hedef Firma Değeri', value:'₺1.000.000.000' },
                { label:'Mağaza Seviyesi', value:'Seviye 1 – Küçük Dükkan 🏪' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0',
                  borderBottom: '0.5px solid var(--color-border)',
                }}>
                  <span style={{ color: 'var(--color-text-mute)' }}>{row.label}</span>
                  <span style={{ color: 'var(--color-text)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-mute)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                ← Geri
              </button>
              <button
                onClick={handleStart}
                style={{
                  flex: 2,
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                🏪 Mağazayı Aç!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
