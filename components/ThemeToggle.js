'use client';

import { useEffect, useRef } from 'react';

export default function ThemeToggle() {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const update = () => {
      const isDark = document.documentElement.classList.contains('dark');
      btn.setAttribute('data-dark', isDark ? '1' : '0');
      btn.style.background = isDark ? '#2a2620' : '#e8e2d5';
      const knob = btn.querySelector('span');
      if (knob) {
        knob.style.left = isDark ? '22px' : '3px';
        knob.textContent = isDark ? '🌙' : '☀️';
      }
    };

    const handleClick = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      update();
    };

    btn.addEventListener('click', handleClick);
    update();

    return () => btn.removeEventListener('click', handleClick);
  }, []);

  return (
    <button
      ref={btnRef}
      aria-label="Tema değiştir"
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        border: '0.5px solid var(--color-border)',
        background: '#e8e2d5',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        outline: 'none',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: '3px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: '#6b6356',
        transition: 'left 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        pointerEvents: 'none',
      }}>☀️</span>
    </button>
  );
}
