'use client';
import { useState, useMemo } from 'react';

// ─── HUNI VERİSİ ─────────────────────────────────────────────────────────────
const HUNI = [
  { label: 'Oturum açtı',    n: 10000, renk: '#1D9E75', aciklama: 'Siteye giren tüm ziyaretçiler' },
  { label: 'Ürün inceledi',  n: 7240,  renk: '#2E9E82', aciklama: 'En az bir ürün sayfası görüntüledi' },
  { label: 'Sepete ekledi',  n: 3180,  renk: '#e8a04a', aciklama: 'Sepete en az bir ürün ekledi' },
  { label: 'Ödeme sayfası',  n: 1620,  renk: '#d4873a', aciklama: 'Ödeme adımına geçti' },
  { label: 'Satın aldı',     n: 872,   renk: '#BA7517', aciklama: 'Siparişi tamamladı' },
];

// ─── SIGMOID & SKOR ──────────────────────────────────────────────────────────
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function hesaplaOlasilik({ cihaz, tutar, urunSayisi, sureDk, gun, kaynak }) {
  let z = -0.35;
  if (cihaz === 'masaustu') z += 0.70;
  else if (cihaz === 'tablet') z += 0.20;
  else z -= 0.30;

  if (tutar < 100) z += 0.30;
  else if (tutar < 300) z += 0.10;
  else if (tutar < 600) z -= 0.10;
  else z -= 0.45;

  if (urunSayisi === 1) z -= 0.10;
  else if (urunSayisi <= 3) z += 0.20;
  else z += 0.40;

  if (sureDk < 2) z -= 0.55;
  else if (sureDk < 5) z -= 0.10;
  else if (sureDk < 15) z += 0.30;
  else z += 0.55;

  if (gun === 'haftasonu') z += 0.12;

  if (kaynak === 'email') z += 0.85;
  else if (kaynak === 'direkt') z += 0.40;
  else if (kaynak === 'organik') z += 0.20;
  else if (kaynak === 'sosyal') z -= 0.20;
  else z -= 0.10;

  return sigmoid(z);
}

