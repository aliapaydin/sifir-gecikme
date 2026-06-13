// Üyelik tabanlı veri senkronizasyonu — paylaşılan saf yardımcılar.
// localStorage'taki senkronlanacak anahtarları snapshot'lar / uygular.
// Framework bağımsız; yalnızca tarayıcıda (window) çalışır.

// Senkronlanacak anahtarlar
const EXACT_KEYS = new Set([
  // Tech Center
  'tc_game_v2',
  // Kalori modülü
  'profile', 'foods', 'exercises', 'weightHistory',
  'aiInsight', 'mealInsights', 'waterLog',
]);

const SYNC_PREFIXES = ['sz_', 'gsq_'];

// Senkronlanmayacak anahtarlar (cihaz tercihi / geçici / lokal gizli)
const EXCLUDED_KEYS = new Set([
  'v3_theme',        // cihaz tema tercihi
  'geminiApiKey',    // lokal gizli anahtar
  'sz_oturum_bas',   // geçici oturum süre sayacı
]);

export const SYNC_READY_EVENT = 'sg-userdata-ready';

export function isSyncedKey(key) {
  if (!key || EXCLUDED_KEYS.has(key)) return false;
  if (EXACT_KEYS.has(key)) return true;
  return SYNC_PREFIXES.some(p => key.startsWith(p));
}

// localStorage'taki tüm senkron anahtarları düz obje olarak topla
export function snapshotLocal() {
  const out = {};
  if (typeof window === 'undefined') return out;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isSyncedKey(k)) {
        const v = localStorage.getItem(k);
        if (v !== null) out[k] = v;
      }
    }
  } catch {}
  return out;
}

// Sunucudan gelen snapshot'ı localStorage'a uygula (yalnızca senkron anahtarlar)
export function applySnapshot(data) {
  if (typeof window === 'undefined' || !data) return;
  try {
    for (const [k, v] of Object.entries(data)) {
      if (isSyncedKey(k) && typeof v === 'string') {
        localStorage.setItem(k, v);
      }
    }
  } catch {}
}

// Sunucu ve yerel veriyi güvenli biçimde birleştir — yerel daha yeniyse koru.
// Sayısal sayaçlar için max alınır; ders ilerlemesi için union yapılır.
export function mergeSnapshot(serverData, localData) {
  if (!serverData) return localData || {};
  if (!localData || Object.keys(localData).length === 0) return serverData;

  const merged = { ...serverData };

  for (const [k, localVal] of Object.entries(localData)) {
    if (!isSyncedKey(k)) continue;
    const serverVal = serverData[k];

    if (!serverVal) {
      // Sunucuda yok, yerel var → yerel kazanır
      merged[k] = localVal;
      continue;
    }

    // Ders ilerlemesi (sz_ilerleme_v1) — tamamlananDersler union + sayaçlar max
    if (k === 'sz_ilerleme_v1') {
      try {
        const s = JSON.parse(serverVal);
        const l = JSON.parse(localVal);
        merged[k] = JSON.stringify({
          ...s,
          toplamXP:      Math.max(s.toplamXP || 0,      l.toplamXP || 0),
          dogruSayisi:   Math.max(s.dogruSayisi || 0,   l.dogruSayisi || 0),
          yanlisSayisi:  Math.max(s.yanlisSayisi || 0,  l.yanlisSayisi || 0),
          gunlukSeri:    Math.max(s.gunlukSeri || 0,    l.gunlukSeri || 0),
          sonGiris:      l.sonGiris || s.sonGiris,
          devamEdenDers: l.devamEdenDers ?? s.devamEdenDers,
          tamamlananDersler: {
            ...s.tamamlananDersler,
            ...l.tamamlananDersler, // yerel tamamlamalar sunucunun üzerine yazar
          },
        });
      } catch { merged[k] = localVal; }
      continue;
    }

    // Sayısal sayaçlar (sz_mulakat_soru, sz_milyon_oyun, vb.) — max al
    if (k.startsWith('sz_') && !k.startsWith('sz_ziyaretler') && !k.startsWith('sz_durum')) {
      const sNum = Number(serverVal);
      const lNum = Number(localVal);
      if (!isNaN(sNum) && !isNaN(lNum)) {
        merged[k] = String(Math.max(sNum, lNum));
        continue;
      }
    }

    // JSON dizileri (sz_ziyaretler, sz_anladi, sz_tekrar) — union
    if (k === 'sz_ziyaretler' || k === 'sz_anladi' || k === 'sz_tekrar') {
      try {
        const sArr = JSON.parse(serverVal);
        const lArr = JSON.parse(localVal);
        if (Array.isArray(sArr) && Array.isArray(lArr)) {
          merged[k] = JSON.stringify([...new Set([...sArr, ...lArr])]);
          continue;
        }
      } catch {}
    }

    // Diğerleri: yerel daha güvenilir (son yazılan)
    merged[k] = localVal;
  }

  return merged;
}

// Çıkışta senkron anahtarları temizle (paylaşılan cihazda hesaplar arası sızıntıyı önler)
export function clearSyncedLocal() {
  if (typeof window === 'undefined') return;
  try {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isSyncedKey(k)) toRemove.push(k);
    }
    for (const k of toRemove) localStorage.removeItem(k);
  } catch {}
}

// Snapshot boş mu? (sunucu verisi var mı kararı için)
export function isEmptySnapshot(data) {
  return !data || Object.keys(data).length === 0;
}
