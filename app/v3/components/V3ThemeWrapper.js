'use client';

import { useEffect } from 'react';

export default function V3ThemeWrapper({ children }) {
  useEffect(() => {
    const saved = localStorage.getItem('v3_theme') || 'dark';
    const root = document.getElementById('v3-root');
    if (root && saved === 'light') root.classList.add('v3-light');
  }, []);

  return (
    <div id="v3-root" className="v3-root">
      {children}
    </div>
  );
}
