'use client';

import { useState, useEffect } from 'react';

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function SosyalPaylasim() {
  const [url, setUrl] = useState('');
  const [kopyalandi, setKopyalandi] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&via=sifirgecikme`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      // fallback
    }
  };

  const butonStil = (renk) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '8px', fontSize: '13px',
    fontWeight: 500, cursor: 'pointer', textDecoration: 'none',
    border: '0.5px solid var(--color-border)',
    background: 'var(--color-cream-card)',
    color: 'var(--color-text-soft)',
    transition: 'border-color 0.15s, color 0.15s',
  });

  return (
    <div style={{
      borderTop: '0.5px solid var(--color-border)',
      paddingTop: '24px',
      marginTop: '40px',
    }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Faydalı bulduysan paylaş
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

        <a href={xUrl} target="_blank" rel="noopener noreferrer"
          style={butonStil()}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}
        >
          <XIcon /> X&apos;te paylaş
        </a>

        <a href={liUrl} target="_blank" rel="noopener noreferrer"
          style={butonStil()}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0A66C2'; e.currentTarget.style.color = '#0A66C2'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}
        >
          <LinkedInIcon /> LinkedIn&apos;de paylaş
        </a>

        <button onClick={kopyala}
          style={{
            ...butonStil(),
            borderColor: kopyalandi ? '#1D9E75' : 'var(--color-border)',
            color: kopyalandi ? '#1D9E75' : 'var(--color-text-soft)',
          }}
          onMouseEnter={e => { if (!kopyalandi) { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}}
          onMouseLeave={e => { if (!kopyalandi) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}}
        >
          {kopyalandi ? <><CheckIcon /> Kopyalandı!</> : <><LinkIcon /> Linki kopyala</>}
        </button>

      </div>
    </div>
  );
}
