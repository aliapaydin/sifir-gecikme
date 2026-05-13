'use client';
import { useState } from 'react';

// ── Renk & Etiket ─────────────────────────────────────────────
const TUR_META = {
  pop:     { label: 'Türk Pop',   renk: '#1D9E75', bg: 'rgba(29,158,117,0.10)' },
  rap:     { label: 'Türk Rap',   renk: '#7F77DD', bg: 'rgba(127,119,221,0.10)' },
  arabesk: { label: 'Arabesk',    renk: '#e8a04a', bg: 'rgba(232,160,74,0.10)' },
  indie:   { label: 'Indie/Alt',  renk: '#E24B4A', bg: 'rgba(226,75,74,0.10)' },
  rock:    { label: 'Türk Rock',  renk: '#4a90d9', bg: 'rgba(74,144,217,0.10)' },
};

// ── Veri ──────────────────────────────────────────────────────
const TURLER = [
  { id: 'pop',     yuzde: 34 },
  { id: 'rap',     yuzde: 28 },
  { id: 'arabesk', yuzde: 14 },
  { id: 'indie',   yuzde: 11 },
  { id: 'rock',    yuzde:  8 },
  { id: 'diger',   yuzde:  5, label: 'Diğer', renk: '#9ca3af', bg: 'rgba(156,163,175,0.10)' },
];

const SANATCILAR = [
  { isim: 'Tarkan',          dinleyici: 8.2, tur: 'pop' },
  { isim: 'Ceza',            dinleyici: 7.1, tur: 'rap' },
  { isim: 'Sezen Aksu',      dinleyici: 6.8, tur: 'pop' },
  { isim: 'Jakuzi',          dinleyici: 5.9, tur: 'indie' },
  { isim: 'Murda',           dinleyici: 5.7, tur: 'rap' },
  { isim: 'Ben Fero',        dinleyici: 5.4, tur: 'rap' },
  { isim: 'Şebnem Ferah',    dinleyici: 4.9, tur: 'rock' },
  { isim: 'Hadise',          dinleyici: 4.8, tur: 'pop' },
  { isim: 'Müslüm Gürses',   dinleyici: 4.5, tur: 'arabesk' },
  { isim: 'Mabel Matiz',     dinleyici: 4.3, tur: 'indie' },
];

const PARCALAR = [
  { baslik: 'Şımarık',         sanatci: 'Tarkan',                 tur: 'pop',     energy: 0.71, dance: 0.78 },
  { baslik: 'Değmesin',        sanatci: 'Sezen Aksu',             tur: 'pop',     energy: 0.55, dance: 0.62 },
  { baslik: 'Stres',           sanatci: 'Hadise',                 tur: 'pop',     energy: 0.76, dance: 0.82 },
  { baslik: 'Deli',            sanatci: 'Tarkan',                 tur: 'pop',     energy: 0.68, dance: 0.75 },
  { baslik: 'Fırtına',         sanatci: 'Murat Boz',              tur: 'pop',     energy: 0.72, dance: 0.70 },
  { baslik: 'Hayatımın Anlamı',sanatci: 'Sertab Erener',          tur: 'pop',     energy: 0.60, dance: 0.67 },
  { baslik: 'Yerli Plaka',     sanatci: 'Ceza',                   tur: 'rap',     energy: 0.87, dance: 0.62 },
  { baslik: 'Kapital',         sanatci: 'Ben Fero',               tur: 'rap',     energy: 0.82, dance: 0.58 },
  { baslik: 'Gioia',           sanatci: 'Murda',                  tur: 'rap',     energy: 0.78, dance: 0.65 },
  { baslik: 'Kurtlar',         sanatci: 'Sagopa Kajmer',          tur: 'rap',     energy: 0.74, dance: 0.52 },
  { baslik: 'Eyvallah',        sanatci: 'Server Uraz',            tur: 'rap',     energy: 0.80, dance: 0.60 },
  { baslik: 'Sürgün',          sanatci: 'Müslüm Gürses',         tur: 'arabesk', energy: 0.38, dance: 0.32 },
  { baslik: 'Bir Teselli Ver', sanatci: 'İbrahim Tatlıses',       tur: 'arabesk', energy: 0.42, dance: 0.36 },
  { baslik: 'Dağlar Kızı',     sanatci: 'Orhan Gencebay',        tur: 'arabesk', energy: 0.35, dance: 0.30 },
  { baslik: 'Hüznüm',          sanatci: 'Ferdi Tayfur',           tur: 'arabesk', energy: 0.40, dance: 0.28 },
  { baslik: 'Kıyı',            sanatci: 'Jakuzi',                 tur: 'indie',   energy: 0.55, dance: 0.48 },
  { baslik: 'Geç Kaldım',      sanatci: 'Mabel Matiz',            tur: 'indie',   energy: 0.52, dance: 0.50 },
  { baslik: 'Gözlerin',        sanatci: 'Yüzyüzeyken Konuşuruz', tur: 'indie',   energy: 0.58, dance: 0.55 },
  { baslik: 'Özgürlük',        sanatci: 'Şebnem Ferah',           tur: 'rock',    energy: 0.83, dance: 0.44 },
  { baslik: 'Gitar',           sanatci: 'Mor ve Ötesi',           tur: 'rock',    energy: 0.79, dance: 0.42 },
  { baslik: 'Neden Sonra',     sanatci: 'Duman',                  tur: 'rock',    energy: 0.75, dance: 0.40 },
];

