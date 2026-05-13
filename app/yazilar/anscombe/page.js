'use client';
import { useState, useEffect } from 'react';

// ── Veri ──────────────────────────────────────────────────────
const VERI = [
  {
    id: 'I', renk: '#1D9E75', bg: 'rgba(29,158,117,0.08)',
    baslik: 'Klasik Doğrusal',
    aciklama: 'Lineer regresyon burada mükemmel çalışıyor. Noktalar çizgi etrafına düzgün saçılmış — model doğru seçim.',
    ipucu: '✅ Lineer model burada doğru seçim',
    puan: [{x:10,y:8.04},{x:8,y:6.95},{x:13,y:7.58},{x:9,y:8.81},{x:11,y:8.33},
           {x:14,y:9.96},{x:6,y:7.24},{x:4,y:4.26},{x:12,y:10.84},{x:7,y:4.82},{x:5,y:5.68}],
  },
  {
    id: 'II', renk: '#7F77DD', bg: 'rgba(127,119,221,0.08)',
    baslik: 'Eğrisel İlişki',
    aciklama: 'Mükemmel parabolik yapı var. Regresyon fit oluyor ama model yanlış — polinom ya da dönüşüm şart.',
    ipucu: '⚠️ Doğrusal değil, polinom model gerek',
    puan: [{x:10,y:9.14},{x:8,y:8.14},{x:13,y:8.74},{x:9,y:8.77},{x:11,y:9.26},
           {x:14,y:8.10},{x:6,y:6.13},{x:4,y:3.10},{x:12,y:9.13},{x:7,y:7.26},{x:5,y:4.74}],
  },
  {
    id: 'III', renk: '#e8a04a', bg: 'rgba(232,160,74,0.08)',
    baslik: 'Tek Aykırı Değer',
    aciklama: 'Geri kalan 10 nokta neredeyse mükemmel doğrusal. Tek outlier (x=13, y=12.7) tüm çizgiyi kaydırıyor.',
    ipucu: '🔴 Outlier olmasa R² ≈ 1 olurdu',
    puan: [{x:10,y:7.46},{x:8,y:6.77},{x:13,y:12.74},{x:9,y:7.11},{x:11,y:7.81},
           {x:14,y:8.84},{x:6,y:6.08},{x:4,y:5.39},{x:12,y:8.15},{x:7,y:6.42},{x:5,y:5.73}],
  },
  {
    id: 'IV', renk: '#E24B4A', bg: 'rgba(226,75,74,0.08)',
    baslik: 'Aldatıcı Korelasyon',
    aciklama: 'Tüm x değerleri 8. Tek bir nokta (x=19) olmasaydı korelasyon tanımsız olurdu. İstatistik tamamen yanıltıcı.',
    ipucu: '🔴 Grafik olmasaydı asla anlayamazdın',
    puan: [{x:8,y:6.58},{x:8,y:5.76},{x:8,y:7.71},{x:8,y:8.84},{x:8,y:8.47},
           {x:8,y:7.04},{x:8,y:5.25},{x:19,y:12.50},{x:8,y:5.56},{x:8,y:7.91},{x:8,y:6.89}],
  },
];

const ISTATISTIKLER = [
  { label: 'n', deger: '11' },
  { label: 'x̄ (ortalama)', deger: '9.00' },
  { label: 'ȳ (ortalama)', deger: '7.50 ±0.01' },
  { label: 'Var(x)', deger: '11.00' },
  { label: 'Var(y)', deger: '~4.12' },
  { label: 'Korelasyon', deger: '0.816' },
  { label: 'Regresyon', deger: 'y = 3.0 + 0.5x' },
  { label: 'R²', deger: '0.67' },
];

// ── SVG Scatter Plot ──────────────────────────────────────────
const W = 300, H = 210, ML = 34, MR = 10, MT = 12, MB = 28;
const PW = W - ML - MR, PH = H - MT - MB;
const XMIN = 2, XMAX = 21, YMIN = 1.5, YMAX = 14;

const xS = (x) => ML + ((x - XMIN) / (XMAX - XMIN)) * PW;
const yS = (y) => MT + ((YMAX - y) / (YMAX - YMIN)) * PH;

