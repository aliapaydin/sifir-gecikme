'use client';

import { useEffect, useRef } from 'react';

export default function Yorumlar() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('iframe')) return;

    const giscusTema = () => {
      const el = document.documentElement;
      if (el.classList.contains('lacivert')) return 'dark_dimmed';
      if (el.classList.contains('dark')) return 'dark';
      return 'light';
    };

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'aliapaydin/sifir-gecikme');
    script.setAttribute('data-repo-id', 'R_kgDOSQPciA');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOSQPciM4C8nYj');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTema());
    script.setAttribute('data-lang', 'tr');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: giscusTema() } } },
          'https://giscus.app'
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ height: '0.5px', background: 'var(--color-border)', marginBottom: '2rem' }} />
      <h2 className="font-serif" style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
        💬 Yorumlar
      </h2>
      <div ref={ref} />
    </div>
  );
}
