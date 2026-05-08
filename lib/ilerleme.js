const ANAHTAR = 'sz_ilerleme_v1';

const BOSLUK = {
  toplamXP: 0,
  dogruSayisi: 0,
  yanlisSayisi: 0,
  tamamlananDersler: {},   // { dersId: { xp, dogruluk, sure, tarih } }
  devamEdenDers: null,     // { dersId, adimIdx }
  gunlukSeri: 0,
  sonGiris: null,
};

export function ilerlemeOku() {
  try {
    const raw = localStorage.getItem(ANAHTAR);
    if (!raw) return { ...BOSLUK };
    return { ...BOSLUK, ...JSON.parse(raw) };
  } catch {
    return { ...BOSLUK };
  }
}

export function ilerlemeyazYaz(veri) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(veri));
  } catch {}
}

export function ilerlemeGuncelle(fn) {
  const mevcut = ilerlemeOku();
  const yeni = fn(mevcut);
  ilerlemeyazYaz(yeni);
  return yeni;
}

export function dersTamamla({ dersId, xp, dogruSayisi, yanlisSayisi, sureMs }) {
  return ilerlemeGuncelle(prev => {
    const toplamSoru = dogruSayisi + yanlisSayisi;
    const dogruluk = toplamSoru > 0 ? Math.round((dogruSayisi / toplamSoru) * 100) : 100;

    // XP bonusu: %100 doğrulukta +%20 bonus
    const xpKazanilan = dogruluk === 100 ? Math.round(xp * 1.2) : xp;

    // Günlük seri güncelle
    const bugun = new Date().toDateString();
    const sonGiris = prev.sonGiris;
    let gunlukSeri = prev.gunlukSeri || 0;
    if (sonGiris !== bugun) {
      const dun = new Date();
      dun.setDate(dun.getDate() - 1);
      gunlukSeri = sonGiris === dun.toDateString() ? gunlukSeri + 1 : 1;
    }

    return {
      ...prev,
      toplamXP: (prev.toplamXP || 0) + xpKazanilan,
      dogruSayisi: (prev.dogruSayisi || 0) + dogruSayisi,
      yanlisSayisi: (prev.yanlisSayisi || 0) + yanlisSayisi,
      tamamlananDersler: {
        ...prev.tamamlananDersler,
        [dersId]: {
          xp: xpKazanilan,
          dogruluk,
          sureMs,
          tarih: new Date().toISOString(),
        },
      },
      devamEdenDers: null,
      gunlukSeri,
      sonGiris: bugun,
    };
  });
}

export function dersDevamKaydet({ dersId, adimIdx }) {
  return ilerlemeGuncelle(prev => ({
    ...prev,
    devamEdenDers: { dersId, adimIdx },
  }));
}

export function ilerlemeifirla() {
  localStorage.removeItem(ANAHTAR);
  return { ...BOSLUK };
}

export function dogrulukHesapla(dogru, yanlis) {
  const toplam = dogru + yanlis;
  if (toplam === 0) return 100;
  return Math.round((dogru / toplam) * 100);
}

export function sureFormatla(ms) {
  const sn = Math.floor(ms / 1000);
  const dk = Math.floor(sn / 60);
  if (dk > 0) return `${dk}dk ${sn % 60}sn`;
  return `${sn}sn`;
}
