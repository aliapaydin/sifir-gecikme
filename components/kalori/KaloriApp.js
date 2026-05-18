'use client';

import { useState, useEffect } from 'react';
import { useKaloriState } from '../../lib/kalori-state';
import KaloriDashboard from './KaloriDashboard';
import KaloriYemekEkle from './KaloriYemekEkle';
import KaloriEgzersizEkle from './KaloriEgzersizEkle';
import KaloriAnaliz from './KaloriAnaliz';
import KaloriProfil from './KaloriProfil';

const TABS = [
  { id: 'dashboard',  label: 'Ana Sayfa',  emoji: '🏠' },
  { id: 'yemek',      label: 'Yemek Ekle', emoji: '🍽️' },
  { id: 'egzersiz',   label: 'Egzersiz',   emoji: '🏃' },
  { id: 'analiz',     label: 'Analiz',     emoji: '📈' },
  { id: 'profil',     label: 'Profil',     emoji: '👤' },
];

export default function KaloriApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const state = useKaloriState();

  useEffect(() => {
    try { localStorage.setItem('sz_kalori_ziyaret', '1'); } catch {}
  }, []);

  if (!state.hydrated) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-mute)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥗</div>
          <p style={{ fontSize: '0.875rem' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 0 6rem' }}>

      {/* Page header */}
      <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🥗</span>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Kalori Takip</h1>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: 0 }}>
          AI destekli kişisel beslenme ve kilo takibi
        </p>
      </div>

      {/* Tab content */}
      <div style={{ padding: '0 0.5rem' }}>
        {activeTab === 'dashboard'  && <KaloriDashboard state={state} onNavigate={setActiveTab} />}
        {activeTab === 'yemek'      && <KaloriYemekEkle state={state} onNavigate={setActiveTab} />}
        {activeTab === 'egzersiz'   && <KaloriEgzersizEkle state={state} />}
        {activeTab === 'analiz'     && <KaloriAnaliz state={state} />}
        {activeTab === 'profil'     && <KaloriProfil state={state} />}
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--color-cream-card)',
        borderTop: '0.5px solid var(--color-border)',
        display: 'flex',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '2px', padding: '0.5rem 0.25rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? 'var(--color-accent)' : 'var(--color-text-mute)',
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: tab.id === 'yemek' ? '1.25rem' : '1.1rem', lineHeight: 1 }}>{tab.emoji}</span>
              <span style={{
                fontSize: '0.6rem', fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
              }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
