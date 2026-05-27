'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
import YorumlarApp from './YorumlarApp';
import { playClick } from '@/lib/tech-center-sounds';

const WINDOW_MEMORY_KEY = 'tc_window_memory';

const DESKTOP_APPS = [
  { id: 'mail',    emoji: '📧', label: 'Mail',     color: '#3B82F6', bg: '#1d3461' },
  { id: 'pazar',   emoji: '🛒', label: 'Pazar',    color: '#F59E0B', bg: '#3d2c0a' },
  { id: 'stok',    emoji: '📦', label: 'Stok',     color: '#8B5CF6', bg: '#2d1f4a' },
  { id: 'urunler', emoji: '📋', label: 'Ürünler',  color: '#10B981', bg: '#0a3025' },
  { id: 'analiz',  emoji: '📊', label: 'Analiz',   color: '#0EA5E9', bg: '#0a2840' },
  { id: 'yonetim', emoji: '⚙️',  label: 'Yönetim', color: '#94A3B8', bg: '#1a2030' },
  { id: 'pctopla',  emoji: '🖥️',  label: 'PC Topla',  color: '#22C55E', bg: '#0a3018' },
  { id: 'yorumlar', emoji: '⭐',  label: 'Yorumlar',  color: '#F59E0B', bg: '#3d2c0a' },
];

// Default floating sizes — wider apps get more room
const WINDOW_FLOAT_DEFAULTS = {
  mail:    { w: 900, h: 560 },
  pazar:   { w: 900, h: 560 },
  urunler: { w: 900, h: 560 },
  analiz:  { w: 900, h: 560 },
  pctopla: { w: 900, h: 560 },
};
const DEFAULT_FLOAT_SIZE = { w: 460, h: 560 };
const MIN_W = 320;
const MIN_H = 220;

const RESIZE_HANDLES = [
  { dir: 'n',  cursor: 'ns-resize',   style: { top: 0,    left: 8,    right: 8,   height: 5, bottom: 'auto', width: 'auto' } },
  { dir: 's',  cursor: 'ns-resize',   style: { bottom: 0, left: 8,    right: 8,   height: 5, top: 'auto',    width: 'auto' } },
  { dir: 'e',  cursor: 'ew-resize',   style: { right: 0,  top: 8,     bottom: 8,  width: 5,  left: 'auto',   height: 'auto' } },
  { dir: 'w',  cursor: 'ew-resize',   style: { left: 0,   top: 8,     bottom: 8,  width: 5,  right: 'auto',  height: 'auto' } },
  { dir: 'ne', cursor: 'nesw-resize', style: { top: 0,    right: 0,   width: 10,  height: 10, left: 'auto',  bottom: 'auto' } },
  { dir: 'nw', cursor: 'nwse-resize', style: { top: 0,    left: 0,    width: 10,  height: 10, right: 'auto', bottom: 'auto' } },
  { dir: 'se', cursor: 'nwse-resize', style: { bottom: 0, right: 0,   width: 10,  height: 10, left: 'auto',  top: 'auto'    } },
  { dir: 'sw', cursor: 'nesw-resize', style: { bottom: 0, left: 0,    width: 10,  height: 10, right: 'auto', top: 'auto'    } },
];

function DesktopIcon({ app, onClick, badge }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => { playClick(); onClick(); }}
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

