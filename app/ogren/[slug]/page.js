'use client';

import { useState } from 'react';
import { dersler } from '../../../lib/dersler';
import { useParams } from 'next/navigation';

function KodBlok({ kod }) {
  return (
    <pre style={{
      background: '#1a1815', color: '#f0ebe3',
      padding: '1rem', borderRadius: '8px',
      fontFamily: 'var(--font-mono)', fontSize: '13px',
      lineHeight: '1.65', overflowX: 'auto', margin: '1rem 0',
    }}>{kod}</pre>
  );
}

function OgretAdimi({ adim, onDevam }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="font-serif font-medium mb-3" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
          {adim.baslik}
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--color-text-soft)', marginBottom: '1rem' }}>
          {adim.aciklama}
        </p>
        <KodBlok kod={adim.kod} />
      </div>
      <button onClick={onDevam} style={{
        width: '100%', padding: '14px', borderRadius: '12px',
        border: 'none', background: '#1D9E75', color: '#fff',
        fontSize: '15px', fontWeight: 500, cursor: 'pointer',
      }}>
        Anladım, devam et →
      </button>
    </div>
  );
}

function CokSecAdimi({ adim, onDevam }) {
  const [secilen, setSecilen] = useState(null);
  const [kontrol, setKontrol] = useState(false);

  const sec = (idx) => { if (!kontrol) setSecilen(idx); };
  const kontrolEt = () => { if (secilen === null) return; setKontrol(true); };

  return (
    <div>
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-mute)' }}>
        Çoktan Seçmeli
      </div>
      <pre style={{
        background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
        padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)',
        fontSize: '14px', lineHeight: '1.6', marginBottom: '1.25rem',
        color: 'var(--color-text)', whiteSpace: 'pre-wrap',
      }}>{adim.soru}</pre>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
        {adim.secenekler.map((s, idx) => {
          let bg = 'var(--color-cream-card)', border = 'var(--color-border)', color = 'var(--color-text)';
          if (kontrol) {
            if (idx === adim.dogru) { bg = '#E1F5EE'; border = '#1D9E75'; color = '#0F6E56'; }
            else if (idx === secilen && secilen !== adim.dogru) { bg = '#FCEBEB'; border = '#E24B4A'; color = '#A32D2D'; }
          } else if (idx === secilen) { bg = '#E1F5EE'; border = '#1D9E75'; color = '#0F6E56'; }
          return (
            <button key={idx} onClick={() => sec(idx)} style={{
              padding: '12px 14px', borderRadius: '10px', border: `2px solid ${border}`,
              background: bg, color, cursor: kontrol ? 'default' : 'pointer',
              fontSize: '14px', textAlign: 'left', fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s', lineHeight: '1.4',
            }}>{s}</button>
          );
        })}
      </div>

      {kontrol && (
        <div style={{
          padding: '1rem', borderRadius: '10px', marginBottom: '1rem',
          background: secilen === adim.dogru ? '#E1F5EE' : '#FCEBEB',
          border: `1.5px solid ${secilen === adim.dogru ? '#1D9E75' : '#E24B4A'}`,
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', color: secilen === adim.dogru ? '#0F6E56' : '#A32D2D' }}>
            {secilen === adim.dogru ? '✅ Doğru!' : '❌ Yanlış'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.5' }}>{adim.aciklama}</div>
        </div>
      )}

      {!kontrol ? (
        <button onClick={kontrolEt} disabled={secilen === null} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: secilen === null ? 'var(--color-border)' : '#1D9E75',
          color: '#fff', fontSize: '15px', fontWeight: 500,
          cursor: secilen === null ? 'not-allowed' : 'pointer',
        }}>Kontrol et</button>
      ) : (
        <button onClick={onDevam} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: '#1D9E75', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
        }}>Devam et →</button>
      )}
    </div>
  );
}

