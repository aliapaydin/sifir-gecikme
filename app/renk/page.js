'use client';
import { useState, useCallback, useEffect } from 'react';

const TIPLER = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'kategorik', label: 'Kategorik' },
  { id: 'sirali', label: 'Sıralı' },
  { id: 'ayrisik', label: 'Ayrışık' },
  { id: 'renk-koru', label: 'Renk körü dostu' },
];

const PALETLER = [
  {
    id: 'tableau10', ad: 'Tableau 10', tip: 'kategorik',
    aciklama: "Tableau'nun varsayılan paleti. 10 kategoriye kadar ideal, iyi kontrast.",
    ne_zaman: 'Bar, çizgi ve dağılım grafiklerinde farklı kategorileri ayırt etmek için.',
    renkler: ['#4E79A7','#F28E2B','#E15759','#76B7B2','#59A14F','#EDC948','#B07AA1','#FF9DA7','#9C755F','#BAB0AC'],
  },
  {
    id: 'set2', ad: 'Set 2', tip: 'kategorik',
    aciklama: 'ColorBrewer kategorik paleti. Dengeli doygunluk, 8 kategoriye kadar.',
    ne_zaman: 'Alan grafiklerinde ve pasta dilimleri için yumuşak ama ayırt edilebilir renkler.',
    renkler: ['#66C2A5','#FC8D62','#8DA0CB','#E78AC3','#A6D854','#FFD92F','#E5C494','#B3B3B3'],
  },
  {
    id: 'dark2', ad: 'Dark 2', tip: 'kategorik',
    aciklama: 'Koyu, doygun kategorik palet. Açık arka planda çok etkili.',
    ne_zaman: 'Çizgi grafiklerinde ve scatter plotlarda vurgu için.',
    renkler: ['#1B9E77','#D95F02','#7570B3','#E7298A','#66A61E','#E6AB02','#A6761D','#666666'],
  },
  {
    id: 'pastel', ad: 'Pastel', tip: 'kategorik',
    aciklama: 'Yumuşak, düşük doygunluklu palet. Arka plan dolgusu için ideal.',
    ne_zaman: 'Büyük dolgulu alanlarda ve kalabalık grafiklerde göz yormaz.',
    renkler: ['#FBB4AE','#B3CDE3','#CCEBC5','#DECBE4','#FED9A6','#FFFFCC','#E5D8BD','#FDDAEC'],
  },
  {
    id: 'okabe', ad: 'Okabe-Ito', tip: 'renk-koru',
    aciklama: 'Deuteranopia ve protanopia dahil tüm yaygın renk körlüğü türlerinde ayırt edilebilir.',
    ne_zaman: 'Akademik yayın, sunum ve erişilebilirlik gerektiren her ortam.',
    renkler: ['#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7','#000000'],
  },
  {
    id: 'wong', ad: 'Wong 2011', tip: 'renk-koru',
    aciklama: "Nature Methods'da yayımlanan, bilimsel yayınlar için renk körü dostu standart palet.",
    ne_zaman: 'Biyomedikal ve bilimsel görselleştirmede altın standart.',
    renkler: ['#000000','#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7'],
  },
  {
    id: 'tol', ad: 'Tol Bright', tip: 'renk-koru',
    aciklama: 'Paul Tol tarafından geliştirilen, tüm renk körlüğü türlerine uygun parlak palet.',
    ne_zaman: 'Küçük nokta ve ince çizgilerde bile renkleri karıştırmadan ayırt edebilmek için.',
    renkler: ['#4477AA','#EE6677','#228833','#CCBB44','#66CCEE','#AA3377','#BBBBBB'],
  },
  {
    id: 'blues', ad: 'Blues', tip: 'sirali',
    aciklama: 'Açıktan koyuya sıralı mavi palet. Miktar ve yoğunluk göstermek için klasik.',
    ne_zaman: 'Choropleth haritalar, heatmap ve nüfus yoğunluğu grafiklerinde.',
    renkler: ['#EFF3FF','#BDD7E7','#6BAED6','#3182BD','#08519C'],
  },
  {
    id: 'greens', ad: 'Greens', tip: 'sirali',
    aciklama: 'Açıktan koyuya sıralı yeşil palet. Büyüme ve artış için.',
    ne_zaman: 'Ekonomik büyüme, gelir artışı ve doğa verileri için.',
    renkler: ['#EDF8E9','#BAE4B3','#74C476','#31A354','#006D2C'],
  },
  {
    id: 'teal', ad: 'Teal', tip: 'sirali',
    aciklama: 'Sıfır Gecikme vurgu rengiyle uyumlu, ferah sıralı palet.',
    ne_zaman: "Site içi görselleştirmelerde marka rengiyle tutarlı heatmap'ler için.",
    renkler: ['#E1F5EE','#9FE1CB','#4CC4A0','#1D9E75','#0F6E56'],
  },
  {
    id: 'oranges', ad: 'Oranges', tip: 'sirali',
    aciklama: 'Açıktan koyuya turuncu. Sıcaklık, fiyat ve stres verisi.',
    ne_zaman: 'Isı haritaları, fiyat yoğunlukları ve uyarı sistemleri için.',
    renkler: ['#FFF5EB','#FDD0A2','#FDAE6B','#F16913','#8C2D04'],
  },
  {
    id: 'viridis', ad: 'Viridis', tip: 'sirali',
    aciklama: 'Renk körü dostu, yüksek kontrast. Heatmap için endüstri standardı.',
    ne_zaman: 'Bilimsel görselleştirme ve 2D yoğunluk haritalarında.',
    renkler: ['#440154','#3B528B','#21908C','#5DC863','#FDE725'],
  },
  {
    id: 'rdbu', ad: 'Red-Blue', tip: 'ayrisik',
    aciklama: 'Sıfır etrafında pozitif/negatif göstermek için standart. Korelasyon matrislerinde klasik.',
    ne_zaman: 'Korelasyon matrisleri, fark haritaları, finansal getiri görselleştirme.',
    renkler: ['#B2182B','#EF8A62','#FDDBC7','#F7F7F7','#D1E5F0','#67A9CF','#2166AC'],
  },
  {
    id: 'piyg', ad: 'Pink-Green', tip: 'ayrisik',
    aciklama: 'Renk körü dostu ayrışık palet. İki kutuplu verilerde etkili.',
    ne_zaman: 'Demografik değişim, oy oranı farkı ve sentiment analizi.',
    renkler: ['#8E0152','#DE77AE','#FDE0EF','#F7F7F7','#E6F5D0','#7FBC41','#276419'],
  },
  {
    id: 'brbg', ad: 'Brown-Green', tip: 'ayrisik',
    aciklama: 'Toprak tonlarından yeşile ayrışık palet. Kuraklık indeksleri için geliştirildi.',
    ne_zaman: 'İklim, tarım ve çevre verisi görselleştirmelerinde.',
    renkler: ['#543005','#BF812D','#F6E8C3','#F5F5F5','#C7EAE5','#35978F','#003C30'],
  },
];

