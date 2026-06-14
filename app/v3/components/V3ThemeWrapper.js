'use client';

import { useEffect } from 'react';

function applyTheme(mode) {
  const root = document.getElementById('v3-root');
  if (!root) return;
  if (mode === 'light') {
    root.classList.add('v3-light');
  } else if (mode === 'dark') {
    root.classList.remove('v3-light');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.remove('v3-light');
    else root.classList.add('v3-light');
  }
}

export default function V3ThemeWrapper({ children }) {
  useEffect(() => {
    const saved = localStorage.getItem('v3_theme') || 'dark';
    applyTheme(saved);

    // Sistem teması takip et
    if (saved === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => applyTheme('system');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, []);

  return (
    <div id="v3-root" className="v3-root">
      {children}
    </div>
  );
}
