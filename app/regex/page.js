'use client';
import { useState, useMemo, useEffect, useRef } from 'react';

// ─── ÖRÜNTÜ KÜTÜPHANESİ ────────────────────────────────────────────────────
const ORNEKLER = [
  {
    grup: 'İletişim',
    items: [
      { label: 'E-posta',         pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]{2,}',       flags: 'gi' },
      { label: 'Türk telefonu',   pattern: '(\\+90|0)[\\s-]?5\\d{2}[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}', flags: 'g' },
      { label: 'URL',             pattern: 'https?:\\/\\/[\\w.-]+(\\/[\\w./?=%&-]*)?', flags: 'gi' },
    ],
  },
  {
    grup: 'Tarih & Saat',
    items: [
      { label: 'Tarih GG.AA.YYYY', pattern: '\\d{2}\\.\\d{2}\\.\\d{4}',            flags: 'g' },
      { label: 'Tarih YYYY-AA-GG', pattern: '\\d{4}-\\d{2}-\\d{2}',                flags: 'g' },
      { label: 'Saat SS:DD',       pattern: '\\b([01]?\\d|2[0-3]):[0-5]\\d\\b',   flags: 'g' },
    ],
  },
  {
    grup: 'Sayı & Para',
    items: [
      { label: 'Ondalıklı sayı',  pattern: '-?\\d+([.,]\\d+)?',                    flags: 'g' },
      { label: 'Fiyat (TL)',      pattern: '\\d{1,3}(\\.\\d{3})*(,\\d{2})?\\s?TL', flags: 'g' },
      { label: 'TC Kimlik',       pattern: '\\b\\d{11}\\b',                         flags: 'g' },
      { label: 'IP Adresi',       pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',    flags: 'g' },
    ],
  },
  {
    grup: 'Metin',
    items: [
      { label: 'Büyük harf kelime', pattern: '\\b[A-ZÇĞİÖŞÜ][a-zçğışöü]+',        flags: 'g' },
      { label: 'Türkçe karakter',   pattern: '[çğışöüÇĞİŞÖÜ]+',                    flags: 'g' },
      { label: 'Kelime tekrarı',    pattern: '\\b(\\w+)\\s+\\1\\b',                flags: 'gi' },
      { label: 'HTML etiketi',      pattern: '<[^>]+>',                             flags: 'g' },
      { label: 'Boş satır',         pattern: '^\\s*$',                              flags: 'gm' },
    ],
  },
];

const CHEATSHEET = [
  { grup: 'Karakter Sınıfı', items: [
    { sem: '.', ac: 'Herhangi bir karakter (\\n hariç)' },
    { sem: '\\d', ac: 'Rakam [0-9]' },
    { sem: '\\D', ac: 'Rakam olmayan' },
    { sem: '\\w', ac: 'Kelime karakteri [a-zA-Z0-9_]' },
    { sem: '\\W', ac: 'Kelime dışı karakter' },
    { sem: '\\s', ac: 'Boşluk, tab, yeni satır' },
    { sem: '[abc]', ac: 'a, b veya c' },
    { sem: '[^abc]', ac: 'a, b, c dışında' },
    { sem: '[a-z]', ac: 'a\'dan z\'ye aralık' },
  ]},
  { grup: 'Niceleyici', items: [
    { sem: '*', ac: '0 veya daha fazla' },
    { sem: '+', ac: '1 veya daha fazla' },
    { sem: '?', ac: '0 veya 1 (isteğe bağlı)' },
    { sem: '{n}', ac: 'Tam olarak n kez' },
    { sem: '{n,m}', ac: 'n ile m arasında' },
    { sem: '*?', ac: 'Tembel — mümkün az eşleş' },
  ]},
  { grup: 'Çapa & Sınır', items: [
    { sem: '^', ac: 'Satır başı' },
    { sem: '$', ac: 'Satır sonu' },
    { sem: '\\b', ac: 'Kelime sınırı' },
    { sem: '\\B', ac: 'Kelime sınırı dışı' },
  ]},
  { grup: 'Grup', items: [
    { sem: '(abc)', ac: 'Yakalama grubu' },
    { sem: '(?:abc)', ac: 'Yakalamayan grup' },
    { sem: '(?<ad>abc)', ac: 'İsimli yakalama grubu' },
    { sem: 'a|b', ac: 'a veya b' },
    { sem: '(?=abc)', ac: 'Pozitif ileri bakış' },
    { sem: '(?!abc)', ac: 'Negatif ileri bakış' },
  ]},
];

const VARSAYILAN_METIN = `Merhaba! Ben Ali Apaydın, veri bilimcisiyim.
E-posta: ali@example.com ve ali.apaydin@gmail.com
Telefon: 0532 123 45 67 ve +90 212 555 00 11
Site: https://www.sifirgecikme.com/yazilar
Tarih: 15.03.2024 ve 2024-03-15, saat 09:30
TC Kimlik: 12345678901
Fiyat: 1.250,00 TL ve $99.99
IP: 192.168.1.1 ve 10.0.0.1
Bu bu tekrar eden kelime kelime örneği.
<div class="container"><p>HTML örneği</p></div>`;

// ─── EŞLEŞMELERİ HESAPLA ───────────────────────────────────────────────────
function hesaplaEslesmeler(pattern, flags, metin) {
  if (!pattern) return { segments: [{ text: metin, tip: 'normal' }], eslesmeler: [], hata: null };
  try {
    const flagStr = flags.join('') + (flags.includes('g') ? '' : 'g');
    const re = new RegExp(pattern, flagStr);
    const eslesmeler = [];
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(metin)) !== null) {
      eslesmeler.push({
        tam: m[0], baslangic: m.index, bitis: m.index + m[0].length,
        gruplar: m.slice(1),
        isimliGruplar: m.groups || {},
      });
      if (m[0].length === 0) re.lastIndex++;
      if (eslesmeler.length > 500) break;
    }

    // Segment'lere böl
    const segments = [];
    let cursor = 0;
    for (const e of eslesmeler) {
      if (cursor < e.baslangic) segments.push({ text: metin.slice(cursor, e.baslangic), tip: 'normal' });
      segments.push({ text: e.tam, tip: 'eslesti', gruplar: e.gruplar });
      cursor = e.bitis;
    }
    if (cursor < metin.length) segments.push({ text: metin.slice(cursor), tip: 'normal' });

    return { segments, eslesmeler, hata: null };
  } catch (e) {
    return { segments: [{ text: metin, tip: 'normal' }], eslesmeler: [], hata: e.message };
  }
}