function WindowTitleBar({ app, onMinimize, onClose, onFloat, isFloating, isDraggable, onDragStart, isMobile }) {
  return (
    <div
      onMouseDown={isDraggable ? onDragStart : undefined}
      style={{
        height: isMobile ? '44px' : '38px',
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 12px', gap: '8px',
        background: 'rgba(240,238,234,0.97)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0,
        backdropFilter: 'blur(8px)',
        userSelect: 'none',
        cursor: isDraggable ? 'grab' : 'default',
      }}
    >
      {isMobile ? (
        <>
          <span style={{ fontSize: '1.1rem' }}>{app?.emoji}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', flex: 1 }}>{app?.label}</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              background: 'rgba(226,75,74,0.12)', border: '1px solid rgba(226,75,74,0.3)',
              color: '#E24B4A', fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✕ Kapat
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '6px', marginRight: '4px' }}>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              title="Kapat"
              style={{
                width: '13px', height: '13px', borderRadius: '50%',
                background: '#FF5F57', border: '0.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onMinimize}
              title="Küçült"
              style={{
                width: '13px', height: '13px', borderRadius: '50%',
                background: '#FFBD44', border: '0.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onFloat}
              title={isFloating ? 'Tam Ekrana Al' : 'Küçük Pencere'}
              style={{
                width: '13px', height: '13px', borderRadius: '50%',
                background: '#00CA4E', border: '0.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
          </div>
          <span style={{ fontSize: '0.88rem' }}>{app?.emoji}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{app?.label}</span>
        </>
      )}
    </div>
  );
}

function Taskbar({ openWindows, activeWindowId, onFocus, badges }) {
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
      {openWindows.map(win => {
        const app = DESKTOP_APPS.find(a => a.id === win.appId);
        if (!app) return null;
        const isActive = win.id === activeWindowId && !win.minimized;
        const badge = badges[app.id] || 0;
        return (
          <div key={win.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => {
                if (win.minimized || win.id !== activeWindowId) {
                  onFocus(win.id, 'restore');
                } else if (!win.floating) {
                  onFocus(win.id, 'minimize');
                }
              }}
              title={app.label}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                border: isActive ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid transparent',
                background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
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
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
          </div>
        );
      })}

      <button
        onClick={() => router.push('/v3')}
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

function SplashScreen({ app }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px', zIndex: 50,
    }}>
      <style>{`
        @keyframes splashLoad {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
      <div style={{
        width: '72px', height: '72px', borderRadius: '18px',
        background: `linear-gradient(135deg, ${app?.color || '#3B82F6'}44, ${app?.color || '#3B82F6'}22)`,
        border: `1.5px solid ${app?.color || '#3B82F6'}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.2rem',
        boxShadow: `0 8px 32px ${app?.color || '#3B82F6'}44`,
      }}>
        {app?.emoji}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600 }}>
        {app?.label}
      </div>
      <div style={{ width: '160px', height: '4px', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: app?.color || '#3B82F6',
          borderRadius: '999px',
          animation: 'splashLoad 1.8s ease-out forwards',
        }} />
      </div>
    </div>
  );
}