const AYLIK = [
  { ay: 'Oca', pop: 92,  rap: 88,  arabesk: 102 },
  { ay: 'Şub', pop: 90,  rap: 92,  arabesk: 100 },
  { ay: 'Mar', pop: 98,  rap: 100, arabesk:  98 },
  { ay: 'Nis', pop: 108, rap: 105, arabesk:  94 },
  { ay: 'May', pop: 120, rap: 118, arabesk:  90 },
  { ay: 'Haz', pop: 148, rap: 125, arabesk:  85 },
  { ay: 'Tem', pop: 165, rap: 135, arabesk:  82 },
  { ay: 'Ağu', pop: 158, rap: 130, arabesk:  85 },
  { ay: 'Eyl', pop: 125, rap: 120, arabesk:  92 },
  { ay: 'Eki', pop: 112, rap: 118, arabesk:  98 },
  { ay: 'Kas', pop: 102, rap: 112, arabesk: 108 },
  { ay: 'Ara', pop: 110, rap: 108, arabesk: 125 },
];

// 24 saatlik relatif indeks (max=100)
const SAATLIK = [
  12, 8, 5, 4, 5, 10, 22, 42,
  60, 70, 74, 77, 80, 82, 78, 74,
  76, 84, 91, 100, 108, 112, 102, 85,
];

// ── Grafik Bileşenleri ────────────────────────────────────────

function TurLegend({ aktif, setAktif }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {TURLER.map(t => {
        const meta = TUR_META[t.id] || { label: t.label, renk: t.renk, bg: t.bg };
        const secili = aktif === null || aktif === t.id;
        return (
          <button key={t.id}
            onClick={() => setAktif(aktif === t.id ? null : t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 10px', borderRadius: '999px', fontSize: '12px',
              border: `1.5px solid ${secili ? meta.renk : 'var(--color-border)'}`,
              background: secili ? meta.bg : 'transparent',
              color: secili ? meta.renk : 'var(--color-text-mute)',
              cursor: 'pointer', fontWeight: secili ? 500 : 400,
              transition: 'all 0.15s',
            }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.renk, flexShrink: 0 }} />
            {meta.label} · %{t.yuzde}
          </button>
        );
      })}
    </div>
  );
}