function ScatterPlot({ dataset, regresyon, highlight, acildi, idx }) {
  const rx1 = xS(XMIN), ry1 = yS(3 + 0.5 * XMIN);
  const rx2 = xS(XMAX), ry2 = yS(3 + 0.5 * XMAX);

  // x ekseni tick'leri
  const xTicks = [4, 8, 12, 16, 20];
  const yTicks = [2, 4, 6, 8, 10, 12, 14];

  const outlier = dataset.id === 'III'
    ? dataset.puan.find(p => p.y > 12)
    : dataset.id === 'IV'
    ? dataset.puan.find(p => p.x === 19)
    : null;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', opacity: acildi ? 1 : 0, transition: `opacity 0.6s ease ${idx * 0.15}s` }}>

      {/* Izgara */}
      {yTicks.map(t => (
        <line key={t} x1={ML} y1={yS(t)} x2={W - MR} y2={yS(t)}
          stroke="var(--color-border)" strokeWidth="0.5" />
      ))}
      {xTicks.map(t => (
        <line key={t} x1={xS(t)} y1={MT} x2={xS(t)} y2={H - MB}
          stroke="var(--color-border)" strokeWidth="0.5" />
      ))}

      {/* Eksenler */}
      <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="var(--color-text-mute)" strokeWidth="1" />
      <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="var(--color-text-mute)" strokeWidth="1" />

      {/* Tick etiketleri */}
      {xTicks.map(t => (
        <text key={t} x={xS(t)} y={H - MB + 14} textAnchor="middle"
          fontSize="9" fill="var(--color-text-mute)">{t}</text>
      ))}
      {yTicks.map(t => (
        <text key={t} x={ML - 5} y={yS(t) + 3} textAnchor="end"
          fontSize="9" fill="var(--color-text-mute)">{t}</text>
      ))}

      {/* Regresyon çizgisi */}
      {regresyon && (
        <line x1={rx1} y1={ry1} x2={rx2} y2={ry2}
          stroke={dataset.renk} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7" />
      )}

      {/* Noktalar */}
      {dataset.puan.map((p, i) => {
        const isOutlier = outlier && p.x === outlier.x && p.y === outlier.y;
        return (
          <g key={i}>
            {isOutlier && (
              <circle cx={xS(p.x)} cy={yS(p.y)} r="10"
                fill={dataset.renk} opacity="0.15" />
            )}
            <circle
              cx={xS(p.x)} cy={yS(p.y)} r={isOutlier ? 5 : 4}
              fill={dataset.renk}
              stroke={isOutlier ? '#fff' : 'none'}
              strokeWidth={isOutlier ? 1.5 : 0}
              opacity={highlight && !isOutlier ? 0.4 : 0.85}
            />
          </g>
        );
      })}

      {/* Outlier etiketi */}
      {outlier && (
        <text x={xS(outlier.x) + 8} y={yS(outlier.y) - 6}
          fontSize="9" fill={dataset.renk} fontWeight="600">outlier</text>
      )}
    </svg>
  );
}

// ── Gizli panel (reveal öncesi) ────────────────────────────────
function GizliPanel({ idx }) {
  return (
    <div style={{
      width: '100%', paddingTop: '70%', position: 'relative',
      background: 'var(--color-cream)', borderRadius: '8px',
      border: '1px dashed var(--color-border)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <div style={{ fontSize: '28px', opacity: 0.25 }}>📊</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', opacity: 0.5 }}>
          Veri Seti {['I', 'II', 'III', 'IV'][idx]}
        </div>
      </div>
    </div>
  );
}

