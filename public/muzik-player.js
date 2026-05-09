(function () {
  if (window.__szMuzik) return;
  window.__szMuzik = true;

  var PARCALAR = [
    { isim: 'Moonlight Sonata', besteci: 'Beethoven',       src: '/muzik/moonlight-sonata.mp3' },
    { isim: 'Gymnopédie No.1',  besteci: 'Erik Satie',      src: '/muzik/gymnopedie.mp3' },
    { isim: 'Symphony No.8',    besteci: 'Schubert',        src: '/muzik/symphony-8.mp3' },
    { isim: 'Serenade',         besteci: 'Mozart',          src: '/muzik/mozart-serenade.mp3' },
  ];

  // Global state - sayfa gecisinde kaybolmaz
  if (!window.szS) {
    window.szS = { playing: false, muted: false, curIdx: 0, open: false };
  }
  var S = window.szS;

  // Global audio - sayfa gecisinde kaybolmaz
  if (!window.szAudio) {
    window.szAudio = new Audio(PARCALAR[0].src);
    window.szAudio.preload = 'auto';
    window.szAudio.volume = 0.7;
  }
  var audio = window.szAudio;

  // Audio event'leri
  audio.onended = function () { goNext(); };
  audio.onplay  = function () { S.playing = true;  updateUI(); };
  audio.onpause = function () { S.playing = false; updateUI(); };

  function fmt(s) {
    s = Math.floor(s || 0);
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  }
  function $(id) { return document.getElementById(id); }

  // ── CSS ──────────────────────────────────────────────────
  function injectCSS() {
    if ($('sz-css')) return;
    var s = document.createElement('style');
    s.id = 'sz-css';
    s.textContent = [
      '#sz-wrap{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif}',
      '#sz-btn{width:48px;height:48px;border-radius:50%;border:1.5px solid rgba(255,255,255,.1);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .3s;outline:none;background:linear-gradient(135deg,#2a2620,#1a1815);box-shadow:0 4px 16px rgba(0,0,0,.4)}',
      '#sz-btn.on{background:linear-gradient(135deg,#1D9E75,#0a6e50)!important;border-color:rgba(29,158,117,.6)!important;box-shadow:0 4px 24px rgba(29,158,117,.5)!important;animation:sz-pulse 2.5s infinite}',
      '#sz-panel{position:absolute;bottom:60px;right:0;width:288px;border-radius:18px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6);display:none;flex-direction:column;background:rgba(14,12,10,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:.5px solid rgba(255,255,255,.1)}',
      '#sz-panel.open{display:flex}',
      '.sz-trk{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;transition:background .15s;border-bottom:.5px solid rgba(255,255,255,.04)}',
      '.sz-trk.act{background:rgba(29,158,117,.18)}',
      '.sz-trk:not(.act):hover{background:rgba(255,255,255,.05)}',
      '.sz-cb{border:none;color:#fff;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;outline:none;transition:all .15s;background:rgba(255,255,255,.06)}',
      '.sz-cb.main{background:linear-gradient(135deg,#1D9E75,#0d3d2e);box-shadow:0 2px 12px rgba(29,158,117,.4)}',
      '@keyframes sz-pulse{0%,100%{box-shadow:0 4px 20px rgba(29,158,117,.4)}50%{box-shadow:0 6px 36px rgba(29,158,117,.8)}}',
      '@keyframes sz-spin{to{transform:rotate(360deg)}}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── DOM ──────────────────────────────────────────────────
  function buildWrap() {
    if ($('sz-wrap')) { updateUI(); return; }
    injectCSS();

    var wrap = document.createElement('div');
    wrap.id = 'sz-wrap';

    var panel = document.createElement('div');
    panel.id = 'sz-panel';
    if (S.open) panel.classList.add('open');

    // Header
    var hdr = document.createElement('div');
    hdr.style.cssText = 'padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:.5px solid rgba(255,255,255,.07)';

    var disc = document.createElement('div');
    disc.id = 'sz-disc';
    disc.style.cssText = 'width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#1D9E75,#7F77DD);display:flex;align-items:center;justify-content:center;font-size:18px';
    disc.textContent = '🎵';

    var tw = document.createElement('div');
    tw.style.cssText = 'flex:1;min-width:0';
    var ttl = document.createElement('div');
    ttl.id = 'sz-title';
    ttl.style.cssText = 'font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    var cmp = document.createElement('div');
    cmp.id = 'sz-comp';
    cmp.style.cssText = 'font-size:11px;color:rgba(255,255,255,.45);margin-top:1px';
    tw.appendChild(ttl);
    tw.appendChild(cmp);

    var xBtn = document.createElement('button');
    xBtn.style.cssText = 'background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:22px;line-height:1;padding:0;flex-shrink:0';
    xBtn.textContent = '×';
    xBtn.onclick = function () { S.open = false; panel.classList.remove('open'); };

    hdr.appendChild(disc); hdr.appendChild(tw); hdr.appendChild(xBtn);

    // Progress
    var pw = document.createElement('div');
    pw.style.cssText = 'padding:12px 16px 6px';
    var bar = document.createElement('div');
    bar.style.cssText = 'height:4px;background:rgba(255,255,255,.1);border-radius:999px;cursor:pointer;margin-bottom:6px;position:relative';
    var fill = document.createElement('div');
    fill.id = 'sz-fill';
    fill.style.cssText = 'position:absolute;top:0;left:0;height:100%;width:0%;background:linear-gradient(90deg,#1D9E75,#5DCAA5);border-radius:999px';
    bar.appendChild(fill);
    bar.onclick = function (e) {
      var p = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth));
      audio.currentTime = (audio.duration || 0) * p;
    };
    var times = document.createElement('div');
    times.style.cssText = 'display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.3)';
    var ct = document.createElement('span'); ct.id = 'sz-cur'; ct.textContent = '0:00';
    var dt = document.createElement('span'); dt.id = 'sz-dur'; dt.textContent = '—';
    times.appendChild(ct); times.appendChild(dt);
    pw.appendChild(bar); pw.appendChild(times);

    // Progress timer
    setInterval(function () {
      var f = $('sz-fill'), c = $('sz-cur'), d = $('sz-dur');
      if (!f) return;
      var cur = audio.currentTime || 0;
      var tot = audio.duration || 0;
      if (tot > 0) {
        f.style.width = ((cur / tot) * 100) + '%';
        if (c) c.textContent = fmt(cur);
        if (d) d.textContent = fmt(tot);
      }
    }, 500);

    // Controls
    var ctrl = document.createElement('div');
    ctrl.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:14px;padding:10px 16px 14px';

    function mkBtn(label, main, fn) {
      var b = document.createElement('button');
      b.className = 'sz-cb' + (main ? ' main' : '');
      b.style.cssText = 'width:' + (main ? 44 : 34) + 'px;height:' + (main ? 44 : 34) + 'px;font-size:' + (main ? 18 : 16) + 'px';
      b.textContent = label; b.onclick = fn; return b;
    }

    var pb = mkBtn('▶', true, function () { togglePlay(); }); pb.id = 'sz-play';
    var mb = mkBtn('🔊', false, function () { toggleMute(); }); mb.id = 'sz-mute';
    ctrl.appendChild(mkBtn('⏮', false, function () { goPrev(); }));
    ctrl.appendChild(pb);
    ctrl.appendChild(mkBtn('⏭', false, function () { goNext(); }));
    ctrl.appendChild(mb);

    // List
    var list = document.createElement('div');
    list.style.cssText = 'border-top:.5px solid rgba(255,255,255,.07);max-height:200px;overflow-y:auto';
    PARCALAR.forEach(function (p, i) {
      var row = document.createElement('button');
      row.className = 'sz-trk' + (i === S.curIdx ? ' act' : '');
      row.id = 'sz-t' + i;
      row.style.borderBottom = i < PARCALAR.length - 1 ? '.5px solid rgba(255,255,255,.04)' : 'none';
      row.innerHTML = '<div id="sz-n' + i + '" style="font-size:11px;color:' + (i === S.curIdx ? '#1D9E75' : 'rgba(255,255,255,.3)') + ';width:16px;text-align:center;flex-shrink:0">' + (i === S.curIdx ? '♪' : i + 1) + '</div>'
        + '<div style="flex:1;min-width:0"><div style="font-size:12px;color:' + (i === S.curIdx ? '#fff' : 'rgba(255,255,255,.65)') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + p.isim + '</div>'
        + '<div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:1px">' + p.besteci + '</div></div>'
        + '<div style="font-size:11px;color:rgba(255,255,255,.3);flex-shrink:0"></div>';
      row.onclick = function () { selectTrack(i, true); };
      list.appendChild(row);
    });

    panel.appendChild(hdr); panel.appendChild(pw); panel.appendChild(ctrl); panel.appendChild(list);

    var btn = document.createElement('button');
    btn.id = 'sz-btn'; btn.textContent = '🎵';
    if (S.playing) btn.classList.add('on');
    btn.onclick = function () {
      S.open = !S.open;
      if (S.open) panel.classList.add('open');
      else panel.classList.remove('open');
    };

    wrap.appendChild(panel); wrap.appendChild(btn);
    document.body.appendChild(wrap);
    updateUI();
  }

  // ── UI ───────────────────────────────────────────────────
  function updateUI() {
    var p = PARCALAR[S.curIdx];
    var ttl = $('sz-title'), cmp = $('sz-comp');
    var play = $('sz-play'), disc = $('sz-disc'), btn = $('sz-btn');
    var mute = $('sz-mute');
    if (ttl) ttl.textContent = p.isim;
    if (cmp) cmp.textContent = p.besteci;
    if (play) play.textContent = S.playing ? '⏸' : '▶';
    if (disc) disc.style.animation = S.playing ? 'sz-spin 5s linear infinite' : 'none';
    if (btn) S.playing ? btn.classList.add('on') : btn.classList.remove('on');
    if (mute) mute.textContent = S.muted ? '🔇' : '🔊';
    PARCALAR.forEach(function (_, i) {
      var row = $('sz-t' + i), num = $('sz-n' + i);
      if (!row || !num) return;
      row.className = 'sz-trk' + (i === S.curIdx ? ' act' : '');
      num.textContent = i === S.curIdx && S.playing ? '♪' : (i + 1);
      num.style.color = i === S.curIdx ? '#1D9E75' : 'rgba(255,255,255,.3)';
    });
  }

  // ── KONTROL ──────────────────────────────────────────────
  function togglePlay() {
    if (S.playing) audio.pause();
    else audio.play().catch(function () {});
  }

  function selectTrack(idx, autoPlay) {
    S.curIdx = idx;
    audio.src = PARCALAR[idx].src;
    audio.load();
    var fill = $('sz-fill'), ct = $('sz-cur'), dt = $('sz-dur');
    if (fill) fill.style.width = '0%';
    if (ct) ct.textContent = '0:00';
    if (dt) dt.textContent = '—';
    if (autoPlay) audio.play().catch(function () {});
    else S.playing = false;
    updateUI();
  }

  function goNext() { selectTrack((S.curIdx + 1) % PARCALAR.length, true); }
  function goPrev() { selectTrack((S.curIdx - 1 + PARCALAR.length) % PARCALAR.length, true); }

  function toggleMute() {
    S.muted = !S.muted;
    audio.muted = S.muted;
    updateUI();
  }

  // ── BOOT ─────────────────────────────────────────────────
  function boot() {
    injectCSS();
    buildWrap();

    // Body observer - wrap silinirse geri ekle
    new MutationObserver(function () {
      if (!$('sz-wrap')) buildWrap();
    }).observe(document.body, { childList: true });

    // Sayfa gecisinde muzigi devam ettir
    var lastHref = location.href;
    new MutationObserver(function () {
      if (location.href !== lastHref) {
        lastHref = location.href;
        if (S.playing) {
          setTimeout(function () {
            audio.play().catch(function () {});
          }, 300);
        }
      }
    }).observe(document.querySelector('head') || document.documentElement, { childList: true, subtree: true });

    // Ilk etkilesimde otomatik basla
    function autoStart() {
      audio.play().catch(function () {});
      ['click', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) {
        window.removeEventListener(ev, autoStart);
      });
    }
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, autoStart, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