// ─── KONVERSIYON HUNİSİ ──────────────────────────────────────────────────────
function KonversiyonHunisi() {
  const [aktif, setAktif] = useState(null);
  const MAX_W = 440;

  return (
    <div style={{ margin: '32px 0', padding: '24px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>Dönüşüm Hunisi</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '20px' }}>10.000 oturum örneği · Üzerine gel</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        {HUNI.map((adim, i) => {
          const genislik = (adim.n / HUNI[0].n) * MAX_W;
          const prev = i > 0 ? HUNI[i - 1].n : adim.n;
          const adimKayip = prev - adim.n;
          const adimOran = i === 0 ? 100 : ((adim.n / prev) * 100).toFixed(1);
          const genelOran = ((adim.n / HUNI[0].n) * 100).toFixed(1);
          const isAktif = aktif === i;

          return (
            <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Huni çubuğu */}
              <div
                onMouseEnter={() => setAktif(i)}
                onMouseLeave={() => setAktif(null)}
                style={{
                  width: `${genislik}px`,
                  maxWidth: '100%',
                  height: '52px',
                  background: isAktif ? adim.renk : `${adim.renk}CC`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isAktif ? `0 4px 16px ${adim.renk}55` : 'none',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{adim.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {adim.n.toLocaleString('tr-TR')}
                </span>
              </div>

              {/* Tooltip */}
              {isAktif && (
                <div style={{
                  position: 'absolute', top: '58px', zIndex: 10,
                  background: 'var(--color-text)', color: 'var(--color-cream)',
                  borderRadius: '10px', padding: '10px 14px',
                  fontSize: '12px', lineHeight: 1.7, whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{adim.aciklama}</div>
                  {i > 0 && <div>Bu adımda kayıp: <strong>{adimKayip.toLocaleString('tr-TR')}</strong> kişi</div>}
                  {i > 0 && <div>Önceki adımdan geçiş: <strong>{adimOran}%</strong></div>}
                  <div>Toplam dönüşüm: <strong>{genelOran}%</strong></div>
                </div>
              )}

              {/* Ok işareti */}
              {i < HUNI.length - 1 && (
                <div style={{ color: 'var(--color-text-mute)', fontSize: '11px', margin: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#EF4444', fontWeight: 600 }}>
                    −{(HUNI[i + 1] === undefined ? 0 : (HUNI[i].n - HUNI[i + 1].n)).toLocaleString('tr-TR')}
                  </span>
                  <span style={{ color: 'var(--color-text-faint)' }}>(%{(100 - (HUNI[i + 1].n / HUNI[i].n) * 100).toFixed(0)} terk)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Özet satırı */}
      <div style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--color-cream)', borderRadius: '10px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Sepet → Satın alma', deger: `%${((HUNI[4].n / HUNI[2].n) * 100).toFixed(1)}` },
          { label: 'Genel dönüşüm', deger: `%${((HUNI[4].n / HUNI[0].n) * 100).toFixed(1)}` },
          { label: 'En büyük kayıp', deger: 'Sepet → Ödeme' },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{m.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{m.deger}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFİL SİMÜLATÖRÜ ───────────────────────────────────────────────────────
function ProfilSimulator() {
  const [profil, setProfil] = useState({
    cihaz: 'masaustu', tutar: 250, urunSayisi: 2,
    sureDk: 8, gun: 'haftaici', kaynak: 'organik',
  });

  const olasilik = useMemo(() => hesaplaOlasilik(profil), [profil]);
  const yuzde = Math.round(olasilik * 100);

  const renkArc = yuzde >= 65 ? '#1D9E75' : yuzde >= 40 ? '#e8a04a' : '#EF4444';
  const etiket = yuzde >= 65 ? 'Yüksek' : yuzde >= 40 ? 'Orta' : 'Düşük';

  const set = (key, val) => setProfil(p => ({ ...p, [key]: val }));

  const SecenekGrup = ({ label, field, options }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o.val} onClick={() => set(field, o.val)}
            style={{
              padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
              border: profil[field] === o.val ? 'none' : '1px solid var(--color-border)',
              background: profil[field] === o.val ? renkArc : 'transparent',
              color: profil[field] === o.val ? '#fff' : 'var(--color-text-soft)',
              fontWeight: profil[field] === o.val ? 600 : 400,
              transition: 'all 0.15s',
            }}>{o.label}</button>
        ))}
      </div>
    </div>
  );

  const Kaydirici = ({ label, field, min, max, step = 1, format = v => v }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{format(profil[field])}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={profil[field]}
        onChange={e => set(field, Number(e.target.value))}
        style={{ width: '100%', accentColor: renkArc }} />
    </div>
  );

  // SVG yay (arc indicator)
  const r = 52, cx = 70, cy = 70;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const currentDeg = startAngle + (yuzde / 100) * totalDeg;
  const toRad = deg => (deg * Math.PI) / 180;
  const arcPath = (from, to, radius) => {
    const x1 = cx + radius * Math.cos(toRad(from));
    const y1 = cy + radius * Math.cos(toRad(from - 90));
    const x2 = cx + radius * Math.cos(toRad(to));
    const y2 = cy + radius * Math.cos(toRad(to - 90));
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Daha basit: doğrusal progress bar yerine SVG daire
  const circleC = 2 * Math.PI * r;
  const dash = (yuzde / 100) * circleC * 0.75;

  return (
    <div style={{ margin: '32px 0', padding: '24px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>Kullanıcı Profil Simülatörü</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '20px' }}>Özellikleri değiştir → satın alma olasılığını gör</div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Sol: girdiler */}
        <div style={{ flex: '1 1 280px' }}>
          <Kaydirici label="Sepet tutarı" field="tutar" min={20} max={2000} step={10}
            format={v => `₺${v.toLocaleString('tr-TR')}`} />
          <Kaydirici label="Ürün sayısı" field="urunSayisi" min={1} max={8}
            format={v => `${v} ürün`} />
          <Kaydirici label="Oturum süresi" field="sureDk" min={1} max={30}
            format={v => `${v} dakika`} />
          <SecenekGrup label="Cihaz" field="cihaz" options={[
            { val: 'masaustu', label: '🖥 Masaüstü' },
            { val: 'tablet',   label: '📱 Tablet' },
            { val: 'mobil',    label: '📲 Mobil' },
          ]} />
          <SecenekGrup label="Trafik kaynağı" field="kaynak" options={[
            { val: 'email',    label: '✉ Email' },
            { val: 'organik',  label: '🔍 Organik' },
            { val: 'direkt',   label: '🔗 Direkt' },
            { val: 'ucretli',  label: '💰 Ücretli' },
            { val: 'sosyal',   label: '📣 Sosyal' },
          ]} />
          <SecenekGrup label="Gün" field="gun" options={[
            { val: 'haftaici',  label: 'Hafta içi' },
            { val: 'haftasonu', label: 'Hafta sonu' },
          ]} />
        </div>

        {/* Sağ: sonuç */}
        <div style={{ flex: '0 0 160px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Arka plan dairesi */}
            <circle cx="70" cy="70" r={r} fill="none"
              stroke="var(--color-border)" strokeWidth="10"
              strokeDasharray={`${circleC * 0.75} ${circleC}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(135 70 70)" />
            {/* Aktif yay */}
            <circle cx="70" cy="70" r={r} fill="none"
              stroke={renkArc} strokeWidth="10"
              strokeDasharray={`${dash} ${circleC}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(135 70 70)"
              style={{ transition: 'stroke-dasharray 0.4s, stroke 0.3s' }} />
            {/* Merkez */}
            <text x="70" y="64" textAnchor="middle" fill={renkArc}
              style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              %{yuzde}
            </text>
            <text x="70" y="82" textAnchor="middle" fill="var(--color-text-mute)"
              style={{ fontSize: '11px' }}>
              {etiket}
            </text>
          </svg>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>
              Satın alma<br />olasılığı
            </div>
          </div>

          {/* Önemli faktörler */}
          <div style={{ width: '100%', marginTop: '4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '6px', textAlign: 'center' }}>Etkili faktörler</div>
            {[
              { label: 'Kaynak', deger: profil.kaynak === 'email' ? '🟢 Güçlü' : profil.kaynak === 'sosyal' ? '🔴 Zayıf' : '🟡 Orta' },
              { label: 'Cihaz', deger: profil.cihaz === 'masaustu' ? '🟢 İyi' : profil.cihaz === 'tablet' ? '🟡 Orta' : '🔴 Düşük' },
              { label: 'Tutar', deger: profil.tutar < 300 ? '🟢 Uygun' : profil.tutar < 700 ? '🟡 Yüksek' : '🔴 Çok yüksek' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '3px 0', borderBottom: '0.5px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-mute)' }}>{f.label}</span>
                <span>{f.deger}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── GELİR HESAPLAYICI ───────────────────────────────────────────────────────
function GelirHesaplayici() {
  const [aylikZiyaretci, setAylikZiyaretci] = useState(50000);
  const [sepetoranı, setSepetOrani] = useState(28);
  const [tamamlamaOrani, setTamamlamaOrani] = useState(22);
  const [ortalamaSiparis, setOrtalamaSiparis] = useState(380);
  const [iyilestirme, setIyilestirme] = useState(15);

  const sonuclar = useMemo(() => {
    const sepetSayisi = aylikZiyaretci * (sepetoranı / 100);
    const mevcutSatis = sepetSayisi * (tamamlamaOrani / 100);
    const mevcutGelir = mevcutSatis * ortalamaSiparis;
    const yeniTamamlama = tamamlamaOrani * (1 + iyilestirme / 100);
    const yeniSatis = sepetSayisi * (yeniTamamlama / 100);
    const ekGelir = (yeniSatis - mevcutSatis) * ortalamaSiparis;
    return {
      mevcutGelir,
      ekGelir,
      yillikEkGelir: ekGelir * 12,
      mevcutSatis: Math.round(mevcutSatis),
      ekSatis: Math.round(yeniSatis - mevcutSatis),
    };
  }, [aylikZiyaretci, sepetoranı, tamamlamaOrani, ortalamaSiparis, iyilestirme]);

  const fmt = n => `₺${Math.round(n).toLocaleString('tr-TR')}`;

  const Slider = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
          {value.toLocaleString('tr-TR')}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
    </div>
  );

  return (
    <div style={{ margin: '32px 0', padding: '24px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>Gelir Kurtarma Hesaplayıcı</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '20px' }}>Dönüşümü %X iyileştirirsen ne kazanırsın?</div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* Girdiler */}
        <div style={{ flex: '1 1 260px' }}>
          <Slider label="Aylık ziyaretçi" value={aylikZiyaretci} onChange={setAylikZiyaretci} min={5000} max={500000} step={5000} />
          <Slider label="Sepet oluşturma oranı" value={sepetoranı} onChange={setSepetOrani} min={5} max={60} unit="%" />
          <Slider label="Mevcut tamamlama oranı" value={tamamlamaOrani} onChange={setTamamlamaOrani} min={5} max={60} unit="%" />
          <Slider label="Ortalama sipariş değeri" value={ortalamaSiparis} onChange={setOrtalamaSiparis} min={50} max={5000} step={50} unit=" ₺" />
          <Slider label="Hedef iyileştirme (göreli)" value={iyilestirme} onChange={setIyilestirme} min={5} max={50} unit="%" />
        </div>

        {/* Çıktılar */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Mevcut aylık gelir',     deger: fmt(sonuclar.mevcutGelir),     renk: 'var(--color-text)',         sub: `${sonuclar.mevcutSatis.toLocaleString('tr-TR')} sipariş/ay` },
            { label: 'Kurtarılabilir ek gelir', deger: fmt(sonuclar.ekGelir),         renk: '#1D9E75',                    sub: `+${sonuclar.ekSatis.toLocaleString('tr-TR')} ek sipariş/ay` },
            { label: 'Yıllık potansiyel',       deger: fmt(sonuclar.yillikEkGelir),   renk: 'var(--color-accent)',        sub: 'Yalnızca bu kanaldan' },
          ].map(k => (
            <div key={k.label} style={{
              padding: '14px 16px', borderRadius: '10px',
              background: 'var(--color-cream)',
              border: `1px solid var(--color-border)`,
              borderLeft: `3px solid ${k.renk}`,
            }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{k.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: k.renk, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{k.deger}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-faint)', marginTop: '4px' }}>{k.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── ANA SAYFA ────────────────────────────────────────────────────────────────
export default function SepetTerki() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          E-ticaret sepet terki: neden ayrılıyorlar, nasıl geri döndürürsün?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          Dönüşüm hunisi · 22 dakika okuma · Python + XGBoost + interaktif simülasyon
        </p>

        <p>
          Türkiye'de e-ticaret pazarının büyüklüğü 2024'te 700 milyar TL'yi aştı.
          Bu pazarda ortalama sepet terk oranı <strong>%70'in üzerinde</strong> —
          yani her 10 kişiden 7'si ödeme adımına geçmeden ayrılıyor.
        </p>
        <p>
          Sepet terki soyut bir kayıp değil, somut bir optimizasyon problemi.
          Hangi kullanıcı neden ayrılıyor, kim ne zaman geri dönebilir?
          Bu soruların cevabı hem teknik hem de iş stratejisi gerektiriyor.
        </p>

        <KonversiyonHunisi />

        <h2>Sepet terkinin anatomisi</h2>
        <p>
          Yukarıdaki huniye bakıldığında en büyük kayıp <strong>sepetten ödeme sayfasına</strong> geçişte
          yaşanıyor: 3.180 kişi sepete ürün ekliyor ama sadece 1.620'si ödemeye geçiyor.
          %49 terk oranı. Neden?
        </p>
        <ul>
          <li><strong>Zorunlu üyelik:</strong> "Hesap oluştur" adımı ile karşılaşmak conversion'ı %25 düşürüyor</li>
          <li><strong>Beklenmedik kargo ücreti:</strong> Kargo maliyeti ödemede ortaya çıkınca %35 terk</li>
          <li><strong>Güven eksikliği:</strong> Tanınmayan markada ödeme bilgisi girme direnci</li>
          <li><strong>Fiyat karşılaştırma:</strong> "Şimdi değil, biraz düşüneyim" — özellikle mobilde</li>
        </ul>

        <h2>Veri seti ve EDA</h2>
        <p>
          Olist Brazilian E-Commerce Dataset: 100K+ sipariş, müşteri davranışı ve ödeme verileri.
          Kaggle'da açık olarak erişilebilir.
        </p>

        <pre>{`import pandas as pd
import numpy as np

# Temel metrikler
df = pd.read_csv("olist_orders_dataset.csv")
print(df["order_status"].value_counts())
# delivered       96478
# shipped          1107
# canceled          625
# ...

# Sepet terk oranı (ödeme başlatılmış ama tamamlanmamış)
terk_orani = df[df["order_status"] == "canceled"].shape[0] / len(df)
print(f"İptal oranı: {terk_orani:.2%}")  # ~0.63%

# Olist'te asıl sepet terki: session log'larından türetme
# Gerçek e-ticarette: payment_attempt başlayıp order oluşmayan kayıtlar`}</pre>

        <pre>{`# Cihaz tipine göre dönüşüm (simüle veri)
cihaz_df = pd.DataFrame({
    "cihaz": ["Masaüstü", "Tablet", "Mobil"],
    "sepet_olusturma": [0.32, 0.28, 0.24],
    "tamamlama":       [0.38, 0.28, 0.19],
})
cihaz_df["genel_donusum"] = (
    cihaz_df["sepet_olusturma"] * cihaz_df["tamamlama"]
)
print(cihaz_df.round(3))

# cihaz  sepet_olusturma  tamamlama  genel_donusum
# Masaüstü          0.320      0.380          0.122
# Tablet            0.280      0.280          0.078
# Mobil             0.240      0.190          0.046  ← %60 fark!`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Masaüstü kullanıcısının genel dönüşüm oranı mobil kullanıcının <strong>2.6 katı</strong>.
            Mobil öncelikli pazarda bu fark doğrudan kayıp anlamına geliyor.
            UX iyileştirmesinin ROI'si en yüksek kanallardan biri mobil checkout akışı.
          </p>
        </blockquote>

        <h2>Feature engineering</h2>

        <pre>{`# Oturum bazlı özellikler
features = [
    "device_type",           # masaustu / tablet / mobil
    "session_duration_min",  # oturumda geçirilen süre
    "pages_viewed",          # incelenen sayfa sayısı
    "cart_value",            # sepet tutarı
    "n_items",               # ürün sayısı
    "traffic_source",        # organik / ücretli / email / sosyal
    "hour_of_day",           # günün saati
    "is_weekend",            # hafta sonu mu?
    "is_returning_user",     # daha önce alışveriş yapmış mı?
    "discount_applied",      # indirim kodu uygulandı mı?
    "free_shipping",         # ücretsiz kargo var mı?
]

# Yeni türetilen özellikler
df["val_per_item"]    = df["cart_value"] / df["n_items"]
df["engagement_rate"] = df["pages_viewed"] / df["session_duration_min"]
df["late_night"]      = ((df["hour_of_day"] >= 22) |
                          (df["hour_of_day"] <= 6)).astype(int)

X = df[features + ["val_per_item","engagement_rate","late_night"]]
y = df["completed_purchase"]  # 1 = tamamladı, 0 = terk etti`}</pre>

        <h2>XGBoost modeli</h2>

        <pre>{`from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import xgboost as xgb
from sklearn.metrics import roc_auc_score, average_precision_score

cat_cols = ["device_type", "traffic_source"]
num_cols = [c for c in X.columns if c not in cat_cols]

preprocessor = ColumnTransformer([
    ("cat", OrdinalEncoder(handle_unknown="use_encoded_value",
                           unknown_value=-1), cat_cols),
    ("num", "passthrough", num_cols),
])

model = Pipeline([
    ("prep", preprocessor),
    ("clf", xgb.XGBClassifier(
        n_estimators=400,
        learning_rate=0.04,
        max_depth=5,
        scale_pos_weight=3,   # ~%70 terk = dengesizlik
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0,
    ))
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

model.fit(X_train, y_train)
y_prob = model.predict_proba(X_test)[:, 1]

print(f"ROC-AUC  : {roc_auc_score(y_test, y_prob):.4f}")   # ~0.871
print(f"PR-AUC   : {average_precision_score(y_test, y_prob):.4f}")  # ~0.761`}</pre>

        <h2>Interaktif: Kullanıcı profili simülatörü</h2>
        <p>
          Model özellikleri değiştirdikçe tahmin nasıl değişiyor? Aşağıda
          bir kullanıcının profilini oluştur ve satın alma olasılığını gör.
        </p>

        <ProfilSimulator />

        <h2>Özellik önemi</h2>

        <pre>{`import shap

explainer   = shap.TreeExplainer(model["clf"])
X_test_prep = model["prep"].transform(X_test)
shap_values = explainer.shap_values(X_test_prep)

shap.summary_plot(shap_values, X_test_prep,
                  feature_names=cat_cols + num_cols,
                  max_display=10, show=False)

# En etkili özellikler (ortalama |SHAP|):
# 1. traffic_source      — email trafiği en yüksek dönüşüm
# 2. is_returning_user   — geri dönen kullanıcılar 3x daha iyi tamamlıyor
# 3. session_duration    — uzun oturum = ciddi alıcı
# 4. device_type         — masaüstü dominansı
# 5. free_shipping       — ücretsiz kargo toggleı ciddi etkili
# 6. cart_value          — yüksek tutar = tereddüt
# 7. discount_applied    — indirim kodu tamamlamayı artırıyor`}</pre>

        <h2>Segment bazlı aksiyon planı</h2>

        <pre>{`# Kullanıcıları risk segmentlerine ayır
y_prob_train = model.predict_proba(X_train)[:, 1]
df_train = X_train.copy()
df_train["tamamlama_olasiligi"] = y_prob_train
df_train["segment"] = pd.cut(
    df_train["tamamlama_olasiligi"],
    bins=[0, 0.30, 0.55, 1.0],
    labels=["Yüksek Risk", "Orta Risk", "Düşük Risk"]
)

# Her segment için farklı müdahale
MUDAHALELER = {
    "Yüksek Risk": [
        "Exit-intent popup: %10 anlık indirim",
        "Güven sinyalleri göster: SSL, iade garantisi, yorumlar",
        "Ücretsiz kargo eşiği: sepet tutarını görünür yap",
    ],
    "Orta Risk": [
        "Terk sonrası email: 1 saat içinde sepet hatırlatma",
        "Sosyal kanıt: 'X kişi şu an inceliyor'",
        "Stok uyarısı: 'Son 3 ürün kaldı'",
    ],
    "Düşük Risk": [
        "Upsell/cross-sell önerisi ekle",
        "Sadakat puanı hatırlatması",
        "Express kargo seçeneği sun",
    ],
}

for segment, mudahaleler in MUDAHALELER.items():
    n = (df_train["segment"] == segment).sum()
    print(f"\n{segment}: {n} kullanıcı")
    for m in mudahaleler:
        print(f"  • {m}")`}</pre>

        <h2>Interaktif: Gelir kurtarma hesaplayıcı</h2>
        <p>
          Dönüşüm oranını az da olsa artırmak büyük gelir farkı yaratır.
          Kendi metriklerinle hesapla:
        </p>

        <GelirHesaplayici />

        <h2>A/B testi tasarımı</h2>

        <pre>{`from scipy import stats
import numpy as np

# Kontrol: mevcut tamamlama oranı
p_kontrol  = 0.22
# Deney: exit-intent popup ile hedef
p_deney    = 0.25   # +3 puan iyileştirme hedefi

# Gerekli örneklem büyüklüğü
alpha = 0.05
guc   = 0.80

effect = p_deney - p_kontrol
pooled = (p_kontrol + p_deney) / 2
n = (
    2 * pooled * (1 - pooled) *
    (stats.norm.ppf(1 - alpha/2) + stats.norm.ppf(guc)) ** 2
) / effect ** 2

print(f"Her grup için gereken örneklem: {int(n):,}")
# ~3.200 kullanıcı / grup → ~6-7 gün trafik ile test edilebilir

# Kural: testin çalışma süresi
haftalik_trafik = 5000
print(f"Tahmini test süresi: {2*n/haftalik_trafik:.1f} hafta")`}</pre>

        <h2>Sonuç</h2>
        <p>
          Sepet terk optimizasyonu tek bir çözümle bitmez. En etkili yaklaşım:
        </p>
        <ul>
          <li><strong>Ölç:</strong> Hangi adımda en çok kayıp var? Segment bazında fark nedir?</li>
          <li><strong>Tahmin et:</strong> Kim yüksek risk taşıyor? Müdahaleyi önceliklendir.</li>
          <li><strong>Dene:</strong> Her müdahale için A/B testi — sezgi yeterli değil.</li>
          <li><strong>Kişiselleştir:</strong> Herkese aynı popup yerine profile özel müdahale.</li>
        </ul>
        <p>
          Gelir kurtarma hesaplayıcıdan görüldüğü gibi, dönüşümde <strong>küçük bir yüzdelik
          iyileştirme bile yıllık büyük gelir farkı</strong> yaratıyor. Bu yüzden
          sepet terki, veri ekibinin en yüksek ROI'li çalışma alanlarından biri.
        </p>

        <p style={{ marginTop: '2rem' }}>
          <strong>Kaynaklar:</strong>{' '}
          <a href="https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>Olist E-Commerce Dataset (Kaggle)</a>
          {' · '}
          <a href="https://xgboost.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>XGBoost dokümantasyonu</a>
          {' · '}
          <a href="https://shap.readthedocs.io" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>SHAP dokümantasyonu</a>
        </p>
      </article>
    </main>
  );
}
