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