const ONIZLEME_TIPLERI = [
  { id: 'bar', label: 'Bar' },
  { id: 'donut', label: 'Donut' },
  { id: 'cizgi', label: 'Çizgi' },
];

function BarOnizleme({ renkler }) {
  const vals = [82, 64, 91, 47, 73, 55, 85, 38, 68, 79];
  const liste = renkler.slice(0, Math.min(renkler.length, 7));
  const W = 260, H = 110, BOT = 15;
  const bw = (W - 20) / liste.length - 4;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {liste.map((renk, i) => {
        const h = (vals[i] / 95) * (H - BOT - 8);
        const x = 10 + i * (bw + 4);
        return <rect key={i} x={x} y={H - BOT - h} width={bw} height={h} rx="3" fill={renk} />;
      })}
      <line x1="8" y1={H - BOT} x2={W - 8} y2={H - BOT} stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function DonutOnizleme({ renkler }) {
  const liste = renkler.slice(0, Math.min(renkler.length, 6));
  const vals = [30, 22, 17, 13, 10, 8].slice(0, liste.length);
  const toplam = vals.reduce((a, b) => a + b, 0);
  const CX = 60, CY = 60, R = 44, stroke = 16;
  const C = 2 * Math.PI * R;
  let cumSum = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
      {vals.map((v, i) => {
        const pct = v / toplam;
        const dash = pct * C;
        const offset = C / 4 - cumSum;
        cumSum += dash;
        return (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={liste[i]} strokeWidth={stroke}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={offset}
          />
        );
      })}
    </svg>
  );
}