function BoslukAdimi({ adim, onDevam }) {
  const [secilen, setSecilen] = useState(null);
  const [kontrol, setKontrol] = useState(false);

  return (
    <div>
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-mute)' }}>
        Boşluk Doldur
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '2',
        padding: '14px', background: 'var(--color-cream-card)',
        border: '0.5px solid var(--color-border)', borderRadius: '8px', marginBottom: '1rem',
      }}>
        <span style={{ color: 'var(--color-text)' }}>{adim.once}</span>
        <span style={{
          display: 'inline-block', borderBottom: `2px solid ${kontrol ? (secilen === adim.dogru ? '#1D9E75' : '#E24B4A') : '#1D9E75'}`,
          minWidth: '120px', padding: '2px 8px', margin: '0 4px',
          background: kontrol ? (secilen === adim.dogru ? '#E1F5EE' : '#FCEBEB') : '#E1F5EE',
          color: kontrol ? (secilen === adim.dogru ? '#0F6E56' : '#A32D2D') : '#0F6E56',
          borderRadius: '4px 4px 0 0', fontWeight: 500,
        }}>
          {secilen !== null ? adim.secenekler[secilen] : '___'}
        </span>
        <span style={{ color: 'var(--color-text)' }}>{adim.sonra}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {adim.secenekler.map((s, idx) => (
          <button key={idx} onClick={() => { if (!kontrol) setSecilen(idx); }}
            style={{
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              border: `1.5px solid ${secilen === idx ? '#1D9E75' : 'var(--color-border)'}`,
              background: secilen === idx ? '#E1F5EE' : 'var(--color-cream-card)',
              color: secilen === idx ? '#0F6E56' : 'var(--color-text)',
              cursor: kontrol ? 'default' : 'pointer',
              opacity: kontrol && secilen !== idx ? 0.4 : 1,
            }}>{s}</button>
        ))}
      </div>

      {kontrol && (
        <div style={{
          padding: '1rem', borderRadius: '10px', marginBottom: '1rem',
          background: secilen === adim.dogru ? '#E1F5EE' : '#FCEBEB',
          border: `1.5px solid ${secilen === adim.dogru ? '#1D9E75' : '#E24B4A'}`,
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', color: secilen === adim.dogru ? '#0F6E56' : '#A32D2D' }}>
            {secilen === adim.dogru ? '✅ Doğru!' : `❌ Doğru cevap: ${adim.secenekler[adim.dogru]}`}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.5' }}>{adim.aciklama}</div>
        </div>
      )}

      {!kontrol ? (
        <button onClick={() => { if (secilen !== null) setKontrol(true); }} disabled={secilen === null} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: secilen === null ? 'var(--color-border)' : '#1D9E75',
          color: '#fff', fontSize: '15px', fontWeight: 500,
          cursor: secilen === null ? 'not-allowed' : 'pointer',
        }}>Kontrol et</button>
      ) : (
        <button onClick={onDevam} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: '#1D9E75', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
        }}>Devam et →</button>
      )}
    </div>
  );
}

