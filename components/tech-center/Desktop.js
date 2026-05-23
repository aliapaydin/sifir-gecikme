'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MailApp from './MailApp';
import PazarTab from './PazarTab';
import StokTab from './StokTab';
import AnalizTab from './AnalizTab';
import YonetimTab from './YonetimTab';
import UrunListesiApp from './UrunListesiApp';
import Calculator from './Calculator';
import PaintApp from './PaintApp';
import PCToplaApp from './PCToplaApp';

const DESKTOP_APPS = [
  { id: 'mail',     emoji: '📧', label: 'Mail',     color: '#3B82F6', bg: '#1d3461' },
  { id: 'pazar',    emoji: '🛒', label: 'Pazar',    color: '#F59E0B', bg: '#3d2c0a' },
  { id: 'stok',     emoji: '📦', label: 'Stok',     color: '#8B5CF6', bg: '#2d1f4a' },
  { id: 'urunler',  emoji: '📋', label: 'Ürünler',  color: '#10B981', bg: '#0a3025' },
  { id: 'analiz',   emoji: '📊', label: 'Analiz',   color: '#0EA5E9', bg: '#0a2840' },
  { id: 'yonetim',  emoji: '⚙️',  label: 'Yönetim', color: '#94A3B8', bg: '#1a2030' },
  { id: 'pctopla',  emoji: '🖥️',  label: 'PC Topla',  color: '#22C55E', bg: '#0a3018' },
  { id: 'hesapmak', emoji: '🧮', label: 'Hesap M.', color: '#EC4899', bg: '#3d0a2a' },
  { id: 'cizim',    emoji: '🎨', label: 'Çizim',    color: '#EF4444', bg: '#3d0a0a' },
];

