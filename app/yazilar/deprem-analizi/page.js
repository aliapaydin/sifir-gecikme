'use client';
import { useState } from 'react';

// ── Veri ──────────────────────────────────────────────────────

const BOLGELER = [
  { isim: 'Ege',             sayi: 4200, renk: '#E24B4A' },
  { isim: 'Marmara',         sayi: 3800, renk: '#e8a04a' },
  { isim: 'Doğu Anadolu',    sayi: 3500, renk: '#E24B4A' },
  { isim: 'İç Anadolu',      sayi: 2100, renk: '#7F77DD' },
  { isim: 'Akdeniz',         sayi: 1800, renk: '#7F77DD' },
  { isim: 'Karadeniz',       sayi:  900, renk: '#1D9E75' },
  { isim: 'Güneydoğu',       sayi:  700, renk: '#1D9E75' },
];

// Gutenberg-Richter büyüklük dağılımı (yıllık ort., tüm Türkiye)
const BUYUKLUK = [
  { aralik: 'M 2–3', sayi: 14800, log: 4.17, renk: '#1D9E75' },
  { aralik: 'M 3–4', sayi:  3200, log: 3.51, renk: '#7F77DD' },
  { aralik: 'M 4–5', sayi:   420, log: 2.62, renk: '#e8a04a' },
  { aralik: 'M 5–6', sayi:    48, log: 1.68, renk: '#E24B4A' },
  { aralik: 'M 6–7', sayi:     7, log: 0.85, renk: '#c0392b' },
  { aralik: 'M 7+',  sayi:     1, log: 0.00, renk: '#7f0000' },
];

// Yıllık M5+ deprem sayısı 2000–2024
const YILLIK = [
  { yil: 2000, sayi: 44, notlar: null },
  { yil: 2001, sayi: 38, notlar: null },
  { yil: 2002, sayi: 41, notlar: null },
  { yil: 2003, sayi: 52, notlar: 'Bingöl M6.4' },
  { yil: 2004, sayi: 35, notlar: null },
  { yil: 2005, sayi: 42, notlar: null },
  { yil: 2006, sayi: 39, notlar: null },
  { yil: 2007, sayi: 48, notlar: null },
  { yil: 2008, sayi: 43, notlar: null },
  { yil: 2009, sayi: 46, notlar: null },
  { yil: 2010, sayi: 51, notlar: null },
  { yil: 2011, sayi: 82, notlar: 'Van M7.2' },
  { yil: 2012, sayi: 58, notlar: null },
  { yil: 2013, sayi: 44, notlar: null },
  { yil: 2014, sayi: 40, notlar: null },
  { yil: 2015, sayi: 47, notlar: null },
  { yil: 2016, sayi: 53, notlar: null },
  { yil: 2017, sayi: 49, notlar: null },
  { yil: 2018, sayi: 45, notlar: null },
  { yil: 2019, sayi: 42, notlar: null },
  { yil: 2020, sayi: 71, notlar: 'İzmir M7.0' },
  { yil: 2021, sayi: 55, notlar: null },
  { yil: 2022, sayi: 49, notlar: null },
  { yil: 2023, sayi: 148, notlar: 'Kahramanmaraş M7.8' },
  { yil: 2024, sayi: 62, notlar: null },
];