// ── Ana Bileşen ───────────────────────────────────────────────
export default function AnscombeQuartet() {
  const [acildi, setAcildi] = useState(false);
  const [regresyon, setRegresyon] = useState(true);
  const [aktif, setAktif] = useState(null); // hover highlight
  const [sayac, setSayac] = useState(null);

  // Geri sayım efekti
  const goster = () => {
    setSayac(3);
  };

  useEffect(() => {
    if (sayac === null) return;
    if (sayac === 0) {
      setAcildi(true);
      setSayac(null);
      return;
    }
    const t = setTimeout(() => setSayac(s => s - 1), 700);
    return () => clearTimeout(t);
  }, [sayac]);

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>
          ← Ana sayfa
        </a>

        {/* Başlık */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="badge badge-interactive">interaktif</span>
            <span className="badge badge-guide">görselleştirme</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>10 dakika</span>
          </div>
          <h1 className="font-serif font-medium mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Sayılar aynı —<br />ama gerçek çok farklı
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-text-soft)', lineHeight: 1.75, maxWidth: '600px' }}>
            1973'te Frank Anscombe, yalnızca istatistiklere bakmanın ne kadar yanıltıcı olduğunu kanıtlamak için dört veri seti oluşturdu.
            Hepsi aynı ortalama, varyans, korelasyon ve regresyon çizgisine sahip — ama grafikleri bambaşka.
          </p>
        </div>

        {/* İstatistik tablosu */}
        <div className="card mb-8" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            background: 'var(--color-cream)',
            borderBottom: '0.5px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>📐</span>
            <div>
              <div className="font-serif font-medium" style={{ fontSize: '16px', color: 'var(--color-text)' }}>
                4 veri seti, birebir aynı istatistikler
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
                Her satır 4 veri seti için de geçerli
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--color-cream)' }}>
                  <th style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500, fontSize: '12px', borderBottom: '0.5px solid var(--color-border)' }}>
                    İstatistik
                  </th>
                  {VERI.map(v => (
                    <th key={v.id} style={{
                      padding: '10px 16px', textAlign: 'center', borderBottom: '0.5px solid var(--color-border)',
                      fontWeight: 600, fontSize: '13px', color: acildi ? v.renk : 'var(--color-text)',
                      transition: 'color 0.4s',
                    }}>
                      {v.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ISTATISTIKLER.map((ist, i) => (
                  <tr key={i} style={{ borderBottom: i < ISTATISTIKLER.length - 1 ? '0.5px solid var(--color-border)' : 'none' }}>
                    <td style={{ padding: '9px 20px', color: 'var(--color-text-soft)', fontWeight: 500 }}>
                      {ist.label}
                    </td>
                    {[0, 1, 2, 3].map(j => (
                      <td key={j} style={{
                        padding: '9px 16px', textAlign: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: '13px',
                        color: 'var(--color-text)',
                        background: j % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                      }}>
                        {ist.deger}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!acildi && (
            <div style={{
              padding: '14px 20px',
              background: 'rgba(232,160,74,0.08)',
              borderTop: '0.5px solid var(--color-border)',
              fontSize: '13px', color: '#854F0B',
            }}>
              💡 Bunları gören bir analist "bu veri setleri benzer" der. Ama grafik çizilince…
            </div>
          )}
        </div>

        {/* Grafik paneli */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {VERI.map((v, idx) => (
              <div
                key={v.id}
                onMouseEnter={() => acildi && setAktif(v.id)}
                onMouseLeave={() => setAktif(null)}
                style={{
                  borderRadius: '12px', overflow: 'hidden',
                  border: `1.5px solid ${acildi && aktif === v.id ? v.renk : 'var(--color-border)'}`,
                  background: 'var(--color-cream-card)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: acildi && aktif === v.id ? `0 4px 20px ${v.renk}20` : 'none',
                }}
              >
                {/* Panel başlık */}
                <div style={{
                  padding: '10px 14px',
                  borderBottom: '0.5px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: acildi ? v.bg : 'var(--color-cream)',
                  transition: 'background 0.4s',
                }}>
                  <span style={{
                    fontSize: '13px', fontWeight: 700,
                    color: acildi ? v.renk : 'var(--color-text-mute)',
                    fontFamily: 'var(--font-serif)',
                    transition: 'color 0.4s',
                  }}>
                    {v.id}
                  </span>
                  {acildi && (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
                      {v.baslik}
                    </span>
                  )}
                </div>

                {/* Grafik ya da gizli panel */}
                <div style={{ padding: acildi ? '8px' : '0' }}>
                  {acildi ? (
                    <ScatterPlot
                      dataset={v}
                      regresyon={regresyon}
                      highlight={aktif !== null && aktif !== v.id}
                      acildi={acildi}
                      idx={idx}
                    />
                  ) : (
                    <GizliPanel idx={idx} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Geri sayım sayacı */}
          {sayac !== null && (
            <div style={{ textAlign: 'center', padding: '16px', fontSize: '64px', fontWeight: 700,
              fontFamily: 'var(--font-serif)', color: 'var(--color-accent)',
              animation: 'pulse 0.7s ease' }}>
              {sayac}
            </div>
          )}

          {/* Buton alanı */}
          {!acildi && sayac === null && (
            <button
              onClick={goster}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #1D9E75, #0d3d2e)',
                color: '#fff', fontSize: '17px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'opacity 0.2s',
              }}
            >
              <span>📊</span>
              Grafikleri Göster
            </button>
          )}

          {/* Regresyon toggle */}
          {acildi && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setRegresyon(r => !r)}
                style={{
                  padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
                  border: `1.5px solid ${regresyon ? '#1D9E75' : 'var(--color-border)'}`,
                  background: regresyon ? 'rgba(29,158,117,0.1)' : 'var(--color-cream-card)',
                  color: regresyon ? '#0F6E56' : 'var(--color-text-soft)',
                  cursor: 'pointer', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <span style={{ display: 'inline-block', width: '20px', height: '2px',
                  background: '#1D9E75', borderRadius: '999px',
                  verticalAlign: 'middle', marginBottom: '1px',
                  borderTop: '1px dashed #1D9E75', borderBottom: 'none',
                  background: 'none',
                  borderTop: '2px dashed #1D9E75',
                }} />
                Regresyon çizgisi {regresyon ? 'açık' : 'kapalı'}
              </button>
            </div>
          )}
        </div>

        {/* Açıklamalar (reveal sonrası) */}
        {acildi && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
            {VERI.map((v, idx) => (
              <div
                key={v.id}
                style={{
                  padding: '16px 18px', borderRadius: '10px',
                  background: v.bg,
                  border: `1px solid ${v.renk}30`,
                  opacity: 0,
                  animation: `fadeUp 0.5s ease forwards ${0.3 + idx * 0.1}s`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '4px', background: v.renk, color: '#fff' }}>
                    {v.id}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: v.renk }}>
                    {v.baslik}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.6, marginBottom: '10px' }}>
                  {v.aciklama}
                </p>
                <div style={{ fontSize: '12px', fontWeight: 500, color: v.renk, padding: '6px 10px',
                  background: 'rgba(255,255,255,0.5)', borderRadius: '6px' }}>
                  {v.ipucu}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Büyük ders */}
        {acildi && (
          <div className="card" style={{
            padding: '28px 32px', marginBottom: '2.5rem',
            borderLeft: '4px solid #1D9E75',
            opacity: 0, animation: 'fadeUp 0.5s ease forwards 0.8s',
          }}>
            <div className="font-serif font-medium mb-4"
              style={{ fontSize: '20px', color: 'var(--color-text)' }}>
              📌 Anscombe'un dersi
            </div>
            <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: 1.75, marginBottom: '16px' }}>
              Dört veri seti aynı istatistiklere sahip. Birinin korelasyonu 0.816 diye diğerininkiyle aynı anlama gelmiyor.
              <strong style={{ color: 'var(--color-text)' }}> İstatistikler hikayenin tamamını anlatmaz.</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { emoji: '📊', baslik: 'Her zaman görselleştir', aciklama: 'Model kurmadan önce verine bak. Scatter plot, histogram, boxplot — hepsi.' },
                { emoji: '🔍', baslik: 'Outlier ara', aciklama: 'Tek bir aykırı değer tüm analizi değiştirebilir. Veri III ve IV\'te gördüğün gibi.' },
                { emoji: '📐', baslik: 'Model varsayımlarını kontrol et', aciklama: 'Lineer regresyon lineer ilişki varsayar. Veri II bunu ihlal ediyor.' },
                { emoji: '🎯', baslik: 'Tek metrik yetmez', aciklama: 'R²=0.67 dört sette aynı ama gerçekler bambaşka. Birden fazla metrik kullan.' },
              ].map(({ emoji, baslik, aciklama }) => (
                <div key={baslik} style={{
                  padding: '14px 16px', borderRadius: '8px',
                  background: 'var(--color-cream)',
                  border: '0.5px solid var(--color-border)',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
                    {baslik}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.55 }}>
                    {aciklama}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datasaurus ek bilgi */}
        {acildi && (
          <div style={{
            padding: '20px 24px', borderRadius: '10px',
            background: 'rgba(127,119,221,0.08)',
            border: '1px solid rgba(127,119,221,0.2)',
            marginBottom: '2rem',
            opacity: 0, animation: 'fadeUp 0.5s ease forwards 1s',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#534AB7', marginBottom: '8px' }}>
              🦕 Datasaurus Düzinesi
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.65 }}>
              2017'de Justin Matejka ve George Fitzmaurice Anscombe'u daha da ileri götürdü:
              bir dinozor şekli de dahil olmak üzere birbirinden tamamen farklı görünen 13 veri seti yarattılar —
              hepsinin istatistikleri (ortalama, varyans, korelasyon) iki ondalık basamağa kadar eşit.
              <strong style={{ color: '#534AB7' }}> Bu yüzden görselleştirme "güzel olsun" meselesi değil, zorunluluktur.</strong>
            </p>
          </div>
        )}

        {/* İlgili içerikler */}
        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--color-text-mute)', marginBottom: '12px' }}>
            Devam et
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { href: '/yazilar/linear-regression', label: '📉 Lineer Regresyon' },
              { href: '/yazilar/pandas-7-sey', label: '🐼 Pandas ile Veri Analizi' },
              { href: '/yazilar/bias-variance', label: '⚖️ Bias-Variance Trade-off' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-soft)', textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </article>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%   { transform: scale(0.8); opacity: 0; }
          50%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
