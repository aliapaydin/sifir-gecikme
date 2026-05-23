'use client';
import { useState } from 'react';

// ── Platform meta ──────────────────────────────────────────────
const PLATFORM = {
  instagram: { label: 'Instagram', renk: '#E1306C', bg: 'rgba(225,48,108,0.10)', emoji: '📸' },
  youtube:   { label: 'YouTube',   renk: '#FF0000', bg: 'rgba(255,0,0,0.10)',     emoji: '▶️' },
  tiktok:    { label: 'TikTok',    renk: '#69C9D0', bg: 'rgba(105,201,208,0.10)', emoji: '🎵' },
  twitter:   { label: 'X / Twitter', renk: '#1D9E75', bg: 'rgba(29,158,117,0.10)', emoji: '𝕏' },
  facebook:  { label: 'Facebook',  renk: '#1877F2', bg: 'rgba(24,119,242,0.10)',   emoji: '👤' },
  linkedin:  { label: 'LinkedIn',  renk: '#7F77DD', bg: 'rgba(127,119,221,0.10)',  emoji: '💼' },
};

// ── Veri ──────────────────────────────────────────────────────
const KULLANIM_ORANLARI = [
  { id: 'youtube',   yuzde: 85 },
  { id: 'instagram', yuzde: 78 },
  { id: 'facebook',  yuzde: 62 },
  { id: 'tiktok',    yuzde: 54 },
  { id: 'twitter',   yuzde: 40 },
  { id: 'linkedin',  yuzde: 26 },
];

const YAS_GRUPLARI = [
  {
    grup: '18–24',
    sira: ['tiktok', 'instagram', 'youtube', 'twitter', 'facebook', 'linkedin'],
    degerler: { tiktok: 82, instagram: 91, youtube: 88, twitter: 44, facebook: 28, linkedin: 18 },
  },
  {
    grup: '25–34',
    sira: ['instagram', 'youtube', 'twitter', 'tiktok', 'facebook', 'linkedin'],
    degerler: { instagram: 86, youtube: 84, twitter: 52, tiktok: 61, facebook: 55, linkedin: 38 },
  },
  {
    grup: '35–44',
    sira: ['facebook', 'youtube', 'instagram', 'twitter', 'tiktok', 'linkedin'],
    degerler: { facebook: 74, youtube: 80, instagram: 68, twitter: 38, tiktok: 34, linkedin: 32 },
  },
  {
    grup: '45+',
    sira: ['facebook', 'youtube', 'instagram', 'twitter', 'tiktok', 'linkedin'],
    degerler: { facebook: 82, youtube: 75, instagram: 48, twitter: 28, tiktok: 18, linkedin: 20 },
  },
];

// 24 saatlik aktivite indeksi (0-100 arası, platforma göre)
const SAATLIK = {
  instagram: [18, 12,  7,  5,  6, 14, 28, 52, 66, 72, 75, 78, 82, 80, 76, 74, 80, 90,100, 98, 88, 76, 58, 35],
  youtube:   [22, 16, 10,  7,  8, 12, 22, 38, 50, 58, 62, 65, 70, 74, 76, 78, 84, 92, 98,100, 95, 84, 68, 44],
  tiktok:    [30, 22, 14, 10, 10, 16, 24, 44, 58, 64, 68, 72, 76, 74, 72, 74, 80, 88, 96,100, 94, 86, 72, 50],
  twitter:   [28, 18, 12,  8, 10, 20, 46, 72, 84, 82, 80, 78, 80, 78, 74, 72, 76, 80, 88, 96,100, 90, 72, 46],
  facebook:  [20, 14,  8,  6,  8, 14, 24, 42, 58, 64, 68, 72, 78, 80, 78, 76, 80, 86, 94,100, 92, 80, 62, 38],
  linkedin:  [ 6,  4,  2,  2,  4, 10, 28, 62, 82, 88, 90,100, 96, 92, 88, 86, 80, 70, 56, 44, 30, 20, 12,  8],
};

