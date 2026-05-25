'use client';
import { useState } from 'react';

/* ─── Statistical Math ─── */

function gammaln(x) {
  const c = [76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
  let y = x, t = x + 5.5;
  t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (let j = 0; j < 6; j++) s += c[j] / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
}

function rbeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  if (x > (a + 1) / (a + b + 2)) return 1 - rbeta(1 - x, b, a);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - gammaln(a) - gammaln(b) + gammaln(a + b)) / a;
  let f = 1, C = 1, D = 1 - (a + b) * x / (a + 1);
  if (Math.abs(D) < 1e-30) D = 1e-30;
  D = 1 / D; f = D;
  for (let i = 1; i <= 300; i++) {
    const m = i;
    let d = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    D = 1 + d * D; if (Math.abs(D) < 1e-30) D = 1e-30;
    C = 1 + d / C; if (Math.abs(C) < 1e-30) C = 1e-30;
    D = 1 / D; f *= C * D;
    d = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    D = 1 + d * D; if (Math.abs(D) < 1e-30) D = 1e-30;
    C = 1 + d / C; if (Math.abs(C) < 1e-30) C = 1e-30;
    D = 1 / D; const delta = C * D; f *= delta;
    if (Math.abs(delta - 1) < 3e-10) break;
  }
  return front * f;
}

function normalCDF(z) {
  const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a[4] * t + a[3]) * t + a[2]) * t + a[1]) * t + a[0]) * t) * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

const tPVal = (t, df) => rbeta(df / (df + t * t), df / 2, 0.5);

function chiPVal(x, df) {
  if (x <= 0) return 1;
  const z = (Math.pow(x / df, 1 / 3) - (1 - 2 / (9 * df))) / Math.sqrt(2 / (9 * df));
  return 1 - normalCDF(z);
}

const fPVal = (F, d1, d2) => F <= 0 ? 1 : rbeta(d2 / (d2 + d1 * F), d2 / 2, d1 / 2);

const nv = (v) => parseFloat(v);
const fmt4 = (p) => p < 0.0001 ? '< 0.0001' : p.toFixed(4);

/* ─── Test Calculations ─── */

function calcOneSampleT(f) {
  const nn = nv(f.n), xbar = nv(f.mean), ss = nv(f.s), m0 = nv(f.mu0);
  if ([nn, xbar, ss, m0].some(isNaN) || nn < 2 || ss <= 0) return null;
  const t = (xbar - m0) / (ss / Math.sqrt(nn));
  const df = nn - 1;
  return { stat: t, statLabel: 't', df, p: tPVal(Math.abs(t), df) };
}

function calcTwoSampleT(f) {
  const nn1 = nv(f.n1), x1 = nv(f.mean1), ss1 = nv(f.s1);
  const nn2 = nv(f.n2), x2 = nv(f.mean2), ss2 = nv(f.s2);
  if ([nn1, x1, ss1, nn2, x2, ss2].some(isNaN) || nn1 < 2 || nn2 < 2 || ss1 <= 0 || ss2 <= 0) return null;
  const v1 = ss1 * ss1 / nn1, v2 = ss2 * ss2 / nn2;
  const t = (x1 - x2) / Math.sqrt(v1 + v2);
  const df = Math.pow(v1 + v2, 2) / (v1 * v1 / (nn1 - 1) + v2 * v2 / (nn2 - 1));
  return { stat: t, statLabel: 't', df: Math.round(df), p: tPVal(Math.abs(t), df) };
}

function calcPairedT(f) {
  const nn = nv(f.n), dbar = nv(f.dmean), sd = nv(f.ds);
  if ([nn, dbar, sd].some(isNaN) || nn < 2 || sd <= 0) return null;
  const t = dbar / (sd / Math.sqrt(nn));
  const df = nn - 1;
  return { stat: t, statLabel: 't', df, p: tPVal(Math.abs(t), df) };
}

function calcANOVA(groups) {
  if (groups.length < 2) return null;
  const g = groups.map(x => ({ nn: nv(x.n), xbar: nv(x.mean), s: nv(x.s) }));
  if (g.some(x => isNaN(x.nn) || isNaN(x.xbar) || isNaN(x.s) || x.nn < 2 || x.s <= 0)) return null;
  const N = g.reduce((a, x) => a + x.nn, 0);
  const grand = g.reduce((a, x) => a + x.nn * x.xbar, 0) / N;
  const SSb = g.reduce((a, x) => a + x.nn * Math.pow(x.xbar - grand, 2), 0);
  const SSw = g.reduce((a, x) => a + (x.nn - 1) * x.s * x.s, 0);
  const dfb = groups.length - 1, dfw = N - groups.length;
  const F = (SSb / dfb) / (SSw / dfw);
  return { stat: F, statLabel: 'F', df: `(${dfb}, ${dfw})`, p: fPVal(F, dfb, dfw) };
}

