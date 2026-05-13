'use client';
import { useState } from 'react';

// ─── SENARYO VERİSİ ─────────────────────────────────────────────────────────
const PANELLER = [
  {
    id: 'gelir',
    icon: '💰', baslik: 'Aylık Gelir Trendi', kategori: 'Genel Bakış',
    ozet: 'Son 6 aylık gelir verisi',
    ipucu: 'Düşüş Mart\'ta ani başlamış — kademeli bir erozyon değil. Önceki aylarda trend stabil.',
    not: 'Ani düşüşler genellikle ani bir değişikliğe işaret eder.',
    tur: 'line',
    veri: [
      { label: 'Ekim', val: 180 }, { label: 'Kasım', val: 195 },
      { label: 'Aralık', val: 210 }, { label: 'Ocak', val: 185 },
      { label: 'Şubat', val: 192 }, { label: 'Mart', val: 138, vurgu: true },
    ], birim: 'k₺',
  },
  {
    id: 'trafik',
    icon: '👥', baslik: 'Cihaz Bazlı Trafik', kategori: 'Trafik',
    ozet: 'Şubat vs Mart — ziyaretçi sayısı',
    ipucu: 'Trafik düşmemiş, aksine artmış. Sorun ziyaretçi sayısında değil.',
    not: 'Trafik normal → sorun kullanıcıların siteye gelmesinde değil, geldikten sonra ne yaptığında.',
    tur: 'grouped_bar',
    veri: [
      { label: 'Masaüstü', sub1: { label: 'Şubat', val: 45 }, sub2: { label: 'Mart', val: 44 } },
      { label: 'Mobil',    sub1: { label: 'Şubat', val: 68 }, sub2: { label: 'Mart', val: 71, vurgu: true } },
    ], birim: 'k ziyaret',
  },
  {
    id: 'donusum',
    icon: '🎯', baslik: 'Cihaz Bazlı Dönüşüm Oranı', kategori: 'Dönüşüm',
    ozet: 'Şubat vs Mart — satın alma oranı',
    ipucu: 'Masaüstü dönüşümü neredeyse hiç değişmemiş. Mobil dönüşüm %4.2\'den %1.3\'e çakılmış.',
    not: 'Sorun açıkça mobilmobil kaynaklı — masaüstü tamamen normal çalışıyor.',
    tur: 'comparison',
    veri: [
      { label: 'Masaüstü', sub1: 3.8, sub2: 3.7, birim: '%', durum: 'normal' },
      { label: 'Mobil',    sub1: 4.2, sub2: 1.3, birim: '%', durum: 'kritik' },
    ],
  },
  {
    id: 'terk',
    icon: '🛒', baslik: 'Mobil Ödeme Hunisi', kategori: 'Dönüşüm',
    ozet: 'Kullanıcılar ödeme sürecinin neresinde ayrılıyor?',
    ipucu: 'Ürün sayfası ve sepet adımları normal. Ödeme sayfasında terk %42\'den %79\'a fırlamış.',
    not: 'Kullanıcılar ürünü beğeniyor, sepete ekliyor — ama ödeme sayfasında bir şey onları kaçırıyor.',
    tur: 'funnel',
    veri: [
      { label: 'Ürün sayfası', sub1: 100, sub2: 100 },
      { label: 'Sepete ekledi', sub1: 38, sub2: 36 },
      { label: 'Ödemeye geçti', sub1: 28, sub2: 26 },
      { label: 'Ödemeyi tamamladı', sub1: 16, sub2: 5.3, vurgu: true },
    ],
  },
  {
    id: 'hiz',
    icon: '⚡', baslik: 'Mobil Sayfa Yükleme Hızı', kategori: 'Teknik',
    ozet: 'Mart boyunca ölçülen LCP (Largest Contentful Paint)',
    ipucu: '12 Mart\'ta LCP 2.1 saniyeden 5.8 saniyeye çıkmış. Bu tarih bir şeyle örtüşüyor mu?',
    not: '5 saniyenin üzerindeki yükleme süresi kullanıcıların %90\'ını kaçırır. 12 Mart kritik gün.',
    tur: 'timeline',
    veri: [
      { label: '1-11 Mar', val: 2.1, durum: 'iyi' },
      { label: '12 Mar →', val: 5.8, durum: 'kritik', vurgu: true },
    ], birim: 'sn (LCP)',
  },
  {
    id: 'gunluk',
    icon: '📅', baslik: 'Günlük Gelir — Mart', kategori: 'Zaman',
    ozet: 'Her gün elde edilen gelir',
    ipucu: '1-11 Mart arası günlük ~6.2k₺. 12 Mart\'tan itibaren ~3.5k₺\'ye indi ve kalmaya devam etti.',
    not: '12 Mart bir kırılma noktası. O gün ne yapıldı?',
    tur: 'bar_timeline',
    veri: Array.from({ length: 20 }, (_, i) => ({
      label: `${i + 1}`,
      val: i < 11 ? 5.8 + Math.random() * 0.8 : 3.2 + Math.random() * 0.6,
      vurgu: i === 11,
    })), birim: 'k₺',
  },
  {
    id: 'kategori',
    icon: '📦', baslik: 'Kategori Bazlı Satış Değişimi', kategori: 'Ürün',
    ozet: 'Şubat\'a göre Mart değişimi, kategoriye göre',
    ipucu: 'Tüm kategoriler benzer oranda düşmüş. Sorun belirli bir ürün veya kategoriyle ilgili değil.',
    not: 'Genele yayılmış düşüş → ürün problemi değil, platform problemi.',
    tur: 'bar',
    veri: [
      { label: 'Elektronik', val: -27 }, { label: 'Giyim', val: -29 },
      { label: 'Ev & Yaşam', val: -26 }, { label: 'Spor', val: -31 },
      { label: 'Kitap', val: -24 },
    ], birim: '%',
  },
  {
    id: 'segment',
    icon: '👤', baslik: 'Müşteri Segmenti Analizi', kategori: 'Müşteri',
    ozet: 'Hangi müşteri grubu etkilendi?',
    ipucu: 'Masaüstü kullanıcılar (yeni veya geri dönen) etkilenmemiş. Sadece mobil kullanıcılar çakılmış.',
    not: 'Ortak payda = mobil cihaz. Kök neden net: mobil platformda bir şey kırılmış.',
    tur: 'comparison',
    veri: [
      { label: 'Masaüstü — Yeni',     sub1: 2.9, sub2: 2.8, birim: '% cvr', durum: 'normal' },
      { label: 'Masaüstü — Geri dönen', sub1: 5.1, sub2: 5.0, birim: '% cvr', durum: 'normal' },
      { label: 'Mobil — Yeni',         sub1: 3.1, sub2: 1.0, birim: '% cvr', durum: 'kritik' },
      { label: 'Mobil — Geri dönen',   sub1: 5.8, sub2: 1.7, birim: '% cvr', durum: 'kritik' },
    ],
  },
];