// ─── FLAG TOGGLE ─────────────────────────────────────────────────────────────
const TUM_FLAGS = [
  { flag: 'g', label: 'g', aciklama: 'global — tüm eşleşmeleri bul' },
  { flag: 'i', label: 'i', aciklama: 'case insensitive — büyük/küçük harf fark etmez' },
  { flag: 'm', label: 'm', aciklama: 'multiline — ^ ve $ her satır için çalışır' },
  { flag: 's', label: 's', aciklama: 'dotAll — . yeni satırı da eşleştirir' },
];

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function RegexPlayground() {
  const [pattern, setPattern] = useState('[\\w.+-]+@[\\w-]+\\.[\\w.]{2,}');
  const [flags, setFlags] = useState(['g', 'i']);
  const [metin, setMetin] = useState(VARSAYILAN_METIN);
  const [cheatOpen, setCheatOpen] = useState(false);
  const [aktifGrup, setAktifGrup] = useState(null);
  const ilkRender = useRef(true);

  useEffect(() => {
    if (ilkRender.current) { ilkRender.current = false; return; }
    try {
      const prev = Number(localStorage.getItem('sz_regex_test') || 0);
      localStorage.setItem('sz_regex_test', String(prev + 1));
    } catch {}
  }, [pattern, flags]);

  const { segments, eslesmeler, hata } = useMemo(
    () => hesaplaEslesmeler(pattern, flags, metin),
    [pattern, flags, metin]
  );

  const toggleFlag = (f) => setFlags(prev =>
    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
  );

  const ornekSec = ({ pattern: p, flags: f }) => {
    setPattern(p);
    setFlags(f.split(''));
  };

  const grupRenkleri = ['#e8a04a', '#7F77DD', '#185FA5', '#E24B4A'];

  return (
    <main className="min-h-screen" style={{ paddingBottom: '60px' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Başlık */}
        <div style={{ paddingTop: '40px', paddingBottom: '24px', borderBottom: '0.5px solid var(--color-border)' }}>
          <a href="/" style={{ fontSize: '12px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>
            ← Ana sayfa
          </a>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 className="font-serif" style={{ fontSize: '28px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px' }}>
                Regex Playground
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
                Pattern yaz, metin üzerinde canlı eşleşmeleri gör
              </p>
            </div>
            <button onClick={() => setCheatOpen(v => !v)} style={{
              padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px',
              border: '0.5px solid var(--color-border)',
              background: cheatOpen ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
              color: cheatOpen ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            }}>
              {cheatOpen ? '✕ Kapat' : '📋 Cheatsheet'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cheatOpen ? '1fr 280px' : '1fr', gap: '20px', paddingTop: '24px' }}>

          {/* ─── ANA PANEL ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

            {/* Pattern girişi */}
            <div style={{
              background: 'var(--color-cream-card)', border: `1.5px solid ${hata ? '#dc2626' : pattern ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                <span style={{ fontSize: '18px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)', userSelect: 'none', flexShrink: 0 }}>/</span>
                <input
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  placeholder="regex pattern..."
                  style={{
                    flex: 1, padding: '12px 8px', fontSize: '15px',
                    fontFamily: 'var(--font-mono)', background: 'transparent',
                    border: 'none', outline: 'none', color: 'var(--color-text)',
                  }}
                />
                <span style={{ fontSize: '18px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)', userSelect: 'none', flexShrink: 0 }}>/</span>
                <div style={{ display: 'flex', gap: '4px', marginLeft: '8px', flexShrink: 0 }}>
                  {TUM_FLAGS.map(({ flag, label, aciklama }) => (
                    <button
                      key={flag}
                      onClick={() => toggleFlag(flag)}
                      title={aciklama}
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px', fontSize: '12px',
                        fontFamily: 'var(--font-mono)', fontWeight: 700, cursor: 'pointer',
                        border: '0.5px solid',
                        borderColor: flags.includes(flag) ? 'var(--color-accent)' : 'var(--color-border)',
                        background: flags.includes(flag) ? 'var(--color-accent-soft)' : 'transparent',
                        color: flags.includes(flag) ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                        transition: 'all 0.1s',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hata veya eşleşme sayısı */}
              <div style={{
                padding: '6px 14px', borderTop: '0.5px solid var(--color-border)',
                fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: hata ? 'rgba(220,38,38,0.06)' : 'transparent',
              }}>
                {hata ? (
                  <span style={{ color: '#dc2626' }}>⚠ {hata}</span>
                ) : (
                  <span style={{ color: eslesmeler.length > 0 ? '#1D9E75' : 'var(--color-text-mute)' }}>
                    {eslesmeler.length > 0 ? `✓ ${eslesmeler.length} eşleşme` : pattern ? '— eşleşme yok' : 'Pattern gir'}
                  </span>
                )}
                <span style={{ color: 'var(--color-text-mute)' }}>
                  {flags.join('')} &nbsp;·&nbsp; {metin.length} karakter
                </span>
              </div>
            </div>

            {/* İki kolon: metin + sonuç */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              {/* Test metni */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  TEST METNİ
                </div>
                <textarea
                  value={metin}
                  onChange={e => setMetin(e.target.value)}
                  style={{
                    width: '100%', minHeight: '320px',
                    padding: '12px 14px', fontSize: '13px', lineHeight: '1.7',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
                    borderRadius: '12px', outline: 'none', color: 'var(--color-text)',
                    resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Eşleşme önizlemesi */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  EŞLEŞME ÖNİZLEMESİ
                </div>
                <div style={{
                  minHeight: '320px', padding: '12px 14px',
                  fontSize: '13px', lineHeight: '1.7', fontFamily: 'var(--font-mono)',
                  background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
                  borderRadius: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  overflowY: 'auto', color: 'var(--color-text)',
                }}>
                  {segments.map((seg, i) =>
                    seg.tip === 'eslesti' ? (
                      <mark key={i} style={{
                        background: 'rgba(232,160,74,0.35)', color: 'inherit',
                        borderRadius: '3px', padding: '0 1px',
                        outline: '1.5px solid rgba(232,160,74,0.6)',
                      }}>
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Eşleşme listesi */}
            {eslesmeler.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  EŞLEŞMELERİN LİSTESİ ({eslesmeler.length})
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '4px',
                  maxHeight: '220px', overflowY: 'auto',
                  border: '0.5px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden',
                }}>
                  {eslesmeler.slice(0, 100).map((e, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '8px 14px',
                      borderBottom: i < Math.min(eslesmeler.length, 100) - 1 ? '0.5px solid var(--color-border)' : 'none',
                      background: i % 2 === 0 ? 'var(--color-cream-card)' : 'transparent',
                    }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-mute)', minWidth: '20px', paddingTop: '1px' }}>
                        {i + 1}
                      </span>
                      <code style={{ fontSize: '12.5px', color: 'var(--color-text)', background: 'rgba(232,160,74,0.2)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                        {e.tam || '(boş eşleşme)'}
                      </code>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>
                        [{e.baslangic}–{e.bitis}]
                      </span>
                      {e.gruplar.filter(Boolean).length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {e.gruplar.map((g, gi) => g != null && (
                            <span key={gi} style={{
                              fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
                              background: `${grupRenkleri[gi % grupRenkleri.length]}22`,
                              color: grupRenkleri[gi % grupRenkleri.length], fontFamily: 'var(--font-mono)',
                            }}>
                              _{gi + 1}: {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {eslesmeler.length > 100 && (
                    <div style={{ padding: '8px 14px', fontSize: '11px', color: 'var(--color-text-mute)', background: 'var(--color-cream-card)' }}>
                      … ve {eslesmeler.length - 100} tane daha
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Örnek Pattern Kütüphanesi */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                ÖRÜNTÜ KÜTÜPHANESİ
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ORNEKLER.map(({ grup, items }) => (
                  <div key={grup}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '6px' }}>{grup}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {items.map(item => (
                        <button key={item.label} onClick={() => ornekSec(item)} style={{
                          padding: '5px 12px', borderRadius: '8px', fontSize: '12px',
                          border: '0.5px solid var(--color-border)',
                          background: 'var(--color-cream-card)',
                          color: 'var(--color-text-soft)',
                          cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent-text)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ─── CHEATSHEET PANELİ ─── */}
          {cheatOpen && (
            <div style={{
              position: 'sticky', top: '80px', alignSelf: 'start',
              background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
              borderRadius: '14px', overflow: 'hidden',
              maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--color-border)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                📋 Regex Cheatsheet
              </div>
              {CHEATSHEET.map(({ grup, items }) => (
                <div key={grup} style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                  <div style={{ padding: '10px 16px 4px', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em' }}>
                    {grup.toUpperCase()}
                  </div>
                  {items.map(({ sem, ac }) => (
                    <div
                      key={sem}
                      onClick={() => setPattern(sem.replace(/\\\\/g, '\\'))}
                      style={{
                        display: 'flex', gap: '10px', alignItems: 'baseline',
                        padding: '5px 16px', cursor: 'pointer', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <code style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 600,
                        color: 'var(--color-accent)', minWidth: '80px', flexShrink: 0,
                      }}>
                        {sem}
                      </code>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-text-soft)', lineHeight: 1.5 }}>
                        {ac}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