// Derinlik vs Büyüklük scatter (sentetik, ~30 nokta)
const SCATTER = [
  { mag: 7.8, depth: 10,  bolge: 'Doğu Anadolu', yil: 2023, isim: 'Kahramanmaraş' },
  { mag: 7.2, depth: 16,  bolge: 'Doğu Anadolu', yil: 2011, isim: 'Van' },
  { mag: 7.0, depth: 14,  bolge: 'Ege',           yil: 2020, isim: 'İzmir' },
  { mag: 6.8, depth: 10,  bolge: 'Marmara',       yil: 1999, isim: 'İzmit' },
  { mag: 6.4, depth: 8,   bolge: 'Doğu Anadolu', yil: 2003, isim: 'Bingöl' },
  { mag: 6.2, depth: 12,  bolge: 'Ege',           yil: 2017, isim: 'Bodrum açıkları' },
  { mag: 6.1, depth: 15,  bolge: 'Ege',           yil: 2014, isim: 'Kuşadası' },
  { mag: 5.9, depth: 9,   bolge: 'Marmara',       yil: 2016, isim: 'Çanakkale' },
  { mag: 5.8, depth: 22,  bolge: 'Akdeniz',       yil: 2012, isim: 'Antalya açıkları' },
  { mag: 5.7, depth: 18,  bolge: 'İç Anadolu',    yil: 2018, isim: 'Kayseri' },
  { mag: 5.6, depth: 11,  bolge: 'Ege',           yil: 2021, isim: 'İzmir' },
  { mag: 5.5, depth: 35,  bolge: 'Akdeniz',       yil: 2015, isim: 'Rodos açıkları' },
  { mag: 5.4, depth: 14,  bolge: 'Doğu Anadolu', yil: 2019, isim: 'Elazığ' },
  { mag: 5.3, depth: 28,  bolge: 'Karadeniz',     yil: 2013, isim: 'Düzce' },
  { mag: 5.2, depth: 8,   bolge: 'Ege',           yil: 2022, isim: 'Samos açıkları' },
  { mag: 5.1, depth: 45,  bolge: 'Güneydoğu',     yil: 2020, isim: 'Gaziantep' },
  { mag: 5.0, depth: 17,  bolge: 'Marmara',       yil: 2016, isim: 'Bursa' },
  { mag: 4.8, depth: 12,  bolge: 'Ege',           yil: 2023, isim: 'Muğla' },
  { mag: 4.7, depth: 30,  bolge: 'İç Anadolu',    yil: 2021, isim: 'Ankara yakını' },
  { mag: 4.6, depth: 20,  bolge: 'Akdeniz',       yil: 2022, isim: 'Mersin' },
  { mag: 4.5, depth: 10,  bolge: 'Ege',           yil: 2024, isim: 'Çeşme' },
  { mag: 4.4, depth: 55,  bolge: 'Doğu Anadolu', yil: 2022, isim: 'Erzurum' },
  { mag: 4.3, depth: 8,   bolge: 'Marmara',       yil: 2023, isim: 'İstanbul açıkları' },
  { mag: 4.2, depth: 25,  bolge: 'Karadeniz',     yil: 2021, isim: 'Ordu' },
  { mag: 4.0, depth: 14,  bolge: 'Güneydoğu',     yil: 2020, isim: 'Diyarbakır' },
];

// Önemli depremler zaman çizgisi
const BUYUK_DEPREMLER = [
  { yil: 1939, isim: 'Erzincan',        mag: 7.8, kayip: 32962, bolge: 'Doğu Anadolu' },
  { yil: 1999, isim: 'İzmit (Marmara)', mag: 7.6, kayip: 17480, bolge: 'Marmara' },
  { yil: 2011, isim: 'Van',             mag: 7.2, kayip: 644,   bolge: 'Doğu Anadolu' },
  { yil: 2020, isim: 'İzmir',           mag: 7.0, kayip: 114,   bolge: 'Ege' },
  { yil: 2023, isim: 'Kahramanmaraş',   mag: 7.8, kayip: 50783, bolge: 'Doğu Anadolu' },
];

const BOLGE_RENK = {
  'Ege':          '#E24B4A',
  'Marmara':      '#e8a04a',
  'Doğu Anadolu': '#c0392b',
  'İç Anadolu':   '#7F77DD',
  'Akdeniz':      '#4a90d9',
  'Karadeniz':    '#1D9E75',
  'Güneydoğu':    '#9ca3af',
};

// ── Grafik Bileşenleri ────────────────────────────────────────

function BolgeBar() {
  const [hover, setHover] = useState(null);
  const max = BOLGELER[0].sayi;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {BOLGELER.map((b, i) => (
        <div key={b.isim}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text)', width: '130px', flexShrink: 0 }}>{b.isim}</div>
          <div style={{ flex: 1, height: '22px', background: 'var(--color-cream)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(b.sayi / max) * 100}%`,
              background: b.renk, borderRadius: '4px',
              opacity: hover === i ? 1 : 0.7, transition: 'width 0.6s ease, opacity 0.15s',
            }} />
          </div>
          <div style={{ fontSize: '12px', color: hover === i ? b.renk : 'var(--color-text-mute)', width: '54px', textAlign: 'right', fontWeight: hover === i ? 600 : 400 }}>
            {b.sayi.toLocaleString('tr')}
          </div>
        </div>
      ))}
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '4px' }}>
        Yıllık ortalama, M≥2 depremler
      </div>
    </div>
  );
}

