// localStorage tabanlı kullanıcı aktivite takibi

const KEYS = {
  ziyaretler:   'sz_ziyaretler',
  sqlSorgu:     'sz_sql_sorgu',
  pythonSorgu:  'sz_python_sorgu',
  sinavPuani:   'sz_sinav_puani',
};

function oku(key, varsayilan) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : varsayilan;
  } catch { return varsayilan; }
}

function yaz(key, deger) {
  try { localStorage.setItem(key, JSON.stringify(deger)); } catch {}
}

export function sayfaZiyaretEt(href) {
  const mevcut = oku(KEYS.ziyaretler, []);
  if (!mevcut.includes(href)) yaz(KEYS.ziyaretler, [...mevcut, href]);
}

export function sqlSorguArt() {
  yaz(KEYS.sqlSorgu, oku(KEYS.sqlSorgu, 0) + 1);
}

export function pythonSorguArt() {
  yaz(KEYS.pythonSorgu, oku(KEYS.pythonSorgu, 0) + 1);
}

export function takipOku() {
  const ziyaretler     = oku(KEYS.ziyaretler,  []);
  const sqlSorgu       = oku(KEYS.sqlSorgu,     0);
  const pythonSorgu    = oku(KEYS.pythonSorgu,  0);
  const sinavPuani     = oku(KEYS.sinavPuani,   null);

  // Günlük soru istatistikleri (gsq_* keyleri)
  let gunlukSoruSayisi = 0, gunlukDogruSayisi = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('gsq_')) {
        gunlukSoruSayisi++;
        // Doğru cevap bilgisi ayrıca saklanmıyor, sadece sayım
      }
    }
    // Doğru cevaplar sz_gsq_dogru keyinde toplanıyor
    gunlukDogruSayisi = oku('sz_gsq_dogru', 0);
  } catch {}

  return { ziyaretler, sqlSorgu, pythonSorgu, sinavPuani, gunlukSoruSayisi, gunlukDogruSayisi };
}
