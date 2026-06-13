// Kullanıcı istatistiklerini localStorage'dan DB'ye sync eder
// localStorage anahtarları — bunlar tüm uygulamalardaki stat key'leri

const STAT_KEYS = [
  'sz_sql_sorgu', 'sz_python_sorgu', 'sz_sinav_puani',
  'sz_mulakat_soru', 'sz_mulakat_biliyorum',
  'sz_milyon_oyun', 'sz_milyon_max_kazanim', 'sz_milyon_toplam_soru',
  'sz_ciz_tahmin', 'sz_nn_egitim', 'sz_regex_test',
  'sz_kalori_ziyaret', 'sz_gsq_dogru', 'sz_seri', 'sz_sure_dk',
  'sz_ziyaretler', 'sz_ilerleme_v1',
];

let syncing = false;

export async function syncStatsToDB() {
  if (syncing) return;
  syncing = true;
  try {
    const stats = {};
    for (const key of STAT_KEYS) {
      const val = localStorage.getItem(key);
      if (val !== null) stats[key] = val;
    }
    if (Object.keys(stats).length === 0) return;

    await fetch('/api/v3/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });
  } catch {} finally {
    syncing = false;
  }
}

export async function syncSingleStat(key, value) {
  try {
    await fetch('/api/v3/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  } catch {}
}