// Donut chart
function DonutChart({ aktif }) {
  const R = 68, CX = 90, CY = 90;
  const cevre = 2 * Math.PI * R;
  let offset = 0;
  const dilimler = TURLER.map(t => {
    const meta = TUR_META[t.id] || { renk: t.renk };
    const uzunluk = (t.yuzde / 100) * cevre;
    const dilim = { ...t, uzunluk, offset, renk: meta.renk };
    offset += uzunluk;
    return dilim;
  });

  return (
    <svg viewBox="0 0 180 180" style={{ width: '100%', maxWidth: '180px' }}>
      {dilimler.map(d => {
        const vurgu = aktif === null || aktif === d.id;
        return (
          <circle key={d.id}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={d.renk}
            strokeWidth={vurgu ? 26 : 20}
            strokeDasharray={`${d.uzunluk} ${cevre - d.uzunluk}`}
            strokeDashoffset={-d.offset}
            opacity={vurgu ? 1 : 0.2}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'all 0.25s' }}
          />
        );
      })}
      <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="700"
        fill="var(--color-text)">
        {aktif ? `%${TURLER.find(t => t.id === aktif)?.yuzde}` : '6'}
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="10"
        fill="var(--color-text-mute)">
        {aktif ? (TUR_META[aktif]?.label || aktif) : 'tür'}
      </text>
    </svg>
  );
}