function SiralaAdimi({ adim, onDevam }) {
  const [sira, setSira] = useState([]);
  const [kontrol, setKontrol] = useState(false);

  const ekle = (idx) => { if (!kontrol && !sira.includes(idx)) setSira([...sira, idx]); };
  const cikar = (idx) => { if (!kontrol) setSira(sira.filter(i => i !== idx)); };

  const dogruMu = () => {
    if (sira.length !== adim.dogru_sira.length) return false;
    return sira.every((v, i) => v === adim.dogru_sira[i]);
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-mute)' }}>
        Kod Sırala
      </div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '1rem' }}>{adim.soru}</p>

      <div style={{
        minHeight: '52px', padding: '8px', marginBottom: '1rem',
        border: `1.5px dashed ${kontrol ? (dogruMu() ? '#1D9E75' : '#E24B4A') : 'var(--color-border)'}`,
        borderRadius: '8px', background: 'var(--color-cream-card)',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {sira.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', padding: '8px', textAlign: 'center' }}>
            Aşağıdan satırları sırayla tıkla
          </div>
        )}
        {sira.map((idx, pos) => (
          <button key={pos} onClick={() => cikar(idx)} style={{
            padding: '8px 12px', borderRadius: '6px', border: '0.5px solid var(--color-border)',
            background: '#E1F5EE', color: '#0F6E56', fontFamily: 'var(--font-mono)',
            fontSize: '12px', textAlign: 'left', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{adim.satirlar[idx]}</span>
            <span style={{ fontSize: '10px', opacity: 0.5 }}>× çıkar</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
        {adim.satirlar.map((s, idx) => (
          <button key={idx} onClick={() => ekle(idx)} disabled={sira.includes(idx) || kontrol} style={{
            padding: '8px 12px', borderRadius: '6px',
            border: `1.5px solid ${sira.includes(idx) ? 'transparent' : 'var(--color-border)'}`,
            background: sira.includes(idx) ? 'transparent' : 'var(--color-cream-card)',
            color: sira.includes(idx) ? 'transparent' : 'var(--color-text)',
            fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'left', cursor: 'pointer',
            opacity: sira.includes(idx) ? 0.2 : 1, transition: 'all 0.15s',
          }}>{s}</button>
        ))}
      </div>

      {kontrol && (
        <div style={{
          padding: '1rem', borderRadius: '10px', marginBottom: '1rem',
          background: dogruMu() ? '#E1F5EE' : '#FCEBEB',
          border: `1.5px solid ${dogruMu() ? '#1D9E75' : '#E24B4A'}`,
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', color: dogruMu() ? '#0F6E56' : '#A32D2D' }}>
            {dogruMu() ? '✅ Mükemmel!' : '❌ Sıra yanlış'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.5' }}>{adim.aciklama}</div>
        </div>
      )}

      {!kontrol ? (
        <button onClick={() => { if (sira.length === adim.satirlar.length) setKontrol(true); }}
          disabled={sira.length !== adim.satirlar.length} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: sira.length !== adim.satirlar.length ? 'var(--color-border)' : '#1D9E75',
            color: '#fff', fontSize: '15px', fontWeight: 500,
            cursor: sira.length !== adim.satirlar.length ? 'not-allowed' : 'pointer',
          }}>Kontrol et</button>
      ) : (
        <button onClick={onDevam} style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
          background: '#1D9E75', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
        }}>Devam et →</button>
      )}
    </div>
  );
}

export default function DersSayfasi() {
  const params = useParams();
  const ders = dersler.find(d => d.id === params.slug);
  const [adimIdx, setAdimIdx] = useState(0);
  const [bitti, setBitti] = useState(false);

  if (!ders) return <div style={{ padding: '4rem', textAlign: 'center' }}>Ders bulunamadı.</div>;

  const adim = ders.adimlar[adimIdx];
  const ilerleme = Math.round((adimIdx / ders.adimlar.length) * 100);

  const devam = () => {
    if (adimIdx + 1 >= ders.adimlar.length) { setBitti(true); return; }
    setAdimIdx(adimIdx + 1);
    window.scrollTo(0, 0);
  };

  if (bitti) {
    return (
      <main className="min-h-screen">
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div style={{ fontSize: '72px', marginBottom: '1rem' }}>🎉</div>
          <h1 className="font-serif text-3xl font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Ders tamamlandı!
          </h1>
          <p className="mb-8" style={{ color: 'var(--color-text-soft)', fontSize: '16px' }}>
            <strong>{ders.baslik}</strong> dersini başarıyla bitirdin.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 500, color: '#1D9E75' }}>+{ders.xp}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>XP kazandın</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 500, color: '#e8a04a' }}>🔥</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Seri devam ediyor</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="/ogren" style={{
              padding: '12px 24px', borderRadius: '10px', border: '0.5px solid var(--color-border)',
              background: 'var(--color-cream-card)', color: 'var(--color-text)',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            }}>← Ders yoluna dön</a>
            {dersler.findIndex(d => d.id === ders.id) < dersler.length - 1 && (
              <a href={`/ogren/${dersler[dersler.findIndex(d => d.id === ders.id) + 1].id}`} style={{
                padding: '12px 24px', borderRadius: '10px', border: 'none',
                background: '#1D9E75', color: '#fff',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              }}>Sonraki ders →</a>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <a href="/ogren" style={{ fontSize: '20px', textDecoration: 'none', color: 'var(--color-text-mute)' }}>←</a>
          <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ilerleme}%`, background: ders.renk, borderRadius: '999px', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>
            {adimIdx + 1} / {ders.adimlar.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {adim.tip === 'ogret' && <OgretAdimi adim={adim} onDevam={devam} />}
          {adim.tip === 'coktan_secmeli' && <CokSecAdimi adim={adim} onDevam={devam} />}
          {adim.tip === 'bosluk_doldur' && <BoslukAdimi adim={adim} onDevam={devam} />}
          {adim.tip === 'kod_sirala' && <SiralaAdimi adim={adim} onDevam={devam} />}
        </div>
      </div>
    </main>
  );
}
