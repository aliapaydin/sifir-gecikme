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
  const [isDesktop, setIsDesktop] = useState(false);
  const state = useKaloriState();

  useEffect(() => {
    try { localStorage.setItem('sz_kalori_ziyaret', '1'); } catch {}
  }, []);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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

  // Bugünün kalori özeti (sidebar için)
  const today = new Date().toISOString().split('T')[0];
  const todayKal = (state.foods || [])
    .filter(f => f.date === today)
    .reduce((s, f) => s + (f.calories || 0), 0);
  const hedef = state.profile?.targetCalories || 2000;
  const yuzde = Math.min(100, Math.round((todayKal / hedef) * 100));
  const CIRC = 2 * Math.PI * 20;
  const aktifTab = TABS.find(t => t.id === activeTab);

  const Icerik = () => (
    <>
      {activeTab === 'dashboard' && <KaloriDashboard state={state} onNavigate={setActiveTab} />}
      {activeTab === 'yemek'     && <KaloriYemekEkle state={state} onNavigate={setActiveTab} />}
      {activeTab === 'egzersiz'  && <KaloriEgzersizEkle state={state} />}
      {activeTab === 'analiz'    && <KaloriAnaliz state={state} />}
      {activeTab === 'profil'    && <KaloriProfil state={state} />}
    </>
  );

  // ─── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 56px)',
        maxWidth: '1140px',
        margin: '0 auto',
      }}>

        {/* Sidebar */}
        <aside style={{
          width: '240px',
          flexShrink: 0,
          borderRight: '0.5px solid var(--color-border)',
          padding: '28px 14px 24px',
          position: 'sticky',
          top: '56px',
          height: 'calc(100vh - 56px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>

          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '20px', paddingBottom: '18px',
            borderBottom: '0.5px solid var(--color-border)',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--color-accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}>🥗</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
                Kalori Takip
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>AI destekli</div>
            </div>
          </div>

          {/* Bugün özeti */}
          <div style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--color-cream)',
            border: '0.5px solid var(--color-border)',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '10px', fontWeight: 500 }}>
              Bugün
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none"
                  stroke="var(--color-border)" strokeWidth="4.5" />
                <circle cx="25" cy="25" r="20" fill="none"
                  stroke={yuzde >= 100 ? '#EF4444' : 'var(--color-accent)'}
                  strokeWidth="4.5"
                  strokeDasharray={`${(yuzde / 100) * CIRC} ${CIRC}`}
                  strokeDashoffset={CIRC * 0.25}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <text x="25" y="30" textAnchor="middle"
                  fill={yuzde >= 100 ? '#EF4444' : 'var(--color-text)'}
                  style={{ fontSize: '11px', fontWeight: 700 }}>
                  {yuzde}%
                </text>
              </svg>
              <div>
                <div style={{
                  fontSize: '20px', fontWeight: 800,
                  color: yuzde >= 100 ? '#EF4444' : 'var(--color-text)',
                  fontFamily: 'var(--font-mono)', lineHeight: 1,
                }}>
                  {todayKal.toLocaleString('tr-TR')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                  / {hedef.toLocaleString('tr-TR')} kal
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginTop: '2px' }}>
                  {hedef - todayKal > 0
                    ? `${(hedef - todayKal).toLocaleString('tr-TR')} kal kaldı`
                    : `${(todayKal - hedef).toLocaleString('tr-TR')} kal aşıldı`}
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: active ? 'var(--color-accent-soft)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    color: active ? 'var(--color-accent)' : 'var(--color-text-soft)',
                    fontWeight: active ? 600 : 400,
                    fontSize: '14px',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center', lineHeight: 1 }}>
                    {tab.emoji}
                  </span>
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {active && (
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: 'var(--color-accent)', flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Alt link */}
          <div style={{ paddingTop: '16px', borderTop: '0.5px solid var(--color-border)' }}>
            <a href="/" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: 'var(--color-text-mute)',
              textDecoration: 'none',
            }}>
              ← Ana sayfaya dön
            </a>
          </div>
        </aside>

        {/* İçerik alanı */}
        <main style={{ flex: 1, padding: '28px 40px 56px', minWidth: 0 }}>
          {/* Sayfa başlığı */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px', paddingBottom: '16px',
            borderBottom: '0.5px solid var(--color-border)',
          }}>
            <span style={{ fontSize: '1.4rem' }}>{aktifTab?.emoji}</span>
            <h1 style={{
              fontSize: '1.4rem', fontWeight: 700,
              color: 'var(--color-text)', margin: 0,
            }}>
              {aktifTab?.label}
            </h1>
          </div>

          <div style={{ maxWidth: '640px' }}>
            <Icerik />
          </div>
        </main>
      </div>
    );
  }

  // ─── MOBİL ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 0 6rem' }}>
      <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🥗</span>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Kalori Takip
          </h1>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: 0 }}>
          AI destekli kişisel beslenme ve kilo takibi
        </p>
      </div>

      <div style={{ padding: '0 0.5rem' }}>
        <Icerik />
      </div>

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
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '2px', padding: '0.5rem 0.25rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? 'var(--color-accent)' : 'var(--color-text-mute)',
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: tab.id === 'yemek' ? '1.25rem' : '1.1rem', lineHeight: 1 }}>
                {tab.emoji}
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
