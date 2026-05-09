(function () {
  if (window.szInitialized) return;
  window.szInitialized = true;

  var PARCALAR = [
    { yt: 'CvFH_6DNRCY' },
    { yt: 'S-Xm7s9eGxU' },
    { yt: '4Tr0otuiQuU' },
    { yt: 'KFQm9GEtGps' },
    { yt: '_sSfvSNRdgM' },
  ];

  window.szPlayer = null;
  window.szPlaying = false;
  window.szCurIdx = 0;
  window.szReady = false;

  var container = document.createElement('div');
  container.id = 'sz-yt-root';
  container.style.cssText = 'position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-999';
  document.body.appendChild(container);

  function initPlayer() {
    if (window.szPlayer) return;
    window.szPlayer = new YT.Player('sz-yt-root', {
      height: '1',
      width: '1',
      videoId: PARCALAR[0].yt,
      playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1 },
      events: {
        onReady: function () {
          window.szReady = true;
          window.dispatchEvent(new CustomEvent('sz-ready'));
        },
        onStateChange: function (e) {
          window.szPlaying = e.data === 1;
          window.dispatchEvent(new CustomEvent('sz-state', { detail: e.data }));
          if (e.data === 0) {
            window.szCurIdx = (window.szCurIdx + 1) % PARCALAR.length;
            window.szPlayer.loadVideoById(PARCALAR[window.szCurIdx].yt);
            window.dispatchEvent(new CustomEvent('sz-track', { detail: window.szCurIdx }));
          }
        },
      },
    });
  }

  window.szPlay = function () { if (window.szReady) window.szPlayer.playVideo(); };
  window.szPause = function () { if (window.szReady) window.szPlayer.pauseVideo(); };

  window.szNext = function () {
    window.szCurIdx = (window.szCurIdx + 1) % PARCALAR.length;
    if (window.szReady) window.szPlayer.loadVideoById(PARCALAR[window.szCurIdx].yt);
    window.dispatchEvent(new CustomEvent('sz-track', { detail: window.szCurIdx }));
  };

  window.szPrev = function () {
    window.szCurIdx = (window.szCurIdx - 1 + PARCALAR.length) % PARCALAR.length;
    if (window.szReady) window.szPlayer.loadVideoById(PARCALAR[window.szCurIdx].yt);
    window.dispatchEvent(new CustomEvent('sz-track', { detail: window.szCurIdx }));
  };

  window.szGoto = function (i) {
    window.szCurIdx = i;
    if (window.szReady) window.szPlayer.loadVideoById(PARCALAR[i].yt);
    window.dispatchEvent(new CustomEvent('sz-track', { detail: i }));
  };

  window.szMute = function () {
    if (!window.szReady) return;
    window.szPlayer.isMuted() ? window.szPlayer.unMute() : window.szPlayer.mute();
  };

  window.szSeek = function (p) {
    if (!window.szReady) return;
    window.szPlayer.seekTo((window.szPlayer.getDuration() || 0) * p, true);
  };

  window.szTime = function () {
    if (!window.szReady) return { cur: 0, total: 1 };
    return {
      cur: window.szPlayer.getCurrentTime() || 0,
      total: window.szPlayer.getDuration() || 1,
    };
  };

  // YouTube API yukle
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = initPlayer;

  // Ilk etkilesimde otomatik basla
  function autoStart() {
    if (window.szReady && !window.szPlaying) window.szPlay();
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) {
      window.removeEventListener(ev, autoStart);
    });
  }
  ['click', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, autoStart, { passive: true });
  });
})();
