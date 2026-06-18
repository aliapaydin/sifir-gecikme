'use client';

import { useState, useEffect } from 'react';

// ─── VERİ ────────────────────────────────────────────────────────────────────

const MUSTERILER = [
  { id: 1, isim: 'Ali Yılmaz',   sehir: 'İstanbul' },
  { id: 2, isim: 'Ayşe Kaya',    sehir: 'Ankara'   },
  { id: 3, isim: 'Mehmet Demir', sehir: 'İzmir'    },
  { id: 4, isim: 'Fatma Çelik',  sehir: 'Bursa'    },
  { id: 5, isim: 'Can Arslan',   sehir: 'Antalya'  },
];

const SIPARISLER = [
  { siparis_id: 101, musteri_id: 1, urun: 'Laptop',    tutar: 25000 },
  { siparis_id: 102, musteri_id: 2, urun: 'Telefon',   tutar: 18000 },
  { siparis_id: 103, musteri_id: 1, urun: 'Kulaklık',  tutar: 3500  },
  { siparis_id: 104, musteri_id: 3, urun: 'Tablet',    tutar: 12000 },
  { siparis_id: 105, musteri_id: 6, urun: 'Klavye',    tutar: 2000  },
  { siparis_id: 106, musteri_id: 2, urun: 'Mouse',     tutar: 1500  },
];

