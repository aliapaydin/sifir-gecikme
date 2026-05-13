'use client';
import { useState, useRef, useCallback } from 'react';

function detectDelimiter(line) {
  const counts = { ',': 0, ';': 0, '\t': 0, '|': 0 };
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    if (!inQuotes && counts[ch] !== undefined) counts[ch]++;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseRow(line, delimiter) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const delimiter = detectDelimiter(lines[0]);
  const headers = parseRow(lines[0], delimiter);
  const rows = lines.slice(1).filter(l => l.trim()).map(l => parseRow(l, delimiter));
  return { headers, rows };
}

function analyzeData(headers, rows) {
  return headers.map((header, colIdx) => {
    const values = rows.map(row => (row[colIdx] ?? '').trim());
    const nonEmpty = values.filter(v => v !== '');
    const missing = values.length - nonEmpty.length;

    const nums = nonEmpty
      .map(v => parseFloat(v.replace(/\./g, '').replace(',', '.')))
      .filter(n => !isNaN(n) && isFinite(n));
    const isNumeric = nums.length >= nonEmpty.length * 0.75 && nonEmpty.length > 0;

    if (isNumeric && nums.length > 0) {
      const sorted = [...nums].sort((a, b) => a - b);
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      return {
        type: 'numeric', header, total: values.length, missing,
        missingPct: (missing / values.length * 100).toFixed(1),
        count: nums.length,
        min: sorted[0], max: sorted[sorted.length - 1],
        mean, median: sorted[Math.floor(sorted.length / 2)],
        std: Math.sqrt(variance), q1, q3, values: nums,
      };
    } else {
      const freq = {};
      nonEmpty.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      return {
        type: 'categorical', header, total: values.length, missing,
        missingPct: (missing / values.length * 100).toFixed(1),
        count: nonEmpty.length, unique: sorted.length,
        topValues: sorted.slice(0, 6),
      };
    }
  });
}

function Histogram({ values, color = '#1D9E75' }) {
  const BINS = 10;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const counts = Array(BINS).fill(0);
  values.forEach(v => {
    const idx = Math.min(Math.floor(((v - min) / range) * BINS), BINS - 1);
    counts[idx]++;
  });
  const maxCount = Math.max(...counts, 1);
  const W = 220, H = 52;
  const bw = W / BINS;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {counts.map((c, i) => {
        const h = (c / maxCount) * (H - 4);
        return (
          <rect key={i} x={i * bw + 1} y={H - h} width={bw - 2} height={h}
            rx="1.5" fill={color} opacity="0.75" />
        );
      })}
    </svg>
  );
}

function TopBars({ topValues, color = '#7F77DD' }) {
  const maxCount = topValues[0]?.[1] || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {topValues.map(([val, count]) => (
        <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <div style={{ width: '88px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-soft)', flexShrink: 0 }} title={val}>
            {val || '(boş)'}
          </div>
          <div style={{ flex: 1, background: 'var(--color-border)', borderRadius: '3px', height: '7px', overflow: 'hidden' }}>
            <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ width: '30px', textAlign: 'right', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{count}</div>
        </div>
      ))}
    </div>
  );
}

function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1000000) return (n / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M';
  if (Math.abs(n) >= 1000) return n.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 10) return n.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 4 });
}

const ORNEK = `siparis_id,musteri,sehir,urun,kategori,fiyat,adet,puan
1001,Ahmet Yılmaz,İstanbul,Laptop,Elektronik,15000,1,4.5
1002,Ayşe Kaya,Ankara,Kulaklık,Elektronik,850,2,4.8
1003,Mehmet Demir,İzmir,Kitap,Eğitim,120,5,4.2
1004,Fatma Çelik,Bursa,Laptop,Elektronik,14500,1,4.3
1005,Ali Şahin,İstanbul,Tablet,Elektronik,6500,1,4.6
1006,Zeynep Arslan,Ankara,Kulaklık,Elektronik,920,1,4.9
1007,Hasan Koç,İzmir,Kalem Seti,Kırtasiye,45,10,3.8
1008,Emine Yıldız,İstanbul,Laptop,Elektronik,16200,1,4.7
1009,Mustafa Kurt,Adana,Tablet,Elektronik,5800,2,4.1
1010,Hatice Öztürk,İstanbul,Kitap,Eğitim,89,3,4.4
1011,İbrahim Çalışkan,Ankara,Laptop,Elektronik,15800,1,4.6
1012,Meryem Doğan,İzmir,Kırtasiye,Kırtasiye,67,8,3.9
1013,Yusuf Güneş,Bursa,Tablet,Elektronik,7200,1,4.5
1014,Esra Aydın,İstanbul,Kulaklık,Elektronik,780,3,4.7
1015,Serkan Polat,Ankara,Kitap,Eğitim,150,2,4.3
1016,Seda Kara,İzmir,Laptop,Elektronik,13900,1,4.4
1017,Burak Yılmaz,İstanbul,Tablet,Elektronik,6100,1,4.2
1018,Gül Şen,Bursa,Kulaklık,Elektronik,660,2,4.6
1019,Kemal Acar,Ankara,Kitap,Eğitim,95,4,4.1
1020,Derya Kılıç,İstanbul,Laptop,Elektronik,15500,1,4.8`;