function BuyuklukHistogram() {
  const [logScale, setLogScale] = useState(false);
  const max = logScale ? 5 : BUYUKLUK[0].sayi;
  const deger = (b) => logScale ? (b.sayi > 0 ? Math.log10(b.sayi) : 0) : b.sayi;
  const [hover, setHover] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button onClick={() => setLogScale(l => !l)} style={{
          fontSize: '12px', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
          border: `1.5px solid ${logScale ? '#7F77DD' : 'var(--color-border)'}`,
          background: logScale ? 'rgba(127,119,221,0.1)' : 'var(--color-cream-card)',
          color: logScale ? '#534AB7' : 'var(--color-text-soft)', fontWeight: 500,
        }}>
          {logScale ? 'Log ölçek ✓' : 'Log ölçek'}
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 4px' }}>
        {BUYUKLUK.map((b, i) => {
          const h = (deger(b) / (logScale ? 5 : max)) * 160;
          return (
            <div key={b.aralik}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
              {hover === i && (
                <div style={{ fontSize: '11px', fontWeight: 600, color: b.renk, whiteSpace: 'nowrap' }}>
                  {b.sayi.toLocaleString('tr')}
                </div>
              )}
              <div style={{
                width: '100%', height: `${h}px`,
                background: b.renk, borderRadius: '4px 4px 0 0',
                opacity: hover === i ? 1 : 0.75,
                transition: 'height 0.5s ease, opacity 0.15s',
                cursor: 'default',
              }} />
              <div style={{ fontSize: '11px', color: hover === i ? b.renk : 'var(--color-text-mute)', textAlign: 'center', fontWeight: hover === i ? 600 : 400 }}>
                {b.aralik}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '8px', textAlign: 'center' }}>
        {logScale ? 'Y ekseni: log₁₀(sayı) — her büyüklük artışı ~10 kat azalma' : 'Y ekseni: yıllık deprem sayısı'}
      </div>
    </div>
  );
}

function YillikTrend() {
  const W = 560, H = 200, ML = 36, MR = 12, MT = 14, MB = 30;
  const PW = W - ML - MR, PH = H - MT - MB;
  const yillar = YILLIK.map(d => d.yil);
  const YMIN = 25, YMAX = 160;
  const xS = (yil) => ML + ((yil - yillar[0]) / (yillar[yillar.length - 1] - yillar[0])) * PW;
  const yS = (v) => MT + ((YMAX - Math.min(v, YMAX)) / (YMAX - YMIN)) * PH;
  const [hover, setHover] = useState(null);

  const pathD = YILLIK.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.yil).toFixed(1)},${yS(d.sayi).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${xS(2024)},${MT + PH} L${xS(2000)},${MT + PH} Z`;

  const yTicks = [40, 60, 80, 100, 120, 140];

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {/* Izgara */}
        {yTicks.map(t => (
          <g key={t}>
            <line x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={ML - 4} y={yS(t) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{t}</text>
          </g>
        ))}
        {[2000,2005,2010,2015,2020,2024].map(y => (
          <text key={y} x={xS(y)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{y}</text>
        ))}

        {/* Alan */}
        <path d={areaD} fill="#E24B4A" opacity="0.08" />
        {/* Çizgi */}
        <path d={pathD} fill="none" stroke="#E24B4A" strokeWidth="2" strokeLinejoin="round" />

        {/* Noktalar + önemli olaylar */}
        {YILLIK.map((d) => {
          const cx = xS(d.yil), cy = yS(d.sayi);
          const isHov = hover?.yil === d.yil;
          const onemli = !!d.notlar;
          return (
            <g key={d.yil}
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'default' }}>
              <rect x={cx - 6} y={MT} width={12} height={PH} fill="transparent" />
              <circle cx={cx} cy={cy} r={onemli ? 5 : (isHov ? 4 : 3)}
                fill={onemli ? '#E24B4A' : 'var(--color-cream-card)'}
                stroke="#E24B4A" strokeWidth={onemli ? 0 : 1.5} />
              {onemli && (
                <>
                  <line x1={cx} y1={cy - 5} x2={cx} y2={MT + 2}
                    stroke="#E24B4A" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
                  <text x={cx} y={MT - 2} textAnchor="middle" fontSize="8"
                    fill="#E24B4A" fontWeight="600" transform={`rotate(-30,${cx},${MT})`}>
                    {d.notlar}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hover && (
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'var(--color-cream-card)', border: '1.5px solid #E24B4A',
          borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 600, color: '#E24B4A' }}>{hover.yil}</div>
          <div style={{ color: 'var(--color-text)' }}>{hover.sayi} adet M5+ deprem</div>
          {hover.notlar && <div style={{ color: '#E24B4A', fontSize: '11px' }}>{hover.notlar}</div>}
        </div>
      )}
    </div>
  );
}

function DerinlikScatter() {
  const [tooltip, setTooltip] = useState(null);
  const W = 420, H = 260, ML = 38, MR = 12, MT = 12, MB = 38;
  const PW = W - ML - MR, PH = H - MT - MB;
  const XMIN = 0, XMAX = 65, YMIN = 3.8, YMAX = 8.2;
  const xS = d => ML + ((d - XMIN) / (XMAX - XMIN)) * PW;
  const yS = m => MT + ((YMAX - m) / (YMAX - YMIN)) * PH;
  const xTicks = [0, 10, 20, 30, 40, 50, 60];
  const yTicks = [4, 5, 6, 7, 8];

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {/* Tehlike bölgesi (sığ ve büyük) */}
        <rect x={xS(0)} y={yS(8.2)} width={xS(20) - xS(0)} height={yS(6) - yS(8.2)}
          fill="rgba(226,75,74,0.07)" />
        <text x={xS(5)} y={yS(7.5)} fontSize="9" fill="#E24B4A" opacity="0.7">en tehlikeli</text>

        {/* Izgara */}
        {xTicks.map(t => (
          <g key={t}>
            <line x1={xS(t)} y1={MT} x2={xS(t)} y2={H - MB} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={xS(t)} y={H - MB + 14} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{t}</text>
          </g>
        ))}
        {yTicks.map(t => (
          <g key={t}>
            <line x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={ML - 4} y={yS(t) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{t}</text>
          </g>
        ))}

        {/* Eksen etiketleri */}
        <text x={ML + PW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">Derinlik (km) →</text>
        <text x={10} y={MT + PH / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)"
          transform={`rotate(-90,10,${MT + PH / 2})`}>Büyüklük (M) →</text>

        {/* Noktalar */}
        {SCATTER.map((p, i) => {
          const renk = BOLGE_RENK[p.bolge] || '#9ca3af';
          const isHov = tooltip?.i === i;
          const r = 3 + (p.mag - 4) * 1.5;
          return (
            <circle key={i}
              cx={xS(p.depth)} cy={yS(p.mag)} r={isHov ? r + 2 : r}
              fill={renk} opacity={isHov ? 1 : 0.7}
              style={{ cursor: 'pointer', transition: 'r 0.1s' }}
              onMouseEnter={() => setTooltip({ i, p })}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'var(--color-cream-card)',
          border: `1.5px solid ${BOLGE_RENK[tooltip.p.bolge] || '#ccc'}`,
          borderRadius: '8px', padding: '8px 12px', fontSize: '12px',
          pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: '160px',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>{tooltip.p.isim}</div>
          <div style={{ color: 'var(--color-text-mute)', marginBottom: '4px' }}>{tooltip.p.bolge} · {tooltip.p.yil}</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: BOLGE_RENK[tooltip.p.bolge] }}>M {tooltip.p.mag}</span>
            <span style={{ color: 'var(--color-text-mute)' }}>Derinlik: {tooltip.p.depth} km</span>
          </div>
        </div>
      )}

      {/* Bölge legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {Object.entries(BOLGE_RENK).map(([bolge, renk]) => (
          <span key={bolge} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: renk, display: 'inline-block' }} />
            {bolge}
          </span>
        ))}
      </div>
    </div>
  );
}

function ZamanCizgisi() {
  const maxKayip = Math.max(...BUYUK_DEPREMLER.map(d => d.kayip));
  return (
    <div style={{ position: 'relative', paddingLeft: '24px' }}>
      {/* Dikey çizgi */}
      <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {BUYUK_DEPREMLER.map((d) => {
          const renk = BOLGE_RENK[d.bolge] || '#ccc';
          const buyukluk = d.kayip / maxKayip;
          return (
            <div key={d.isim} style={{ position: 'relative' }}>
              {/* Nokta */}
              <div style={{
                position: 'absolute', left: '-21px', top: '4px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: renk, border: '2px solid var(--color-cream-card)',
                boxSizing: 'border-box',
              }} />

              <div className="card" style={{ padding: '14px 18px', borderLeft: `4px solid ${renk}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: renk }}>M {d.mag}</span>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>{d.isim}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{d.yil} · {d.bolge}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: d.kayip > 1000 ? '#c0392b' : '#e8a04a' }}>
                      {d.kayip.toLocaleString('tr')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>can kaybı</div>
                  </div>
                </div>
                {/* Etki göstergesi */}
                <div style={{ marginTop: '10px', height: '5px', background: 'var(--color-cream)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${buyukluk * 100}%`, background: renk, borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function DepremAnalizi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        {/* Hero */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="badge badge-case">vaka çalışması</span>
            <span className="badge badge-guide">sismik veri</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>12 dakika</span>
          </div>
          <h1 className="font-serif font-medium mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.7rem)', color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Türkiye'nin sismik tarihi:<br />24 yıllık deprem verisi
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-text-soft)', lineHeight: 1.75, maxWidth: '600px', marginBottom: '1.5rem' }}>
            Türkiye, dünyanın en aktif sismik bölgelerinden birinin üzerinde.
            Kandilli Rasathanesi verilerinden bölge dağılımına, büyüklük dağılımından derinlik analizine —
            rakamlar ne söylüyor?
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(232,160,74,0.10)', border: '1px solid rgba(232,160,74,0.25)', fontSize: '12px', color: '#854F0B' }}>
            <span>⚠️</span>
            <span>Bu analizde kullanılan veriler, Kandilli Rasathanesi kayıtlarını yansıtacak şekilde oluşturulmuş temsili sentetik veridir.</span>
          </div>
        </div>

        {/* Özet istatistikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '3rem' }}>
          {[
            { sayi: '~20.000', label: 'yıllık deprem (M≥2)', renk: '#E24B4A' },
            { sayi: '48',      label: 'yıllık M5+ ortalama',  renk: '#e8a04a' },
            { sayi: 'M 7.8',   label: 'en büyük (2023)',      renk: '#c0392b' },
            { sayi: '2',       label: 'ana fay hattı',        renk: '#7F77DD' },
            { sayi: '%15',     label: 'dünya sismisitesi',    renk: '#1D9E75' },
          ].map(({ sayi, label, renk }) => (
            <div key={label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: renk, marginBottom: '4px' }}>{sayi}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Fay hatları bağlamı */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: '3rem', borderLeft: '4px solid #E24B4A' }}>
          <div className="font-serif font-medium mb-3" style={{ fontSize: '17px', color: 'var(--color-text)' }}>
            🗺️ İki fay hattı, bir ülke
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { isim: 'Kuzey Anadolu Fayı (KAF)', bolge: 'Marmara → Erzincan', uzunluk: '1.200 km', tehlike: 'İstanbul\'u tehdit ediyor', renk: '#e8a04a' },
              { isim: 'Doğu Anadolu Fayı (DAF)', bolge: 'Hatay → Karlıova', uzunluk: '550 km',   tehlike: '2023 felaketinin kaynağı', renk: '#E24B4A' },
            ].map(f => (
              <div key={f.isim} style={{ padding: '14px', borderRadius: '8px', background: `${f.renk}10`, border: `1px solid ${f.renk}30` }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: f.renk, marginBottom: '6px' }}>{f.isim}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-soft)', marginBottom: '4px' }}>📍 {f.bolge}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '4px' }}>📏 {f.uzunluk}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: f.renk }}>⚠️ {f.tehlike}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bölge dağılımı */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Bölge bazında deprem yoğunluğu
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Ege ve Marmara bölgeleri, Kuzey Anadolu Fayı'nın geçtiği hattı izliyor.
            Doğu Anadolu, 2023'te faturasını ağır ödedi. Karadeniz görece sakin.
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <BolgeBar />
          </div>
        </section>

        {/* Büyüklük dağılımı */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Büyüklük dağılımı ve Gutenberg-Richter
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Her büyüklük basamağı, bir öncekinin yaklaşık <strong style={{ color: 'var(--color-text)' }}>10 katı</strong> deprem sayısına karşılık gelir
            (Gutenberg-Richter yasası). Log ölçeğe geçince bu ilişki çarpıcı hale geliyor.
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <BuyuklukHistogram />
          </div>
        </section>

        {/* Yıllık trend */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            2000–2024: M5+ deprem trendi
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            2011 Van ve 2020 İzmir depremleri zirvede görünse de 2023 Kahramanmaraş (M7.8+M7.7 ikili)
            artçı sarsıntılarıyla yıllık sayıyı tamamen farklı bir boyuta taşıdı.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <YillikTrend />
          </div>
        </section>

        {/* Derinlik scatter */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Derinlik ve büyüklük ilişkisi
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Türkiye depremleri çoğunlukla <strong style={{ color: 'var(--color-text)' }}>sığ (0-30 km)</strong>.
            Bu hem iyi hem kötü: enerji yüzeye yakın salınıyor, yıkıcılık artıyor.
            Sol üst köşe (sığ + büyük) en tehlikeli bölge.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <DerinlikScatter />
          </div>
        </section>

        {/* Büyük depremler */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-4" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Türkiye'nin en yıkıcı depremleri
          </h2>
          <ZamanCizgisi />
        </section>

        {/* Bulgular */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-4" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            4 temel bulgu
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { n: '01', renk: '#E24B4A', emoji: '📉',
                baslik: 'Gutenberg-Richter her zaman geçerli',
                metin: 'Türkiye, küresel yasadan sapma göstermiyor: büyüklük artışı, sıklığı logaritmik olarak düşürüyor. M7\'den M8\'e geçiş, frekansı ~10 kat azaltıyor.' },
              { n: '02', renk: '#c0392b', emoji: '⬇️',
                baslik: 'Sığ depremler daha yıkıcı',
                metin: '0-20 km derinlikteki depremler, aynı büyüklükteki derin depremlere göre çok daha fazla hasar bırakıyor. KAF ve DAF üzerindeki depremler bu kategoride.' },
              { n: '03', renk: '#e8a04a', emoji: '🏙️',
                baslik: 'İstanbul için saat işliyor',
                metin: 'Sismologlar, Marmara altında biriken enerjiyi yaklaşık M7+ potansiyele sahip olarak değerlendiriyor. Son büyük Marmara depremi 1999\'da oldu.' },
              { n: '04', renk: '#7F77DD', emoji: '📊',
                baslik: 'Veri analizinin sınırları',
                metin: 'Deprem tahmini henüz mümkün değil — sadece olasılık haritaları yapılabiliyor. Yapı kalitesi ve kentsel planlama, kayıpları belirleyen asıl faktörler.' },
            ].map(({ n, renk, emoji, baslik, metin }) => (
              <div key={n} className="card" style={{ padding: '18px 20px', display: 'flex', gap: '16px', borderLeft: `4px solid ${renk}` }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: renk, fontFamily: 'var(--font-mono)', paddingTop: '2px', flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span>{emoji}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>{baslik}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.65, margin: 0 }}>{metin}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Veri notu */}
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', marginBottom: '2rem', fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--color-text-soft)' }}>📌 Veri notu:</strong> Analizde kullanılan rakamlar,
          Kandilli Rasathanesi ve AFAD kayıtlarına dayanan temsili sentetik veridir.
          Gerçek analiz için <strong>Kandilli BDTIM kataloğu</strong> ve <strong>USGS Earthquake Hazards Program</strong> API'leri kullanılabilir.
        </div>

        {/* İlgili */}
        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-mute)', marginBottom: '12px' }}>Devam et</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/yazilar/izmir-kira-analizi', label: '🏠 İzmir Kira Analizi' },
              { href: '/yazilar/anscombe',           label: '📊 Anscombe Dörtlüsü' },
              { href: '/yazilar/merkezi-limit-teoremi', label: '📈 Merkezi Limit Teoremi' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-soft)', textDecoration: 'none',
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