// Müşteri başına renk — eşleşen satırları aynı renkle boyamak için
const ROW_COLORS = {
  1: { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.35)',  text: '#818cf8', name: 'indigo'  },
  2: { bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.35)',  text: '#2dd4bf', name: 'teal'    },
  3: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)',  text: '#fbbf24', name: 'amber'   },
  4: { bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)',  text: '#34d399', name: 'green'   },
  5: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)', text: '#a78bfa', name: 'purple'  },
};
const NULL_STYLE = { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', text: '#64748b' };
const DIM_STYLE  = { opacity: 0.3 };

// ─── JOIN HESAPLAMALARI ───────────────────────────────────────────────────────

function computeJoin(type) {
  switch (type) {
    case 'INNER':
      return MUSTERILER.flatMap(m =>
        SIPARISLER.filter(s => s.musteri_id === m.id).map(s => ({ ...m, ...s, _cid: m.id, _type: 'match' }))
      );

    case 'LEFT':
      return MUSTERILER.flatMap(m => {
        const matches = SIPARISLER.filter(s => s.musteri_id === m.id);
        if (!matches.length) return [{ ...m, siparis_id: null, urun: null, tutar: null, musteri_id: null, _cid: m.id, _type: 'left_null' }];
        return matches.map(s => ({ ...m, ...s, _cid: m.id, _type: 'match' }));
      });

    case 'RIGHT':
      return SIPARISLER.flatMap(s => {
        const m = MUSTERILER.find(m => m.id === s.musteri_id);
        if (!m) return [{ id: null, isim: null, sehir: null, ...s, _cid: s.musteri_id, _type: 'right_null' }];
        return [{ ...m, ...s, _cid: m.id, _type: 'match' }];
      });

    case 'FULL': {
      const inner  = computeJoin('INNER');
      const leftOnly = MUSTERILER
        .filter(m => !SIPARISLER.some(s => s.musteri_id === m.id))
        .map(m => ({ ...m, siparis_id: null, urun: null, tutar: null, musteri_id: null, _cid: m.id, _type: 'left_null' }));
      const rightOnly = SIPARISLER
        .filter(s => !MUSTERILER.some(m => m.id === s.musteri_id))
        .map(s => ({ id: null, isim: null, sehir: null, ...s, _cid: s.musteri_id, _type: 'right_null' }));
      return [...inner, ...leftOnly, ...rightOnly];
    }

    case 'CROSS':
      return MUSTERILER.flatMap(m =>
        SIPARISLER.map(s => ({ ...m, ...s, _cid: m.id, _type: 'match' }))
      );

    default: return [];
  }
}

// ─── JOIN TANIMLARI ───────────────────────────────────────────────────────────

const JOINS = [
  {
    id: 'INNER',
    label: 'INNER JOIN',
    emoji: '🔵',
    renk: '#6366f1',
    tanim: 'Her iki tabloda da eşleşen satırları getirir. Eşleşme yoksa satır sonuca dahil edilmez.',
    sql: `SELECT m.id, m.isim, m.sehir,
       s.siparis_id, s.urun, s.tutar
FROM musteriler m
INNER JOIN siparisler s
  ON m.id = s.musteri_id;`,
    ne_zaman: 'Yalnızca her iki tabloda da karşılığı olan kayıtlar gerektiğinde. Örn: sipariş vermiş müşterileri listele.',
    dikkat: 'En az bir tarafta eşleşme yoksa o satır kaybolur — veri kaybı yaşanabilir.',
  },
  {
    id: 'LEFT',
    label: 'LEFT JOIN',
    emoji: '⬅️',
    renk: '#14b8a6',
    tanim: 'Sol tablodaki tüm satırları getirir. Sağ tabloda eşleşme yoksa NULL döner.',
    sql: `SELECT m.id, m.isim, m.sehir,
       s.siparis_id, s.urun, s.tutar
FROM musteriler m
LEFT JOIN siparisler s
  ON m.id = s.musteri_id;`,
    ne_zaman: 'Sol tablodaki tüm kayıtları korumak istediğinde. Örn: hiç sipariş vermemiş müşterileri de göster.',
    dikkat: 'En sık kullanılan JOIN tipi. NULL değerler için WHERE s.siparis_id IS NULL filtresini ekleyebilirsin.',
  },
  {
    id: 'RIGHT',
    label: 'RIGHT JOIN',
    emoji: '➡️',
    renk: '#f59e0b',
    tanim: 'Sağ tablodaki tüm satırları getirir. Sol tabloda eşleşme yoksa NULL döner. LEFT JOIN\'in aynası.',
    sql: `SELECT m.id, m.isim, m.sehir,
       s.siparis_id, s.urun, s.tutar
FROM musteriler m
RIGHT JOIN siparisler s
  ON m.id = s.musteri_id;`,
    ne_zaman: 'Sağ tablodaki tüm kayıtları korumak istediğinde. Örn: müşteri kaydı silinmiş siparişleri de göster.',
    dikkat: 'Pratikte RIGHT JOIN, tabloları yer değiştirip LEFT JOIN yazmak daha okunabilir olduğu için nadiren tercih edilir.',
  },
  {
    id: 'FULL',
    label: 'FULL OUTER JOIN',
    emoji: '🔄',
    renk: '#8b5cf6',
    tanim: 'Her iki tablodaki tüm satırları getirir. Eşleşme yoksa her iki yön için NULL döner.',
    sql: `SELECT m.id, m.isim, m.sehir,
       s.siparis_id, s.urun, s.tutar
FROM musteriler m
FULL OUTER JOIN siparisler s
  ON m.id = s.musteri_id;`,
    ne_zaman: 'Veri kalite kontrolü ve tutarsızlık tespiti için ideal. Örn: hangi müşterilerin siparişi yok, hangi siparişlerin müşterisi yok?',
    dikkat: 'MySQL FULL OUTER JOIN desteklemez — LEFT JOIN UNION RIGHT JOIN ile simüle edilir.',
  },
  {
    id: 'CROSS',
    label: 'CROSS JOIN',
    emoji: '✖️',
    renk: '#ef4444',
    tanim: 'Her satırı karşı tablonun tüm satırlarıyla çarpar. ON koşulu yoktur. n × m satır üretir.',
    sql: `SELECT m.id, m.isim,
       s.siparis_id, s.urun
FROM musteriler m
CROSS JOIN siparisler s;`,
    ne_zaman: 'Kartezyen çarpım gerektiğinde. Örn: olası tüm ürün-müşteri kombinasyonlarını listele.',
    dikkat: `Tehlikeli! ${MUSTERILER.length} × ${SIPARISLER.length} = ${MUSTERILER.length * SIPARISLER.length} satır üretir. Büyük tablolarda sistemi çökertebilir.`,
  },
];

// ─── VENN DİYAGRAMLARI ───────────────────────────────────────────────────────

function VennDiagram({ type }) {
  const configs = {
    INNER: { leftFill: 'none',            rightFill: 'none',           interFill: '#6366f1' },
    LEFT:  { leftFill: '#14b8a6',         rightFill: 'none',           interFill: '#14b8a6' },
    RIGHT: { leftFill: 'none',            rightFill: '#f59e0b',        interFill: '#f59e0b' },
    FULL:  { leftFill: '#8b5cf6',         rightFill: '#8b5cf6',        interFill: '#8b5cf6' },
    CROSS: { leftFill: '#ef444433',       rightFill: '#ef444433',      interFill: '#ef444466' },
  };
  const c = configs[type];
  return (
    <svg viewBox="0 0 100 60" style={{ width: '80px', height: '48px', flexShrink: 0 }}>
      <defs>
        <clipPath id={`left-${type}`}><circle cx="35" cy="30" r="22"/></clipPath>
        <clipPath id={`right-${type}`}><circle cx="65" cy="30" r="22"/></clipPath>
      </defs>
      <circle cx="35" cy="30" r="22" fill={c.leftFill || 'none'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fillOpacity="0.35"/>
      <circle cx="65" cy="30" r="22" fill={c.rightFill || 'none'} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fillOpacity="0.35"/>
      <circle cx="65" cy="30" r="22" fill={c.interFill} fillOpacity="0.55" clipPath={`url(#left-${type})`}/>
      <text x="28" y="55" fontSize="7" fill="rgba(255,255,255,0.6)" textAnchor="middle">M</text>
      <text x="72" y="55" fontSize="7" fill="rgba(255,255,255,0.6)" textAnchor="middle">S</text>
    </svg>
  );
}

// ─── NULL BADGE ───────────────────────────────────────────────────────────────

function Null() {
  return (
    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(100,116,139,0.15)', color: '#64748b', fontFamily: 'monospace' }}>
      NULL
    </span>
  );
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────

export default function SqlJoinGorsellestirici() {
  const [activeJoin, setActiveJoin] = useState('INNER');
  const [animKey, setAnimKey] = useState(0);
  const [showExplain, setShowExplain] = useState(null);

  const joinDef = JOINS.find(j => j.id === activeJoin);
  const result  = computeJoin(activeJoin);

  // Eşleşme durumlarını hesapla
  const matchedCids = new Set(
    activeJoin === 'CROSS' ? MUSTERILER.map(m => m.id) :
    result.filter(r => r._type === 'match').map(r => r._cid)
  );
  const leftNullCids = new Set(result.filter(r => r._type === 'left_null').map(r => r._cid));

  function selectJoin(id) {
    setActiveJoin(id);
    setAnimKey(k => k + 1);
  }

  const fmtTutar = v => v == null ? null : `₺${v.toLocaleString('tr-TR')}`;

  return (
    <main style={{ maxWidth: '920px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <style>{`
        .join-tab { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--color-border); background: var(--color-cream-card); color: var(--color-text-mute); transition: all .15s; white-space: nowrap; }
        .join-tab:hover { border-color: var(--color-border-light); color: var(--color-text); }
        .join-tab.active { color: #fff; }
        .result-row { animation: fadeSlide .25s ease both; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tbl th { padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--color-text-mute); border-bottom: 1px solid var(--color-border); }
        .tbl td { padding: 8px 12px; border-bottom: 1px solid var(--color-border); }
        .tbl tr:last-child td { border-bottom: none; }
        .code-block { background: var(--color-cream-card); border: 1px solid var(--color-border); border-radius: 10px; padding: 16px; font-family: monospace; font-size: 13px; color: var(--color-text); white-space: pre; overflow-x: auto; line-height: 1.6; }
        details summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        details summary::-webkit-details-marker { display: none; }
        @media (max-width: 640px) { .two-col { grid-template-columns: 1fr !important; } .join-tabs { flex-wrap: wrap !important; } }
      `}</style>

      {/* ─── BAŞLIK ─── */}
      <a href="/icerikler" style={{ fontSize: '13px', color: 'var(--color-text-mute)', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← İçerikler</a>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(20,184,166,0.1)', color: '#14b8a6', fontSize: '11px', fontWeight: 700, marginBottom: '12px', display: 'inline-block' }}>İNTERAKTİF</span>
        <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: 'var(--color-text)', margin: '8px 0 14px', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          SQL JOIN Türleri:<br />Görerek Öğren
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-mute)', lineHeight: 1.65, maxWidth: '600px', margin: 0 }}>
          INNER, LEFT, RIGHT, FULL OUTER ve CROSS JOIN — her tablo satırının nereye gittiğini, hangi satırların NULL döndüğünü renklerle izle. JOIN tipi değiştikçe sonuç tablosu anında güncelleniyor.
        </p>
      </div>

      {/* ─── VERİ TANITIMI ─── */}
      <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '16px', padding: '20px 24px', marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px' }}>📋 Örnek Veritabanı</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="two-col">
          {/* Müşteriler */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
              musteriler <span style={{ fontWeight: 400 }}>({MUSTERILER.length} satır)</span>
            </div>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
              <table className="tbl">
                <thead><tr><th>id</th><th>isim</th><th>şehir</th></tr></thead>
                <tbody>
                  {MUSTERILER.map(m => {
                    const c = ROW_COLORS[m.id];
                    return (
                      <tr key={m.id} style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}>
                        <td style={{ fontFamily: 'monospace', color: c.text, fontWeight: 700 }}>{m.id}</td>
                        <td style={{ color: 'var(--color-text)' }}>{m.isim}</td>
                        <td style={{ color: 'var(--color-text-mute)' }}>{m.sehir}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Siparişler */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
              siparisler <span style={{ fontWeight: 400 }}>({SIPARISLER.length} satır)</span>
            </div>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
              <table className="tbl">
                <thead><tr><th>sipariş_id</th><th>müşteri_id</th><th>ürün</th><th>tutar</th></tr></thead>
                <tbody>
                  {SIPARISLER.map(s => {
                    const c = ROW_COLORS[s.musteri_id] || NULL_STYLE;
                    return (
                      <tr key={s.siparis_id} style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>{s.siparis_id}</td>
                        <td style={{ fontFamily: 'monospace', color: c.text, fontWeight: 700 }}>{s.musteri_id}</td>
                        <td style={{ color: 'var(--color-text)' }}>{s.urun}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>₺{s.tutar.toLocaleString('tr-TR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-mute)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>🔑 <code style={{ background: 'var(--color-cream)', padding: '1px 5px', borderRadius: '4px' }}>musteriler.id</code> = birincil anahtar</span>
          <span>🔗 <code style={{ background: 'var(--color-cream)', padding: '1px 5px', borderRadius: '4px' }}>siparisler.musteri_id</code> = yabancı anahtar</span>
          <span style={{ color: '#f59e0b' }}>⚠ sipariş_id=105 — musteri_id=6 yok! (tutarsız veri)</span>
        </div>
      </div>

      {/* ─── JOIN SEÇİCİ ─── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }} className="join-tabs">
        {JOINS.map(j => (
          <button
            key={j.id}
            onClick={() => selectJoin(j.id)}
            className={`join-tab${activeJoin === j.id ? ' active' : ''}`}
            style={activeJoin === j.id ? { background: j.renk, borderColor: j.renk } : {}}
          >
            {j.emoji} {j.label}
          </button>
        ))}
      </div>

      {/* ─── JOIN AÇIKLAMASI ─── */}
      <div style={{ background: 'var(--color-cream-card)', border: `1.5px solid ${joinDef.renk}33`, borderRadius: '14px', padding: '18px 22px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <VennDiagram type={activeJoin} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: joinDef.renk, marginBottom: '4px' }}>{joinDef.emoji} {joinDef.label}</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', lineHeight: 1.6 }}>{joinDef.tanim}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span><span style={{ color: joinDef.renk, fontWeight: 700 }}>→</span> {result.length} satır sonuç</span>
            <span style={{ color: 'var(--color-text-faint)' }}>{MUSTERILER.length} × {SIPARISLER.length} max</span>
          </div>
        </div>
      </div>

      {/* ─── CANLI TABLO KARŞILAŞTIRMASI ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="two-col">
        {/* Sol: müşteriler */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
            ← Sol Tablo: musteriler
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
            <table className="tbl">
              <thead><tr><th>id</th><th>isim</th><th>şehir</th></tr></thead>
              <tbody>
                {MUSTERILER.map(m => {
                  const c = ROW_COLORS[m.id];
                  const isMatched  = matchedCids.has(m.id);
                  const isLeftNull = leftNullCids.has(m.id);
                  const isDimmed   = activeJoin === 'INNER' && !isMatched;
                  return (
                    <tr key={m.id} style={{
                      background: (isMatched || isLeftNull || activeJoin === 'CROSS' || activeJoin === 'FULL') ? c.bg : 'transparent',
                      borderLeft: `3px solid ${(isMatched || isLeftNull || activeJoin === 'LEFT' || activeJoin === 'FULL' || activeJoin === 'CROSS') ? c.border : 'transparent'}`,
                      opacity: isDimmed ? 0.3 : 1,
                      transition: 'opacity .3s, background .3s',
                    }}>
                      <td style={{ fontFamily: 'monospace', color: c.text, fontWeight: 700 }}>{m.id}</td>
                      <td style={{ color: 'var(--color-text)' }}>{m.isim}</td>
                      <td style={{ color: 'var(--color-text-mute)' }}>{m.sehir}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ: siparişler */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
            Sağ Tablo: siparisler →
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
            <table className="tbl">
              <thead><tr><th>sip.id</th><th>müş.id</th><th>ürün</th><th>tutar</th></tr></thead>
              <tbody>
                {SIPARISLER.map(s => {
                  const c = ROW_COLORS[s.musteri_id] || NULL_STYLE;
                  const isMatched = activeJoin === 'CROSS' ? true : matchedCids.has(s.musteri_id);
                  const hasRightNull = (activeJoin === 'RIGHT' || activeJoin === 'FULL') && !MUSTERILER.some(m => m.id === s.musteri_id);
                  const isDimmed = (activeJoin === 'INNER' || activeJoin === 'LEFT') && !isMatched;
                  return (
                    <tr key={s.siparis_id} style={{
                      background: isMatched || hasRightNull ? c.bg : 'transparent',
                      borderLeft: `3px solid ${isMatched || hasRightNull ? c.border : 'transparent'}`,
                      opacity: isDimmed ? 0.3 : 1,
                      transition: 'opacity .3s, background .3s',
                    }}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>{s.siparis_id}</td>
                      <td style={{ fontFamily: 'monospace', color: c.text, fontWeight: 700 }}>{s.musteri_id}</td>
                      <td style={{ color: 'var(--color-text)' }}>{s.urun}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>₺{s.tutar.toLocaleString('tr-TR')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ok göstergesi */}
      <div style={{ textAlign: 'center', fontSize: '22px', margin: '4px 0 16px', color: joinDef.renk }}>↓</div>

      {/* ─── SONUÇ TABLOSU ─── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
            Sonuç: {result.length} satır
          </div>
          {activeJoin === 'CROSS' && (
            <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
              ⚠ {MUSTERILER.length} × {SIPARISLER.length} = {MUSTERILER.length * SIPARISLER.length} satır — dikkatli kullan!
            </span>
          )}
        </div>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr style={{ background: 'var(--color-cream-card)' }}>
                <th>id</th><th>isim</th><th>şehir</th><th>sipariş_id</th><th>müşteri_id</th><th>ürün</th><th>tutar</th>
              </tr>
            </thead>
            <tbody key={animKey}>
              {result.map((row, i) => {
                const c = ROW_COLORS[row._cid] || NULL_STYLE;
                const isLeftNull  = row._type === 'left_null';
                const isRightNull = row._type === 'right_null';
                return (
                  <tr key={i} className="result-row"
                    style={{ animationDelay: `${i * 30}ms`, background: c.bg, borderLeft: `3px solid ${c.border}` }}>
                    <td style={{ fontFamily: 'monospace', color: c.text, fontWeight: 700 }}>
                      {row.id ?? <Null />}
                    </td>
                    <td style={{ color: 'var(--color-text)' }}>{row.isim ?? <Null />}</td>
                    <td style={{ color: 'var(--color-text-mute)' }}>{row.sehir ?? <Null />}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>
                      {row.siparis_id ?? <Null />}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: c.text }}>
                      {row.musteri_id ?? (isLeftNull ? <Null /> : row._cid)}
                    </td>
                    <td style={{ color: 'var(--color-text)' }}>{row.urun ?? <Null />}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>
                      {row.tutar != null ? `₺${row.tutar.toLocaleString('tr-TR')}` : <Null />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SQL SORGUSU ─── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>💻 SQL Sorgusu</div>
        <pre className="code-block">{joinDef.sql}</pre>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }} className="two-col">
          <div style={{ background: 'var(--color-correct-bg)', border: '0.5px solid var(--color-correct-border)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-correct-text)', marginBottom: '4px' }}>✓ Ne zaman kullanılır?</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.55 }}>{joinDef.ne_zaman}</div>
          </div>
          <div style={{ background: 'var(--color-amber-bg)', border: '0.5px solid rgba(251,191,36,0.3)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-amber-text)', marginBottom: '4px' }}>⚠ Dikkat</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.55 }}>{joinDef.dikkat}</div>
          </div>
        </div>
      </div>

      {/* ─── TÜM JOIN'LERİ KARŞILAŞTIR ─── */}
      <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '16px', padding: '20px 24px', marginBottom: '28px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px' }}>📊 Satır Sayısı Karşılaştırması</div>
        {JOINS.map(j => {
          const count = computeJoin(j.id).length;
          const max = MUSTERILER.length * SIPARISLER.length;
          const pct = Math.round(count / max * 100);
          return (
            <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => selectJoin(j.id)}>
              <div style={{ width: '130px', fontSize: '12px', fontWeight: activeJoin === j.id ? 700 : 500, color: activeJoin === j.id ? j.renk : 'var(--color-text-mute)', flexShrink: 0 }}>
                {j.emoji} {j.label}
              </div>
              <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: j.renk, borderRadius: '999px', transition: 'width .4s' }} />
              </div>
              <div style={{ width: '50px', textAlign: 'right', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: j.renk }}>{count} satır</div>
            </div>
          );
        })}
      </div>

      {/* ─── DETAYLI AÇIKLAMALAR ─── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px' }}>📚 Teknik Detaylar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              q: 'ON koşulu nasıl çalışır?',
              a: 'ON m.id = s.musteri_id ifadesi veritabanına "bu iki kolonu karşılaştır, eşit olanları eşleştir" der. Eşitlik kontrolü zorunlu değil — ON m.id < s.musteri_id gibi aralık koşulları da yazılabilir (çok nadir).',
            },
            {
              q: 'WHERE vs JOIN — fark ne?',
              a: 'JOIN, tabloları mantıksal olarak birleştirir. WHERE, bu birleşimden satır filtreler. LEFT JOIN yapıp WHERE s.id IS NOT NULL yazarsan sonuç INNER JOIN\'e eşdeğer olur — ama bu anti-pattern, kafa karıştırır.',
            },
            {
              q: 'Birden fazla JOIN zinciri nasıl yazılır?',
              a: 'FROM a JOIN b ON a.id=b.a_id JOIN c ON b.id=c.b_id şeklinde zincirlenir. Veritabanı optimizer sırayı kendisi belirler. İndeks yoksa büyük tablolarda yavaşlar.',
            },
            {
              q: 'Aynı tabloyu JOIN\'leyebilir miyim? (Self JOIN)',
              a: 'Evet! Örn: çalışan-yönetici ilişkisi tek tabloda tutuluyorsa FROM calisanlar c JOIN calisanlar m ON c.yonetici_id = m.id yazılır. Alias (c, m) zorunludur.',
            },
            {
              q: 'NULL olan satırları nasıl filtrelerim?',
              a: 'LEFT JOIN yapıp yalnızca eşleşmeyenleri görmek için WHERE s.siparis_id IS NULL ekle. "Hiç sipariş vermemiş müşteriler" sorgusu bu şekilde yazılır. NULL = NULL FALSE döner, IS NULL kullanmak zorundasın.',
            },
          ].map(({ q, a }) => (
            <details key={q} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px' }}>
              <summary style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                {q} <span style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>+</span>
              </summary>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '8px 0 0', lineHeight: 1.65 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── ÖZET TABLO ─── */}
      <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
          🗂 JOIN Hızlı Referans
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: '520px' }}>
            <thead>
              <tr style={{ background: 'var(--color-cream)' }}>
                <th>JOIN Türü</th><th>Sol Tablo</th><th>Sağ Tablo</th><th>Satır Sayısı</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['INNER JOIN', 'Sadece eşleşenler', 'Sadece eşleşenler', 'n ≤ min(sol,sağ) ... sol×sağ'],
                ['LEFT JOIN',  'Tümü',              'Eşleşenler + NULL', 'n ≥ sol satır'],
                ['RIGHT JOIN', 'Eşleşenler + NULL', 'Tümü',             'n ≥ sağ satır'],
                ['FULL OUTER', 'Tümü',              'Tümü',             'n ≥ max(sol,sağ)'],
                ['CROSS JOIN', 'Tümü',              'Tümü',             'n = sol × sağ'],
              ].map(([type, l, r, count]) => {
                const j = JOINS.find(j => j.label === type);
                return (
                  <tr key={type} style={{ cursor: 'pointer', transition: 'background .15s' }} onClick={() => j && selectJoin(j.id)}>
                    <td style={{ fontWeight: 700, color: j?.renk || 'var(--color-text)' }}>{j?.emoji} {type}</td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{l}</td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{r}</td>
                    <td style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text-mute)' }}>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
