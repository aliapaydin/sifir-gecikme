'use client';

import { useEffect, useRef, useState } from 'react';

const PARCALAR = [
  { isim: 'Clair de Lune', besteci: 'Claude Debussy', yt: 'CvFH_6DNRCY', sure: '4:02' },
  { isim: 'Gymnopédie No.1', besteci: 'Erik Satie', yt: 'S-Xm7s9eGxU', sure: '3:22' },
  { isim: 'Moonlight Sonata', besteci: 'Beethoven', yt: '4Tr0otuiQuU', sure: '5:54' },
  { isim: "Comptine d'un autre été", besteci: 'Yann Tiersen', yt: 'KFQm9GEtGps', sure: '2:48' },
  { isim: 'Experience', besteci: 'Ludovico Einaudi', yt: '_sSfvSNRdgM', sure: '5:13' },
];

export default function MuzikPlayer() {
  const [acik, setAcik] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prog, setProg] = useState(0);
  const [curSure, setCurSure] = useState('0:00');
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const timerRef = useRef(null);
  const playerReadyRef = useRef(false);

useEffect(() => {
  if (window.YT) { initPlayer(); return; }
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = initPlayer;

  const handleIlkEtkilesim = () => {
    setTimeout(() => {
      if (playerReadyRef.current) {
        try {
          playerRef.current.playVideo();
          setPlaying(true);
        } catch {}
      }
    }, 1000);
    window.removeEventListener('click', handleIlkEtkilesim);
    window.removeEventListener('scroll', handleIlkEtkilesim);
    window.removeEventListener('keydown', handleIlkEtkilesim);
  };

  window.addEventListener('click', handleIlkEtkilesim);
  window.addEventListener('scroll', handleIlkEtkilesim);
  window.addEventListener('keydown', handleIlkEtkilesim);

  return () => {
    window.onYouTubeIframeAPIReady = null;
    window.removeEventListener('click', handleIlkEtkilesim);
    window.removeEventListener('scroll', handleIlkEtkilesim);
    window.removeEventListener('keydown', handleIlkEtkilesim);
  };
}, []);

  const initPlayer = () => {
    if (playerRef.current) return;
    playerRef.current = new window.YT.Player('yt-player', {
      height: '0', width: '0',
      videoId: PARCALAR[0].yt,
      playerVars: { autoplay: 0, controls: 0, rel: 0 },
      events: {
        onReady: () => { playerReadyRef.current = true; },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) sonrakiParça();
          if (e.data === window.YT.PlayerState.PLAYING) startTimer();
          if (e.data === window.YT.PlayerState.PAUSED) stopTimer();
        },
      },
    });
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (!playerRef.current || !playerReadyRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime() || 0;
        const total = playerRef.current.getDuration() || 1;
        setProg((cur / total) * 100);
        setCurSure(fmt(cur));
      } catch {}
    }, 500);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const fmt = (s) => {
    const sn = Math.floor(s);
    return `${Math.floor(sn / 60)}:${(sn % 60 < 10 ? '0' : '')}${sn % 60}`;
  };

  const yukle = (idx, oynat = true) => {
    setCurIdx(idx);
    setProg(0);
    setCurSure('0:00');
    if (!playerRef.current || !playerReadyRef.current) return;
    try {
      if (oynat) {
        playerRef.current.loadVideoById(PARCALAR[idx].yt);
        setPlaying(true);
      } else {
        playerRef.current.cueVideoById(PARCALAR[idx].yt);
        setPlaying(false);
      }
    } catch {}
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReadyRef.current) return;
    try {
      if (playing) {
        playerRef.current.pauseVideo();
        setPlaying(false);
      } else {
        playerRef.current.playVideo();
        setPlaying(true);
      }
    } catch {}
  };

  const sonrakiParça = () => yukle((curIdx + 1) % PARCALAR.length);
  const öncekiParça = () => yukle((curIdx - 1 + PARCALAR.length) % PARCALAR.length);

  const toggleMute = () => {
    if (!playerRef.current || !playerReadyRef.current) return;
    try {
      if (muted) { playerRef.current.unMute(); setMuted(false); }
      else { playerRef.current.mute(); setMuted(true); }
    } catch {}
  };

  const seek = (e) => {
    if (!playerRef.current || !playerReadyRef.current) return;
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const p = (e.clientX - rect.left) / rect.width;
      const total = playerRef.current.getDuration() || 0;
      playerRef.current.seekTo(p * total, true);
      setProg(p * 100);
    } catch {}
  };

  const parça = PARCALAR[curIdx];

  return (
    <>
      {/* Gizli YouTube player */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <div id="yt-player" ref={iframeRef} />
      </div>

      {/* Yüzen player */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200 }}>

        {/* Açık panel */}
        {acik && (
          <div style={{
            position: 'absolute', bottom: '60px', right: 0,
            width: '280px',
            background: 'rgba(20,18,15,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '0.5px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>

            {/* Header */}
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#1D9E75,#7F77DD)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  animation: playing ? 'sz-spin 4s linear infinite' : 'none',
                }}>🎵</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                    {parça.isim}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{parça.besteci}</div>
                </div>
              </div>
              <button onClick={() => setAcik(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}>×</button>
            </div>

            {/* Progress */}
            <div style={{ padding: '12px 16px 8px' }}>
              <div onClick={seek} style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden', cursor: 'pointer', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: `${prog}%`, background: 'linear-gradient(90deg,#1D9E75,#5DCAA5)', borderRadius: '999px', transition: 'width .5s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                <span>{curSure}</span>
                <span>{parça.sure}</span>
              </div>
            </div>

            {/* Kontroller */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '6px 16px 14px' }}>
              <button onClick={öncekiParça} style={ctrlBtn()}>⏮</button>
              <button onClick={togglePlay} style={ctrlBtn(true)}>{playing ? '⏸' : '▶'}</button>
              <button onClick={sonrakiParça} style={ctrlBtn()}>⏭</button>
              <button onClick={toggleMute} style={ctrlBtn()}>{muted ? '🔇' : '🔊'}</button>
            </div>

            {/* Parça listesi */}
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
              {PARCALAR.map((p, idx) => (
                <div key={idx} onClick={() => yukle(idx)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 16px', cursor: 'pointer',
                  background: idx === curIdx ? 'rgba(29,158,117,0.15)' : 'transparent',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => { if (idx !== curIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (idx !== curIdx) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ fontSize: '11px', color: idx === curIdx ? '#1D9E75' : 'rgba(255,255,255,0.3)', width: '14px', textAlign: 'center', flexShrink: 0 }}>
                    {idx === curIdx && playing ? '♪' : idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: idx === curIdx ? '#fff' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.isim}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{p.besteci}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{p.sure}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yüzen buton */}
        <button onClick={() => setAcik(!acik)} style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#1D9E75,#0d3d2e)',
          border: 'none', cursor: 'pointer', color: '#fff', fontSize: '20px',
          boxShadow: playing ? '0 4px 20px rgba(29,158,117,0.6)' : '0 4px 16px rgba(29,158,117,0.35)',
          transition: 'all .2s',
          animation: playing ? 'sz-pulse 2s infinite' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {playing ? '🎵' : '🎵'}
        </button>
      </div>

      <style>{`
        @keyframes sz-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sz-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(29,158,117,0.4); }
          50% { box-shadow: 0 4px 32px rgba(29,158,117,0.8); }
        }
      `}</style>
    </>
  );
}

function ctrlBtn(main = false) {
  return {
    background: main ? 'linear-gradient(135deg,#1D9E75,#0d3d2e)' : 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: main ? '16px' : '18px',
    width: main ? '40px' : '32px',
    height: main ? '40px' : '32px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .15s',
  };
}