export default function Desktop({ state, firmaValue, ...actions }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [splashApps, setSplashApps] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const desktopRef = useRef(null);
  const dragRef = useRef(null);
  // Remembers last floating position + size + floating state per appId across open/close cycles
  const windowMemoryRef = useRef({});
  // Tracks the next window to focus — set inside the openWindows updater, applied via effect
  const pendingActiveIdRef = useRef(null);
  // Z-index counter for layering windows
  const zCounterRef = useRef(100);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const badges = {
    mail:     (state.customersToday || []).filter(c => !c.dealt).length,
    pctopla:  (state.pendingPCOrders || []).filter(o => !o.fulfilled).length,
    stok:     Object.values(state.inventory || {}).filter(q => q > 0).length,
    pazar:    (state.shoppingList || []).filter(i => !i.ordered).length,
    yorumlar: (state.reviews || []).filter(r => !r.read).length,
  };

  // Load window memory from localStorage on mount and restore previously open windows
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WINDOW_MEMORY_KEY);
      if (raw) {
        windowMemoryRef.current = JSON.parse(raw);
        const mobile = window.innerWidth < 768;
        const toRestore = [];
        Object.entries(windowMemoryRef.current).forEach(([appId, mem], i) => {
          if (mem?.isOpen && DESKTOP_APPS.find(a => a.id === appId)) {
            const defaultSize = WINDOW_FLOAT_DEFAULTS[appId] || DEFAULT_FLOAT_SIZE;
            const z = ++zCounterRef.current;
            toRestore.push({
              id: `win_${appId}_${Date.now() + i}`,
              appId,
              minimized: false,
              floating: mobile ? false : (mem.floating ?? true),
              position: mem.position || { x: 60 + i * 24, y: 50 + i * 24 },
              size: mem.size || defaultSize,
              zIndex: z,
            });
          }
        });
        if (toRestore.length > 0) {
          setOpenWindows(toRestore);
          pendingActiveIdRef.current = toRestore[toRestore.length - 1].id;
        }
      }
    } catch {}
  }, []);

  // Save window memory helper
  const saveWindowMemory = useCallback(() => {
    try {
      localStorage.setItem(WINDOW_MEMORY_KEY, JSON.stringify(windowMemoryRef.current));
    } catch {}
  }, []);

  // Belt-and-suspenders: also restore when entering day_active with no open windows.
  // Handles the case where Desktop stays mounted across phase transitions.
  useEffect(() => {
    if (state.gamePhase === 'day_active') {
      setOpenWindows(prev => {
        if (prev.length > 0) return prev;
        const memory = windowMemoryRef.current;
        const mobile = window.innerWidth < 768;
        const toRestore = [];
        Object.entries(memory).forEach(([appId, mem], i) => {
          if (mem?.isOpen && DESKTOP_APPS.find(a => a.id === appId)) {
            const defaultSize = WINDOW_FLOAT_DEFAULTS[appId] || DEFAULT_FLOAT_SIZE;
            const z = ++zCounterRef.current;
            toRestore.push({
              id: `win_${appId}_${Date.now() + i}`,
              appId,
              minimized: false,
              floating: mobile ? false : (mem.floating ?? true),
              position: mem.position || { x: 60 + i * 24, y: 50 + i * 24 },
              size: mem.size || defaultSize,
              zIndex: z,
            });
          }
        });
        if (toRestore.length > 0) {
          pendingActiveIdRef.current = toRestore[toRestore.length - 1].id;
          return toRestore;
        }
        return prev;
      });
    }
  }, [state.gamePhase]);

  // Apply pending active window focus after openWindows state settles
  useEffect(() => {
    if (pendingActiveIdRef.current !== null) {
      setActiveWindowId(pendingActiveIdRef.current);
      pendingActiveIdRef.current = null;
    }
  }, [openWindows]);

  const focusWindow = useCallback((winId) => {
    const z = ++zCounterRef.current;
    setOpenWindows(prev => prev.map(w => w.id === winId ? { ...w, zIndex: z } : w));
    setActiveWindowId(winId);
  }, []);

  const openApp = useCallback((appId) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        const z = ++zCounterRef.current;
        pendingActiveIdRef.current = existing.id;
        return prev.map(w => w.id === existing.id ? { ...w, minimized: false, zIndex: z } : w);
      }
      const id = `win_${appId}_${Date.now()}`;
      pendingActiveIdRef.current = id;
      const memory = windowMemoryRef.current[appId];
      const floatingCount = prev.filter(w => w.floating && !w.minimized).length;
      const defaultSize = WINDOW_FLOAT_DEFAULTS[appId] || DEFAULT_FLOAT_SIZE;
      const z = ++zCounterRef.current;
      const position = memory?.position || { x: 60 + floatingCount * 24, y: 50 + floatingCount * 24 };
      const size = memory?.size || defaultSize;
      // Mobile: open full-screen (non-floating); desktop: open as floating
      const floating = !isMobile;
      return [...prev, { id, appId, minimized: false, floating, position, size, zIndex: z }];
    });
    // Mark as open in memory so it can be restored after page reload
    windowMemoryRef.current[appId] = {
      ...(windowMemoryRef.current[appId] || {}),
      isOpen: true,
    };
    saveWindowMemory();
    // Trigger splash screen for 1 second
    setSplashApps(prev => new Set([...prev, appId]));
    setTimeout(() => {
      setSplashApps(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }, 1000);
  }, [isMobile, saveWindowMemory]);

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
    setOpenWindows(prev => {
      const win = prev.find(w => w.id === winId);
      if (win) {
        windowMemoryRef.current[win.appId] = {
          ...(windowMemoryRef.current[win.appId] || {}),
          floating: win.floating,
          position: win.position,
          size: win.size,
          isOpen: false,
        };
        saveWindowMemory();
      }
      return prev.filter(w => w.id !== winId);
    });
    setActiveWindowId(prev => prev === winId ? null : prev);
  }, [saveWindowMemory]);

  const floatWindow = useCallback((winId) => {
    setOpenWindows(prev => {
      const floatingCount = prev.filter(w => w.floating && !w.minimized).length;
      return prev.map(w => {
        if (w.id !== winId) return w;
        if (w.floating) {
          // Save last floating state before going full-screen
          if (w.position || w.size) {
            windowMemoryRef.current[w.appId] = { ...(windowMemoryRef.current[w.appId] || {}), floating: false, position: w.position, size: w.size };
          }
          return { ...w, floating: false };
        }
        // Going floating — restore from memory or use defaults
        const memory = windowMemoryRef.current[w.appId];
        const defaultSize = WINDOW_FLOAT_DEFAULTS[w.appId] || DEFAULT_FLOAT_SIZE;
        return {
          ...w,
          floating: true,
          position: memory?.position || { x: 60 + floatingCount * 24, y: 50 + floatingCount * 24 },
          size: memory?.size || defaultSize,
        };
      });
    });
    setActiveWindowId(winId);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current || !desktopRef.current) return;
    const rect = desktopRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (dragRef.current.type === 'drag') {
      const { winId, offsetX, offsetY } = dragRef.current;
      setOpenWindows(prev => prev.map(w =>
        w.id === winId
          ? { ...w, position: { x: Math.max(0, mouseX - offsetX), y: Math.max(0, mouseY - offsetY) } }
          : w
      ));
    } else if (dragRef.current.type === 'resize') {
      const { winId, direction, startMouseX, startMouseY, startW, startH, startX, startY } = dragRef.current;
      const dx = mouseX - startMouseX;
      const dy = mouseY - startMouseY;
      let newW = startW, newH = startH, newX = startX, newY = startY;
      if (direction.includes('e')) newW = Math.max(MIN_W, startW + dx);
      if (direction.includes('s')) newH = Math.max(MIN_H, startH + dy);
      if (direction.includes('w')) {
        newW = Math.max(MIN_W, startW - dx);
        newX = startX + startW - newW;
      }
      if (direction.includes('n')) {
        newH = Math.max(MIN_H, startH - dy);
        newY = startY + startH - newH;
      }
      setOpenWindows(prev => prev.map(w =>
        w.id === winId
          ? { ...w, position: { x: newX, y: newY }, size: { w: newW, h: newH } }
          : w
      ));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      // Save window memory after drag/resize ends
      const winId = dragRef.current.winId;
      setOpenWindows(prev => {
        const win = prev.find(w => w.id === winId);
        if (win && win.floating && (win.position || win.size)) {
          windowMemoryRef.current[win.appId] = {
            ...(windowMemoryRef.current[win.appId] || {}),
            floating: true,
            position: win.position,
            size: win.size,
          };
          saveWindowMemory();
        }
        return prev;
      });
    }
    dragRef.current = null;
  }, [saveWindowMemory]);

  const handleDragStart = useCallback((winId, e, winX, winY) => {
    e.preventDefault();
    if (!desktopRef.current) return;
    const rect = desktopRef.current.getBoundingClientRect();
    dragRef.current = {
      type: 'drag',
      winId,
      offsetX: e.clientX - rect.left - winX,
      offsetY: e.clientY - rect.top - winY,
    };
  }, []);

  function renderAppContent(appId, isMobile) {
    const {
      sellAction, skipAction, handleServiceAction, delayCustomerAction,
      orderProduct, setPriceAction, clearError,
      sellSecondHandAction,
      upgradeStoreAction, hireStaffAction, fireStaffAction, setServicePriceAction, resetGame,
      buildPCAction, sellBuiltPCAction,
      cancelOrderAction, takeLoanAction,
      addToShoppingListAction, removeFromShoppingListAction,
      acceptPCOrderAction, fulfillPCOrderAction, clearLoanError,
      markReviewsReadAction,
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
          acceptPCOrderAction={acceptPCOrderAction}
          isMobile={isMobile}
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
          isMobile={isMobile}
        />
      );
      case 'stok': return (
        <StokTab
          state={state}
          setPriceAction={setPriceAction}
          secondHandInventory={state.secondHandInventory}
          sellSecondHandAction={sellSecondHandAction}
          isMobile={isMobile}
        />
      );
      case 'urunler': return <UrunListesiApp state={state} isMobile={isMobile} />;
      case 'analiz': return <AnalizTab state={state} isMobile={isMobile} />;
      case 'yonetim': return (
        <YonetimTab
          state={state}
          upgradeStoreAction={upgradeStoreAction}
          hireStaffAction={hireStaffAction}
          fireStaffAction={fireStaffAction}
          clearError={clearError}
          clearLoanError={clearLoanError}
          servicePrices={state.servicePrices}
          setServicePriceAction={setServicePriceAction}
          takeLoanAction={takeLoanAction}
          resetGame={resetGame}
          isMobile={isMobile}
        />
      );
      case 'pctopla': return (
        <PCToplaApp
          state={state}
          buildPCAction={actions.buildPCAction}
          sellBuiltPCAction={actions.sellBuiltPCAction}
          fulfillPCOrderAction={fulfillPCOrderAction}
          isMobile={isMobile}
        />
      );
      case 'yorumlar': return <YorumlarApp state={state} markReviewsReadAction={markReviewsReadAction} isMobile={isMobile} />;
      case 'hesapmak': return <Calculator />;
      case 'cizim': return <PaintApp />;
      default: return <div style={{ padding: '2rem', color: 'var(--color-text-mute)' }}>Uygulama bulunamadı</div>;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <style>{`
        .tc-wallpaper { background: linear-gradient(135deg, #0f2044 0%, #1a3a6b 40%, #0d2d5a 70%, #162040 100%); }
        .v3-root.v3-light .tc-wallpaper { background: linear-gradient(135deg, #dde8f5 0%, #c8d8ee 40%, #d0e2f5 70%, #dce8f5 100%); }
        .tc-wallpaper-grid { background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); }
        .v3-root.v3-light .tc-wallpaper-grid { background-image: linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px); }
      `}</style>
      <div
        ref={desktopRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="tc-wallpaper"
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="tc-wallpaper-grid" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundSize: '40px 40px',
        }} />

        {/* Desktop icons — hidden on mobile when a window is open */}
        {(!isMobile || openWindows.filter(w => !w.minimized).length === 0) && (
          <div style={isMobile ? {
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '16px',
          } : {
            padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start',
          }}>
            {isMobile && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Uygulama Seç
              </div>
            )}
            <div style={isMobile ? {
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '100%', maxWidth: '360px',
            } : {
              display: 'flex', flexWrap: 'wrap', gap: '4px',
            }}>
              {DESKTOP_APPS.map(app => (
                <DesktopIcon
                  key={app.id}
                  app={app}
                  onClick={() => openApp(app.id)}
                  badge={badges[app.id] || 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Open windows */}
        {openWindows.map(win => {
          const app = DESKTOP_APPS.find(a => a.id === win.appId);
          const isActive = win.id === activeWindowId && !win.minimized;
          const pos = win.position || { x: 60, y: 50 };
          const size = win.size || (WINDOW_FLOAT_DEFAULTS[win.appId] || DEFAULT_FLOAT_SIZE);
          const winZIndex = win.zIndex || 10;
          const showingSplash = splashApps.has(win.appId);

          if (win.floating && !win.minimized) {
            return (
              <div
                key={win.id}
                onMouseDown={() => focusWindow(win.id)}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: size.w,
                  height: size.h,
                  minWidth: MIN_W,
                  minHeight: MIN_H,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: isActive
                    ? '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)'
                    : '0 8px 32px rgba(0,0,0,0.45)',
                  zIndex: winZIndex,
                }}
              >
                <WindowTitleBar
                  app={app}
                  onMinimize={() => minimizeWindow(win.id)}
                  onClose={() => closeWindow(win.id)}
                  onFloat={() => floatWindow(win.id)}
                  isFloating
                  isDraggable
                  onDragStart={(e) => handleDragStart(win.id, e, pos.x, pos.y)}
                  isMobile={isMobile}
                />
                <div style={{ flex: 1, overflow: 'auto', overflowX: 'hidden', background: 'var(--color-cream)', position: 'relative', minHeight: 0 }}>
                  {showingSplash ? (
                    <SplashScreen app={app} />
                  ) : (
                    renderAppContent(win.appId, isMobile)
                  )}
                </div>
                {/* Resize handles */}
                {RESIZE_HANDLES.map(h => (
                  <div
                    key={h.dir}
                    onMouseDown={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (!desktopRef.current) return;
                      const rect = desktopRef.current.getBoundingClientRect();
                      dragRef.current = {
                        type: 'resize',
                        winId: win.id,
                        direction: h.dir,
                        startMouseX: e.clientX - rect.left,
                        startMouseY: e.clientY - rect.top,
                        startW: size.w,
                        startH: size.h,
                        startX: pos.x,
                        startY: pos.y,
                      };
                    }}
                    style={{
                      position: 'absolute',
                      ...h.style,
                      cursor: h.cursor,
                      zIndex: winZIndex + 5,
                    }}
                  />
                ))}
              </div>
            );
          }

          if (!win.floating) {
            return (
              <div
                key={win.id}
                onMouseDown={() => focusWindow(win.id)}
                style={{
                  position: 'absolute', inset: 0,
                  display: isActive ? 'flex' : 'none',
                  flexDirection: 'column',
                  zIndex: winZIndex,
                }}
              >
                <WindowTitleBar
                  app={app}
                  onMinimize={() => minimizeWindow(win.id)}
                  onClose={() => closeWindow(win.id)}
                  onFloat={() => floatWindow(win.id)}
                  isMobile={isMobile}
                />
                <div style={{ flex: 1, overflow: 'auto', overflowX: 'hidden', background: 'var(--color-cream)', position: 'relative', minHeight: 0 }}>
                  {showingSplash ? (
                    <SplashScreen app={app} />
                  ) : (
                    renderAppContent(win.appId, isMobile)
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onFocus={handleTaskbarAction}
        badges={badges}
      />
    </div>
  );
}