function CizgiOnizleme({ renkler }) {
  const liste = renkler.slice(0, Math.min(renkler.length, 5));
  const seriler = [
    [18,32,28,45,38,55,48,62],
    [40,30,48,35,52,42,60,50],
    [55,45,60,52,42,65,55,70],
    [30,50,35,58,45,38,72,58],
    [22,40,55,30,65,50,35,80],
  ];
  const W = 260, H = 110, BOT = 15, TOP = 8;
  const usable = H - BOT - TOP;
  const pts = (s) => s.map((v, i) => `${10 + i * (W - 20) / (s.length - 1)},${H - BOT - (v / 85) * usable}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {liste.map((renk, i) => (
        <polyline key={i} points={pts(seriler[i])} fill="none"
          stroke={renk} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      ))}
      <line x1="8" y1={H - BOT} x2={W - 8} y2={H - BOT} stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function Kopyala({ metin, children, style }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const tikla = useCallback(() => {
    navigator.clipboard.writeText(metin).then(() => {
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1400);
    });
  }, [metin]);
  return (
    <button onClick={tikla} title={`Kopyala: ${metin}`} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...style }}>
      {kopyalandi ? <span style={{ color: '#1D9E75', fontSize: '11px', fontWeight: 700 }}>✓</span> : children}
    </button>
  );
}

export default function RenkPaleti() {
  const [aktifTip, setAktifTip] = useState('tumu');
  const [secili, setSecili] = useState(PALETLER[0]);
  const [onizlemeTip, setOnizlemeTip] = useState('bar');
  const [tumKopyalandi, setTumKopyalandi] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtreli = aktifTip === 'tumu' ? PALETLER : PALETLER.filter(p => p.tip === aktifTip);

  const tumunuKopyala = () => {
    navigator.clipboard.writeText(secili.renkler.join(', ')).then(() => {
      setTumKopyalandi(true);
      setTimeout(() => setTumKopyalandi(false), 1500);
    });
  };

  const TIP_ETIKET = { kategorik: 'kategorik', sirali: 'sıralı', ayrisik: 'ayrışık', 'renk-koru': 'renk körü dostu' };
  const TIP_RENK = { kategorik: { bg: '#E1F5EE', color: '#0F6E56' }, sirali: { bg: '#EEEDFE', color: '#534AB7' }, ayrisik: { bg: '#FAEEDA', color: '#854F0B' }, 'renk-koru': { bg: '#FEE2E2', color: '#991B1B' } };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '80px', overflowX: 'hidden' }}>

      {/* Başlık */}
      <div style={{ borderBottom: '0.5px solid var(--color-border)', paddingTop: '48px', paddingBottom: '36px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span className="badge badge-guide">araç</span>
            <span className="badge badge-guide">görselleştirme</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '10px' }}>
            Renk Paleti Seçici
          </h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '560px' }}>
            Kategorik, sıralı, ayrışık ve renk körü dostu paletler. Tıkla, önizle, hex kodu kopyala.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: `0 ${isMobile ? '16px' : '24px'}`, paddingTop: '32px', width: '100%', boxSizing: 'border-box' }}>

        {/* Filtre sekmeleri */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {TIPLER.map(t => (
            <button key={t.id} onClick={() => setAktifTip(t.id)} style={{
              padding: '7px 16px', borderRadius: '20px', border: '0.5px solid var(--color-border)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.15s',
              background: aktifTip === t.id ? 'var(--color-text)' : 'var(--color-cream-card)',
              color: aktifTip === t.id ? 'var(--color-bg)' : 'var(--color-text-soft)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.2fr) minmax(0,1fr)', gap: '24px', alignItems: 'start', minWidth: 0 }}>

          {/* Sol: Palet listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            {filtreli.map(p => {
              const aktif = secili?.id === p.id;
              const tc = TIP_RENK[p.tip];
              return (
                <button
                  key={p.id}
                  onClick={() => setSecili(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                    borderRadius: '12px', border: `1.5px solid ${aktif ? 'var(--color-text)' : 'var(--color-border)'}`,
                    background: aktif ? 'var(--color-cream-card)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    boxShadow: aktif ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {/* Renk şeridi */}
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    {p.renkler.slice(0, isMobile ? 5 : 8).map((r, i) => (
                      <div key={i} style={{ width: isMobile ? '14px' : '16px', height: '32px', borderRadius: '4px', background: r }} />
                    ))}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)' }}>{p.ad}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', background: tc.bg, color: tc.color, flexShrink: 0 }}>
                        {TIP_ETIKET[p.tip]}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.renkler.length} renk · {p.aciklama.slice(0, 50)}{p.aciklama.length > 50 ? '…' : ''}
                    </div>
                  </div>

                  {aktif && <span style={{ color: 'var(--color-text)', flexShrink: 0, fontSize: '18px' }}>›</span>}
                </button>
              );
            })}
          </div>

          {/* Sağ: Detay paneli */}
          {secili && (
            <div style={{ position: isMobile ? 'static' : 'sticky', top: '80px', minWidth: 0 }}>
              <div className="card" style={{ padding: '24px' }}>

                {/* Başlık */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>{secili.ad}</h2>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: TIP_RENK[secili.tip].bg, color: TIP_RENK[secili.tip].color }}>
                      {TIP_ETIKET[secili.tip]}
                    </span>
                  </div>
                  <button
                    onClick={tumunuKopyala}
                    style={{
                      padding: '7px 14px', border: '0.5px solid var(--color-border)',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                      background: tumKopyalandi ? '#E1F5EE' : 'var(--color-cream-card)',
                      color: tumKopyalandi ? '#0F6E56' : 'var(--color-text-soft)',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                  >
                    {tumKopyalandi ? '✓ Kopyalandı' : 'Tümünü kopyala'}
                  </button>
                </div>

                {/* Açıklama */}
                <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.6, marginBottom: '6px' }}>
                  {secili.aciklama}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5, marginBottom: '20px' }}>
                  <span style={{ fontWeight: 600 }}>Ne zaman: </span>{secili.ne_zaman}
                </p>

                {/* Renk swatchları */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {secili.renkler.map((r, i) => (
                    <Kopyala key={i} metin={r}>
                      <div title={`Kopyala: ${r}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: r, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
                        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-mute)', letterSpacing: '0.02em' }}>{r}</span>
                      </div>
                    </Kopyala>
                  ))}
                </div>

                {/* Önizleme */}
                <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                    {ONIZLEME_TIPLERI.map(t => (
                      <button key={t.id} onClick={() => setOnizlemeTip(t.id)} style={{
                        padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 500,
                        background: onizlemeTip === t.id ? 'var(--color-text)' : 'var(--color-bg)',
                        color: onizlemeTip === t.id ? 'var(--color-bg)' : 'var(--color-text-mute)',
                      }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: 'var(--color-bg)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '130px' }}>
                    {onizlemeTip === 'bar' && <BarOnizleme renkler={secili.renkler} />}
                    {onizlemeTip === 'donut' && <DonutOnizleme renkler={secili.renkler} />}
                    {onizlemeTip === 'cizgi' && <CizgiOnizleme renkler={secili.renkler} />}
                  </div>
                </div>

                {/* CSS snippet */}
                <div style={{ marginTop: '16px', borderTop: '0.5px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    CSS / JS
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{
                      background: 'var(--color-bg)', borderRadius: '8px', padding: '12px',
                      fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-soft)',
                      overflowX: 'auto', margin: 0, lineHeight: 1.7,
                      border: '0.5px solid var(--color-border)',
                    }}>
                      {`const ${secili.id.replace(/-/g,'_')} = [\n  ${secili.renkler.map(r => `'${r}'`).join(',\n  ')}\n];`}
                    </pre>
                    <Kopyala
                      metin={`const ${secili.id.replace(/-/g,'_')} = [\n  ${secili.renkler.map(r => `'${r}'`).join(',\n  ')}\n];`}
                      style={{ position: 'absolute', top: '8px', right: '8px' }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', background: 'var(--color-cream-card)', padding: '3px 8px', borderRadius: '5px', border: '0.5px solid var(--color-border)' }}>
                        kopyala
                      </span>
                    </Kopyala>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rehber kutuları */}
        <div style={{ marginTop: '48px', borderTop: '0.5px solid var(--color-border)', paddingTop: '40px' }}>
          <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '20px' }}>
            Hangi palet ne zaman?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { tip: 'Kategorik', renk: '#1D9E75', bg: '#E1F5EE', kural: 'Grupları karşılaştırırken kullan. 7-10 kategoriden fazlasında renkler karışır — o noktada renk yerine şekil veya doku dene.' },
              { tip: 'Sıralı', renk: '#7F77DD', bg: '#EEEDFE', kural: 'Miktar veya yoğunluk gösterirken kullan. En açık = en az, en koyu = en fazla. Ters çevirme mantıklıysa çevirebilirsin.' },
              { tip: 'Ayrışık', renk: '#e8a04a', bg: '#FAEEDA', kural: 'Orta nokta önemliyse kullan: sıfır, hedef, ortalama. İki taraf iki farklı renk, ortası nötr olmalı.' },
              { tip: 'Renk körü dostu', renk: '#E24B4A', bg: '#FEE2E2', kural: 'Erkeklerin %8\'i kırmızı-yeşil renk körü. Sunum veya yayında Okabe-Ito/Wong seçmek iyi bir alışkanlık.' },
            ].map(({ tip, renk, bg, kural }) => (
              <div key={tip} className="card" style={{ padding: '18px', borderTop: `3px solid ${renk}` }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: renk, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tip}</div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.6, margin: 0 }}>{kural}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
