'use client';

import { useEffect, useRef, useState } from 'react';
import { VERITABANLARI } from '../../lib/sqlVeritabanlari';

const TIP_RENKLERI = {
  INTEGER: { bg: '#E6F1FB', text: '#185FA5' },
  REAL: { bg: '#FAEEDA', text: '#854F0B' },
  TEXT: { bg: '#E1F5EE', text: '#0F6E56' },
  DATE: { bg: '#EEEDFE', text: '#534AB7' },
  BOOLEAN: { bg: '#FAECE7', text: '#993C1D' },
};

function TipBadge({ tip }) {
  const stil = TIP_RENKLERI[tip] || { bg: '#F1EFE8', text: '#5F5E5A' };
  return (
    <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: stil.bg, color: stil.text, fontWeight: 500, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
      {tip}
    </span>
  );
}

export default function SQLPlayground() {
  const [db, setDb] = useState(null);
  const [dbHazir, setDbHazir] = useState(false);
  const [dbYukleniyor, setDbYukleniyor] = useState(false);
  const [aktifDb, setAktifDb] = useState(VERITABANLARI[0]);
  const [sql, setSql] = useState(VERITABANLARI[0].ornekSorgular[0].sql);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState(null);
  const [sure, setSure] = useState(null);
  const [calistirilıyor, setCalistiriliyor] = useState(false);
  const [acikTablo, setAcikTablo] = useState(null);
  const sqlRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js';
    script.onload = () => setDbHazir(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!dbHazir) return;
    veritabaniYukle(aktifDb);
  }, [dbHazir, aktifDb]);

  const veritabaniYukle = async (vt) => {
    setDbYukleniyor(true);
    setSonuc(null);
    setHata(null);
    try {
      const SQL = await window.initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
      });
      const yeniDb = new SQL.Database();
      yeniDb.run(vt.sql);
      setDb(yeniDb);
    } catch (e) {
      setHata('Veritabanı yüklenemedi: ' + e.message);
    }
    setDbYukleniyor(false);
  };

  const sorguCalistir = () => {
    if (!db || !sql.trim()) return;
    setCalistiriliyor(true);
    setSonuc(null);
    setHata(null);
    const t0 = performance.now();
    try {
      const results = db.exec(sql);
      const ms = Math.round(performance.now() - t0);
      setSure(ms);
      if (results.length === 0) {
        setSonuc({ kolonlar: [], satirlar: [], mesaj: 'Sorgu başarıyla çalıştı. Sonuç döndürülmedi.' });
      } else {
        setSonuc({ kolonlar: results[0].columns, satirlar: results[0].values });
      }
    } catch (e) {
      setHata(e.message);
      setSure(Math.round(performance.now() - t0));
    }
    setCalistiriliyor(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); sorguCalistir(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const yeni = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
      setSql(yeni);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
  };

  const dbDegistir = (vt) => {
    setAktifDb(vt);
    setSql(vt.ornekSorgular[0].sql);
    setAcikTablo(null);
    setSonuc(null);
    setHata(null);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-3xl mb-8">
          <a href="/" className="text-xs mb-4 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
          <span className="badge badge-interactive inline-block mb-3">araç</span>
          <h1 className="font-serif text-4xl font-medium mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            SQL Playground
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-mute)' }}>
            Gerçek SQL motoru, hazır veritabanları, anında sonuç. Kurulum yok, hesap yok.
          </p>
        </div>

        {/* DB Seçici */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {VERITABANLARI.map(vt => (
            <button key={vt.id} onClick={() => dbDegistir(vt)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              border: `0.5px solid ${aktifDb.id === vt.id ? vt.renk : 'var(--color-border)'}`,
              background: aktifDb.id === vt.id ? vt.bg : 'var(--color-cream-card)',
              color: aktifDb.id === vt.id ? vt.renk_text || vt.renk : 'var(--color-text-soft)',
              cursor: 'pointer', fontSize: '14px', fontWeight: aktifDb.id === vt.id ? 500 : 400,
              transition: 'all .15s',
            }}>
              {vt.isim}
              <span style={{ fontSize: '11px', opacity: 0.7 }}>· {vt.tablolar.length} tablo</span>
            </button>
          ))}
          {dbYukleniyor && (
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)', alignSelf: 'center' }}>
              ⏳ Veritabanı yükleniyor...
            </span>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          alignItems: 'start',
        }}>

          {/* Sol panel — şema explorer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Şema */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>🗂 Şema Explorer</span>
              </div>
              <div>
                {aktifDb.tablolar.map((tablo) => {
                  const acik = acikTablo === tablo.isim;
                  return (
                    <div key={tablo.isim}>
                      <button onClick={() => setAcikTablo(acik ? null : tablo.isim)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 14px', border: 'none',
                        background: acik ? 'var(--color-cream)' : 'transparent',
                        borderBottom: '0.5px solid var(--color-border)',
                        cursor: 'pointer', textAlign: 'left', transition: 'background .1s',
                      }}>
                        <span style={{ fontSize: '13px' }}>{acik ? '▼' : '▶'}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: aktifDb.renk, flex: 1 }}>
                          {tablo.isim}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
                          {tablo.kolonlar.length} kolon
                        </span>
                      </button>

                      {acik && (
                        <div style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                          <div style={{ padding: '6px 14px', fontSize: '11px', color: 'var(--color-text-mute)', background: 'var(--color-cream)', borderBottom: '0.5px solid var(--color-border)' }}>
                            {tablo.aciklama}
                          </div>
                          {tablo.kolonlar.map((kolon, idx) => (
                            <div key={kolon.isim} style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '5px 14px',
                              borderBottom: idx < tablo.kolonlar.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                              background: idx % 2 === 0 ? 'transparent' : 'var(--color-cream)',
                            }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {kolon.ozellik.includes('PRIMARY KEY') ? '🔑 ' : kolon.ozellik.includes('FK') ? '🔗 ' : ''}
                                {kolon.isim}
                              </span>
                              <TipBadge tip={kolon.tip} />
                            </div>
                          ))}
                          {/* Tabloya tıkla sorgu ekle */}
                          <button onClick={() => setSql(`SELECT * FROM ${tablo.isim}\nLIMIT 20;`)} style={{
                            width: '100%', padding: '6px 14px', border: 'none',
                            background: 'var(--color-cream)', borderTop: '0.5px solid var(--color-border)',
                            cursor: 'pointer', fontSize: '11px', color: aktifDb.renk,
                            textAlign: 'left', fontWeight: 500,
                          }}>
                            → SELECT * FROM {tablo.isim}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Örnek sorgular */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>⚡ Örnek Sorgular</span>
              </div>
              <div>
                {aktifDb.ornekSorgular.map((sorgu, idx) => (
                  <button key={idx} onClick={() => setSql(sorgu.sql)} style={{
                    width: '100%', padding: '8px 14px', border: 'none',
                    borderBottom: idx < aktifDb.ornekSorgular.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                    background: sql === sorgu.sql ? aktifDb.bg : 'transparent',
                    cursor: 'pointer', textAlign: 'left', fontSize: '12px',
                    color: sql === sorgu.sql ? aktifDb.renk : 'var(--color-text-soft)',
                    fontWeight: sql === sorgu.sql ? 500 : 400,
                    transition: 'all .1s',
                  }}>
                    {sorgu.baslik}
                  </button>
                ))}
              </div>
            </div>

            {/* Hızlı referans */}
            <div className="card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>📚 SQL Referans</div>
              {[
                ['SELECT', 'Veri seç'],
                ['WHERE', 'Filtrele'],
                ['JOIN', 'Tablolar birleştir'],
                ['GROUP BY', 'Grupla'],
                ['ORDER BY', 'Sırala'],
                ['LIMIT', 'Satır sınırla'],
                ['HAVING', 'Grup filtrele'],
                ['DISTINCT', 'Tekrarsız getir'],
              ].map(([cmd, aciklama]) => (
                <div key={cmd} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid var(--color-border)', fontSize: '11px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: aktifDb.renk, fontWeight: 500 }}>{cmd}</span>
                  <span style={{ color: 'var(--color-text-mute)' }}>{aciklama}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ panel — editor + sonuç */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Editor */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>sorgu.sql</span>
                  <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', background: aktifDb.bg, color: aktifDb.renk, fontWeight: 500 }}>
                    {aktifDb.isim.replace(/^\S+\s/, '')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => { setSql(''); setSonuc(null); setHata(null); }} style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '6px',
                    border: '0.5px solid var(--color-border)', background: 'transparent',
                    cursor: 'pointer', color: 'var(--color-text-mute)',
                  }}>Temizle</button>
                  <button onClick={sorguCalistir} disabled={calistirilıyor || dbYukleniyor || !db} style={{
                    fontSize: '13px', fontWeight: 500, padding: '5px 18px',
                    borderRadius: '8px', border: 'none',
                    background: (!db || dbYukleniyor) ? 'var(--color-border)' : aktifDb.renk,
                    color: '#fff', cursor: (!db || dbYukleniyor) ? 'not-allowed' : 'pointer',
                  }}>
                    {calistirilıyor ? '⏳' : '▶ Çalıştır'}
                  </button>
                </div>
              </div>
              <textarea
                ref={sqlRef}
                value={sql}
                onChange={e => setSql(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                placeholder="SQL sorgunuzu buraya yazın..."
                style={{
                  width: '100%', minHeight: '160px', padding: '14px',
                  fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.7',
                  border: 'none', outline: 'none', resize: 'vertical',
                  background: 'var(--color-cream-card)', color: 'var(--color-text)',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ padding: '5px 14px', background: 'var(--color-cream)', borderTop: '0.5px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-mute)', display: 'flex', gap: '16px' }}>
                <span>Cmd+Enter ile çalıştır</span>
                <span>Tab ile girinti</span>
                <span>Şemadan tabloya tıklayarak hızlı sorgu ekle</span>
              </div>
            </div>

            {/* Sonuç */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>sonuç</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                  {sure !== null && (
                    <span style={{ color: 'var(--color-text-mute)' }}>{sure}ms</span>
                  )}
                  {sonuc && (
                    <span style={{ color: aktifDb.renk, fontWeight: 500 }}>
                      {sonuc.satirlar?.length || 0} satır · {sonuc.kolonlar?.length || 0} kolon
                    </span>
                  )}
                  {hata && <span style={{ color: '#E24B4A' }}>✗ Hata</span>}
                </div>
              </div>

              {/* Hata */}
              {hata && (
                <div style={{ padding: '16px', background: '#FCEBEB', borderBottom: '0.5px solid var(--color-border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#A32D2D', marginBottom: '4px' }}>SQL Hatası</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#A32D2D', margin: 0, whiteSpace: 'pre-wrap' }}>{hata}</pre>
                </div>
              )}

              {/* Başarı mesajı */}
              {sonuc?.mesaj && (
                <div style={{ padding: '16px', color: aktifDb.renk, fontSize: '13px' }}>
                  ✓ {sonuc.mesaj}
                </div>
              )}

              {/* Tablo */}
              {sonuc && sonuc.kolonlar.length > 0 && (
                <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                      <tr style={{ background: 'var(--color-cream)' }}>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-mute)', borderBottom: '0.5px solid var(--color-border)', fontWeight: 400, width: '40px', minWidth: '40px' }}>#</th>
                        {sonuc.kolonlar.map(kolon => (
                          <th key={kolon} style={{ padding: '6px 12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '12px', color: aktifDb.renk, borderBottom: '0.5px solid var(--color-border)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {kolon}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sonuc.satirlar.map((satir, idx) => (
                        <tr key={idx} style={{ borderBottom: '0.5px solid var(--color-border)', background: idx % 2 === 0 ? 'var(--color-cream-card)' : 'var(--color-cream)' }}>
                          <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-mute)' }}>{idx + 1}</td>
                          {satir.map((deger, dIdx) => (
                            <td key={dIdx} style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: deger === null ? 'var(--color-text-mute)' : 'var(--color-text)', whiteSpace: 'nowrap' }}>
                              {deger === null ? <span style={{ fontStyle: 'italic', color: 'var(--color-text-mute)' }}>NULL</span> : String(deger)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Boş durum */}
              {!sonuc && !hata && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '14px' }}>
                  ▶ Sorgu yazıp çalıştır, sonuçlar burada görünür
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
