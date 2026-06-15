import { headers } from 'next/headers';

// Oturum cookie'sinin apex + www + tüm subdomainler arasında paylaşılması için
// kullanılacak domain. Örn: sifirgecikme.com ve www.sifirgecikme.com aynı
// oturumu görsün diye ".sifirgecikme.com" döner.
//
// Preview dağıtımları (*.vercel.app) ve localhost host-only (undefined) kalır —
// aksi halde domain uyuşmazlığı yüzünden tarayıcı cookie'yi reddeder ve giriş bozulur.
const BASE = process.env.COOKIE_BASE_DOMAIN || 'sifirgecikme.com';

export async function getCookieDomain() {
  try {
    const host = (await headers()).get('host')?.split(':')[0];
    if (!host) return undefined;
    if (host === BASE || host.endsWith('.' + BASE)) return '.' + BASE;
  } catch {}
  return undefined;
}