const SECENEKLER = [
  { id: 'A', metin: 'Reklam bütçesi kesildi, organik trafik düştü' },
  { id: 'B', metin: 'Rakip site agresif indirim yaptı, kullanıcılar oraya geçti' },
  { id: 'C', metin: '12 Mart güncellemesi mobil performansı bozdu, ödeme sayfası yüklenmez oldu' },
  { id: 'D', metin: 'Ödeme altyapısında yaygın bir kesinti yaşandı' },
];

const DOGRU = 'C';

// ─── SVG GRAFİKLER ──────────────────────────────────────────────────────────
function BarChart({ veri, birim }) {
  const max = Math.max(...veri.map(d => Math.abs(d.val)));
  const W = 340, H = 100, barW = Math.max(12, (W - 40) / veri.length - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', maxWidth: W }}>
      {veri.map((d, i) => {
        const h = (Math.abs(d.val) / max) * H * 0.85;
        const x = 20 + i * ((W - 40) / veri.length) + 2;
        const isNeg = d.val < 0;
        return (
          <g key={i}>
            <rect x={x} y={H - h} width={barW} height={h} rx={3}
              fill={d.vurgu ? '#dc2626' : isNeg ? '#dc262680' : 'rgba(29,158,117,0.7)'} />
            <text x={x + barW / 2} y={H + 12} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{d.label}</text>
            <text x={x + barW / 2} y={H - h - 3} textAnchor="middle" fontSize="9" fontWeight="600"
              fill={d.vurgu ? '#dc2626' : 'var(--color-text-soft)'}>{d.val}{birim === '%' ? '%' : ''}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ veri, birim }) {
  const max = Math.max(...veri.map(d => d.val));
  const min = Math.min(...veri.map(d => d.val));
  const W = 340, H = 100;
  const xS = (i) => 30 + i * ((W - 40) / (veri.length - 1));
  const yS = (v) => 10 + (1 - (v - min) / (max - min || 1)) * (H - 20);
  const pts = veri.map((d, i) => `${xS(i)},${yS(d.val)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', maxWidth: W }}>
      <polyline points={pts} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
      {veri.map((d, i) => (
        <g key={i}>
          <circle cx={xS(i)} cy={yS(d.val)} r={d.vurgu ? 6 : 4}
            fill={d.vurgu ? '#dc2626' : 'var(--color-accent)'} stroke="white" strokeWidth="1.5" />
          <text x={xS(i)} y={H + 12} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)">{d.label}</text>
          <text x={xS(i)} y={yS(d.val) - 8} textAnchor="middle" fontSize="9" fontWeight="600"
            fill={d.vurgu ? '#dc2626' : 'var(--color-text-soft)'}>{d.val}{birim?.includes('k') ? 'k' : ''}</text>
        </g>
      ))}
    </svg>
  );
}

function ComparisonTable({ veri }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {veri.map((row, i) => {
        const degisti = ((row.sub2 - row.sub1) / row.sub1 * 100).toFixed(0);
        const renk = row.durum === 'kritik' ? '#dc2626' : '#1D9E75';
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto auto',
            gap: '10px', alignItems: 'center',
            padding: '8px 12px', borderRadius: '8px',
            background: row.durum === 'kritik' ? 'rgba(220,38,38,0.07)' : 'rgba(29,158,117,0.06)',
            border: `0.5px solid ${row.durum === 'kritik' ? 'rgba(220,38,38,0.25)' : 'rgba(29,158,117,0.2)'}`,
          }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>{row.label}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Şub: <strong>{row.sub1}{row.birim}</strong></span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Mar: <strong style={{ color: renk }}>{row.sub2}{row.birim}</strong></span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: renk }}>{degisti > 0 ? '+' : ''}{degisti}%</span>
          </div>
        );
      })}
    </div>
  );
}

function FunnelChart({ veri }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {veri.map((adim, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-soft)' }}>{adim.label}</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Şub: <strong>{adim.sub1}%</strong></span>
              <span style={{ fontSize: '11px', color: adim.vurgu ? '#dc2626' : 'var(--color-text-mute)' }}>
                Mar: <strong style={{ color: adim.vurgu ? '#dc2626' : 'inherit' }}>{adim.sub2}%</strong>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '3px', height: '10px' }}>
            <div style={{ flex: adim.sub1, background: 'rgba(29,158,117,0.5)', borderRadius: '3px', transition: 'flex 0.3s' }} />
            <div style={{ flex: 100 - adim.sub1, background: 'transparent' }} />
          </div>
          <div style={{ display: 'flex', gap: '3px', height: '10px', marginTop: '2px' }}>
            <div style={{ flex: adim.sub2, background: adim.vurgu ? 'rgba(220,38,38,0.6)' : 'rgba(29,158,117,0.3)', borderRadius: '3px' }} />
            <div style={{ flex: 100 - adim.sub2, background: 'transparent' }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '4px', display: 'flex', gap: '12px' }}>
        <span>■ Şubat (üst bar)</span><span>■ Mart (alt bar)</span>
      </div>
    </div>
  );
}

function TimelineChart({ veri, birim }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {veri.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', minWidth: '80px' }}>{d.label}</span>
          <div style={{ flex: 1, height: '24px', background: 'var(--color-cream)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '6px',
              width: `${(d.val / 8) * 100}%`,
              background: d.durum === 'kritik' ? '#dc2626' : '#1D9E75',
              transition: 'width 0.4s',
            }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '60px',
            color: d.durum === 'kritik' ? '#dc2626' : '#1D9E75' }}>
            {d.val}s LCP
          </span>
        </div>
      ))}
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '4px' }}>
        Google önerisi: LCP &lt; 2.5 saniye
      </div>
    </div>
  );
}

function BarTimeline({ veri, birim }) {
  const max = Math.max(...veri.map(d => d.val));
  const W = 340, H = 90;
  const bw = (W - 20) / veri.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', maxWidth: W }}>
      {veri.map((d, i) => {
        const h = (d.val / max) * H * 0.9;
        const x = 10 + i * bw;
        const isCut = i === 11;
        return (
          <g key={i}>
            <rect x={x + 1} y={H - h} width={bw - 2} height={h} rx={1}
              fill={i < 11 ? 'rgba(29,158,117,0.65)' : 'rgba(220,38,38,0.65)'}
              opacity={d.vurgu ? 1 : 0.8}
            />
            {isCut && (
              <line x1={x} y1={0} x2={x} y2={H + 10} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
            )}
            {(i === 0 || i === 10 || i === 11 || i === 19) && (
              <text x={x + bw / 2} y={H + 14} textAnchor="middle" fontSize="8.5" fill="var(--color-text-mute)">
                {i === 11 ? '12' : d.label}
              </text>
            )}
          </g>
        );
      })}
      <text x={65} y={H + 14} textAnchor="middle" fontSize="8" fill="rgba(29,158,117,0.8)">← Normal</text>
      <text x={270} y={H + 14} textAnchor="middle" fontSize="8" fill="rgba(220,38,38,0.8)">Düşüş →</text>
    </svg>
  );
}

function GroupedBar({ veri, birim }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {veri.map((row, i) => (
        <div key={i}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '5px' }}>{row.label}</div>
          {[row.sub1, row.sub2].map((sub, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '10px', color: 'var(--color-text-mute)', minWidth: '44px' }}>{sub.label}</span>
              <div style={{ flex: 1, height: '14px', background: 'var(--color-cream)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '4px',
                  width: `${(sub.val / 80) * 100}%`,
                  background: j === 0 ? 'rgba(127,119,221,0.6)' : sub.vurgu ? 'rgba(29,158,117,0.8)' : 'rgba(29,158,117,0.6)',
                }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, minWidth: '50px', color: 'var(--color-text)' }}>{sub.val}k</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PanelGrafik({ panel }) {
  if (panel.tur === 'line') return <LineChart veri={panel.veri} birim={panel.birim} />;
  if (panel.tur === 'bar') return <BarChart veri={panel.veri} birim={panel.birim} />;
  if (panel.tur === 'comparison') return <ComparisonTable veri={panel.veri} />;
  if (panel.tur === 'funnel') return <FunnelChart veri={panel.veri} />;
  if (panel.tur === 'timeline') return <TimelineChart veri={panel.veri} birim={panel.birim} />;
  if (panel.tur === 'bar_timeline') return <BarTimeline veri={panel.veri} birim={panel.birim} />;
  if (panel.tur === 'grouped_bar') return <GroupedBar veri={panel.veri} birim={panel.birim} />;
  return null;
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function VeriDedektifi() {
  const [incelenen, setIncelenen] = useState(new Set());
  const [aktif, setAktif] = useState(null);
  const [tahmin, setTahmin] = useState(null);
  const [gonderildi, setGonderildi] = useState(false);

  const incele = (id) => {
    setIncelenen(prev => new Set([...prev, id]));
    setAktif(prev => prev === id ? null : id);
  };

  const dogru = tahmin === DOGRU;
  const yeterliIpucu = incelenen.size >= 3;

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri Dedektifi: Mart geliri neden düştü?
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-mute)' }}>
          soruşturma · kök neden analizi · vaka çalışması
        </p>

        {/* Dava dosyası */}
        <div style={{
          background: 'rgba(232,160,74,0.08)', border: '1px solid rgba(232,160,74,0.35)',
          borderRadius: '14px', padding: '20px 24px', marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#BA7517', letterSpacing: '0.05em' }}>DAVA DOSYASI #2024-03</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 20px', fontSize: '13px' }}>
            {[
              ['Şirket:', 'FikirzadeTech — e-ticaret platformu'],
              ['Sorun:', 'Mart 2024 geliri Şubat\'a göre %28 düştü (192k₺ → 138k₺)'],
              ['Tespit tarihi:', '1 Nisan 2024, aylık raporlama toplantısı'],
              ['Göreviniz:', 'Veri panellerini inceleyin, kök nedeni bulun'],
            ].map(([k, v]) => (
              <>
                <span key={k} style={{ fontWeight: 600, color: 'var(--color-text-soft)', whiteSpace: 'nowrap' }}>{k}</span>
                <span key={v} style={{ color: 'var(--color-text)' }}>{v}</span>
              </>
            ))}
          </div>
        </div>

        {/* İlerleme */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
            Soruşturma Panelleri
          </span>
          <span style={{ fontSize: '12px', color: incelenen.size >= 3 ? '#1D9E75' : 'var(--color-text-mute)' }}>
            {incelenen.size}/{PANELLER.length} incelendi
            {incelenen.size < 3 && ` · sonuç için en az 3 incele`}
          </span>
        </div>

        {/* Panel kartları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {PANELLER.map((panel) => {
            const inc = incelenen.has(panel.id);
            const acik = aktif === panel.id;
            return (
              <div key={panel.id} style={{
                border: `0.5px solid ${acik ? 'var(--color-accent)' : inc ? 'rgba(29,158,117,0.35)' : 'var(--color-border)'}`,
                borderRadius: '12px', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {/* Panel başlığı */}
                <button
                  onClick={() => incele(panel.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 18px', background: 'var(--color-cream-card)',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{panel.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{panel.baslik}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '1px' }}>
                      {panel.kategori} · {panel.ozet}
                    </div>
                  </div>
                  {inc && !acik && (
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(29,158,117,0.12)', color: '#1D9E75', fontWeight: 600, flexShrink: 0 }}>
                      ✓ İncelendi
                    </span>
                  )}
                  <span style={{ fontSize: '16px', color: 'var(--color-text-mute)', flexShrink: 0, transform: acik ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ↓
                  </span>
                </button>

                {/* Panel içeriği */}
                {acik && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid var(--color-border)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <PanelGrafik panel={panel} />
                    </div>

                    {/* Dedektif notu */}
                    <div style={{
                      background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.3)',
                      borderRadius: '10px', padding: '12px 16px',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D9E75', marginBottom: '5px', letterSpacing: '0.04em' }}>
                        🔍 DEDEKTİF NOTU
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.6 }}>
                        <strong>{panel.ipucu}</strong>
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', margin: 0, lineHeight: 1.55 }}>
                        {panel.not}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sonuç bölümü */}
        <div style={{
          border: `1px solid ${gonderildi ? (dogru ? 'rgba(29,158,117,0.5)' : 'rgba(220,38,38,0.4)') : 'var(--color-border)'}`,
          borderRadius: '16px', overflow: 'hidden',
          opacity: yeterliIpucu || gonderildi ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}>
          <div style={{ padding: '16px 20px', background: 'var(--color-cream-card)', borderBottom: '0.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              🎯 Kök Neden Tahmininiz
            </div>
            {!yeterliIpucu && !gonderildi && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '4px' }}>
                Tahmin için en az 3 paneli inceleyin ({incelenen.size}/3)
              </div>
            )}
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SECENEKLER.map((s) => {
              const secili = tahmin === s.id;
              const dogruSec = gonderildi && s.id === DOGRU;
              const yanlisSec = gonderildi && secili && s.id !== DOGRU;
              return (
                <button
                  key={s.id}
                  onClick={() => !gonderildi && yeterliIpucu && setTahmin(s.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px 16px', borderRadius: '10px', textAlign: 'left',
                    border: `1.5px solid ${dogruSec ? '#1D9E75' : yanlisSec ? '#dc2626' : secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: dogruSec ? 'rgba(29,158,117,0.08)' : yanlisSec ? 'rgba(220,38,38,0.06)' : secili ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                    cursor: yeterliIpucu && !gonderildi ? 'pointer' : 'default',
                    fontFamily: 'inherit', width: '100%',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    fontSize: '13px', fontWeight: 700, flexShrink: 0, marginTop: '1px',
                    color: dogruSec ? '#1D9E75' : yanlisSec ? '#dc2626' : secili ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                  }}>
                    {dogruSec ? '✓' : yanlisSec ? '✗' : s.id}
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text)' }}>
                    {s.metin}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Gönder butonu */}
          {!gonderildi && (
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={() => tahmin && yeterliIpucu && setGonderildi(true)}
                disabled={!tahmin || !yeterliIpucu}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 600, cursor: tahmin && yeterliIpucu ? 'pointer' : 'not-allowed',
                  border: 'none',
                  background: tahmin && yeterliIpucu ? 'var(--color-accent)' : 'var(--color-border)',
                  color: tahmin && yeterliIpucu ? '#fff' : 'var(--color-text-mute)',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >
                Sonucu Gör
              </button>
            </div>
          )}

          {/* Sonuç açıklaması */}
          {gonderildi && (
            <div style={{
              margin: '0 20px 20px', padding: '16px 20px', borderRadius: '12px',
              background: dogru ? 'rgba(29,158,117,0.08)' : 'rgba(220,38,38,0.06)',
              border: `0.5px solid ${dogru ? 'rgba(29,158,117,0.4)' : 'rgba(220,38,38,0.35)'}`,
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: dogru ? '#1D9E75' : '#dc2626', marginBottom: '10px' }}>
                {dogru ? '🎉 Harika! Kök nedeni buldunuz.' : '🤔 Yaklaşıyordunuz, ama kök neden farklı.'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
                ✓ Doğru cevap: 12 Mart güncellemesi mobil performansı bozdu
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.7 }}>
                <p style={{ margin: '0 0 8px' }}>
                  Soruşturma özeti: Trafik düşmemiş → sorun dönüşümde. Masaüstü normal →
                  sorun mobilmobil. Mobil ödeme hunisi çakılmış → sorun ödeme sayfasında.
                  12 Mart'ta LCP 2.1s'den 5.8s'e çıkmış → bir deployment bu tarihe denk geliyor.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Aksiyon:</strong> 12 Mart deployment'ını rollback et veya mobil
                  performans sorununu gider (büyük resim boyutları, bloke eden JS?).
                  Gelirin %72'si hemen geri gelecektir.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Metodoloji notu */}
        <div style={{ marginTop: '32px', padding: '16px 20px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
            💡 Bu soruşturmada kullanılan analiz yaklaşımı
          </div>
          <ol style={{ fontSize: '12px', color: 'var(--color-text-soft)', lineHeight: 1.8, margin: 0, paddingLeft: '18px' }}>
            <li>Önce genel metriği doğrula — gerçekten düşüş var mı?</li>
            <li>Segmente kır — hangi kanal, cihaz, kategori etkilenmiş?</li>
            <li>Zaman boyutunu incele — ne zaman başladı?</li>
            <li>Huni analizi yap — kullanıcılar nerede kayboluyor?</li>
            <li>O tarihte ne değişti? — deployment, kampanya, dış etken</li>
          </ol>
        </div>

      </article>
    </main>
  );
}