function DesktopIcon({ app, onClick, badge }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '6px', cursor: 'pointer', padding: '10px 8px',
        borderRadius: '12px',
        background: hover ? 'rgba(255,255,255,0.12)' : 'transparent',
        transition: 'all 0.15s',
        width: '82px', userSelect: 'none', position: 'relative',
      }}
    >
      <div style={{
        width: '54px', height: '54px', borderRadius: '14px',
        background: `linear-gradient(135deg, ${app.color}44, ${app.color}22)`,
        border: `1.5px solid ${app.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.7rem',
        boxShadow: hover ? `0 6px 20px ${app.color}44` : `0 2px 8px rgba(0,0,0,0.3)`,
        transform: hover ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
        transition: 'all 0.15s',
      }}>
        {app.emoji}
      </div>
      <span style={{
        fontSize: '0.68rem', color: 'rgba(255,255,255,0.9)', textAlign: 'center',
        lineHeight: 1.2, fontWeight: 500,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        {app.label}
      </span>
      {badge > 0 && (
        <div style={{
          position: 'absolute', top: '7px', right: '7px',
          minWidth: '16px', height: '16px', borderRadius: '8px',
          background: '#E24B4A', color: '#fff',
          fontSize: '0.6rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid rgba(255,255,255,0.3)',
          padding: '0 3px',
        }}>
          {badge > 9 ? '9+' : badge}
        </div>
      )}
    </div>
  );
}

function WindowTitleBar({ app, onMinimize, onClose }) {
  return (
    <div style={{
      height: '38px', display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: '8px',
      background: 'rgba(240,238,234,0.97)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      flexShrink: 0,
      backdropFilter: 'blur(8px)',
      userSelect: 'none',
    }}>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: '6px', marginRight: '4px' }}>
        <button
          onClick={onClose}
          title="Kapat"
          style={{
            width: '13px', height: '13px', borderRadius: '50%',
            background: '#FF5F57', border: '0.5px solid rgba(0,0,0,0.15)',
            cursor: 'pointer', flexShrink: 0,
          }}
        />
        <button
          onClick={onMinimize}
          title="Küçült"
          style={{
            width: '13px', height: '13px', borderRadius: '50%',
            background: '#FFBD44', border: '0.5px solid rgba(0,0,0,0.15)',
            cursor: 'pointer', flexShrink: 0,
          }}
        />
        <button
          title="Ekranı Doldur"
          style={{
            width: '13px', height: '13px', borderRadius: '50%',
            background: '#00CA4E', border: '0.5px solid rgba(0,0,0,0.15)',
            cursor: 'default', flexShrink: 0,
          }}
        />
      </div>
      <span style={{ fontSize: '0.88rem' }}>{app?.emoji}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{app?.label}</span>
    </div>
  );
}

function Taskbar({ openWindows, activeWindowId, onFocus, onOpen, mailBadge }) {
  const router = useRouter();

  return (
    <div style={{
      height: '52px',
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      padding: '0 12px',
      flexShrink: 0,
      position: 'relative',
    }}>
      {DESKTOP_APPS.map(app => {
        const win = openWindows.find(w => w.appId === app.id);
        const isOpen = !!win;
        const isActive = win && win.id === activeWindowId && !win.minimized;
        const badge = app.id === 'mail' ? mailBadge : 0;
        return (
          <div key={app.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => {
                if (isActive) {
                  if (win) onFocus(win.id, 'minimize');
                } else if (win) {
                  onFocus(win.id, 'restore');
                } else {
                  onOpen(app.id);
                }
              }}
              title={app.label}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                border: isActive ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid transparent',
                background: isActive
                  ? `rgba(255,255,255,0.18)`
                  : isOpen ? `rgba(255,255,255,0.08)` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 0 0 1px rgba(255,255,255,0.15)' : 'none',
                position: 'relative',
              }}
            >
              {app.emoji}
              {badge > 0 && (
                <div style={{
                  position: 'absolute', top: '-3px', right: '-3px',
                  width: '14px', height: '14px', borderRadius: '7px',
                  background: '#E24B4A', color: '#fff',
                  fontSize: '0.55rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {badge > 9 ? '9+' : badge}
                </div>
              )}
            </button>
            {isOpen && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            )}
          </div>
        );
      })}

      {/* Sol: Kapat butonu */}
      <button
        onClick={() => router.push('/')}
        title="Ana Sayfaya Dön"
        style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '7px 14px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,75,74,0.25)'; e.currentTarget.style.borderColor = 'rgba(226,75,74,0.5)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
        Kapat
      </button>
    </div>
  );
}

export default function Desktop({ state, firmaValue, ...actions }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  const mailBadge = (state.customersToday || []).filter(c => !c.dealt).length;

  const openApp = useCallback((appId) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        setActiveWindowId(existing.id);
        return prev.map(w => w.id === existing.id ? { ...w, minimized: false } : w);
      }
      const id = `win_${appId}_${Date.now()}`;
      setActiveWindowId(id);
      return [...prev, { id, appId, minimized: false }];
    });
  }, []);

  const handleTaskbarAction = useCallback((winId, action) => {
    if (action === 'minimize') {
      setOpenWindows(prev => prev.map(w => w.id === winId ? { ...w, minimized: true } : w));
      setActiveWindowId(prev => prev === winId ? null : prev);
    } else if (action === 'restore') {
      setOpenWindows(prev => prev.map(w => w.id === winId ? { ...w, minimized: false } : w));
      setActiveWindowId(winId);
    }
  }, []);

  const minimizeWindow = useCallback((winId) => {
    setOpenWindows(prev => prev.map(w => w.id === winId ? { ...w, minimized: true } : w));
    setActiveWindowId(prev => prev === winId ? null : prev);
  }, []);

  const closeWindow = useCallback((winId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== winId));
    setActiveWindowId(prev => prev === winId ? null : prev);
  }, []);

  const activeWindow = openWindows.find(w => w.id === activeWindowId && !w.minimized) || null;

  function renderAppContent(appId) {
    const {
      sellAction, skipAction, handleServiceAction, delayCustomerAction,
      orderProduct, setPriceAction, clearError,
      sellSecondHandAction,
      upgradeStoreAction, hireStaffAction, fireStaffAction, setServicePriceAction, resetGame,
      buildPCAction, sellBuiltPCAction,
      cancelOrderAction, takeLoanAction,
      addToShoppingListAction, removeFromShoppingListAction,
    } = actions;

    switch (appId) {
      case 'mail': return (
        <MailApp
          state={state}
          sellAction={sellAction}
          skipAction={skipAction}
          handleServiceAction={handleServiceAction}
          delayCustomerAction={delayCustomerAction}
          servicePrices={state.servicePrices}
          addToShoppingListAction={addToShoppingListAction}
        />
      );
      case 'pazar': return (
        <PazarTab
          state={state}
          orderProduct={orderProduct}
          setPriceAction={setPriceAction}
          clearError={clearError}
          cancelOrderAction={cancelOrderAction}
          removeFromShoppingListAction={removeFromShoppingListAction}
        />
      );
      case 'stok': return (
        <StokTab
          state={state}
          setPriceAction={setPriceAction}
          secondHandInventory={state.secondHandInventory}
          sellSecondHandAction={sellSecondHandAction}
        />
      );
      case 'urunler': return <UrunListesiApp state={state} />;
      case 'analiz': return <AnalizTab state={state} />;
      case 'yonetim': return (
        <YonetimTab
          state={state}
          upgradeStoreAction={upgradeStoreAction}
          hireStaffAction={hireStaffAction}
          fireStaffAction={fireStaffAction}
          clearError={clearError}
          servicePrices={state.servicePrices}
          setServicePriceAction={setServicePriceAction}
          takeLoanAction={takeLoanAction}
          resetGame={resetGame}
        />
      );
      case 'pctopla': return (
        <PCToplaApp
          state={state}
          buildPCAction={actions.buildPCAction}
          sellBuiltPCAction={actions.sellBuiltPCAction}
        />
      );
      case 'hesapmak': return <Calculator />;
      case 'cizim': return <PaintApp />;
      default: return <div style={{ padding: '2rem', color: 'var(--color-text-mute)' }}>Uygulama bulunamadı</div>;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Desktop wallpaper + content area */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6b 40%, #0d2d5a 70%, #162040 100%)',
      }}>
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Desktop icons (shown when no active window) */}
        {!activeWindow && (
          <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}>
            {DESKTOP_APPS.map(app => (
              <DesktopIcon
                key={app.id}
                app={app}
                onClick={() => openApp(app.id)}
                badge={app.id === 'mail' ? mailBadge : 0}
              />
            ))}
          </div>
        )}

        {/* Open windows - only render the active one fully, keep others mounted but hidden */}
        {openWindows.map(win => {
          const app = DESKTOP_APPS.find(a => a.id === win.appId);
          const isActive = win.id === activeWindowId && !win.minimized;
          return (
            <div
              key={win.id}
              style={{
                position: 'absolute', inset: 0,
                display: isActive ? 'flex' : 'none',
                flexDirection: 'column',
              }}
            >
              <WindowTitleBar
                app={app}
                onMinimize={() => minimizeWindow(win.id)}
                onClose={() => closeWindow(win.id)}
              />
              <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-cream)' }}>
                {renderAppContent(win.appId)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onFocus={handleTaskbarAction}
        onOpen={openApp}
        mailBadge={mailBadge}
      />
    </div>
  );
}