function calcChiSquare(f) {
  const a = nv(f.a), b = nv(f.b), c = nv(f.c), d = nv(f.d);
  if ([a, b, c, d].some(isNaN) || [a, b, c, d].some(v => v < 0)) return null;
  const nn = a + b + c + d;
  if (nn === 0 || (a + b) === 0 || (c + d) === 0 || (a + c) === 0 || (b + d) === 0) return null;
  const chi2 = nn * Math.pow(a * d - b * c, 2) / ((a + b) * (c + d) * (a + c) * (b + d));
  return { stat: chi2, statLabel: 'χ²', df: 1, p: chiPVal(chi2, 1) };
}

function calcPropZ(f) {
  const nn1 = nv(f.n1), xx1 = nv(f.x1), nn2 = nv(f.n2), xx2 = nv(f.x2);
  if ([nn1, xx1, nn2, xx2].some(isNaN) || nn1 < 1 || nn2 < 1 || xx1 < 0 || xx2 < 0 || xx1 > nn1 || xx2 > nn2) return null;
  const p1 = xx1 / nn1, p2 = xx2 / nn2;
  const pPool = (xx1 + xx2) / (nn1 + nn2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nn1 + 1 / nn2));
  if (se === 0) return null;
  const z = (p1 - p2) / se;
  return { stat: z, statLabel: 'z', df: null, p: 2 * (1 - normalCDF(Math.abs(z))), p1, p2 };
}

/* ─── Wizard Data ─── */

const Q1 = {
  question: '1. Verileriniz ne tür?',
  options: [
    { value: 'continuous', label: 'Sayısal', icon: '📏', desc: 'Ölçüm, puan, fiyat, süre, ağırlık…' },
    { value: 'categorical', label: 'Kategorik / Oran', icon: '📊', desc: 'Sayım, yüzde, sınıf, başarı/başarısızlık…' },
  ],
};

const Q2_CONT = {
  question: '2. Kaç grup var, ölçümler nasıl alındı?',
  options: [
    { value: 'one_sample_t', label: 'Tek grup — sabit referansa karşı', icon: '🎯', desc: 'Grubun ortalaması belirli bir μ₀ değerinden farklı mı?' },
    { value: 'two_sample_t', label: 'İki bağımsız grup', icon: '⚖️', desc: 'Farklı kişi veya örneklerden iki ölçüm seti' },
    { value: 'paired_t', label: 'Eşleştirilmiş ölçümler', icon: '🔄', desc: 'Aynı kişiden öncesi/sonrası veya çift ölçüm' },
    { value: 'one_way_anova', label: '3 veya daha fazla grup', icon: '📈', desc: 'Gruplar arasında ortalama farkı anlamlı mı?' },
  ],
};

const Q2_CAT = {
  question: '2. Ne test etmek istiyorsunuz?',
  options: [
    { value: 'chi_square', label: 'İki kategorik değişken ilişkisi', icon: '🔲', desc: 'Cinsiyet ile tercih arasında bağımlılık var mı?' },
    { value: 'proportion_z', label: 'İki oran karşılaştırma', icon: '📉', desc: 'A/B grubunun dönüşüm oranı farkı anlamlı mı?' },
  ],
};

const TEST_META = {
  one_sample_t:  { name: 'Tek Örneklem t-Testi', color: '#1D9E75', when: 'Sürekli veri · tek grup · bilinen μ₀ referansı' },
  two_sample_t:  { name: 'Bağımsız İki Örneklem t-Testi (Welch)', color: '#1D9E75', when: 'Sürekli veri · iki bağımsız grup' },
  paired_t:      { name: 'Eşleştirilmiş t-Testi', color: '#1D9E75', when: 'Sürekli veri · aynı bireyden iki ölçüm' },
  one_way_anova: { name: 'Tek Yönlü ANOVA', color: '#7F77DD', when: 'Sürekli veri · üç veya daha fazla bağımsız grup' },
  chi_square:    { name: 'Ki-Kare Bağımsızlık Testi (2×2)', color: '#7F77DD', when: 'Kategorik veri · 2×2 çapraz tablo' },
  proportion_z:  { name: 'İki Oran Z-Testi', color: '#e8a04a', when: 'İki grubun başarı oranları karşılaştırması' },
};

/* ─── Main Component ─── */

