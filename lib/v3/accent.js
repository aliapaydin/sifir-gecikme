// Vurgu rengi (accent) sistemi
// Kullanıcı hazır bir renk ya da özel bir renk seçer; buradan açık ve koyu tema için
// okunabilir (kontrastı yeterli) tonlar türetilir ve #v3-root üzerine CSS değişkeni olarak yazılır.
// Varsayılan "zumrut" seçiliyken hiçbir değişken yazılmaz; layout.js'teki elle ayarlanmış değerler kullanılır.

export const ACCENT_STORAGE_KEY = 'v3_accent';
export const DEFAULT_ACCENT = 'zumrut';

export const ACCENT_PRESETS = [
  { id: 'zumrut',   label: 'Zümrüt',   hex: '#10b981' },
  { id: 'indigo',   label: 'İndigo',   hex: '#6366f1' },
  { id: 'okyanus',  label: 'Okyanus',  hex: '#0ea5e9' },
  { id: 'kehribar', label: 'Kehribar', hex: '#f59e0b' },
  { id: 'mercan',   label: 'Mercan',   hex: '#f43f5e' },
  { id: 'lavanta',  label: 'Lavanta',  hex: '#8b5cf6' },
];

export const ACCENT_VAR_NAMES = [
  '--acc-d', '--acc-d-rgb', '--acc-d-text', '--acc-d-on',
  '--acc-l', '--acc-l-rgb', '--acc-l-text', '--acc-l-on',
];

// Tek bir hex renkten açık/koyu tema değişkenlerini üretir.
// ÖNEMLİ: Bu fonksiyon dışarıdaki hiçbir şeye başvurmamalı; toString() ile
// sayfa yüklenmeden önce çalışan satır içi script'e gömülüyor.
export function accentVars(hex) {
  function toRgb(h) {
    h = h.replace('#', '');
    return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
  }
  function toHex(rgb) {
    return '#' + rgb.map(function (v) { return Math.round(v).toString(16).padStart(2, '0'); }).join('');
  }
  function rgbToHsl(rgb) {
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }
  function hslToRgb(hsl) {
    var h = hsl[0], s = hsl[1], l = hsl[2];
    if (s === 0) return [l * 255, l * 255, l * 255];
    function f(p, q, t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255];
  }
  function lum(rgb) {
    var c = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    var x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // Açıklığı adım adım değiştirerek hedef kontrasta ulaş
  function reach(rgb, bg, target, dir) {
    var hsl = rgbToHsl(rgb), out = rgb;
    for (var i = 0; i < 100 && contrast(out, bg) < target; i++) {
      hsl[2] = Math.min(0.96, Math.max(0.04, hsl[2] + dir * 0.01));
      out = hslToRgb(hsl);
    }
    return out.map(function (v) { return Math.round(v); });
  }

  var base = toRgb(hex);
  var darkBg = [20, 21, 24];      // koyu tema yüzeyi
  var lightBg = [255, 255, 255];  // açık tema yüzeyi
  var nearBlack = [12, 13, 15];

  var d = reach(base, darkBg, 6, 1);
  var dText = reach(d, darkBg, 8.5, 1);
  var dOn = contrast(d, nearBlack) >= 5 ? '#0c0d0f' : '#ffffff';
  var l = reach(base, lightBg, 4.8, -1);
  var lText = reach(l, [250, 250, 250], 5.5, -1);

  return {
    '--acc-d': toHex(d),
    '--acc-d-rgb': d.join(','),
    '--acc-d-text': toHex(dText),
    '--acc-d-on': dOn,
    '--acc-l': toHex(l),
    '--acc-l-rgb': l.join(','),
    '--acc-l-text': toHex(lText),
    '--acc-l-on': '#ffffff',
  };
}

// Geçerli bir seçim mi? (hazır renk id'si ya da #rrggbb)
export function isValidAccent(choice) {
  if (typeof choice !== 'string') return false;
  return ACCENT_PRESETS.some(function (p) { return p.id === choice; }) || /^#[0-9a-f]{6}$/i.test(choice);
}

// Misafir (girişsiz) seçimi: girişte hesabın rengi uygulanırken burada saklanır, çıkışta geri yüklenir
export const ACCENT_GUEST_KEY = 'v3_accent_guest';

export function resolveAccentHex(choice) {
  if (!choice) return null;
  var preset = ACCENT_PRESETS.find(function (p) { return p.id === choice; });
  if (preset) return preset.hex;
  return /^#[0-9a-f]{6}$/i.test(choice) ? choice.toLowerCase() : null;
}

export function applyAccent(choice) {
  var root = typeof document !== 'undefined' && document.getElementById('v3-root');
  if (!root) return;
  ACCENT_VAR_NAMES.forEach(function (k) { root.style.removeProperty(k); });
  if (!choice || choice === DEFAULT_ACCENT) return;
  var hex = resolveAccentHex(choice);
  if (!hex) return;
  var vars = accentVars(hex);
  Object.keys(vars).forEach(function (k) { root.style.setProperty(k, vars[k]); });
}

export function getSavedAccent() {
  try { return localStorage.getItem(ACCENT_STORAGE_KEY) || DEFAULT_ACCENT; } catch (e) { return DEFAULT_ACCENT; }
}

export function saveAccent(choice) {
  try {
    if (!choice || choice === DEFAULT_ACCENT) localStorage.removeItem(ACCENT_STORAGE_KEY);
    else localStorage.setItem(ACCENT_STORAGE_KEY, choice);
  } catch (e) {}
}

// Sayfa boyanmadan önce tema sınıfını ve kayıtlı vurgu rengini uygulayan satır içi script.
// Böylece yenilemede renk "yanıp sönmez".
export function accentBootScript() {
  var presets = {};
  ACCENT_PRESETS.forEach(function (p) { presets[p.id] = p.hex; });
  return '(function(){try{' +
    'var r=document.getElementById("v3-root");if(!r)return;' +
    'var t=localStorage.getItem("v3_theme")||"dark";' +
    'var light=t==="light"||(t==="system"&&!window.matchMedia("(prefers-color-scheme: dark)").matches);' +
    'if(light)r.classList.add("v3-light");' +
    'var a=localStorage.getItem("' + ACCENT_STORAGE_KEY + '");' +
    'if(!a||a==="' + DEFAULT_ACCENT + '")return;' +
    'var P=' + JSON.stringify(presets) + ';' +
    'var hex=P[a]||(/^#[0-9a-f]{6}$/i.test(a)?a:null);if(!hex)return;' +
    'var v=(' + accentVars.toString() + ')(hex);' +
    'for(var k in v)r.style.setProperty(k,v[k]);' +
    '}catch(e){}})();';
}
