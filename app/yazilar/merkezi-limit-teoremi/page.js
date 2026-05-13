'use client';
import { useState, useMemo, useCallback, useRef } from 'react';

// ─── DAĞILIMLAR ─────────────────────────────────────────────────────────────
function randNorm(mu, sigma) {
  const u1 = Math.random(), u2 = Math.random();
  return mu + sigma * Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

const DIST = {
  uniform: {
    label: 'Düzgün', sekil: '▬',
    gen: () => Math.random(),
    mu: 0.5, sigma: 0.2887,
    xMin: 0, xMax: 1,
    aciklama: 'Her değer eşit olasılıkla — tamamen düz',
    renk: '#7F77DD',
  },
  skewed: {
    label: 'Sağa Çarpık', sekil: '↗',
    gen: () => Math.min(2.5, -Math.log(1 - Math.random() * 0.9999) * 0.5),
    mu: 0.5, sigma: 0.5,
    xMin: 0, xMax: 2,
    aciklama: 'Küçük değerler yoğun, büyük değerler seyrek',
    renk: '#e8a04a',
  },
  bimodal: {
    label: 'Bimodal', sekil: '⋒',
    gen: () => Math.random() < 0.5 ? randNorm(0.25, 0.08) : randNorm(0.75, 0.08),
    mu: 0.5, sigma: 0.271,
    xMin: 0, xMax: 1,
    aciklama: 'İki ayrı küme — hiç normal değil',
    renk: '#E24B4A',
  },
  bernoulli: {
    label: 'Bernoulli', sekil: '◫',
    gen: () => Math.random() < 0.3 ? 1 : 0,
    mu: 0.3, sigma: 0.458,
    xMin: 0, xMax: 1,
    aciklama: 'Sadece 0 veya 1 — yazı/tura (%30 yazı)',
    renk: '#185FA5',
  },
};

const N_OPTS = [1, 2, 5, 10, 30, 100];
const NBINS = 32;
const SW = 460, PH = 90, MH = 170;
const PAD_L = 40, PAD_R = 10, PAD_T = 8, PAD_B = 28;
const IW = SW - PAD_L - PAD_R;

// ─── YARDIMCILAR ─────────────────────────────────────────────────────────────
function bins(vals, xMin, xMax) {
  const b = Array(NBINS).fill(0);
  const bw = (xMax - xMin) / NBINS;
  for (const v of vals) {
    const i = Math.min(NBINS - 1, Math.max(0, Math.floor((v - xMin) / bw)));
    b[i]++;
  }
  return b;
}

function normalPath(mu, sigma, xMin, xMax, svgH) {
  const pts = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const y = Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
    const px = PAD_L + ((x - xMin) / (xMax - xMin)) * IW;
    const py = PAD_T + (svgH - PAD_T - PAD_B) * (1 - y * 0.88);
    pts.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return pts.join(' ');
}

// ─── HİSTOGRAM BİLEŞENİ ─────────────────────────────────────────────────────
function Histogram({ b, xMin, xMax, renk, svgH, etiketler, normalEgri, vurgu }) {
  const maxB = Math.max(...b, 1);
  const bw = IW / NBINS;
  const iH = svgH - PAD_T - PAD_B;

  return (
    <svg viewBox={`0 0 ${SW} ${svgH}`} style={{ width: '100%', display: 'block' }}>
      {/* Barlar */}
      {b.map((count, i) => {
        const h = (count / maxB) * iH * 0.9;
        return (
          <rect
            key={i}
            x={PAD_L + i * bw + 0.5} y={PAD_T + iH - h}
            width={bw - 1} height={h}
            fill={renk} opacity={0.75}
            rx={1}
          />
        );
      })}

      {/* Normal eğri */}
      {normalEgri && (
        <path d={normalEgri} fill="none" stroke="#1D9E75" strokeWidth="2.5"
          strokeDasharray={vurgu ? 'none' : '5,3'} opacity={0.9}
        />
      )}

      {/* X ekseni */}
      <line x1={PAD_L} y1={PAD_T + iH} x2={PAD_L + IW} y2={PAD_T + iH}
        stroke="var(--color-border)" strokeWidth="1" />

      {/* X etiketler */}
      {etiketler.map(({ val, label }) => {
        const px = PAD_L + ((val - xMin) / (xMax - xMin)) * IW;
        return (
          <g key={val}>
            <line x1={px} y1={PAD_T + iH} x2={px} y2={PAD_T + iH + 4}
              stroke="var(--color-border)" strokeWidth="1" />
            <text x={px} y={PAD_T + iH + 14} textAnchor="middle"
              fontSize="10" fill="var(--color-text-mute)">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function MLTSayfasi() {
  const [distKey, setDistKey] = useState('uniform');
  const [n, setN] = useState(1);
  const [means, setMeans] = useState([]);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef(null);

  const dist = DIST[distKey];

  // Popülasyon dağılımı (statik, sadece dist değişince yenile)
  const popVals = useMemo(() => Array.from({ length: 3000 }, dist.gen), [distKey]);
  const popBins = useMemo(() => bins(popVals, dist.xMin, dist.xMax), [popVals, dist]);

  // Örneklem ortalamaları
  const meanBins = useMemo(() =>
    means.length ? bins(means, dist.xMin, dist.xMax) : Array(NBINS).fill(0),
    [means, dist]
  );

  const teorikStd = dist.sigma / Math.sqrt(n);
  const normalEgri = means.length >= 15
    ? normalPath(dist.mu, teorikStd, dist.xMin, dist.xMax, MH)
    : null;

  const grandMean = means.length
    ? (means.reduce((s, v) => s + v, 0) / means.length).toFixed(3)
    : '—';
  const amprikStd = means.length > 1
    ? Math.sqrt(means.reduce((s, v) => s + (v - means.reduce((a, b) => a + b, 0) / means.length) ** 2, 0) / (means.length - 1)).toFixed(3)
    : '—';

  const ornekle = useCallback((adet) => {
    const yeni = Array.from({ length: adet }, () => {
      let t = 0;
      for (let i = 0; i < n; i++) t += dist.gen();
      return t / n;
    });
    setMeans(prev => [...prev, ...yeni].slice(-2000));
    setFlash(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFlash(false), 350);
  }, [n, dist]);

  const sifirla = () => setMeans([]);
  const changeDist = (k) => { setDistKey(k); setMeans([]); };
  const changeN = (v) => { setN(v); setMeans([]); };

  // X ekseni etiketleri
  const xEtiketler = dist.xMax <= 1
    ? [0, 0.25, 0.5, 0.75, 1].map(v => ({ val: v, label: v.toFixed(2) }))
    : [0, 0.5, 1, 1.5, 2].map(v => ({ val: v, label: v.toFixed(1) }));

  const normalScore = Math.min(100, Math.round(means.length / 5));
  const cltKickedIn = n >= 30 || means.length >= 200;

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Merkezi Limit Teoremi: her şey eninde sonunda normal dağılır
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · istatistik · olasılık · 10 dakika
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          Dağılım ne kadar çarpık, garip veya simetrik olursa olsun —
          yeterince büyük bir örneklemden alınan <em>ortalamaların</em> dağılımı
          hep normal dağılıma yaklaşır. Bu, istatistiğin en güçlü ve en şaşırtıcı gerçeklerinden biri.
          Aşağıda gözlerinizle görün.
        </p>

        <h2>Nasıl çalışır?</h2>
        <p>
          Bir popülasyondan n tane değer seç, ortalamasını al.
          Bunu yüzlerce kez tekrarla. Bu ortalamaların dağılımı ne olur?
        </p>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
          borderRadius: '10px', padding: '14px 18px', margin: '1rem 0', lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#7F77DD' }}>Örneklem ortalaması</span>: X̄ = (X₁ + X₂ + ··· + Xₙ) / n</div>
          <div><span style={{ color: '#1D9E75' }}>Ortalama</span>: E[X̄] = μ &nbsp;&nbsp; (popülasyon ortalamasına eşit)</div>
          <div><span style={{ color: '#e8a04a' }}>Standart hata</span>: SE = σ / √n &nbsp;&nbsp; (n büyüdükçe küçülür)</div>
        </div>
        <p>
          Popülasyon dağılımı ne olursa olsun, n yeterince büyükse
          X̄ ~ N(μ, σ²/n) yakınsaması gerçekleşir. Genellikle n ≥ 30 yeterlidir.
        </p>

        {/* ─── İNTERAKTİF DEMO ─── */}
        <div style={{ border: '0.5px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', margin: '2rem 0' }}>

          {/* Başlık */}
          <div style={{
            padding: '14px 20px', borderBottom: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>⚡ Merkezi Limit Teoremi — Dene</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
              {means.length > 0 ? `${means.length} örneklem toplandı` : 'Örnekle butonuna bas'}
            </span>
          </div>

          <div style={{ padding: '18px 20px' }}>

            {/* Dağılım seçici */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                POPÜLASYONun DAĞILIMI
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.entries(DIST).map(([k, d]) => (
                  <button key={k} onClick={() => changeDist(k)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px',
                    border: '0.5px solid',
                    borderColor: distKey === k ? d.renk : 'var(--color-border)',
                    background: distKey === k ? `${d.renk}18` : 'transparent',
                    color: distKey === k ? d.renk : 'var(--color-text-soft)',
                    fontWeight: distKey === k ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    {d.sekil} {d.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '6px' }}>
                {dist.aciklama}
              </div>
            </div>

            {/* n seçici */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                ÖRNEKLEM BÜYÜKLÜĞÜ (n) — her örnekte kaç değer?
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {N_OPTS.map(v => {
                  const aktif = n === v;
                  return (
                    <button key={v} onClick={() => changeN(v)} style={{
                      width: '48px', height: '36px', borderRadius: '8px', fontSize: '13px',
                      border: '0.5px solid',
                      borderColor: aktif ? '#1D9E75' : 'var(--color-border)',
                      background: aktif ? 'rgba(29,158,117,0.12)' : 'transparent',
                      color: aktif ? '#1D9E75' : 'var(--color-text-soft)',
                      fontWeight: aktif ? 700 : 400,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}>
                      {v}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '6px' }}>
                Teorik standart hata: σ/√n = {dist.sigma.toFixed(3)}/√{n} = <strong style={{ color: '#1D9E75' }}>{teorikStd.toFixed(3)}</strong>
                {n >= 30 && <span style={{ color: '#1D9E75', fontWeight: 600 }}> ← n ≥ 30, CLT güçlü şekilde geçerli</span>}
              </div>
            </div>

            {/* Popülasyon histogramı */}
            <div style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.04em' }}>
                  POPÜLASYONun DAĞILIMI (μ={dist.mu.toFixed(2)}, σ={dist.sigma.toFixed(3)})
                </span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: `${dist.renk}18`, color: dist.renk, fontWeight: 600 }}>
                  {dist.label}
                </span>
              </div>
              <Histogram
                b={popBins} xMin={dist.xMin} xMax={dist.xMax}
                renk={dist.renk} svgH={PH} etiketler={xEtiketler}
              />
            </div>

            {/* Ok */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-mute)', padding: '4px 0', position: 'relative' }}>
              <span style={{
                background: flash ? 'rgba(29,158,117,0.12)' : 'var(--color-cream)',
                border: `0.5px solid ${flash ? 'rgba(29,158,117,0.4)' : 'var(--color-border)'}`,
                borderRadius: '999px', padding: '4px 14px', fontSize: '11px',
                color: flash ? '#1D9E75' : 'var(--color-text-mute)',
                fontWeight: flash ? 600 : 400,
                transition: 'all 0.2s',
                display: 'inline-block',
              }}>
                {flash ? `↓ n=${n} değer seç → ortalama hesapla → aşağıya ekle` : `↓ n=${n} değer seç → ortalama al`}
              </span>
            </div>

            {/* Örneklem ortalamaları histogramı */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.04em' }}>
                  ÖRNEKLEM ORTALAMALARI DAĞILIMI ({means.length} örneklem)
                </span>
                {normalEgri && (
                  <span style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', color: '#1D9E75' }}>
                    <span style={{ display: 'inline-block', width: '16px', height: '2px', background: '#1D9E75', borderRadius: '1px' }} />
                    Normal eğri (teorik)
                  </span>
                )}
              </div>
              <Histogram
                b={meanBins} xMin={dist.xMin} xMax={dist.xMax}
                renk="#1D9E75" svgH={MH} etiketler={xEtiketler}
                normalEgri={normalEgri} vurgu={cltKickedIn}
              />
              {means.length === 0 && (
                <div style={{
                  textAlign: 'center', fontSize: '13px',
                  color: 'var(--color-text-mute)', marginTop: '-100px',
                  paddingBottom: '80px', pointerEvents: 'none',
                }}>
                  Örnekle butonuna bas →
                </div>
              )}
            </div>

            {/* İstatistikler */}
            {means.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                {[
                  { label: 'Örneklem sayısı', val: means.length, renk: 'var(--color-accent)' },
                  { label: 'Ortalama (ampirik)', val: grandMean, renk: '#7F77DD' },
                  { label: 'Teorik μ', val: dist.mu.toFixed(3), renk: '#7F77DD', alt: '✓ yaklaşıyor mu?' },
                  { label: 'Std (ampirik)', val: amprikStd, renk: '#e8a04a' },
                  { label: 'Teorik σ/√n', val: teorikStd.toFixed(3), renk: '#e8a04a', alt: '✓ yaklaşıyor mu?' },
                ].map(({ label, val, renk, alt }) => (
                  <div key={label} style={{
                    background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
                    borderRadius: '10px', padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: renk, lineHeight: 1 }}>{val}</div>
                    {alt && <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '3px' }}>{alt}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { label: '1 örnekle', adet: 1 },
                { label: '10 örnekle', adet: 10 },
                { label: '100 örnekle', adet: 100 },
                { label: '500 örnekle', adet: 500 },
              ].map(({ label, adet }) => (
                <button key={adet} onClick={() => ornekle(adet)} style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  border: '0.5px solid rgba(29,158,117,0.5)',
                  background: 'rgba(29,158,117,0.10)', color: '#1D9E75',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                  transition: 'all 0.15s',
                }}>
                  {label}
                </button>
              ))}
              {means.length > 0 && (
                <button onClick={sifirla} style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  border: '0.5px solid var(--color-border)', background: 'transparent',
                  color: 'var(--color-text-mute)', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Sıfırla
                </button>
              )}
            </div>

            {/* İpucu */}
            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.6 }}>
              💡 <strong>Dene:</strong> Bimodal dağılımı seç, n=1 ile başla → çarpık görünür.
              Sonra n=30 yap → birkaç yüz örneklemden sonra normal eğriyle örtüşür.
            </div>
          </div>
        </div>

        <h2>Neden bu kadar önemli?</h2>
        <p>
          İstatistiğin büyük çoğunluğu bu teoreme dayanır.
          Güven aralığı hesaplarken, hipotez testi yaparken, A/B testi sonuçlarını
          yorumlarken — hepinde örneklem ortalamasının normal dağıldığını varsayarsın.
          Popülasyon dağılımı ne olursa olsun bu varsayım geçerli çünkü CLT var.
        </p>

        <h2>Ne zaman dikkatli olmalısın?</h2>
        <ul>
          <li><strong>Küçük örneklem (n &lt; 30):</strong> CLT henüz tam oturmamış olabilir, özellikle çarpık dağılımlarda</li>
          <li><strong>Ağır kuyruklu dağılımlar:</strong> Çok aşırı değerler içeren dağılımlar için daha büyük n gerekebilir</li>
          <li><strong>Bağımlı gözlemler:</strong> Zaman serisi, kümelenmiş veri — bağımsızlık varsayımı bozulabilir</li>
        </ul>

        <h2>Günlük hayatta CLT</h2>
        <ul>
          <li>100 müşterinin ortalama sipariş tutarı her gün biraz farklı — ama bu farkların dağılımı normaldir</li>
          <li>A/B testinde conversion rate'lerin farkı — normal dağılıma yaklaşır, bu yüzden z-testi kullanabiliriz</li>
          <li>Seçim anketleri — örneklem yeterince büyükse ±hata marjını güvenle hesaplarsın</li>
        </ul>

        <h2>Python'da</h2>
        <pre>{`import numpy as np
import matplotlib.pyplot as plt

# Bimodal popülasyondan örnekle
def bimodal():
    return np.random.normal(0.25, 0.08) if np.random.random() < 0.5 \
           else np.random.normal(0.75, 0.08)

n = 30          # örneklem büyüklüğü
tekrar = 1000   # kaç kez örnekle

ortalamalar = [
    np.mean([bimodal() for _ in range(n)])
    for _ in range(tekrar)
]

# Sonuç → normal dağılıma benzeyecek
plt.hist(ortalamalar, bins=40, density=True, color='#1D9E75', alpha=0.7)
plt.title(f'Örneklem ortalamaları — n={n}, tekrar={tekrar}')
plt.xlabel('x̄')
plt.show()

# Ampirik standart hata
print(f"Teorik SE: {0.271 / np.sqrt(n):.4f}")
print(f"Ampirik SE: {np.std(ortalamalar):.4f}")`}</pre>

        <h2>Özet</h2>
        <ul>
          <li>Popülasyon dağılımı ne olursa olsun, örneklem ortalamaları normal dağılıma yaklaşır</li>
          <li>n arttıkça yakınsama hızlanır, standart hata (σ/√n) küçülür</li>
          <li>n ≥ 30 çoğu durumda yeterlidir</li>
          <li>Güven aralığı, hipotez testi ve A/B testinin matematiksel temeli CLT'dir</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          İlgili: <a href="/yazilar/ab-test" style={{ color: '#1D9E75', textDecoration: 'none' }}>A/B test hesaplayıcı →</a>
        </p>
      </article>
    </main>
  );
}