export default function HipotezArac() {
  const [q1, setQ1] = useState(null);
  const [test, setTest] = useState(null);
  const [inputs, setInputs] = useState({});
  const [groups, setGroups] = useState([
    { n: '', mean: '', s: '' },
    { n: '', mean: '', s: '' },
    { n: '', mean: '', s: '' },
  ]);
  const [alpha, setAlpha] = useState('0.05');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const setInp = (k, v) => { setInputs(p => ({ ...p, [k]: v })); setResult(null); };
  const setGroup = (i, k, v) => { setGroups(gs => gs.map((g, j) => j === i ? { ...g, [k]: v } : g)); setResult(null); };

  function pickQ1(val) {
    setQ1(val); setTest(null); setResult(null); setInputs({}); setError('');
  }

  function pickTest(val) {
    setTest(val); setResult(null); setInputs({}); setError('');
  }

  function calculate() {
    setError('');
    let r = null;
    if (test === 'one_sample_t')   r = calcOneSampleT(inputs);
    if (test === 'two_sample_t')   r = calcTwoSampleT(inputs);
    if (test === 'paired_t')       r = calcPairedT(inputs);
    if (test === 'one_way_anova')  r = calcANOVA(groups);
    if (test === 'chi_square')     r = calcChiSquare(inputs);
    if (test === 'proportion_z')   r = calcPropZ(inputs);
    if (!r) { setError('Tüm alanları geçerli sayılarla doldurun. (n ≥ 2, s > 0)'); return; }
    setResult({ ...r, alpha: parseFloat(alpha) });
  }

  const q2 = q1 === 'continuous' ? Q2_CONT : Q2_CAT;
  const meta = test ? TEST_META[test] : null;

  return (
    <main className="min-h-screen">
      <section style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <a href="/" style={{ fontSize: '13px', color: 'var(--color-text-mute)', textDecoration: 'none' }}>← Ana Sayfa</a>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '16px 0 8px' }}>
          <span style={{ fontSize: '32px' }}>🧪</span>
          <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 500, color: 'var(--color-text)', letterSpacing: '-0.01em', margin: 0 }}>
            Hipotez Testi Seçici
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-mute)', marginBottom: '36px', fontSize: '15px', lineHeight: 1.6 }}>
          Doğru istatistiksel testi adım adım seçin, parametreleri girin, sonucu ve yorumu alın.
        </p>

        {/* Q1 */}
        <Step label="1. Verileriniz ne tür?">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {Q1.options.map(o => (
              <OptionCard key={o.value} {...o} selected={q1 === o.value} onClick={() => pickQ1(o.value)} />
            ))}
          </div>
        </Step>

        {/* Q2 */}
        {q1 && (
          <Step label={q2.question}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {q2.options.map(o => (
                <OptionCard key={o.value} {...o} selected={test === o.value} onClick={() => pickTest(o.value)} />
              ))}
            </div>
          </Step>
        )}

        {/* Form */}
        {test && meta && (
          <>
            {/* Selected test badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
              borderRadius: '8px', background: 'var(--color-bg-raised)', border: `1px solid ${meta.color}`,
              marginBottom: '20px', fontSize: '13px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
              <strong style={{ color: 'var(--color-text)' }}>{meta.name}</strong>
              <span style={{ color: 'var(--color-text-mute)' }}>·</span>
              <span style={{ color: 'var(--color-text-mute)' }}>{meta.when}</span>
            </div>

            <div style={{ background: 'var(--color-bg-raised)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '28px' }}>

              {test === 'one_sample_t' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0 24px' }}>
                  <Inp label="Örneklem büyüklüğü (n)" v={inputs.n} set={v => setInp('n', v)} ph="30" />
                  <Inp label="Örneklem ortalaması (x̄)" v={inputs.mean} set={v => setInp('mean', v)} ph="105" />
                  <Inp label="Standart sapma (s)" v={inputs.s} set={v => setInp('s', v)} ph="15" />
                  <Inp label="Hipotez değeri (μ₀)" v={inputs.mu0} set={v => setInp('mu0', v)} ph="100" hint="H₀: μ = μ₀" />
                </div>
              )}

              {test === 'two_sample_t' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                  <div>
                    <GroupLabel>Grup 1</GroupLabel>
                    <Inp label="n₁" v={inputs.n1} set={v => setInp('n1', v)} ph="30" />
                    <Inp label="x̄₁" v={inputs.mean1} set={v => setInp('mean1', v)} ph="105" />
                    <Inp label="s₁" v={inputs.s1} set={v => setInp('s1', v)} ph="15" />
                  </div>
                  <div>
                    <GroupLabel>Grup 2</GroupLabel>
                    <Inp label="n₂" v={inputs.n2} set={v => setInp('n2', v)} ph="28" />
                    <Inp label="x̄₂" v={inputs.mean2} set={v => setInp('mean2', v)} ph="98" />
                    <Inp label="s₂" v={inputs.s2} set={v => setInp('s2', v)} ph="17" />
                  </div>
                </div>
              )}

              {test === 'paired_t' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0 24px' }}>
                  <Inp label="Çift sayısı (n)" v={inputs.n} set={v => setInp('n', v)} ph="20" />
                  <Inp label="Farkların ortalaması (d̄)" v={inputs.dmean} set={v => setInp('dmean', v)} ph="5.3" hint="d = sonrası − öncesi" />
                  <Inp label="Farkların standart sapması (s_d)" v={inputs.ds} set={v => setInp('ds', v)} ph="8.1" />
                </div>
              )}

              {test === 'one_way_anova' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px 24px' }}>
                    {groups.map((g, i) => (
                      <div key={i}>
                        <GroupLabel>Grup {String.fromCharCode(65 + i)}</GroupLabel>
                        <Inp label="n" v={g.n} set={v => setGroup(i, 'n', v)} ph="20" />
                        <Inp label="x̄" v={g.mean} set={v => setGroup(i, 'mean', v)} ph="45" />
                        <Inp label="s" v={g.s} set={v => setGroup(i, 's', v)} ph="8" />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {groups.length < 5 && (
                      <GhostBtn onClick={() => setGroups(g => [...g, { n: '', mean: '', s: '' }])}>+ Grup Ekle</GhostBtn>
                    )}
                    {groups.length > 2 && (
                      <GhostBtn onClick={() => setGroups(g => g.slice(0, -1))}>− Grup Sil</GhostBtn>
                    )}
                  </div>
                </>
              )}

              {test === 'chi_square' && (
                <>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
                    2×2 frekans tablosunu doldurun (her hücreye gözlemlenen sayıyı yazın):
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 14px', color: 'var(--color-text-mute)', fontWeight: 500, textAlign: 'left' }}></th>
                          <th style={{ padding: '8px 14px', color: 'var(--color-text-mute)', fontWeight: 500 }}>B = Evet</th>
                          <th style={{ padding: '8px 14px', color: 'var(--color-text-mute)', fontWeight: 500 }}>B = Hayır</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[['A = Evet', 'a', 'b'], ['A = Hayır', 'c', 'd']].map(([lbl, k1, k2]) => (
                          <tr key={lbl}>
                            <td style={{ padding: '6px 14px', fontWeight: 500, color: 'var(--color-text-mute)' }}>{lbl}</td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" min="0" value={inputs[k1] || ''} onChange={e => setInp(k1, e.target.value)}
                                placeholder="0" style={cellStyle} />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" min="0" value={inputs[k2] || ''} onChange={e => setInp(k2, e.target.value)}
                                placeholder="0" style={cellStyle} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {test === 'proportion_z' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                  <div>
                    <GroupLabel>Grup 1</GroupLabel>
                    <Inp label="Örneklem büyüklüğü (n₁)" v={inputs.n1} set={v => setInp('n1', v)} ph="500" />
                    <Inp label="Başarı sayısı (x₁)" v={inputs.x1} set={v => setInp('x1', v)} ph="45" hint="örn. dönüşüm yapan kişi" />
                  </div>
                  <div>
                    <GroupLabel>Grup 2</GroupLabel>
                    <Inp label="Örneklem büyüklüğü (n₂)" v={inputs.n2} set={v => setInp('n2', v)} ph="480" />
                    <Inp label="Başarı sayısı (x₂)" v={inputs.x2} set={v => setInp('x2', v)} ph="38" />
                  </div>
                </div>
              )}

              {/* Alpha selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-mute)', flexShrink: 0 }}>Anlamlılık düzeyi (α):</span>
                {['0.01', '0.05', '0.10'].map(a => (
                  <button key={a} onClick={() => setAlpha(a)} style={{
                    padding: '5px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontWeight: alpha === a ? 600 : 400,
                    background: alpha === a ? 'var(--color-accent)' : 'transparent',
                    color: alpha === a ? '#fff' : 'var(--color-text-soft)',
                    border: alpha === a ? 'none' : '1px solid var(--color-border)',
                  }}>{a}</button>
                ))}
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                  ⚠ {error}
                </p>
              )}

              <button onClick={calculate} style={{
                marginTop: '20px', padding: '11px 32px', borderRadius: '8px', border: 'none',
                background: 'var(--color-accent)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}>
                Hesapla →
              </button>
            </div>

            {/* Results */}
            {result && <Results result={result} testName={meta.name} color={meta.color} />}
          </>
        )}

        {/* Info box at bottom */}
        <div style={{ marginTop: '48px', padding: '20px', borderRadius: '12px', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--color-text-soft)' }}>Not:</strong> Bu araç özet istatistiklerle (n, x̄, s) çalışır — ham veri gerekmez. Ki-kare p-değeri Wilson-Hilferty yaklaşımı ile hesaplanır; iki örneklem t-testi eşit varyans varsaymayan Welch yöntemini kullanır. α düzeyi genellikle 0.05 seçilir; kritik kararlar için istatistikçiye danışın.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ─── Sub-components ─── */

function Step({ label, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </h2>
      {children}
    </div>
  );
}

function OptionCard({ icon, label, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
      border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
      background: selected ? 'var(--color-accent-bg, #E1F5EE)' : 'var(--color-bg-raised)',
      color: 'var(--color-text)', transition: 'border-color 0.12s',
    }}>
      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>{desc}</div>
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-mute)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </div>
  );
}

