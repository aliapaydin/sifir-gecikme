(function () {
  if (window.__szMuzikLoaded) return;
  window.__szMuzikLoaded = true;

  var PARCALAR = [
    { isim: 'Clair de Lune',           besteci: 'Claude Debussy',   sure: 242, yt: 'CvFH_6DNRCY' },
    { isim: 'Gymnopédie No.1',         besteci: 'Erik Satie',       sure: 202, yt: 'S-Xm7s9eGxU' },
    { isim: 'Moonlight Sonata',        besteci: 'Beethoven',        sure: 354, yt: '4Tr0otuiQuU' },
    { isim: "Comptine d'un autre ete", besteci: 'Yann Tiersen',     sure: 168, yt: 'KFQm9GEtGps' },
    { isim: 'Experience',              besteci: 'Ludovico Einaudi', sure: 313, yt: '_sSfvSNRdgM' },
  ];

  var S = {
    player: null, ready: false, playing: false,
    muted: false, curIdx: 0, open: false, timerID: null,
    curSec: 0,
  };

  function fmt(s) {
    s = Math.floor(s || 0);
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  }

  // ── DOM'u her zaman canlı tut ──────────────────────────────
  function ensureDOM() {
    // Wrap
    if (!document.getElementById('sz-wrap')) {
      buildWrap();
    }
    // YT frame — bu en kritik kısım
    if (!document.getElementById('sz-yt-frame')) {
      var ytDiv = document.createElement('div');
      ytDiv.id = 'sz-yt-frame';
      ytDiv.style.cssText = 'position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-999';
      document.body.appendChild(ytDiv);
      // Player varsa yeniden bağla
      if (S.player && S.ready) {
        try { S.player.a = ytDiv; } catch(e) {}
      }
    }
  }

  // MutationObserver ile DOM değişimlerini izle
  function watchDOM() {
    var obs = new MutationObserver(function() {
      ensureDOM();
    });
    obs.observe(document.body, { childList: true, subtree: false });
  }

  // ── CSS ───────────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('sz-css')) return;
    var s = document.createElement('style');
    s.id = 'sz-css';
    s.textContent = [
      '#sz-wrap{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,sans-serif}',
      '#sz-btn{width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .3s;outline:none;background:linear-gradient(135deg,#2a2620,#1a1815);border:1.5px solid rgba(255,255,255,.1);box-shadow:0 4px 16px rgba(0,0,0,.4);color:#fff}',
      '#sz-btn.on{background:linear-gradient(135deg,#1D9E75,#0a6e50)!important;border-color:rgba(29,158,117,.6)!important;box-shadow:0 4px 24px rgba(29,158,117,.5)!important;animation:sz-pulse 2.5s infinite}',
      '#sz-panel{position:absolute;bottom:60px;right:0;width:288px;border-radius:18px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6);display:none;flex-direction:column;background:rgba(14,12,10,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:0.5px solid rgba(255,255,255,.1)}',
      '#sz-panel.open{display:flex}',
      '.sz-trk{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;transition:background .15s;border-bottom:0.5px solid rgba(255,255,255,.04)}',
      '.sz-trk.act{background:rgba(29,158,117,.18)}',
      '.sz-trk:not(.act):hover{background:rgba(255,255,255,.05)}',
      '.sz-cb{background:rgba(255,255,255,.06);border:none;color:#fff;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;outline:none;transition:all .15s}',
      '.sz-cb.main{background:linear-gradient(135deg,#1D9E75,#0d3d2e);box-shadow:0 2px 12px rgba(29,158,117,.4)}',
      '@keyframes sz-pulse{0%,100%{box-shadow:0 4px 20px rgba(29,158,117,.4)}50%{box-shadow:0 6px 36px rgba(29,158,117,.8)}}',
      '@keyframes sz-spin{to{transform:rotate(360deg)}}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── WRAP BUILD ────────────────────────────────────────────
  function buildWrap() {
    if (document.getElementById('sz-wrap')) return;
    injectCSS();

    var wrap = el('div', 'sz-wrap');

    // Panel
    var panel = el('div', 'sz-panel');

    // Header
    var hdr = elStyle('div', 'padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:0.5px solid rgba(255,255,255,.07)');
    var disc = el('div', 'sz-disc');
    disc.style.cssText = 'width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#1D9E75,#7F77DD);display:flex;align-items:center;justify-content:center;font-size:18px';
    disc.textContent = '🎵';
    var tw = elStyle('div', 'flex:1;min-width:0');
    var ttl = el('div', 'sz-title');
    ttl.style.cssText = 'font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    var cmp = el('div', 'sz-comp');
    cmp.style.cssText = 'font-size:11px;color:rgba(255,255,255,.45);margin-top:1px';
    tw.appendChild(ttl); tw.appendChild(cmp);
    var xBtn = elStyle('button', 'background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:22px;line-height:1;padding:0;flex-shrink:0');
    xBtn.textContent = '×';
    xBtn.onclick = function() { togglePanel(false); };
    hdr.appendChild(disc); hdr.appendChild(tw); hdr.appendChild(xBtn);

    // Progress
    var pw = elStyle('div', 'padding:12px 16px 6px');
    var bar = elStyle('div', 'height:4px;background:rgba(255,255,255,.1);border-radius:999px;cursor:pointer;margin-bottom:6px;position:relative');
    bar.id = 'sz-bar';
    var fill = elStyle('div', 'position:absolute;top:0;left:0;height:100%;width:0%;background:linear-gradient(90deg,#1D9E75,#5DCAA5);border-radius:999px;transition:width .4s linear');
    fill.id = 'sz-fill';
    bar.appendChild(fill);
    bar.onclick = function(e) {
      if (!S.ready) return;
      var p = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth));
      try { S.player.seekTo((S.player.getDuration()||0)*p, true); } catch(e){}
      fill.style.width = (p*100)+'%';
    };
    var times = elStyle('div', 'display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.3)');
    var ct = document.createElement('span'); ct.id = 'sz-cur'; ct.textContent = '0:00';
    var dt = document.createElement('span'); dt.id = 'sz-dur';
    times.appendChild(ct); times.appendChild(dt);
    pw.appendChild(bar); pw.appendChild(times);

    // Controls
    var ctrl = elStyle('div', 'display:flex;align-items:center;justify-content:center;gap:14px;padding:10px 16px 14px');
    var pb = mkBtn('▶', true); pb.id = 'sz-play'; pb.onclick = function() { togglePlay(); };
    ctrl.appendChild(mkBtn('⏮', false, function(){ goPrev(); }));
    ctrl.appendChild(pb);
    ctrl.appendChild(mkBtn('⏭', false, function(){ goNext(); }));
    var mb = mkBtn('🔊', false, function(){ toggleMute(); }); mb.id = 'sz-mute';
    ctrl.appendChild(mb);

    // List
    var list = elStyle('div', 'border-top:0.5px solid rgba(255,255,255,.07);max-height:200px;overflow-y:auto');
    PARCALAR.forEach(function(p, i) {
      var row = document.createElement('button');
      row.className = 'sz-trk' + (i===0?' act':'');
      row.id = 'sz-t'+i;
      row.style.borderBottom = i<PARCALAR.length-1 ? '0.5px solid rgba(255,255,255,.04)' : 'none';
      row.innerHTML = '<div id="sz-n'+i+'" style="font-size:11px;color:'+(i===0?'#1D9E75':'rgba(255,255,255,.3)')+';width:16px;text-align:center;flex-shrink:0">'+(i===0?'♪':i+1)+'</div>'
        +'<div style="flex:1;min-width:0"><div style="font-size:12px;color:'+(i===0?'#fff':'rgba(255,255,255,.65)')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.isim+'</div>'
        +'<div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:1px">'+p.besteci+'</div></div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,.3);flex-shrink:0">'+fmt(p.sure)+'</div>';
      row.onclick = function() { selectTrack(i, true); };
      list.appendChild(row);
    });

    panel.appendChild(hdr); panel.appendChild(pw); panel.appendChild(ctrl); panel.appendChild(list);

    // Main button
    var btn = el('button', 'sz-btn'); btn.id = 'sz-btn'; btn.textContent = '🎵';
    btn.onclick = function() { togglePanel(); };

    wrap.appendChild(panel); wrap.appendChild(btn);
    document.body.appendChild(wrap);

    updateUI();
  }

  // ── YARDIMCILAR ───────────────────────────────────────────
  function el(tag, id) { var e=document.createElement(tag); e.id=id; return e; }
  function elStyle(tag, css) { var e=document.createElement(tag); e.style.cssText=css; return e; }
  function mkBtn(label, main, onclick) {
    var b=document.createElement('button');
    b.className='sz-cb'+(main?' main':'');
    b.style.cssText='width:'+(main?44:34)+'px;height:'+(main?44:34)+'px;font-size:'+(main?18:16)+'px';
    b.textContent=label;
    if(onclick) b.onclick=onclick;
    return b;
  }
  function $(id){ return document.getElementById(id); }

  function updateUI() {
    var p = PARCALAR[S.curIdx];
    var ttl=$('sz-title'), cmp=$('sz-comp'), dur=$('sz-dur');
    var play=$('sz-play'), disc=$('sz-disc'), btn=$('sz-btn');
    if(ttl) ttl.textContent = p.isim;
    if(cmp) cmp.textContent = p.besteci;
    if(dur) dur.textContent = fmt(p.sure);
    if(play) play.textContent = S.playing ? '⏸' : '▶';
    if(disc) disc.style.animation = S.playing ? 'sz-spin 5s linear infinite' : 'none';
    if(btn) { if(S.playing) btn.classList.add('on'); else btn.classList.remove('on'); }
    PARCALAR.forEach(function(_,i){
      var row=$('sz-t'+i), num=$('sz-n'+i);
      if(!row||!num) return;
      row.className='sz-trk'+(i===S.curIdx?' act':'');
      num.textContent = i===S.curIdx&&S.playing ? '♪' : (i+1);
      num.style.color = i===S.curIdx ? '#1D9E75' : 'rgba(255,255,255,.3)';
    });
  }

  function startTimer() {
    if(S.timerID) clearInterval(S.timerID);
    S.timerID = setInterval(function(){
      if(!S.ready||!S.player) return;
      try {
        var cur=S.player.getCurrentTime()||0;
        var total=S.player.getDuration()||1;
        var fill=$('sz-fill'), ct=$('sz-cur');
        if(fill) fill.style.width=((cur/total)*100)+'%';
        if(ct) ct.textContent=fmt(cur);
      } catch(e){}
    }, 500);
  }

  function stopTimer() {
    if(S.timerID){clearInterval(S.timerID);S.timerID=null;}
    var fill=$('sz-fill'),ct=$('sz-cur');
    // progress'i sıfırlama, kalacak
  }

  // ── KONTROL ───────────────────────────────────────────────
  function togglePanel(force) {
    S.open = force!==undefined ? force : !S.open;
    var panel=$('sz-panel');
    if(!panel) return;
    if(S.open) panel.classList.add('open');
    else panel.classList.remove('open');
  }

  function togglePlay() {
    if(!S.ready) return;
    try { S.playing ? S.player.pauseVideo() : S.player.playVideo(); } catch(e){}
  }

  function selectTrack(idx, autoPlay) {
    S.curIdx=idx;
    var fill=$('sz-fill'),ct=$('sz-cur');
    if(fill) fill.style.width='0%';
    if(ct) ct.textContent='0:00';
    if(S.ready) {
      try {
        if(autoPlay) { S.player.loadVideoById(PARCALAR[idx].yt); S.playing=true; }
        else S.player.cueVideoById(PARCALAR[idx].yt);
      } catch(e){}
    }
    updateUI();
  }

  function goNext() { selectTrack((S.curIdx+1)%PARCALAR.length, S.playing); }
  function goPrev() { selectTrack((S.curIdx-1+PARCALAR.length)%PARCALAR.length, S.playing); }

  function toggleMute() {
    if(!S.ready) return;
    S.muted=!S.muted;
    try { S.muted ? S.player.mute() : S.player.unMute(); } catch(e){}
    var mb=$('sz-mute'); if(mb) mb.textContent=S.muted?'🔇':'🔊';
  }

  // ── YT INIT ───────────────────────────────────────────────
  function initYT() {
    if(S.player) return;

    // YT frame DOM'da yoksa tekrar ekle
    if(!$('sz-yt-frame')) {
      var d=document.createElement('div');
      d.id='sz-yt-frame';
      d.style.cssText='position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-999';
      document.body.appendChild(d);
    }

    S.player = new YT.Player('sz-yt-frame', {
      height:'1', width:'1',
      videoId: PARCALAR[0].yt,
      playerVars:{autoplay:0,controls:0,rel:0,playsinline:1},
      events:{
        onReady: function(){ S.ready=true; updateUI(); },
        onStateChange: function(e){
          var YTS=YT.PlayerState;
          if(e.data===YTS.PLAYING){ S.playing=true; startTimer(); updateUI(); }
          if(e.data===YTS.PAUSED||e.data===YTS.CUED){ S.playing=false; stopTimer(); updateUI(); }
          if(e.data===YTS.ENDED){ goNext(); }
        }
      }
    });
  }

  // ── BOOT ─────────────────────────────────────────────────
  function boot() {
    injectCSS();
    buildWrap();

    // YT iframe container - body'e doğrudan ekle
    if(!$('sz-yt-frame')){
      var d=document.createElement('div');
      d.id='sz-yt-frame';
      d.style.cssText='position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-999';
      document.body.appendChild(d);
    }

    // YouTube API
    var tag=document.createElement('script');
    tag.src='https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady=initYT;

    // Body'deki değişimleri izle — Next.js soft nav'da DOM değişir
    var bodyObs = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.removedNodes.forEach(function(node) {
          // Wrap veya YT frame silindiyse geri ekle
          if(node.id==='sz-wrap') { buildWrap(); }
          if(node.id==='sz-yt-frame') {
            var d=document.createElement('div');
            d.id='sz-yt-frame';
            d.style.cssText='position:fixed;width:1px;height:1px;top:0;left:0;opacity:0;pointer-events:none;z-index:-999';
            document.body.appendChild(d);
          }
        });
      });
    });
    bodyObs.observe(document.body, {childList:true});

    // Dark mode
    new MutationObserver(function(){
      var panel=$('sz-panel');
      if(panel) panel.style.background = document.documentElement.classList.contains('dark')
        ? 'rgba(14,12,10,.97)' : 'rgba(20,16,12,.97)';
    }).observe(document.documentElement,{attributes:true,attributeFilter:['class']});

    // Otomatik basla
    function autoStart(){
      if(S.ready&&!S.playing){ try{S.player.playVideo();}catch(e){} }
      ['click','scroll','keydown','touchstart'].forEach(function(ev){
        window.removeEventListener(ev,autoStart);
      });
    }
    ['click','scroll','keydown','touchstart'].forEach(function(ev){
      window.addEventListener(ev,autoStart,{passive:true});
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot);
  } else {
    boot();
  }
})();