// Yatay bar chart — top sanatçılar
function SanatciBar({ aktif }) {
  const [hover, setHover] = useState(null);
  const max = SANATCILAR[0].dinleyici;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {SANATCILAR.map((s, i) => {
        const meta = TUR_META[s.tur];
        const vurgu = aktif === null || aktif === s.tur;
        const isHover = hover === i;
        return (
          <div key={s.isim}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: vurgu ? 1 : 0.25, transition: 'opacity 0.2s' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', width: '16px', textAlign: 'right', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text)', width: '120px', flexShrink: 0, fontWeight: isHover ? 500 : 400 }}>
              {s.isim}
            </div>
            <div style={{ flex: 1, height: '20px', background: 'var(--color-cream)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: `${(s.dinleyici / max) * 100}%`,
                background: meta?.renk || '#9ca3af',
                borderRadius: '4px',
                opacity: isHover ? 1 : 0.75,
                transition: 'width 0.6s ease, opacity 0.15s',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', width: '44px', textAlign: 'right', flexShrink: 0 }}>
              {s.dinleyici}M
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Scatter — energy vs danceability
function ScatterChart({ aktif }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 380, H = 260, ML = 38, MR = 12, MT = 12, MB = 36;
  const PW = W - ML - MR, PH = H - MT - MB;
  const xS = d => ML + d * PW;
  const yS = e => MT + (1 - e) * PH;
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {/* Izgara */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={xS(t)} y1={MT} x2={xS(t)} y2={H - MB} stroke="var(--color-border)" strokeWidth="0.5" />
            <line x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={xS(t)} y={H - MB + 14} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{t.toFixed(1)}</text>
            <text x={ML - 4} y={yS(t) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{t.toFixed(1)}</text>
          </g>
        ))}
        {/* Eksen etiketleri */}
        <text x={ML + PW / 2} y={H - 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">Dans Edilebilirlik →</text>
        <text x={10} y={MT + PH / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-mute)"
          transform={`rotate(-90, 10, ${MT + PH / 2})`}>Enerji →</text>

        {/* Noktalar */}
        {PARCALAR.map((p, i) => {
          const meta = TUR_META[p.tur];
          const vurgu = aktif === null || aktif === p.tur;
          const isHover = tooltip?.i === i;
          return (
            <circle key={i}
              cx={xS(p.dance)} cy={yS(p.energy)} r={isHover ? 7 : 5}
              fill={meta?.renk || '#9ca3af'}
              opacity={vurgu ? (isHover ? 1 : 0.75) : 0.1}
              style={{ cursor: 'pointer', transition: 'r 0.1s, opacity 0.2s' }}
              onMouseEnter={() => setTooltip({ i, p, x: xS(p.dance), y: yS(p.energy) })}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* Cluster etiketleri */}
        {aktif === null && (
          <>
            <text x={xS(0.73)} y={yS(0.55) - 14} textAnchor="middle" fontSize="9"
              fill={TUR_META.pop.renk} fontWeight="600">Türk Pop</text>
            <text x={xS(0.59)} y={yS(0.80) - 10} textAnchor="middle" fontSize="9"
              fill={TUR_META.rap.renk} fontWeight="600">Rap</text>
            <text x={xS(0.32)} y={yS(0.40) + 14} textAnchor="middle" fontSize="9"
              fill={TUR_META.arabesk.renk} fontWeight="600">Arabesk</text>
            <text x={xS(0.48)} y={yS(0.43) - 10} textAnchor="middle" fontSize="9"
              fill={TUR_META.indie.renk} fontWeight="600">Indie</text>
            <text x={xS(0.42)} y={yS(0.82) - 10} textAnchor="middle" fontSize="9"
              fill={TUR_META.rock.renk} fontWeight="600">Rock</text>
          </>
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: `${(tooltip.x / W) * 100}%`,
          top: `${(tooltip.y / H) * 100}%`,
          transform: 'translate(10px, -50%)',
          background: 'var(--color-cream-card)',
          border: `1.5px solid ${TUR_META[tooltip.p.tur]?.renk || '#ccc'}`,
          borderRadius: '8px', padding: '8px 12px',
          fontSize: '12px', pointerEvents: 'none',
          zIndex: 10, whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>
            {tooltip.p.baslik}
          </div>
          <div style={{ color: 'var(--color-text-mute)', marginBottom: '4px' }}>{tooltip.p.sanatci}</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: TUR_META[tooltip.p.tur]?.renk }}>Enerji: {tooltip.p.energy.toFixed(2)}</span>
            <span style={{ color: TUR_META[tooltip.p.tur]?.renk }}>Dans: {tooltip.p.dance.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Aylık trend line chart
function AylikTrend() {
  const [goster, setGoster] = useState({ pop: true, rap: true, arabesk: true });
  const W = 520, H = 200, ML = 42, MR = 12, MT = 12, MB = 30;
  const PW = W - ML - MR, PH = H - MT - MB;
  const YMIN = 70, YMAX = 180;
  const xS = i => ML + (i / 11) * PW;
  const yS = v => MT + ((YMAX - v) / (YMAX - YMIN)) * PH;

  const seriler = [
    { key: 'pop',     renk: TUR_META.pop.renk,     label: 'Türk Pop' },
    { key: 'rap',     renk: TUR_META.rap.renk,     label: 'Türk Rap' },
    { key: 'arabesk', renk: TUR_META.arabesk.renk, label: 'Arabesk' },
  ];

  const path = (key) => AYLIK.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(d[key]).toFixed(1)}`
  ).join(' ');

  const yTicks = [80, 100, 120, 140, 160];

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {seriler.map(s => (
          <button key={s.key}
            onClick={() => setGoster(g => ({ ...g, [s.key]: !g[s.key] }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '999px', fontSize: '12px', cursor: 'pointer',
              border: `1.5px solid ${goster[s.key] ? s.renk : 'var(--color-border)'}`,
              background: goster[s.key] ? `${s.renk}15` : 'transparent',
              color: goster[s.key] ? s.renk : 'var(--color-text-mute)',
              fontWeight: goster[s.key] ? 500 : 400, transition: 'all 0.15s',
            }}>
            <span style={{ width: 20, height: 2, background: goster[s.key] ? s.renk : 'var(--color-border)', borderRadius: 2, display: 'inline-block' }} />
            {s.label}
          </button>
        ))}
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {/* Izgara */}
        {yTicks.map(t => (
          <g key={t}>
            <line x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={ML - 4} y={yS(t) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{t}</text>
          </g>
        ))}
        {/* Ay etiketleri */}
        {AYLIK.map((d, i) => (
          <text key={i} x={xS(i)} y={H - MB + 14} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">
            {d.ay}
          </text>
        ))}

        {/* Yaz vurgusu */}
        <rect x={xS(5)} y={MT} width={xS(7) - xS(5)} height={PH}
          fill="rgba(255,200,0,0.05)" />
        <text x={(xS(5) + xS(7)) / 2} y={MT + 10} textAnchor="middle" fontSize="8"
          fill="#e8a04a" opacity="0.7">☀️ yaz</text>

        {/* Hatlar */}
        {seriler.map(s => goster[s.key] && (
          <g key={s.key}>
            <path d={path(s.key)} fill="none" stroke={s.renk} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" />
            {AYLIK.map((d, i) => (
              <circle key={i} cx={xS(i)} cy={yS(d[s.key])} r="3" fill={s.renk} />
            ))}
          </g>
        ))}

        {/* Aralık vurgusu (arabesk zirve) */}
        {goster.arabesk && (
          <text x={xS(11)} y={yS(125) - 8} textAnchor="middle" fontSize="8"
            fill={TUR_META.arabesk.renk} fontWeight="600">zirve</text>
        )}
      </svg>
    </div>
  );
}

// 24 saatlik bar chart
function SaatChart() {
  const [hover, setHover] = useState(null);
  const W = 520, H = 120, ML = 10, MR = 10, MT = 8, MB = 22;
  const PW = W - ML - MR, PH = H - MT - MB;
  const n = 24;
  const barW = PW / n;
  const max = Math.max(...SAATLIK);
  const saatRenk = (s) => {
    if (s >= 6 && s < 9) return '#e8a04a';   // sabah
    if (s >= 9 && s < 18) return '#1D9E75';  // gündüz
    if (s >= 18 && s < 22) return '#7F77DD'; // akşam
    return '#E24B4A';                          // gece
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '12px' }}>
        {[
          { renk: '#E24B4A', label: 'Gece (22-06)' },
          { renk: '#e8a04a', label: 'Sabah (06-09)' },
          { renk: '#1D9E75', label: 'Gündüz (09-18)' },
          { renk: '#7F77DD', label: 'Akşam (18-22)' },
        ].map(({ renk, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-mute)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: renk, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {SAATLIK.map((v, i) => {
          const bH = (v / max) * PH;
          const x = ML + i * barW;
          const isHov = hover === i;
          return (
            <g key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'default' }}>
              <rect
                x={x + 1} y={MT + PH - bH}
                width={barW - 2} height={bH}
                rx="2"
                fill={saatRenk(i)}
                opacity={isHov ? 1 : 0.65}
              />
              {(i % 3 === 0 || isHov) && (
                <text x={x + barW / 2} y={H - 6} textAnchor="middle"
                  fontSize={isHov ? 9 : 8} fill={isHov ? saatRenk(i) : 'var(--color-text-mute)'}
                  fontWeight={isHov ? 600 : 400}>
                  {i.toString().padStart(2, '0')}
                </text>
              )}
              {isHov && (
                <text x={x + barW / 2} y={MT + PH - bH - 5} textAnchor="middle"
                  fontSize="9" fill={saatRenk(i)} fontWeight="600">
                  {v}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Ses Özellikleri Karşılaştırma ──────────────────────────────
const TUR_OZELLIKLER = [
  { tur: 'pop',     energy: 0.67, dance: 0.73, valence: 0.66, tempo: 0.74 },
  { tur: 'rap',     energy: 0.80, dance: 0.60, valence: 0.44, tempo: 0.62 },
  { tur: 'arabesk', energy: 0.40, dance: 0.33, valence: 0.30, tempo: 0.42 },
  { tur: 'indie',   energy: 0.55, dance: 0.51, valence: 0.53, tempo: 0.58 },
  { tur: 'rock',    energy: 0.81, dance: 0.42, valence: 0.48, tempo: 0.72 },
];

const OZELLIK_LABEL = { energy: 'Enerji', dance: 'Dans', valence: 'Mutluluk', tempo: 'Tempo' };

function OzellikCubugu({ deger, renk, max = 1 }) {
  return (
    <div style={{ flex: 1, height: '6px', background: 'var(--color-cream)', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(deger / max) * 100}%`, background: renk, borderRadius: '999px', transition: 'width 0.5s ease' }} />
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function SpotifyTurkiye() {
  const [aktif, setAktif] = useState(null);

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        {/* Hero */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="badge badge-case">vaka çalışması</span>
            <span className="badge badge-guide">müzik verisi</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>12 dakika</span>
          </div>
          <h1 className="font-serif font-medium mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.7rem)', color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Spotify Türkiye:<br />82 milyon kulak, ne dinliyor?
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-text-soft)', lineHeight: 1.75, maxWidth: '600px', marginBottom: '1.5rem' }}>
            Tür dağılımından ses özelliklerine, gece yarısı arabesk zirvelemesinden yaz pop patlamasına —
            Spotify Türkiye verisinde ne var?
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(232,160,74,0.10)', border: '1px solid rgba(232,160,74,0.25)', fontSize: '12px', color: '#854F0B' }}>
            <span>⚠️</span>
            <span>Bu analizde kullanılan veriler, gerçek Spotify verisini yansıtacak şekilde oluşturulmuş temsili sentetik veridir.</span>
          </div>
        </div>

        {/* Özet istatistikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '3rem' }}>
          {[
            { sayi: '82M',   label: 'aylık aktif kullanıcı', renk: '#1D9E75' },
            { sayi: '%34',   label: 'Türk Pop payı',         renk: '#1D9E75' },
            { sayi: '%180',  label: 'rap büyümesi (4 yıl)',   renk: '#7F77DD' },
            { sayi: '22:00', label: "en yoğun saat",         renk: '#E24B4A' },
            { sayi: '+%34',  label: 'yaz artışı',            renk: '#e8a04a' },
          ].map(({ sayi, label, renk }) => (
            <div key={label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 600, color: renk, marginBottom: '4px' }}>{sayi}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filtre */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Türe göre filtrele
          </div>
          <TurLegend aktif={aktif} setAktif={setAktif} />
        </div>

        {/* Tür Dağılımı */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Tür dağılımı
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Türk Pop hâlâ dominant (%34) ama Türk Rap son 4 yılda %180 büyüyerek
            güçlü ikinci konuma geldi. Arabesk kalıcı — özellikle kış aylarında ve gece vakti.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <DonutChart aktif={aktif} />
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TURLER.map(t => {
                const meta = TUR_META[t.id] || { label: t.label, renk: t.renk };
                const vurgu = aktif === null || aktif === t.id;
                return (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: vurgu ? 1 : 0.25, transition: 'opacity 0.2s' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.renk, flexShrink: 0 }} />
                    <div style={{ fontSize: '13px', color: 'var(--color-text)', flex: 1 }}>{meta.label}</div>
                    <div style={{ width: '120px' }}>
                      <div style={{ height: '6px', background: 'var(--color-cream)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${t.yuzde * 2.94}%`, background: meta.renk, borderRadius: '999px' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: meta.renk, width: '30px', textAlign: 'right' }}>%{t.yuzde}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Sanatçılar */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Top 10 sanatçı
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Aylık tekil dinleyici sayısına göre. Tarkan hâlâ zirvede — "Şımarık" her yaz yeniden ölümsüzleşiyor.
            Ceza ise rap kategorisinde tartışmasız lider.
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <SanatciBar aktif={aktif} />
          </div>
        </section>

        {/* Scatter */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Enerji vs dans edilebilirlik
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Spotify her şarkıyı 0-1 arasında puanlar. Türk Pop sağ üst köşede — hem enerjik hem dans edilebilir.
            Arabesk sol alt köşede — düşük enerji, düşük dans. Rock yüksek enerjili ama dans edilebilirliği düşük.
            Noktaların üzerine gel, şarkı detaylarını gör.
          </p>
          <div className="card" style={{ padding: '16px' }}>
            <ScatterChart aktif={aktif} />
          </div>
        </section>

        {/* Ses Özellikleri Tablosu */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Türe göre ses özellikleri
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Her türün ses "parmak izi" farklı. Rap yüksek enerji ama düşük mutluluk skoru.
            Arabesk her metrikte en düşük — keder bu türün özünde.
          </p>
          <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {TUR_OZELLIKLER.map(t => {
              const meta = TUR_META[t.tur];
              const vurgu = aktif === null || aktif === t.tur;
              return (
                <div key={t.tur} style={{ opacity: vurgu ? 1 : 0.2, transition: 'opacity 0.2s' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: meta.renk, marginBottom: '8px' }}>
                    {meta.label}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {Object.entries(OZELLIK_LABEL).map(([key, label]) => (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{label}</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: meta.renk }}>{t[key].toFixed(2)}</span>
                        </div>
                        <OzellikCubugu deger={t[key]} renk={meta.renk} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Aylık trend */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Aylık dinleme trendi
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            İndeks: Ocak = 100. Yaz aylarında Türk Pop patlıyor (+%80).
            Arabesk tam tersi — yaz tatilinde düşüyor, Aralık ayında zirveye çıkıyor.
            Türk Rap yıl boyunca daha stabil ama yaz zirvesi var.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <AylikTrend />
          </div>
        </section>

        {/* 24h ritim */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Günlük ritim
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Günün en yoğun saati gece 22:00. Gece yarısı dinleme de beklenenden çok yüksek.
            Sabah 6-9 arası işe/okula gidiş saatleri — küçük ama belirgin bir tepe.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <SaatChart />
          </div>
        </section>

        {/* Bulgular */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-4" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            5 önemli bulgu
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { n: '01', renk: TUR_META.rap.renk,     emoji: '📈',
                baslik: 'Rap yükselişi durmuyor',
                metin: 'Türk Rap 2020-2024 arasında %180 büyüdü. 18-24 yaş segmentinde artık birinci tür. Ceza, Ben Fero ve Murda bu dönüşümün öncüleri.' },
              { n: '02', renk: TUR_META.arabesk.renk,  emoji: '🌙',
                baslik: 'Arabesk gece canlı',
                metin: 'Arabesk gece 00:00-03:00 arasında diğer türlere kıyasla %60 daha fazla dinleniyor. Duygusal kriz vakitlerinde tercih edilen tür.' },
              { n: '03', renk: TUR_META.pop.renk,      emoji: '☀️',
                baslik: 'Yaz = Türk Pop zamanı',
                metin: 'Temmuz ayında Türk Pop, yıl ortalamasının %65 üzerine çıkıyor. Deniz kenarı, tatil, festival — pop bu dönemi domine ediyor.' },
              { n: '04', renk: TUR_META.rock.renk,     emoji: '🎸',
                baslik: 'Rock yüksek enerjili ama nişlendi',
                metin: 'Türk Rock en yüksek enerji skoruna sahip (0.81) ama dans edilebilirliği düşük. 30+ yaş segmentinde güçlü, genel yayınımda azalıyor.' },
              { n: '05', renk: '#4a90d9',               emoji: '📱',
                baslik: '22:00 — kritik saat',
                metin: 'Akşam 22:00, Spotify Türkiye için gün içi doruk noktası. Bu saatte kullanıcılar ortalama %40 daha uzun dinliyor. İçerik keşfi bu saatte en yüksek.' },
            ].map(({ n, renk, emoji, baslik, metin }) => (
              <div key={n} className="card" style={{ padding: '18px 20px', display: 'flex', gap: '16px', borderLeft: `4px solid ${renk}` }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: renk, fontFamily: 'var(--font-mono)', paddingTop: '2px', flexShrink: 0 }}>
                  {n}
                </div>
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
          <strong style={{ color: 'var(--color-text-soft)' }}>📌 Veri notu:</strong> Bu analizde kullanılan rakamlar ve trendler,
          Spotify Türkiye kullanım kalıplarını yansıtacak şekilde tasarlanmış temsili sentetik veridir.
          Gerçek bir Spotify analizi için Spotify for Developers API'si ve Last.fm veritabanı kullanılabilir.
        </div>

        {/* İlgili */}
        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-mute)', marginBottom: '12px' }}>
            Devam et
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/yazilar/izmir-kira-analizi', label: '🏠 İzmir Kira Analizi' },
              { href: '/yazilar/superlig-xg',        label: '⚽ Süper Lig xG' },
              { href: '/yazilar/kmeans',             label: '🔵 K-Means: Müşteri Kümeleme' },
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