export default function CSVAnaliz() {
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState('');
  const [suruklama, setSuruklama] = useState(false);
  const [metin, setMetin] = useState('');
  const [sekme, setSekme] = useState('yukle');
  const fileRef = useRef();

  const isle = useCallback((text) => {
    setHata('');
    const parsed = parseCSV(text);
    if (!parsed || parsed.rows.length === 0) {
      setHata('CSV okunamadı. Başlık satırı ve en az bir veri satırı olması gerekiyor.');
      return;
    }
    if (parsed.headers.length < 2) {
      setHata('Sütun ayracı bulunamadı. Virgül, noktalı virgül, tab veya pipe (|) deneyin.');
      return;
    }
    const kolonlar = analyzeData(parsed.headers, parsed.rows);
    setVeri({ satirSayisi: parsed.rows.length, kolonlar, dosyaAdi: '' });
  }, []);

  const dosyaAl = (file) => {
    if (!file) return;
    if (!file.name.match(/\.(csv|tsv|txt)$/i)) {
      setHata('Yalnızca .csv, .tsv veya .txt dosyaları destekleniyor.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => isle(e.target.result);
    reader.onerror = () => setHata('Dosya okunamadı.');
    reader.readAsText(file, 'UTF-8');
  };

  const toplamEksik = veri?.kolonlar.reduce((a, k) => a + k.missing, 0) ?? 0;
  const toplamHucre = veri ? veri.satirSayisi * veri.kolonlar.length : 0;
  const eksikPct = toplamHucre > 0 ? (toplamEksik / toplamHucre * 100).toFixed(1) : '0';
  const sayisalSayisi = veri?.kolonlar.filter(k => k.type === 'numeric').length ?? 0;
  const kategorikSayisi = veri?.kolonlar.filter(k => k.type === 'categorical').length ?? 0;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '80px' }}>

      {/* Başlık */}
      <div style={{ borderBottom: '0.5px solid var(--color-border)', paddingTop: '48px', paddingBottom: '36px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span className="badge badge-guide">araç</span>
            <span className="badge badge-guide">client-side · veriler tarayıcıdan çıkmaz</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '10px' }}>
            CSV Analiz Aracı
          </h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '560px' }}>
            Dosyanı yükle veya yapıştır. Veri tipleri, eksik değerler, istatistikler ve dağılımlar saniyeler içinde.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>

        {!veri ? (
          <div style={{ paddingTop: '40px', maxWidth: '640px' }}>
            {/* Sekmeler */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '20px',
              background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
              borderRadius: '10px', padding: '4px', width: 'fit-content',
            }}>
              {[['yukle', '📂 Dosya yükle'], ['yapistir', '📋 CSV yapıştır']].map(([key, label]) => (
                <button key={key} onClick={() => setSekme(key)} style={{
                  padding: '7px 18px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
                  background: sekme === key ? 'var(--color-bg)' : 'transparent',
                  color: sekme === key ? 'var(--color-text)' : 'var(--color-text-mute)',
                  boxShadow: sekme === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {sekme === 'yukle' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setSuruklama(true); }}
                onDragLeave={() => setSuruklama(false)}
                onDrop={(e) => { e.preventDefault(); setSuruklama(false); dosyaAl(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${suruklama ? '#7F77DD' : 'var(--color-border)'}`,
                  borderRadius: '16px', padding: '64px 40px', textAlign: 'center', cursor: 'pointer',
                  background: suruklama ? '#EEEDFE' : 'var(--color-cream-card)',
                  transition: 'all 0.2s',
                }}
              >
                <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{ display: 'none' }}
                  onChange={(e) => dosyaAl(e.target.files[0])} />
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>📂</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px', fontSize: '15px' }}>
                  Dosyayı sürükle veya tıkla
                </div>
                <div style={{ color: 'var(--color-text-mute)', fontSize: '13px' }}>
                  CSV, TSV veya TXT · virgül, noktalı virgül, tab desteklenir
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  value={metin}
                  onChange={(e) => setMetin(e.target.value)}
                  placeholder={'isim,yas,sehir,maas\nAhmet,28,İstanbul,45000\nAyşe,32,Ankara,52000'}
                  style={{
                    width: '100%', height: '220px', padding: '16px', borderRadius: '12px', boxSizing: 'border-box',
                    border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)',
                    color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '13px',
                    resize: 'vertical', outline: 'none', lineHeight: 1.6,
                  }}
                />
                <button
                  onClick={() => metin.trim() && isle(metin)}
                  style={{
                    marginTop: '12px', padding: '11px 28px', background: '#7F77DD', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  }}
                >
                  Analiz Et →
                </button>
              </div>
            )}

            {hata && (
              <div style={{ marginTop: '16px', padding: '12px 16px', background: '#FEE2E2', borderRadius: '8px', color: '#B91C1C', fontSize: '14px' }}>
                ⚠ {hata}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => isle(ORNEK)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F77DD', fontSize: '14px' }}
              >
                Örnek e-ticaret verisiyle dene →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ paddingTop: '32px' }}>
            {/* Özet */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                {[
                  { val: veri.satirSayisi.toLocaleString('tr-TR'), label: 'satır', color: '#1D9E75' },
                  { val: veri.kolonlar.length, label: 'sütun', color: '#7F77DD' },
                  { val: sayisalSayisi, label: 'sayısal', color: '#1D9E75' },
                  { val: kategorikSayisi, label: 'kategorik', color: '#e8a04a' },
                  { val: eksikPct + '%', label: 'eksik', color: parseFloat(eksikPct) > 0 ? '#E24B4A' : '#1D9E75' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="card" style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setVeri(null); setMetin(''); setHata(''); }}
                style={{
                  padding: '9px 18px', background: 'var(--color-cream-card)',
                  border: '0.5px solid var(--color-border)', borderRadius: '8px',
                  cursor: 'pointer', color: 'var(--color-text-soft)', fontSize: '13px',
                }}
              >
                ↩ Yeni dosya
              </button>
            </div>

            {/* Kolon kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
              {veri.kolonlar.map((k) => (
                <div key={k.header} className="card" style={{
                  padding: '20px',
                  borderTop: `3px solid ${k.type === 'numeric' ? '#1D9E75' : '#7F77DD'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '14px', wordBreak: 'break-all', flex: 1 }}>
                      {k.header}
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                      background: k.type === 'numeric' ? '#E1F5EE' : '#EEEDFE',
                      color: k.type === 'numeric' ? '#0F6E56' : '#534AB7',
                    }}>
                      {k.type === 'numeric' ? 'sayısal' : 'kategorik'}
                    </span>
                  </div>

                  {k.missing > 0 && (
                    <div style={{ fontSize: '12px', color: '#DC2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>⚠</span>
                      <span>{k.missing} eksik değer ({k.missingPct}%)</span>
                    </div>
                  )}

                  {k.type === 'numeric' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '14px' }}>
                        {[
                          ['min', fmt(k.min)],
                          ['max', fmt(k.max)],
                          ['ort', fmt(k.mean)],
                          ['med', fmt(k.median)],
                          ['std', fmt(k.std)],
                          ['adet', k.count.toLocaleString('tr-TR')],
                        ].map(([label, val]) => (
                          <div key={label} style={{ background: 'var(--color-bg)', borderRadius: '6px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '9px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <Histogram values={k.values} color="#1D9E75" />
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-soft)', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#7F77DD' }}>{k.unique.toLocaleString('tr-TR')}</span> benzersiz · {k.count.toLocaleString('tr-TR')} dolu hücre
                      </div>
                      <TopBars topValues={k.topValues} color="#7F77DD" />
                      {k.unique > 6 && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '8px' }}>
                          +{(k.unique - 6).toLocaleString('tr-TR')} değer daha
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