function Inp({ label, hint, v, set, ph }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', marginBottom: hint ? '2px' : '5px' }}>{label}</label>
      {hint && <p style={{ fontSize: '11px', color: 'var(--color-text-mute)', margin: '0 0 4px' }}>{hint}</p>}
      <input type="number" value={v || ''} onChange={e => set(e.target.value)} placeholder={ph}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '13px', boxSizing: 'border-box' }} />
    </div>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontSize: '12px', padding: '6px 14px', borderRadius: '7px', border: '1px solid var(--color-border)',
      background: 'transparent', color: 'var(--color-text-soft)', cursor: 'pointer',
    }}>{children}</button>
  );
}

const cellStyle = {
  width: '80px', padding: '7px 8px', borderRadius: '7px',
  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
  color: 'var(--color-text)', fontSize: '14px', textAlign: 'center',
};

function Results({ result, testName, color }) {
  const { stat, statLabel, df, p, alpha, p1, p2 } = result;
  const reject = p < alpha;

  return (
    <div style={{ marginTop: '20px', border: `1px solid ${reject ? '#1D9E75' : 'var(--color-border)'}`, borderRadius: '14px', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', background: reject ? '#E1F5EE' : 'var(--color-bg-raised)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{reject ? '✅' : '❌'}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: reject ? '#0F6E56' : 'var(--color-text)' }}>
            H₀ {reject ? 'reddedilir' : 'reddedilemez'}
          </div>
          <div style={{ fontSize: '12px', color: reject ? '#0F6E56' : 'var(--color-text-mute)', marginTop: '2px' }}>
            p {reject ? '<' : '≥'} α = {alpha} — fark istatistiksel olarak {reject ? 'anlamlı' : 'anlamlı değil'}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
        <StatBox label={`${statLabel} istatistiği`} val={stat.toFixed(4)} />
        {df !== null && <StatBox label="Serbestlik derecesi" val={String(df)} />}
        <StatBox label="p-değeri" val={fmt4(p)} accent={reject} />
        {p1 !== undefined && <StatBox label="p̂₁ (oran 1)" val={(p1 * 100).toFixed(2) + '%'} />}
        {p2 !== undefined && <StatBox label="p̂₂ (oran 2)" val={(p2 * 100).toFixed(2) + '%'} />}
        {p1 !== undefined && p2 !== undefined && (
          <StatBox label="Fark" val={((p1 - p2) * 100).toFixed(2) + ' pp'} />
        )}
      </div>

      {/* p-value visual */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '6px' }}>p-değeri konumu</div>
        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--color-border)', position: 'relative', overflow: 'visible' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(p * 100, 100)}%`, borderRadius: '4px', background: reject ? '#1D9E75' : '#94a3b8', transition: 'width 0.4s' }} />
          <div style={{ position: 'absolute', left: `${alpha * 100}%`, top: '-4px', width: '2px', height: '16px', background: '#ef4444', borderRadius: '1px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-mute)', marginTop: '4px' }}>
          <span>0</span>
          <span style={{ color: '#ef4444' }}>α = {alpha}</span>
          <span>1</span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, val, accent }) {
  return (
    <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px' }}>
      <div style={{ fontSize: '10px', color: 'var(--color-text-mute)', marginBottom: '5px', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: '17px', fontWeight: 700, color: accent ? '#0F6E56' : 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}>{val}</div>
    </div>
  );
}