const HAFTALIK = [
  { gun: 'Pzt', deger: 84 },
  { gun: 'Sal', deger: 82 },
  { gun: 'Çar', deger: 85 },
  { gun: 'Per', deger: 86 },
  { gun: 'Cum', deger: 94 },
  { gun: 'Cmt', deger: 100 },
  { gun: 'Paz', deger: 98 },
];

const ICERIK_TURLERI = [
  { id: 'video',    label: 'Video',         yuzde: 52, renk: '#FF0000' },
  { id: 'reels',    label: 'Reels / TikTok',yuzde: 22, renk: '#E1306C' },
  { id: 'foto',     label: 'Fotoğraf',       yuzde: 14, renk: '#7F77DD' },
  { id: 'haber',    label: 'Haber / Metin',  yuzde:  8, renk: '#1D9E75' },
  { id: 'canli',    label: 'Canlı Yayın',    yuzde:  4, renk: '#e8a04a' },
];

// ── Yardımcı ──────────────────────────────────────────────────
function Cubuk({ deger, renk, max = 100, yukseklik = 8 }) {
  return (
    <div style={{ flex: 1, height: `${yukseklik}px`, background: 'var(--color-cream)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(deger / max) * 100}%`, background: renk, borderRadius: 999, transition: 'width 0.5s ease' }} />
    </div>
  );
}

// ── Platform Legend ────────────────────────────────────────────
function PlatformLegend({ aktif, setAktif }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {Object.entries(PLATFORM).map(([id, p]) => {
        const secili = aktif === null || aktif === id;
        return (
          <button key={id}
            onClick={() => setAktif(aktif === id ? null : id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 11px', borderRadius: 999, fontSize: '12px',
              border: `1.5px solid ${secili ? p.renk : 'var(--color-border)'}`,
              background: secili ? p.bg : 'transparent',
              color: secili ? p.renk : 'var(--color-text-mute)',
              cursor: 'pointer', fontWeight: secili ? 500 : 400,
              transition: 'all 0.15s',
            }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.renk, flexShrink: 0 }} />
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Platform Kullanım Bar ──────────────────────────────────────
function KullanimBar({ aktif }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {KULLANIM_ORANLARI.map((k, i) => {
        const p = PLATFORM[k.id];
        const vurgu = aktif === null || aktif === k.id;
        const isHov = hover === i;
        return (
          <div key={k.id}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: vurgu ? 1 : 0.2, transition: 'opacity 0.2s' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text)', width: '110px', flexShrink: 0, fontWeight: isHov ? 600 : 400 }}>
              {p.emoji} {p.label}
            </div>
            <div style={{ flex: 1, height: '24px', background: 'var(--color-cream)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${k.yuzde}%`,
                background: p.renk,
                borderRadius: '6px',
                opacity: isHov ? 1 : 0.75,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: p.renk, width: '36px', textAlign: 'right' }}>
              %{k.yuzde}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 24h Saat Grafik ───────────────────────────────────────────
function SaatGrafik({ aktif }) {
  const [hover, setHover] = useState(null);
  const W = 540, H = 180, ML = 8, MR = 8, MT = 12, MB = 26;
  const PW = W - ML - MR, PH = H - MT - MB;
  const n = 24;
  const barW = PW / n;

  const aktifPlatformlar = aktif ? [aktif] : Object.keys(PLATFORM);

  const saatRenk = (s) => {
    if (s >= 6 && s < 9) return '#e8a04a';
    if (s >= 9 && s < 13) return '#1D9E75';
    if (s >= 13 && s < 18) return '#4a90d9';
    if (s >= 18 && s < 23) return '#7F77DD';
    return '#E24B4A';
  };

  const ortalama = (s) => {
    const liste = aktifPlatformlar.map(id => SAATLIK[id][s]);
    return Math.round(liste.reduce((a, b) => a + b, 0) / liste.length);
  };

  const max = 100;

  return (
    <div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '11px' }}>
        {[
          { renk: '#E24B4A', label: 'Gece (22–06)' },
          { renk: '#e8a04a', label: 'Sabah (06–09)' },
          { renk: '#1D9E75', label: 'Öğlen (09–13)' },
          { renk: '#4a90d9', label: 'Öğleden Sonra (13–18)' },
          { renk: '#7F77DD', label: 'Akşam (18–23)' },
        ].map(({ renk, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-mute)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: renk }} />
            {label}
          </span>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {Array.from({ length: 24 }, (_, i) => {
          const v = ortalama(i);
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
                <text x={x + barW / 2} y={H - 8} textAnchor="middle"
                  fontSize={isHov ? 9 : 8}
                  fill={isHov ? saatRenk(i) : 'var(--color-text-mute)'}
                  fontWeight={isHov ? 600 : 400}>
                  {i.toString().padStart(2, '0')}
                </text>
              )}
              {isHov && (
                <text x={x + barW / 2} y={MT + PH - bH - 6} textAnchor="middle"
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

// ── Yaş × Platform Isı Haritası ───────────────────────────────
function YasIsıHaritasi({ aktif }) {
  const [hover, setHover] = useState(null);
  const platformlar = Object.keys(PLATFORM);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '420px' }}>
        <thead>
          <tr>
            <th style={{ width: '72px', fontSize: '11px', color: 'var(--color-text-mute)', textAlign: 'left', padding: '6px 8px', fontWeight: 400 }}>
              Yaş grubu
            </th>
            {platformlar.map(id => (
              <th key={id} style={{
                fontSize: '11px', color: aktif === null || aktif === id ? PLATFORM[id].renk : 'var(--color-text-mute)',
                padding: '6px 4px', fontWeight: aktif === id ? 700 : 400,
                textAlign: 'center', transition: 'color 0.2s',
              }}>
                {PLATFORM[id].emoji}<br />
                <span style={{ fontSize: '10px' }}>{PLATFORM[id].label.split('/')[0].trim()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {YAS_GRUPLARI.map((y, ri) => (
            <tr key={y.grup}>
              <td style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', padding: '6px 8px' }}>
                {y.grup}
              </td>
              {platformlar.map((id, ci) => {
                const deger = y.degerler[id];
                const p = PLATFORM[id];
                const vurgu = aktif === null || aktif === id;
                const isHov = hover?.r === ri && hover?.c === ci;
                const intensity = deger / 100;
                return (
                  <td key={id}
                    onMouseEnter={() => setHover({ r: ri, c: ci })}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      padding: '4px',
                      textAlign: 'center',
                      opacity: vurgu ? 1 : 0.15,
                      transition: 'opacity 0.2s',
                    }}>
                    <div style={{
                      width: '100%',
                      minWidth: '44px',
                      height: '36px',
                      borderRadius: '6px',
                      background: isHov
                        ? p.renk
                        : `rgba(${hexToRgb(p.renk)}, ${0.12 + intensity * 0.55})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'default',
                      transition: 'background 0.15s',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: isHov ? '#fff' : p.renk }}>
                        %{deger}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ── Haftalık Aktivite ─────────────────────────────────────────
function HaftalikGrafik() {
  const [hover, setHover] = useState(null);
  const W = 440, H = 120, ML = 24, MR = 12, MT = 12, MB = 26;
  const PW = W - ML - MR, PH = H - MT - MB;
  const max = 102, min = 78;
  const xS = i => ML + (i / (HAFTALIK.length - 1)) * PW;
  const yS = v => MT + ((max - v) / (max - min)) * PH;

  const pathD = HAFTALIK.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(d.deger).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${xS(HAFTALIK.length - 1).toFixed(1)},${H - MB} L${xS(0).toFixed(1)},${H - MB} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="hgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7F77DD" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[80, 90, 100].map(t => (
        <g key={t}>
          <line x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)} stroke="var(--color-border)" strokeWidth="0.5" />
          <text x={ML - 4} y={yS(t) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-mute)">{t}</text>
        </g>
      ))}
      <path d={areaD} fill="url(#hgrad)" />
      <path d={pathD} fill="none" stroke="#7F77DD" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {HAFTALIK.map((d, i) => (
        <g key={d.gun}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}>
          <circle cx={xS(i)} cy={yS(d.deger)} r={hover === i ? 6 : 4}
            fill={hover === i ? '#7F77DD' : '#fff'}
            stroke="#7F77DD" strokeWidth="2"
            style={{ transition: 'r 0.1s', cursor: 'default' }} />
          <text x={xS(i)} y={H - MB + 14} textAnchor="middle" fontSize={hover === i ? 10 : 9}
            fill={hover === i ? '#7F77DD' : 'var(--color-text-mute)'}
            fontWeight={hover === i ? 700 : 400}>
            {d.gun}
          </text>
          {hover === i && (
            <text x={xS(i)} y={yS(d.deger) - 10} textAnchor="middle" fontSize="9"
              fill="#7F77DD" fontWeight="700">
              {d.deger}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── İçerik Tipi Donut ─────────────────────────────────────────
function IcerikDonut() {
  const [hover, setHover] = useState(null);
  const R = 60, CX = 78, CY = 78;
  const cevre = 2 * Math.PI * R;
  let offset = 0;
  const dilimler = ICERIK_TURLERI.map(t => {
    const uzunluk = (t.yuzde / 100) * cevre;
    const d = { ...t, uzunluk, offset };
    offset += uzunluk;
    return d;
  });

  const aktif = hover !== null ? ICERIK_TURLERI[hover] : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 156 156" style={{ width: '156px', flexShrink: 0 }}>
        {dilimler.map((d, i) => (
          <circle key={d.id}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={d.renk}
            strokeWidth={hover === i ? 28 : 22}
            strokeDasharray={`${d.uzunluk} ${cevre - d.uzunluk}`}
            strokeDashoffset={-d.offset}
            opacity={hover === null || hover === i ? 1 : 0.2}
            style={{ transform: `rotate(-90deg)`, transformOrigin: `${CX}px ${CY}px`, transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--color-text)">
          {aktif ? `%${aktif.yuzde}` : '%52'}
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">
          {aktif ? aktif.label : 'Video lider'}
        </text>
      </svg>

      <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ICERIK_TURLERI.map((t, i) => (
          <div key={t.id}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: hover === null || hover === i ? 1 : 0.25, transition: 'opacity 0.2s', cursor: 'default' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.renk, flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--color-text)', flex: 1 }}>{t.label}</div>
            <Cubuk deger={t.yuzde} renk={t.renk} max={60} yukseklik={6} />
            <div style={{ fontSize: '12px', fontWeight: 600, color: t.renk, width: '28px', textAlign: 'right' }}>%{t.yuzde}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function SosyalMedyaTurkiye() {
  const [aktif, setAktif] = useState(null);

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        {/* Hero */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="badge badge-case">vaka çalışması</span>
            <span className="badge badge-guide">sosyal medya</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>14 dakika</span>
          </div>
          <h1 className="font-serif font-medium mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.7rem)', color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Türkiye sosyal medya davranışı:<br />kim, nerede, ne zaman?
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-text-soft)', lineHeight: 1.75, maxWidth: '620px', marginBottom: '1.5rem' }}>
            Platform tercihlerinden saatlik aktivite profiline, yaş grubu farklarından içerik tüketim alışkanlıklarına —
            Türkiye'nin sosyal medya davranışını veriye döktük.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(232,160,74,0.10)', border: '1px solid rgba(232,160,74,0.25)', fontSize: '12px', color: '#854F0B' }}>
            <span>⚠️</span>
            <span>Bu analizde kullanılan rakamlar DataReportal, Hootsuite ve RTÜK raporlarından derlenen gerçekçi temsili veridir.</span>
          </div>
        </div>

        {/* Özet istatistikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '3rem' }}>
          {[
            { sayi: '57M+',  label: 'aktif sosyal medya kullanıcısı', renk: '#1D9E75' },
            { sayi: '3s 15d', label: 'günlük ortalama kullanım süresi', renk: '#7F77DD' },
            { sayi: '%85',   label: 'YouTube erişim oranı',             renk: '#FF0000' },
            { sayi: '22:00', label: 'en yoğun dakika',                  renk: '#E24B4A' },
            { sayi: '%54',   label: 'TikTok büyümesi (2 yıl)',          renk: '#69C9D0' },
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
            Platforma göre filtrele
          </div>
          <PlatformLegend aktif={aktif} setAktif={setAktif} />
        </div>

        {/* Platform Kullanım Oranları */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Platform kullanım oranları
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            YouTube ve Instagram birleşik bir liderlik kuruyor. Facebook beklenmedik şekilde güçlü kalıyor —
            35+ yaş grubunun sadakati sayesinde. TikTok 2 yılda üçte birden fazla penetrasyon kazandı.
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <KullanimBar aktif={aktif} />
          </div>
        </section>

        {/* 24h Saat Profili */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Günlük aktivite profili
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Türkiye'nin sosyal medya ritmi üç tepeli. Sabah 07–09 işe gidişte telefon kaydırma,
            öğlen mola 12–13, akşam 20–22 ana tüketim dönemi. Gece yarısı bile aktivite beklenenden yüksek.
            LinkedIn ise tek başına farklı bir ritim çiziyor: saat 10–12 zirvesi, akşam hızla düşüş.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <SaatGrafik aktif={aktif} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            {[
              { saat: '07–09', not: 'Sabah commute — Instagram hikaye, haber akışı' },
              { saat: '12–13', not: 'Öğlen molası — kısa video, reels' },
              { saat: '20–22', not: 'Akşam prime time — uzun video, keşfet' },
            ].map(({ saat, not }) => (
              <div key={saat} style={{ flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>{saat}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>{not}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Yaş × Platform */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Yaş grubu × platform
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            En çarpıcı bölünme: 18–24 yaş TikTok ile Instagram'ı dominant kullanırken,
            45+ yaş neredeyse tamamen Facebook + YouTube kombinasyonunda yaşıyor.
            25–34 yaş kanallar arası en dengeli grubu oluşturuyor.
            Koyu renk = yüksek penetrasyon, üzerine gel detayları gör.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <YasIsıHaritasi aktif={aktif} />
          </div>
        </section>

        {/* İçerik Tipi */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Tüketilen içerik türleri
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Metin içeriğin payı son 3 yılda %18'den %8'e geriledi. Video ve reels birlikte
            toplam tüketimin %74'ünü oluşturuyor. Canlı yayın küçük ama büyüyen bir segment.
          </p>
          <div className="card" style={{ padding: '20px 24px' }}>
            <IcerikDonut />
          </div>
        </section>

        {/* Haftalık Aktivite */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-2" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            Haftalık aktivite trendi
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            İndeks: Pazartesi = 100. Cumartesi ve Pazar zirve günler.
            İlginç detay: Pazar akşamı, "Pazartesi kaygısı" ile tüketim yeniden tırmanıyor
            ve gece yarısına kadar yüksek kalıyor.
          </p>
          <div className="card" style={{ padding: '16px 20px' }}>
            <HaftalikGrafik />
          </div>
        </section>

        {/* Bulgular */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-serif font-medium mb-4" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
            6 önemli bulgu
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { n: '01', renk: '#69C9D0', emoji: '🚀',
                baslik: 'TikTok en hızlı büyüyen platform',
                metin: '2022-2024 arasında Türkiye kullanıcı tabanı %54 büyüyen TikTok, 18-24 yaş grubunda artık Instagram\'ı geçiyor. Ortalama seans süresi diğer platformlardan %40 daha uzun.' },
              { n: '02', renk: '#1877F2', emoji: '👴',
                baslik: 'Facebook ölmedi — sadece yaşlandı',
                metin: '35+ yaş grubu için Facebook hâlâ birincil platform. Bu demografik gerçek, marka iletişimi açısından Facebook\'u hâlâ zorunlu kılıyor. Hedefleme gücü hız kaybetmiyor.' },
              { n: '03', renk: '#7F77DD', emoji: '💼',
                baslik: 'LinkedIn sabah insanı',
                metin: 'LinkedIn saat 10-12 arasında zirveye ulaşıyor ve akşam 17-18 itibarıyla hızla düşüyor. Hafta sonu aktivitesi %60 azalıyor. İçerik yayınlamak için Salı-Çarşamba 10:00 en etkili zaman.' },
              { n: '04', renk: '#FF0000', emoji: '▶️',
                baslik: 'Video mutlak hâkim',
                metin: 'Tüketilen içeriğin %74\'ü video. Uzun form (YouTube) ve kısa form (Reels/TikTok) bu büyüklüğü paylaşıyor. Metin tabanlı içerik 3 yılda yarı yarıya eridi.' },
              { n: '05', renk: '#E24B4A', emoji: '🌙',
                baslik: 'Gece yarısı küçümsenmesin',
                metin: '23:00-01:00 arası aktivite, öğlen molasından daha yüksek. Bu saatte genç kullanıcı oranı %65\'e çıkıyor. Ergenlik ve genç yetişkinlik döneminde uyku düzeni sosyal medya ile iç içe geçmiş.' },
              { n: '06', renk: '#1D9E75', emoji: '📰',
                baslik: 'Twitter/X haber için yaşıyor',
                metin: 'Twitter\'ın Türkiye kullanımı diğer platformlara göre "görev bazlı" — kullanıcılar günde 2-3 kez giriyor, kısa kalıyor. Deprem, seçim, spor gibi gerçek zamanlı olaylarda spike\'lar belirgin.' },
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

        {/* Analitik not */}
        <div style={{ padding: '20px 24px', borderRadius: '10px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', marginBottom: '2rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '10px' }}>
            📊 Kendi verinle nasıl yaparsın?
          </div>
          <pre style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--color-text-soft)', overflowX: 'auto', margin: 0 }}>{`import pandas as pd
import matplotlib.pyplot as plt

# Meta Business Suite, LinkedIn Analytics veya
# Twitter Analytics'ten CSV export al
df = pd.read_csv('platform_analytics.csv', parse_dates=['date'])

# Saatlik aktivite profili
df['hour'] = df['date'].dt.hour
hourly = df.groupby('hour')['impressions'].mean()

plt.figure(figsize=(12, 4))
plt.bar(hourly.index, hourly.values, color='#7F77DD', alpha=0.75)
plt.xlabel('Saat')
plt.ylabel('Ortalama İzlenim')
plt.title('Saatlik Aktivite Profili')
plt.tight_layout()
plt.savefig('hourly_profile.png', dpi=150)`}</pre>
        </div>

        {/* Veri notu */}
        <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', marginBottom: '2rem', fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--color-text-soft)' }}>📌 Veri notu:</strong>{' '}
          Bu analizde kullanılan rakamlar DataReportal 2024, Hootsuite Digital Report, We Are Social ve RTÜK yayıncılık
          raporlarından derlenerek normalize edilmiş temsili sentetik veridir. Platform bazında gerçek veriye ulaşmak için
          Meta Business Suite, LinkedIn Analytics ve Google Analytics kullanılabilir.
        </div>

        {/* İlgili */}
        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-mute)', marginBottom: '12px' }}>
            Devam et
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/yazilar/spotify-turkiye',   label: '🎵 Spotify Türkiye' },
              { href: '/yazilar/churn-tahmini',     label: '📉 Müşteri Kaybı Tahmini' },
              { href: '/yazilar/sepet-terki',       label: '🛒 Sepet Terki Analizi' },
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
